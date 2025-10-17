import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Order } from '../common/entities/order.entity';
import { OrderItem } from '../common/entities/order-item.entity';
import { Product } from '../common/entities/product.entity';
import { Category } from '../common/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product, Category])
  ],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}
