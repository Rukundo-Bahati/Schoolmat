import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum PaymentMethodType {
  MOBILE_MONEY = 'mobile_money',
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash',
  CARD = 'card'
}

export enum PaymentProvider {
  AIRTEL = 'airtel',
  MTN = 'mtn',
  BANK_OF_KIGALI = 'bank_of_kigali',
  EQUITY_BANK = 'equity_bank',
  KCB = 'kcb',
  CASH = 'cash',
  VISA = 'visa',
  MASTERCARD = 'mastercard'
}

@Entity('payment_methods')
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: PaymentMethodType
  })
  type!: PaymentMethodType;

  @Column({
    type: 'enum',
    enum: PaymentProvider
  })
  provider!: PaymentProvider;

  @Column()
  name!: string; // Display name for the payment method

  @Column({ nullable: true })
  accountNumber!: string; // For mobile money or bank accounts

  @Column({ nullable: true })
  accountName!: string; // Account holder name

  @Column({ default: true })
  isActive!: boolean; // Whether this payment method is enabled

  @Column({ nullable: true, type: 'text' })
  instructions!: string; // Payment instructions for customers

  @Column({ nullable: true, type: 'int' })
  sortOrder!: number; // Display order

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
