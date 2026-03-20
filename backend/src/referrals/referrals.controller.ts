import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReferralsService } from './referrals.service';

@ApiTags('Referrals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('referrals')
export class ReferralsController {
  constructor(private referralsService: ReferralsService) {}

  @Get()
  @ApiOperation({ summary: 'Get referral info and history' })
  getReferralInfo(@Request() req) {
    return this.referralsService.getReferralInfo(req.user.sub);
  }

  @Post('apply')
  @ApiOperation({ summary: 'Apply a referral code' })
  applyReferralCode(@Request() req, @Body() body: { code: string }) {
    return this.referralsService.applyReferralCode(req.user.sub, body.code);
  }
}
