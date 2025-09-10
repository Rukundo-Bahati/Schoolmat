import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto'
}

export enum Language {
  ENGLISH = 'en',
  FRENCH = 'fr',
  KINYARWANDA = 'rw'
}

@Entity('system_preferences')
export class SystemPreferences {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Order Management
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING
  })
  defaultOrderStatus: OrderStatus;

  @Column({ default: false })
  autoApproveOrders: boolean;

  @Column({ default: 10 })
  lowStockThreshold: number;

  @Column({ default: 365 })
  dataRetentionPeriod: number; // in days

  // UI Preferences
  @Column({
    type: 'enum',
    enum: Theme,
    default: Theme.LIGHT
  })
  theme: Theme;

  @Column({
    type: 'enum',
    enum: Language,
    default: Language.ENGLISH
  })
  language: Language;

  // System Settings
  @Column({ default: true })
  autoSave: boolean;

  @Column({ default: 30 })
  sessionTimeout: number; // in minutes

  @Column({ default: true })
  enableAnalytics: boolean;

  @Column({ default: true })
  enableBackups: boolean;

  @Column({ nullable: true, type: 'int' })
  backupFrequency: number; // in days

  @Column({ default: false })
  maintenanceMode: boolean;

  @Column({ nullable: true, type: 'text' })
  maintenanceMessage: string;

  @Column({ default: 10 })
  itemsPerPage: number; // Default pagination size

  @Column({ default: 'UTC' })
  timezone: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
