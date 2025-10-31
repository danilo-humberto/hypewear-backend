import { OrderStatus, PaymentStatusType } from '@prisma/client';

export const mockPrismaService = {
  payment: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  order: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  product: {
    update: jest.fn(),
  },
  $transaction: jest.fn().mockImplementation((callback) => {
    return callback(mockPrismaService);
  }),
};

export const mockOrder = {
  id: 'order-uuid-123',
  clientId: 'client-uuid-456',
  status: OrderStatus.ABERTO,
  total: 100.0,
  payments: [],
  items: [
    { productId: 'product-uuid-1', quantity: 2 },
    { productId: 'product-uuid-2', quantity: 1 },
  ],
};

export const mockPayment = {
  id: 'payment-uuid-789',
  orderId: mockOrder.id,
  status: PaymentStatusType.PENDENTE,
  value: 100.0,
  order: mockOrder,
};