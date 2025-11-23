import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  Min,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ProductStatus } from "@prisma/client";

export class CreateProductDto {
  @ApiProperty({
    description: "Nome",
    example: "Caneta",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Descrição do produto",
    example: "Caneta mágica que acende no escuro",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: "preço",
    example: 10.0,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: "Quantidade em estoque",
    example: 4,
    type: Number,
  })
  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  @Min(0, { message: "A quantidade em estoque não pode ser negativa" })
  estoque: number;

  @ApiProperty({
    description: "Status",
    example: "Disponível",
    enum: ProductStatus,
  })
  @IsEnum(ProductStatus)
  @IsNotEmpty()
  status: ProductStatus;

  @ApiProperty({
    description: "Url da imagem",
    example:
      "https://crown.vteximg.com.br/arquivos/ids/164524-1000-1000/Caneta-Crown-Supreme-Esferografica-Detalhes-Ouro-Rosa-frente.png.png?v=638726500907870000",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  imagem: string;

  @ApiProperty({
    description: "Categoria referente",
    example: "uuid-da-categoria",
    type: String,
  })
  @IsString()
  categoryId: string;
}
