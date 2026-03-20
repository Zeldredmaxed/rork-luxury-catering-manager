import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private prisma: PrismaService) {}

  async registerPushToken(userId: string, token: string, platform: string) {
    return this.prisma.pushToken.upsert({
      where: { token },
      update: { userId, platform },
      create: { userId, token, platform },
    });
  }

  async removePushToken(token: string) {
    return this.prisma.pushToken.deleteMany({ where: { token } });
  }

  // Send notification to a specific user (stub - integrate with Expo Push or FCM)
  async sendToUser(userId: string, title: string, body: string, data?: any) {
    const tokens = await this.prisma.pushToken.findMany({
      where: { userId },
    });

    this.logger.log(`Sending notification to user ${userId}: "${title}" (${tokens.length} devices)`);

    // TODO: Integrate with Expo Push Notifications API or Firebase Cloud Messaging
    // For now, just log the notification
    return {
      sent: true,
      recipientCount: tokens.length,
      title,
      body,
    };
  }

  // Broadcast to all users or a segment
  async broadcast(title: string, body: string, segment?: { tier?: string; hasOrdered?: boolean }) {
    let userFilter: any = {};

    if (segment?.tier) {
      userFilter.rewardsTier = segment.tier.toUpperCase();
    }
    if (segment?.hasOrdered !== undefined) {
      userFilter.totalOrders = segment.hasOrdered ? { gt: 0 } : 0;
    }

    const users = await this.prisma.user.findMany({
      where: userFilter,
      select: { id: true },
    });

    this.logger.log(`Broadcasting "${title}" to ${users.length} users`);

    // In production, batch these through Expo Push API
    return {
      sent: true,
      recipientCount: users.length,
      title,
      body,
      segment,
    };
  }

  // Order status notification
  async notifyOrderUpdate(userId: string, orderId: string, status: string) {
    const statusMessages: Record<string, string> = {
      CONFIRMED: 'Your order has been confirmed! We\'re getting started.',
      PREPARING: 'Our chefs are preparing your exquisite meal!',
      READY: 'Your order is ready for pickup!',
      OUT_FOR_DELIVERY: 'Your order is on its way!',
      DELIVERED: 'Your order has been delivered. Enjoy your meal! 🍽️',
    };

    const message = statusMessages[status] || `Order ${orderId} status updated to ${status}`;

    return this.sendToUser(userId, 'Order Update', message, { orderId, status });
  }
}
