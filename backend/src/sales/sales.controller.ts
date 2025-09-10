import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { SalesService } from './sales.service';
import {
  CreateSaleDto,
  UpdateSaleDto,
  SaleResponseDto,
  SalesSummaryDto,
} from './sales.dto';
import { SaleStatus } from './sales.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/entities/user.entity';

@ApiTags('sales')
@Controller('sales')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SCHOOL_MANAGER)
  @ApiOperation({ summary: 'Create a new sale' })
  @ApiResponse({
    status: 201,
    description: 'Sale created successfully',
    type: SaleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async create(
    @Body() createSaleDto: CreateSaleDto,
    @Request() req,
  ): Promise<SaleResponseDto> {
    const sale = await this.salesService.create(createSaleDto, req.user.id);
    return this.mapToResponseDto(sale);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SCHOOL_MANAGER)
  @ApiOperation({ summary: 'Get all sales' })
  @ApiResponse({
    status: 200,
    description: 'Sales retrieved successfully',
    type: [SaleResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter by user ID',
  })
  async findAll(
    @Query('userId') userId?: string,
    @Request() req?,
  ): Promise<SaleResponseDto[]> {
    const sales = await this.salesService.findAll(userId || req?.user?.id);
    return sales.map((sale) => this.mapToResponseDto(sale));
  }

  @Get('summary')
  @Roles(UserRole.ADMIN, UserRole.SCHOOL_MANAGER)
  @ApiOperation({ summary: 'Get sales summary' })
  @ApiResponse({
    status: 200,
    description: 'Sales summary retrieved successfully',
    type: SalesSummaryDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getSummary(@Request() req): Promise<SalesSummaryDto> {
    return await this.salesService.getSalesSummary(req.user.id);
  }

  @Get('status/:status')
  @Roles(UserRole.ADMIN, UserRole.SCHOOL_MANAGER)
  @ApiOperation({ summary: 'Get sales by status' })
  @ApiResponse({
    status: 200,
    description: 'Sales retrieved successfully',
    type: [SaleResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getByStatus(
    @Param('status') status: SaleStatus,
    @Request() req,
  ): Promise<SaleResponseDto[]> {
    const sales = await this.salesService.getSalesByStatus(status, req.user.id);
    return sales.map((sale) => this.mapToResponseDto(sale));
  }

  @Get('overdue')
  @Roles(UserRole.ADMIN, UserRole.SCHOOL_MANAGER)
  @ApiOperation({ summary: 'Get overdue sales' })
  @ApiResponse({
    status: 200,
    description: 'Overdue sales retrieved successfully',
    type: [SaleResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getOverdue(@Request() req): Promise<SaleResponseDto[]> {
    const sales = await this.salesService.getOverdueSales(req.user.id);
    return sales.map((sale) => this.mapToResponseDto(sale));
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SCHOOL_MANAGER)
  @ApiOperation({ summary: 'Get a sale by ID' })
  @ApiResponse({
    status: 200,
    description: 'Sale retrieved successfully',
    type: SaleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Sale not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async findOne(
    @Param('id') id: string,
    @Request() req,
  ): Promise<SaleResponseDto> {
    const sale = await this.salesService.findOne(id, req.user.id);
    return this.mapToResponseDto(sale);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SCHOOL_MANAGER)
  @ApiOperation({ summary: 'Update a sale' })
  @ApiResponse({
    status: 200,
    description: 'Sale updated successfully',
    type: SaleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Sale not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async update(
    @Param('id') id: string,
    @Body() updateSaleDto: UpdateSaleDto,
    @Request() req,
  ): Promise<SaleResponseDto> {
    const sale = await this.salesService.update(id, updateSaleDto, req.user.id);
    return this.mapToResponseDto(sale);
  }

  @Patch(':id/payment')
  @Roles(UserRole.ADMIN, UserRole.SCHOOL_MANAGER)
  @ApiOperation({ summary: 'Update sale payment' })
  @ApiResponse({
    status: 200,
    description: 'Payment updated successfully',
    type: SaleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Sale not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async updatePayment(
    @Param('id') id: string,
    @Body('paidAmount') paidAmount: number,
    @Request() req,
  ): Promise<SaleResponseDto> {
    const sale = await this.salesService.updatePayment(id, paidAmount, req.user.id);
    return this.mapToResponseDto(sale);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SCHOOL_MANAGER)
  @ApiOperation({ summary: 'Delete a sale' })
  @ApiResponse({
    status: 200,
    description: 'Sale deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Sale not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async remove(@Param('id') id: string, @Request() req): Promise<void> {
    await this.salesService.remove(id, req.user.id);
  }

  private mapToResponseDto(sale: any): SaleResponseDto {
    return {
      id: sale.id,
      userId: sale.user?.id || sale.userId,
      customerName: sale.customerName,
      customerEmail: sale.customerEmail,
      customerPhone: sale.customerPhone,
      description: sale.description,
      totalAmount: Number(sale.totalAmount),
      paidAmount: Number(sale.paidAmount),
      status: sale.status,
      paymentStatus: sale.paymentStatus,
      expectedCloseDate: sale.expectedCloseDate,
      actualCloseDate: sale.actualCloseDate,
      createdAt: sale.createdAt,
      updatedAt: sale.updatedAt,
    };
  }
}
