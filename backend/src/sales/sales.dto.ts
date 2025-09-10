import { IsString, IsNumber, IsOptional, IsEnum, IsEmail, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SaleStatus, PaymentStatus } from './sales.entity';

export class CreateSaleDto {
  @ApiProperty({
    description: 'Customer name',
    example: 'John Doe',
    type: 'string'
  })
  @IsString()
  customerName!: string;

  @ApiProperty({
    description: 'Customer email address',
    example: 'john.doe@example.com',
    type: 'string'
  })
  @IsEmail()
  customerEmail!: string;

  @ApiPropertyOptional({
    description: 'Customer phone number',
    example: '+1234567890',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiPropertyOptional({
    description: 'Sale description',
    example: 'School supplies for Grade 5 student',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Total sale amount',
    example: 150.00,
    type: 'number',
    minimum: 0
  })
  @IsNumber()
  totalAmount!: number;

  @ApiPropertyOptional({
    description: 'Expected close date',
    example: '2024-12-31',
    type: 'string',
    format: 'date'
  })
  @IsOptional()
  @IsDateString()
  expectedCloseDate?: string;
}

export class UpdateSaleDto {
  @ApiPropertyOptional({
    description: 'Customer name',
    example: 'John Doe',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({
    description: 'Customer email address',
    example: 'john.doe@example.com',
    type: 'string'
  })
  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @ApiPropertyOptional({
    description: 'Customer phone number',
    example: '+1234567890',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiPropertyOptional({
    description: 'Sale description',
    example: 'School supplies for Grade 5 student',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Total sale amount',
    example: 150.00,
    type: 'number',
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @ApiPropertyOptional({
    description: 'Sale status',
    example: SaleStatus.CONFIRMED,
    enum: SaleStatus
  })
  @IsOptional()
  @IsEnum(SaleStatus)
  status?: SaleStatus;

  @ApiPropertyOptional({
    description: 'Payment status',
    example: PaymentStatus.PAID,
    enum: PaymentStatus
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @ApiPropertyOptional({
    description: 'Expected close date',
    example: '2024-12-31',
    type: 'string',
    format: 'date'
  })
  @IsOptional()
  @IsDateString()
  expectedCloseDate?: string;

  @ApiPropertyOptional({
    description: 'Actual close date',
    example: '2024-12-15',
    type: 'string',
    format: 'date'
  })
  @IsOptional()
  @IsDateString()
  actualCloseDate?: string;
}

export class SaleResponseDto {
  @ApiProperty({
    description: 'Sale ID',
    example: 'uuid-string',
    type: 'string'
  })
  id!: string;

  @ApiProperty({
    description: 'User ID who created the sale',
    example: 'uuid-string',
    type: 'string'
  })
  userId!: string;

  @ApiProperty({
    description: 'Customer name',
    example: 'John Doe',
    type: 'string'
  })
  customerName!: string;

  @ApiProperty({
    description: 'Customer email address',
    example: 'john.doe@example.com',
    type: 'string'
  })
  customerEmail!: string;

  @ApiPropertyOptional({
    description: 'Customer phone number',
    example: '+1234567890',
    type: 'string'
  })
  customerPhone?: string;

  @ApiPropertyOptional({
    description: 'Sale description',
    example: 'School supplies for Grade 5 student',
    type: 'string'
  })
  description?: string;

  @ApiProperty({
    description: 'Total sale amount',
    example: 150.00,
    type: 'number'
  })
  totalAmount!: number;

  @ApiProperty({
    description: 'Paid amount',
    example: 150.00,
    type: 'number'
  })
  paidAmount!: number;

  @ApiProperty({
    description: 'Sale status',
    example: SaleStatus.CONFIRMED,
    enum: SaleStatus
  })
  status!: SaleStatus;

  @ApiProperty({
    description: 'Payment status',
    example: PaymentStatus.PAID,
    enum: PaymentStatus
  })
  paymentStatus!: PaymentStatus;

  @ApiPropertyOptional({
    description: 'Expected close date',
    example: '2024-12-31T00:00:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  expectedCloseDate?: Date;

  @ApiPropertyOptional({
    description: 'Actual close date',
    example: '2024-12-15T00:00:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  actualCloseDate?: Date;

  @ApiProperty({
    description: 'Sale creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Sale last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  updatedAt!: Date;
}

export class SalesSummaryDto {
  @ApiProperty({
    description: 'Total number of sales',
    example: 25,
    type: 'number'
  })
  totalSales: number;

  @ApiProperty({
    description: 'Total revenue',
    example: 12500.00,
    type: 'number'
  })
  totalRevenue: number;

  @ApiProperty({
    description: 'Total paid amount',
    example: 10000.00,
    type: 'number'
  })
  totalPaid: number;

  @ApiProperty({
    description: 'Number of pending sales',
    example: 5,
    type: 'number'
  })
  pendingSales: number;

  @ApiProperty({
    description: 'Number of completed sales',
    example: 20,
    type: 'number'
  })
  completedSales: number;
}
