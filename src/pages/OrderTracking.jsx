import React, { useState } from 'react';
import { Clock, CheckCircle2, ChefHat, Package, Check, Utensils, Receipt, Sparkles, Loader2, ArrowRight, CreditCard } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

const S = '#92000A'; const CARD = '#1c1c1c'; const BDR = 'rgba(255,255,255,0.07)';
const ALL_STATUSES = [
  { key: 'Received',  title: 'Order Received',  desc: 'Kitchen has received your order.',    icon: Package },
  { key: 'Preparing', title: 'Preparing',        desc: 'Chef is crafting your fresh meal.',   icon: ChefHat, estimate: 'Est: 12 Mins' },
  { key: 'Ready',     title: 'Ready to Serve',   desc: 'Your food is ready! Waiter incoming.',icon: Clock },
  { key: 'Served',    title: 'Served',            desc: 'Enjoy your meal!',                    icon: Utensils },
  { key: 'Completed', title: 'Completed',         desc: 'Order finalised. Payment received.',  icon: CheckCircle2 },
];
const STATUS_ORDER = ALL_STATUSES.map((s) => s.key);

export default function OrderTracking() {
  const { activeOrder, requestBill, setIsFeedbackModalOpen, cancelActiveOrder, setCurrentPage } = useOrder();
  const [requestingBill, setRequestingBill] = useState(false);
  const [billSent, setBillSent]             = useState(false);

  const handleBill = async () => {
    setRequestingBill(true);
    const res = await requestBill();
    setRequestingBill(false);
    if (res?.success) { setBillSent(true); setTimeout(() => setBillSent(false), 5000); }
  };

  const getStepStatus = (key) => {
    const cur = STATUS_ORDER.indexOf(activeOrder?.status || 'Received');
    const idx = STATUS_ORDER.indexOf(key);
    if (idx < cur) return 'completed';
    if (idx === cur) return 'active';
    return 'pending';
  };

  if (!activeOrder) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center px-4 py-16 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full flex items-center justify-center border mb-5 shadow-sm"
             style={{ backgroundColor: '#111', borderColor: BDR }}>
          <Clock className="w-8 h-8" style={{ color: '#555' }} />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">No active orders</h2>
        <p className="text-sm font-medium mb-8" style={{ color: '#666' }}>You haven't placed an order yet.</p>
        <button onClick={() => setCurrentPage('home')}
          className="px-8 py-3.5 rounded-2xl text-white font-extrabold text-sm active:scale-95 transition-all cursor-pointer glow-btn"
          style={{ backgroundColor: S }}>
          View Menu
        </button>
      </div>
    );
  }

  const isCompleted = activeOrder.status === 'Completed';

  const Stepper = () => (
    <div className="rounded-3xl p-6 border h-fit" style={{ backgroundColor: CARD, borderColor: BDR }}>
      <h3 className="font-black text-sm tracking-wide uppercase mb-6" style={{ color: '#fff' }}>Live Status</h3>
      <div className="relative pl-9 space-y-6">
        <div className="absolute left-[15px] top-2 bottom-2 w-0.5" style={{ backgroundColor: '#333' }} />
        {ALL_STATUSES.map((step) => {
          const status   = getStepStatus(step.key);
          const StepIcon = step.icon;

          const bulletStyle =
            status === 'completed' ? { backgroundColor: '#10b981', borderColor: '#10b981', color: '#fff' } :
            status === 'active'    ? { backgroundColor: S, borderColor: S, color: '#fff' } :
                                     { backgroundColor: '#111', borderColor: '#333', color: '#555' };

          const titleStyle =
            status === 'completed' ? { color: '#aaa', fontWeight: 600 } :
            status === 'active'    ? { color: '#fff', fontWeight: 900 } :
                                     { color: '#555', fontWeight: 600 };

          return (
            <div key={step.key} className="relative">
              <div className="absolute -left-12 top-0.5 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all z-10" style={bulletStyle}>
                {status === 'completed' ? <Check className="w-4 h-4 stroke-[3]" /> : <StepIcon className="w-4 h-4" />}
              </div>
              <div className="space-y-1">
                <h4 className="text-sm" style={titleStyle}>{step.title}</h4>
                <p className="text-[10px] leading-normal font-medium" style={{ color: status === 'active' ? '#aaa' : '#555' }}>{step.desc}</p>
                {step.estimate && status === 'active' && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-[10px] font-bold mt-1 animate-pulse"
                       style={{ backgroundColor: '#1f0002', borderColor: `${S}44`, color: '#f47474' }}>
                    <Clock className="w-3.5 h-3.5" /><span>{step.estimate}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const RightPanel = () => (
    <div className="space-y-5">
      <div className="rounded-3xl p-5 border space-y-4" style={{ backgroundColor: CARD, borderColor: BDR }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#555' }}>Order ID</p>
            <p className="text-sm font-black text-white">{activeOrder.orderId}</p>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold border ${activeOrder.paymentStatus === 'Paid' ? 'glow-green' : 'animate-pulse'}`}
            style={activeOrder.paymentStatus === 'Paid' ? { backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', borderColor: '#10b981' } : { backgroundColor: '#1f0002', color: '#f47474', borderColor: `${S}44` }}>
            {activeOrder.paymentStatus}
          </span>
        </div>
        <div className="border-t pt-4 text-xs space-y-2" style={{ borderColor: BDR }}>
          <div className="flex items-center gap-1.5 font-bold text-white">
            <CreditCard className="w-3.5 h-3.5" style={{ color: S }} /><span>Payment at counter</span>
          </div>
          <p className="font-medium leading-relaxed" style={{ color: '#666' }}>Pay with cash or card after your meal.</p>
        </div>
      </div>

      {!isCompleted && (
        <div className="rounded-3xl p-5 border space-y-4" style={{ backgroundColor: CARD, borderColor: BDR }}>
          <div>
            <h4 className="font-black text-sm text-white">Done eating?</h4>
            <p className="text-[10px] font-medium mt-0.5" style={{ color: '#666' }}>Alert cashier you are ready to pay.</p>
          </div>
          {billSent ? (
            <div className="p-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in border"
                 style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', borderColor: '#10b981' }}>
              <CheckCircle2 className="w-4 h-4 shrink-0" /><span>Cashier notified!</span>
            </div>
          ) : (
            <button onClick={handleBill} disabled={requestingBill}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl text-white font-extrabold text-xs active:scale-95 transition-all cursor-pointer glow-btn"
              style={{ backgroundColor: S }}>
              {requestingBill ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Requesting…</span></> : <><Receipt className="w-4 h-4" /><span>Bill Please</span></>}
            </button>
          )}
        </div>
      )}

      {isCompleted && (
        <button onClick={cancelActiveOrder}
          className="w-full py-3.5 px-5 rounded-2xl font-extrabold text-sm transition-all cursor-pointer border"
          style={{ backgroundColor: '#111', color: '#fff', borderColor: BDR }}>
          Start New Order
        </button>
      )}

      <div className="rounded-3xl p-5 border flex items-center justify-between gap-4" style={{ backgroundColor: CARD, borderColor: BDR }}>
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-[10px] font-bold" style={{ color: S }}>
            <Sparkles className="w-3 h-3 fill-current" /><span>Review Us</span>
          </div>
          <h4 className="font-black text-sm text-white">How was the food?</h4>
        </div>
        <button onClick={() => setIsFeedbackModalOpen(true)}
          className="shrink-0 px-4 py-2.5 text-white font-extrabold text-xs rounded-xl active:scale-95 transition-all flex items-center gap-1 cursor-pointer glow-btn"
          style={{ backgroundColor: S }}>
          <span>Rate</span><ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pt-5 pb-28 md:pb-10 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-white">Order Tracking</h2>
          <p className="text-[10px] uppercase tracking-wider font-bold mt-0.5" style={{ color: '#555' }}>
            Table <span className="text-[#ccc]">{activeOrder.tableNumber}</span>
          </p>
        </div>
      </div>
      <div className="md:grid md:grid-cols-[1fr_360px] md:gap-6 space-y-5 md:space-y-0">
        <Stepper /><RightPanel />
      </div>
    </div>
  );
}
