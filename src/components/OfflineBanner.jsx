import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const on  = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online',  on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fade-in"
         style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
      <div className="max-w-sm w-full rounded-3xl p-6 text-center border"
           style={{ backgroundColor: '#1c1c1c', borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 border"
             style={{ backgroundColor: '#1f0002', borderColor: '#92000A', color: '#92000A' }}>
          <WifiOff className="w-8 h-8 animate-bounce-subtle" />
        </div>
        <h2 className="text-xl font-black text-white mb-2">Connection Lost</h2>
        <p className="text-xs mb-6 font-medium leading-relaxed" style={{ color: '#888' }}>
          Please check your internet connection and try again to view the menu or submit orders.
        </p>
        <button
          onClick={() => setIsOnline(navigator.onLine)}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl text-white font-extrabold text-sm active:scale-95 transition-all cursor-pointer glow-btn"
          style={{ backgroundColor: '#92000A' }}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>
      </div>
    </div>
  );
}
