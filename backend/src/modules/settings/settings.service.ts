import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethod } from '../../common/entities/payment-method.entity';
import { NotificationPreferences } from '../../common/entities/notification-preferences.entity';
import { SystemPreferences, Theme, Language } from '../../common/entities/system-preferences.entity';
import { CreatePaymentMethodDto, UpdatePaymentMethodDto } from '../../common/dto/payment-method.dto';
import { UpdateNotificationPreferencesDto } from '../../common/dto/notification-preferences.dto';
import { UpdateSystemPreferencesDto } from '../../common/dto/system-preferences.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(PaymentMethod)
    private paymentMethodRepository: Repository<PaymentMethod>,
    @InjectRepository(NotificationPreferences)
    private notificationPreferencesRepository: Repository<NotificationPreferences>,
    @InjectRepository(SystemPreferences)
    private systemPreferencesRepository: Repository<SystemPreferences>,
  ) {}

  // Payment Methods
  async findAllPaymentMethods(): Promise<PaymentMethod[]> {
    return this.paymentMethodRepository.find({
      order: { sortOrder: 'ASC', createdAt: 'ASC' }
    });
  }

  async findPaymentMethodById(id: string): Promise<PaymentMethod> {
    const paymentMethod = await this.paymentMethodRepository.findOne({ where: { id } });
    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }
    return paymentMethod;
  }

  async createPaymentMethod(createPaymentMethodDto: CreatePaymentMethodDto): Promise<PaymentMethod> {
    const paymentMethod = this.paymentMethodRepository.create(createPaymentMethodDto);
    return this.paymentMethodRepository.save(paymentMethod);
  }

  async updatePaymentMethod(id: string, updatePaymentMethodDto: UpdatePaymentMethodDto): Promise<PaymentMethod> {
    const paymentMethod = await this.findPaymentMethodById(id);
    Object.assign(paymentMethod, updatePaymentMethodDto);
    return this.paymentMethodRepository.save(paymentMethod);
  }

  async removePaymentMethod(id: string): Promise<void> {
    const paymentMethod = await this.findPaymentMethodById(id);
    await this.paymentMethodRepository.remove(paymentMethod);
  }

  async updatePaymentMethodsBulk(methods: PaymentMethod[]): Promise<PaymentMethod[]> {
    const updatedMethods: PaymentMethod[] = [];
    for (const method of methods) {
      if (method.id) {
        const existing = await this.findPaymentMethodById(method.id);
        Object.assign(existing, method);
        updatedMethods.push(await this.paymentMethodRepository.save(existing));
      } else {
        const newMethod = this.paymentMethodRepository.create(method);
        updatedMethods.push(await this.paymentMethodRepository.save(newMethod));
      }
    }
    return updatedMethods;
  }

  // Notification Preferences
  async findNotificationPreferences(): Promise<NotificationPreferences> {
    const preferences = await this.notificationPreferencesRepository.findOne({ where: {} });
    if (!preferences) {
      // Create default preferences if none exist
      const defaultPrefs = this.notificationPreferencesRepository.create({
        emailNotifications: true,
        smsNotifications: true,
        orderConfirmations: true,
        paymentReminders: true,
        lowStockAlerts: true,
        deliveryUpdates: true,
        marketingEmails: false,
      });
      return this.notificationPreferencesRepository.save(defaultPrefs);
    }
    return preferences;
  }

  async updateNotificationPreferences(updateDto: UpdateNotificationPreferencesDto): Promise<NotificationPreferences> {
    const preferences = await this.findNotificationPreferences();
    Object.assign(preferences, updateDto);
    return this.notificationPreferencesRepository.save(preferences);
  }

  // System Preferences
  async findSystemPreferences(): Promise<SystemPreferences> {
    const preferences = await this.systemPreferencesRepository.findOne({ where: {} });
    if (!preferences) {
      // Create default preferences if none exist
      const defaultPrefs = this.systemPreferencesRepository.create({
        defaultOrderStatus: 'pending' as any,
        autoApproveOrders: false,
        lowStockThreshold: 10,
        dataRetentionPeriod: 365,
        theme: Theme.LIGHT,
        language: Language.ENGLISH,
        autoSave: true,
        sessionTimeout: 30,
        enableAnalytics: true,
        enableBackups: true,
        maintenanceMode: false,
        itemsPerPage: 10,
        timezone: 'UTC',
      });
      return this.systemPreferencesRepository.save(defaultPrefs);
    }
    return preferences;
  }

  async updateSystemPreferences(updateDto: UpdateSystemPreferencesDto): Promise<SystemPreferences> {
    const preferences = await this.findSystemPreferences();
    Object.assign(preferences, updateDto);
    return this.systemPreferencesRepository.save(preferences);
  }

  // Business Settings
  async findBusinessSettings(): Promise<any> {
    // Placeholder: Implement business settings retrieval logic
    return {
      pickupLocation: '',
      businessHours: {
        monday: { open: '08:00', close: '17:00', closed: false },
        tuesday: { open: '08:00', close: '17:00', closed: false },
        wednesday: { open: '08:00', close: '17:00', closed: false },
        thursday: { open: '08:00', close: '17:00', closed: false },
        friday: { open: '08:00', close: '17:00', closed: false },
        saturday: { open: '08:00', close: '17:00', closed: false },
        sunday: { open: '08:00', close: '17:00', closed: true },
      },
      processingTime: 24,
      currency: 'RWF',
    };
  }

  async updateBusinessSettings(settings: any): Promise<any> {
    // Placeholder: Implement business settings update logic
    return settings;
  }

  // Data Export
  async exportData(type: string): Promise<any> {
    // Placeholder: Implement data export logic
    return { message: `Export of type ${type} initiated.` };
  }

  // System Reset
  async resetSystem(confirmReset: boolean): Promise<any> {
    if (!confirmReset) {
      throw new Error('Reset not confirmed');
    }
    // Placeholder: Implement system reset logic
    return { message: 'System reset initiated.' };
  }
}
