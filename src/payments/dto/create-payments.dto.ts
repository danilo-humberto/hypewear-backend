import { IsNotEmpty, IsIn, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PaymentMethodType } from "@prisma/client";

export class CreatePaymentDto {
  @ApiProperty({
    description: "ID do pedido a ser pago.",
    example: "7e3b5a1f-4d2c-4e8a-8b1e-9c0d5f6a2b8c",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({
    description: "Método de pagamento.",
    example: "CARTAO",
    enum: PaymentMethodType,
  })
  @IsString()
  @IsIn(["CARTAO", "BOLETO", "PIX"])
  method: PaymentMethodType;
}
