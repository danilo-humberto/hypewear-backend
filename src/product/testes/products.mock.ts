export const mockPrismaService = {
  product: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  category: {
    findUnique: jest.fn(),
  },
};

export const mockCategory = {
  id: 'category-uuid-789',
  name: 'Roupas',
};

export const mockProduct = {
  id: 'product-uuid-101',
  name: 'Camisa Polo Azul',
  description: 'Camisa polo de algodão com malha piquet',
  price: 79.9,
  estoque: 50,
  status: 'Disponível',
  imagem: 'http://image.url/camisa-polo.png',
  categoryId: mockCategory.id,
  category: mockCategory,
};

export const mockCreateProductDto = {
  name: 'Camisa Polo Azul',
  description: 'Camisa polo de algodão com malha piquet',
  price: 79.9,
  estoque: 50,
  status: 'Disponível',
  imagem: 'http://image.url/camisa-polo.png',
  categoryId: mockCategory.id,
};