import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientService } from 'src/client/client.service';
import { CreateClientDto } from 'src/client/dto/create-client.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly clientService: ClientService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.clientService.findByEmail(email);

    if (!user) return null;

    const isValid = await this.clientService.comparePassword(
      password,
      user.password,
    );
    if (!isValid) throw new UnauthorizedException('Credenciais inválidas');

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: { id: string; name: string; email: string }) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async register(dto: CreateClientDto) {
    const hasUser = await this.clientService.findByEmail(dto.email);
    if (hasUser) throw new BadRequestException('Email já cadastrado');

    const user = await this.clientService.create(dto);
    const { password, ...result } = user;
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: result,
    };
  }
}
