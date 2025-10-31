import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  mockPrismaService,
  mockProduct,
} from './products.mock';

describe('ProductService - Remover', () => {
  let service: ProductService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('remove (Remover Produto)', () => {
    it('deve remover um produto com sucesso', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.product.delete.mockResolvedValue(mockProduct);

      const result = await service.remove(mockProduct.id);

      expect(result).toEqual(mockProduct);
      expect(prisma.product.delete).toHaveBeenCalledWith({
        where: { id: mockProduct.id },
      });
    });

  });
});