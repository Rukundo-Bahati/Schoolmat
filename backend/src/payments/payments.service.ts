import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from '../common/entities/order.entity';
import { OrderItem } from '../common/entities/order-item.entity';
import { Product } from '../common/entities/product.entity';
import { User } from '../common/entities/user.entity';
import { CreatePaymentDto, PaymentResponseDto, PaymentStatus } from '../common/dto/payment.dto';

@Injectable()
export class PaymentsService {
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
  ) {}

  async processPayment(createPaymentDto: CreatePaymentDto, userId: string): Promise<PaymentResponseDto> {
    const { orderId, paymentMethod, amount } = createPaymentDto;

    // Verify order exists and belongs to user
    const order = await this.orderRepository.findOne({
      where: { id: orderId, user: { id: userId } },
      relations: ['user', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order is not in pending status');
    }

    // Verify payment amount matches order total
    if (Math.abs(amount - order.totalAmount) > 0.01) {
      throw new BadRequestException('Payment amount does not match order total');
    }

    // Process payment (mock implementation)
    const paymentResult = await this.mockPaymentProcessing(amount, paymentMethod);

    if (paymentResult.success) {
      // Update order status
      order.status = OrderStatus.PROCESSING;
      await this.orderRepository.save(order);

      return {
        id: `payment_${Date.now()}`,
        orderId,
        amount,
        paymentMethod,
        status: PaymentStatus.COMPLETED,
        transactionId: paymentResult.transactionId,
        processedAt: new Date(),
        message: 'Payment processed successfully',
      };
    } else {
      return {
        id: `payment_${Date.now()}`,
        orderId,
        amount,
        paymentMethod,
        status: PaymentStatus.FAILED,
        transactionId: null,
        processedAt: new Date(),
        message: paymentResult.message,
      };
    }
  }

  async getPaymentStatus(orderId: string, userId: string): Promise<PaymentResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, user: { id: userId } },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Mock payment status based on order status
    let paymentStatus: PaymentStatus;
    let message: string;

    switch (order.status) {
      case OrderStatus.PENDING:
        paymentStatus = PaymentStatus.PENDING;
        message = 'Payment is pending';
        break;
      case OrderStatus.PROCESSING:
        paymentStatus = PaymentStatus.COMPLETED;
        message = 'Payment completed successfully';
        break;
      case OrderStatus.DELIVERED:
        paymentStatus = PaymentStatus.COMPLETED;
        message = 'Payment completed and order fulfilled';
        break;
      case OrderStatus.CANCELLED:
        paymentStatus = PaymentStatus.CANCELLED;
        message = 'Payment cancelled';
        break;
      default:
        paymentStatus = PaymentStatus.PENDING;
        message = 'Payment status unknown';
    }

    return {
      id: `payment_${orderId}`,
      orderId,
      amount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      status: paymentStatus,
      transactionId: `txn_${orderId}`,
      processedAt: order.createdAt,
      message,
    };
  }

  async refundPayment(orderId: string, userId: string, amount?: number): Promise<PaymentResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, user: { id: userId } },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.CANCELLED) {
      throw new BadRequestException('Order must be cancelled to process refund');
    }

    const refundAmount = amount || order.totalAmount;

    // Mock refund processing
    const refundResult = await this.mockRefundProcessing(refundAmount);

    return {
      id: `refund_${Date.now()}`,
      orderId,
      amount: refundAmount,
      paymentMethod: order.paymentMethod,
      status: refundResult.success ? PaymentStatus.COMPLETED : PaymentStatus.FAILED,
      transactionId: refundResult.transactionId,
      processedAt: new Date(),
      message: refundResult.message,
    };
  }

  private async mockPaymentProcessing(amount: number, paymentMethod: string): Promise<{
    success: boolean;
    transactionId: string | null;
    message: string;
  }> {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock success/failure based on amount (for testing)
    if (amount > 0 && amount < 10000) {
      return {
        success: true,
        transactionId: `txn_${Date.now()}`,
        message: 'Payment processed successfully',
      };
    } else {
      return {
        success: false,
        transactionId: null,
        message: 'Payment failed due to invalid amount',
      };
    }
  }

  private async mockRefundProcessing(amount: number): Promise<{
    success: boolean;
    transactionId: string | null;
    message: string;
  }> {
    // Simulate refund processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      transactionId: `refund_${Date.now()}`,
      message: 'Refund processed successfully',
    };
  }
}
