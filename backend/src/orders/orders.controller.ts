import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto, BulkUpdateOrderStatusDto } from '../common/dto/order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/entities/user.entity';

interface OrderNotificationData {
  parentInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  studentInfo: {
    name: string;
    class: string;
  };
  cartItems: any[];
  totalAmount: number;
  paymentMethod: string;
  schoolInfo: any;
  id?: string;
}

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.ordersService.create(createOrderDto, req.user?.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  findByUser(@Request() req) {
    return this.ordersService.findByUser(req.user.id);
  }

  @Get('user/stats')
  @UseGuards(JwtAuthGuard)
  getUserOrderStats(@Request() req) {
    return this.ordersService.getOrderStatsForUser(req.user.id);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  getOrderStats() {
    return this.ordersService.getOrderStats();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCHOOL_MANAGER)
  updateStatus(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, updateOrderStatusDto.status);
  }

  @Patch('bulk/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCHOOL_MANAGER)
  bulkUpdateStatus(@Body() bulkUpdateOrderStatusDto: BulkUpdateOrderStatusDto) {
    return this.ordersService.bulkUpdateStatus(bulkUpdateOrderStatusDto.orderIds, bulkUpdateOrderStatusDto.status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }

  @Post('notifications')
  @UseGuards(JwtAuthGuard)
  sendOrderNotifications(@Body() orderData: OrderNotificationData) {
    return this.ordersService.sendOrderNotifications(orderData);
  }
}
