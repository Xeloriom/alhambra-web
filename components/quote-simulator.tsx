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

export function QuoteSimulator() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [complexity, setComplexity] = useState(1); // 1 to 3

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

    // Multiplier for complexity
    basePrice = basePrice * (1 + (complexity - 1) * 0.25);

    // Dynamic discounts
    let discount = 0;
    if (selectedIds.length >= 3) discount = 0.1; // 10% discount for 3+ items
    if (selectedIds.length >= 5) discount = 0.15; // 15% discount for 5+ items

    const finalPrice = Math.round(basePrice * (1 - discount));
    
    return {
      subtotal: Math.round(basePrice),
      discount: Math.round(basePrice * discount),
      total: finalPrice
    };
  }, [selectedIds, complexity]);

  return (
    <section id="quote" className="py-20 bg-white border-b border-black/10">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-12">
            Simulateur de Devis <span className="text-[#FF4D00]">Instantané</span>
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Options */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => toggleOption(option.id)}
                  className={`p-6 rounded-2xl border text-left transition-all ${
                    selectedIds.includes(option.id)
                      ? "border-[#FF4D00] bg-[#FF4D00]/5 ring-1 ring-[#FF4D00]"
                      : "border-black/10 hover:border-black/30"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-lg uppercase tracking-tight">{option.label}</span>
                    <span className="text-[#FF4D00] font-black">{option.price}€</span>
                  </div>
                  <p className="text-xs text-black/40 uppercase font-semibold">{option.description}</p>
                </button>
              ))}
            </div>

            <div className="pt-8">
              <label className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4 block">
                Niveau de complexité & Urgence
              </label>
              <input
                type="range"
                min="1"
                max="3"
                step="1"
                value={complexity}
                onChange={(e) => setComplexity(parseInt(e.target.value))}
                className="w-full accent-[#FF4D00]"
              />
              <div className="flex justify-between mt-2 text-[10px] font-bold uppercase text-black/30">
                <span>Standard</span>
                <span>Avancé</span>
                <span>Enterprise</span>
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="bg-black text-white p-8 rounded-3xl h-fit sticky top-24">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-8">Résumé du projet</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Sous-total</span>
                <span>{calculation.subtotal}€</span>
              </div>
              {calculation.discount > 0 && (
                <div className="flex justify-between text-sm text-green-400">
                  <span>Remise Multi-options</span>
                  <span>-{calculation.discount}€</span>
                </div>
              )}
              <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                <span className="text-xs font-bold uppercase">Estimation</span>
                <span className="text-4xl font-black text-[#FF4D00]">{calculation.total}€</span>
              </div>
            </div>

            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full py-4 bg-[#FF4D00] text-white rounded-full text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all"
            >
              Valider ce devis
            </button>
            <p className="text-[10px] text-white/30 text-center mt-4 uppercase">
              * Prix indicatif basé sur vos besoins
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
