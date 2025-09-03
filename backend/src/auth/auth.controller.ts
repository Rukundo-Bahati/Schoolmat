import { Controller, Post, Body, UseGuards, Request, Get, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto, ResetPasswordDto, VerifyOtpDto, VerifyOtpOnlyDto, UserResponseDto, ResetPasswordWithOtpDto, ChangePasswordDto } from '../common/dto/user.dto';
import { DefinedApiResponse } from '../common/dto/api-response.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered with OTP sent',
    type: DefinedApiResponse
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error or email sending failed'
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists'
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        },
        user: {
          $ref: '#/components/schemas/UserResponseDto'
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials'
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('generate-otp')
  @ApiOperation({ summary: 'Generate OTP for password reset' })
  @ApiResponse({
    status: 200,
    description: 'OTP sent successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'OTP sent to your email'
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'User not found'
  })
  async generateOtp(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.generateOtp(resetPasswordDto.email);
    return { message: 'OTP sent to your email' };
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP and reset password' })
  @ApiResponse({
    status: 200,
    description: 'OTP verified successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Password reset successful'
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid OTP'
  })
  @ApiResponse({
    status: 404,
    description: 'User not found'
  })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify email with OTP' })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        },
        user: {
          $ref: '#/components/schemas/UserResponseDto'
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid OTP or OTP expired'
  })
  @ApiResponse({
    status: 404,
    description: 'User not found'
  })
  async verifyEmail(@Body() verifyOtpOnlyDto: VerifyOtpOnlyDto) {
    return this.authService.verifyOtpOnly(verifyOtpOnlyDto.otp);
  }

  @Post('send-verification-email')
  @ApiOperation({ summary: 'Send verification OTP to email' })
  @ApiResponse({
    status: 200,
    description: 'OTP sent successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'OTP sent to your email'
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'User not found'
  })
  async sendVerificationEmail(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.generateOtp(resetPasswordDto.email);
    return { message: 'OTP sent to your email' };
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with OTP' })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Password reset successfully'
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid OTP or OTP expired'
  })
  @ApiResponse({
    status: 404,
    description: 'User not found'
  })
  async resetPassword(@Body() resetPasswordWithOtpDto: ResetPasswordWithOtpDto) {
    return this.authService.resetPasswordWithOtp(resetPasswordWithOtpDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Password changed successfully'
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid current password or validation error'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Request() req) {
    return this.authService.changePassword(req.user.id, changePasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  getProfile(@Request() req) {
    return req.user;
  }
}
