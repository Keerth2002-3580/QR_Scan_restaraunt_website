import React from 'react';
import { Plus, Flame, ShoppingBag, Zap } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

export default function FoodCard({ item, onSelect }) {
  const { addToCart, setCurrentPage } = useOrder();
  const { name, price, description, isVeg, isNonVeg, isSpicy, isAvailable, image } = item;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(item, 1, { spiceLevel: isSpicy ? 'Regular' : 'Not Spicy', exclusions: [], extras: [] });
  };

  const handleQuickOrder = (e) => {
    e.stopPropagation();
    addToCart(item, 1, { spiceLevel: isSpicy ? 'Regular' : 'Not Spicy', exclusions: [], extras: [] });
    setCurrentPage('cart');
  };

  return (
    <div onClick={() => isAvailable && onSelect(item)}
      className={`flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-200 ${
        isAvailable ? 'cursor-pointer hover:scale-102 active:scale-97' : 'opacity-50 select-none'
      }`}
      style={{ backgroundColor: '#1c1c1c', border: '1px solid rgba(255,255,255,0.07)' }}>

      {/* Image */}
      <div className="relative w-full bg-[#111] overflow-hidden" style={{ aspectRatio: '1/1' }}>
        <img src={image} alt={name} className="w-full h-full object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=60'; }} />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
          {isVeg && (
            <div className="w-4 h-4 border-[1.5px] border-emerald-500 flex items-center justify-center bg-transparent rounded-[3px] shadow-sm" title="Veg">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            </div>
          )}
          {isNonVeg && (
            <div className="w-4 h-4 border-[1.5px] border-rose-500 flex items-center justify-center bg-transparent rounded-[3px] shadow-sm" title="Non-Veg">
              <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
            </div>
          )}
          {isSpicy && <span className="bg-orange-500/10 text-orange-500 border border-orange-500/30 text-[9px] font-extrabold px-2 py-0.5 rounded-md backdrop-blur-sm uppercase tracking-widest shadow-sm">SPICY</span>}
        </div>

        {!isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-xs">
            <span className="text-white font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full"
                  style={{ backgroundColor: '#92000A' }}>Sold Out</span>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-grow">
        <h4 className="font-bold text-xs text-white line-clamp-1 mb-0.5">{name}</h4>
        <p className="text-[10px] line-clamp-1 flex-grow mb-2" style={{ color: '#555' }}>{description}</p>
        
        <div className="flex flex-col gap-2 mt-auto">
          <span className="font-extrabold text-sm" style={{ color: '#92000A' }}>LKR {price.toFixed(2)}</span>
          {isAvailable && (
            <div className="flex items-center gap-1.5 w-full">
              <button onClick={handleQuickAdd} 
                      className="flex-1 py-1.5 text-[9px] font-bold text-white rounded-lg border transition-all active:scale-95 text-center flex items-center justify-center gap-1"
                      style={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.1)' }}>
                <Plus className="w-2.5 h-2.5" /> ADD
              </button>
              <button onClick={handleQuickOrder} 
                      className="flex-1 py-1.5 text-[9px] font-bold text-white rounded-lg transition-all active:scale-95 text-center flex items-center justify-center gap-1"
                      style={{ backgroundColor: '#92000A' }}>
                <Zap className="w-2.5 h-2.5" /> ORDER
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
