import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MenuCategory } from '@prisma/client';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: {
    category?: string;
    search?: string;
    featured?: boolean;
    popular?: boolean;
  }) {
    const where: any = { available: true };

    if (filters?.category) {
      const categoryMap: Record<string, MenuCategory> = {
        'meal-prep': 'MEAL_PREP',
        'family-meals': 'FAMILY_MEALS',
        'catering': 'CATERING',
      };
      where.category = categoryMap[filters.category] || filters.category;
    }

    if (filters?.featured) where.featured = true;
    if (filters?.popular) where.popular = true;

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { tags: { hasSome: [filters.search.toLowerCase()] } },
      ];
    }

    return this.prisma.menuItem.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { popular: 'desc' }, { name: 'asc' }],
    });
  }

  async findOne(id: string) {
    return this.prisma.menuItem.findUnique({ where: { id } });
  }

  async create(data: {
    name: string;
    description: string;
    price: number;
    image?: string;
    category: MenuCategory;
    tags?: string[];
    calories?: number;
    prepTime?: string;
    servings?: number;
    featured?: boolean;
    popular?: boolean;
  }) {
    return this.prisma.menuItem.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.menuItem.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.menuItem.update({
      where: { id },
      data: { available: false },
    });
  }

  async getCategories() {
    return [
      { id: 'meal-prep', name: 'Meal Prep', description: 'Individual gourmet meals' },
      { id: 'family-meals', name: 'Family Meals', description: 'Feeds 4-8 people' },
      { id: 'catering', name: 'Catering', description: 'Events & celebrations' },
    ];
  }

  async getPromotions() {
    return this.prisma.promotion.findMany({
      where: { active: true, validUntil: { gte: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
