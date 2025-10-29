import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; 

export class CreateProductDto {

  @ApiProperty({
    description: 'Nome',
    example: "Caneta",
    type: String
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descrição do produto',
    example: "Caneta mágica que acende no escuro",
    type: String
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'preço',
    example: 10.00,
    type: Number
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Quantidade em estoque',
    example: 4,
    type: Number
  })
  @IsNumber()
  @IsInt()
  estoque: number;

  @ApiProperty({
    description: 'Status',
    example: 'Disponível',
    type: String
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    description: 'Url da imagem',
    example: "https://crown.vteximg.com.br/arquivos/ids/164524-1000-1000/Caneta-Crown-Supreme-Esferografica-Detalhes-Ouro-Rosa-frente.png.png?v=638726500907870000",
    type: String
  })
  @IsString()
  @IsNotEmpty()
  imagem: string;

  @ApiProperty({
    description: 'Categoria referente',
    example: "1",
    type: String
  })
  @IsString()
  categoryId: string;
}
