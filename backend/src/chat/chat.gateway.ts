import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, Set<string>> = new Map();

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // Remove from all user rooms
    this.userSockets.forEach((sockets, userId) => {
      sockets.delete(client.id);
      if (sockets.size === 0) this.userSockets.delete(userId);
    });
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string; conversationId?: string },
  ) {
    // Track user socket
    if (!this.userSockets.has(data.userId)) {
      this.userSockets.set(data.userId, new Set());
    }
    this.userSockets.get(data.userId)!.add(client.id);

    // Join conversation room if specified
    if (data.conversationId) {
      client.join(`conversation:${data.conversationId}`);
    }

    // Join user-specific room for notifications
    client.join(`user:${data.userId}`);

    return { status: 'joined' };
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {
      conversationId: string;
      text: string;
      sender: 'USER' | 'ADMIN' | 'ASSISTANT';
      image?: string;
    },
  ) {
    const message = await this.chatService.sendMessage(
      data.conversationId,
      data.text,
      data.sender,
      data.image,
    );

    // Broadcast to all in the conversation room
    this.server
      .to(`conversation:${data.conversationId}`)
      .emit('newMessage', message);

    return message;
  }

  @SubscribeMessage('getHistory')
  async handleGetHistory(
    @MessageBody() data: { conversationId: string; limit?: number },
  ) {
    return this.chatService.getMessages(data.conversationId, data.limit);
  }

  // Server-side method to push messages (used by AI service, admin, etc.)
  async pushMessage(conversationId: string, text: string, sender: 'ADMIN' | 'ASSISTANT') {
    const message = await this.chatService.sendMessage(conversationId, text, sender);
    this.server
      .to(`conversation:${conversationId}`)
      .emit('newMessage', message);
    return message;
  }
}
