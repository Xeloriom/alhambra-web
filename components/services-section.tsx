"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="relative py-32 md:py-48 bg-[#080808] px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-end mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
          >
            <span className="text-[10px] font-mono tracking-[0.5em] text-[#C9A84C] uppercase mb-8 block">
              NOTRE EXPERTISE —
            </span>
            <h2 className="text-6xl md:text-9xl font-display font-black leading-[0.8] italic uppercase tracking-tighter text-white">
              L&apos;INGÉNIERIE <br />
              <span className="text-[#C9A84C]">CRÉATIVE</span>
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="max-w-md"
          >
            <p className="text-xl text-white/40 leading-relaxed font-sans font-light">
              Nous fusionnons la rigueur technique avec l&apos;élégance visuelle pour créer des solutions qui ne se contentent pas d&apos;exister, mais qui redéfinissent les standards du marché.
            </p>
          </motion.div>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-white/5 border border-white/5">
          {services.map((service, index) => (
            <motion.div
              key={service.num}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group relative p-12 md:p-20 bg-[#0f0f0f] hover:bg-[#121212] transition-colors duration-500 flex flex-col justify-between aspect-square md:aspect-auto"
            >
              {/* Background Number */}
              <span className="absolute top-10 right-10 text-8xl md:text-[12rem] font-mono font-black text-white/[0.03] group-hover:text-[#C9A84C]/[0.05] transition-colors duration-500 pointer-events-none">
                {service.num}
              </span>
              
              <div className="relative z-10">
                <span className="text-xs font-mono text-[#C9A84C] mb-6 block">{service.num} /</span>
                <h3 className="text-3xl md:text-5xl font-display italic font-bold text-white mb-8 group-hover:translate-x-4 transition-transform duration-500">
                  {service.title}
                </h3>
              </div>
              
              <p className="relative z-10 text-white/40 group-hover:text-white/60 transition-colors duration-500 max-w-sm text-lg leading-relaxed">
                {service.description}
              </p>
              
              {/* Animated underline */}
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#C9A84C] group-hover:w-full transition-all duration-700 ease-in-out" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
