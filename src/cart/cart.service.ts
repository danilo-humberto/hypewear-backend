import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCartByClient(clientId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { clientId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) return null;

    const subtotal = cart.items.reduce((acc, it) => {
      const price =
        it.product && typeof it.product.price === "number"
          ? it.product.price
          : 0;
      return acc + price * it.quantity;
    }, 0);

    return { ...cart, subtotal };
  }

  private async ensureCart(clientId: string, prisma: any = this.prisma) {
    let cart = await prisma.cart.findUnique({ where: { clientId } });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { clientId },
      });
    }
    return cart;
  }

  async addItem(clientId: string, productId: string, quantity = 1) {
    if (quantity <= 0)
      throw new BadRequestException("Quantidade precisa ser > 0");

    return this.prisma.$transaction(async (prisma) => {
      const cart = await this.ensureCart(clientId, prisma);

      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (!product) throw new NotFoundException("Produto não encontrado");
      if (product.status !== "ATIVO")
        throw new BadRequestException("Produto não está disponível");

      const available = product.estoque - product.reserverd;
      if (available <= 0) throw new BadRequestException("Produto sem estoque");

      const existing = await prisma.cartItem.findUnique({
        where: { cartId_productId: { cartId: cart.id, productId } },
      });

      const newQuantity = (existing ? existing.quantity : 0) + quantity;

      if (newQuantity > available) {
        throw new BadRequestException(
          "Quantidade solicitada maior que o estoque disponível"
        );
      }

      if (existing) {
        const updated = await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: newQuantity },
          include: { product: true },
        });
        return updated;
      } else {
        const created = await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
          },
          include: { product: true },
        });
        return created;
      }
    });
  }

  async updateItemQuantity(
    clientId: string,
    productId: string,
    quantity: number
  ) {
    if (quantity < 0)
      throw new BadRequestException("Quantidade precisa ser >= 0");

    return this.prisma.$transaction(async (prisma) => {
      const cart = await prisma.cart.findUnique({ where: { clientId } });
      if (!cart) throw new NotFoundException("Carrinho não encontrado");

      const item = await prisma.cartItem.findUnique({
        where: { cartId_productId: { cartId: cart.id, productId } },
        include: { product: true },
      });
      if (!item) throw new NotFoundException("Item do carrinho não encontrado");

      if (quantity === 0) {
        await prisma.cartItem.delete({ where: { id: item.id } });
        return { removed: true };
      }

      const product = item.product;
      if (!product)
        throw new NotFoundException("Produto vinculado não encontrado");

      const available = product.estoque - product.reserverd;
      if (available <= 0) throw new BadRequestException("Produto sem estoque");
      if (quantity > available)
        throw new BadRequestException(
          "Quantidade solicitada maior que estoque disponível"
        );

      const updated = await prisma.cartItem.update({
        where: { id: item.id },
        data: { quantity },
        include: { product: true },
      });
      return updated;
    });
  }

  async removeItem(clientId: string, productId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { clientId } });
    if (!cart) throw new NotFoundException("Carrinho não encontrado");

    const item = await this.prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });
    if (!item) throw new NotFoundException("Item não encontrado");

    await this.prisma.cartItem.delete({ where: { id: item.id } });
    return { removed: true };
  }

  async clearCart(clientId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { clientId } });
    if (!cart) return { cleared: true }; // nada a fazer

    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return { cleared: true };
  }

  async prepareOrderFromCart(clientId: string) {
    const cart = await this.getCartByClient(clientId);
    if (!cart) throw new NotFoundException("Carrinho não encontrado");

    if (!cart.items || cart.items.length === 0)
      throw new BadRequestException("Carrinho vazio");

    for (const it of cart.items) {
      if (!it.product)
        throw new NotFoundException(`Produto ${it.productId} não encontrado`);
      if (it.product.status !== "ATIVO")
        throw new BadRequestException(
          `Produto ${it.product.name} não está disponível`
        );

      const available = it.product.estoque - it.product.reserverd;
      if (available <= 0)
        throw new BadRequestException(
          `Produto ${it.product.name} sem estoque suficiente`
        );
      if (it.quantity > available)
        throw new BadRequestException(
          `Produto ${it.product.name} sem estoque suficiente`
        );
    }

    const orderItems = cart.items.map((it) => ({
      productId: it.productId,
      quantity: it.quantity,
      unitPrice: it.product.price,
    }));

    const subtotal = cart.items.reduce((acc, it) => {
      const price =
        it.product && typeof it.product.price === "number"
          ? it.product.price
          : 0;
      return acc + price * it.quantity;
    }, 0);

    return { orderItems, subtotal };
  }
}
