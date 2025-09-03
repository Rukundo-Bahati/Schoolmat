import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Order, order => order.items)
  order!: Order;

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
}
