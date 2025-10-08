import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) return null;

    const isValid = await this.usersService.comparePassword(
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

  async register(dto: CreateUserDto) {
    const hasUser = await this.usersService.findByEmail(dto.email);
    if (hasUser) throw new BadRequestException('Email já cadastrado');

    const user = await this.usersService.createUser(dto);
    const { password, ...result } = user;
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: result,
    };
  }
}
