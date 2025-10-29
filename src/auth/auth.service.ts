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

  async login(client: { id: string; name: string; email: string }) {
    const payload = { sub: client.id };
    return {
      access_token: this.jwtService.sign(payload),
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
      },
    };
  }

  async register(dto: CreateClientDto) {
    const hasUser = await this.clientService.findByEmail(dto.email);
    if (hasUser) throw new BadRequestException('Email já cadastrado');

    const client = await this.clientService.create(dto);
    const { password, ...result } = client;
    const payload = { email: client.email, sub: client.id };
    return {
      access_token: this.jwtService.sign(payload),
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
      },
    };
  }
}
