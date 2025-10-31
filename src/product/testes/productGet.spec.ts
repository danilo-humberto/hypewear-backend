import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  mockPrismaService,
  mockProduct,
} from './products.mock';

describe('ProductService', () => {
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

  describe('findOne', () => {
    it('deve retornar um único produto', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

      const result = await service.findOne(mockProduct.id);

      expect(result).toEqual(mockProduct);
      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: mockProduct.id },
        include: { category: true },
      });
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os produtos sem filtros', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([mockProduct]);

      const result = await service.findAll({});

      expect(result).toEqual([mockProduct]);
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: {},
        include: { category: true },
      });
    });

    it('deve filtrar por nome', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([mockProduct]);
      const filtros = { name: 'Camisa' };

      await service.findAll(filtros);

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { name: { contains: filtros.name } },
        include: { category: true },
      });
    });

    it('deve combinar todos os filtros', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([mockProduct]);
      const filtros = {
        name: 'Camisa',
        nameCategory: 'Roupas',
        precoMin: 70,
        precoMax: 80,
      };

      await service.findAll(filtros);

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: {
          name: { contains: filtros.name },
          category: { name: filtros.nameCategory },
          price: { gte: 70, lte: 80 },
        },
        include: { category: true },
      });
    });
  });
});