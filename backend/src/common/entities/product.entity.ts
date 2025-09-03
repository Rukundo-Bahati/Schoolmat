import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  category!: string;

  @Column('decimal')
  price!: number;

  @Column('int')
  stock!: number;

  @Column('int')
  minStock!: number;

  @Column()
  required!: boolean;

  @Column({ nullable: true })
  description: string;

  @Column()
  supplier!: string;

  @Column()
  imageUrl!: string;

  @Column({ nullable: true })
  cloudinaryPublicId: string;

  @Column('decimal', { default: 0 })
  rating: number;

  @Column('int', { default: 0 })
  reviews: number;

  @CreateDateColumn()
  lastUpdated!: Date;
}
