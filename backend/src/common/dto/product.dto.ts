import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'School Notebook',
    type: 'string'
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'High-quality school notebook with 200 pages',
    type: 'string'
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Product price',
    example: 15.99,
    type: 'number',
    minimum: 0
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

  @ApiProperty({
    description: 'Stock quantity',
    example: 100,
    type: 'number',
    minimum: 0
  })
  @IsNumber()
  stock: number;

  @ApiProperty({
    description: 'Product image URL',
    example: 'https://example.com/notebook.jpg',
    type: 'string'
  })
  @IsString()
  imageUrl: string;

  @ApiProperty({
    description: 'Product supplier',
    example: 'ABC Stationery Co.',
    type: 'string'
  })
  @IsString()
  supplier: string;

  @ApiProperty({
    description: 'Minimum stock level',
    example: 10,
    type: 'number',
    minimum: 0
  })
  @IsNumber()
  minStock: number;

  @ApiProperty({
    description: 'Is product required',
    example: true,
    type: 'boolean'
  })
  @IsBoolean()
  required: boolean;

  @ApiProperty({
    description: 'Product rating',
    example: 4.5,
    type: 'number',
    minimum: 0,
    maximum: 5
  })
  @IsNumber()
  rating: number;

  @ApiProperty({
    description: 'Number of reviews',
    example: 25,
    type: 'number',
    minimum: 0
  })
  @IsNumber()
  reviews: number;
}

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Product name',
    example: 'School Notebook',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'High-quality school notebook with 200 pages',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Product price',
    example: 15.99,
    type: 'number',
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({
    description: 'Product category',
    example: 'Stationery',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Stock quantity',
    example: 100,
    type: 'number',
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  stock?: number;

  @ApiPropertyOptional({
    description: 'Product image URL',
    example: 'https://example.com/notebook.jpg',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Is product active',
    example: true,
    type: 'boolean'
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Product rating',
    example: 4.5,
    type: 'number',
    minimum: 0,
    maximum: 5
  })
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiPropertyOptional({
    description: 'Number of reviews',
    example: 25,
    type: 'number',
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  reviews?: number;
}

export class ProductResponseDto {
  @ApiProperty({
    description: 'Product ID',
    example: 'uuid-string',
    type: 'string'
  })
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'School Notebook',
    type: 'string'
  })
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'High-quality school notebook with 200 pages',
    type: 'string'
  })
  description: string;

  @ApiProperty({
    description: 'Product price',
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
    description: 'Stock quantity',
    example: 100,
    type: 'number'
  })
  stock: number;

  @ApiProperty({
    description: 'Product image URL',
    example: 'https://example.com/notebook.jpg',
    type: 'string'
  })
  imageUrl: string;

  @ApiProperty({
    description: 'Product supplier',
    example: 'ABC Stationery Co.',
    type: 'string'
  })
  supplier: string;

  @ApiProperty({
    description: 'Minimum stock level',
    example: 10,
    type: 'number'
  })
  minStock: number;

  @ApiProperty({
    description: 'Is product required',
    example: true,
    type: 'boolean'
  })
  required: boolean;

  @ApiProperty({
    description: 'Product rating',
    example: 4.5,
    type: 'number'
  })
  rating: number;

  @ApiProperty({
    description: 'Number of reviews',
    example: 25,
    type: 'number'
  })
  reviews: number;

  @ApiProperty({
    description: 'Product last updated timestamp',
    example: '2023-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  lastUpdated: Date;
}
