'use client';

import { useState } from 'react';

const mockOrders = [
  { id: 'ORD-1247', customer: 'Sarah Mitchell', email: 'sarah@email.com', items: ['Herb-Crusted Salmon x2', 'Mediterranean Grain Bowl'], total: 76.97, status: 'PREPARING', type: 'Delivery', scheduled: 'Today 6:00 PM', created: '2 min ago' },
  { id: 'ORD-1246', customer: 'James Kim', email: 'james@email.com', items: ['Family Pasta Night', 'Sunday Roast Chicken'], total: 124.98, status: 'CONFIRMED', type: 'Pickup', scheduled: 'Today 7:00 PM', created: '5 min ago' },
  { id: 'ORD-1245', customer: 'Emily Rodriguez', email: 'emily@email.com', items: ['Sunday Roast Chicken'], total: 58.99, status: 'DELIVERED', type: 'Delivery', scheduled: 'Today 5:00 PM', created: '15 min ago' },
  { id: 'ORD-1244', customer: 'Michael Torres', email: 'michael@email.com', items: ['Elegant Cocktail Reception'], total: 899.99, status: 'PENDING', type: 'Catering', scheduled: 'Mar 25 6:00 PM', created: '22 min ago' },
  { id: 'ORD-1243', customer: 'Lisa Wang', email: 'lisa@email.com', items: ['Wagyu Beef Tenderloin', 'Truffle Mushroom Risotto'], total: 79.98, status: 'READY', type: 'Pickup', scheduled: 'Today 5:30 PM', created: '30 min ago' },
  { id: 'ORD-1242', customer: 'David Park', email: 'david@email.com', items: ['Thai Coconut Curry Feast'], total: 52.99, status: 'OUT_FOR_DELIVERY', type: 'Delivery', scheduled: 'Today 6:30 PM', created: '45 min ago' },
];

const statusConfig: Record<string, { label: string; color: string; next?: string }> = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', next: 'CONFIRMED' },
  CONFIRMED: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', next: 'PREPARING' },
  PREPARING: { label: 'Preparing', color: 'bg-orange-100 text-orange-800', next: 'READY' },
  READY: { label: 'Ready', color: 'bg-emerald-100 text-emerald-800', next: 'OUT_FOR_DELIVERY' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', color: 'bg-purple-100 text-purple-800', next: 'DELIVERED' },
  DELIVERED: { label: 'Delivered', color: 'bg-gray-100 text-gray-600' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
};

const filters = ['All', 'Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered'];

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [orders, setOrders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const filteredOrders = activeFilter === 'All'
    ? orders
    : orders.filter(o => statusConfig[o.status]?.label === activeFilter);

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status: newStatus } : o
    ));
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Order Management</h1>
          <p className="text-sm text-[#9B9490] mt-1">{orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status)).length} active orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeFilter === f
                ? 'bg-[#1A1A1A] text-white'
                : 'bg-white text-[#6B6560] border border-[#E8E0D8] hover:border-[#C4956A]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8E0D8] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E8E0D8] bg-[#FDF8F3]">
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#9B9490] uppercase tracking-wider">Order</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#9B9490] uppercase tracking-wider">Customer</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#9B9490] uppercase tracking-wider">Items</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#9B9490] uppercase tracking-wider">Total</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#9B9490] uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#9B9490] uppercase tracking-wider">Scheduled</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#9B9490] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EAE3]">
            {filteredOrders.map(order => {
              const config = statusConfig[order.status];
              return (
                <tr key={order.id} className="hover:bg-[#FDF8F3] transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-[#1A1A1A]">{order.id}</p>
                    <p className="text-xs text-[#9B9490]">{order.created}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-[#1A1A1A]">{order.customer}</p>
                    <p className="text-xs text-[#9B9490]">{order.type}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-[#6B6560] max-w-[200px] truncate">{order.items.join(', ')}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-[#1A1A1A]">${order.total.toFixed(2)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${config?.color}`}>
                      {config?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-[#6B6560]">{order.scheduled}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {config?.next && (
                        <button
                          onClick={() => handleStatusUpdate(order.id, config.next!)}
                          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#C4956A] text-white hover:bg-[#A67B52] transition-colors"
                        >
                          → {statusConfig[config.next]?.label}
                        </button>
                      )}
                      {order.status === 'PENDING' && (
                        <button
                          onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}
                          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          Decline
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
