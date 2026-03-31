"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    q: "Combien de temps prend un projet ?",
    a: "Un site vitrine prend 2-3 semaines, un SaaS complexe 8-12 semaines."
  },
  {
    q: "Quels sont vos tarifs ?",
    a: "Nos projets démarrent généralement à partir de 3000€ selon les besoins."
  },
  {
    q: "Travaillez-vous à l'international ?",
    a: "Oui, nous accompagnons des clients partout dans le monde en remote."
  }
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="faq" className="bg-white py-32 border-b border-[#d2d2d7]">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="mb-20 text-center">
          <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#86868b] block mb-4">
            Support & Aide
          </span>
          <h2 className="text-[clamp(32px,4vw,56px)] font-bold text-[#1d1d1f] tracking-tight mb-6">
            Questions Fréquentes
          </h2>
        </div>

        <div className="max-w-[720px] mx-auto">
          {FAQS.map((faq, i) => (
            <div key={i} className={`border-t border-[#d2d2d7] ${i === FAQS.length - 1 ? "border-b" : ""}`}>
              <button
                onClick={() => toggle(i)}
                className="w-full py-8 flex items-center justify-between text-left hover:bg-[#f5f5f7] px-4 transition-all group"
              >
                <span className="text-[17px] font-semibold text-[#1d1d1f]">{faq.q}</span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  className="w-5 h-5 flex items-center justify-center text-[#86868b] transition-colors group-hover:text-[#1d1d1f]"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="overflow-hidden bg-white"
                  >
                    <div className="pb-8 px-4 text-[15px] text-[#6e6e73] leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
