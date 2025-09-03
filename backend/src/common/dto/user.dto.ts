import { IsEmail, IsString, IsOptional, IsEnum, IsPhoneNumber, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, UserStatus } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    type: 'string'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    type: 'string',
    minLength: 6
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    type: 'string'
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    type: 'string'
  })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+1234567890',
    type: 'string'
  })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiPropertyOptional({
    description: 'User role',
    example: UserRole.PARENT,
    enum: UserRole,
    default: UserRole.PARENT
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User first name',
    example: 'John',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Doe',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+1234567890',
    type: 'string'
  })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiPropertyOptional({
    description: 'User profile image URL',
    example: 'https://example.com/profile.jpg',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  profileImageUrl?: string;
}

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    type: 'string'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    type: 'string'
  })
  @IsString()
  password: string;
}

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password',
    example: 'oldpassword123',
    type: 'string'
  })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description: 'New password',
    example: 'newpassword123',
    type: 'string',
    minLength: 6
  })
  @IsString()
  newPassword: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'User email address for password reset',
    example: 'john.doe@example.com',
    type: 'string'
  })
  @IsEmail()
  email: string;
}

export class VerifyOtpDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    type: 'string'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'OTP code received via email',
    example: '123456',
    type: 'string'
  })
  @IsString()
  otp: string;
}

export class VerifyOtpOnlyDto {
  @ApiProperty({
    description: 'OTP code received via email',
    example: '123456',
    type: 'string'
  })
  @IsString()
  otp: string;
}

export class ResetPasswordWithOtpDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    type: 'string'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'OTP code received via email',
    example: '123456',
    type: 'string'
  })
  @IsString()
  otp: string;

  @ApiProperty({
    description: 'New password',
    example: 'newpassword123',
    type: 'string',
    minLength: 6
  })
  @IsString()
  newPassword: string;
}

export class SendOtpDto {
  @ApiProperty({
    description: 'User email or phone number for OTP',
    example: 'john.doe@example.com or +1234567890',
    type: 'string'
  })
  @IsString()
  contact: string;
}

export class VerifyOtpContactDto {
  @ApiProperty({
    description: 'User email or phone number',
    example: 'john.doe@example.com or +1234567890',
    type: 'string'
  })
  @IsString()
  contact: string;

  @ApiProperty({
    description: 'OTP code received via email or SMS',
    example: '123456',
    type: 'string'
  })
  @IsString()
  otp: string;
}

export class VerifyOtpUnifiedDto {
  @ApiPropertyOptional({
    description: 'User email address (optional if using phone or OTP only)',
    example: 'john.doe@example.com',
    type: 'string'
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'User phone number (optional if using email or OTP only)',
    example: '+1234567890',
    type: 'string'
  })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({
    description: 'OTP code received via email or SMS',
    example: '123456',
    type: 'string'
  })
  @IsString()
  otp: string;
}

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: 'uuid-string',
    type: 'string'
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    type: 'string'
  })
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    type: 'string'
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    type: 'string'
  })
  lastName: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+1234567890',
    type: 'string'
  })
  phone?: string;

  @ApiProperty({
    description: 'User role',
    example: UserRole.PARENT,
    enum: UserRole
  })
  role: UserRole;

  @ApiProperty({
    description: 'User status',
    example: UserStatus.ACTIVE,
    enum: UserStatus
  })
  status: UserStatus;

  @ApiProperty({
    description: 'Email verification status',
    example: true,
    type: 'boolean'
  })
  isEmailVerified: boolean;

  @ApiPropertyOptional({
    description: 'User profile image URL',
    example: 'https://example.com/profile.jpg',
    type: 'string'
  })
  profileImageUrl?: string;

  @ApiPropertyOptional({
    description: 'User address',
    example: '123 Main St, City, State 12345',
    type: 'string'
  })
  address?: string;

  @ApiProperty({
    description: 'Account creation date',
    example: '2023-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Account last update date',
    example: '2023-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  updatedAt: Date;
}
