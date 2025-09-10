import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Order } from './order.entity';
import { CartItem } from './cart-item.entity';
import { Notification } from './notification.entity';
// import { Sale } from '../../sales/sales.entity';

export enum UserRole {
  PARENT = 'parent',
  SCHOOL_MANAGER = 'school_manager',
  ADMIN = 'admin'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PARENT
  })
  role!: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE
  })
  status!: UserStatus;

  @Column({ nullable: true, type: 'text' })
  otp: string | null;

  @Column({ nullable: true, type: 'timestamp' })
  otpExpiresAt: Date | null;

  @Column({ default: false })
  isEmailVerified!: boolean;

  @Column({ nullable: true })
  profileImageUrl: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @OneToMany(() => Order, order => order.user)
  orders!: Order[];

  @OneToMany(() => CartItem, cartItem => cartItem.user)
  cartItems!: CartItem[];

  @OneToMany(() => Notification, notification => notification.user)
  notifications!: Notification[];

  // @OneToMany(() => Sale, sale => sale.user)
  // sales!: Sale[];
}
