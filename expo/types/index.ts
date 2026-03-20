export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'meal-prep' | 'family-meals' | 'catering';
  tags: string[];
  calories?: number;
  prepTime?: string;
  servings?: number;
  featured?: boolean;
  popular?: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  dietaryPreferences: string[];
  allergies: string[];
  savedAddresses: Address[];
  rewardsPoints: number;
  rewardsTier: RewardsTier;
  totalOrders: number;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

export type RewardsTier = 'bronze' | 'silver' | 'gold' | 'vip';

export interface RewardsInfo {
  points: number;
  tier: RewardsTier;
  pointsToNextTier: number;
  nextTier: RewardsTier | null;
  tierProgress: number;
  availableRewards: Reward[];
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  image?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  deliveryType: 'delivery' | 'pickup';
  scheduledDate: string;
  scheduledTime: string;
  address?: Address;
  notes?: string;
}

export type OrderStatus = 'confirmed' | 'preparing' | 'ready' | 'delivered';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant' | 'admin';
  timestamp: string;
  image?: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  discount?: string;
  validUntil: string;
}
