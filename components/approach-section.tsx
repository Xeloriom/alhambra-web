"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    id: "01",
    title: "Stratégie",
    description: "Analyse de vos besoins, audit et définition précise du périmètre projet."
  },
  {
    id: "02",
    title: "Design",
    description: "Conception visuelle itérative, UI/UX et prototypage interactif."
  },
  {
    id: "03",
    title: "Développement",
    description: "Développement agile avec un code propre, performant et évolutif."
  }
];

export function ApproachSection() {
  return (
    <section id="approach" className="bg-white py-32 border-b border-[#d2d2d7]">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="mb-20">
          <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#86868b] block mb-4">
            Méthodologie
          </span>
          <h2 className="text-[clamp(36px,5vw,64px)] font-bold text-[#1d1d1f] leading-tight mb-6">
            Notre Approche
          </h2>
          <p className="text-[17px] text-[#6e6e73] max-w-[560px]">
            Un processus structuré en trois étapes pour garantir des résultats prévisibles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`relative p-10 ${i < 2 ? "md:border-r border-[#d2d2d7]" : ""} border-t md:border-t-0 border-[#d2d2d7]`}
            >
              <span className="absolute top-0 right-10 text-[80px] font-mono font-medium text-[#f5f5f7] select-none z-0">
                {step.id}
              </span>
              <div className="relative z-10">
                <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-4">{step.title}</h3>
                <p className="text-[15px] text-[#6e6e73] leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
