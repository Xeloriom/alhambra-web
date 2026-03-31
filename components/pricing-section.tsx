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

  // Use imported static data
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
    <section id="pricing" className="border-b border-[#171717] bg-black relative overflow-hidden">
      <div className="px-8 md:px-12 py-16 border-b border-[#171717] flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="max-w-xl text-left">
          <FadeUp>
            <p className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase mb-4">
              Simulateur de Devis
            </p>
          </FadeUp>
          <RevealText
            as="h2"
            className="text-5xl md:text-7xl font-bold tracking-tighter text-white uppercase leading-[0.9]"
          >
            {quote.title}
          </RevealText>
          <FadeUp delay={0.2} className="mt-6">
            <p className="text-base text-white/50 leading-relaxed font-light">
              {quote.subtitle}
            </p>
          </FadeUp>
        </div>
        
        <div className="bg-[#171717] p-1.5 rounded-xl flex items-center gap-1 shrink-0">
          {(["low", "mid", "high"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTier(t)}
              className={`px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                tier === t 
                ? "bg-white text-black shadow-xl" 
                : "text-white/30 hover:text-white"
              }`}
            >
              {config.complexityLabels[t as keyof typeof config.complexityLabels]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="p-8 md:p-12 border-r border-[#171717] space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-6 text-left">
            Sélectionnez vos besoins
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => toggleOption(option.id)}
                className={`p-6 rounded-xl border text-left transition-all duration-300 ${
                  selectedOptions.includes(option.id)
                  ? "bg-white border-white text-black scale-[1.02]"
                  : "bg-black border-[#171717] text-white hover:border-white/30"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                   <span className={`text-[9px] font-black uppercase tracking-widest ${selectedOptions.includes(option.id) ? "text-black/40" : "text-white/20"}`}>
                    + {option.price}€ Base
                   </span>
                   {selectedOptions.includes(option.id) && (
                     <span className="text-black animate-in zoom-in duration-300">✓</span>
                   )}
                </div>
                <h4 className="text-sm font-bold uppercase mb-1">{option.label}</h4>
                <p className={`text-[10px] font-light leading-relaxed ${selectedOptions.includes(option.id) ? "text-black/60" : "text-white/40"}`}>
                  {option.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="p-8 md:p-24 bg-[#080808] flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 block mb-8">
            Estimation Totale
          </span>
          
          <div className="relative mb-12">
            <div className={`flex items-start justify-center gap-2 transition-all duration-300 ${isAnimating ? "scale-90 opacity-50" : "scale-100 opacity-100"}`}>
              <span className="text-3xl font-bold mt-4 text-white">€</span>
              <span className="text-[clamp(5rem,15vw,10rem)] font-bold tracking-tighter leading-none text-white">
                {totalPrice.toLocaleString('fr-FR')}
              </span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mt-4">
              Budget estimé : <span className="text-white font-bold underline decoration-white decoration-1">{config.complexityLabels[tier as keyof typeof config.complexityLabels]}</span>
            </p>
          </div>

          <button
            className="group flex items-center gap-6 bg-white text-black px-12 py-6 rounded-lg transition-all shadow-2xl hover:bg-black hover:text-white border border-white active:scale-95"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">{quote.cta}</span>
            <div className="w-8 h-8 bg-black text-white rounded flex items-center justify-center group-hover:rotate-45 group-hover:bg-white group-hover:text-black transition-all duration-300">
               <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
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
