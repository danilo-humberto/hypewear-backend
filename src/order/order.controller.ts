import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  ParseIntPipe,
  ParseUUIDPipe,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller("orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ApiOperation({ summary: "Listar todos os pedidos" })
  @ApiResponse({
    status: 200,
    description: "Lista de pedidos retornada com sucesso.",
  })
  findAll() {
    return this.orderService.findAll();
  }

  @Get("client/:clientId")
  @ApiOperation({ summary: "Listar pedidos de um cliente específico" })
  @ApiResponse({ status: 200, description: "Pedidos retornados com sucesso." })
  findByClient(@Param("clientId", new ParseUUIDPipe()) clientId: string) {
    return this.orderService.findByClient(clientId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Buscar um pedido pelo ID" })
  @ApiResponse({ status: 200, description: "Pedido encontrado." })
  @ApiResponse({ status: 404, description: "Pedido não encontrado." })
  findOne(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.orderService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Criar um pedido a partir do carrinho" })
  @ApiResponse({ status: 201, description: "Pedido criado com sucesso." })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }
}
