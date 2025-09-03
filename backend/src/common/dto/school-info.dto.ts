import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSchoolInfoDto {
  @ApiProperty({
    description: 'School name',
    example: 'SchoolMart Academy',
    type: 'string'
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'School email',
    example: 'support@schoolmart.rw',
    type: 'string'
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'School phone number',
    example: '+250788123456',
    type: 'string'
  })
  @IsString()
  phone: string;

  @ApiPropertyOptional({
    description: 'School Airtel number',
    example: '+250788123456',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  airtelNumber?: string;

  @ApiPropertyOptional({
    description: 'School MTN number',
    example: '+250788123456',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  mtnNumber?: string;

  @ApiPropertyOptional({
    description: 'School MoMo code',
    example: '123456',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  momoCode?: string;

  @ApiPropertyOptional({
    description: 'School location',
    example: 'Kigali, Rwanda',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: 'School address',
    example: 'KG 123 Street, Kigali, Rwanda',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Order processing time in minutes',
    example: 30,
    type: 'number'
  })
  @IsOptional()
  orderProcessingTime?: number;

  @ApiPropertyOptional({
    description: 'Currency code (ISO format)',
    example: 'RWF',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  currency?: string;
}

export class UpdateSchoolInfoDto {
  @ApiPropertyOptional({
    description: 'School name',
    example: 'SchoolMart Academy',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'School email',
    example: 'support@schoolmart.rw',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    description: 'School phone number',
    example: '+250788123456',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'School Airtel number',
    example: '+250788123456',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  airtelNumber?: string;

  @ApiPropertyOptional({
    description: 'School MTN number',
    example: '+250788123456',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  mtnNumber?: string;

  @ApiPropertyOptional({
    description: 'School MoMo code',
    example: '123456',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  momoCode?: string;

  @ApiPropertyOptional({
    description: 'School location',
    example: 'Kigali, Rwanda',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: 'School address',
    example: 'KG 123 Street, Kigali, Rwanda',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Order processing time in minutes',
    example: 30,
    type: 'number'
  })
  @IsOptional()
  orderProcessingTime?: number;

  @ApiPropertyOptional({
    description: 'Currency code (ISO format)',
    example: 'RWF',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  currency?: string;
}

export class SchoolInfoResponseDto {
  @ApiProperty({
    description: 'School info ID',
    example: 'uuid-string',
    type: 'string'
  })
  id: string;

  @ApiProperty({
    description: 'School name',
    example: 'SchoolMart Academy',
    type: 'string'
  })
  name: string;

  @ApiProperty({
    description: 'School email',
    example: 'support@schoolmart.rw',
    type: 'string'
  })
  email: string;

  @ApiProperty({
    description: 'School phone number',
    example: '+250788123456',
    type: 'string'
  })
  phone: string;

  @ApiPropertyOptional({
    description: 'School Airtel number',
    example: '+250788123456',
    type: 'string'
  })
  airtelNumber?: string;

  @ApiPropertyOptional({
    description: 'School MTN number',
    example: '+250788123456',
    type: 'string'
  })
  mtnNumber?: string;

  @ApiPropertyOptional({
    description: 'School MoMo code',
    example: '123456',
    type: 'string'
  })
  momoCode?: string;

  @ApiPropertyOptional({
    description: 'School location',
    example: 'Kigali, Rwanda',
    type: 'string'
  })
  location?: string;

  @ApiPropertyOptional({
    description: 'School address',
    example: 'KG 123 Street, Kigali, Rwanda',
    type: 'string'
  })
  address?: string;

  @ApiPropertyOptional({
    description: 'Order processing time in minutes',
    example: 30,
    type: 'number'
  })
  orderProcessingTime?: number;

  @ApiPropertyOptional({
    description: 'Currency code (ISO format)',
    example: 'RWF',
    type: 'string'
  })
  currency?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  updatedAt: Date;
}
