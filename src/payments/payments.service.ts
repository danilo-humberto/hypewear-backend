import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payments.dto';
import {
  OrderStatus,
  PaymentStatusType,
  PaymentMethodType,
} from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.payment.findMany({
      include: { order: true },
    });
  }

  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { order: true },
    });
    if (!payment) {
      throw new NotFoundException(`Pagamento com ID ${id} não encontrado.`);
    }
    return payment;
  }

  async createPayment(createPaymentDto: CreatePaymentDto) {
    const { orderId, method, value } = createPaymentDto;

    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { payments: true },
      });

      if (!order) {
        throw new NotFoundException(`Pedido com ID ${orderId} não encontrado.`);
      }

      const activePayment = order.payments.find(
        (p) => p.status !== PaymentStatusType.CANCELADO,
      );

      if (activePayment) {
        throw new ConflictException(
          `O Pedido já possui um pagamento ${activePayment.status}.`,
        );
      }

      if (order.status !== OrderStatus.ABERTO) {
        throw new BadRequestException(
          `Pagamento só pode ser criado para pedidos em status ${OrderStatus.ABERTO}.`,
        );
      }

      const paymentValue = value || order.total;

      const newPayment = await tx.payment.create({
        data: {
          orderId,
          method: method as PaymentMethodType,
          value: paymentValue,
          status: PaymentStatusType.PENDENTE,
          date: new Date(),
        },
      });

      await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.AGUARDANDO_PAGAMENTO },
      });

      return newPayment;
    });
  }

  async confirmPayment(paymentId: string) {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id: paymentId },
        include: { order: { include: { items: true } } },
      });

      if (!payment) {
        throw new NotFoundException(
          `Pagamento com ID ${paymentId} não encontrado.`,
        );
      }

      const order = payment.order;

      if (payment.status !== PaymentStatusType.PENDENTE) {
        throw new BadRequestException(`Pagamento já está ${payment.status}.`);
      }

      const stockUpdates = order.items.map((item) =>
        tx.product.update({
          where: { id: item.productId },
          data: {
            estoque: { decrement: item.quantity },
          },
        }),
      );
      await Promise.all(stockUpdates);

      await tx.payment.update({
        where: { id: paymentId },
        data: { status: PaymentStatusType.PAGO },
      });

      return tx.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.PAGO },
        include: { payments: true },
      });
    });
  }

  async cancelPayment(paymentId: string) {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id: paymentId },
        include: { order: true },
      });

      if (!payment) {
        throw new NotFoundException(
          `Pagamento com ID ${paymentId} não encontrado.`,
        );
      }
      if (payment.status === PaymentStatusType.PAGO) {
        throw new BadRequestException(
          'Não é possível cancelar um pagamento já efetuado.',
        );
      }
      if (payment.status === PaymentStatusType.CANCELADO) {
        return payment; 
      }

      await tx.payment.update({
        where: { id: paymentId },
        data: { status: PaymentStatusType.CANCELADO },
      });

      return tx.order.update({
        where: { id: payment.orderId },
        data: { status: OrderStatus.ABERTO },
        include: { payments: true },
      });
    });
  }
}