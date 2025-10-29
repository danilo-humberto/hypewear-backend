import { Controller, Post, Patch, Body,Param, Get, HttpCode, HttpStatus, UseGuards} from '@nestjs/common';
import { PaymentService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payments.dto';

@Controller('payments')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    createPayment(@Body() createPaymentDto: CreatePaymentDto) {
        return this.paymentService.createPayment(createPaymentDto);
    }

    @Patch(':id/confirm')
    @HttpCode(HttpStatus.OK)
    confirmPayment(@Param('id') id: string) {
        const paymentId = parseInt(id, 10); 
        return this.paymentService.confirmPayment(paymentId);
    }
    
    @Patch(':id/cancel')
    @HttpCode(HttpStatus.OK)
    cancelPayment(@Param('id') id: string) {
        const paymentId = parseInt(id, 10); 
        return this.paymentService.cancelPayment(paymentId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        const paymentId = parseInt(id, 10);
        return this.paymentService.findOne(paymentId);
    }

    @Get()
    findAll() {
        return this.paymentService.findAll();
    }
}