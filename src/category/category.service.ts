import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    const exists = await this.prisma.category.findFirst({
      where: { name: { equals: dto.name, mode: "insensitive" } },
    });

    if (exists) throw new ConflictException("Categoria já existe");
    return this.prisma.category.create({
      data: {
        name: dto.name.trim(),
      },
    });
  }

  findAll() {
    return this.prisma.category.findMany({
      include: {
        produtos: true,
      },
      orderBy: { name: "asc" },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        produtos: true,
      },
    });

    if (!category) throw new NotFoundException("Categoria não encontrada");

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);

    if (dto.name) {
      const exists = await this.prisma.category.findFirst({
        where: {
          name: { equals: dto.name.trim(), mode: "insensitive" },
          NOT: { id },
        },
      });

      if (exists) throw new ConflictException("Categoria já existe");
    }

    return this.prisma.category.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    const hasProducts = await this.prisma.product.count({
      where: { categoryId: id },
    });

    if (hasProducts > 0)
      throw new BadRequestException(
        "Não é possível deletar uma categoria que possui produtos associados"
      );
    return this.prisma.category.delete({ where: { id } });
  }
}
