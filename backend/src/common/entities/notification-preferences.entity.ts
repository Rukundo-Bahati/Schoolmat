import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('notification_preferences')
export class NotificationPreferences {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ default: true })
  emailNotifications: boolean;

  @Column({ default: true })
  smsNotifications: boolean;

  @Column({ default: true })
  orderConfirmations: boolean;

  @Column({ default: true })
  paymentReminders: boolean;

  @Column({ default: true })
  lowStockAlerts: boolean;

  @Column({ default: true })
  deliveryUpdates: boolean;

  @Column({ default: false })
  marketingEmails: boolean;

  @Column({ nullable: true, type: 'text' })
  emailRecipients: string; // Comma-separated list of additional email recipients

  @Column({ nullable: true, type: 'text' })
  smsRecipients: string; // Comma-separated list of additional SMS recipients

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
