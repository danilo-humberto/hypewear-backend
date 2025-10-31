import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../order.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { mockPrismaService, mockOrder } from './order.mock';

describe('OrderService - Buscas (Get)', () => {
  let service: OrderService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll (Buscar Todos)', () => {
    it('deve retornar um array de pedidos', async () => {
      mockPrismaService.order.findMany.mockResolvedValue([mockOrder]);

      const result = await service.findAll();

      expect(result).toEqual([mockOrder]);
      expect(prisma.order.findMany).toHaveBeenCalledWith({
        include: { items: { include: { product: true } }, client: true },
      });
    });
  });

  describe('findOne (Buscar Um)', () => {
    it('deve retornar um único pedido', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);

      const result = await service.findOne(mockOrder.id);

      expect(result).toEqual(mockOrder);
      expect(prisma.order.findUnique).toHaveBeenCalledWith({
        where: { id: mockOrder.id },
        include: { items: { include: { product: true } }, client: true },
      });
    });

    it('deve lançar um erro (NotFoundException) se o pedido não for encontrado', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});