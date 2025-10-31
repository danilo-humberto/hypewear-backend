import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from '../payments.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { OrderStatus, PaymentStatusType } from '@prisma/client';
import {
  mockPrismaService,
  mockOrder,
  mockPayment,
} from './payments.mocks';

describe('PaymentService - Criar Pagamento', () => {
  let service: PaymentService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  const createDto = {
    orderId: mockOrder.id,
    method: 'PIX' as any,
    value: 100.0,
  };

  it('deve criar um pagamento com sucesso', async () => {
    mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);
    mockPrismaService.payment.create.mockResolvedValue(mockPayment);
    mockPrismaService.order.update.mockResolvedValue(mockOrder);

    const result = await service.createPayment(createDto);

    expect(result).toEqual(mockPayment);
    expect(prisma.order.findUnique).toHaveBeenCalledWith({
      where: { id: createDto.orderId },
      include: { payments: true },
    });
    expect(prisma.payment.create).toHaveBeenCalled();
    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: createDto.orderId },
      data: { status: OrderStatus.AGUARDANDO_PAGAMENTO },
    });
  });

  it('deve lançar um erro (NotFoundException) se o pedido não existir', async () => {
    mockPrismaService.order.findUnique.mockResolvedValue(null);

    await expect(service.createPayment(createDto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deve lançar um erro (ConflictException) se já existir um pagamento ativo (pendente)', async () => {
    const orderWithActivePayment = {
      ...mockOrder,
      payments: [{ status: PaymentStatusType.PENDENTE }],
    };
    mockPrismaService.order.findUnique.mockResolvedValue(
      orderWithActivePayment,
    );

    await expect(service.createPayment(createDto)).rejects.toThrow(
      ConflictException,
    );
  });

  it('deve lançar um erro (BadRequestException) se o status do pedido não for ABERTO', async () => {
    const paidOrder = {
      ...mockOrder,
      status: OrderStatus.PAGO,
    };
    mockPrismaService.order.findUnique.mockResolvedValue(paidOrder);

    await expect(service.createPayment(createDto)).rejects.toThrow(
      BadRequestException,
    );
  });
});