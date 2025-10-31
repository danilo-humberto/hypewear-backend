import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from '../client.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { mockPrismaService, mockClient } from './client.mock';

describe('ClientService - Remover', () => {
  let service: ClientService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ClientService>(ClientService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('remove (Remover Cliente)', () => {
    it('deve remover um cliente com sucesso', async () => {
      mockPrismaService.client.findUnique.mockResolvedValue(mockClient);
      mockPrismaService.client.delete.mockResolvedValue(mockClient);

      const result = await service.remove(mockClient.id);

      expect(result).toEqual(mockClient);
      expect(prisma.client.findUnique).toHaveBeenCalledWith({
        where: { id: mockClient.id },
      });
      expect(prisma.client.delete).toHaveBeenCalledWith({
        where: { id: mockClient.id },
      });
    });

    it('deve lançar um erro (NotFoundException) se o cliente a ser removido não existir', async () => {
      mockPrismaService.client.findUnique.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.client.delete).not.toHaveBeenCalled();
    });
  });
});