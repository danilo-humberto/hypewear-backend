import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({
    description: 'Código de Endereçamento Postal (CEP).',
    example: '50030-000', 
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  cep: string;

  @ApiProperty({
    description: 'Nome da rua/avenida (Logradouro).',
    example: 'Rua das Flores',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  logradouro: string;

  @ApiProperty({
    description: 'Número do endereço.',
    example: '273',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  numero: string;

  @ApiProperty({
    description: 'Informação adicional ao endereço.',
    example: 'Casa',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  complemento: string;

  @ApiProperty({
    description: 'Nome do bairro.',
    example: 'Céu Azul',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  bairro: string;

  @ApiProperty({
    description: 'Nome da cidade.',
    example: 'Recife',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  cidade: string;

  @ApiProperty({
    description: 'Sigla do estado.',
    example: 'PE',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  estado: string;

  @ApiProperty({
    description: 'Indica se este é o endereço padrão de entrega/cobrança do cliente.',
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  @IsNotEmpty()
  isDefault: boolean;

  @ApiProperty({
    description: 'ID do cliente ao qual este endereço pertence.',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef0123456789',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  clientId: string;
}