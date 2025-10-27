import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [CategoryModule, ProductModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
