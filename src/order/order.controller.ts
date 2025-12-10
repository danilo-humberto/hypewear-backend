import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  ParseIntPipe,
  ParseUUIDPipe,
  UseGuards,
  Req,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";

@Controller("orders")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags("orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ApiOperation({ summary: "Listar todos os pedidos" })
  @ApiResponse({
    status: 200,
    description: "Lista de pedidos retornada com sucesso.",
  })
  @Roles("ADMIN")
  findAll() {
    return this.orderService.findAll();
  }

  @Get("client/:clientId")
  @ApiOperation({ summary: "Listar pedidos de um cliente específico" })
  @ApiResponse({ status: 200, description: "Pedidos retornados com sucesso." })
  findByClient(@Param("clientId", new ParseUUIDPipe()) clientId: string) {
    return this.orderService.findByClient(clientId);
  }

  @Roles("ADMIN", "USER")
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
  @Roles("USER", "ADMIN")
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }
}
