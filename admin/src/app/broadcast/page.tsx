'use client';

import { useState } from 'react';

export default function BroadcastPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [segment, setSegment] = useState('all');
  const [sent, setSent] = useState(false);

  const pastBroadcasts = [
    { title: 'Weekend Special: 20% off Family Meals', segment: 'All Users', sent: 'Mar 17, 2026', recipients: 842 },
    { title: 'New Menu Item: Wagyu Beef Added!', segment: 'Gold & VIP', sent: 'Mar 14, 2026', recipients: 156 },
    { title: 'Your Weekly Meal Prep is Ready', segment: 'Subscribers', sent: 'Mar 12, 2026', recipients: 234 },
    { title: 'Earn Double Points This Week', segment: 'All Users', sent: 'Mar 10, 2026', recipients: 842 },
  ];

  const handleSend = () => {
    if (title && body) {
      setSent(true);
      setTimeout(() => { setSent(false); setTitle(''); setBody(''); }, 3000);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Broadcast Notifications</h1>
        <p className="text-sm text-[#9B9490] mt-1">Send push notifications to users</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compose */}
        <div className="bg-white rounded-2xl border border-[#E8E0D8] shadow-sm p-6">
          <h2 className="text-base font-semibold text-[#1A1A1A] mb-4">Compose Notification</h2>

          {sent && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium">
              ✅ Notification sent successfully!
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#6B6560] mb-1.5 block">Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Notification title" className="w-full border border-[#E8E0D8] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#C4956A]" />
            </div>
            <div>
              <label className="text-sm font-medium text-[#6B6560] mb-1.5 block">Message</label>
              <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Notification body" rows={3} className="w-full border border-[#E8E0D8] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#C4956A]" />
            </div>
            <div>
              <label className="text-sm font-medium text-[#6B6560] mb-1.5 block">Target Segment</label>
              <select value={segment} onChange={e => setSegment(e.target.value)} className="w-full border border-[#E8E0D8] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#C4956A]">
                <option value="all">All Users (842)</option>
                <option value="bronze">Bronze Members (456)</option>
                <option value="silver">Silver Members (230)</option>
                <option value="gold">Gold Members (112)</option>
                <option value="vip">VIP Members (44)</option>
                <option value="subscribers">Active Subscribers (234)</option>
              </select>
            </div>
            <button onClick={handleSend} className="w-full py-2.5 bg-[#C4956A] text-white rounded-lg text-sm font-medium hover:bg-[#A67B52]">
              Send Notification
            </button>
          </div>
        </div>

        {/* History */}
        <div className="bg-white rounded-2xl border border-[#E8E0D8] shadow-sm">
          <div className="px-6 py-4 border-b border-[#E8E0D8]">
            <h2 className="text-base font-semibold text-[#1A1A1A]">Recent Broadcasts</h2>
          </div>
          <div className="divide-y divide-[#F0EAE3]">
            {pastBroadcasts.map((b, i) => (
              <div key={i} className="px-6 py-4">
                <p className="text-sm font-medium text-[#1A1A1A]">{b.title}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs text-[#9B9490]">{b.sent}</span>
                  <span className="text-xs text-[#9B9490]">·</span>
                  <span className="text-xs text-[#9B9490]">{b.segment}</span>
                  <span className="text-xs text-[#9B9490]">·</span>
                  <span className="text-xs text-[#9B9490]">{b.recipients} recipients</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
