import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Place a new order' })
  create(@Request() req, @Body() body: {
    items: { menuItemId: string; quantity: number; notes?: string }[];
    deliveryType: string;
    scheduledDate?: string;
    scheduledTime?: string;
    notes?: string;
    addressId?: string;
  }) {
    return this.ordersService.create(req.user.sub, body);
  }

  @Get()
  @ApiOperation({ summary: 'Get user order history' })
  @ApiQuery({ name: 'status', required: false })
  findAll(@Request() req, @Query('status') status?: string) {
    return this.ordersService.findAll(req.user.sub, { status });
  }

  @Get('admin')
  @ApiOperation({ summary: 'Get all orders (admin)' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllAdmin(@Query('status') status?: string, @Query('limit') limit?: string) {
    return this.ordersService.findAllAdmin({ status, limit: limit ? parseInt(limit) : undefined });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get order statistics (admin)' })
  getStats() {
    return this.ordersService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single order' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status (admin)' })
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.ordersService.updateStatus(id, body.status);
  }
}
