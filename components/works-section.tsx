"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const works = [
  {
    id: "01",
    title: "EcoSphere Dashboard",
    category: "App Web",
    year: "2024",
    gradient: "from-[#C9A84C] to-[#080808]",
  },
  {
    id: "02",
    title: "Nova Mobile App",
    category: "App Mobile",
    year: "2024",
    gradient: "from-[#0f0f0f] to-[#C9A84C]",
  },
  {
    id: "03",
    title: "Quantum SaaS",
    category: "Logiciel",
    year: "2023",
    gradient: "from-[#1a1a1a] to-[#4a4a4a]",
  },
  {
    id: "04",
    title: "Zenith Identity",
    category: "Branding",
    year: "2023",
    gradient: "from-[#C9A84C] to-[#4a4a4a]",
  },
];

export function WorksSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section id="work" ref={containerRef} className="py-32 md:py-64 bg-[#080808] px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-32 border-b border-white/5 pb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
          >
            <span className="text-[10px] font-mono tracking-[0.5em] text-[#C9A84C] uppercase mb-8 block">
              TRAVAUX RÉCENTS —
            </span>
            <h2 className="text-6xl md:text-9xl font-display font-black italic uppercase tracking-tighter text-white">
              SÉLECTION <br />
              <span className="text-[#C9A84C]">D&apos;EXCEPTION</span>
            </h2>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="max-w-sm text-lg text-white/40 leading-relaxed font-sans mb-4"
          >
            Une collection de projets qui ont produit des résultats concrets pour des clients exigeants.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
          {works.map((work, index) => (
            <WorkItem key={work.id} work={work} index={index} />
          ))}
        </div>
        
        <div className="mt-32 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-20 py-8 border border-[#C9A84C] text-[#C9A84C] font-black tracking-[0.4em] text-[10px] uppercase transition-all overflow-hidden"
          >
            <span className="relative z-10 group-hover:text-[#080808]">Voir tout sur Alhambra-web.com</span>
            <div className="absolute inset-0 bg-[#C9A84C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}

function WorkItem({ work, index }: { work: any; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay: index % 2 === 0 ? 0 : 0.2 }}
      className={`group cursor-none ${index % 2 !== 0 ? "md:mt-32" : ""}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#0f0f0f] border border-white/5">
        {/* Placeholder Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${work.gradient} opacity-20 group-hover:scale-110 transition-transform duration-1000 ease-out`} />
        
        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />

        {/* Info Overlay */}
        <div className="absolute inset-0 p-12 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/40 backdrop-blur-sm">
           <div className="flex justify-between items-end">
              <div className="translate-y-10 group-hover:translate-y-0 transition-transform duration-700 delay-100">
                <span className="text-[10px] font-mono tracking-[0.4em] text-[#C9A84C] uppercase mb-4 block">
                  {work.category} / {work.year}
                </span>
                <h3 className="text-4xl md:text-5xl font-display italic font-black text-white uppercase tracking-tighter">
                  {work.title}
                </h3>
              </div>
              <div className="translate-y-10 group-hover:translate-y-0 transition-transform duration-700 delay-200">
                <div className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center text-[#C9A84C] group-hover:bg-[#C9A84C] group-hover:text-black transition-colors duration-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </div>
           </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-between items-center px-2">
         <h3 className="text-xl font-display font-bold text-white/90 group-hover:text-[#C9A84C] transition-colors">{work.title}</h3>
         <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">{work.category}</span>
      </div>
    </motion.article>
  );
}
