import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
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
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";

@ApiTags("Categories")
@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: "Criar uma nova categoria (ADMIN)" })
  @ApiResponse({
    status: 201,
    description: "Categoria criada com sucesso.",
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: "Listar todas as categorias" })
  @ApiResponse({
    status: 200,
    description: "Lista de categorias retornada com sucesso.",
  })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Buscar uma categoria pelo ID" })
  @ApiResponse({
    status: 200,
    description: "Categoria encontrada com sucesso.",
  })
  @ApiResponse({
    status: 404,
    description: "Categoria não encontrada.",
  })
  findOne(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.categoryService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @Patch(":id")
  @ApiOperation({ summary: "Atualizar uma categoria (ADMIN)" })
  @ApiResponse({
    status: 200,
    description: "Categoria atualizada com sucesso.",
  })
  update(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  @Delete(":id")
  @ApiOperation({ summary: "Remover uma categoria (ADMIN)" })
  @ApiResponse({
    status: 200,
    description: "Categoria removida com sucesso.",
  })
  remove(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.categoryService.remove(id);
  }
}
