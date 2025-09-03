import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true' || false,
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password',
  },
  from: process.env.EMAIL_FROM || '"SchoolMart" <noreply@schoolmart.com>',
  templates: {
    otp: {
      subject: 'Your OTP for SchoolMart',
      template: 'otp-verification',
    },
    welcome: {
      subject: 'Welcome to SchoolMart!',
      template: 'welcome-email',
    },
    passwordReset: {
      subject: 'Reset Your SchoolMart Password',
      template: 'password-reset',
    },
  },
}));
