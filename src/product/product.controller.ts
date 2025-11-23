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
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductService } from "./product.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";

@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
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
  findOne(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.productService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Patch(":id")
  update(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Delete(":id")
  remove(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.productService.remove(id);
  }
}
