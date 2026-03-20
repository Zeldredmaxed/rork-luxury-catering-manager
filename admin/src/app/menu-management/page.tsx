'use client';

import { useState } from 'react';

const initialMenuItems = [
  { id: '1', name: 'Herb-Crusted Salmon', category: 'Meal Prep', price: 28.99, available: true, featured: true, popular: true },
  { id: '2', name: 'Truffle Mushroom Risotto', category: 'Meal Prep', price: 24.99, available: true, featured: true, popular: false },
  { id: '3', name: 'Wagyu Beef Tenderloin', category: 'Meal Prep', price: 54.99, available: true, featured: false, popular: true },
  { id: '4', name: 'Mediterranean Grain Bowl', category: 'Meal Prep', price: 18.99, available: true, featured: false, popular: false },
  { id: '5', name: 'Family Pasta Night', category: 'Family Meals', price: 65.99, available: true, featured: true, popular: false },
  { id: '6', name: 'Sunday Roast Chicken', category: 'Family Meals', price: 58.99, available: true, featured: false, popular: true },
  { id: '7', name: 'Thai Coconut Curry Feast', category: 'Family Meals', price: 52.99, available: true, featured: false, popular: false },
  { id: '8', name: 'Family BBQ Platter', category: 'Family Meals', price: 79.99, available: true, featured: false, popular: false },
  { id: '9', name: 'Elegant Cocktail Reception', category: 'Catering', price: 899.99, available: true, featured: true, popular: false },
  { id: '10', name: 'Executive Lunch Package', category: 'Catering', price: 34.99, available: true, featured: false, popular: false },
  { id: '11', name: 'Wedding Dinner Service', category: 'Catering', price: 1499.99, available: true, featured: false, popular: false },
  { id: '12', name: 'Grilled Chicken Caesar', category: 'Meal Prep', price: 16.99, available: true, featured: false, popular: false },
];

export default function MenuManagement() {
  const [items, setItems] = useState(initialMenuItems);
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['All', 'Meal Prep', 'Family Meals', 'Catering'];
  const filtered = filterCategory === 'All' ? items : items.filter(i => i.category === filterCategory);

  const toggleAvailability = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, available: !i.available } : i));
  };

  const toggleFeatured = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, featured: !i.featured } : i));
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Menu Management</h1>
          <p className="text-sm text-[#9B9490] mt-1">{items.length} items · {items.filter(i => i.available).length} available</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 bg-[#C4956A] text-white rounded-lg font-medium text-sm hover:bg-[#A67B52] transition-colors"
        >
          + Add Item
        </button>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 mb-6">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setFilterCategory(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filterCategory === c ? 'bg-[#1A1A1A] text-white' : 'bg-white text-[#6B6560] border border-[#E8E0D8] hover:border-[#C4956A]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Add Item Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 mb-6 border border-[#E8E0D8] shadow-sm">
          <h3 className="text-base font-semibold text-[#1A1A1A] mb-4">New Menu Item</h3>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Item Name" className="border border-[#E8E0D8] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#C4956A]" />
            <select className="border border-[#E8E0D8] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#C4956A]">
              <option>Meal Prep</option>
              <option>Family Meals</option>
              <option>Catering</option>
            </select>
            <input placeholder="Price" type="number" step="0.01" className="border border-[#E8E0D8] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#C4956A]" />
            <input placeholder="Image URL" className="border border-[#E8E0D8] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#C4956A]" />
            <textarea placeholder="Description" className="col-span-2 border border-[#E8E0D8] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#C4956A]" rows={2} />
          </div>
          <div className="flex gap-3 mt-4">
            <button className="px-5 py-2 bg-[#C4956A] text-white rounded-lg text-sm font-medium hover:bg-[#A67B52]">Save Item</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 bg-[#F5EDE3] text-[#6B6560] rounded-lg text-sm font-medium hover:bg-[#E8E0D8]">Cancel</button>
          </div>
        </div>
      )}

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(item => (
          <div key={item.id} className={`bg-white rounded-xl p-5 border border-[#E8E0D8] shadow-sm flex items-center justify-between ${!item.available ? 'opacity-50' : ''}`}>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-[#1A1A1A]">{item.name}</h3>
                {item.featured && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#C4956A]/10 text-[#C4956A]">Featured</span>}
                {item.popular && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">Popular</span>}
              </div>
              <p className="text-xs text-[#9B9490] mt-1">{item.category} · ${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFeatured(item.id)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium ${item.featured ? 'bg-[#C4956A] text-white' : 'bg-[#F5EDE3] text-[#9B9490]'}`}
              >
                ★
              </button>
              <button
                onClick={() => toggleAvailability(item.id)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium ${item.available ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}
              >
                {item.available ? 'Available' : 'Unavailable'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
