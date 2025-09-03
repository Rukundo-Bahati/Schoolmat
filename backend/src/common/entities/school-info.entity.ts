import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('schoolinfo')
export class SchoolInfo {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;

  @Column({ nullable: true })
  airtelNumber: string;

  @Column({ nullable: true })
  mtnNumber: string;

  @Column({ nullable: true })
  momoCode: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true, type: 'text' })
  address: string;

  @Column({ nullable: true, type: 'int' })
  orderProcessingTime: number; // in minutes

  @Column({ nullable: true, default: 'RWF' })
  currency: string; // ISO currency code, default to RWF (Rwandan Franc)

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
