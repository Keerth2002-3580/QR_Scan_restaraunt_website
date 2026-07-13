import React from 'react';
import { Bell, MapPin, Soup, Home, BookOpen, ShoppingCart, Clock } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

export default function Header() {
  const { tableNumber, setIsWaiterModalOpen, currentPage, setCurrentPage, cart, activeOrder } = useOrder();
  const cartCount = cart.reduce((a, i) => a + i.quantity, 0);
  const navItems = [
    { key: 'home',     label: 'Home',     icon: Home },
    { key: 'menu',     label: 'Menu',     icon: BookOpen },
    { key: 'cart',     label: 'Cart',     icon: ShoppingCart, badge: cartCount },
    { key: 'tracking', label: 'Tracking', icon: Clock, dot: activeOrder && activeOrder.status !== 'Completed' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b" style={{ backgroundColor: '#111010', borderColor: 'rgba(255,255,255,0.06)' }}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Left: Location-style table display (like the app in image) */}
        <button onClick={() => setCurrentPage('home')} className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105" 
               style={{ backgroundColor: '#050505', border: '1px solid rgba(250,240,190,0.15)', boxShadow: 'inset 0 0 10px rgba(250,240,190,0.05)' }}>
            <Soup className="w-5 h-5" style={{ color: '#FAF0BE' }} />
          </div>
          <div className="text-left">
            {tableNumber ? (
              <>
                <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest" style={{ color: '#FAF0BE' }}>
                  <MapPin className="w-3 h-3" />
                  <span>Your Table</span>
                </div>
                <p className="text-[15px] font-black text-white leading-tight">Table {tableNumber}</p>
              </>
            ) : (
              <>
                <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#FAF0BE' }}>Gourmet</p>
                <p className="text-[15px] font-black text-white leading-tight">Express QR</p>
              </>
            )}
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 rounded-2xl p-1.5 border" style={{ backgroundColor: '#1c1c1c', borderColor: 'rgba(255,255,255,0.07)' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.key;
            return (
              <button key={item.key} onClick={() => setCurrentPage(item.key)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer`}
                style={isActive ? { backgroundColor: '#92000A', color: '#fff' } : { color: '#888', backgroundColor: 'transparent' }}>
                <Icon className="w-4 h-4" />
                {item.label}
                {item.badge > 0 && (
                  <span className="text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-extrabold bg-red-600 text-white">{item.badge}</span>
                )}
                {item.dot && <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />}
              </button>
            );
          })}
        </nav>

        {/* Right: Bell / Call Waiter */}
        <button onClick={() => setIsWaiterModalOpen(true)}
          className="relative p-2.5 rounded-2xl border cursor-pointer transition-all active:scale-95"
          style={{ backgroundColor: '#1c1c1c', borderColor: 'rgba(255,255,255,0.07)' }}>
          <Bell className="w-5 h-5 text-white animate-bounce-subtle" />
          {/* Red dot to draw attention */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#92000A]" />
        </button>
      </div>
    </header>
  );
}
