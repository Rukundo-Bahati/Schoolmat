import { DataSource } from 'typeorm';
import { User } from './common/entities/user.entity';
import { Product } from './common/entities/product.entity';
import { Order } from './common/entities/order.entity';
import { OrderItem } from './common/entities/order-item.entity';
import { CartItem } from './common/entities/cart-item.entity';
import { Notification } from './common/entities/notification.entity';
import { Category } from './common/entities/category.entity';
import { SchoolInfo } from './common/entities/school-info.entity';
import { PaymentMethod } from './common/entities/payment-method.entity';
import { NotificationPreferences } from './common/entities/notification-preferences.entity';
import { SystemPreferences } from './common/entities/system-preferences.entity';
// import { Sale } from './sales/sales.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '12345',
  database: process.env.DB_NAME || 'schoolmart',
  entities: [User, Product, Order, OrderItem, CartItem, Notification, Category, SchoolInfo, PaymentMethod, NotificationPreferences, SystemPreferences],
  synchronize: false, // Never use in production
  logging: process.env.NODE_ENV === 'development',
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
});
