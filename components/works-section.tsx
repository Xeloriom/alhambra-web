"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const works = [
  {
    id: "01",
    title: "EcoSphere Dashboard",
    category: "App Web",
    year: "2024",
    gradient: "linear-gradient(135deg, #e0e0e0 0%, #f0f0f0 100%)",
  },
  {
    id: "02",
    title: "Nova Mobile App",
    category: "App Mobile",
    year: "2024",
    gradient: "linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)",
  },
  {
    id: "03",
    title: "Quantum SaaS",
    category: "Logiciel",
    year: "2023",
    gradient: "linear-gradient(135deg, #e8e8e8 0%, #f8f8f8 100%)",
  },
  {
    id: "04",
    title: "Zenith Identity",
    category: "Branding",
    year: "2023",
    gradient: "linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%)",
  },
];

export function WorksSection() {
  return (
    <section id="work" className="py-48 md:py-64 bg-white px-6 border-b border-[#d2d2d7]">
      <div className="max-w-[1120px] mx-auto text-center mb-32">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#6e6e73] mb-8 block"
        >
          NOS RÉALISATIONS —
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-[clamp(48px,5vw,80px)] font-bold text-[#1d1d1f] tracking-tight mb-12"
        >
          Projets d&apos;Exception
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-xl text-[#6e6e73] leading-relaxed max-w-[700px] mx-auto"
        >
          Une sélection de nos travaux les plus impactants, conçus pour la performance et l&apos;esthétique.
        </motion.p>
      </div>

      <div className="max-w-[1120px] mx-auto grid grid-cols-1 gap-24">
        {works.map((work, index) => (
          <motion.div
            key={work.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`grid grid-cols-1 md:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
          >
            <div className="relative aspect-video rounded-[18px] overflow-hidden group">
              <div 
                className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ background: work.gradient }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-[#1d1d1f]/20 text-6xl font-bold">
                {work.title}
              </div>
            </div>
            
            <div className="text-left">
              <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#6e6e73] mb-4 block">
                {work.category} / {work.year}
              </span>
              <h3 className="text-[clamp(28px,3vw,48px)] font-bold text-[#1d1d1f] leading-tight mb-8">
                {work.title}
              </h3>
              <Link href="#" className="text-[17px] text-[#1d1d1f] font-medium group flex items-center gap-2 hover:text-[#6e6e73] transition-colors">
                Voir le projet 
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 transition-transform">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
