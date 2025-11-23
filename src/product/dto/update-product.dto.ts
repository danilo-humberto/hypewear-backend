import { ProductStatus } from "@prisma/client";
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  estoque?: number;

  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @IsString()
  @IsOptional()
  imagem?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;
}
