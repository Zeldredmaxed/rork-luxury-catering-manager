import { PrismaClient, MenuCategory } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminHash = await bcrypt.hash('admin123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@exquisitemeals.com' },
    update: {},
    create: {
      email: 'admin@exquisitemeals.com',
      passwordHash: adminHash,
      name: 'Admin',
      phone: '+1 (555) 000-0000',
      role: 'ADMIN',
      referralCode: 'EXQ-ADMIN0',
    },
  });

  // Create demo customer
  const customerHash = await bcrypt.hash('customer123!', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'alex@example.com' },
    update: {},
    create: {
      email: 'alex@example.com',
      passwordHash: customerHash,
      name: 'Alexandra Chen',
      phone: '+1 (555) 123-4567',
      dietaryPreferences: ['gluten-free'],
      allergies: [],
      rewardsPoints: 2450,
      rewardsTier: 'SILVER',
      totalOrders: 24,
      referralCode: 'EXQ-ALEXCH',
      addresses: {
        create: {
          label: 'Home',
          street: '123 Park Avenue',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          isDefault: true,
        },
      },
    },
  });

  // Seed menu items (from existing mock data)
  const menuItems = [
    {
      name: 'Herb-Crusted Salmon',
      description: 'Wild-caught Atlantic salmon with a fragrant herb crust, served with roasted asparagus and lemon butter sauce.',
      price: 28.99,
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80',
      category: MenuCategory.MEAL_PREP,
      tags: ['gluten-free', 'high-protein'],
      calories: 520,
      prepTime: '25 min',
      featured: true,
      popular: true,
    },
    {
      name: 'Truffle Mushroom Risotto',
      description: 'Creamy Arborio rice with wild mushrooms, finished with truffle oil and aged Parmesan.',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80',
      category: MenuCategory.MEAL_PREP,
      tags: ['vegetarian'],
      calories: 680,
      prepTime: '30 min',
      featured: true,
    },
    {
      name: 'Wagyu Beef Tenderloin',
      description: 'Premium A5 Wagyu beef, seared to perfection with a red wine reduction and roasted vegetables.',
      price: 54.99,
      image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80',
      category: MenuCategory.MEAL_PREP,
      tags: ['high-protein', 'gluten-free'],
      calories: 720,
      prepTime: '35 min',
      popular: true,
    },
    {
      name: 'Mediterranean Grain Bowl',
      description: 'Quinoa and farro blend with roasted chickpeas, sun-dried tomatoes, kalamata olives, and tahini dressing.',
      price: 18.99,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
      category: MenuCategory.MEAL_PREP,
      tags: ['vegan', 'dairy-free'],
      calories: 480,
      prepTime: '20 min',
    },
    {
      name: 'Family Pasta Night',
      description: 'House-made pappardelle with slow-braised short rib ragù, fresh herbs, and pecorino. Serves 4-6.',
      price: 65.99,
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80',
      category: MenuCategory.FAMILY_MEALS,
      tags: [],
      servings: 6,
      prepTime: '15 min reheat',
      featured: true,
    },
    {
      name: 'Sunday Roast Chicken',
      description: 'Whole roasted free-range chicken with herb stuffing, roasted root vegetables, and homemade gravy. Serves 4-6.',
      price: 58.99,
      image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&q=80',
      category: MenuCategory.FAMILY_MEALS,
      tags: ['gluten-free'],
      servings: 6,
      prepTime: '20 min reheat',
      popular: true,
    },
    {
      name: 'Thai Coconut Curry Feast',
      description: 'Aromatic green curry with seasonal vegetables, jasmine rice, and crispy spring rolls. Serves 4-6.',
      price: 52.99,
      image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&q=80',
      category: MenuCategory.FAMILY_MEALS,
      tags: ['dairy-free'],
      servings: 6,
      prepTime: '15 min reheat',
    },
    {
      name: 'Family BBQ Platter',
      description: 'Smoked brisket, pulled pork, cornbread, coleslaw, and baked beans. A complete feast for the family. Serves 6-8.',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=80',
      category: MenuCategory.FAMILY_MEALS,
      tags: ['gluten-free'],
      servings: 8,
      prepTime: '20 min reheat',
    },
    {
      name: 'Elegant Cocktail Reception',
      description: 'A curated selection of canapés, charcuterie, artisan cheeses, and seasonal crostini. Perfect for 20-50 guests.',
      price: 899.99,
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&q=80',
      category: MenuCategory.CATERING,
      tags: [],
      servings: 50,
      featured: true,
    },
    {
      name: 'Executive Lunch Package',
      description: 'Premium boxed lunches with gourmet sandwiches, salads, and desserts. Minimum 10 guests.',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
      category: MenuCategory.CATERING,
      tags: [],
      servings: 10,
    },
    {
      name: 'Wedding Dinner Service',
      description: 'Full-service plated dinner with appetizer, entrée choice, and dessert. Custom menu consultation included.',
      price: 1499.99,
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80',
      category: MenuCategory.CATERING,
      tags: [],
      servings: 100,
    },
    {
      name: 'Grilled Chicken Caesar',
      description: 'Tender grilled chicken breast over crisp romaine, shaved Parmesan, and house-made Caesar dressing.',
      price: 16.99,
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&q=80',
      category: MenuCategory.MEAL_PREP,
      tags: ['high-protein'],
      calories: 450,
      prepTime: '15 min',
    },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where: { id: item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') },
      update: item,
      create: item,
    });
  }

  // Seed rewards
  const rewards = [
    { name: 'Free Appetizer', description: 'Any appetizer from the menu', pointsCost: 500 },
    { name: '$10 Off Next Order', description: 'Applied automatically at checkout', pointsCost: 1000 },
    { name: 'Free Family Meal Upgrade', description: 'Upgrade any family meal to premium', pointsCost: 2000 },
    { name: 'Private Chef Experience', description: '2-hour private chef session at your home', pointsCost: 5000 },
  ];

  for (const reward of rewards) {
    await prisma.reward.create({ data: reward });
  }

  // Seed promotions
  await prisma.promotion.createMany({
    data: [
      {
        title: 'First Order Special',
        description: '20% off your first meal prep order',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
        discount: '20% OFF',
        validUntil: new Date('2026-04-30'),
      },
      {
        title: 'Family Fridays',
        description: 'Free dessert with every family meal on Fridays',
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80',
        discount: 'FREE DESSERT',
        validUntil: new Date('2026-05-15'),
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log(`   Admin: admin@exquisitemeals.com / admin123!`);
  console.log(`   Customer: alex@example.com / customer123!`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
