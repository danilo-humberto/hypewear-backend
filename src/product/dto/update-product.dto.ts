import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsInt()
  @IsOptional()
  estoque: number;

  @IsString()
  @IsOptional()
  status: string;

  @IsString()
  @IsOptional()
  imagem: string;

  @IsString()
  @IsOptional()
  categoryId: string;
}
