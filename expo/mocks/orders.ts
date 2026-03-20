import { Order } from '@/types';
import { menuItems } from './menu';

export const pastOrders: Order[] = [
  {
    id: 'ORD-001',
    items: [
      { menuItem: menuItems[0], quantity: 2, notes: '' },
      { menuItem: menuItems[3], quantity: 1, notes: 'Extra tahini' },
    ],
    total: 76.97,
    status: 'delivered',
    createdAt: '2026-03-15T18:30:00Z',
    deliveryType: 'delivery',
    scheduledDate: '2026-03-16',
    scheduledTime: '6:00 PM',
  },
  {
    id: 'ORD-002',
    items: [
      { menuItem: menuItems[4], quantity: 1, notes: '' },
    ],
    total: 65.99,
    status: 'delivered',
    createdAt: '2026-03-10T12:00:00Z',
    deliveryType: 'pickup',
    scheduledDate: '2026-03-11',
    scheduledTime: '12:00 PM',
  },
  {
    id: 'ORD-003',
    items: [
      { menuItem: menuItems[2], quantity: 1, notes: 'Medium rare please' },
      { menuItem: menuItems[1], quantity: 1, notes: '' },
    ],
    total: 79.98,
    status: 'preparing',
    createdAt: '2026-03-19T10:00:00Z',
    deliveryType: 'delivery',
    scheduledDate: '2026-03-19',
    scheduledTime: '7:00 PM',
  },
];
