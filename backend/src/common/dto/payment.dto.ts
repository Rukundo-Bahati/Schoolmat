import { IsString, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Order ID for payment',
    example: 'uuid-string',
    type: 'string'
  })
  @IsString()
  orderId: string;

  @ApiProperty({
    description: 'Payment amount',
    example: 79.95,
    type: 'number',
    minimum: 0
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Payment method used',
    example: 'credit_card',
    type: 'string'
  })
  @IsString()
  paymentMethod: string;
}

export class PaymentResponseDto {
  @ApiProperty({
    description: 'Payment ID',
    example: 'uuid-string',
    type: 'string'
  })
  id: string;

  @ApiProperty({
    description: 'Associated order ID',
    example: 'uuid-string',
    type: 'string'
  })
  orderId: string;

  @ApiProperty({
    description: 'Payment amount',
    example: 79.95,
    type: 'number'
  })
  amount: number;

  @ApiProperty({
    description: 'Payment method used',
    example: 'credit_card',
    type: 'string'
  })
  paymentMethod: string;

  @ApiProperty({
    description: 'Payment status',
    example: PaymentStatus.COMPLETED,
    enum: PaymentStatus
  })
  status: PaymentStatus;

  @ApiPropertyOptional({
    description: 'Payment gateway transaction ID',
    example: 'txn_123456789',
    type: 'string',
    nullable: true
  })
  transactionId: string | null;

  @ApiProperty({
    description: 'Payment processing timestamp',
    example: '2023-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  processedAt: Date;

  @ApiProperty({
    description: 'Payment processing message',
    example: 'Payment processed successfully',
    type: 'string'
  })
  message: string;
}
