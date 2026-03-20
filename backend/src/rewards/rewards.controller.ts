import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RewardsService } from './rewards.service';

@ApiTags('Rewards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rewards')
export class RewardsController {
  constructor(private rewardsService: RewardsService) {}

  @Get()
  @ApiOperation({ summary: 'Get rewards info for current user' })
  getRewardsInfo(@Request() req) {
    return this.rewardsService.getRewardsInfo(req.user.sub);
  }

  @Get('tiers')
  @ApiOperation({ summary: 'Get tier benefits info' })
  getTierBenefits() {
    return this.rewardsService.getTierBenefits();
  }

  @Post('redeem/:rewardId')
  @ApiOperation({ summary: 'Redeem a reward' })
  redeemReward(@Request() req, @Param('rewardId') rewardId: string) {
    return this.rewardsService.redeemReward(req.user.sub, rewardId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get redemption history' })
  getRedemptionHistory(@Request() req) {
    return this.rewardsService.getRedemptionHistory(req.user.sub);
  }

  @Post('catalog')
  @ApiOperation({ summary: 'Create a reward (admin)' })
  createReward(@Body() body: { name: string; description: string; pointsCost: number; image?: string }) {
    return this.rewardsService.createReward(body);
  }

  @Patch('catalog/:id')
  @ApiOperation({ summary: 'Update a reward (admin)' })
  updateReward(@Param('id') id: string, @Body() body: any) {
    return this.rewardsService.updateReward(id, body);
  }
}
