import { OrderStatus } from '@prisma/client';
import { CreateOrderDto } from '../dto/create-order.dto';

export const mockPrismaService = {
  order: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
  },
  orderItem: {
    createMany: jest.fn(),
  },
  client: {
    findUnique: jest.fn(),
  },
  product: {
    findUnique: jest.fn(),
  },
  $transaction: jest.fn().mockImplementation((callback) => {
    return callback(mockPrismaService);
  }),
};

export const mockClient = {
  id: 'client-uuid-123',
  name: 'Test Client',
  email: 'test@client.com',
};

export const mockProduct = {
  id: 'product-uuid-456',
  name: 'Caneta Azul',
  price: 10.0,
  estoque: 100,
};

export const mockCreateOrderDto: CreateOrderDto = {
  clientId: mockClient.id,
  items: [{ productId: mockProduct.id, quantity: 2 }],
};

export const mockOrder = {
  id: 'order-uuid-789',
  clientId: mockClient.id,
  status: OrderStatus.ABERTO,
  total: 20.0,
  subtotal: 20.0,
  totalQuantity: 2,
  items: [],
};