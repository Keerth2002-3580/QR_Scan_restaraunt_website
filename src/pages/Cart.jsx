import React, { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, AlertCircle, ShoppingCart } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

const S = '#92000A'; const CARD = '#1c1c1c'; const BDR = 'rgba(255,255,255,0.07)';

export default function Cart() {
  const { cart, updateCartQuantity, removeFromCart, calculateTotal, setCurrentPage } = useOrder();
  const [notes, setNotes] = useState('');
  const { subtotal, tax, total } = calculateTotal();

  if (cart.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center px-4 py-16 text-center animate-fade-in">
        <div className="w-24 h-24 rounded-full flex items-center justify-center border mb-6 animate-pulse-slow"
             style={{ backgroundColor: '#1f0002', borderColor: S, color: S }}>
          <ShoppingCart className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Cart is Empty</h2>
        <p className="text-sm max-w-xs mb-8 font-medium" style={{ color: '#555' }}>Add some delicious items from the menu.</p>
        <button onClick={() => setCurrentPage('home')}
          className="px-8 py-3.5 rounded-2xl text-white font-extrabold text-sm active:scale-95 transition-all shadow-lg cursor-pointer glow-btn"
          style={{ backgroundColor: S }}>
          Browse Menu
        </button>
      </div>
    );
  }

  const CartItem = ({ item }) => {
    const ec  = item.customizations.extras.reduce((a, c) => a + c.price, 0);
    const sub = (item.price + ec) * item.quantity;
    return (
      <div className="flex gap-3 p-4 rounded-2xl border" style={{ backgroundColor: CARD, borderColor: BDR }}>
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#111] flex-shrink-0">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=60'; }} />
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between gap-1">
            <h4 className="font-bold text-sm text-white line-clamp-1">{item.name}</h4>
            <button onClick={() => removeFromCart(item.cartItemId)} className="text-red-500/40 hover:text-red-500 p-1 transition-colors cursor-pointer flex-shrink-0">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-1 mt-0.5 mb-2">
            {item.customizations.exclusions.map((ex) => (
              <span key={ex} className="text-[9px] font-bold text-rose-400 bg-rose-400/10 px-1.5 py-0.5 rounded-full">{ex}</span>
            ))}
            {item.customizations.extras.map((ext) => (
              <span key={ext.name} className="text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full">+{ext.name}</span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center rounded-xl p-0.5 border" style={{ backgroundColor: '#111', borderColor: BDR }}>
              <button onClick={() => updateCartQuantity(item.cartItemId, -1)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5 text-white cursor-pointer transition-all">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center text-xs font-black text-white">{item.quantity}</span>
              <button onClick={() => updateCartQuantity(item.cartItemId, 1)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5 text-white cursor-pointer transition-all">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="font-extrabold text-sm" style={{ color: S }}>${sub.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pt-5 pb-32 md:pb-10 animate-fade-in">
      <div className="mb-5">
        <h2 className="text-xl font-black text-white">Your Cart</h2>
        <p className="text-xs font-medium mt-0.5" style={{ color: '#555' }}>{cart.reduce((a, i) => a + i.quantity, 0)} items · Review before ordering</p>
      </div>

      <div className="md:grid md:grid-cols-[1fr_360px] md:gap-6">
        <div className="space-y-3 mb-5 md:mb-0">
          {cart.map((item) => <CartItem key={item.cartItemId} item={item} />)}

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider pl-1" style={{ color: '#555' }}>Kitchen Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Allergies, special requests…" rows="3"
              className="w-full text-xs font-medium resize-none outline-none rounded-2xl p-3 transition-all"
              style={{ backgroundColor: CARD, color: '#ccc', border: `1px solid ${BDR}` }} />
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="rounded-2xl p-5 border space-y-3.5" style={{ backgroundColor: CARD, borderColor: BDR }}>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#555' }}>Order Summary</p>
            <div className="text-sm space-y-2.5">
              <div className="flex justify-between" style={{ color: '#888' }}><span>Subtotal</span><span className="text-white">${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between" style={{ color: '#888' }}><span>VAT (8%)</span><span className="text-white">${tax.toFixed(2)}</span></div>
              <div className="border-t pt-2.5 flex justify-between font-extrabold text-base" style={{ borderColor: BDR }}>
                <span className="text-white">Total</span>
                <span style={{ color: S }}>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 rounded-2xl p-3.5 text-xs border" style={{ backgroundColor: '#1f0002', borderColor: `${S}44`, color: '#f47474' }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: S }} />
            <p>Pay at cashier after your meal. No online payment required.</p>
          </div>

          <button onClick={() => { localStorage.setItem('qr_order_notes', notes); setCurrentPage('confirmation'); }}
            className="w-full flex items-center justify-between py-4 px-6 rounded-2xl text-white font-extrabold text-sm cursor-pointer glow-btn transition-all"
            style={{ backgroundColor: S }}>
            <div className="flex items-center gap-2"><ShoppingBag className="w-4 h-4" /><span>Confirm Order</span></div>
            <div className="flex items-center gap-1"><span>${total.toFixed(2)}</span><ArrowRight className="w-4 h-4 ml-1" /></div>
          </button>
        </div>
      </div>

      {/* Mobile sticky */}
      <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto z-30 px-4 py-2 md:hidden">
        <button onClick={() => { localStorage.setItem('qr_order_notes', notes); setCurrentPage('confirmation'); }}
          className="w-full flex items-center justify-between py-4 px-6 rounded-2xl text-white font-extrabold text-sm cursor-pointer glow-btn transition-all"
          style={{ backgroundColor: S }}>
          <div className="flex items-center gap-2"><ShoppingBag className="w-4 h-4" /><span>Confirm Order</span></div>
          <div className="flex items-center gap-1"><span>${total.toFixed(2)}</span><ArrowRight className="w-4 h-4 ml-1" /></div>
        </button>
      </div>
    </div>
  );
}
