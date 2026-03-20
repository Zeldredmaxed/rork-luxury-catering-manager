'use client';

import { useEffect, useState } from 'react';

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  activeOrders: number;
  todayOrders: number;
}

const mockStats: Stats = {
  totalOrders: 1247,
  totalRevenue: 89450.00,
  activeOrders: 12,
  todayOrders: 34,
};

const recentOrders = [
  { id: 'ORD-1247', customer: 'Sarah M.', total: 76.97, status: 'Preparing', time: '2 min ago' },
  { id: 'ORD-1246', customer: 'James K.', total: 124.98, status: 'Confirmed', time: '5 min ago' },
  { id: 'ORD-1245', customer: 'Emily R.', total: 58.99, status: 'Delivered', time: '15 min ago' },
  { id: 'ORD-1244', customer: 'Michael T.', total: 899.99, status: 'Pending', time: '22 min ago' },
  { id: 'ORD-1243', customer: 'Lisa W.', total: 43.98, status: 'Ready', time: '30 min ago' },
];

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  Preparing: 'bg-orange-100 text-orange-800',
  Ready: 'bg-emerald-100 text-emerald-800',
  Delivered: 'bg-gray-100 text-gray-600',
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>(mockStats);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Dashboard</h1>
        <p className="text-sm text-[#9B9490] mt-1">Welcome back. Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E0D8]">
          <p className="text-sm text-[#9B9490] font-medium">Total Revenue</p>
          <p className="text-2xl font-bold text-[#1A1A1A] mt-2">${stats.totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-emerald-600 mt-2 font-medium">↑ 12.5% from last month</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E0D8]">
          <p className="text-sm text-[#9B9490] font-medium">Total Orders</p>
          <p className="text-2xl font-bold text-[#1A1A1A] mt-2">{stats.totalOrders.toLocaleString()}</p>
          <p className="text-xs text-emerald-600 mt-2 font-medium">↑ 8.3% from last month</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E0D8]">
          <p className="text-sm text-[#9B9490] font-medium">Active Orders</p>
          <p className="text-2xl font-bold text-[#C4956A] mt-2">{stats.activeOrders}</p>
          <p className="text-xs text-[#9B9490] mt-2">Requires attention</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E0D8]">
          <p className="text-sm text-[#9B9490] font-medium">Today&apos;s Orders</p>
          <p className="text-2xl font-bold text-[#1A1A1A] mt-2">{stats.todayOrders}</p>
          <p className="text-xs text-emerald-600 mt-2 font-medium">↑ 5 more than yesterday</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8E0D8]">
        <div className="px-6 py-4 border-b border-[#E8E0D8] flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#1A1A1A]">Recent Orders</h2>
          <a href="/orders" className="text-sm text-[#C4956A] font-medium hover:underline">View all →</a>
        </div>
        <div className="divide-y divide-[#F0EAE3]">
          {recentOrders.map((order) => (
            <div key={order.id} className="px-6 py-4 flex items-center justify-between hover:bg-[#FDF8F3] transition-colors">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">{order.id}</p>
                  <p className="text-xs text-[#9B9490]">{order.customer}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <p className="text-sm font-semibold text-[#1A1A1A]">${order.total.toFixed(2)}</p>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[order.status]}`}>
                  {order.status}
                </span>
                <p className="text-xs text-[#9B9490] w-20 text-right">{order.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
