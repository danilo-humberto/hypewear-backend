import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../order.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import {
  mockPrismaService,
  mockClient,
  mockProduct,
  mockCreateOrderDto,
  mockOrder,
} from './order.mock';

describe('OrderService', () => {
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

  it('deve criar um pedido com sucesso', async () => {
    mockPrismaService.client.findUnique.mockResolvedValue(mockClient);
    mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
    mockPrismaService.order.create.mockResolvedValue(mockOrder);
    mockPrismaService.orderItem.createMany.mockResolvedValue({ count: 1 });
    mockPrismaService.order.findUnique.mockResolvedValue({
      ...mockOrder,
      items: [
        {
          productId: mockProduct.id,
          quantity: 2,
          price: mockProduct.price,
          subtotal: 20.0,
        },
      ],
    });

    const result = await service.create(mockCreateOrderDto);

    expect(result).toHaveProperty('items');
    expect(prisma.client.findUnique).toHaveBeenCalledWith({
      where: { id: mockCreateOrderDto.clientId },
    });
    expect(prisma.product.findUnique).toHaveBeenCalledWith({
      where: { id: mockProduct.id },
    });
    expect(prisma.order.create).toHaveBeenCalledWith({
      data: {
        clientId: mockCreateOrderDto.clientId,
        status: OrderStatus.ABERTO,
        total: 20.0,
        subtotal: 20.0,
        totalQuantity: 2,
      },
    });
    expect(prisma.orderItem.createMany).toHaveBeenCalled();
    expect(prisma.order.findUnique).toHaveBeenCalledWith({
      where: { id: mockOrder.id },
      include: { items: true },
    });
  });

  it('deve lançar um erro (NotFoundException) se o cliente não for encontrado', async () => {
    mockPrismaService.client.findUnique.mockResolvedValue(null);

    await expect(service.create(mockCreateOrderDto)).rejects.toThrow(
      NotFoundException,
    );
    expect(prisma.order.create).not.toHaveBeenCalled();
  });

  it('deve lançar um erro (NotFoundException) se um produto não for encontrado', async () => {
    mockPrismaService.client.findUnique.mockResolvedValue(mockClient);
    mockPrismaService.product.findUnique.mockResolvedValue(null);

    await expect(service.create(mockCreateOrderDto)).rejects.toThrow(
      NotFoundException,
    );
    expect(prisma.order.create).not.toHaveBeenCalled();
  });

  it('deve lançar um erro (BadRequestException) se o estoque for insuficiente', async () => {
    const productOutOfStock = { ...mockProduct, estoque: 1 };
    const dtoWithMoreQuantity = {
      ...mockCreateOrderDto,
      items: [{ productId: mockProduct.id, quantity: 5 }],
    };

    mockPrismaService.client.findUnique.mockResolvedValue(mockClient);
    mockPrismaService.product.findUnique.mockResolvedValue(productOutOfStock);

    await expect(service.create(dtoWithMoreQuantity)).rejects.toThrow(
      BadRequestException,
    );
    expect(prisma.order.create).not.toHaveBeenCalled();
  });
});