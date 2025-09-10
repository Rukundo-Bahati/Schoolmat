import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType, NotificationStatus } from '../entities/notification.entity';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Notification title',
    example: 'Order Delivered',
    type: 'string'
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Notification message',
    example: 'Your order #1234 has been delivered.',
    type: 'string'
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Notification type',
    example: NotificationType.ORDER,
    enum: NotificationType,
    default: NotificationType.GENERAL
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiPropertyOptional({
    description: 'Associated order ID',
    example: 'uuid-string',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  orderId?: string;
}

export class UpdateNotificationStatusDto {
  @ApiProperty({
    description: 'Notification status',
    example: NotificationStatus.UNREAD,
    enum: NotificationStatus,
    default: NotificationStatus.UNREAD
  })
  @IsEnum(NotificationStatus)
  status: NotificationStatus;
}

export class NotificationResponseDto {
  @ApiProperty({
    description: 'Notification ID',
    example: 'uuid-string',
    type: 'string'
  })
  id: string;

  @ApiProperty({
    description: 'User ID associated with the notification',
    example: 'uuid-string',
    type: 'string'
  })
  userId: string;

  @ApiProperty({
    description: 'Notification title',
    example: 'Order Delivered',
    type: 'string'
  })
  title: string;

  @ApiProperty({
    description: 'Notification message',
    example: 'Your order #1234 has been delivered.',
    type: 'string'
  })
  message: string;

  @ApiProperty({
    description: 'Notification type',
    example: NotificationType.ORDER,
    enum: NotificationType
  })
  type: NotificationType;

  @ApiProperty({
    description: 'Notification status',
    example: NotificationStatus.UNREAD,
    enum: NotificationStatus
  })
  status: NotificationStatus;

  @ApiPropertyOptional({
    description: 'Associated order ID',
    example: 'uuid-string',
    type: 'string'
  })
  orderId?: string;

  @ApiProperty({
    description: 'Notification creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  createdAt: Date;
}
