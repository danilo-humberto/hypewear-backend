import { Module } from '@nestjs/common';
import { PaymentService } from './payments.service';
import { PaymentController } from './payments.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [PaymentController],
    providers: [PaymentService],
    exports: [PaymentService], 
})
export class PaymentModule {}