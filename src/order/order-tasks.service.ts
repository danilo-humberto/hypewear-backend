import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { OrderStatus, PaymentStatusType } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class OrderTasksService {
  private readonly logger = new Logger(OrderTasksService.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async cancelExpiredPendingOrders() {
    const now = new Date();
    const cutoff = new Date(now.getTime() - 30 * 60 * 1000); // 30 minutos atrás

    const pendindOrders = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.AGUARDANDO_PAGAMENTO,
        updatedAt: { lt: cutoff },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });

    if (!pendindOrders.length) {
      return;
    }

    this.logger.log(
      `Encontrados ${pendindOrders.length} pedidos aguardando pagamento há mais de 30 minutos. Cancelando...`
    );

    for (const order of pendindOrders) {
      await this.prisma.$transaction(async (tx) => {
        const payment = order.payments;
        if (payment && payment.status === PaymentStatusType.PENDENTE) {
          await tx.payment.update({
            where: { id: payment.id },
            data: { status: PaymentStatusType.CANCELADO },
          });
        }

        for (const item of order.items) {
          const product = item.product;
          if (!product) continue;

          const decrementQntd =
            product.reserverd >= item.quantity
              ? item.quantity
              : product.reserverd;

          if (decrementQntd > 0) {
            await tx.product.update({
              where: { id: product.id },
              data: { reserverd: { decrement: decrementQntd } },
            });
          }
        }

        await tx.order.update({
          where: { id: order.id },
          data: { status: OrderStatus.CANCELADO },
        });
      });

      this.logger.log(
        `Pedido ${order.id} cancelado automaticamente por expirar o tempo de pagamento.`
      );
    }
  }
}
