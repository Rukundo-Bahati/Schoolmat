import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { PaymentMethod } from '../../common/entities/payment-method.entity';
import { NotificationPreferences } from '../../common/entities/notification-preferences.entity';
import { SystemPreferences } from '../../common/entities/system-preferences.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentMethod, NotificationPreferences, SystemPreferences]),
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
