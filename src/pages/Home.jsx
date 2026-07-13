import React, { useState } from 'react';
import { Search, Flame, ChevronRight, Zap } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import FoodCard from '../components/FoodCard';
import FoodDetailDrawer from '../components/FoodDetailDrawer';

const S = '#92000A';

/* Time-based greeting */
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export default function Home() {
  const { menu, loadingMenu, setCurrentPage } = useOrder();
  const [selectedItem, setSelectedItem]     = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Rice', 'Burgers', 'Drinks', 'Desserts'];
  const featured   = menu.find((i) => i.id === 'b1') || menu[0];

  const filteredMenu = activeCategory === 'All'
    ? menu.slice(0, 8)
    : menu.filter((i) => i.category.toLowerCase() === activeCategory.toLowerCase()).slice(0, 8);

  const goCategory = (name) => {
    localStorage.setItem('qr_preselected_category', name);
    setCurrentPage('menu');
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in pb-28 md:pb-10">
      <div className="px-4 pt-5 space-y-6">

        {/* ── Greeting ── */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold" style={{ color: '#888' }}>{getGreeting()} 👋</p>
            <h2 className="text-xl font-black text-white mt-0.5 leading-tight">
              What would you like<br />to <span style={{ color: S }}>order today?</span>
            </h2>
          </div>
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1"
               style={{ backgroundColor: '#1c1c1c', border: '1px solid rgba(255,255,255,0.07)' }}>
            <span className="text-lg">🍽️</span>
          </div>
        </div>

        {/* ── Search bar ── */}
        <div className="relative">
          <input type="text" onFocus={() => setCurrentPage('menu')} readOnly
            placeholder="Find Your Food…"
            className="w-full pl-11 pr-14 py-3.5 text-sm rounded-2xl font-medium cursor-text outline-none transition-all"
            style={{ backgroundColor: '#1c1c1c', color: '#ccc', border: '1px solid rgba(255,255,255,0.07)', caretColor: S }}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#555' }} />
          <button onClick={() => setCurrentPage('menu')}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer"
            style={{ backgroundColor: S }}>
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* ── Recommended For You (featured card — like the big banner in image) ── */}
        {featured && !loadingMenu && (
          <div>
            <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">⭐ Recommended For You</p>
            <div
              className="relative overflow-hidden rounded-3xl cursor-pointer active:scale-98 transition-all"
              style={{ backgroundColor: '#1c1c1c', border: '1px solid rgba(255,255,255,0.07)' }}
              onClick={() => setSelectedItem(featured)}
            >
              <div className="flex items-center gap-4 p-4">
                {/* Text left */}
                <div className="flex-grow space-y-1.5 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: S }}>Chef's Pick</span>
                  <h3 className="text-base font-extrabold text-white leading-tight">{featured.name}</h3>
                  <p className="text-xs line-clamp-2 font-medium" style={{ color: '#666' }}>{featured.description}</p>
                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-base font-black" style={{ color: S }}>${featured.price.toFixed(2)}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedItem(featured); }}
                      className="px-4 py-1.5 rounded-full text-white text-xs font-extrabold cursor-pointer transition-all hover:opacity-90"
                      style={{ backgroundColor: S }}>
                      Get it Now
                    </button>
                  </div>
                </div>
                {/* Image right */}
                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 relative">
                  <img src={featured.image} alt={featured.name} className="w-full h-full object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=60'; }} />
                </div>
              </div>
              {/* Subtle glow accent line at bottom */}
              <div className="h-0.5 w-full" style={{ background: `linear-gradient(to right, ${S}, transparent)` }} />
            </div>
          </div>
        )}

        {/* ── Category Pills ── */}
        <div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="flex-shrink-0 px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer"
                  style={active
                    ? { backgroundColor: S, color: '#fff', border: `1px solid ${S}` }
                    : { backgroundColor: '#1c1c1c', color: '#666', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Food Grid ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 fill-current" style={{ color: S }} />
              <span className="text-xs font-black text-white uppercase tracking-wide">
                {activeCategory === 'All' ? "Today's Picks" : activeCategory}
              </span>
            </div>
            <button onClick={() => goCategory(activeCategory === 'All' ? null : activeCategory)}
              className="text-xs font-bold cursor-pointer flex items-center gap-0.5" style={{ color: S }}>
              See All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loadingMenu ? (
            <div className="grid grid-cols-2 gap-3">
              {[1,2,3,4].map((n) => <div key={n} className="h-48 rounded-2xl animate-pulse" style={{ backgroundColor: '#1c1c1c' }} />)}
            </div>
          ) : filteredMenu.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredMenu.map((item) => <FoodCard key={item.id} item={item} onSelect={setSelectedItem} />)}
            </div>
          ) : (
            <div className="text-center py-12 text-sm" style={{ color: '#555' }}>No items in this category.</div>
          )}
        </div>

        {/* ── Full Menu CTA ── */}
        <button onClick={() => setCurrentPage('menu')}
          className="w-full py-4 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer glow-btn transition-all"
          style={{ backgroundColor: S }}>
          <Zap className="w-4 h-4 fill-current" />
          <span>Browse Full Menu</span>
          <ChevronRight className="w-4 h-4" />
        </button>

      </div>

      <FoodDetailDrawer item={selectedItem} isOpen={selectedItem !== null} onClose={() => setSelectedItem(null)} />
    </div>
  );
}
