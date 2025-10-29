import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateClientDto) {
    const exists = await this.prisma.client.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (exists) throw new ConflictException('Email já cadastrado!');

    const hashPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.client.create({
      data: {
        ...dto,
        password: hashPassword,
      },
    });
  }

  findAll() {
    return this.prisma.client.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        numberPhone: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({
      where: {
        id,
      },
    });

    if (!client) throw new NotFoundException('Cliente não encontrado!');

    return client;
  }

  async findByEmail(email: string) {
    return this.prisma.client.findUnique({ where: { email } });
  }

  async update(id: string, dto: UpdateClientDto) {
    await this.findOne(id);

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    return this.prisma.client.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.client.delete({
      where: {
        id,
      },
    });
  }

  async comparePassword(password: string, hashPassword: string) {
    return bcrypt.compare(password, hashPassword);
  }
}
