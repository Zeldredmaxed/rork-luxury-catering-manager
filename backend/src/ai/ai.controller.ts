import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiService } from './ai.service';

@ApiTags('AI')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('chat')
  @ApiOperation({ summary: 'Chat with AI assistant' })
  chat(@Request() req, @Body() body: {
    message: string;
    conversationHistory?: { role: string; content: string }[];
  }) {
    return this.aiService.chat(req.user.sub, body.message, body.conversationHistory);
  }

  @Post('suggest-reply')
  @ApiOperation({ summary: 'Get AI reply suggestion (admin)' })
  suggestReply(@Body() body: { message: string }) {
    return this.aiService.suggestReply(body.message);
  }
}
