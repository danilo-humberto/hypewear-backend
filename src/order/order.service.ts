import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.order.findMany({
      include: { items: { include: { product: true } }, client: true },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, client: true },
    });
    if (!order) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado.`);
    }
    return order;
  }

  findByClient(clientId: string) {
    return this.prisma.order.findMany({
      where: { clientId },
      include: { items: { include: { product: true } }, client: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(createOrderDto: CreateOrderDto) {
    const { clientId, items } = createOrderDto;

    return this.prisma.$transaction(async (tx) => {
      const client = await tx.client.findUnique({ where: { id: clientId } });
      if (!client) {
        throw new NotFoundException(
          `Cliente com ID ${clientId} não encontrado.`,
        );
      }

      let totalOrderPrice = 0;
      let totalOrderQuantity = 0;

      const productChecks = items.map(async (item) => {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(
            `Produto com ID ${item.productId} não encontrado.`,
          );
        }
        if (product.estoque < item.quantity) {
          throw new BadRequestException(
            `Estoque insuficiente para o produto: ${product.name}.`,
          );
        }

        totalOrderPrice += product.price * item.quantity;
        totalOrderQuantity += item.quantity;

        return {
          ...item,
          price: product.price,
        };
      });

      const processedItems = await Promise.all(productChecks);

      const order = await tx.order.create({
        data: {
          clientId: clientId,
          status: OrderStatus.ABERTO,
          total: totalOrderPrice,
          subtotal: totalOrderPrice,
          totalQuantity: totalOrderQuantity,
        },
      });

      await tx.orderItem.createMany({
        data: processedItems.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity,
        })),
      });

      return tx.order.findUnique({
        where: { id: order.id },
        include: { items: true },
      });
    });
  }

  async confirmPayment(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!order) {
        throw new NotFoundException(`Pedido com ID ${id} não encontrado.`);
      }

      if (
        order.status === OrderStatus.PAGO ||
        order.status === OrderStatus.CANCELADO
      ) {
        throw new BadRequestException(
          `O pedido já está ${order.status} e não pode ser alterado.`,
        );
      }

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            estoque: {
              decrement: item.quantity,
            },
          },
        });
      }

      const updatedOrder = await tx.order.update({
        where: { id },
        data: { status: OrderStatus.PAGO },
      });

      return updatedOrder;
    });
  }
}
