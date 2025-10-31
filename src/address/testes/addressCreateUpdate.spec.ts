import { Test, TestingModule } from '@nestjs/testing';
import { AddressService } from '../address.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { UpdateAddressDto } from '../dto/update-address.dto';
import {
  mockPrismaService,
  mockClient,
  mockAddress,
  mockCreateAddressDto,
} from './address.mock';

describe('AddressService', () => {
  let service: AddressService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create (Criar Endereço)', () => {
    it('deve criar um endereço simples (não padrão)', async () => {
      mockPrismaService.client.findUnique.mockResolvedValue(mockClient);

      await service.create(mockCreateAddressDto);

      expect(prisma.address.create).toHaveBeenCalledWith({
        data: mockCreateAddressDto,
      });
      expect(prisma.address.updateMany).not.toHaveBeenCalled();
    });

    it('deve criar um endereço padrão e desmarcar os antigos', async () => {
      const dtoWithDefault = { ...mockCreateAddressDto, isDefault: true };

      mockPrismaService.client.findUnique.mockResolvedValue(mockClient);
      mockPrismaService.address.updateMany.mockResolvedValue({ count: 1 });

      await service.create(dtoWithDefault);

      expect(prisma.address.updateMany).toHaveBeenCalledWith({
        where: {
          clientId: dtoWithDefault.clientId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
      expect(prisma.address.create).toHaveBeenCalledWith({ data: dtoWithDefault });
    });

    it('deve lançar um erro (NotFoundException) se o cliente não existir', async () => {
      mockPrismaService.client.findUnique.mockResolvedValue(null);

      await expect(service.create(mockCreateAddressDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.address.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('deve atualizar um campo simples (ex: CEP) sem afetar outros campos', async () => {
      const updateDto = { cep: '11111-111' };

      mockPrismaService.address.findUnique.mockResolvedValue(mockAddress);

      await service.update(mockAddress.id, updateDto as UpdateAddressDto);

      expect(prisma.address.update).toHaveBeenCalledWith({
        where: { id: mockAddress.id },
        data: updateDto,
      });
      expect(prisma.address.updateMany).not.toHaveBeenCalled();
    });

    it('deve atualizar um endereço para ser o padrão e desmarcar os antigos', async () => {
      const updateDto = { isDefault: true };

      mockPrismaService.address.findUnique.mockResolvedValue(mockAddress);
      mockPrismaService.address.updateMany.mockResolvedValue({ count: 1 });

      await service.update(mockAddress.id, updateDto as UpdateAddressDto);

      expect(prisma.address.update).toHaveBeenCalledWith({
        where: { id: mockAddress.id },
        data: updateDto,
      });
    });
  });
});