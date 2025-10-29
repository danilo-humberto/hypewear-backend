import { 
    IsNotEmpty, IsIn, IsString, IsOptional, IsNumber, IsPositive 
} from "class-validator";
import { ApiProperty } from '@nestjs/swagger'; 

export type PaymentMethod = 'CARTAO' | 'BOLETO' | 'PIX';

export class CreatePaymentDto {

  @ApiProperty({
    description: 'ID do pedido a ser pago.',
    example: 550,
    type: Number
  })
  @IsNotEmpty()
  orderId: number;

  @ApiProperty({
    description: 'Método de pagamento.',
    example: 'CARTAO',
    enum: ['CARTAO', 'BOLETO', 'PIX']
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['CARTAO', 'BOLETO', 'PIX']) 
  method: PaymentMethod

  @ApiProperty({
    description: 'Valor do pagamento. Opcional, o valor do pedido será usado se não for fornecido.',
    example: 150.75,
    type: Number,
    required: false
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  value?: number;
    
}