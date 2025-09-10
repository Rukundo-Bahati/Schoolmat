import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from '../common/dto/payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('process')
  @UseGuards(JwtAuthGuard)
  processPayment(@Body() createPaymentDto: CreatePaymentDto, @Request() req) {
    return this.paymentsService.processPayment(createPaymentDto, req.user.id);
  }

  @Get('status/:orderId')
  @UseGuards(JwtAuthGuard)
  getPaymentStatus(@Param('orderId') orderId: string, @Request() req) {
    return this.paymentsService.getPaymentStatus(orderId, req.user.id);
  }

  @Post('refund/:orderId')
  @UseGuards(JwtAuthGuard)
  refundPayment(@Param('orderId') orderId: string, @Body('amount') amount: number, @Request() req) {
    return this.paymentsService.refundPayment(orderId, req.user.id, amount);
  }
}
