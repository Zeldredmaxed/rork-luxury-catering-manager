import { RewardsInfo } from '@/types';

export const rewardsData: RewardsInfo = {
  points: 2450,
  tier: 'silver',
  pointsToNextTier: 550,
  nextTier: 'gold',
  tierProgress: 0.82,
  availableRewards: [
    {
      id: '1',
      name: 'Free Appetizer',
      description: 'Any appetizer from the menu',
      pointsCost: 500,
    },
    {
      id: '2',
      name: '$10 Off Next Order',
      description: 'Applied automatically at checkout',
      pointsCost: 1000,
    },
    {
      id: '3',
      name: 'Free Family Meal Upgrade',
      description: 'Upgrade any family meal to premium',
      pointsCost: 2000,
    },
    {
      id: '4',
      name: 'Private Chef Experience',
      description: '2-hour private chef session at your home',
      pointsCost: 5000,
    },
  ],
};

export const tierBenefits = {
  bronze: {
    name: 'Bronze',
    minPoints: 0,
    perks: ['1x points on all orders', 'Birthday reward'],
    color: '#CD7F32',
  },
  silver: {
    name: 'Silver',
    minPoints: 1000,
    perks: ['1.5x points', 'Free delivery', 'Priority support'],
    color: '#AAA9AD',
  },
  gold: {
    name: 'Gold',
    minPoints: 3000,
    perks: ['2x points', 'Free delivery', 'Early menu access', 'Quarterly gift'],
    color: '#D4AF37',
  },
  vip: {
    name: 'VIP',
    minPoints: 7500,
    perks: ['3x points', 'Free delivery', 'Personal concierge', 'Exclusive events', 'Custom menu requests'],
    color: '#C4956A',
  },
};
