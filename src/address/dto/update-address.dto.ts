import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateAddressDto {
  @IsString()
  @IsOptional()
  cep: string;

  @IsString()
  @IsOptional()
  logradouro: string;

  @IsString()
  @IsOptional()
  numero: string;

  @IsString()
  @IsOptional()
  complemento: string;

  @IsString()
  @IsOptional()
  bairro: string;

  @IsString()
  @IsOptional()
  cidade: string;

  @IsString()
  @IsOptional()
  estado: string;

  @IsBoolean()
  @IsOptional()
  isDefault: boolean;

  @IsString()
  @IsOptional()
  clientId: string;
}
