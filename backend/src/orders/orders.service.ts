import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from '../common/entities/order.entity';
import { OrderItem } from '../common/entities/order-item.entity';
import { Product } from '../common/entities/product.entity';
import { User } from '../common/entities/user.entity';
import { CreateOrderDto, UpdateOrderStatusDto, OrderResponseDto } from '../common/dto/order.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { EmailService } from '../email/email.service';
import { SMSService } from '../sms/sms.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
    private notificationsService: NotificationsService,
    private emailService: EmailService,
    private smsService: SMSService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId?: string): Promise<OrderResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { items, totalAmount, ...orderData } = createOrderDto;

      let user: User | undefined;
      if (userId) {
        user = await queryRunner.manager.findOne(User, { where: { id: userId } }) || undefined;
        if (!user) {
          throw new NotFoundException('User not found');
        }
      }

      // Verify stock for each item
      const orderItems: OrderItem[] = [];

      for (const item of items) {
        const product = await queryRunner.manager.findOne(Product, { where: { id: item.productId } });
        if (!product) {
          throw new NotFoundException(`Product with ID ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(`Insufficient stock for product ${product.name}`);
        }

        const orderItem = this.orderItemRepository.create({
          product,
          productName: product.name,
          quantity: item.quantity,
          price: item.price,
          category: product.category,
        });

        orderItems.push(orderItem);

        // Update product stock
        product.stock -= item.quantity;
        await queryRunner.manager.save(product);
      }

      // Create order
      const order = this.orderRepository.create({
        user,
        totalAmount,
        status: OrderStatus.PROCESSING,
        ...orderData,
      });

      const savedOrder = await queryRunner.manager.save(order);

      // Save order items
      for (const item of orderItems) {
        item.order = savedOrder;
        await queryRunner.manager.save(item);
      }

      await queryRunner.commitTransaction();

      // Send order confirmation notification
      if (userId) {
        try {
          await this.notificationsService.sendOrderConfirmationNotification(savedOrder.id);
        } catch (error) {
          console.error('Failed to send order confirmation notification:', error);
          // Don't fail the order creation if notification fails
        }
      }

      // Return order with items
      return await this.findOne(savedOrder.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private mapOrderToResponse(order: Order): OrderResponseDto {
    return {
      id: order.id,
      userId: order.user?.id || '',
      parentName: order.parentName,
      parentEmail: order.parentEmail,
      parentPhone: order.parentPhone,
      studentName: order.studentName,
      studentGrade: order.studentGrade,
      studentClass: order.studentClass,
      items: order.items?.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
        category: item.product.category,
      })) || [],
      totalAmount: order.totalAmount,
      status: order.status,
      orderDate: order.orderDate,
      paymentMethod: order.paymentMethod,
      deliveryAddress: order.deliveryAddress,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  async findAll(): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.find({
      relations: ['user', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
    return orders.map(order => this.mapOrderToResponse(order));
  }

  async findOne(id: string): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.mapOrderToResponse(order);
  }

  async findByUser(userId: string): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
    return orders.map(order => this.mapOrderToResponse(order));
  }

  async updateStatus(id: string, status: OrderStatus): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = status;
    const updatedOrder = await this.orderRepository.save(order);
    return this.findOne(updatedOrder.id);
  }

  async bulkUpdateStatus(orderIds: string[], status: OrderStatus): Promise<OrderResponseDto[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatedOrders: OrderResponseDto[] = [];

      for (const orderId of orderIds) {
        const order = await queryRunner.manager.findOne(Order, { where: { id: orderId } });

        if (!order) {
          throw new NotFoundException(`Order with ID ${orderId} not found`);
        }

        order.status = status;
        await queryRunner.manager.save(order);

        // Get the updated order with relations
        const updatedOrder = await this.findOne(orderId);
        updatedOrders.push(updatedOrder);
      }

      await queryRunner.commitTransaction();
      return updatedOrders;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<void> {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    await this.orderRepository.remove(order);
  }

  async getOrderStats() {
    const totalOrders = await this.orderRepository.count();
    const pendingOrders = await this.orderRepository.count({ where: { status: OrderStatus.PENDING } });
    const processingOrders = await this.orderRepository.count({ where: { status: OrderStatus.PROCESSING } });
    const deliveredOrders = await this.orderRepository.count({ where: { status: OrderStatus.DELIVERED } });
    const cancelledOrders = await this.orderRepository.count({ where: { status: OrderStatus.CANCELLED } });

    const totalRevenueResult = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.status = :status', { status: OrderStatus.DELIVERED })
      .getRawOne();

    return {
      totalOrders,
      totalRevenue: Number(totalRevenueResult?.total || 0),
      pendingOrders,
      processingOrders,
      deliveredOrders,
      cancelledOrders,
    };
  }

  async getOrderStatsForUser(userId: string) {
    const totalOrders = await this.orderRepository.count({ where: { user: { id: userId } } });
    const pendingOrders = await this.orderRepository.count({ where: { user: { id: userId }, status: OrderStatus.PENDING } });
    const processingOrders = await this.orderRepository.count({ where: { user: { id: userId }, status: OrderStatus.PROCESSING } });
    const deliveredOrders = await this.orderRepository.count({ where: { user: { id: userId }, status: OrderStatus.DELIVERED } });
    const cancelledOrders = await this.orderRepository.count({ where: { user: { id: userId }, status: OrderStatus.CANCELLED } });

    const totalRevenueResult = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.userId = :userId AND order.status = :status', { userId, status: OrderStatus.DELIVERED })
      .getRawOne();

    return {
      totalOrders,
      totalRevenue: Number(totalRevenueResult?.total || 0),
      pendingOrders,
      processingOrders,
      deliveredOrders,
      cancelledOrders,
    };
  }

  async sendOrderNotifications(orderData: any): Promise<{ smsSent: boolean; emailSent: boolean }> {
    let smsSent = false;
    let emailSent = false;

    try {
      // Safely extract parent name with comprehensive null checking
      // Handle both nested parentInfo structure and flat structure from frontend
      const parentName = orderData?.parentInfo?.firstName || 
                        (orderData?.parentName && typeof orderData.parentName === 'string' ? 
                         orderData.parentName.split(' ')[0] : 'Valued Customer');
      
      // Send email notification
      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Order Confirmation - SchoolMart</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
              .content { padding: 30px 20px; background-color: #f9f9f9; }
              .order-details { background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>SchoolMart</h1>
                <p>Order Confirmation</p>
              </div>
              <div class="content">
                <h2>Hello ${parentName}!</h2>
                <p>Thank you for your order! Your order has been successfully placed and is being processed.</p>

                <div class="order-details">
                  <h3>Order Details</h3>
                  <p><strong>Order ID:</strong> ${orderData?.id || 'Processing'}</p>
                  <p><strong>Student:</strong> ${orderData?.studentInfo?.name || 'Student'} (${orderData?.studentInfo?.class || 'N/A'})</p>
                  <p><strong>Total Amount:</strong> RWF ${orderData?.totalAmount?.toLocaleString() || '0'}</p>
                  <p><strong>Payment Method:</strong> ${orderData?.paymentMethod || 'N/A'}</p>

                  <h4>Items Ordered:</h4>
                  <ul>
                    ${Array.isArray(orderData?.cartItems) ? orderData.cartItems.map((item: any) =>
                      `<li>${item?.productName || 'Product'} (Qty: ${item?.quantity || 0}) - RWF ${((item?.price || 0) * (item?.quantity || 0)).toLocaleString()}</li>`
                    ).join('') : '<li>No items found</li>'}
                  </ul>
                </div>

                <p>You will receive payment instructions via SMS shortly. Please complete your payment to confirm your order.</p>

                <p>If you have any questions, please contact us at ${orderData.schoolInfo?.email || 'support@schoolmart.rw'} or call ${orderData.schoolInfo?.phone || '+250 788 123 456'}.</p>

                <p>Best regards,<br>The SchoolMart Team</p>
              </div>
              <div class="footer">
                <p>This is an automated message. Please do not reply to this email.</p>
                <p>&copy; 2024 SchoolMart. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      const emailText = `
        Hello ${parentName}!

        Thank you for your order! Your order has been successfully placed and is being processed.

        Order Details:
        Order ID: ${orderData?.id || 'Processing'}
        Student: ${orderData?.studentInfo?.name || 'Student'} (${orderData?.studentInfo?.class || 'N/A'})
        Total Amount: RWF ${orderData?.totalAmount?.toLocaleString() || '0'}
        Payment Method: ${orderData?.paymentMethod || 'N/A'}

        Items Ordered:
${Array.isArray(orderData?.cartItems) ? orderData.cartItems.map((item: any) =>
  `- ${item?.productName || 'Product'} (Qty: ${item?.quantity || 0}) - RWF ${((item?.price || 0) * (item?.quantity || 0)).toLocaleString()}`
).join('\n') : 'No items found'}

        You will receive payment instructions via SMS shortly. Please complete your payment to confirm your order.

        If you have any questions, please contact us at ${orderData?.schoolInfo?.email || 'support@schoolmart.rw'} or call ${orderData?.schoolInfo?.phone || '+250 788 123 456'}.

        Best regards,
        The SchoolMart Team
      `;

      const emailTo = orderData?.parentInfo?.email || orderData?.parentEmail || '';
      if (emailTo) {
        emailSent = await this.emailService.sendEmail({
          to: emailTo,
          subject: 'Order Confirmation - SchoolMart',
          html: emailHtml,
          text: emailText,
        });
      } else {
        console.warn('No email address provided for order confirmation');
      }

    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
    }

    try {
      // Safely extract parent info from flat structure
      const parentFirstName = orderData?.parentName ? orderData.parentName.split(' ')[0] : 'Valued';
      const parentFullName = orderData?.parentName || `${parentFirstName} Customer`;
      const smsMessage = `Hello ${parentFullName}! Your SchoolMart order #${orderData?.id || 'Processing'} for RWF ${orderData?.totalAmount?.toLocaleString() || '0'} has been placed. Payment instructions will follow. Thank you!`;

      const smsTo = orderData?.parentPhone || '';
      if (smsTo) {
        smsSent = await this.smsService.sendSMS({
          to: smsTo,
          message: smsMessage,
        });
      } else {
        console.warn('No phone number provided for SMS notification');
      }

    } catch (smsError) {
      console.error('Failed to send order confirmation SMS:', smsError);
    }

    return { smsSent, emailSent };
  }
}
