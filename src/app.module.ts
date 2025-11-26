import { Module } from "@nestjs/common";
import { AddressModule } from "./address/address.module";
import { AuthModule } from "./auth/auth.module";
import { CartModule } from "./cart/cart.module";
import { CategoryModule } from "./category/category.module";
import { ClientModule } from "./client/client.module";
import { OrderModule } from "./order/order.module";
import { PaymentModule } from "./payments/payments.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ProductModule } from "./product/product.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    CartModule,
    AddressModule,
    ClientModule,
    CategoryModule,
    ProductModule,
    PrismaModule,
    OrderModule,
    AuthModule,
    PaymentModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
