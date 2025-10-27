import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAddressDto) {
    const client = await this.prisma.client.findUnique({
      where: { id: dto.clientId },
    });

    if (!client) throw new NotFoundException('Cliente não encontrado');

    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: {
          clientId: dto.clientId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    return this.prisma.address.create({ data: dto });
  }

  findAll() {
    return this.prisma.address.findMany();
  }

  async findByClient(clientId: string) {
    const addresses = await this.prisma.address.findMany({
      where: {
        clientId,
      },
    });

    if (addresses.length === 0)
      throw new NotFoundException(
        'Nenhum endereço encontrado para esse cliente!',
      );

    return addresses;
  }

  async findOne(id: string) {
    const address = await this.prisma.address.findUnique({
      where: { id },
    });

    if (!address) throw new NotFoundException('Endereço não encontrado!');

    return address;
  }

  async update(id: string, dto: UpdateAddressDto) {
    const address = await this.findOne(id);

    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: {
          clientId: address.clientId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    return this.prisma.address.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.address.delete({
      where: {
        id,
      },
    });
  }

  async putDefault(id: string) {
    const address = await this.findOne(id);
    await this.prisma.address.updateMany({
      where: {
        clientId: address.clientId,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });
    return this.prisma.address.update({
      where: {
        id,
      },
      data: {
        isDefault: true,
      },
    });
  }
}
