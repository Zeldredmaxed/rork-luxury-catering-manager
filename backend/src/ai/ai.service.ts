import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: any = null;

  // Knowledge base for the AI assistant
  private readonly businessKnowledge = {
    about: `Exquisite Meals is a luxury gourmet catering service offering meal prep, family meals, and full-service catering for events. We use only the finest ingredients, sourced from local farms and premium suppliers.`,
    policies: {
      delivery: 'Free delivery for Gold and VIP tier members. Standard delivery fee is $5.99. Minimum order $15.',
      cancellation: 'Orders can be cancelled up to 2 hours before the scheduled delivery/pickup time for a full refund.',
      allergies: 'We take allergies seriously. All meals are prepared in a kitchen that handles common allergens. Please specify all allergies when ordering.',
      catering: 'Catering orders require at least 72 hours advance notice. A 50% deposit is required at booking. Custom menus available for events of 20+ guests.',
    },
    hours: 'Kitchen hours: Monday-Saturday 8AM-9PM, Sunday 10AM-6PM. Delivery available during kitchen hours.',
  };

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.initOpenAI();
  }

  private async initOpenAI() {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey) {
      try {
        const { default: OpenAI } = await import('openai');
        this.openai = new OpenAI({ apiKey });
        this.logger.log('OpenAI client initialized');
      } catch (e) {
        this.logger.warn('Failed to initialize OpenAI client:', e.message);
      }
    } else {
      this.logger.warn('OPENAI_API_KEY not set - AI will use fallback responses');
    }
  }

  async chat(userId: string, message: string, conversationHistory: { role: string; content: string }[] = []) {
    // Get menu items for context
    const menuItems = await this.prisma.menuItem.findMany({
      where: { available: true },
      select: { name: true, description: true, price: true, category: true, tags: true, calories: true },
    });

    const menuContext = menuItems.map(item =>
      `${item.name} ($${item.price}) - ${item.category.replace('_', ' ')} - ${item.description}${item.tags.length ? ` [${item.tags.join(', ')}]` : ''}${item.calories ? ` ${item.calories}cal` : ''}`
    ).join('\n');

    // If OpenAI is available, use it
    if (this.openai) {
      try {
        const systemPrompt = `You are the Culinary Concierge for Exquisite Meals, a luxury gourmet catering service. You are warm, professional, and knowledgeable about food.

BUSINESS INFO:
${this.businessKnowledge.about}

POLICIES:
- Delivery: ${this.businessKnowledge.policies.delivery}
- Cancellation: ${this.businessKnowledge.policies.cancellation}
- Allergies: ${this.businessKnowledge.policies.allergies}
- Catering: ${this.businessKnowledge.policies.catering}
- Hours: ${this.businessKnowledge.hours}

CURRENT MENU:
${menuContext}

GUIDELINES:
- Be concise but helpful (2-3 sentences max per response)
- Recommend specific menu items with prices when relevant
- If asked about ordering, guide them to browse the menu in the app
- For catering inquiries, collect: date, guest count, preferences, venue
- Always be warm and use a luxury brand voice
- If you don't know something, refer them to customer support`;

        const messages = [
          { role: 'system' as const, content: systemPrompt },
          ...conversationHistory.map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
          })),
          { role: 'user' as const, content: message },
        ];

        const completion = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.7,
          max_tokens: 300,
        });

        return {
          text: completion.choices[0].message.content,
          source: 'openai',
        };
      } catch (error) {
        this.logger.error('OpenAI API error:', error.message);
        return this.getFallbackResponse(message, menuItems);
      }
    }

    // Fallback: keyword-based responses
    return this.getFallbackResponse(message, menuItems);
  }

  private getFallbackResponse(message: string, menuItems: any[]) {
    const lower = message.toLowerCase();

    if (lower.includes('menu') || lower.includes('today') || lower.includes('what do you have')) {
      const featured = menuItems.filter(m => m.category === 'MEAL_PREP').slice(0, 3);
      const suggestions = featured.map(m => `${m.name} ($${m.price})`).join(', ');
      return {
        text: `Today's highlights include ${suggestions}. Would you like to browse our full menu or hear about a specific category?`,
        source: 'fallback',
      };
    }

    if (lower.includes('healthy') || lower.includes('recommend') || lower.includes('suggest')) {
      const healthy = menuItems.find(m => m.tags.includes('gluten-free') || m.tags.includes('vegan'));
      return {
        text: healthy
          ? `I'd recommend our ${healthy.name} ($${healthy.price}) — ${healthy.description.slice(0, 100)}. It's one of our most popular choices!`
          : `We have several healthy options. Check out our Meal Prep section for nutritious, portion-controlled gourmet meals!`,
        source: 'fallback',
      };
    }

    if (lower.includes('vegan') || lower.includes('vegetarian') || lower.includes('plant')) {
      return {
        text: `We offer several plant-based options! Our Mediterranean Grain Bowl is fully vegan, and many of our dishes can be customized to accommodate dietary preferences. Would you like me to show you the vegan-friendly menu?`,
        source: 'fallback',
      };
    }

    if (lower.includes('party') || lower.includes('dinner') || lower.includes('event') || lower.includes('catering') || lower.includes('wedding')) {
      return {
        text: `I'd love to help with your event! Our catering packages start from $34.99/person for executive lunches up to full wedding dinner service. Could you tell me the date, expected guest count, and type of event? We'll create a custom proposal for you.`,
        source: 'fallback',
      };
    }

    if (lower.includes('delivery') || lower.includes('ship') || lower.includes('how long')) {
      return {
        text: `${this.businessKnowledge.policies.delivery} ${this.businessKnowledge.hours} Schedule your delivery when placing an order!`,
        source: 'fallback',
      };
    }

    if (lower.includes('allerg') || lower.includes('gluten') || lower.includes('nut') || lower.includes('dairy')) {
      return {
        text: `${this.businessKnowledge.policies.allergies} You can set your dietary preferences in your profile, and we'll always flag potential allergens for you.`,
        source: 'fallback',
      };
    }

    if (lower.includes('cancel') || lower.includes('refund')) {
      return {
        text: this.businessKnowledge.policies.cancellation,
        source: 'fallback',
      };
    }

    if (lower.includes('reward') || lower.includes('point') || lower.includes('loyalty')) {
      return {
        text: `You earn points on every order! Check the Rewards tab to see your tier, available rewards, and how close you are to the next level. Bronze → Silver → Gold → VIP — each tier unlocks better perks!`,
        source: 'fallback',
      };
    }

    return {
      text: `That's a great question! Let me help you with that. Our team specializes in creating memorable dining experiences. Could you tell me more about what you're looking for? You can also browse our menu, check your rewards, or ask me about catering.`,
      source: 'fallback',
    };
  }

  // Admin: generate AI reply suggestion for a customer message
  async suggestReply(customerMessage: string) {
    if (!this.openai) {
      return { suggestion: 'Thank you for reaching out! Let me look into this for you and get back to you shortly.' };
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a customer service assistant for Exquisite Meals, a luxury catering service. Suggest a warm, professional reply to the customer message. Keep it concise (1-2 sentences).',
          },
          { role: 'user', content: customerMessage },
        ],
        temperature: 0.7,
        max_tokens: 150,
      });

      return { suggestion: completion.choices[0].message.content };
    } catch {
      return { suggestion: 'Thank you for reaching out! Let me look into this for you.' };
    }
  }
}
