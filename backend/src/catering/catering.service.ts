import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CateringService {
  constructor(private prisma: PrismaService) {}

  // Submit a catering inquiry
  async submitInquiry(userId: string, data: {
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
    // Store as a special catering order with notes containing all details
    const notes = JSON.stringify({
      eventType: data.eventType,
      venue: data.venue,
      venueAddress: data.venueAddress,
      dietaryRequirements: data.dietaryRequirements,
      cuisinePreference: data.cuisinePreference,
      budgetRange: data.budgetRange,
      specialRequests: data.specialRequests,
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail,
    });

    // Find a catering menu item to link to (use the first available)
    const cateringItem = await this.prisma.menuItem.findFirst({
      where: { category: 'CATERING', available: true },
    });

    if (!cateringItem) {
      throw new NotFoundException('No catering packages available');
    }

    const order = await this.prisma.order.create({
      data: {
        userId,
        total: 0, // TBD — admin will quote
        deliveryType: 'DELIVERY',
        scheduledDate: data.eventDate,
        scheduledTime: data.eventTime,
        notes,
        status: 'PENDING',
        items: {
          create: [{
            menuItemId: cateringItem.id,
            quantity: data.guestCount,
            unitPrice: 0,
            notes: `Catering inquiry for ${data.guestCount} guests — ${data.eventType}`,
          }],
        },
      },
      include: { items: { include: { menuItem: true } } },
    });

    // Also create a chat conversation for this inquiry
    const conversation = await this.prisma.chatConversation.create({
      data: {
        userId,
        orderId: order.id,
        title: `Catering: ${data.eventType} — ${data.eventDate}`,
      },
    });

    // Send an automated first message
    await this.prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        text: `Thank you for your catering inquiry! 🎉\n\nEvent: ${data.eventType}\nDate: ${data.eventDate} at ${data.eventTime}\nGuests: ${data.guestCount}\nVenue: ${data.venue}\n\nOur catering team will review your request and get back to you within 24 hours with a custom proposal. Feel free to add any additional details here!`,
        sender: 'ASSISTANT',
      },
    });

    return {
      order,
      conversationId: conversation.id,
      message: 'Catering inquiry submitted! Our team will contact you within 24 hours.',
    };
  }

  // Smart Reorder: get user's most ordered items
  async getSmartReorderSuggestions(userId: string) {
    // Get all past order items with frequency
    const orderItems = await this.prisma.orderItem.findMany({
      where: { order: { userId, status: { not: 'CANCELLED' } } },
      include: { menuItem: true },
    });

    // Count frequency per menu item
    const itemCounts = new Map<string, { item: any; count: number; lastOrdered: Date }>();
    for (const oi of orderItems) {
      const existing = itemCounts.get(oi.menuItemId);
      if (existing) {
        existing.count += oi.quantity;
      } else {
        itemCounts.set(oi.menuItemId, {
          item: oi.menuItem,
          count: oi.quantity,
          lastOrdered: new Date(),
        });
      }
    }

    // Sort by frequency and return top suggestions
    const suggestions = Array.from(itemCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
      .map(s => ({
        menuItem: s.item,
        orderCount: s.count,
        suggestedQuantity: Math.min(Math.ceil(s.count / 3), 3), // Suggest typical order qty
      }));

    // Get last order for quick reorder
    const lastOrder = await this.prisma.order.findFirst({
      where: { userId, status: { not: 'CANCELLED' } },
      include: { items: { include: { menuItem: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return {
      suggestions,
      lastOrder: lastOrder ? {
        id: lastOrder.id,
        date: lastOrder.createdAt,
        total: lastOrder.total,
        items: lastOrder.items.map(i => ({
          menuItem: i.menuItem,
          quantity: i.quantity,
        })),
      } : null,
    };
  }
}
