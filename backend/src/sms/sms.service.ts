import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import twilio from 'twilio';

export interface SMSOptions {
  to: string;
  message: string;
}

export interface OTPSMSData {
  phone: string;
  otp: string;
  firstName: string;
}

@Injectable()
export class SMSService {
  private readonly logger = new Logger(SMSService.name);
  private twilioClient: twilio.Twilio;

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');

    if (accountSid && authToken) {
      this.twilioClient = twilio(accountSid, authToken);
      this.logger.log('Twilio client initialized successfully');
    } else {
      this.logger.warn('Twilio credentials not found. SMS will be logged only.');
    }
  }

  async sendSMS(options: SMSOptions): Promise<boolean> {
    try {
      // If Twilio is not configured, fall back to logging
      if (!this.twilioClient) {
        this.logger.log(`SMS would be sent to ${options.to}: ${options.message}`);
        return true;
      }

      const fromNumber = this.configService.get<string>('TWILIO_PHONE_NUMBER');

      if (!fromNumber) {
        this.logger.error('TWILIO_PHONE_NUMBER not configured');
        return false;
      }

      // Validate that 'to' and 'from' numbers are not the same
      if (options.to === fromNumber) {
        this.logger.error(`Cannot send SMS: 'To' number (${options.to}) and 'From' number (${fromNumber}) cannot be the same`);
        return false;
      }

      const result = await this.twilioClient.messages.create({
        body: options.message,
        from: fromNumber,
        to: options.to
      });

      this.logger.log(`SMS sent successfully to ${options.to}: ${result.sid}`);
      return true;

    } catch (error) {
      this.logger.error(`Failed to send SMS to ${options.to}:`, error);
      return false;
    }
  }

  async sendOTPSMS(data: OTPSMSData): Promise<boolean> {
    const message = `Hello ${data.firstName}! Your SchoolMart verification code is: ${data.otp}. This code will expire in 10 minutes.`;

    return this.sendSMS({
      to: data.phone,
      message,
    });
  }

  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
