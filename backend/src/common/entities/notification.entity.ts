import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

export enum NotificationType {
  ORDER = 'order',
  PAYMENT = 'payment',
  SHIPPING = 'shipping',
  GENERAL = 'general'
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  FAILED = 'failed'
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: NotificationType.GENERAL
  })
  type: NotificationType;

  @Column({
    type: 'varchar',
    length: 20,
    default: NotificationStatus.UNREAD
  })
  status: NotificationStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  orderId?: string;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ type: 'json', nullable: true })
  metadata?: any;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'varchar' })
  userId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
