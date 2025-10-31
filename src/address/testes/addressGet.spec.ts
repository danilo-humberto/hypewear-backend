import { Test, TestingModule } from '@nestjs/testing';
import { AddressService } from '../address.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { mockPrismaService, mockAddress } from './address.mock';

describe('AddressService - Get (Buscas)', () => {
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

  describe('findAll', () => {
    it('deve retornar um array de endereços', async () => {
      mockPrismaService.address.findMany.mockResolvedValue([mockAddress]);
      const result = await service.findAll();

      expect(result).toEqual([mockAddress]);
      expect(prisma.address.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar um único endereço pelo ID', async () => {
      mockPrismaService.address.findUnique.mockResolvedValue(mockAddress);
      const result = await service.findOne(mockAddress.id);

      expect(result).toEqual(mockAddress);
      expect(prisma.address.findUnique).toHaveBeenCalledWith({
        where: { id: mockAddress.id },
      });
    });
  });

  describe('findByClient', () => {
    it('deve retornar todos os endereços de um cliente específico', async () => {
      mockPrismaService.address.findMany.mockResolvedValue([mockAddress]);
      const result = await service.findByClient(mockAddress.clientId);

      expect(result).toEqual([mockAddress]);
      expect(prisma.address.findMany).toHaveBeenCalledWith({
        where: { clientId: mockAddress.clientId },
      });
    });
  });
});