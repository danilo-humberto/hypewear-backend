import {
  Controller,
  Post,
  Patch,
  Body,
  Param,
  Get,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe
} from '@nestjs/common';
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
  confirmPayment(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentService.confirmPayment(id);
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  cancelPayment(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentService.cancelPayment(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentService.findOne(id);
  }

  @Get()
  findAll() {
    return this.paymentService.findAll();
  }
}