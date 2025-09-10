import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { User } from '../common/entities/user.entity';
import { Order } from '../common/entities/order.entity';
import { Notification } from '../common/entities/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Order, Notification])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
