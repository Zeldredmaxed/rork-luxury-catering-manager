import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RewardsService {
  constructor(private prisma: PrismaService) {}

  async getRewardsInfo(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { rewardsPoints: true, rewardsTier: true },
    });
    if (!user) return null;

    const tierThresholds = {
      BRONZE: { min: 0, next: 'SILVER', nextMin: 1000 },
      SILVER: { min: 1000, next: 'GOLD', nextMin: 3000 },
      GOLD: { min: 3000, next: 'VIP', nextMin: 7500 },
      VIP: { min: 7500, next: null, nextMin: null },
    };

    const currentTier = tierThresholds[user.rewardsTier];
    const pointsToNextTier = currentTier.nextMin ? currentTier.nextMin - user.rewardsPoints : 0;
    const tierRange = currentTier.nextMin ? currentTier.nextMin - currentTier.min : 1;
    const tierProgress = currentTier.nextMin
      ? (user.rewardsPoints - currentTier.min) / tierRange
      : 1;

    const availableRewards = await this.prisma.reward.findMany({ where: { active: true } });

    return {
      points: user.rewardsPoints,
      tier: user.rewardsTier.toLowerCase(),
      pointsToNextTier,
      nextTier: currentTier.next?.toLowerCase() || null,
      tierProgress: Math.min(tierProgress, 1),
      availableRewards,
    };
  }

  async redeemReward(userId: string, rewardId: string) {
    const [user, reward] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.reward.findUnique({ where: { id: rewardId } }),
    ]);

    if (!user || !reward) throw new BadRequestException('User or reward not found');
    if (user.rewardsPoints < reward.pointsCost) {
      throw new BadRequestException('Insufficient points');
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { rewardsPoints: { decrement: reward.pointsCost } },
      }),
      this.prisma.rewardRedemption.create({
        data: { userId, rewardId },
      }),
    ]);

    return { message: 'Reward redeemed successfully', reward };
  }

  async getRedemptionHistory(userId: string) {
    return this.prisma.rewardRedemption.findMany({
      where: { userId },
      include: { reward: true },
      orderBy: { redeemedAt: 'desc' },
    });
  }

  // Admin: manage rewards catalog
  async createReward(data: { name: string; description: string; pointsCost: number; image?: string }) {
    return this.prisma.reward.create({ data });
  }

  async updateReward(id: string, data: any) {
    return this.prisma.reward.update({ where: { id }, data });
  }

  async getTierBenefits() {
    return {
      bronze: { name: 'Bronze', minPoints: 0, perks: ['1x points on all orders', 'Birthday reward'], color: '#CD7F32' },
      silver: { name: 'Silver', minPoints: 1000, perks: ['1.5x points', 'Free delivery', 'Priority support'], color: '#AAA9AD' },
      gold: { name: 'Gold', minPoints: 3000, perks: ['2x points', 'Free delivery', 'Early menu access', 'Quarterly gift'], color: '#D4AF37' },
      vip: { name: 'VIP', minPoints: 7500, perks: ['3x points', 'Free delivery', 'Personal concierge', 'Exclusive events', 'Custom menu requests'], color: '#C4956A' },
    };
  }
}
