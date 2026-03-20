import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ReferralsService {
  private readonly REFERRAL_BONUS_POINTS = 500; // Points for both referrer and referee

  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  // Get user's referral info (code, stats)
  async getReferralInfo(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { referralCode: true },
    });

    const sentReferrals = await this.prisma.referral.findMany({
      where: { referrerId: userId },
      include: { referee: { select: { name: true, createdAt: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const completedReferrals = sentReferrals.filter(r => r.rewardCredited);
    const pendingReferrals = sentReferrals.filter(r => !r.rewardCredited && !r.refereeId);

    return {
      referralCode: user?.referralCode,
      shareLink: `https://exquisitemeals.com/join?ref=${user?.referralCode}`,
      totalReferred: sentReferrals.filter(r => r.refereeId).length,
      totalEarned: completedReferrals.length * this.REFERRAL_BONUS_POINTS,
      bonusPerReferral: this.REFERRAL_BONUS_POINTS,
      history: sentReferrals.map(r => ({
        id: r.id,
        code: r.code,
        status: r.rewardCredited ? 'credited' : (r.refereeId ? 'signed_up' : 'pending'),
        refereeName: r.referee?.name || null,
        date: r.createdAt,
      })),
    };
  }

  // Apply a referral code during registration
  async applyReferralCode(newUserId: string, referralCode: string) {
    // Find the referrer
    const referrer = await this.prisma.user.findUnique({
      where: { referralCode },
    });

    if (!referrer) {
      throw new NotFoundException('Invalid referral code');
    }

    if (referrer.id === newUserId) {
      throw new BadRequestException('Cannot use your own referral code');
    }

    // Check if already referred
    const existingReferral = await this.prisma.referral.findFirst({
      where: { refereeId: newUserId },
    });

    if (existingReferral) {
      throw new BadRequestException('Referral already applied');
    }

    // Create the referral record
    const referral = await this.prisma.referral.create({
      data: {
        referrerId: referrer.id,
        refereeId: newUserId,
        code: referralCode,
        rewardCredited: true,
      },
    });

    // Award points to both parties
    await Promise.all([
      this.usersService.updateRewardsPoints(referrer.id, this.REFERRAL_BONUS_POINTS),
      this.usersService.updateRewardsPoints(newUserId, this.REFERRAL_BONUS_POINTS),
    ]);

    return {
      message: `Welcome bonus! You and ${referrer.name} each earned ${this.REFERRAL_BONUS_POINTS} points!`,
      pointsEarned: this.REFERRAL_BONUS_POINTS,
    };
  }
}
