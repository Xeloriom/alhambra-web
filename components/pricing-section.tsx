"use client";

import { useState, useMemo, useEffect } from "react";
import { RevealText, FadeUp } from "@/components/reveal-text";

interface Option {
  id: string;
  label: string;
  price: number;
  description: string;
}

interface PricingConfig {
  multipliers: {
    low: number;
    mid: number;
    high: number;
  };
  complexityLabels: {
    low: string;
    mid: string;
    high: string;
  };
}

export function PricingSection() {
  const [data, setData] = useState<any>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [tier, setTier] = useState<"low" | "mid" | "high">("mid");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    fetch("/api/admin/config")
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  const quote = data?.quote;
  const config = quote?.config as PricingConfig;
  const options = quote?.options as Option[];

  const totalPrice = useMemo(() => {
    if (!options || !config) return 0;
    const basePrice = selectedOptions.reduce((acc, currId) => {
      const option = options.find((opt) => opt.id === currId);
      return acc + (option?.price || 0);
    }, 0);

    const multiplier = config.multipliers[tier];
    return Math.round(basePrice * multiplier);
  }, [selectedOptions, tier, options, config]);

  // Trigger animation when price changes
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [totalPrice]);

  const toggleOption = (id: string) => {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };

  if (!data) return null;

  return (
    <section id="pricing" className="border-b border-black/10 bg-white relative overflow-hidden grid-overlay">
      <div className="px-8 md:px-12 py-16 border-b border-black/10 flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="max-w-xl">
          <FadeUp>
            <p className="text-xs font-black tracking-[0.3em] text-[#FF4D00] uppercase mb-4">
              Simulateur de Devis
            </p>
          </FadeUp>
          <RevealText
            as="h2"
            className="text-5xl md:text-7xl font-black tracking-tighter text-balance text-[#000000] uppercase leading-[0.9]"
          >
            {quote.title}
          </RevealText>
          <FadeUp delay={0.2} className="mt-6">
            <p className="text-base text-black/50 leading-relaxed font-medium">
              {quote.subtitle}
            </p>
          </FadeUp>
        </div>
        
        <div className="bg-[#F5F5F7] p-1.5 rounded-2xl flex items-center gap-1 shrink-0">
          {(["low", "mid", "high"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTier(t)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                tier === t 
                ? "bg-black text-white shadow-xl shadow-black/20" 
                : "text-black/30 hover:text-black hover:bg-black/5"
              }`}
            >
              {config.complexityLabels[t]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="p-8 md:p-12 border-r border-black/10 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/20 mb-6">
            Sélectionnez vos besoins
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => toggleOption(option.id)}
                className={`p-6 rounded-3xl border-2 text-left transition-all duration-300 ${
                  selectedOptions.includes(option.id)
                  ? "bg-black border-black text-white scale-[1.02]"
                  : "bg-white border-black/5 hover:border-[#FF4D00]/30"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                   <span className={`text-[9px] font-black uppercase tracking-widest ${selectedOptions.includes(option.id) ? "text-[#FF4D00]" : "text-black/20"}`}>
                    + {option.price}€ Base
                   </span>
                   {selectedOptions.includes(option.id) && (
                     <span className="text-[#FF4D00] animate-in zoom-in duration-300">✓</span>
                   )}
                </div>
                <h4 className="text-sm font-black uppercase mb-1">{option.label}</h4>
                <p className={`text-[10px] font-medium leading-relaxed ${selectedOptions.includes(option.id) ? "text-white/50" : "text-black/40"}`}>
                  {option.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="p-8 md:p-24 bg-[#F9F9F9] flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 block mb-8">
            Estimation Totale
          </span>
          
          <div className="relative mb-12">
            <div className={`flex items-start justify-center gap-2 transition-all duration-300 ${isAnimating ? "scale-90 opacity-50" : "scale-100 opacity-100"}`}>
              <span className="text-3xl font-black mt-4 text-[#FF4D00]">€</span>
              <span className="text-[clamp(5rem,15vw,10rem)] font-black tracking-tighter leading-none">
                {totalPrice.toLocaleString('fr-FR')}
              </span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-black/20 mt-4">
              Budget estimé : <span className="text-black font-black underline decoration-[#FF4D00] decoration-2">{config.complexityLabels[tier]}</span>
            </p>
          </div>

          <button
            className="group flex items-center gap-6 bg-black text-white px-12 py-6 rounded-full transition-all shadow-2xl hover:shadow-black/20 active:scale-95"
          >
            <span className="text-xs font-black uppercase tracking-[0.3em]">{quote.cta}</span>
            <div className="w-8 h-8 bg-[#FF4D00] rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
               <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 10L10 2M10 2H4M10 2V8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
            </div>
          </button>
        </div>
      </div>
      <div className="hidden">alhambra-web.com</div>
    </section>
  );
}
