"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const PROJECTS = [
  {
    title: "EcoSphere Dashboard",
    category: "App Web",
    year: "2024",
    gradient: "linear-gradient(135deg, #e8e8ed 0%, #d2d2d7 50%, #c7c7cc 100%)"
  },
  {
    title: "Nova Mobile App",
    category: "App Mobile",
    year: "2024",
    gradient: "linear-gradient(135deg, #d2d2d7 0%, #c7c7cc 50%, #b8b8bd 100%)"
  },
  {
    title: "Quantum SaaS",
    category: "Logiciel",
    year: "2023",
    gradient: "linear-gradient(135deg, #c7c7cc 0%, #b8b8bd 50%, #aeaeb2 100%)"
  },
  {
    title: "Zenith Identity",
    category: "Branding",
    year: "2023",
    gradient: "linear-gradient(135deg, #e8e8ed 0%, #c7c7cc 100%)"
  }
];

export function WorksSection() {
  return (
    <section id="work" className="bg-[#f5f5f7] py-32 border-b border-[#d2d2d7]">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="mb-20">
          <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#86868b] block mb-4">
            Réalisations
          </span>
          <h2 className="text-[clamp(36px,5vw,64px)] font-bold text-[#1d1d1f] leading-tight mb-6">
            Nos <span className="italic font-serif">Travaux</span>
          </h2>
          <p className="text-[17px] text-[#6e6e73] max-w-[560px]">
            Une sélection de projets qui ont produit des résultats concrets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJECTS.map((project, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              className="bg-white rounded-[18px] border border-[#d2d2d7] overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
            >
              <div 
                className="h-60 md:h-72 w-full transition-transform duration-700 group-hover:scale-105"
                style={{ background: project.gradient }}
              >
                <div className="w-full h-full flex items-center justify-center opacity-20 group-hover:opacity-30 transition-opacity">
                  <svg width="60" height="60" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="1" fill="none" />
                    <rect x="35" y="35" width="30" height="30" stroke="white" strokeWidth="1" fill="none" transform="rotate(45 50 50)" />
                  </svg>
                </div>
              </div>
              
              <div className="p-8 md:p-10 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 bg-[#f5f5f7] border border-[#e8e8ed] text-[11px] font-bold text-[#6e6e73] rounded-full uppercase tracking-wider">
                    {project.category}
                  </span>
                  <span className="text-[13px] font-mono text-[#86868b]">{project.year}</span>
                </div>
                
                <h3 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
                  {project.title}
                </h3>
                
                <Link href="#" className="flex items-center gap-2 text-[14px] font-bold text-[#1d1d1f] group-hover:gap-4 transition-all">
                  Voir le Projet 
                  <span className="text-xl">→</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="#" className="inline-block px-10 py-4 border border-[#d2d2d7] text-[#1d1d1f] text-[14px] font-bold rounded-full transition-all hover:bg-[#1d1d1f] hover:text-white hover:border-[#1d1d1f]">
            VOIR TOUT SUR ALHAMBRA <span className="ml-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
