import { CreateAddressDto } from '../dto/create-address.dto';

export const mockPrismaService = {
  address: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    updateMany: jest.fn(),
  },
  client: {
    findUnique: jest.fn(),
  },
};

export const mockClient = {
  id: 'client-uuid-123',
  name: 'Test Client',
  email: 'test@client.com',
};

export const mockAddress = {
  id: 'address-uuid-456',
  cep: '50030-000',
  logradouro: 'Rua das Flores',
  numero: '273',
  complemento: 'Casa',
  bairro: 'Céu Azul',
  cidade: 'Recife',
  estado: 'PE',
  isDefault: false,
  clientId: mockClient.id,
  client: mockClient,
};

export const mockCreateAddressDto: CreateAddressDto = {
  cep: '50030-000',
  logradouro: 'Rua das Flores',
  numero: '273',
  complemento: 'Casa',
  bairro: 'Céu Azul',
  cidade: 'Recife',
  estado: 'PE',
  isDefault: false,
  clientId: mockClient.id,
};