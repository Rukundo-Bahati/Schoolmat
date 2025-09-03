import { IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Notebooks & Paper',
    type: 'string'
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Category image URL',
    example: 'https://example.com/notebooks.jpg',
    type: 'string'
  })
  @IsString()
  imageUrl: string;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    description: 'Category name',
    example: 'Notebooks & Paper',
    type: 'string'
  })
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Category image URL',
    example: 'https://example.com/notebooks.jpg',
    type: 'string'
  })
  @IsString()
  imageUrl?: string;
}

export class CategoryResponseDto {
  @ApiProperty({
    description: 'Category ID',
    example: 'uuid-string',
    type: 'string'
  })
  id: string;

  @ApiProperty({
    description: 'Category name',
    example: 'Notebooks & Paper',
    type: 'string'
  })
  name: string;

  @ApiProperty({
    description: 'Category image URL',
    example: 'https://example.com/notebooks.jpg',
    type: 'string'
  })
  imageUrl: string;

  @ApiProperty({
    description: 'Category creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  createdAt: Date;
}
