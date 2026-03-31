"use client";

import { useState, useMemo, useEffect } from "react";
import { RevealText, FadeUp } from "@/components/reveal-text";
import siteData from "@/locales/fr.json";

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
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [tier, setTier] = useState<"low" | "mid" | "high">("mid");
  const [isAnimating, setIsAnimating] = useState(false);

  const data = siteData;
  const quote = data?.quote;
  const config = quote?.config as unknown as PricingConfig;
  const options = quote?.options as unknown as Option[];

  const totalPrice = useMemo(() => {
    if (!options || !config) return 0;
    const basePrice = selectedOptions.reduce((acc, currId) => {
      const option = options.find((opt) => opt.id === currId);
      return acc + (option?.price || 0);
    }, 0);

    const multiplier = config.multipliers[tier];
    return Math.round(basePrice * multiplier);
  }, [selectedOptions, tier, options, config]);

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

  return (
    <section id="pricing" className="border-b border-[#E5E5E5] bg-white relative overflow-hidden">
      <div className="px-8 md:px-20 py-24 md:py-40 border-b border-[#E5E5E5] flex flex-col md:flex-row md:items-end justify-between gap-16">
        <div className="max-w-2xl text-left">
          <FadeUp>
            <p className="text-[10px] font-black tracking-[0.4em] text-black/40 uppercase mb-8">
              Simulateur de Devis
            </p>
          </FadeUp>
          <RevealText
            as="h2"
            className="text-5xl md:text-8xl font-bold tracking-tighter text-black uppercase leading-[0.85]"
          >
            {quote.title}
          </RevealText>
          <FadeUp delay={0.2} className="mt-10">
            <p className="text-lg md:text-xl text-black/50 leading-relaxed font-light max-w-md">
              {quote.subtitle}
            </p>
          </FadeUp>
        </div>
        
        <div className="bg-[#F5F5F7] p-2 rounded-xl flex items-center gap-2 shrink-0">
          {(["low", "mid", "high"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTier(t)}
              className={`px-8 py-4 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                tier === t 
                ? "bg-black text-white shadow-2xl" 
                : "text-black/30 hover:text-black hover:bg-black/5"
              }`}
            >
              {config.complexityLabels[t as keyof typeof config.complexityLabels]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="p-10 md:p-24 border-r border-[#E5E5E5] space-y-12">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/20 mb-10 text-left">
            Sélectionnez vos besoins
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => toggleOption(option.id)}
                className={`p-8 rounded-xl border text-left transition-all duration-300 ${
                  selectedOptions.includes(option.id)
                  ? "bg-black border-black text-white scale-[1.02] shadow-2xl"
                  : "bg-white border-[#E5E5E5] text-black hover:border-black/30"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                   <span className={`text-[9px] font-black uppercase tracking-widest ${selectedOptions.includes(option.id) ? "text-white/40" : "text-black/20"}`}>
                    + {option.price}€ Base
                   </span>
                   {selectedOptions.includes(option.id) && (
                     <span className="text-white animate-in zoom-in duration-300">✓</span>
                   )}
                </div>
                <h4 className="text-md font-bold uppercase mb-2">{option.label}</h4>
                <p className={`text-xs font-light leading-relaxed ${selectedOptions.includes(option.id) ? "text-white/60" : "text-black/40"}`}>
                  {option.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="p-12 md:p-32 bg-[#FAFAFA] flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 block mb-12">
            Estimation Totale
          </span>
          
          <div className="relative mb-20">
            <div className={`flex items-start justify-center gap-2 transition-all duration-300 ${isAnimating ? "scale-90 opacity-50" : "scale-100 opacity-100"}`}>
              <span className="text-4xl font-bold mt-6 text-black">€</span>
              <span className="text-[clamp(6rem,18vw,12rem)] font-bold tracking-tighter leading-none text-black">
                {totalPrice.toLocaleString('fr-FR')}
              </span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-black/20 mt-8">
              Budget estimé : <span className="text-black font-bold underline decoration-black decoration-1">{config.complexityLabels[tier as keyof typeof config.complexityLabels]}</span>
            </p>
          </div>

          <button
            className="group flex items-center gap-10 bg-black text-white px-16 py-8 rounded-lg transition-all shadow-2xl hover:bg-black/90 active:scale-95 border border-black"
          >
            <span className="text-xs font-black uppercase tracking-[0.4em]">{quote.cta}</span>
            <div className="w-10 h-10 bg-white text-black rounded flex items-center justify-center group-hover:rotate-45 transition-all duration-500">
               <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                  <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
            </div>
          </button>
        </div>
      </div>
      <div className="hidden">alhambra-web.com</div>
    </section>
  );
}
