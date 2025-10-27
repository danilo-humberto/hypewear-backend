import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateClientDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  password: string;

  @IsString()
  @IsOptional()
  numberPhone: string;

  @IsString()
  @IsOptional()
  address: string;
}
