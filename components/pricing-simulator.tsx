"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const OPTIONS = [
  { id: "web", label: "Site Web sur mesure", sub: "Next.js haute performance", value: 3000 },
  { id: "app", label: "App Mobile App", sub: "iOS & Android (React Native)", value: 5000 },
  { id: "seo", label: "SEO Avancé", sub: "Optimisation & Indexation", value: 1000 },
  { id: "design", label: "UI/UX Premium", sub: "Design system complet", value: 1500 },
  { id: "saas", label: "Espace Client / SaaS", sub: "Authentification & Database", value: 4000 },
];

export function PricingSimulator() {
  const [selected, setSelected] = useState<string[]>([]);
  const [plan, setPlan] = useState("Professionnel");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const sum = selected.reduce((acc, curr) => {
      const option = OPTIONS.find(o => o.id === curr);
      return acc + (option?.value || 0);
    }, 0);
    setTotal(sum);
  }, [selected]);

  const toggleOption = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const getBudgetLabel = () => {
    if (total === 0) return "Sélectionnez des options";
    if (total <= 3000) return "Budget estimé : Starter";
    if (total <= 7000) return "Budget estimé : Professionnel";
    return "Budget estimé : Entreprise";
  };

  return (
    <section id="pricing" className="bg-[#f5f5f7] py-32">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="mb-12">
          <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#86868b] block mb-4">
            Simulateur de Devis
          </span>
          <h2 className="text-[clamp(36px,5vw,64px)] font-bold text-[#1d1d1f] leading-[1.1] mb-6">
            Simulateur<br />de Devis
          </h2>
          <p className="text-[17px] text-[#6e6e73] max-w-[560px]">
            Estimez le coût de votre projet en 30 secondes avec notre algorithme intelligent.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Options */}
          <div>
            <div className="flex gap-2 mb-10">
              {["Basique", "Professionnel", "Entreprise"].map(p => (
                <button
                  key={p}
                  onClick={() => setPlan(p)}
                  className={`px-5 py-2.5 rounded-full text-[13px] font-medium border transition-all ${
                    plan === p ? "bg-[#1d1d1f] text-white border-[#1d1d1f]" : "bg-white text-[#6e6e73] border-[#d2d2d7]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="text-[15px] font-semibold text-[#1d1d1f] mb-4">Sélectionnez vos besoins</h3>
              {OPTIONS.map(opt => (
                <div
                  key={opt.id}
                  onClick={() => toggleOption(opt.id)}
                  className={`flex items-center gap-4 p-5 rounded-[12px] bg-white border cursor-pointer transition-all ${
                    selected.includes(opt.id) ? "border-[#1d1d1f]" : "border-[#d2d2d7]"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-[4px] border-1.5 flex items-center justify-center transition-all ${
                    selected.includes(opt.id) ? "bg-[#1d1d1f] border-[#1d1d1f]" : "bg-white border-[#d2d2d7]"
                  }`}>
                    {selected.includes(opt.id) && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    )}
                  </div>
                  <div>
                    <div className="text-[15px] font-medium text-[#1d1d1f]">{opt.label}</div>
                    <div className="text-[12px] text-[#86868b]">{opt.sub}</div>
                  </div>
                  <div className="ml-auto font-mono text-[13px] text-[#86868b]">
                    + {opt.value}€ Base
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Result Card */}
          <div className="lg:sticky lg:top-32 p-10 bg-white border border-[#d2d2d7] rounded-[24px] shadow-sm">
            <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#86868b] block mb-4">
              Estimation Totale
            </span>
            
            <div className="text-[clamp(48px,6vw,72px)] font-bold text-[#1d1d1f] tracking-tight mb-2 flex items-baseline">
              <span className="text-[0.6em] font-medium mr-1">€</span>
              <motion.span
                key={total}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-mono"
              >
                {total.toLocaleString('fr-FR')}
              </motion.span>
            </div>

            <p className="text-[14px] text-[#6e6e73] mb-8">{getBudgetLabel()}</p>
            
            <div className="h-[1px] bg-[#d2d2d7] w-full mb-8" />

            <div className="space-y-4 mb-10">
              <AnimatePresence mode="popLayout">
                {selected.length === 0 ? (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[14px] text-[#86868b] italic">Aucune option sélectionnée</motion.p>
                ) : (
                  selected.map(id => {
                    const opt = OPTIONS.find(o => o.id === id);
                    return (
                      <motion.div
                        key={id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex justify-between text-[14px]"
                      >
                        <span className="text-[#1d1d1f]">{opt?.label}</span>
                        <span className="text-[#86868b] font-mono">+{opt?.value}€</span>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            <a href="#contact" className="block w-full py-4 bg-[#1d1d1f] text-white text-center rounded-[12px] font-semibold text-[15px] transition-all hover:bg-[#333333]">
              Obtenir mon devis
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
