import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Get('client/:clientId')
  findByClient(@Param('clientId') clientId: string) {
    return this.orderService.findByClient(clientId);
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Post(':id/confirm-payment')
  confirmPayment(@Param('id') id: string) {
    return this.orderService.confirmPayment(id);
  }
}
