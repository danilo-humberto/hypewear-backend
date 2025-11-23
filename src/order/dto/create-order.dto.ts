import { Type } from "class-transformer";
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

class CreateOrderItemDto {
  @ApiProperty({
    description: "ID do produto",
    example: "123",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: "Quantidade daquele produto",
    example: 2,
    type: Number,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: "ID do Cliente",
    example: "123",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({
    description: "Itens",
    example: [
      {
        productId: "7e3b5a1f-4d2c-4e8a-8b1e-9c0d5f6a2b8c",
        quantity: 2,
      },
      {
        productId: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
        quantity: 3,
      },
    ],
    type: [CreateOrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
