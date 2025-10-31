import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from '../client.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateClientDto } from '../dto/update-client.dto';
import {
  mockPrismaService,
  mockClient,
  mockCreateClientDto,
} from './client.mock';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('ClientService', () => {
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

    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password-abc');
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create (Criar Cliente)', () => {
    it('deve criar um cliente com sucesso e hashear a senha', async () => {
      mockPrismaService.client.findUnique.mockResolvedValue(null);
      mockPrismaService.client.create.mockResolvedValue(mockClient);

      await service.create(mockCreateClientDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(mockCreateClientDto.password, 10);
      expect(prisma.client.create).toHaveBeenCalledWith({
        data: {
          ...mockCreateClientDto,
          password: 'hashed-password-abc',
        },
      });
    });

    it('deve lançar um erro (ConflictException) se o email já existir', async () => {
      mockPrismaService.client.findUnique.mockResolvedValue(mockClient);

      await expect(service.create(mockCreateClientDto)).rejects.toThrow(
        ConflictException,
      );
      expect(prisma.client.create).not.toHaveBeenCalled();
    });
  });

  describe('update (Atualizar Cliente)', () => {
    it('deve atualizar dados do cliente (ex: nome) sem alterar a senha', async () => {
      const updateDto = { name: 'Leo Silva Santos' };
      const updatedClient = { ...mockClient, name: 'Leo Silva Santos' };

      mockPrismaService.client.findUnique.mockResolvedValue(mockClient);
      mockPrismaService.client.update.mockResolvedValue(updatedClient);

      await service.update(mockClient.id, updateDto as UpdateClientDto);

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(prisma.client.update).toHaveBeenCalledWith({
        where: { id: mockClient.id },
        data: updateDto,
      });
    });

    it('deve atualizar o cliente e hashear a nova senha se ela for fornecida', async () => {
      const updateDto = { password: 'newPassword123' };
      (bcrypt.hash as jest.Mock).mockResolvedValue('new-hashed-password');

      mockPrismaService.client.findUnique.mockResolvedValue(mockClient);
      mockPrismaService.client.update.mockResolvedValue(mockClient);

      await service.update(mockClient.id, updateDto as UpdateClientDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 10);
      expect(prisma.client.update).toHaveBeenCalledWith({
        where: { id: mockClient.id },
        data: { password: 'new-hashed-password' },
      });
    });

    it('deve lançar um erro (NotFoundException) se o cliente a ser atualizado não existir', async () => {
      const updateDto = { name: 'Leo Silva Santos' };
      mockPrismaService.client.findUnique.mockResolvedValue(null);

      await expect(
        service.update('invalid-id', updateDto as UpdateClientDto),
      ).rejects.toThrow(NotFoundException);
      expect(prisma.client.update).not.toHaveBeenCalled();
    });
  });
});