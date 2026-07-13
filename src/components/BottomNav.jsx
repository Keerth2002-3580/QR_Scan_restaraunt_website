import React from 'react';
import { Home, Utensils, ShoppingBag, Radio } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

export default function BottomNav() {
  const { currentPage, setCurrentPage, cart, activeOrder, isTableValid } = useOrder();
  if (!isTableValid) return null;
  const cartCount = cart.reduce((a, i) => a + i.quantity, 0);
  const hasActive = activeOrder && activeOrder.status !== 'Completed';

  const tabs = [
    { key: 'home',     label: 'Home',  icon: Home,        match: ['home'] },
    { key: 'menu',     label: 'Menu',  icon: Utensils,    match: ['menu'] },
    { key: 'cart',     label: 'Cart',  icon: ShoppingBag, match: ['cart','confirmation'], badge: cartCount },
    { key: 'tracking', label: 'Track', icon: Radio,       match: ['tracking'], dot: hasActive },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t"
         style={{ backgroundColor: '#1a1a1a', borderColor: 'rgba(255,255,255,0.07)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.match.includes(currentPage);
          return (
            <button key={tab.key} onClick={() => setCurrentPage(tab.key)}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1 cursor-pointer transition-all active:scale-90 relative">
              {/* Icon pill */}
              <div className="relative flex items-center justify-center w-11 h-8 rounded-2xl transition-all duration-200"
                   style={isActive ? { backgroundColor: '#92000A' } : {}}>
                <Icon className="w-5 h-5 transition-colors duration-200"
                  style={{ color: isActive ? '#fff' : '#555' }} />
                {tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#dc2626', border: '2px solid #1a1a1a' }}>
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
                {tab.dot && !tab.badge && (
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-500"
                        style={{ border: '2px solid #1a1a1a' }} />
                )}
              </div>
              <span className="text-[10px] font-bold tracking-wide"
                    style={{ color: isActive ? '#92000A' : '#555' }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
