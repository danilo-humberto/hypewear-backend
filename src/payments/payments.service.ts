import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePaymentDto } from "./dto/create-payments.dto";
import {
  OrderStatus,
  PaymentStatusType,
  PaymentMethodType,
} from "@prisma/client";

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
    const { orderId, method } = createPaymentDto;

    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { payments: true },
      });

      if (!order) {
        throw new NotFoundException(`Pedido com ID ${orderId} não encontrado.`);
      }

      const existingPayment = order.payments;

      if (
        existingPayment &&
        existingPayment.status !== PaymentStatusType.CANCELADO
      ) {
        throw new ConflictException(
          `Já existe um pagamento associado com status ${existingPayment.status} ao pedido com ID ${orderId}.`
        );
      }

      if (order.status !== OrderStatus.ABERTO) {
        throw new BadRequestException(
          `Não é possível criar um pagamento para um pedido com status ${order.status}.`
        );
      }

      const newPayment = await tx.payment.create({
        data: {
          orderId,
          method: method as PaymentMethodType,
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
        include: {
          order: { include: { items: { include: { product: true } } } },
        },
      });

      if (!payment) {
        throw new NotFoundException(
          `Pagamento com ID ${paymentId} não encontrado.`
        );
      }

      const order = payment.order;

      if (!order)
        throw new NotFoundException(
          `Pedido associado ao pagamento ${paymentId} não encontrado.`
        );

      if (payment.status !== PaymentStatusType.PENDENTE) {
        throw new BadRequestException(`Pagamento já está ${payment.status}.`);
      }

      if (order.status !== OrderStatus.AGUARDANDO_PAGAMENTO) {
        throw new BadRequestException(
          `Não é possível confirmar pagamento de pedido em status ${order.status}.`
        );
      }

      for (const item of order.items) {
        const product = item.product;
        if (!product) {
          throw new NotFoundException(
            `Produto ${item.productId} associado ao pedido ${order.id} nao encontrado.`
          );
        }

        if (product.reserverd < item.quantity) {
          throw new ConflictException(
            `Reserva insuficiente para o produto ${product.name}.`
          );
        }

        await tx.product.update({
          where: { id: product.id },
          data: {
            estoque: {
              decrement: item.quantity,
            },
            reserverd: {
              decrement: item.quantity,
            },
          },
        });
      }

      await tx.payment.update({
        where: { id: paymentId },
        data: { status: PaymentStatusType.PAGO },
      });

      return tx.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.PAGO },
        include: {
          payments: true,
          items: { include: { product: true } },
        },
      });
    });
  }

  async cancelPayment(paymentId: string) {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id: paymentId },
        include: {
          order: { include: { items: { include: { product: true } } } },
        },
      });

      if (!payment) {
        throw new NotFoundException(
          `Pagamento com ID ${paymentId} não encontrado.`
        );
      }

      const order = payment.order;

      if (!order)
        throw new NotFoundException(
          `Pedido associado ao pagamento ${paymentId} nao encontrado.`
        );

      if (payment.status === PaymentStatusType.PAGO) {
        throw new BadRequestException(
          "Não é possível cancelar um pagamento já efetuado."
        );
      }
      if (payment.status === PaymentStatusType.CANCELADO) {
        return payment;
      }

      if (payment.order.status !== OrderStatus.AGUARDANDO_PAGAMENTO) {
        throw new BadRequestException(
          `Não é possível cancelar pagamento de pedido em status ${payment.order.status}.`
        );
      }

      for (const item of payment.order.items) {
        const product = item.product;
        if (!product) {
          throw new NotFoundException(
            `Produto ${item.productId} associado ao pedido ${payment.order.id} nao encontrado.`
          );
        }

        if (product.reserverd < item.quantity) {
          throw new ConflictException(
            `Reserva insuficiente para o produto ${product.name}.`
          );
        }

        await tx.product.update({
          where: { id: product.id },
          data: {
            reserverd: {
              decrement: item.quantity,
            },
          },
        });
      }

      await tx.payment.update({
        where: { id: paymentId },
        data: { status: PaymentStatusType.CANCELADO },
      });

      return tx.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.ABERTO },
        include: {
          payments: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    });
  }
}
