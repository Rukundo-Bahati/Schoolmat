import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../common/entities/user.entity';
import { Order } from '../common/entities/order.entity';
import { Notification, NotificationType, NotificationStatus } from '../common/entities/notification.entity';

export interface NotificationData {
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'general';
  orderId?: string;
  metadata?: any;
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async sendOrderConfirmationNotification(orderId: string): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user'],
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const notification: NotificationData = {
      userId: order.user.id,
      title: 'Order Confirmation',
      message: `Your order #${orderId} has been confirmed and is being processed.`,
      type: 'order',
      orderId,
    };

    await this.sendNotification(notification);
  }

  async sendPaymentSuccessNotification(orderId: string): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user'],
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const notification: NotificationData = {
      userId: order.user.id,
      title: 'Payment Successful',
      message: `Payment for order #${orderId} has been processed successfully.`,
      type: 'payment',
      orderId,
    };

    await this.sendNotification(notification);
  }


  async sendOrderDeliveredNotification(orderId: string): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user'],
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const notification: NotificationData = {
      userId: order.user.id,
      title: 'Order Delivered',
      message: `Your order #${orderId} has been delivered successfully.`,
      type: 'order',
      orderId,
    };

    await this.sendNotification(notification);
  }

  async sendCustomNotification(notificationData: NotificationData): Promise<void> {
    await this.sendNotification(notificationData);
  }

  private async sendNotification(notification: NotificationData): Promise<void> {
    // Mock notification sending - in a real application, this would integrate with
    // email services (SendGrid, AWS SES), push notifications, SMS, etc.

    console.log('Sending notification:', {
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      orderId: notification.orderId,
      timestamp: new Date().toISOString(),
    });

    // Here you would implement actual notification sending:
    // - Email notifications
    // - Push notifications
    // - SMS notifications
    // - In-app notifications

    // For now, we'll just log the notification
    await this.logNotification(notification);
  }

  private async logNotification(notification: NotificationData): Promise<void> {
    try {
      // Save notification to database
      const notificationEntity = this.notificationRepository.create({
        title: notification.title,
        message: notification.message,
        type: notification.type as NotificationType,
        status: NotificationStatus.UNREAD,
        orderId: notification.orderId,
        userId: notification.userId,
        metadata: notification.metadata,
        isRead: false,
      });

      await this.notificationRepository.save(notificationEntity);
      console.log('Notification saved to database:', notificationEntity.id);
    } catch (error) {
      console.error('Failed to save notification to database:', error);
      throw error;
    }
  }

  async getUserNotifications(userId: string, limit: number = 20): Promise<any[]> {
    try {
      const notifications = await this.notificationRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
        take: limit,
      });

      return notifications.map(notification => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        orderId: notification.orderId,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
      }));
    } catch (error) {
      console.error('Failed to fetch user notifications:', error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId: string, userId: string): Promise<void> {
    try {
      const notification = await this.notificationRepository.findOne({
        where: { id: notificationId, userId },
      });

      if (!notification) {
        throw new Error('Notification not found');
      }

      notification.isRead = true;
      await this.notificationRepository.save(notification);
      console.log(`Marked notification ${notificationId} as read for user ${userId}`);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    try {
      await this.notificationRepository.update(
        { userId, isRead: false },
        { isRead: true }
      );
      console.log(`Marked all notifications as read for user ${userId}`);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw error;
    }
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    try {
      // Validate that notificationId is a valid UUID
      if (!this.isValidUUID(notificationId)) {
        throw new Error('Invalid notification ID format. Must be a valid UUID.');
      }

      const result = await this.notificationRepository.delete({
        id: notificationId,
        userId,
      });

      if (result.affected === 0) {
        throw new Error('Notification not found or you do not have permission to delete it');
      }

      console.log(`Deleted notification ${notificationId} for user ${userId}`);
    } catch (error) {
      console.error('Failed to delete notification:', error);
      throw error;
    }
  }
}
