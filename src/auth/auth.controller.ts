import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDTO } from "./dto/login.dto";
import { CreateClientDto } from "src/client/dto/create-client.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post("login")
  @ApiOperation({ summary: "Realizar login e obter token de acesso (JWT)" })
  @ApiResponse({
    status: 200,
    description: "Login realizado com sucesso. Retorna o token JWT.",
  })
  @ApiResponse({
    status: 401,
    description: "Credenciais inválidas.",
  })
  async login(@Body() dto: LoginDTO) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException("Credenciais inválidas");
    return this.authService.login(user);
  }

  @HttpCode(201)
  @Post("register")
  @ApiOperation({ summary: "Registrar um novo cliente" })
  @ApiResponse({
    status: 201,
    description: "Cliente registrado com sucesso.",
  })
  async register(@Body() dto: CreateClientDto) {
    return this.authService.register(dto);
  }
}
