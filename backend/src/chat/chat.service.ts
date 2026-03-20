import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateConversation(userId: string, orderId?: string) {
    // Find existing conversation or create new one
    let conversation = await this.prisma.chatConversation.findFirst({
      where: { userId, ...(orderId ? { orderId } : {}) },
      include: {
        messages: { orderBy: { createdAt: 'asc' }, take: 50 },
      },
    });

    if (!conversation) {
      conversation = await this.prisma.chatConversation.create({
        data: { userId, orderId },
        include: {
          messages: { orderBy: { createdAt: 'asc' } },
        },
      });
    }

    return conversation;
  }

  async sendMessage(conversationId: string, text: string, sender: 'USER' | 'ADMIN' | 'ASSISTANT', image?: string) {
    const message = await this.prisma.chatMessage.create({
      data: {
        conversationId,
        text,
        sender,
        image,
      },
    });

    // Update conversation timestamp
    await this.prisma.chatConversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  async getMessages(conversationId: string, limit = 50, before?: string) {
    const where: any = { conversationId };
    if (before) {
      where.createdAt = { lt: new Date(before) };
    }

    return this.prisma.chatMessage.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
  }

  async getUserConversations(userId: string) {
    return this.prisma.chatConversation.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        user: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  // Admin: get all conversations
  async getAllConversations(limit = 20) {
    return this.prisma.chatConversation.findMany({
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        user: { select: { id: true, name: true, email: true, avatar: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
    });
  }
}
