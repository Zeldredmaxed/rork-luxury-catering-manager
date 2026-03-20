'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [aiTone, setAiTone] = useState('professional');
  const [aiAutoMode, setAiAutoMode] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState(
    `Exquisite Meals is a luxury gourmet catering service. We offer meal prep, family meals, and full-service catering.\n\nDelivery: Free for Gold/VIP members. $5.99 standard.\nCancellation: Up to 2 hours before scheduled time.\nCatering: 72 hours advance notice, 50% deposit required.\nHours: Mon-Sat 8AM-9PM, Sun 10AM-6PM.`
  );

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Settings</h1>
        <p className="text-sm text-[#9B9490] mt-1">Configure AI behavior and system preferences</p>
      </div>

      {/* AI Settings */}
      <div className="bg-white rounded-2xl border border-[#E8E0D8] shadow-sm p-6 mb-6">
        <h2 className="text-base font-semibold text-[#1A1A1A] mb-4">AI Assistant Configuration</h2>

        <div className="space-y-5">
          {/* Auto-response toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#1A1A1A]">AI Auto-Response Mode</p>
              <p className="text-xs text-[#9B9490] mt-0.5">When enabled, AI automatically responds to customer messages</p>
            </div>
            <button
              onClick={() => setAiAutoMode(!aiAutoMode)}
              className={`relative w-12 h-6 rounded-full transition-colors ${aiAutoMode ? 'bg-[#C4956A]' : 'bg-[#E8E0D8]'}`}
            >
              <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform"
                style={{ left: aiAutoMode ? '26px' : '2px' }}
              />
            </button>
          </div>

          {/* Tone */}
          <div>
            <label className="text-sm font-medium text-[#1A1A1A] block mb-2">Tone of Voice</label>
            <div className="flex gap-3">
              {['professional', 'friendly', 'luxury'].map(tone => (
                <button
                  key={tone}
                  onClick={() => setAiTone(tone)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    aiTone === tone ? 'bg-[#1A1A1A] text-white' : 'bg-[#F5EDE3] text-[#6B6560] hover:bg-[#E8E0D8]'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          {/* Knowledge Base */}
          <div>
            <label className="text-sm font-medium text-[#1A1A1A] block mb-2">Knowledge Base</label>
            <p className="text-xs text-[#9B9490] mb-2">This information is used to train the AI assistant responses</p>
            <textarea
              value={knowledgeBase}
              onChange={e => setKnowledgeBase(e.target.value)}
              rows={8}
              className="w-full border border-[#E8E0D8] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C4956A] font-mono"
            />
          </div>
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-2xl border border-[#E8E0D8] shadow-sm p-6 mb-6">
        <h2 className="text-base font-semibold text-[#1A1A1A] mb-4">Business Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#6B6560] block mb-1.5">Business Name</label>
            <input defaultValue="Exquisite Meals" className="w-full border border-[#E8E0D8] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#C4956A]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[#6B6560] block mb-1.5">Delivery Fee</label>
              <input defaultValue="5.99" type="number" step="0.01" className="w-full border border-[#E8E0D8] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#C4956A]" />
            </div>
            <div>
              <label className="text-sm font-medium text-[#6B6560] block mb-1.5">Tax Rate (%)</label>
              <input defaultValue="8" type="number" step="0.1" className="w-full border border-[#E8E0D8] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#C4956A]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[#6B6560] block mb-1.5">Points per $ spent</label>
              <input defaultValue="10" type="number" className="w-full border border-[#E8E0D8] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#C4956A]" />
            </div>
            <div>
              <label className="text-sm font-medium text-[#6B6560] block mb-1.5">Catering Deposit (%)</label>
              <input defaultValue="50" type="number" className="w-full border border-[#E8E0D8] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#C4956A]" />
            </div>
          </div>
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-white rounded-2xl border border-[#E8E0D8] shadow-sm p-6">
        <h2 className="text-base font-semibold text-[#1A1A1A] mb-4">API Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#6B6560] block mb-1.5">Stripe Secret Key</label>
            <input type="password" placeholder="sk_test_..." className="w-full border border-[#E8E0D8] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#C4956A]" />
          </div>
          <div>
            <label className="text-sm font-medium text-[#6B6560] block mb-1.5">OpenAI API Key</label>
            <input type="password" placeholder="sk-..." className="w-full border border-[#E8E0D8] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#C4956A]" />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button className="px-6 py-2.5 bg-[#C4956A] text-white rounded-lg text-sm font-medium hover:bg-[#A67B52]">
          Save Settings
        </button>
      </div>
    </div>
  );
}
