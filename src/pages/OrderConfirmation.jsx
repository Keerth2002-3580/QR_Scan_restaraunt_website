import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Table2, FileText, CheckCircle } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

const S = '#92000A'; const CARD = '#1c1c1c'; const BDR = 'rgba(255,255,255,0.07)';

export default function OrderConfirmation() {
  const { cart, calculateTotal, tableNumber, placeOrder, setCurrentPage } = useOrder();
  const [notes, setNotes]           = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { subtotal, tax, total }    = calculateTotal();

  useEffect(() => { setNotes(localStorage.getItem('qr_order_notes') || ''); }, []);

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    const result = await placeOrder(notes);
    setSubmitting(false);
    if (result?.success) { localStorage.removeItem('qr_order_notes'); setCurrentPage('tracking'); }
    else alert('Order placement failed. Please retry.');
  };

  if (cart.length === 0) return <div className="flex-grow flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" style={{ color: S }} /></div>;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pt-5 pb-28 md:pb-10 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setCurrentPage('cart')}
          className="p-2.5 rounded-2xl cursor-pointer transition-all active:scale-95 border"
          style={{ backgroundColor: CARD, borderColor: BDR, color: '#aaa' }}>
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xl font-black text-white">Confirm Order</h2>
          <p className="text-[10px] uppercase tracking-wider font-bold mt-0.5" style={{ color: '#555' }}>Review before kitchen</p>
        </div>
      </div>

      <div className="md:grid md:grid-cols-[1fr_360px] md:gap-6">
        {/* Left: Items */}
        <div className="rounded-3xl p-5 space-y-5 mb-5 md:mb-0 border" style={{ backgroundColor: CARD, borderColor: BDR }}>
          
          {/* Table display */}
          <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: BDR }}>
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#aaa' }}>
              <Table2 className="w-4 h-4" style={{ color: S }} /> Table Number
            </div>
            <span className="font-black text-sm px-3 py-1 rounded-xl" style={{ backgroundColor: '#1f0002', color: S, border: `1px solid ${S}44` }}>
              {tableNumber}
            </span>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: '#555' }}>Order Items</p>
            <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar">
              {cart.map((item) => {
                const ec = item.customizations.extras.reduce((a, c) => a + c.price, 0);
                const price = (item.price + ec) * item.quantity;
                return (
                  <div key={item.cartItemId} className="flex justify-between items-start gap-4 text-xs py-2 border-b last:border-0" style={{ borderColor: BDR }}>
                    <div className="min-w-0">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span className="font-extrabold" style={{ color: S }}>{item.quantity}×</span>
                        <span className="line-clamp-1">{item.name}</span>
                      </div>
                      <p className="text-[10px] pl-5 font-semibold truncate mt-0.5" style={{ color: '#666' }}>
                        {item.customizations.spiceLevel !== 'Regular' && `[${item.customizations.spiceLevel}] `}
                        {item.customizations.exclusions.join(', ')}
                        {item.customizations.exclusions.length > 0 && item.customizations.extras.length > 0 && ' | '}
                        {item.customizations.extras.map((e) => e.name).join(', ')}
                      </p>
                    </div>
                    <span className="font-extrabold shrink-0" style={{ color: '#ccc' }}>LKR {price.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {notes && (
            <div className="border-t pt-4 space-y-2" style={{ borderColor: BDR }}>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: '#555' }}>
                <FileText className="w-3.5 h-3.5" style={{ color: S }} /> Kitchen Notes
              </div>
              <p className="text-xs italic p-3 rounded-xl border leading-relaxed"
                 style={{ backgroundColor: '#111', borderColor: BDR, color: '#888' }}>"{notes}"</p>
            </div>
          )}
        </div>

        {/* Right: Summary */}
        <div className="space-y-5">
          <div className="rounded-3xl p-5 space-y-4 border" style={{ backgroundColor: CARD, borderColor: BDR }}>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#555' }}>Price Summary</p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between" style={{ color: '#888' }}><span>Subtotal</span><span className="text-white">LKR {subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between" style={{ color: '#888' }}><span>VAT (8%)</span><span className="text-white">LKR {tax.toFixed(2)}</span></div>
              <div className="border-t pt-3 flex justify-between font-extrabold text-lg" style={{ borderColor: BDR }}>
                <span className="text-white">Grand Total</span>
                <span style={{ color: S }}>LKR {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button onClick={handlePlaceOrder} disabled={submitting}
            className="w-full py-4 px-6 rounded-2xl text-white font-extrabold text-sm active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer glow-btn"
            style={{ backgroundColor: S }}>
            {submitting
              ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Sending to Kitchen…</span></>
              : <><CheckCircle className="w-4 h-4" /><span>Place Order — LKR {total.toFixed(2)}</span></>}
          </button>
        </div>
      </div>
    </div>
  );
}
