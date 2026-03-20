import { Controller, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register push notification token' })
  registerToken(@Request() req, @Body() body: { token: string; platform: string }) {
    return this.notificationsService.registerPushToken(req.user.sub, body.token, body.platform);
  }

  @Delete('unregister/:token')
  @ApiOperation({ summary: 'Remove push notification token' })
  removeToken(@Param('token') token: string) {
    return this.notificationsService.removePushToken(token);
  }

  @Post('broadcast')
  @ApiOperation({ summary: 'Broadcast notification (admin)' })
  broadcast(@Body() body: {
    title: string;
    body: string;
    segment?: { tier?: string; hasOrdered?: boolean };
  }) {
    return this.notificationsService.broadcast(body.title, body.body, body.segment);
  }
}
