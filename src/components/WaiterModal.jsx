import React, { useState } from 'react';
import { X, Check, Droplet, Disc, Receipt, HelpCircle, Loader2 } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

const S = '#92000A'; const CARD = '#1c1c1c'; const BDR = 'rgba(255,255,255,0.07)';

// Custom SVG Icons to perfectly match the premium design screenshot
const CustomWater = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path>
  </svg>
);

const CustomPlate = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"></circle>
    <circle cx="12" cy="12" r="2.5" fill="currentColor"></circle>
  </svg>
);

const CustomBill = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 2v20l2.5-1.5L9 22l2.5-1.5L14 22l2.5-1.5L19 22V2l-2.5 1.5L14 2l-2.5 1.5L9 2 6.5 3.5 4 2z"></path>
    <path d="M12 8v8"></path>
    <path d="M14.5 10a2.5 2.5 0 0 0-2.5-2 2.5 2.5 0 0 0-2.5 2c0 2.5 5 2.5 5 5a2.5 2.5 0 0 1-2.5 2 2.5 2.5 0 0 1-2.5-2"></path>
  </svg>
);

const CustomHelp = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <path d="M12 17h.01"></path>
  </svg>
);

export default function WaiterModal() {
  const { isWaiterModalOpen, setIsWaiterModalOpen, triggerCallWaiter, tableNumber } = useOrder();
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isWaiterModalOpen) return null;

  const options = [
    { id: 'water',      label: 'Water',       icon: CustomWater, color: S },
    { id: 'plate',      label: 'Extra Plate', icon: CustomPlate, color: S },
    { id: 'bill',       label: 'Bill Please', icon: CustomBill,  color: S },
    { id: 'assistance', label: 'Assistance',  icon: CustomHelp,  color: S },
  ];

  const handleCall = async (option) => {
    setSubmitting(true);
    const res = await triggerCallWaiter(option.label);
    setSubmitting(false);
    if (res?.success) {
      setSuccessMsg(`"${option.label}" request sent`);
      // Auto close after 4 seconds, but give them a button too
      setTimeout(() => { 
        setSuccessMsg(''); 
        setIsWaiterModalOpen(false); 
      }, 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 animate-fade-in"
         style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)' }}>
      <div className="w-full max-w-sm rounded-[28px] overflow-hidden shadow-2xl animate-slide-up md:animate-fade-in"
           style={{ backgroundColor: '#1e1e1e', border: '1px solid rgba(255,255,255,0.03)' }}>

        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between text-white border-b"
             style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <h3 className="font-black text-[16px] uppercase tracking-wide">Call Waiter</h3>
          <button
            onClick={() => { if (!submitting) setIsWaiterModalOpen(false); }}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all cursor-pointer"
            style={{ backgroundColor: '#111111' }}
          >
            <X className="w-4 h-4" style={{ color: '#888' }} />
          </button>
        </div>

        <div className="p-6">
          {successMsg ? (
            <div className="text-center animate-fade-in flex flex-col items-center">
              <div className="w-full p-8 rounded-[20px] mb-5 flex flex-col items-center text-center shadow-inner" 
                   style={{ backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.02)' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                     style={{ backgroundColor: 'rgba(250,240,190,0.08)', color: '#FAF0BE', border: '1px solid rgba(250,240,190,0.2)' }}>
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="font-black text-lg text-white mb-1">{successMsg}</h4>
                <p className="text-[11px] font-bold uppercase tracking-widest mt-1" style={{ color: '#FAF0BE' }}>Staff is on the way</p>
              </div>
              
              <button onClick={() => { setSuccessMsg(''); setIsWaiterModalOpen(false); }}
                className="w-full py-4 rounded-[20px] text-white font-extrabold text-[15px] cursor-pointer transition-all active:scale-95 glow-btn"
                style={{ backgroundColor: S, border: '1px solid rgba(255,255,255,0.1)' }}>
                Done
              </button>
            </div>
          ) : submitting ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin mb-3" style={{ color: S }} />
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#555' }}>Sending request…</p>
            </div>
          ) : (
            <>
              <p className="text-[13px] mb-5 font-medium" style={{ color: '#888' }}>
                Select an option to notify staff immediately:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {options.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button key={opt.id} onClick={() => handleCall(opt)}
                      className="flex flex-col items-center justify-center py-6 px-4 rounded-[20px] text-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      style={{ backgroundColor: '#111111' }}>
                      <Icon className="w-8 h-8 mb-3" style={{ color: opt.color }} />
                      <span className="text-[15px] font-black text-white tracking-wide">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
