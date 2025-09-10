import { IsEnum, IsOptional, IsBoolean, IsInt, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Theme, Language, OrderStatus } from '../entities/system-preferences.entity';

export class UpdateSystemPreferencesDto {
  // Order Management
  @ApiPropertyOptional({ enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  defaultOrderStatus?: OrderStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  autoApproveOrders?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  lowStockThreshold?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  dataRetentionPeriod?: number;

  // UI Preferences
  @ApiPropertyOptional({ enum: Theme })
  @IsOptional()
  @IsEnum(Theme)
  theme?: Theme;

  @ApiPropertyOptional({ enum: Language })
  @IsOptional()
  @IsEnum(Language)
  language?: Language;

  // System Settings
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  autoSave?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  sessionTimeout?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  enableAnalytics?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  enableBackups?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  backupFrequency?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  maintenanceMode?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  maintenanceMessage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  itemsPerPage?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  timezone?: string;
}
