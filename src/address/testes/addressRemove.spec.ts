import { Test, TestingModule } from '@nestjs/testing';
import { AddressService } from '../address.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { mockPrismaService, mockAddress } from './address.mock';

describe('AddressService - Remove (Remover)', () => {
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

  describe('remove (Remover Endereço)', () => {
    it('deve remover um endereço com sucesso', async () => {
      mockPrismaService.address.findUnique.mockResolvedValue(mockAddress);
      mockPrismaService.address.delete.mockResolvedValue(mockAddress);

      const result = await service.remove(mockAddress.id);

      expect(result).toEqual(mockAddress);
      expect(prisma.address.findUnique).toHaveBeenCalledWith({
        where: { id: mockAddress.id },
      });
      expect(prisma.address.delete).toHaveBeenCalledWith({
        where: { id: mockAddress.id },
      });
    });

    it('deve lançar um erro (NotFoundException) se o endereço a ser removido não existir', async () => {
      mockPrismaService.address.findUnique.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.address.delete).not.toHaveBeenCalled();
    });
  });
});