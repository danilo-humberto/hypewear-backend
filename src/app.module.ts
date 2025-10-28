import { Module } from '@nestjs/common';
import { AddressModule } from './address/address.module';
import { CategoryModule } from './category/category.module';
import { ClientModule } from './client/client.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    AddressModule,
    ClientModule,
    CategoryModule,
    ProductModule,
    PrismaModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
