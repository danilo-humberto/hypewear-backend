import {
  Controller,
  Post,
  Patch,
  Body,
  Param,
  Get,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
} from "@nestjs/common";
import { PaymentService } from "./payments.service";
import { CreatePaymentDto } from "./dto/create-payments.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("payments")
@ApiTags("payments")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles("ADMIN", "USER")
  @ApiOperation({ summary: "Criar um pagamento para um pedido existente" })
  @ApiResponse({
    status: 201,
    description:
      "Pagamento criado com sucesso e pedido atualizado para AGUARDANDO_PAGAMENTO.",
  })
  createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.createPayment(createPaymentDto);
  }

  @Patch(":id/confirm")
  @HttpCode(HttpStatus.OK)
  @Roles("ADMIN")
  @ApiOperation({ summary: "Confirmar um pagamento pendente" })
  @ApiResponse({
    status: 200,
    description:
      "Pagamento confirmado, estoque debitado e pedido atualizado para PAGO.",
  })
  confirmPayment(@Param("id", ParseUUIDPipe) id: string) {
    return this.paymentService.confirmPayment(id);
  }

  @Patch(":id/cancel")
  @HttpCode(HttpStatus.OK)
  @Roles("USER", "ADMIN")
  @ApiOperation({ summary: "Cancelar um pagamento pendente" })
  @ApiResponse({
    status: 200,
    description:
      "Pagamento cancelado, estoque reservado liberado e pedido retornado para ABERTO.",
  })
  cancelPayment(@Param("id", ParseUUIDPipe) id: string) {
    return this.paymentService.cancelPayment(id);
  }

  @Get(":id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Buscar um pagamento pelo ID" })
  @ApiResponse({
    status: 200,
    description: "Pagamento retornado com sucesso.",
  })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.paymentService.findOne(id);
  }

  @Get()
  @Roles("ADMIN")
  @ApiOperation({ summary: "Listar todos os pagamentos" })
  @ApiResponse({
    status: 200,
    description: "Lista de pagamentos retornada com sucesso.",
  })
  findAll() {
    return this.paymentService.findAll();
  }
}
