import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../common/entities/order.entity';
import { OrderItem } from '../common/entities/order-item.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async getOverviewData(userId: string) {
    // Get monthly spending data for the last 6 months
    const monthlySpending = await this.getMonthlySpending(userId);

    // Get spending by category
    const categorySpending = await this.getCategorySpending(userId);

    // Get recent orders
    const recentOrders = await this.getRecentOrders(userId);

    // Get total stats
    const totalSpent = await this.getTotalSpent(userId);
    const totalOrders = await this.getTotalOrders(userId);
    const pendingOrders = await this.getPendingOrders(userId);

    return {
      monthlySpending,
      categorySpending,
      recentOrders,
      totalSpent,
      totalOrders,
      pendingOrders,
    };
  }

  private async getMonthlySpending(userId: string) {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .select('DATE_TRUNC(\'month\', order.createdAt) as month')
      .addSelect('SUM(order.totalAmount) as total')
      .where('order.userId = :userId', { userId })
      .andWhere('order.status = :status', { status: OrderStatus.DELIVERED })
      .andWhere('order.createdAt >= :sixMonthsAgo', { sixMonthsAgo })
      .groupBy('DATE_TRUNC(\'month\', order.createdAt)')
      .orderBy('month', 'ASC')
      .getRawMany();

    return orders.map(order => ({
      month: order.month,
      total: Number(order.total),
    }));
  }

  private async getCategorySpending(userId: string) {
    const categoryData = await this.orderItemRepository
      .createQueryBuilder('item')
      .select('item.category')
      .addSelect('SUM(item.price * item.quantity) as total')
      .innerJoin('item.order', 'order')
      .where('order.userId = :userId', { userId })
      .andWhere('order.status = :status', { status: OrderStatus.DELIVERED })
      .groupBy('item.category')
      .orderBy('total', 'DESC')
      .getRawMany();

    return categoryData.map(cat => ({
      category: cat.category,
      total: Number(cat.total),
    }));
  }

  private async getRecentOrders(userId: string) {
    const orders = await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return orders.map(order => ({
      id: order.id,
      item: order.items[0]?.productName || 'Multiple Items',
      date: order.createdAt.toISOString().split('T')[0],
      amount: order.totalAmount.toString(),
      status: order.status,
      category: order.items[0]?.category || 'Mixed',
    }));
  }

  private async getTotalSpent(userId: string) {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.userId = :userId', { userId })
      .andWhere('order.status = :status', { status: OrderStatus.DELIVERED })
      .getRawOne();

    return Number(result?.total || 0);
  }

  private async getTotalOrders(userId: string) {
    return await this.orderRepository.count({
      where: { user: { id: userId } },
    });
  }

  private async getPendingOrders(userId: string) {
    return await this.orderRepository.count({
      where: {
        user: { id: userId },
        status: OrderStatus.PENDING,
      },
    });
  }
}
