import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { ClientService } from "./client.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";
import { GetUser } from "src/auth/get-user.decorator";

@ApiTags("Clients")
@Controller("clients")
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiOperation({ summary: "Criar um novo cliente" })
  @ApiResponse({
    status: 201,
    description: "Cliente criado com sucesso.",
  })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @Get("me")
  @ApiOperation({ summary: "Retorna os dados do usuário logado" })
  @ApiResponse({
    status: 200,
    description: "Dados do usuário logado",
  })
  findMe(@GetUser() user) {
    return this.clientService.findMe(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @Patch("me")
  @ApiOperation({ summary: "Atualiza os dados do usuário logado" })
  @ApiResponse({
    status: 200,
    description: "Dados atualizados com sucesso",
  })
  updateMe(@GetUser() user, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(user.id, updateClientDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Get()
  @ApiOperation({ summary: "Listar todos os clientes" })
  @ApiResponse({
    status: 200,
    description: "Lista de clientes retornada com sucesso.",
  })
  findAll() {
    return this.clientService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @Get(":id")
  @ApiOperation({ summary: "Buscar um cliente pelo ID (ADMIN)" })
  @ApiResponse({
    status: 200,
    description: "Cliente encontrado com sucesso.",
  })
  @ApiResponse({
    status: 404,
    description: "Cliente não encontrado.",
  })
  findOne(@Param("id") id: string) {
    return this.clientService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @Patch(":id")
  @ApiOperation({ summary: "Atualizar um cliente (ADMIN)" })
  @ApiResponse({
    status: 200,
    description: "Cliente atualizado com sucesso.",
  })
  update(@Param("id") id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(id, updateClientDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @Delete(":id")
  @ApiOperation({ summary: "Remover um cliente (ADMIN)" })
  @ApiResponse({
    status: 200,
    description: "Cliente removido com sucesso.",
  })
  remove(@Param("id") id: string) {
    return this.clientService.remove(id);
  }
}
