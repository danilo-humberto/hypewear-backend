import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProductDto } from '../dto/update-product.dto';
import {
  mockPrismaService,
  mockCategory,
  mockProduct,
  mockCreateProductDto,
} from './products.mock';

describe('ProductService - Criar/Atualizar', () => {
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

  describe('create', () => {
    it('deve criar um produto com sucesso', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);
      mockPrismaService.product.create.mockResolvedValue(mockProduct);

      const result = await service.create(mockCreateProductDto);

      expect(result).toEqual(mockProduct);
      expect(prisma.category.findUnique).toHaveBeenCalledWith({
        where: { id: mockCreateProductDto.categoryId },
      });
      expect(prisma.product.create).toHaveBeenCalledWith({
        data: mockCreateProductDto,
      });
    });

  });

  describe('update (Atualizar Produto)', () => {
    it('deve atualizar um produto com sucesso', async () => {
      const updateDto = { price: 89.9 };
      const updatedProduct = { ...mockProduct, price: 89.9 };

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.product.update.mockResolvedValue(updatedProduct);

      const result = await service.update(
        mockProduct.id,
        updateDto as UpdateProductDto,
      );

      expect(result).toEqual(updatedProduct);
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: mockProduct.id },
        data: updateDto,
      });
    });

  });
});