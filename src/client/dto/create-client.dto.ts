import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ClientRole } from "@prisma/client";

export class CreateClientDto {
  @ApiProperty({
    description: "Nome completo do cliente.",
    example: "Leo da Silva",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Endereço de e-mail único do cliente (usado para login).",
    example: "leo.silva@exemplo.com",
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Senha do cliente (mínimo de 6 caracteres).",
    example: "senha123",
    type: String,
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: "A senha deve ter pelo menos 6 caracteres." })
  password: string;

  @ApiProperty({
    description: "Função do cliente no sistema.",
    example: "USER",
    enum: ClientRole,
    required: false,
  })
  @IsOptional()
  @IsEnum(ClientRole, { message: "Função deve ser ADMIN ou USER" })
  role?: ClientRole;

  @ApiProperty({
    description: "Número de telefone do cliente.",
    example: "81987654321",
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  numberPhone: string;

  @ApiProperty({
    description: "Endereço residencial completo do cliente.",
    example: "Rua das flores, 273, casa",
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  address: string;
}
