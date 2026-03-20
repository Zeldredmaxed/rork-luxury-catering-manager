import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RewardsTier } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { addresses: true, favorites: { include: { menuItem: true } } },
    });
    if (!user) return null;
    const { passwordHash, ...result } = user;
    return result;
  }

  async updateProfile(userId: string, data: {
    name?: string;
    phone?: string;
    avatar?: string;
    dietaryPreferences?: string[];
    allergies?: string[];
  }) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
      include: { addresses: true },
    });
    const { passwordHash, ...result } = user;
    return result;
  }

  async addAddress(userId: string, data: {
    label: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    isDefault?: boolean;
  }) {
    if (data.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }
    return this.prisma.address.create({
      data: { ...data, userId },
    });
  }

  async updateAddress(userId: string, addressId: string, data: {
    label?: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    isDefault?: boolean;
  }) {
    if (data.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }
    return this.prisma.address.update({
      where: { id: addressId },
      data,
    });
  }

  async deleteAddress(addressId: string) {
    return this.prisma.address.delete({ where: { id: addressId } });
  }

  async toggleFavorite(userId: string, menuItemId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_menuItemId: { userId, menuItemId } },
    });
    if (existing) {
      await this.prisma.favorite.delete({ where: { id: existing.id } });
      return { favorited: false };
    }
    await this.prisma.favorite.create({ data: { userId, menuItemId } });
    return { favorited: true };
  }

  async getFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: { menuItem: true },
    });
  }

  // Tier calculation based on points
  calculateTier(points: number): RewardsTier {
    if (points >= 7500) return 'VIP';
    if (points >= 3000) return 'GOLD';
    if (points >= 1000) return 'SILVER';
    return 'BRONZE';
  }

  async updateRewardsPoints(userId: string, pointsToAdd: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return null;

    const newPoints = user.rewardsPoints + pointsToAdd;
    const newTier = this.calculateTier(newPoints);

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        rewardsPoints: newPoints,
        rewardsTier: newTier,
      },
    });
  }
}
