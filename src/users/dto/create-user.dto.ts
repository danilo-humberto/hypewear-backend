import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório!' })
  name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email é obrigatório!' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Senha precisa ter pelo menos 6 caracteres!' })
  password: string;
}
