import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  // ── Checkout ──────────────────────
  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Full checkout: creates order + payment intent' })
  checkout(@Request() req, @Body() body: {
    items: { menuItemId: string; quantity: number; notes?: string }[];
    deliveryType: string;
    scheduledDate?: string;
    scheduledTime?: string;
    notes?: string;
    addressId?: string;
    tipAmount?: number;
  }) {
    return this.paymentsService.checkout(req.user.sub, body);
  }

  @Post('confirm')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirm payment after client-side Stripe completion' })
  confirmPayment(@Body() body: { orderId: string; paymentIntentId: string }) {
    return this.paymentsService.confirmPayment(body.orderId, body.paymentIntentId);
  }

  // ── Payment Intents ───────────────
  @Post('create-intent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a standalone payment intent' })
  createPaymentIntent(@Body() body: { amount: number; currency?: string }) {
    return this.paymentsService.createPaymentIntent(body.amount, body.currency);
  }

  @Post('catering-deposit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a catering deposit payment' })
  createCateringDeposit(@Body() body: { totalAmount: number; depositPercentage?: number }) {
    return this.paymentsService.createCateringDeposit(body.totalAmount, body.depositPercentage);
  }

  // ── Subscriptions ─────────────────
  @Post('subscriptions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a meal plan subscription' })
  createSubscription(@Request() req, @Body() body: { plan: string }) {
    return this.paymentsService.createSubscription(req.user.sub, body.plan);
  }

  @Get('subscriptions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user subscriptions' })
  getUserSubscriptions(@Request() req) {
    return this.paymentsService.getUserSubscriptions(req.user.sub);
  }

  @Patch('subscriptions/:id/pause')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Pause a subscription' })
  pauseSubscription(@Param('id') id: string) {
    return this.paymentsService.pauseSubscription(id);
  }

  @Patch('subscriptions/:id/resume')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Resume a paused subscription' })
  resumeSubscription(@Param('id') id: string) {
    return this.paymentsService.resumeSubscription(id);
  }

  @Delete('subscriptions/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a subscription' })
  cancelSubscription(@Param('id') id: string) {
    return this.paymentsService.cancelSubscription(id);
  }

  // ── Webhook ───────────────────────
  @Post('webhook')
  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  handleWebhook(@Body() body: any) {
    return this.paymentsService.handleWebhook(body);
  }
}
