'use client';

import { useState } from 'react';

const mockConversations = [
  { id: '1', name: 'Alexandra Chen', lastMessage: 'Can I get the salmon gluten-free?', time: '2 min ago', unread: true },
  { id: '2', name: 'Michael Torres', lastMessage: 'Interested in catering for 50 guests', time: '10 min ago', unread: true },
  { id: '3', name: 'Lisa Wang', lastMessage: 'Thanks for the recommendation!', time: '1 hour ago', unread: false },
  { id: '4', name: 'David Park', lastMessage: 'When does my delivery arrive?', time: '2 hours ago', unread: false },
];

const mockMessages = [
  { id: '1', text: 'Hi! I have a question about the Herb-Crusted Salmon.', sender: 'user', time: '10:30 AM' },
  { id: '2', text: 'Can I get it without the herb crust? I want it plain with the asparagus.', sender: 'user', time: '10:31 AM' },
  { id: '3', text: 'Of course! We can customize the salmon to your preference. Would you like the lemon butter sauce on the side as well?', sender: 'admin', time: '10:33 AM' },
  { id: '4', text: 'Yes please! And can I add an extra portion of asparagus?', sender: 'user', time: '10:35 AM' },
];

export default function MessagesPage() {
  const [selectedConvo, setSelectedConvo] = useState('1');
  const [replyText, setReplyText] = useState('');
  const [aiAutoMode, setAiAutoMode] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('Absolutely! Extra asparagus is no problem. I\'ll add that to your order. The total will be $31.99 with the extra portion. Shall I confirm?');

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Messaging Hub</h1>
          <p className="text-sm text-[#9B9490] mt-1">{mockConversations.filter(c => c.unread).length} unread conversations</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#6B6560]">AI Auto-Response</span>
          <button
            onClick={() => setAiAutoMode(!aiAutoMode)}
            className={`relative w-12 h-6 rounded-full transition-colors ${aiAutoMode ? 'bg-[#C4956A]' : 'bg-[#E8E0D8]'}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${aiAutoMode ? 'left-6.5 translate-x-0' : 'left-0.5'}`}
              style={{ left: aiAutoMode ? '26px' : '2px' }}
            />
          </button>
        </div>
      </div>

      <div className="flex gap-4 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <div className="w-80 bg-white rounded-2xl border border-[#E8E0D8] shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#E8E0D8]">
            <input
              placeholder="Search conversations..."
              className="w-full border border-[#E8E0D8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C4956A]"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {mockConversations.map(convo => (
              <button
                key={convo.id}
                onClick={() => setSelectedConvo(convo.id)}
                className={`w-full text-left px-4 py-3.5 border-b border-[#F0EAE3] transition-colors ${
                  selectedConvo === convo.id ? 'bg-[#FDF8F3]' : 'hover:bg-[#FDF8F3]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#1A1A1A]">{convo.name}</p>
                  <p className="text-xs text-[#9B9490]">{convo.time}</p>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-[#9B9490] truncate max-w-[200px]">{convo.lastMessage}</p>
                  {convo.unread && <div className="w-2 h-2 rounded-full bg-[#C4956A]" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white rounded-2xl border border-[#E8E0D8] shadow-sm flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-[#E8E0D8] flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#1A1A1A]">Alexandra Chen</p>
              <p className="text-xs text-[#9B9490]">Silver Member · 24 orders</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {mockMessages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                  msg.sender === 'admin'
                    ? 'bg-[#1A1A1A] text-white rounded-br-sm'
                    : 'bg-[#F5EDE3] text-[#1A1A1A] rounded-bl-sm'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'admin' ? 'text-gray-400' : 'text-[#9B9490]'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* AI Suggestion */}
          {aiSuggestion && (
            <div className="px-6 py-3 bg-[#C4956A]/5 border-t border-[#C4956A]/20">
              <div className="flex items-start gap-3">
                <span className="text-sm">🤖</span>
                <div className="flex-1">
                  <p className="text-xs font-medium text-[#C4956A] mb-1">AI Suggestion</p>
                  <p className="text-sm text-[#6B6560]">{aiSuggestion}</p>
                </div>
                <button
                  onClick={() => { setReplyText(aiSuggestion); setAiSuggestion(''); }}
                  className="text-xs px-3 py-1.5 bg-[#C4956A] text-white rounded-lg font-medium hover:bg-[#A67B52]"
                >
                  Use
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-6 py-4 border-t border-[#E8E0D8]">
            <div className="flex gap-3">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                className="flex-1 border border-[#E8E0D8] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#C4956A]"
              />
              <button className="px-5 py-2.5 bg-[#C4956A] text-white rounded-lg text-sm font-medium hover:bg-[#A67B52]">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
