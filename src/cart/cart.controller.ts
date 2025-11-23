import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseUUIDPipe,
  Req,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CartService } from "./cart.service";
import { Request } from "express";
import { AddCartItemDto } from "./dto/add-cart.dto";
import { UpdateCartItemDto } from "./dto/update-cart.dto";

@UseGuards(JwtAuthGuard)
@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() req: Request) {
    const clientId = (req.user as any).id;
    const cart = await this.cartService.getCartByClient(clientId);
    if (!cart) return { items: [], subtotal: 0 };
    return cart;
  }

  @Post("items")
  async addItem(
    @Req() req: Request,
    @Body(new ValidationPipe({ whitelist: true })) dto: AddCartItemDto
  ) {
    const clientId = (req.user as any).id;
    const createdOrUpdated = await this.cartService.addItem(
      clientId,
      dto.productId,
      dto.quantity
    );
    return createdOrUpdated;
  }

  @Patch("items")
  async updateItem(
    @Req() req: Request,
    @Body(new ValidationPipe({ whitelist: true })) dto: UpdateCartItemDto
  ) {
    const clientId = (req.user as any).id;
    if (dto.quantity === undefined) {
      const result = await this.cartService.updateItemQuantity(
        clientId,
        dto.productId,
        0
      );
      return result;
    }
    const updated = await this.cartService.updateItemQuantity(
      clientId,
      dto.productId,
      dto.quantity
    );
    return updated;
  }

  @Delete("items/:productId")
  async removeItem(
    @Req() req: Request,
    @Param("productId", new ParseUUIDPipe()) productId: string
  ) {
    const clientId = (req.user as any).id;
    return this.cartService.removeItem(clientId, productId);
  }

  @Post("clear")
  async clearCart(@Req() req: Request) {
    const clientId = (req.user as any).id;
    return this.cartService.clearCart(clientId);
  }

  @Post("prepare-order")
  async prepareOrder(@Req() req: Request) {
    const clientId = (req.user as any).id;
    return this.cartService.prepareOrderFromCart(clientId);
  }
}
