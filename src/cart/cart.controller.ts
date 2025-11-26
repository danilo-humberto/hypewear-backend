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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CartService } from "./cart.service";
import { Request } from "express";
import { AddCartItemDto } from "./dto/add-cart.dto";
import { UpdateCartItemDto } from "./dto/update-cart.dto";

@ApiTags("Cart")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: "Obter o carrinho do cliente autenticado" })
  @ApiResponse({
    status: 200,
    description: "Carrinho retornado com sucesso.",
  })
  async getCart(@Req() req: Request) {
    const clientId = (req.user as any).id;
    const cart = await this.cartService.getCartByClient(clientId);
    if (!cart) return { items: [], subtotal: 0 };
    return cart;
  }

  @Post("items")
  @ApiOperation({ summary: "Adicionar um item ao carrinho" })
  @ApiResponse({
    status: 201,
    description: "Item adicionado ou atualizado no carrinho com sucesso.",
  })
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
  @ApiOperation({ summary: "Atualizar a quantidade de um item do carrinho" })
  @ApiResponse({
    status: 200,
    description: "Item do carrinho atualizado ou removido com sucesso.",
  })
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
  @ApiOperation({ summary: "Remover um item do carrinho" })
  @ApiResponse({
    status: 200,
    description: "Item removido do carrinho com sucesso.",
  })
  async removeItem(
    @Req() req: Request,
    @Param("productId", new ParseUUIDPipe()) productId: string
  ) {
    const clientId = (req.user as any).id;
    return this.cartService.removeItem(clientId, productId);
  }

  @Post("clear")
  @ApiOperation({ summary: "Limpar todos os itens do carrinho" })
  @ApiResponse({
    status: 200,
    description: "Carrinho limpo com sucesso.",
  })
  async clearCart(@Req() req: Request) {
    const clientId = (req.user as any).id;
    return this.cartService.clearCart(clientId);
  }

  @Post("prepare-order")
  @ApiOperation({
    summary: "Preparar o resumo do pedido a partir do carrinho",
    description:
      "Retorna os itens e o subtotal calculado, pronto para criação de pedido.",
  })
  @ApiResponse({
    status: 200,
    description: "Resumo do pedido preparado com sucesso.",
  })
  async prepareOrder(@Req() req: Request) {
    const clientId = (req.user as any).id;
    return this.cartService.prepareOrderFromCart(clientId);
  }
}
