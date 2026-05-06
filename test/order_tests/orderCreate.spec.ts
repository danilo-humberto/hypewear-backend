import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { CartService } from '../../src/cart/cart.service';
import { OrderService } from '../../src/order/order.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import {
  mockPrismaService,
  mockCartService,
  mockClient,
  mockCreateOrderDto,
  mockOrderItems,
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
        {
          provide: CartService,
          useValue: mockCartService,
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
    mockCartService.prepareOrderFromCart.mockResolvedValue({
      orderItems: mockOrderItems,
      subtotal: 20.0,
    });
    mockPrismaService.order.create.mockResolvedValue(mockOrder);
    mockPrismaService.orderItem.createMany.mockResolvedValue({ count: 1 });
    mockPrismaService.product.update.mockResolvedValue({});
    mockPrismaService.cart.findUnique.mockResolvedValue(null);
    mockPrismaService.order.findUnique.mockResolvedValue({
      ...mockOrder,
      items: [
        {
          productId: mockOrderItems[0].productId,
          quantity: mockOrderItems[0].quantity,
          unitPrice: mockOrderItems[0].unitPrice,
        },
      ],
    });

    const result = await service.create(mockCreateOrderDto);

    expect(result).toHaveProperty('items');
    expect(prisma.client.findUnique).toHaveBeenCalledWith({
      where: { id: mockCreateOrderDto.clientId },
    });
    expect(mockCartService.prepareOrderFromCart).toHaveBeenCalledWith(
      mockCreateOrderDto.clientId,
    );
    expect(prisma.order.create).toHaveBeenCalledWith({
      data: {
        clientId: mockCreateOrderDto.clientId,
        status: OrderStatus.ABERTO,
        total: 20.0,
      },
    });
    expect(prisma.orderItem.createMany).toHaveBeenCalledWith({
      data: mockOrderItems.map((item) => ({
        orderId: mockOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    });
    expect(prisma.order.findUnique).toHaveBeenCalledWith({
      where: { id: mockOrder.id },
      include: {
        items: { include: { product: true } },
        client: true,
        payments: true,
      },
    });
  });

  it('deve lancar um erro (NotFoundException) se o cliente nao for encontrado', async () => {
    mockPrismaService.client.findUnique.mockResolvedValue(null);

    await expect(service.create(mockCreateOrderDto)).rejects.toThrow(
      NotFoundException,
    );
    expect(prisma.order.create).not.toHaveBeenCalled();
  });

  it('deve lancar um erro (BadRequestException) se o carrinho estiver vazio', async () => {
    mockPrismaService.client.findUnique.mockResolvedValue(mockClient);
    mockCartService.prepareOrderFromCart.mockResolvedValue({
      orderItems: [],
      subtotal: 0,
    });

    await expect(service.create(mockCreateOrderDto)).rejects.toThrow(
      BadRequestException,
    );
    expect(prisma.order.create).not.toHaveBeenCalled();
  });
});