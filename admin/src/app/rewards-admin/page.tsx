'use client';

import { useState } from 'react';

const tiers = [
  { name: 'Bronze', minPoints: 0, members: 456, color: '#CD7F32', perks: ['1x points on all orders', 'Birthday reward'] },
  { name: 'Silver', minPoints: 1000, members: 230, color: '#AAA9AD', perks: ['1.5x points', 'Free delivery', 'Priority support'] },
  { name: 'Gold', minPoints: 3000, members: 112, color: '#D4AF37', perks: ['2x points', 'Free delivery', 'Early menu access', 'Quarterly gift'] },
  { name: 'VIP', minPoints: 7500, members: 44, color: '#C4956A', perks: ['3x points', 'Free delivery', 'Personal concierge', 'Exclusive events', 'Custom menu requests'] },
];

const rewards = [
  { id: '1', name: 'Free Appetizer', points: 500, active: true, redeemed: 234 },
  { id: '2', name: '$10 Off Next Order', points: 1000, active: true, redeemed: 167 },
  { id: '3', name: 'Free Family Meal Upgrade', points: 2000, active: true, redeemed: 89 },
  { id: '4', name: 'Private Chef Experience', points: 5000, active: true, redeemed: 12 },
];

export default function RewardsAdminPage() {
  const [rewardsList, setRewardsList] = useState(rewards);
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Rewards Management</h1>
        <p className="text-sm text-[#9B9490] mt-1">Configure loyalty tiers and rewards</p>
      </div>

      {/* Tier Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {tiers.map(tier => (
          <div key={tier.name} className="bg-white rounded-2xl p-5 border border-[#E8E0D8] shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: tier.color + '20' }}>
                <span className="text-lg">✨</span>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: tier.color }}>{tier.name}</p>
                <p className="text-xs text-[#9B9490]">{tier.minPoints.toLocaleString()}+ pts</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-[#1A1A1A]">{tier.members}</p>
            <p className="text-xs text-[#9B9490] mt-1">active members</p>
            <div className="mt-3 space-y-1">
              {tier.perks.slice(0, 3).map((perk, i) => (
                <p key={i} className="text-xs text-[#6B6560]">✓ {perk}</p>
              ))}
              {tier.perks.length > 3 && <p className="text-xs text-[#9B9490]">+{tier.perks.length - 3} more</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Rewards Catalog */}
      <div className="bg-white rounded-2xl border border-[#E8E0D8] shadow-sm">
        <div className="px-6 py-4 border-b border-[#E8E0D8] flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#1A1A1A]">Rewards Catalog</h2>
          <button onClick={() => setShowForm(!showForm)} className="text-sm font-medium text-[#C4956A] hover:underline">
            + Add Reward
          </button>
        </div>

        {showForm && (
          <div className="px-6 py-4 border-b border-[#E8E0D8] bg-[#FDF8F3]">
            <div className="grid grid-cols-3 gap-4">
              <input placeholder="Reward name" className="border border-[#E8E0D8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C4956A]" />
              <input placeholder="Description" className="border border-[#E8E0D8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C4956A]" />
              <div className="flex gap-2">
                <input placeholder="Points cost" type="number" className="flex-1 border border-[#E8E0D8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C4956A]" />
                <button className="px-4 py-2 bg-[#C4956A] text-white rounded-lg text-sm font-medium">Add</button>
              </div>
            </div>
          </div>
        )}

        <div className="divide-y divide-[#F0EAE3]">
          {rewardsList.map(reward => (
            <div key={reward.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#1A1A1A]">{reward.name}</p>
                <p className="text-xs text-[#9B9490] mt-0.5">{reward.points.toLocaleString()} pts · {reward.redeemed} redeemed</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${reward.active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                  {reward.active ? 'Active' : 'Inactive'}
                </span>
                <button className="text-xs text-[#9B9490] hover:text-[#1A1A1A]">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
