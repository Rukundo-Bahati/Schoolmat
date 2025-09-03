import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from '../common/dto/cart.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('items')
  @UseGuards(JwtAuthGuard)
  addToCart(@Body() addToCartDto: AddToCartDto, @Request() req) {
    return this.cartService.addToCart(addToCartDto, req.user.id);
  }

  @Get('items')
  @UseGuards(JwtAuthGuard)
  getCartItems(@Request() req) {
    return this.cartService.getCartItems(req.user.id);
  }

  @Get('total')
  @UseGuards(JwtAuthGuard)
  getCartTotal(@Request() req) {
    return this.cartService.getCartTotal(req.user.id);
  }

  @Patch('items/:id')
  @UseGuards(JwtAuthGuard)
  updateCartItem(@Param('id') id: string, @Body() updateCartItemDto: UpdateCartItemDto, @Request() req) {
    return this.cartService.updateCartItem(id, updateCartItemDto, req.user.id);
  }

  @Delete('items/:id')
  @UseGuards(JwtAuthGuard)
  removeFromCart(@Param('id') id: string, @Request() req) {
    return this.cartService.removeFromCart(id, req.user.id);
  }

  @Delete('clear')
  @UseGuards(JwtAuthGuard)
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.id);
  }
}
