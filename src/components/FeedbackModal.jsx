import React, { useState } from 'react';
import { X, Star, Heart, Loader2 } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

const S = '#92000A'; const CARD = '#1c1c1c'; const BDR = 'rgba(255,255,255,0.07)';

export default function FeedbackModal() {
  const { isFeedbackModalOpen, setIsFeedbackModalOpen, submitFeedback } = useOrder();
  const [rating, setRating]           = useState(5);
  const [comment, setComment]         = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting]   = useState(false);
  const [success, setSuccess]         = useState(false);

  if (!isFeedbackModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await submitFeedback(rating, comment);
    setSubmitting(false);
    if (res?.success) {
      setSuccess(true);
      setTimeout(() => { setSuccess(false); setComment(''); setRating(5); setIsFeedbackModalOpen(false); }, 2000);
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
          <h3 className="font-black text-[16px] uppercase tracking-wide">Rate Experience</h3>
          <button onClick={() => { if (!submitting) setIsFeedbackModalOpen(false); }}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all cursor-pointer"
            style={{ backgroundColor: '#111111' }}>
            <X className="w-4 h-4" style={{ color: '#888' }} />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="py-8 text-center animate-fade-in">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 border"
                   style={{ backgroundColor: '#111111', borderColor: 'rgba(146,0,10,0.3)', color: S }}>
                <Heart className="w-6 h-6 fill-current animate-bounce-subtle" />
              </div>
              <p className="font-black text-[15px] text-white">Thank You!</p>
              <p className="text-[10px] uppercase tracking-wider font-bold mt-2" style={{ color: '#555' }}>Feedback received</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Stars */}
              <div className="text-center">
                <p className="text-[13px] mb-3 font-medium" style={{ color: '#888' }}>How was the food and service?</p>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1.5 cursor-pointer transition-all hover:scale-110 active:scale-90">
                      <Star className="w-9 h-9 transition-colors"
                        style={star <= (hoverRating || rating) ? { color: S, fill: S } : { color: '#333' }} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 pl-1" style={{ color: '#555' }}>Add Comments</label>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about the flavor, service…" rows="3"
                  className="w-full text-[14px] font-medium resize-none outline-none rounded-[20px] p-4 transition-all"
                  style={{ backgroundColor: '#111111', color: '#fff', border: '1px solid rgba(255,255,255,0.03)' }}
                  onFocus={(e) => e.target.style.border = `1px solid ${S}`}
                  onBlur={(e) => e.target.style.border = '1px solid rgba(255,255,255,0.03)'}
                />
              </div>

              <button type="submit" disabled={submitting}
                className="w-full py-4 px-5 rounded-[20px] text-white font-extrabold text-[15px] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 glow-btn cursor-pointer"
                style={{ backgroundColor: S, border: '1px solid rgba(255,255,255,0.1)' }}>
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Submitting…</span></> : <span>Submit Review</span>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
