import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderStatus, PaymentStatusType } from '@prisma/client';
import { PaymentService } from '../../src/payments/payments.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { mockOrder, mockPayment, mockPrismaService } from './payments.mocks';

describe('PaymentService - Status do Pagamento', () => {
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

  const paymentWithOrder = {
    ...mockPayment,
    order: {
      ...mockOrder,
      status: OrderStatus.AGUARDANDO_PAGAMENTO,
      items: [
        {
          productId: 'product-uuid-1',
          quantity: 2,
          product: {
            id: 'product-uuid-1',
            name: 'Camisa',
            estoque: 10,
            reserverd: 2,
          },
        },
      ],
    },
  };

  it('deve confirmar um pagamento pendente com sucesso', async () => {
    const paidOrder = {
      ...paymentWithOrder.order,
      status: OrderStatus.PAGO,
      payments: [{ ...mockPayment, status: PaymentStatusType.PAGO }],
    };

    mockPrismaService.payment.findUnique.mockResolvedValue(paymentWithOrder);
    mockPrismaService.product.update.mockResolvedValue({});
    mockPrismaService.payment.update.mockResolvedValue({
      ...mockPayment,
      status: PaymentStatusType.PAGO,
    });
    mockPrismaService.order.update.mockResolvedValue(paidOrder);

    const result = await service.confirmPayment(mockPayment.id);

    expect(result).toEqual(paidOrder);
    expect(prisma.payment.update).toHaveBeenCalledWith({
      where: { id: mockPayment.id },
      data: { status: PaymentStatusType.PAGO },
    });
    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: mockOrder.id },
      data: { status: OrderStatus.PAGO },
      include: {
        payments: true,
        items: { include: { product: true } },
      },
    });
  });

  it('deve cancelar um pagamento pendente com sucesso', async () => {
    const canceledOrder = {
      ...paymentWithOrder.order,
      status: OrderStatus.CANCELADO,
      payments: [{ ...mockPayment, status: PaymentStatusType.CANCELADO }],
    };

    mockPrismaService.payment.findUnique.mockResolvedValue(paymentWithOrder);
    mockPrismaService.product.update.mockResolvedValue({});
    mockPrismaService.payment.update.mockResolvedValue({
      ...mockPayment,
      status: PaymentStatusType.CANCELADO,
    });
    mockPrismaService.order.update.mockResolvedValue(canceledOrder);

    const result = await service.cancelPayment(mockPayment.id);

    expect(result).toEqual(canceledOrder);
    expect(prisma.payment.update).toHaveBeenCalledWith({
      where: { id: mockPayment.id },
      data: { status: PaymentStatusType.CANCELADO },
    });
    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: mockOrder.id },
      data: { status: OrderStatus.CANCELADO },
      include: {
        payments: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  });

  it('deve lancar NotFoundException se o pagamento nao existir', async () => {
    mockPrismaService.payment.findUnique.mockResolvedValue(null);

    await expect(service.confirmPayment('invalid-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deve lancar BadRequestException ao confirmar pagamento que nao esta pendente', async () => {
    mockPrismaService.payment.findUnique.mockResolvedValue({
      ...paymentWithOrder,
      status: PaymentStatusType.PAGO,
    });

    await expect(service.confirmPayment(mockPayment.id)).rejects.toThrow(
      BadRequestException,
    );
  });
});