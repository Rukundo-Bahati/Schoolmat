import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, user => user.cartItems)
  user!: User;

  @ManyToOne(() => Product)
  product!: Product;

  @Column()
  productName!: string;

  @Column('int')
  quantity!: number;

  @Column('decimal')
  price!: number;

  @Column()
  category!: string;

  @Column()
  imageUrl!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
