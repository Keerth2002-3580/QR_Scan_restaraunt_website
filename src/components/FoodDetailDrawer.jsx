import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingBag, Flame } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

const S = '#92000A';
const CARD = '#1c1c1c';
const BDR  = 'rgba(255,255,255,0.07)';

export default function FoodDetailDrawer({ item, isOpen, onClose }) {
  const { addToCart } = useOrder();
  const [quantity,   setQuantity]   = useState(1);
  const [spiceLevel, setSpiceLevel] = useState('Regular');
  const [exclusions, setExclusions] = useState([]);
  const [extras,     setExtras]     = useState([]);

  useEffect(() => {
    if (item) { setQuantity(1); setSpiceLevel(item.isSpicy ? 'Regular' : 'Not Spicy'); setExclusions([]); setExtras([]); }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const toggleExclusion = (opt) => setExclusions((p) => p.includes(opt) ? p.filter((x) => x !== opt) : [...p, opt]);
  const toggleExtra     = (opt) => setExtras((p) => p.some((e) => e.name === opt.name) ? p.filter((e) => e.name !== opt.name) : [...p, opt]);

  const spiceOptions  = ['Less Spicy', 'Regular', 'Extra Spicy'];
  const exclusionOpts = ['No Onion', 'No Tomato', 'No Mayo', 'No Pickle'];
  const extraOpts     = [{ name: 'Extra Cheese', price: 1.00 }, { name: 'Double Patty', price: 2.50 }, { name: 'Special Sauce', price: 0.50 }];
  const extrasCost    = extras.reduce((a, c) => a + c.price, 0);
  const grandTotal    = (item.price + extrasCost) * quantity;

  const handleAdd = () => { addToCart(item, quantity, { spiceLevel, exclusions, extras }); onClose(); };

  const OptionBtn = ({ label, active, onClick, color = S }) => (
    <button onClick={onClick}
      className="py-2.5 text-xs font-bold rounded-2xl transition-all cursor-pointer border"
      style={active ? { backgroundColor: color, color: '#fff', borderColor: color } : { backgroundColor: '#111', color: '#666', borderColor: BDR }}>
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in md:items-center md:p-6"
         style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
      <div className="relative w-full z-10 animate-slide-up flex flex-col overflow-hidden"
           style={{
             backgroundColor: '#181818',
             border: `1px solid ${BDR}`,
             borderRadius: '28px 28px 0 0',
             maxHeight: '92vh',
             // desktop override
           }}>

        {/* Hero image */}
        <div className="relative w-full flex-shrink-0" style={{ aspectRatio: '16/7' }}>
          <img src={item.image} alt={item.name} className="w-full h-full object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=70'; }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 50%, #181818 100%)' }} />
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', border: `1px solid ${BDR}` }}>
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto no-scrollbar flex-grow pb-28 px-5 pt-3 space-y-5">
          {/* Name + Price */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex gap-1.5 mb-1.5">
                {item.isVeg    && <span className="text-[10px] font-extrabold text-emerald-500 border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 rounded-md uppercase tracking-widest">VEG</span>}
                {item.isNonVeg && <span className="text-[10px] font-extrabold text-rose-500 border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 rounded-md uppercase tracking-widest">NON-VEG</span>}
                {item.isSpicy  && <span className="text-[10px] font-extrabold text-orange-500 border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 rounded-md uppercase tracking-widest">SPICY</span>}
              </div>
              <h2 className="text-xl font-black text-white">{item.name}</h2>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: '#666' }}>{item.description}</p>
            </div>
            <span className="text-xl font-black flex-shrink-0" style={{ color: S }}>LKR {item.price.toFixed(2)}</span>
          </div>

          {/* Spice Level */}
          {item.isSpicy && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1" style={{ color: '#666' }}>
                <Flame className="w-3 h-3 fill-current" style={{ color: S }} /> Spice Level
              </p>
              <div className="grid grid-cols-3 gap-2">
                {spiceOptions.map((opt) => <OptionBtn key={opt} label={opt} active={spiceLevel === opt} onClick={() => setSpiceLevel(opt)} />)}
              </div>
            </div>
          )}

          {/* Exclusions */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#666' }}>Exclude</p>
            <div className="grid grid-cols-2 gap-2">
              {exclusionOpts.map((opt) => <OptionBtn key={opt} label={opt} active={exclusions.includes(opt)} onClick={() => toggleExclusion(opt)} color="#c0392b" />)}
            </div>
          </div>

          {/* Extras */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#666' }}>Add Extras</p>
            <div className="space-y-2">
              {extraOpts.map((opt) => {
                const chk = extras.some((e) => e.name === opt.name);
                return (
                  <button key={opt.name} onClick={() => toggleExtra(opt)}
                    className="flex items-center justify-between p-3.5 rounded-2xl w-full cursor-pointer border transition-all"
                    style={chk ? { backgroundColor: 'rgba(16,185,129,0.1)', borderColor: '#10b981', color: '#10b981' } : { backgroundColor: '#111', borderColor: BDR, color: '#666' }}>
                    <span className="text-xs font-bold">{opt.name}</span>
                    <span className="text-xs font-extrabold">+ LKR {opt.price.toFixed(2)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-3 border-t"
             style={{ backgroundColor: '#181818', borderColor: BDR }}>
          <div className="flex items-center rounded-2xl p-1 border" style={{ backgroundColor: '#111', borderColor: BDR }}>
            <button onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer text-white hover:bg-white/5">
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-7 text-center text-sm font-black text-white">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer text-white hover:bg-white/5">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <button onClick={handleAdd}
            className="flex-grow flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-extrabold text-sm cursor-pointer glow-btn transition-all"
            style={{ backgroundColor: S }}>
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Cart · LKR {grandTotal.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
