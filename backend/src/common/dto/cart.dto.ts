import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({
    description: 'Product ID to add to cart',
    example: 'uuid-string',
    type: 'string'
  })
  @IsString()
  productId: string;

  @ApiProperty({
    description: 'Quantity to add',
    example: 2,
    type: 'number',
    minimum: 1
  })
  @IsNumber()
  quantity: number;
}

export class UpdateCartItemDto {
  @ApiProperty({
    description: 'New quantity for the cart item',
    example: 3,
    type: 'number',
    minimum: 0
  })
  @IsNumber()
  quantity: number;
}

export class CartItemResponseDto {
  @ApiProperty({
    description: 'Cart item ID',
    example: 'uuid-string',
    type: 'string'
  })
  id: string;

  @ApiProperty({
    description: 'Product ID',
    example: 'uuid-string',
    type: 'string'
  })
  productId: string;

  @ApiProperty({
    description: 'Product name',
    example: 'School Notebook',
    type: 'string'
  })
  productName: string;

  @ApiProperty({
    description: 'Quantity in cart',
    example: 2,
    type: 'number'
  })
  quantity: number;

  @ApiProperty({
    description: 'Unit price',
    example: 15.99,
    type: 'number'
  })
  price: number;

  @ApiProperty({
    description: 'Product category',
    example: 'Stationery',
    type: 'string'
  })
  category: string;

  @ApiProperty({
    description: 'Product image URL',
    example: 'https://example.com/notebook.jpg',
    type: 'string'
  })
  imageUrl: string;

  @ApiProperty({
    description: 'Item added to cart timestamp',
    example: '2023-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Item last updated timestamp',
    example: '2023-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  updatedAt: Date;
}

export class CartResponseDto {
  @ApiProperty({
    description: 'Cart items',
    type: [CartItemResponseDto]
  })
  items: CartItemResponseDto[];

  @ApiProperty({
    description: 'Total number of items in cart',
    example: 5,
    type: 'number'
  })
  totalItems: number;

  @ApiProperty({
    description: 'Total amount of all items',
    example: 79.95,
    type: 'number'
  })
  totalAmount: number;
}
