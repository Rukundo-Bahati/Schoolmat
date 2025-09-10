import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SMSService } from './sms.service';

@Module({
  imports: [ConfigModule],
  providers: [SMSService],
  exports: [SMSService],
})
export class SMSModule {}
