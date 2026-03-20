import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { DeliveryType } from '@prisma/client';
import { UsersService } from '../users/users.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private stripe: any = null;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {
    this.initStripe();
  }

  private async initStripe() {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (secretKey) {
      try {
        const Stripe = (await import('stripe')).default;
        this.stripe = new Stripe(secretKey);
        this.logger.log('Stripe client initialized');
      } catch (e: any) {
        this.logger.warn('Failed to initialize Stripe:', e.message);
      }
    } else {
      this.logger.warn('STRIPE_SECRET_KEY not set — payments will use mock mode');
    }
  }

  // ── Full Checkout Flow ──────────────────────────────
  // Creates an order + payment intent together
  async checkout(userId: string, data: {
    items: { menuItemId: string; quantity: number; notes?: string }[];
    deliveryType: string;
    scheduledDate?: string;
    scheduledTime?: string;
    notes?: string;
    addressId?: string;
    tipAmount?: number;
  }) {
    // Validate items
    if (!data.items || data.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Fetch menu items  
    const menuItemIds = data.items.map(i => i.menuItemId);
    const menuItems = await this.prisma.menuItem.findMany({
      where: { id: { in: menuItemIds }, available: true },
    });

    if (menuItems.length !== menuItemIds.length) {
      throw new BadRequestException('One or more items are unavailable');
    }

    // Calculate pricing
    const orderItems = data.items.map(item => {
      const menuItem = menuItems.find(m => m.id === item.menuItemId)!;
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        notes: item.notes || null,
        unitPrice: menuItem.price,
      };
    });

    const subtotal = orderItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const deliveryFee = data.deliveryType === 'delivery' ? 5.99 : 0;
    const tax = subtotal * 0.08;
    const tip = data.tipAmount || 0;
    const total = Math.round((subtotal + deliveryFee + tax + tip) * 100) / 100;
    const pointsEarned = Math.floor(total * 10);

    // Create the order in DB (status: PENDING until payment succeeds)
    const order = await this.prisma.order.create({
      data: {
        userId,
        total,
        deliveryType: data.deliveryType === 'delivery' ? DeliveryType.DELIVERY : DeliveryType.PICKUP,
        scheduledDate: data.scheduledDate,
        scheduledTime: data.scheduledTime,
        notes: data.notes,
        addressId: data.addressId,
        pointsEarned,
        items: { create: orderItems },
      },
      include: { items: { include: { menuItem: true } }, address: true },
    });

    // Create payment intent  
    const paymentIntent = await this.createPaymentIntent(total, 'usd', {
      orderId: order.id,
      userId,
    });

    // Link payment to order
    await this.prisma.order.update({
      where: { id: order.id },
      data: { stripePaymentId: paymentIntent.id },
    });

    return {
      order,
      payment: paymentIntent,
      summary: {
        subtotal: Math.round(subtotal * 100) / 100,
        deliveryFee,
        tax: Math.round(tax * 100) / 100,
        tip,
        total,
        pointsEarned,
      },
    };
  }

  // ── Confirm Payment (webhook or client-side) ──────
  async confirmPayment(orderId: string, paymentIntentId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new BadRequestException('Order not found');

    // Update order status
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CONFIRMED', stripePaymentId: paymentIntentId },
      include: { items: { include: { menuItem: true } }, address: true },
    });

    // Award rewards points
    await this.usersService.updateRewardsPoints(order.userId, order.pointsEarned);
    await this.prisma.user.update({
      where: { id: order.userId },
      data: { totalOrders: { increment: 1 } },
    });

    return updatedOrder;
  }

  // ── Payment Intent ──────────────────────────────────
  async createPaymentIntent(amount: number, currency = 'usd', metadata?: Record<string, string>) {
    if (!this.stripe) {
      return {
        id: `pi_mock_${Date.now()}`,
        clientSecret: `pi_mock_${Date.now()}_secret_mock`,
        amount: Math.round(amount * 100),
        currency,
        status: 'requires_payment_method',
        mock: true,
      };
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata,
      automatic_payment_methods: { enabled: true },
    });

    return {
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    };
  }

  // ── Catering Deposit ────────────────────────────────
  async createCateringDeposit(totalAmount: number, depositPercentage = 50, metadata?: Record<string, string>) {
    const depositAmount = totalAmount * (depositPercentage / 100);
    return this.createPaymentIntent(depositAmount, 'usd', {
      ...metadata,
      type: 'catering_deposit',
      totalAmount: totalAmount.toString(),
      depositPercentage: depositPercentage.toString(),
    });
  }

  // ── Subscriptions ───────────────────────────────────
  async createSubscription(userId: string, plan: string) {
    const planPricing: Record<string, { name: string; price: number; meals: number }> = {
      WEEKLY_BASIC: { name: 'Basic', price: 79.99, meals: 5 },
      WEEKLY_PREMIUM: { name: 'Premium', price: 149.99, meals: 10 },
      WEEKLY_FAMILY: { name: 'Family', price: 199.99, meals: 14 },
    };

    const planInfo = planPricing[plan];
    if (!planInfo) throw new BadRequestException('Invalid subscription plan');

    const subscription = await this.prisma.subscription.create({
      data: {
        userId,
        plan: plan as any,
        status: 'ACTIVE',
        stripeSubId: this.stripe ? undefined : `sub_mock_${Date.now()}`,
        nextDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { subscription, plan: planInfo };
  }

  async getUserSubscriptions(userId: string) {
    return this.prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async pauseSubscription(subscriptionId: string) {
    return this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: 'PAUSED' },
    });
  }

  async resumeSubscription(subscriptionId: string) {
    return this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'ACTIVE',
        nextDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  async cancelSubscription(subscriptionId: string) {
    const subscription = await this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: 'CANCELLED' },
    });

    if (this.stripe && subscription.stripeSubId) {
      try {
        await this.stripe.subscriptions.cancel(subscription.stripeSubId);
      } catch (e: any) {
        this.logger.error('Failed to cancel Stripe subscription:', e.message);
      }
    }

    return subscription;
  }

  // ── Stripe Webhook ──────────────────────────────────
  async handleWebhook(event: any) {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object;
        this.logger.log(`Payment succeeded: ${pi.id}`);
        if (pi.metadata?.orderId) {
          await this.confirmPayment(pi.metadata.orderId, pi.id);
        }
        break;
      }
      case 'payment_intent.payment_failed':
        this.logger.log(`Payment failed: ${event.data.object.id}`);
        break;
      case 'invoice.payment_succeeded':
        this.logger.log(`Subscription payment succeeded: ${event.data.object.subscription}`);
        break;
      default:
        this.logger.log(`Unhandled Stripe event: ${event.type}`);
    }
    return { received: true };
  }
}
