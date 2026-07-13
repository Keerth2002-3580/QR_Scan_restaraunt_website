import React from 'react';
import { Plus, Flame } from 'lucide-react';

export default function FoodCard({ item, onSelect }) {
  const { name, price, description, isVeg, isNonVeg, isSpicy, isAvailable, image } = item;

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
          {isVeg && <span className="bg-black/60 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full backdrop-blur-sm">🌱</span>}
          {isNonVeg && <span className="bg-black/60 text-rose-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full backdrop-blur-sm">🍗</span>}
          {isSpicy && <span className="bg-black/60 text-[9px] font-bold px-1.5 py-0.5 rounded-full backdrop-blur-sm" style={{ color: '#92000A' }}>🌶️</span>}
        </div>

        {!isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-xs">
            <span className="text-white font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full"
                  style={{ backgroundColor: '#92000A' }}>Sold Out</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-grow">
        <h4 className="font-bold text-xs text-white line-clamp-1 mb-0.5">{name}</h4>
        <p className="text-[10px] line-clamp-1 flex-grow mb-2" style={{ color: '#555' }}>{description}</p>
        <div className="flex items-center justify-between">
          <span className="font-extrabold text-sm" style={{ color: '#92000A' }}>${price.toFixed(2)}</span>
          {isAvailable && (
            <button onClick={(e) => { e.stopPropagation(); onSelect(item); }}
              className="w-7 h-7 rounded-full flex items-center justify-center text-white cursor-pointer transition-all active:scale-90"
              style={{ backgroundColor: '#92000A' }}>
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
