import { CreateClientDto } from '../dto/create-client.dto';

export const mockPrismaService = {
  client: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

export const mockClient = {
  id: 'client-uuid-123',
  name: 'Leo da Silva',
  email: 'leo.silva@exemplo.com',
  password: 'hashed-password-abc',
  numberPhone: '81987654321',
  address: 'Rua das flores, 273, casa',
  createdAt: new Date(),
  updatedAt: new Date(),
  orders: [],
  addresses: [],
};

export const mockCreateClientDto: CreateClientDto = {
  name: 'Leo da Silva',
  email: 'leo.silva@exemplo.com',
  password: 'senha123',
  numberPhone: '81987654321',
  address: 'Rua das flores, 273, casa',
};