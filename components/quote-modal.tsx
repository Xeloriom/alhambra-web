"use client";

import { useState, useMemo } from "react";
import { FadeUp } from "@/components/reveal-text";

type Option = {
  id: string;
  label: string;
  price: number;
  description: string;
};

const options: Option[] = [
  { id: "web", label: "Site Web sur mesure", price: 3000, description: "Next.js haute performance" },
  { id: "mobile", label: "App Mobile App", price: 5000, description: "iOS & Android (React Native)" },
  { id: "seo", label: "SEO Avancé", price: 1000, description: "Optimisation & Indexation" },
  { id: "design", label: "UI/UX Premium", price: 1500, description: "Design system complet" },
  { id: "saas", label: "Espace Client / SaaS", price: 4000, description: "Auth & Base de données" },
  { id: "admin", label: "Panel Admin", price: 2000, description: "Gestion de contenu interne" },
];

export function QuoteModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [complexity, setComplexity] = useState(1);

  const toggleOption = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const calculation = useMemo(() => {
    let basePrice = selectedIds.reduce((acc, id) => {
      const option = options.find((o) => o.id === id);
      return acc + (option?.price || 0);
    }, 0);

    basePrice = basePrice * (1 + (complexity - 1) * 0.25);
    let discount = selectedIds.length >= 5 ? 0.15 : selectedIds.length >= 3 ? 0.1 : 0;
    const finalPrice = Math.round(basePrice * (1 - discount));
    
    return { subtotal: Math.round(basePrice), discount: Math.round(basePrice * discount), total: finalPrice };
  }, [selectedIds, complexity]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-[40px] p-8 md:p-12 overflow-hidden">
        <button onClick={onClose} className="absolute top-6 right-8 text-black hover:text-[#FF4D00] text-3xl font-black z-10 transition-colors">×</button>
        
        <div className="flex flex-col gap-10">
          <div>
            <span className="text-xs font-bold tracking-[0.3em] text-[#FF4D00] uppercase mb-4 block">Simulation 01</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-black leading-none">
              Simulateur <br/><span className="text-[#FF4D00]">de Devis</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleOption(option.id)}
                    className={`p-6 rounded-3xl border-2 text-left transition-all duration-300 ${
                      selectedIds.includes(option.id)
                        ? "border-[#FF4D00] bg-[#FF4D00]/5 ring-1 ring-[#FF4D00]"
                        : "border-black/10 hover:border-black/30"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-lg uppercase tracking-tight text-black">{option.label}</span>
                      <span className="text-[#FF4D00] font-black">{option.price}€</span>
                    </div>
                    <p className="text-[10px] text-black/40 uppercase font-black leading-tight">{option.description}</p>
                  </button>
                ))}
              </div>
              
              <div className="bg-black/5 p-8 rounded-3xl">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mb-6 block">Complexité & Délai</label>
                <input type="range" min="1" max="3" step="1" value={complexity} onChange={(e) => setComplexity(parseInt(e.target.value))} className="w-full accent-[#FF4D00] h-2 bg-black/10 rounded-full appearance-none cursor-pointer" />
                <div className="flex justify-between mt-4 text-[10px] font-black uppercase text-black/30 tracking-widest">
                  <span>Standard</span>
                  <span>Avancé</span>
                  <span>Enterprise</span>
                </div>
              </div>
            </div>

            <div className="bg-black text-white p-10 rounded-[40px] flex flex-col justify-between h-fit sticky top-0">
              <div className="space-y-6 mb-10">
                <p className="text-[10px] font-black tracking-widest uppercase text-white/40">Estimation Total</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl md:text-7xl font-black tracking-tighter text-[#FF4D00]">{calculation.total}</span>
                  <span className="text-2xl font-black text-white">€</span>
                </div>
                {calculation.discount > 0 && (
                  <div className="flex items-center gap-2 text-green-400 text-[10px] font-black uppercase tracking-widest bg-green-400/10 px-3 py-1 rounded-full w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Remise -{calculation.discount}€
                  </div>
                )}
              </div>
              
              <button onClick={() => { onClose(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="w-full py-5 bg-[#FF4D00] text-white rounded-full text-xs font-black tracking-widest uppercase hover:bg-white hover:text-black transition-all">Valider le devis</button>
              <p className="text-[9px] text-white/20 text-center mt-6 uppercase font-bold tracking-widest">Calculé par Alhambra Engine v1.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
