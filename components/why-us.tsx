"use client";

import { motion } from "framer-motion";

const REASONS = [
  {
    id: "vitesse",
    title: "Vitesse",
    description: "Livraison rapide sans compromis sur la qualité du code.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
    )
  },
  {
    id: "design",
    title: "Design",
    description: "Esthétique premium inspirée des meilleurs standards mondiaux.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path></svg>
    )
  },
  {
    id: "tech",
    title: "Tech",
    description: "Maîtrise des dernières technologies (Next.js, AI, Cloud).",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
    )
  }
];

export function WhyUs() {
  return (
    <section id="why-us" className="bg-white py-32 border-b border-[#d2d2d7]">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="mb-20">
          <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#86868b] block mb-4">
            Valeur Ajoutée
          </span>
          <h2 className="text-[clamp(36px,5vw,64px)] font-bold text-[#1d1d1f] tracking-tight mb-6">
            Pourquoi Nous ?
          </h2>
          <p className="text-[17px] text-[#6e6e73] max-w-[560px]">
            Plus qu&apos;une agence, un partenaire de croissance sur le long terme.
          </p>
        </div>

        <div className="flex flex-col md:flex-row border-t md:border-t-0 border-[#d2d2d7]">
          {REASONS.map((reason, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className={`flex-1 p-10 md:p-12 ${i < 2 ? "md:border-r border-b md:border-b-0 border-[#d2d2d7]" : ""} border-b md:border-b-0 border-[#d2d2d7]`}
            >
              <div className="w-12 h-12 bg-[#f5f5f7] rounded-[12px] flex items-center justify-center text-[#1d1d1f] mb-8">
                {reason.icon}
              </div>
              <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-4">{reason.title}</h3>
              <p className="text-[15px] text-[#6e6e73] leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
