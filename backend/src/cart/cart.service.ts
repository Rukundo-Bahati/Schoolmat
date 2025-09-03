import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from '../common/entities/cart-item.entity';
import { Product } from '../common/entities/product.entity';
import { User } from '../common/entities/user.entity';
import { AddToCartDto, UpdateCartItemDto, CartItemResponseDto } from '../common/dto/cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async addToCart(addToCartDto: AddToCartDto, userId: string): Promise<CartItemResponseDto> {
    const { productId, quantity } = addToCartDto;

    // Verify user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify product exists and has sufficient stock
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    // Check if item already exists in cart
    let cartItem = await this.cartItemRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
      relations: ['user', 'product'],
    });

    if (cartItem) {
      // Update quantity
      cartItem.quantity += quantity;
      if (cartItem.quantity > product.stock) {
        throw new BadRequestException('Insufficient stock for requested quantity');
      }
    } else {
      // Create new cart item
      cartItem = this.cartItemRepository.create({
        user,
        product,
        quantity,
        productName: product.name,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl,
      });
    }

    const savedCartItem = await this.cartItemRepository.save(cartItem);
    return this.mapCartItemToResponse(savedCartItem);
  }

  async getCartItems(userId: string): Promise<CartItemResponseDto[]> {
    const cartItems = await this.cartItemRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'product'],
      order: { createdAt: 'DESC' },
    });

    return cartItems.map(item => this.mapCartItemToResponse(item));
  }

  async updateCartItem(id: string, updateCartItemDto: UpdateCartItemDto, userId: string): Promise<CartItemResponseDto> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user', 'product'],
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    const { quantity } = updateCartItemDto;

    // Verify stock availability
    if (cartItem.product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    cartItem.quantity = quantity;
    const updatedCartItem = await this.cartItemRepository.save(cartItem);
    return this.mapCartItemToResponse(updatedCartItem);
  }

  async removeFromCart(id: string, userId: string): Promise<void> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartItemRepository.remove(cartItem);
  }

  async clearCart(userId: string): Promise<void> {
    await this.cartItemRepository.delete({ user: { id: userId } });
  }

  async getCartTotal(userId: string): Promise<{ totalItems: number; totalAmount: number }> {
    const cartItems = await this.cartItemRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    return { totalItems, totalAmount };
  }

  private mapCartItemToResponse(cartItem: CartItem): CartItemResponseDto {
    return {
      id: cartItem.id,
      productId: cartItem.product.id,
      productName: cartItem.product.name,
      quantity: cartItem.quantity,
      price: cartItem.product.price,
      category: cartItem.product.category,
      imageUrl: cartItem.product.imageUrl,
      createdAt: cartItem.createdAt,
      updatedAt: cartItem.updatedAt,
    };
  }
}
