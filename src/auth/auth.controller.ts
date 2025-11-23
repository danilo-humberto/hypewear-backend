import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDTO } from "./dto/login.dto";
import { CreateClientDto } from "src/client/dto/create-client.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { RolesGuard } from "./roles.guard";
import { Roles } from "./roles.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post("login")
  async login(@Body() dto: LoginDTO) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException("Credenciais inválidas");
    return this.authService.login(user);
  }

  @HttpCode(201)
  @Post("register")
  async register(@Body() dto: CreateClientDto) {
    return this.authService.register(dto);
  }
}
