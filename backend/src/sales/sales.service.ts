import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale, SaleStatus, PaymentStatus } from './sales.entity';
import { CreateSaleDto, UpdateSaleDto, SalesSummaryDto } from './sales.dto';
import { User } from '../common/entities/user.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createSaleDto: CreateSaleDto, userId: string): Promise<Sale> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const sale = this.saleRepository.create({
      ...createSaleDto,
      user,
      paidAmount: 0,
      status: SaleStatus.PENDING,
      paymentStatus: PaymentStatus.UNPAID,
      expectedCloseDate: createSaleDto.expectedCloseDate ? new Date(createSaleDto.expectedCloseDate) : undefined,
    });

    return await this.saleRepository.save(sale);
  }

  async findAll(userId?: string): Promise<Sale[]> {
    const query = this.saleRepository.createQueryBuilder('sale')
      .leftJoinAndSelect('sale.user', 'user')
      .orderBy('sale.createdAt', 'DESC');

    if (userId) {
      query.where('sale.userId = :userId', { userId });
    }

    return await query.getMany();
  }

  async findOne(id: string, userId?: string): Promise<Sale> {
    const query = this.saleRepository.createQueryBuilder('sale')
      .leftJoinAndSelect('sale.user', 'user')
      .where('sale.id = :id', { id });

    if (userId) {
      query.andWhere('sale.userId = :userId', { userId });
    }

    const sale = await query.getOne();
    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    return sale;
  }

  async update(id: string, updateSaleDto: UpdateSaleDto, userId?: string): Promise<Sale> {
    const sale = await this.findOne(id, userId);

    // Update fields
    Object.assign(sale, updateSaleDto);

    // Handle date conversions
    if (updateSaleDto.expectedCloseDate) {
      sale.expectedCloseDate = new Date(updateSaleDto.expectedCloseDate);
    }
    if (updateSaleDto.actualCloseDate) {
      sale.actualCloseDate = new Date(updateSaleDto.actualCloseDate);
    }

    // Auto-update payment status based on paid amount
    // Use optional chaining and nullish coalescing to avoid errors
    const paidAmount = (updateSaleDto as any).paidAmount;
    if (paidAmount !== undefined) {
      if (paidAmount >= sale.totalAmount) {
        sale.paymentStatus = PaymentStatus.PAID;
      } else if (paidAmount > 0) {
        sale.paymentStatus = PaymentStatus.PARTIAL;
      } else {
        sale.paymentStatus = PaymentStatus.UNPAID;
      }
      sale.paidAmount = paidAmount;
    }

    // Auto-update actual close date when status changes to completed
    if (updateSaleDto.status === SaleStatus.COMPLETED && !sale.actualCloseDate) {
      sale.actualCloseDate = new Date();
    }

    return await this.saleRepository.save(sale);
  }

  async remove(id: string, userId?: string): Promise<void> {
    const sale = await this.findOne(id, userId);
    await this.saleRepository.remove(sale);
  }

  async getSalesSummary(userId?: string): Promise<SalesSummaryDto> {
    const query = this.saleRepository.createQueryBuilder('sale');

    if (userId) {
      query.where('sale.userId = :userId', { userId });
    }

    const sales = await query.getMany();

    const summary: SalesSummaryDto = {
      totalSales: sales.length,
      totalRevenue: sales.reduce((sum, sale) => sum + Number(sale.totalAmount), 0),
      totalPaid: sales.reduce((sum, sale) => sum + Number(sale.paidAmount), 0),
      pendingSales: sales.filter(sale => sale.status === SaleStatus.PENDING).length,
      completedSales: sales.filter(sale => sale.status === SaleStatus.COMPLETED).length,
    };

    return summary;
  }

  async updatePayment(id: string, paidAmount: number, userId?: string): Promise<Sale> {
    const sale = await this.findOne(id, userId);

    sale.paidAmount = paidAmount;

    // Update payment status
    if (paidAmount >= sale.totalAmount) {
      sale.paymentStatus = PaymentStatus.PAID;
    } else if (paidAmount > 0) {
      sale.paymentStatus = PaymentStatus.PARTIAL;
    } else {
      sale.paymentStatus = PaymentStatus.UNPAID;
    }

    return await this.saleRepository.save(sale);
  }

  async getSalesByStatus(status: SaleStatus, userId?: string): Promise<Sale[]> {
    const query = this.saleRepository.createQueryBuilder('sale')
      .leftJoinAndSelect('sale.user', 'user')
      .where('sale.status = :status', { status })
      .orderBy('sale.createdAt', 'DESC');

    if (userId) {
      query.andWhere('sale.userId = :userId', { userId });
    }

    return await query.getMany();
  }

  async getOverdueSales(userId?: string): Promise<Sale[]> {
    const today = new Date();
    const query = this.saleRepository.createQueryBuilder('sale')
      .leftJoinAndSelect('sale.user', 'user')
      .where('sale.expectedCloseDate < :today', { today })
      .andWhere('sale.status != :completed', { completed: SaleStatus.COMPLETED })
      .orderBy('sale.expectedCloseDate', 'ASC');

    if (userId) {
      query.andWhere('sale.userId = :userId', { userId });
    }

    return await query.getMany();
  }
}
