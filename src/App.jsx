import React, { useState } from 'react';
import { OrderProvider, useOrder } from './context/OrderContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import OfflineBanner from './components/OfflineBanner';
import WaiterModal from './components/WaiterModal';
import FeedbackModal from './components/FeedbackModal';
import SplashScreen from './pages/SplashScreen';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderTracking from './pages/OrderTracking';
import { AlertTriangle } from 'lucide-react';

function AppContent() {
  const { currentPage, isTableValid, splashDone } = useOrder();

  if (!isTableValid) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center min-h-screen px-6 py-20 text-center animate-fade-in"
           style={{ backgroundColor: '#111010' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center border mb-5"
             style={{ backgroundColor: '#1f0002', borderColor: '#92000A', color: '#92000A' }}>
          <AlertTriangle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-white mb-3">Invalid Table QR</h2>
        <p className="text-sm text-gray-400 font-medium max-w-xs mb-8">
          Please contact restaurant staff. This QR code is invalid or not active.
        </p>
        <div className="rounded-2xl px-5 py-4 w-full max-w-xs text-xs font-semibold"
             style={{ backgroundColor: '#1f0002', border: '1px solid #92000A33', color: '#f5a0a0' }}>
          💡 Append <code className="text-[#f47474] font-bold">?table=5</code> to the URL to test.
        </div>
      </div>
    );
  }

  if (!splashDone) return <SplashScreen />;

  const renderPage = () => {
    switch (currentPage) {
      case 'home':         return <Home />;
      case 'menu':         return <Menu />;
      case 'cart':         return <Cart />;
      case 'confirmation': return <OrderConfirmation />;
      case 'tracking':     return <OrderTracking />;
      default:             return <Home />;
    }
  };

  return (
    <div className="flex-grow flex flex-col min-h-screen" style={{ backgroundColor: '#111010', color: '#f5f5f4' }}>
      <Header />
      <main className="flex-grow flex flex-col overflow-x-hidden">
        {renderPage()}
      </main>
      <WaiterModal />
      <FeedbackModal />
      <OfflineBanner />
      <BottomNav />
    </div>
  );
}

export default function App() {
  return <OrderProvider><AppContent /></OrderProvider>;
}
