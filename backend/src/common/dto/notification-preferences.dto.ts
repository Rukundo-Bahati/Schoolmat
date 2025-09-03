import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateNotificationPreferencesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  smsNotifications?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  orderConfirmations?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  paymentReminders?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  lowStockAlerts?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  deliveryUpdates?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  marketingEmails?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  emailRecipients?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  smsRecipients?: string;
}
