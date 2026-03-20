'use client';

const revenueData = [
  { month: 'Oct', revenue: 12400 },
  { month: 'Nov', revenue: 15600 },
  { month: 'Dec', revenue: 18200 },
  { month: 'Jan', revenue: 14800 },
  { month: 'Feb', revenue: 16900 },
  { month: 'Mar', revenue: 21300 },
];

const popularItems = [
  { name: 'Herb-Crusted Salmon', orders: 342, revenue: 9914.58, trend: '+12%' },
  { name: 'Family Pasta Night', orders: 198, revenue: 13066.02, trend: '+8%' },
  { name: 'Sunday Roast Chicken', orders: 176, revenue: 10382.24, trend: '+5%' },
  { name: 'Wagyu Beef Tenderloin', orders: 124, revenue: 6818.76, trend: '+15%' },
  { name: 'Mediterranean Grain Bowl', orders: 256, revenue: 4861.44, trend: '+3%' },
];

const customerMetrics = [
  { label: 'Total Customers', value: '842', change: '+34 this month' },
  { label: 'Retention Rate', value: '73.2%', change: '+2.1% from last month' },
  { label: 'Avg. Order Value', value: '$71.68', change: '+$4.20 from last month' },
  { label: 'Repeat Order Rate', value: '64.5%', change: '+5.3% from last month' },
];

export default function AnalyticsPage() {
  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Analytics</h1>
        <p className="text-sm text-[#9B9490] mt-1">Revenue trends, customer insights, and popular items</p>
      </div>

      {/* Customer Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {customerMetrics.map(metric => (
          <div key={metric.label} className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E0D8]">
            <p className="text-sm text-[#9B9490] font-medium">{metric.label}</p>
            <p className="text-2xl font-bold text-[#1A1A1A] mt-2">{metric.value}</p>
            <p className="text-xs text-emerald-600 mt-2 font-medium">{metric.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl border border-[#E8E0D8] shadow-sm p-6">
          <h2 className="text-base font-semibold text-[#1A1A1A] mb-6">Revenue Trend</h2>
          <div className="flex items-end gap-4 h-48">
            {revenueData.map(d => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <p className="text-xs font-medium text-[#1A1A1A]">${(d.revenue / 1000).toFixed(1)}k</p>
                <div
                  className="w-full rounded-lg bg-gradient-to-t from-[#C4956A] to-[#D4A97A] transition-all"
                  style={{ height: `${(d.revenue / maxRevenue) * 160}px` }}
                />
                <p className="text-xs text-[#9B9490] font-medium">{d.month}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Items */}
        <div className="bg-white rounded-2xl border border-[#E8E0D8] shadow-sm">
          <div className="px-6 py-4 border-b border-[#E8E0D8]">
            <h2 className="text-base font-semibold text-[#1A1A1A]">Popular Items</h2>
          </div>
          <div className="divide-y divide-[#F0EAE3]">
            {popularItems.map((item, i) => (
              <div key={item.name} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-[#C4956A] w-6">#{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">{item.name}</p>
                    <p className="text-xs text-[#9B9490]">{item.orders} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#1A1A1A]">${item.revenue.toLocaleString()}</p>
                  <p className="text-xs text-emerald-600 font-medium">{item.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
