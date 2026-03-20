import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { OrderStatus, DeliveryType } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async create(userId: string, data: {
    items: { menuItemId: string; quantity: number; notes?: string }[];
    deliveryType: string;
    scheduledDate?: string;
    scheduledTime?: string;
    notes?: string;
    addressId?: string;
  }) {
    // Fetch menu items to calculate prices
    const menuItemIds = data.items.map(i => i.menuItemId);
    const menuItems = await this.prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
    });

    const orderItems = data.items.map(item => {
      const menuItem = menuItems.find(m => m.id === item.menuItemId);
      if (!menuItem) throw new NotFoundException(`Menu item ${item.menuItemId} not found`);
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        notes: item.notes || null,
        unitPrice: menuItem.price,
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const deliveryFee = data.deliveryType === 'delivery' ? 5.99 : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax;
    const pointsEarned = Math.floor(total * 10);

    const order = await this.prisma.order.create({
      data: {
        userId,
        total: Math.round(total * 100) / 100,
        deliveryType: data.deliveryType === 'delivery' ? DeliveryType.DELIVERY : DeliveryType.PICKUP,
        scheduledDate: data.scheduledDate,
        scheduledTime: data.scheduledTime,
        notes: data.notes,
        addressId: data.addressId,
        pointsEarned,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: { include: { menuItem: true } },
        address: true,
      },
    });

    // Award points & update total orders
    await this.usersService.updateRewardsPoints(userId, pointsEarned);
    await this.prisma.user.update({
      where: { id: userId },
      data: { totalOrders: { increment: 1 } },
    });

    return order;
  }

  async findAll(userId: string, filters?: { status?: string }) {
    const where: any = { userId };
    if (filters?.status) {
      where.status = filters.status.toUpperCase() as OrderStatus;
    }

    return this.prisma.order.findMany({
      where,
      include: {
        items: { include: { menuItem: true } },
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { menuItem: true } },
        address: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.order.update({
      where: { id },
      data: { status: status.toUpperCase() as OrderStatus },
      include: {
        items: { include: { menuItem: true } },
        address: true,
      },
    });
  }

  // Admin: get all orders across all users
  async findAllAdmin(filters?: { status?: string; limit?: number }) {
    const where: any = {};
    if (filters?.status) {
      where.status = filters.status.toUpperCase() as OrderStatus;
    }

    return this.prisma.order.findMany({
      where,
      include: {
        items: { include: { menuItem: true } },
        address: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 50,
    });
  }

  // Analytics
  async getStats() {
    const [totalOrders, totalRevenue, activeOrders, todayOrders] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.aggregate({ _sum: { total: true } }),
      this.prisma.order.count({
        where: { status: { in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY'] } },
      }),
      this.prisma.order.count({
        where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
      }),
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      activeOrders,
      todayOrders,
    };
  }
}
