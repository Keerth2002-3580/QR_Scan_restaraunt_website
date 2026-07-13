import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import FoodCard from '../components/FoodCard';
import FoodDetailDrawer from '../components/FoodDetailDrawer';

const S = '#92000A'; const CARD = '#1c1c1c'; const BDR = 'rgba(255,255,255,0.07)';

export default function Menu() {
  const { menu, loadingMenu } = useOrder();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dietFilter, setDietFilter]   = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const categories = ['All', 'Rice', 'Drinks', 'Burgers', 'Desserts'];
  const dietaryFilters = [{ name:'All', icon:'🍽️' }, { name:'Veg', icon:'🌱' }, { name:'Non-Veg', icon:'🍗' }, { name:'Spicy', icon:'🌶️' }];

  const filteredMenu = menu.filter((item) => {
    const cat  = selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const diet = dietFilter === 'All' || (dietFilter === 'Veg' && item.isVeg) || (dietFilter === 'Non-Veg' && item.isNonVeg) || (dietFilter === 'Spicy' && item.isSpicy);
    const srch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return cat && diet && srch;
  });

  const PillBtn = ({ label, active, onClick, icon }) => (
    <button onClick={onClick}
      className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border"
      style={active ? { backgroundColor: S, color: '#fff', borderColor: S } : { backgroundColor: CARD, color: '#666', borderColor: BDR }}>
      {icon && <span>{icon}</span>}{label}
    </button>
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pt-5 pb-28 md:pb-10 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-black text-white">Our Menu</h2>
          <p className="text-xs mt-0.5 font-medium" style={{ color: '#555' }}>Select & customise your meal</p>
        </div>
        <div className="p-2 rounded-xl" style={{ backgroundColor: CARD, border: `1px solid ${BDR}` }}>
          <Sparkles className="w-5 h-5 animate-pulse-slow" style={{ color: S }} />
        </div>
      </div>

      <div className="md:flex md:gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex flex-col gap-1.5 w-44 shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1 pl-1" style={{ color: '#555' }}>Categories</p>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className="w-full text-left px-4 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer border"
              style={selectedCategory === cat ? { backgroundColor: S, color: '#fff', borderColor: S } : { backgroundColor: CARD, color: '#666', borderColor: BDR }}>
              {cat}
            </button>
          ))}
          <p className="text-[10px] font-bold uppercase tracking-wider mt-4 mb-1 pl-1" style={{ color: '#555' }}>Dietary</p>
          {dietaryFilters.map((df) => (
            <button key={df.name} onClick={() => setDietFilter(df.name)}
              className="w-full text-left flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer"
              style={dietFilter === df.name ? { color: S } : { color: '#555' }}>
              <span>{df.icon}</span>{df.name}
            </button>
          ))}
        </aside>

        <div className="flex-grow min-w-0">
          {/* Search */}
          <div className="relative mb-4">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items…"
              className="w-full pl-11 pr-4 py-3 text-sm rounded-2xl font-medium outline-none transition-all"
              style={{ backgroundColor: CARD, color: '#ccc', border: `1px solid ${BDR}` }} />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#555' }} />
          </div>

          {/* Mobile category chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-2 md:hidden">
            {categories.map((cat) => <PillBtn key={cat} label={cat} active={selectedCategory === cat} onClick={() => setSelectedCategory(cat)} />)}
          </div>
          {/* Mobile dietary chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-4 md:hidden">
            {dietaryFilters.map((df) => <PillBtn key={df.name} label={df.name} icon={df.icon} active={dietFilter === df.name} onClick={() => setDietFilter(df.name)} />)}
          </div>

          {/* Grid */}
          {loadingMenu ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[1,2,3,4,5,6].map((n) => <div key={n} className="h-52 rounded-2xl animate-pulse" style={{ backgroundColor: CARD }} />)}
            </div>
          ) : filteredMenu.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredMenu.map((item) => <FoodCard key={item.id} item={item} onSelect={setSelectedItem} />)}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-bold text-sm text-white">No items found</p>
              <p className="text-xs mt-1" style={{ color: '#555' }}>Try different filters.</p>
            </div>
          )}
        </div>
      </div>
      <FoodDetailDrawer item={selectedItem} isOpen={selectedItem !== null} onClose={() => setSelectedItem(null)} />
    </div>
  );
}
