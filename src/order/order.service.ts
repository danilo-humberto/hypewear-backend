import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { CartService } from "src/cart/cart.service";
import { OrderStatus } from "@prisma/client";

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService
  ) {}

  findAll() {
    return this.prisma.order.findMany({
      include: { items: { include: { product: true } }, client: true },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        client: true,
        payments: true,
      },
    });
    if (!order) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado.`);
    }
    return order;
  }

  findByClient(clientId: string) {
    return this.prisma.order.findMany({
      where: { clientId },
      include: {
        items: { include: { product: true } },
        client: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(createOrderDto: CreateOrderDto) {
    const { clientId } = createOrderDto;

    return this.prisma.$transaction(async (tx) => {
      const client = await tx.client.findUnique({ where: { id: clientId } });
      if (!client) {
        throw new NotFoundException(
          `Cliente com ID ${clientId} não encontrado.`
        );
      }

      const { orderItems, subtotal } =
        await this.cartService.prepareOrderFromCart(clientId);

      if (!orderItems || orderItems.length === 0) {
        throw new BadRequestException("O carrinho está vazio.");
      }

      const order = await tx.order.create({
        data: {
          clientId,
          status: OrderStatus.ABERTO,
          total: subtotal,
        },
      });

      await tx.orderItem.createMany({
        data: orderItems.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      });

      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            reserverd: {
              increment: item.quantity,
            },
          },
        });
      }

      const cart = await tx.cart.findUnique({ where: { clientId } });
      if (cart) {
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      }

      return tx.order.findUnique({
        where: { id: order.id },
        include: {
          items: { include: { product: true } },
          client: true,
          payments: true,
        },
      });
    });
  }
}
