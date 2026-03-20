import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChatService } from './chat.service';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Get user conversations' })
  getUserConversations(@Request() req) {
    return this.chatService.getUserConversations(req.user.sub);
  }

  @Get('conversations/admin')
  @ApiOperation({ summary: 'Get all conversations (admin)' })
  getAllConversations(@Query('limit') limit?: string) {
    return this.chatService.getAllConversations(limit ? parseInt(limit) : undefined);
  }

  @Post('conversations')
  @ApiOperation({ summary: 'Get or create a conversation' })
  getOrCreateConversation(@Request() req, @Body() body: { orderId?: string }) {
    return this.chatService.getOrCreateConversation(req.user.sub, body.orderId);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Get messages in a conversation' })
  getMessages(
    @Param('id') id: string,
    @Query('limit') limit?: string,
    @Query('before') before?: string,
  ) {
    return this.chatService.getMessages(id, limit ? parseInt(limit) : undefined, before);
  }

  @Post('conversations/:id/messages')
  @ApiOperation({ summary: 'Send a message (REST fallback)' })
  sendMessage(
    @Param('id') id: string,
    @Body() body: { text: string; sender: 'USER' | 'ADMIN'; image?: string },
  ) {
    return this.chatService.sendMessage(id, body.text, body.sender, body.image);
  }
}
