import { Module } from "@nestjs/common";
import { CartModule } from "src/cart/cart.module";
import { PrismaService } from "src/prisma/prisma.service";
import { OrderTasksService } from "./order-tasks.service";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";

@Module({
  imports: [CartModule],
  controllers: [OrderController],
  providers: [OrderTasksService, OrderService, PrismaService],
})
export class OrderModule {}
