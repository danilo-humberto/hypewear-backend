import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFloatPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductService } from "./product.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";

@ApiTags("Products")
@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: "Criar um novo produto (ADMIN)" })
  @ApiResponse({
    status: 201,
    description: "Produto criado com sucesso.",
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: "Listar produtos com filtros opcionais" })
  @ApiQuery({
    name: "name",
    required: false,
    description: "Filtrar por nome do produto",
  })
  @ApiQuery({
    name: "nameCategory",
    required: false,
    description: "Filtrar por nome da categoria",
  })
  @ApiQuery({
    name: "precoMin",
    required: false,
    description: "Filtrar por preço mínimo",
    type: Number,
  })
  @ApiQuery({
    name: "precoMax",
    required: false,
    description: "Filtrar por preço máximo",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Lista de produtos retornada com sucesso.",
  })
  findAll(
    @Query("name") name?: string,
    @Query("nameCategory") nameCategory?: string,
    @Query("precoMin", new ParseFloatPipe({ optional: true }))
    precoMin?: number,
    @Query("precoMax", new ParseFloatPipe({ optional: true })) precoMax?: number
  ) {
    return this.productService.findAll({
      name,
      nameCategory,
      precoMin: precoMin,
      precoMax: precoMax,
    });
  }

  @Get(":id")
  @ApiOperation({ summary: "Buscar um produto pelo ID" })
  @ApiResponse({
    status: 200,
    description: "Produto encontrado com sucesso.",
  })
  @ApiResponse({
    status: 404,
    description: "Produto não encontrado.",
  })
  findOne(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.productService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @Patch(":id")
  @ApiOperation({ summary: "Atualizar um produto (ADMIN)" })
  @ApiResponse({
    status: 200,
    description: "Produto atualizado com sucesso.",
  })
  update(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @Delete(":id")
  @ApiOperation({ summary: "Remover um produto (ADMIN)" })
  @ApiResponse({
    status: 200,
    description: "Produto removido com sucesso.",
  })
  remove(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.productService.remove(id);
  }
}
