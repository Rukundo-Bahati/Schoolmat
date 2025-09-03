import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { CreatePaymentMethodDto, UpdatePaymentMethodDto } from '../../common/dto/payment-method.dto';
import { UpdateNotificationPreferencesDto } from '../../common/dto/notification-preferences.dto';
import { UpdateSystemPreferencesDto } from '../../common/dto/system-preferences.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { UserRole } from '../../common/entities/user.entity';

@ApiTags('settings')
@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SCHOOL_MANAGER)
@ApiBearerAuth('JWT-auth')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // Payment Methods
  @Get('payment-methods')
  @ApiOperation({ summary: 'Get all payment methods' })
  @ApiResponse({
    status: 200,
    description: 'Payment methods retrieved successfully'
  })
  findAllPaymentMethods() {
    return this.settingsService.findAllPaymentMethods();
  }

  @Get('payment-methods/:id')
  @ApiOperation({ summary: 'Get payment method by ID' })
  @ApiResponse({
    status: 200,
    description: 'Payment method retrieved successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'Payment method not found'
  })
  findPaymentMethodById(@Param('id') id: string) {
    return this.settingsService.findPaymentMethodById(id);
  }

  @Post('payment-methods')
  @ApiOperation({ summary: 'Create a new payment method' })
  @ApiResponse({
    status: 201,
    description: 'Payment method created successfully'
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error'
  })
  createPaymentMethod(@Body() createPaymentMethodDto: CreatePaymentMethodDto) {
    return this.settingsService.createPaymentMethod(createPaymentMethodDto);
  }

  @Patch('payment-methods/:id')
  @ApiOperation({ summary: 'Update payment method' })
  @ApiResponse({
    status: 200,
    description: 'Payment method updated successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'Payment method not found'
  })
  updatePaymentMethod(
    @Param('id') id: string,
    @Body() updatePaymentMethodDto: UpdatePaymentMethodDto
  ) {
    return this.settingsService.updatePaymentMethod(id, updatePaymentMethodDto);
  }

  @Delete('payment-methods/:id')
  @ApiOperation({ summary: 'Delete payment method' })
  @ApiResponse({
    status: 200,
    description: 'Payment method deleted successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'Payment method not found'
  })
  removePaymentMethod(@Param('id') id: string) {
    return this.settingsService.removePaymentMethod(id);
  }

  // Notification Preferences
  @Get('notifications')
  @ApiOperation({ summary: 'Get notification preferences' })
  @ApiResponse({
    status: 200,
    description: 'Notification preferences retrieved successfully'
  })
  findNotificationPreferences() {
    return this.settingsService.findNotificationPreferences();
  }

  @Patch('notifications')
  @ApiOperation({ summary: 'Update notification preferences' })
  @ApiResponse({
    status: 200,
    description: 'Notification preferences updated successfully'
  })
  updateNotificationPreferences(@Body() updateDto: UpdateNotificationPreferencesDto) {
    return this.settingsService.updateNotificationPreferences(updateDto);
  }

  // System Preferences
  @Get('system')
  @ApiOperation({ summary: 'Get system preferences' })
  @ApiResponse({
    status: 200,
    description: 'System preferences retrieved successfully'
  })
  findSystemPreferences() {
    return this.settingsService.findSystemPreferences();
  }

  @Patch('system')
  @ApiOperation({ summary: 'Update system preferences' })
  @ApiResponse({
    status: 200,
    description: 'System preferences updated successfully'
  })
  updateSystemPreferences(@Body() updateDto: UpdateSystemPreferencesDto) {
    return this.settingsService.updateSystemPreferences(updateDto);
  }

  // Business Settings
  @Get('business')
  @ApiOperation({ summary: 'Get business settings' })
  @ApiResponse({
    status: 200,
    description: 'Business settings retrieved successfully'
  })
  findBusinessSettings() {
    return this.settingsService.findBusinessSettings();
  }

  @Put('business')
  @ApiOperation({ summary: 'Update business settings' })
  @ApiResponse({
    status: 200,
    description: 'Business settings updated successfully'
  })
  updateBusinessSettings(@Body() businessSettings: any) {
    return this.settingsService.updateBusinessSettings(businessSettings);
  }

  // Payment Methods (alternative endpoint)
  @Get('payments')
  @ApiOperation({ summary: 'Get all payment methods' })
  @ApiResponse({
    status: 200,
    description: 'Payment methods retrieved successfully'
  })
  findAllPayments() {
    return this.settingsService.findAllPaymentMethods();
  }

  @Put('payments')
  @ApiOperation({ summary: 'Update payment methods' })
  @ApiResponse({
    status: 200,
    description: 'Payment methods updated successfully'
  })
  updatePaymentMethods(@Body() methods: any[]) {
    return this.settingsService.updatePaymentMethodsBulk(methods);
  }

  // Data Export
  @Get('export')
  @ApiOperation({ summary: 'Export system data' })
  @ApiResponse({
    status: 200,
    description: 'Data export initiated'
  })
  exportData(@Query('type') type: string = 'all') {
    return this.settingsService.exportData(type);
  }

  // System Reset
  @Post('reset')
  @ApiOperation({ summary: 'Reset system' })
  @ApiResponse({
    status: 200,
    description: 'System reset initiated'
  })
  resetSystem(@Body() body: { confirmReset: boolean }) {
    return this.settingsService.resetSystem(body.confirmReset);
  }
}
