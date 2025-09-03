import { IsString, IsNumber, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../entities/order.entity';

export class OrderItemDto {
  @ApiProperty({
    description: 'Product ID',
    example: 'uuid-string',
    type: 'string'
  })
  @IsString()
  productId: string;

  @ApiProperty({
    description: 'Product name',
    example: 'School Notebook',
    type: 'string'
  })
  @IsString()
  productName: string;

  @ApiProperty({
    description: 'Quantity ordered',
    example: 2,
    type: 'number'
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Unit price of the product',
    example: 15.99,
    type: 'number'
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Product category',
    example: 'Stationery',
    type: 'string'
  })
  @IsString()
  category: string;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Parent full name',
    example: 'John Doe',
    type: 'string'
  })
  @IsString()
  parentName: string;

  @ApiProperty({
    description: 'Parent email address',
    example: 'john.doe@example.com',
    type: 'string'
  })
  @IsString()
  parentEmail: string;

  @ApiProperty({
    description: 'Parent phone number',
    example: '+1234567890',
    type: 'string'
  })
  @IsString()
  parentPhone: string;

  @ApiProperty({
    description: 'Student full name',
    example: 'Jane Doe',
    type: 'string'
  })
  @IsString()
  studentName: string;

  @ApiProperty({
    description: 'Student grade level',
    example: 'Grade 8',
    type: 'string'
  })
  @IsString()
  studentGrade: string;

  @ApiProperty({
    description: 'Student class/section',
    example: 'Class A',
    type: 'string'
  })
  @IsString()
  studentClass: string;

  @ApiProperty({
    description: 'List of order items',
    type: [OrderItemDto],
    example: [
      {
        productId: 'uuid-string',
        productName: 'School Notebook',
        quantity: 2,
        price: 15.99,
        category: 'Stationery'
      }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({
    description: 'Total order amount',
    example: 31.98,
    type: 'number'
  })
  @IsNumber()
  totalAmount: number;

  @ApiProperty({
    description: 'Payment method used',
    example: 'Credit Card',
    type: 'string'
  })
  @IsString()
  paymentMethod: string;

  @ApiProperty({
    description: 'Delivery address for the order',
    example: '123 School Street, City, State 12345',
    type: 'string'
  })
  @IsString()
  deliveryAddress: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'New order status',
    example: 'confirmed',
    enum: OrderStatus
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

export class BulkUpdateOrderStatusDto {
  @ApiProperty({
    description: 'Array of order IDs to update',
    example: ['uuid-1', 'uuid-2', 'uuid-3'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  orderIds: string[];

  @ApiProperty({
    description: 'New order status for all specified orders',
    example: OrderStatus.DELIVERED,
    enum: OrderStatus
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

export class OrderResponseDto {
  @ApiProperty({
    description: 'Order ID',
    example: 'uuid-string',
    type: 'string'
  })
  id: string;

  @ApiProperty({
    description: 'User ID who placed the order',
    example: 'uuid-string',
    type: 'string'
  })
  userId: string;

  @ApiProperty({
    description: 'Parent full name',
    example: 'John Doe',
    type: 'string'
  })
  parentName: string;

  @ApiProperty({
    description: 'Parent email address',
    example: 'john.doe@example.com',
    type: 'string'
  })
  parentEmail: string;

  @ApiProperty({
    description: 'Parent phone number',
    example: '+1234567890',
    type: 'string'
  })
  parentPhone: string;

  @ApiProperty({
    description: 'Student full name',
    example: 'Jane Doe',
    type: 'string'
  })
  studentName: string;

  @ApiProperty({
    description: 'Student grade level',
    example: 'Grade 8',
    type: 'string'
  })
  studentGrade: string;

  @ApiProperty({
    description: 'Student class/section',
    example: 'Class A',
    type: 'string'
  })
  studentClass: string;

  @ApiProperty({
    description: 'List of order items',
    type: [OrderItemDto]
  })
  items: OrderItemDto[];

  @ApiProperty({
    description: 'Total order amount',
    example: 31.98,
    type: 'number'
  })
  totalAmount: number;

  @ApiProperty({
    description: 'Order status',
    example: 'pending',
    enum: OrderStatus
  })
  status: OrderStatus;

  @ApiProperty({
    description: 'Order date',
    example: '2023-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  orderDate: Date;

  @ApiProperty({
    description: 'Payment method used',
    example: 'Credit Card',
    type: 'string'
  })
  paymentMethod: string;

  @ApiProperty({
    description: 'Delivery address for the order',
    example: '123 School Street, City, State 12345',
    type: 'string'
  })
  deliveryAddress: string;

  @ApiProperty({
    description: 'Order creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Order last update timestamp',
    example: '2023-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  updatedAt: Date;
}
