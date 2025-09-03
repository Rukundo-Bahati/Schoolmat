import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../common/entities/user.entity';
import { CreateUserDto, LoginDto, UserResponseDto, SendOtpDto, VerifyOtpContactDto, ResetPasswordWithOtpDto, ChangePasswordDto } from '../common/dto/user.dto';
import { DefinedApiResponse } from '../common/dto/api-response.dto';
import { jwtConfig } from '../config/jwt.config';
import { EmailService } from '../email/email.service';
import { SMSService } from '../sms/sms.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
    private smsService: SMSService,
  ) {}

  async validateUser(userId: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id: userId } });
  }

  async register(createUserDto: CreateUserDto): Promise<DefinedApiResponse> {
    const { email, password, ...userData } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      ...userData,
    });

    const savedUser = await this.userRepository.save(user);

    // Generate and send OTP for email verification
    const otp = this.emailService.generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    savedUser.otp = otp;
    savedUser.otpExpiresAt = otpExpiresAt;
    await this.userRepository.save(savedUser);

    // Send OTP via email only
    const emailSent = await this.emailService.sendOTPEmail({
      email: savedUser.email,
      otp,
      firstName: savedUser.firstName || 'User',
    });

    if (!emailSent) {
      throw new BadRequestException('Failed to send verification OTP. Please try again.');
    }

    // Return success response without user details
    return new DefinedApiResponse(
      true,
      undefined,
      { message: 'Registration successful! Please check your email for OTP verification.' }
    );
  }

  async login(loginDto: LoginDto): Promise<{ user: UserResponseDto; access_token: string }> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    // Return user without password
    const { password: _, ...userResponse } = user;
    return { user: userResponse as UserResponseDto, access_token };
  }

  async generateOtp(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Generate 6-digit OTP using EmailService
    const otp = this.emailService.generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await this.userRepository.save(user);

    // Send OTP via email using EmailService
    const emailSent = await this.emailService.sendOTPEmail({
      email: user.email,
      otp,
      firstName: user.firstName || 'User',
    });

    if (!emailSent) {
      throw new BadRequestException('Failed to send OTP email. Please try again.');
    }
  }

  async verifyOtp(email: string, otp: string): Promise<{ user: UserResponseDto; access_token: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !user.otp || user.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    // Clear OTP and mark email as verified
    user.otp = null;
    user.otpExpiresAt = null;
    user.isEmailVerified = true;
    await this.userRepository.save(user);

    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    // Return user without password
    const { password: _, ...userResponse } = user;
    return { user: userResponse as UserResponseDto, access_token };
  }

  async verifyOtpOnly(otp: string): Promise<{ user: UserResponseDto; access_token: string }> {
    const user = await this.userRepository.findOne({ where: { otp } });
    if (!user || !user.otp || user.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    // Clear OTP and mark email as verified
    user.otp = null;
    user.otpExpiresAt = null;
    user.isEmailVerified = true;
    await this.userRepository.save(user);

    // Send welcome email
    await this.emailService.sendWelcomeEmail({
      email: user.email,
      firstName: user.firstName || 'User',
    });

    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    // Return user without password
    const { password: _, ...userResponse } = user;
    return { user: userResponse as UserResponseDto, access_token };
  }

  async verifyEmail(email: string, otp: string): Promise<{ user: UserResponseDto; access_token: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.otp || user.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    // Clear OTP and mark email as verified
    user.otp = null;
    user.otpExpiresAt = null;
    user.isEmailVerified = true;
    await this.userRepository.save(user);

    // Send welcome email
    await this.emailService.sendWelcomeEmail({
      email: user.email,
      firstName: user.firstName || 'User',
    });

    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    // Return user without password
    const { password: _, ...userResponse } = user;
    return { user: userResponse as UserResponseDto, access_token };
  }

  async sendOtp(sendOtpDto: SendOtpDto): Promise<void> {
    const { contact } = sendOtpDto;

    // Determine if contact is email or phone
    const isEmail = contact.includes('@');

    let user: User | null = null;

    if (isEmail) {
      user = await this.userRepository.findOne({ where: { email: contact } });
    } else {
      user = await this.userRepository.findOne({ where: { phone: contact } });
    }

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Generate 6-digit OTP
    const otp = this.emailService.generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await this.userRepository.save(user);

    // Send OTP via email only
    const emailSent = await this.emailService.sendOTPEmail({
      email: user.email,
      otp,
      firstName: user.firstName || 'User',
    });

    if (!emailSent) {
      throw new BadRequestException('Failed to send OTP. Please try again.');
    }
  }

  async verifyOtpContact(verifyOtpContactDto: VerifyOtpContactDto): Promise<{ user: UserResponseDto; access_token: string }> {
    const { contact, otp } = verifyOtpContactDto;

    // Determine if contact is email or phone
    const isEmail = contact.includes('@');

    let user: User | null = null;

    if (isEmail) {
      user = await this.userRepository.findOne({ where: { email: contact } });
    } else {
      user = await this.userRepository.findOne({ where: { phone: contact } });
    }

    if (!user || !user.otp || user.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    // Clear OTP and mark as verified
    user.otp = null;
    user.otpExpiresAt = null;
    if (isEmail) {
      user.isEmailVerified = true;
    }
    await this.userRepository.save(user);

    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    // Return user without password
    const { password: _, ...userResponse } = user;
    return { user: userResponse as UserResponseDto, access_token };
  }

  async resetPasswordWithOtp(resetPasswordWithOtpDto: ResetPasswordWithOtpDto): Promise<{ message: string }> {
    const { email, otp, newPassword } = resetPasswordWithOtpDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !user.otp || user.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password and clear OTP
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiresAt = null;
    await this.userRepository.save(user);

    return { message: 'Password reset successfully' };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    user.password = hashedNewPassword;
    await this.userRepository.save(user);

    return { message: 'Password changed successfully' };
  }
}
