"use client";

import { motion } from "framer-motion";

const services = [
  {
    num: "01",
    title: "Web Design & Development",
    description: "Next.js, React & Craft CMS. Nous créons des sites ultra-rapides, SEO-friendly et centrés sur la conversion.",
  },
  {
    num: "02",
    title: "Applications Mobiles",
    description: "React Native & Flutter. Des apps natives fluides, performantes et magnifiquement conçues.",
  },
  {
    num: "03",
    title: "SaaS & Logiciels Métier",
    description: "Conception de tableaux de bord complexes et d'architectures logicielles scalables.",
  },
  {
    num: "04",
    title: "UI / UX Design",
    description: "Audit ergonomique, prototypage haute-fidélité et design systems rigoureux.",
  },
];

export function ServicesSection({ data }: { data: any }) {
  return (
    <section id="services" className="py-48 md:py-64 bg-white px-6">
      <div className="max-w-[1120px] mx-auto text-center mb-32">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#6e6e73] mb-8 block"
        >
          NOS EXPERTISES —
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-[clamp(48px,5vw,80px)] font-bold text-[#1d1d1f] tracking-tight mb-12"
        >
          L&apos;Ingénierie de Haute Performance
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-xl text-[#6e6e73] leading-relaxed max-w-[700px] mx-auto"
        >
          Nous fusionnons la rigueur technique avec l&apos;élégance visuelle pour créer des solutions qui ne se contentent pas d&apos;exister, mais qui redéfinissent les standards du marché.
        </motion.p>
      </div>

      <div className="max-w-[1120px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={service.num}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="group relative p-16 md:p-24 bg-white border border-[#d2d2d7] rounded-[18px] transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-2"
          >
            <span className="text-[11px] font-mono font-semibold text-[#86868b] mb-12 block uppercase tracking-widest">
              {service.num} / Service
            </span>
            
            <h3 className="text-3xl md:text-4xl font-bold text-[#1d1d1f] mb-8 leading-tight">
              {service.title}
            </h3>
            
            <p className="text-lg text-[#6e6e73] leading-relaxed max-w-sm">
              {service.description}
            </p>

            <div className="mt-16 w-12 h-12 rounded-full border border-[#d2d2d7] flex items-center justify-center text-[#1d1d1f] transition-all group-hover:bg-[#1d1d1f] group-hover:text-white group-hover:border-[#1d1d1f]">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
               </svg>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
