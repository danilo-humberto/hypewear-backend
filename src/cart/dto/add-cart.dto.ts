import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsPositive, IsString, Min } from "class-validator";

export class AddCartItemDto {
  @ApiProperty({
    description: "ID do produto a ser adicionado ao carrinho",
    example: "0f7e6a4b-1d2c-4b5a-9e7a-123456789abc",
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: "Quantidade do produto a ser adicionada",
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  @Min(1)
  quantity: number;
}
