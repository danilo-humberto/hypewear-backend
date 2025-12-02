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
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";
import { AddressService } from "./address.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@ApiTags("Addresses")
@Controller("address")
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @ApiOperation({ summary: "Criar um novo endereço" })
  @ApiResponse({
    status: 201,
    description: "Endereço criado com sucesso.",
  })
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(createAddressDto);
  }

  @Get()
  @ApiOperation({ summary: "Listar todos os endereços" })
  @ApiResponse({
    status: 200,
    description: "Lista de endereços retornada com sucesso.",
  })
  findAll() {
    return this.addressService.findAll();
  }

  @Get("client/:id")
  @ApiOperation({ summary: "Listar endereços de um cliente específico" })
  @ApiResponse({
    status: 200,
    description: "Endereços do cliente retornados com sucesso.",
  })
  findByClient(@Param("id") id: string) {
    return this.addressService.findByClient(id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Buscar um endereço pelo ID" })
  @ApiResponse({
    status: 200,
    description: "Endereço encontrado com sucesso.",
  })
  @ApiResponse({
    status: 404,
    description: "Endereço não encontrado.",
  })
  findOne(@Param("id") id: string) {
    return this.addressService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualizar um endereço existente" })
  @ApiResponse({
    status: 200,
    description: "Endereço atualizado com sucesso.",
  })
  update(@Param("id") id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(id, updateAddressDto);
  }

  @Patch(":id/default")
  @ApiOperation({ summary: "Definir um endereço como padrão" })
  @ApiResponse({
    status: 200,
    description: "Endereço definido como padrão com sucesso.",
  })
  putDefault(@Param("id") id: string) {
    return this.addressService.putDefault(id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Remover um endereço" })
  @ApiResponse({
    status: 200,
    description: "Endereço removido com sucesso.",
  })
  remove(@Param("id") id: string) {
    return this.addressService.remove(id);
  }
}
