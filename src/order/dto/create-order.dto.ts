import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateOrderDto {
  @ApiProperty({
    description: "ID do cliente que está realizando o pedido",
    example: "0f7e6a4b-1d2c-4b5a-9e7a-123456789abc",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  clientId: string;
}
