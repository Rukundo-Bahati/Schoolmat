import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';

export interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

export interface OTPEmailData {
  email: string;
  otp: string;
  firstName: string;
}

export interface WelcomeEmailData {
  email: string;
  firstName: string;
}

export interface PasswordResetEmailData {
  email: string;
  firstName: string;
  resetToken: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const emailConfig = this.configService.get('email');

    this.logger.log(`Initializing email transporter with host: ${emailConfig.host}, port: ${emailConfig.port}, secure: ${emailConfig.secure}`);

    this.transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.auth.user,
        pass: emailConfig.auth.pass,
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
      },
    });

    // Verify connection
    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error('Email transporter verification failed:', error);
        this.logger.error('Email config:', {
          host: emailConfig.host,
          port: emailConfig.port,
          secure: emailConfig.secure,
          user: emailConfig.auth.user,
          hasPassword: !!emailConfig.auth.pass,
        });
      } else {
        this.logger.log('Email transporter is ready to send emails');
      }
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const emailConfig = this.configService.get('email');

      const mailOptions = {
        from: emailConfig.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      this.logger.log(`Attempting to send email to ${options.to} with subject: ${options.subject}`);
      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully to ${options.to}: ${result.messageId}`);

      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}:`, error);
      this.logger.error('Error details:', {
        message: error.message,
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode,
      });
      return false;
    }
  }

  async sendOTPEmail(data: OTPEmailData): Promise<boolean> {
    const emailConfig = this.configService.get('email');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>OTP Verification - SchoolMart</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background-color: #f9f9f9; }
            .otp-code { font-size: 32px; font-weight: bold; color: #4F46E5; text-align: center; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>SchoolMart</h1>
              <p>Email Verification</p>
            </div>
            <div class="content">
              <h2>Hello ${data.firstName}!</h2>
              <p>Thank you for registering with SchoolMart. To complete your registration, please use the following One-Time Password (OTP):</p>

              <div class="otp-code">${data.otp}</div>

              <p><strong>Important:</strong> This OTP will expire in 10 minutes for security reasons.</p>

              <p>If you didn't request this verification, please ignore this email.</p>

              <p>Best regards,<br>The SchoolMart Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>&copy; 2024 SchoolMart. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
      Hello ${data.firstName}!

      Thank you for registering with SchoolMart. To complete your registration, please use the following One-Time Password (OTP):

      ${data.otp}

      Important: This OTP will expire in 10 minutes for security reasons.

      If you didn't request this verification, please ignore this email.

      Best regards,
      The SchoolMart Team
    `;

    return this.sendEmail({
      to: data.email,
      subject: emailConfig.templates.otp.subject,
      html,
      text,
    });
  }

  async sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
    const emailConfig = this.configService.get('email');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to SchoolMart</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background-color: #f9f9f9; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to SchoolMart!</h1>
            </div>
            <div class="content">
              <h2>Hello ${data.firstName}!</h2>
              <p>Welcome to SchoolMart! Your account has been successfully verified and activated.</p>

              <p>You can now:</p>
              <ul>
                <li>Browse and purchase school supplies</li>
                <li>Track your orders</li>
                <li>Manage your profile</li>
                <li>Access exclusive deals and offers</li>
              </ul>

              <p>Start shopping now and enjoy a seamless experience with us!</p>

              <p>Best regards,<br>The SchoolMart Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>&copy; 2024 SchoolMart. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
      Hello ${data.firstName}!

      Welcome to SchoolMart! Your account has been successfully verified and activated.

      You can now:
      - Browse and purchase school supplies
      - Track your orders
      - Manage your profile
      - Access exclusive deals and offers

      Start shopping now and enjoy a seamless experience with us!

      Best regards,
      The SchoolMart Team
    `;

    return this.sendEmail({
      to: data.email,
      subject: emailConfig.templates.welcome.subject,
      html,
      text,
    });
  }

  async sendPasswordResetEmail(data: PasswordResetEmailData): Promise<boolean> {
    const emailConfig = this.configService.get('email');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset - SchoolMart</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background-color: #f9f9f9; }
            .reset-link { display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>SchoolMart</h1>
              <p>Password Reset Request</p>
            </div>
            <div class="content">
              <h2>Hello ${data.firstName}!</h2>
              <p>You have requested to reset your password for your SchoolMart account.</p>

              <p>Please click the button below to reset your password:</p>

              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${data.resetToken}" class="reset-link">
                Reset Password
              </a>

              <p><strong>Important:</strong> This link will expire in 1 hour for security reasons.</p>

              <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>

              <p>Best regards,<br>The SchoolMart Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>&copy; 2024 SchoolMart. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
      Hello ${data.firstName}!

      You have requested to reset your password for your SchoolMart account.

      Please use the following link to reset your password:
      ${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${data.resetToken}

      Important: This link will expire in 1 hour for security reasons.

      If you didn't request this password reset, please ignore this email. Your password will remain unchanged.

      Best regards,
      The SchoolMart Team
    `;

    return this.sendEmail({
      to: data.email,
      subject: emailConfig.templates.passwordReset.subject,
      html,
      text,
    });
  }

  generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString();
  }
}
