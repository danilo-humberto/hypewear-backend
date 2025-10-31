import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from '../client.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { mockPrismaService, mockClient } from './client.mock';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('ClientService - Buscas/Comparações', () => {
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

  describe('findAll', () => {
    it('deve retornar um array de clientes sem a senha', async () => {
      const { password, ...clientWithoutPassword } = mockClient;
      mockPrismaService.client.findMany.mockResolvedValue([
        clientWithoutPassword,
      ]);

      const result = await service.findAll();

      expect(result).toEqual([clientWithoutPassword]);
      expect(prisma.client.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          name: true,
          email: true,
          numberPhone: true,
          createdAt: true,
        },
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar um único cliente (com a senha)', async () => {
      mockPrismaService.client.findUnique.mockResolvedValue(mockClient);

      const result = await service.findOne(mockClient.id);

      expect(result).toEqual(mockClient);
      expect(prisma.client.findUnique).toHaveBeenCalledWith({
        where: { id: mockClient.id },
      });
    });

    it('deve lançar um erro (NotFoundException) se o cliente não existir', async () => {
      mockPrismaService.client.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByEmail', () => {
    it('deve retornar um cliente pelo email', async () => {
      mockPrismaService.client.findUnique.mockResolvedValue(mockClient);

      const result = await service.findByEmail(mockClient.email);

      expect(result).toEqual(mockClient);
      expect(prisma.client.findUnique).toHaveBeenCalledWith({
        where: { email: mockClient.email },
      });
    });

    it('deve retornar nulo se o email não for encontrado', async () => {
      mockPrismaService.client.findUnique.mockResolvedValue(null);

      const result = await service.findByEmail('not@found.com');

      expect(result).toBeNull();
    });
  });

  describe('comparePassword', () => {
    it('deve retornar verdadeiro se as senhas baterem', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.comparePassword('senha123', 'hashed-pass');

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith('senha123', 'hashed-pass');
    });

    it('deve retornar falso se as senhas não baterem', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.comparePassword('wrong-pass', 'hashed-pass');

      expect(result).toBe(false);
    });
  });
});