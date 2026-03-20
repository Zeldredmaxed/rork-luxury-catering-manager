'use client';

import { useState } from 'react';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const currentMonth = 'March 2026';

// Generate calendar grid for March 2026
const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
const firstDayOffset = 0; // March 1, 2026 is a Sunday

const events: Record<number, { title: string; type: string; time: string }[]> = {
  5: [{ title: 'Wedding Reception', type: 'catering', time: '6:00 PM' }],
  12: [{ title: 'Corporate Lunch x25', type: 'catering', time: '12:00 PM' }],
  15: [{ title: 'Birthday Party', type: 'catering', time: '7:00 PM' }],
  19: [{ title: 'Meal Prep Delivery', type: 'delivery', time: '5:00 PM' }, { title: 'Family Dinner x4', type: 'delivery', time: '6:30 PM' }],
  22: [{ title: 'Blocked - Kitchen Maintenance', type: 'blocked', time: 'All Day' }],
  25: [{ title: 'Cocktail Reception x50', type: 'catering', time: '6:00 PM' }],
  28: [{ title: 'Weekly Subs Delivery', type: 'subscription', time: '10:00 AM' }],
};

const typeColors: Record<string, string> = {
  catering: 'bg-purple-100 text-purple-700 border-purple-200',
  delivery: 'bg-blue-100 text-blue-700 border-blue-200',
  blocked: 'bg-red-100 text-red-700 border-red-200',
  subscription: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export default function CalendarPage() {
  const [selectedDay, setSelectedDay] = useState<number | null>(19);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Calendar</h1>
          <p className="text-sm text-[#9B9490] mt-1">Manage bookings and availability</p>
        </div>
        <button className="px-5 py-2.5 bg-[#C4956A] text-white rounded-lg font-medium text-sm hover:bg-[#A67B52]">
          + Block Date
        </button>
      </div>

      <div className="flex gap-6">
        {/* Calendar Grid */}
        <div className="flex-1 bg-white rounded-2xl border border-[#E8E0D8] shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <button className="text-sm text-[#9B9490] hover:text-[#1A1A1A]">← Previous</button>
            <h2 className="text-lg font-semibold text-[#1A1A1A]">{currentMonth}</h2>
            <button className="text-sm text-[#9B9490] hover:text-[#1A1A1A]">Next →</button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {daysOfWeek.map(day => (
              <div key={day} className="text-center text-xs font-semibold text-[#9B9490] py-2 uppercase">
                {day}
              </div>
            ))}
            {Array.from({ length: firstDayOffset }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {calendarDays.map(day => {
              const dayEvents = events[day] || [];
              const isToday = day === 19;
              const isSelected = day === selectedDay;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`relative p-2 min-h-[80px] rounded-lg text-left transition-all ${
                    isSelected ? 'bg-[#C4956A]/10 ring-2 ring-[#C4956A]' :
                    isToday ? 'bg-[#FDF8F3]' : 'hover:bg-[#FDF8F3]'
                  }`}
                >
                  <span className={`text-sm font-medium ${isToday ? 'text-[#C4956A]' : 'text-[#1A1A1A]'}`}>{day}</span>
                  <div className="mt-1 space-y-0.5">
                    {dayEvents.slice(0, 2).map((ev, i) => (
                      <div key={i} className={`text-[9px] font-medium px-1 py-0.5 rounded truncate border ${typeColors[ev.type]}`}>
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <p className="text-[9px] text-[#9B9490]">+{dayEvents.length - 2} more</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Day Detail Panel */}
        <div className="w-80">
          <div className="bg-white rounded-2xl border border-[#E8E0D8] shadow-sm p-6">
            <h3 className="text-base font-semibold text-[#1A1A1A] mb-4">
              {selectedDay ? `March ${selectedDay}, 2026` : 'Select a day'}
            </h3>
            {selectedDay && events[selectedDay] ? (
              <div className="space-y-3">
                {events[selectedDay].map((ev, i) => (
                  <div key={i} className={`p-3 rounded-lg border ${typeColors[ev.type]}`}>
                    <p className="text-sm font-medium">{ev.title}</p>
                    <p className="text-xs mt-1 opacity-75">{ev.time}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#9B9490]">No events scheduled</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
