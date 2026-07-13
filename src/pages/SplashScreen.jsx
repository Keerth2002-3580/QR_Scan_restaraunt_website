import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=80',
    title: 'GOURMET EXPRESS',
    tag: 'Fine Dining · Table Service',
    tagline: 'Enjoy Your Meal',
    sub: 'Perfect food for your perfect day',
  },
  {
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
    title: 'GOURMET EXPRESS',
    tag: 'Fresh & Handcrafted',
    tagline: 'Order in Seconds',
    sub: 'Scan your table QR and start ordering instantly',
  },
  {
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80',
    title: 'GOURMET EXPRESS',
    tag: 'Pay at Counter',
    tagline: 'No Card Required',
    sub: 'Order now, pay comfortably after your meal',
  },
];

export default function SplashScreen() {
  const { tableNumber, setSplashDone } = useOrder();
  const [current, setCurrent]   = useState(0);
  const [animating, setAnimating] = useState(false);
  const slide  = SLIDES[current];
  const isLast = current === SLIDES.length - 1;

  const goNext = () => {
    if (animating) return;
    if (isLast) { setSplashDone(); return; }
    setAnimating(true);
    setTimeout(() => { setCurrent((c) => c + 1); setAnimating(false); }, 220);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-[#000000]" style={{ height: '100dvh' }}>

      {/* ── Top: food photo + overlay (takes remaining space) ── */}
      <div className="relative flex-grow w-full min-h-0 overflow-hidden">
        <img key={current} src={slide.image} alt=""
          className={`w-full h-full object-cover transition-all duration-500 ${animating ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80'; }}
        />
        {/* Dark vignette */}
        <div className="absolute inset-0"
             style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 40%, rgba(0,0,0,0.8) 100%)' }} />

        {/* Restaurant brand top-left */}
        <div className="absolute top-10 left-5 sm:top-12 sm:left-6">
          <p className="text-white text-xl font-black tracking-widest" style={{ letterSpacing: '0.12em' }}>{slide.title}</p>
          <p className="text-xs text-white/60 font-medium mt-0.5">{slide.tag}</p>
        </div>

        {/* Table badge top-right */}
        {tableNumber && (
          <div className="absolute top-10 right-5 sm:top-12 sm:right-6 text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 shadow-lg"
               style={{ backgroundColor: '#92000A' }}>
            🪑 Table {tableNumber}
          </div>
        )}

        {/* Skip */}
        {!isLast && (
          <button onClick={setSplashDone}
            className="absolute bottom-4 right-5 text-white/60 text-xs font-bold px-4 py-2 rounded-full cursor-pointer hover:text-white transition-all"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
            Skip
          </button>
        )}
      </div>

      {/* ── Bottom: dark panel (sizes to content) ── */}
      <div className="flex-none flex flex-col justify-end px-6 pt-6 pb-8"
           style={{ backgroundColor: '#0f0f0f', paddingBottom: 'calc(2rem + env(safe-area-inset-bottom, 0px))' }}>
        {/* Text */}
        <div className={`space-y-2 mb-8 transition-all duration-300 ${animating ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}`}>
          <h2 className="text-3xl font-black text-white leading-tight">{slide.tagline}</h2>
          <p className="text-sm font-medium" style={{ color: '#888' }}>{slide.sub}</p>
        </div>

        {/* Dots + Button */}
        <div className="space-y-6">
          {/* Dots */}
          <div className="flex gap-2">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => !animating && setCurrent(i)}
                className="rounded-full transition-all duration-300 cursor-pointer"
                style={i === current
                  ? { width: '1.75rem', height: '0.5rem', backgroundColor: '#92000A' }
                  : { width: '0.5rem',  height: '0.5rem', backgroundColor: 'rgba(255,255,255,0.18)' }} />
            ))}
          </div>

          {/* CTA button */}
          <button onClick={goNext}
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-4 px-10 rounded-2xl text-white font-extrabold text-base cursor-pointer transition-all active:scale-95 glow-btn"
            style={{ backgroundColor: '#92000A', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span>{isLast ? 'Get Started' : 'Continue'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
