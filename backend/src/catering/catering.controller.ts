import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CateringService } from './catering.service';

@ApiTags('Catering')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('catering')
export class CateringController {
  constructor(private cateringService: CateringService) {}

  @Post('inquiry')
  @ApiOperation({ summary: 'Submit a catering inquiry' })
  submitInquiry(@Request() req, @Body() body: {
    eventType: string;
    eventDate: string;
    eventTime: string;
    guestCount: number;
    venue: string;
    venueAddress?: string;
    dietaryRequirements?: string[];
    cuisinePreference?: string;
    budgetRange?: string;
    specialRequests?: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
  }) {
    return this.cateringService.submitInquiry(req.user.sub, body);
  }

  @Get('reorder')
  @ApiOperation({ summary: 'Get smart reorder suggestions' })
  getSmartReorder(@Request() req) {
    return this.cateringService.getSmartReorderSuggestions(req.user.sub);
  }
}
