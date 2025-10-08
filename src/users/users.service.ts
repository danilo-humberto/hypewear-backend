import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async createUser(user: CreateUserDto) {
    const hasUser = await this.findByEmail(user.email);

    if (hasUser) {
      throw new ConflictException('Usuário já cadastrado');
    }

    const hashedPassword = await this.hashPassword(user.password);

    return this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email.toLowerCase().trim(),
        password: hashedPassword,
      },
    });
  }

  async findAllUsers() {
    return this.prisma.user.findMany();
  }

  async findUserById(id: string) {
    const hasUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!hasUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return hasUser;
  }

  async updateUser(id: string, user: UpdateUserDto) {
    const hasUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!hasUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (user.password) {
      const hashedPassword = await this.hashPassword(user.password);
      user.password = hashedPassword;
    }

    return this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: user.name,
        password: user.password,
      },
    });
  }

  async removeUser(id: string) {
    const hasUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!hasUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async comparePassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }
}
