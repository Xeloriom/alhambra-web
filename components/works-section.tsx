"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const PROJECTS = [
  {
    id: "01",
    title: "EcoSphere Dashboard",
    category: "App Web",
    year: "2024",
    gradient: "linear-gradient(135deg, #0a4a3a 0%, #0d6b52 50%, #1a9970 100%)"
  },
  {
    id: "02",
    title: "Nova Mobile App",
    category: "App Mobile",
    year: "2024",
    gradient: "linear-gradient(135deg, #1a0a4a 0%, #2d1070 50%, #4a1fa0 100%)"
  },
  {
    id: "03",
    title: "Quantum SaaS",
    category: "Logiciel",
    year: "2023",
    gradient: "linear-gradient(135deg, #4a2000 0%, #7a3500 50%, #c95a00 100%)"
  },
  {
    id: "04",
    title: "Zenith Identity",
    category: "Branding",
    year: "2023",
    gradient: "linear-gradient(135deg, #0a0a2a 0%, #1a1a4a 50%, #2a2a6a 100%)"
  }
];

export function WorksSection() {
  return (
    <section id="work" className="bg-[#0a0a0a] py-32 border-b border-white/10">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="mb-20">
          <span className="text-[12px] font-mono uppercase tracking-[0.2em] text-[#C9A84C] block mb-4">
            Réalisations
          </span>
          <h2 className="text-[clamp(36px,5vw,64px)] font-bold text-white leading-[0.9] tracking-[-0.04em] mb-6">
            Nos <span className="italic">Travaux</span>
          </h2>
          <p className="text-[17px] text-[#888888] max-w-[560px]">
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
              className="bg-[#111111] rounded-[18px] border border-white/10 overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div 
                className="relative h-60 md:h-72 w-full transition-transform duration-700 group-hover:scale-105 overflow-hidden"
                style={{ background: project.gradient }}
              >
                {/* Background Number Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-[120px] font-black text-white/5 font-mono select-none">
                    {project.id}
                  </span>
                </div>
                
                {/* Dark Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                
                <div className="w-full h-full flex items-center justify-center opacity-20 group-hover:opacity-30 transition-opacity">
                  <svg width="60" height="60" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="1" fill="none" />
                    <rect x="35" y="35" width="30" height="30" stroke="white" strokeWidth="1" fill="none" transform="rotate(45 50 50)" />
                  </svg>
                </div>
              </div>
              
              <div className="p-8 md:p-10 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 bg-white/5 border border-white/10 text-[11px] font-bold text-[#888888] rounded-full uppercase tracking-wider">
                    {project.category}
                  </span>
                  <span className="text-[13px] font-mono text-[#555555]">{project.year}</span>
                </div>
                
                <h3 className="text-2xl font-semibold text-white tracking-tight">
                  {project.title}
                </h3>
                
                <Link 
                  href="#" 
                  data-cursor="hover"
                  className="flex items-center gap-2 text-[14px] font-bold text-white group-hover:gap-6 transition-all duration-300"
                >
                  Voir le Projet 
                  <span className="text-xl text-[#C9A84C]">→</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link 
            href="#" 
            data-cursor="hover"
            className="inline-block px-10 py-4 border border-white/10 text-white text-[14px] font-bold rounded-full transition-all hover:bg-[#C9A84C] hover:text-[#0a0a0a] hover:border-[#C9A84C]"
          >
            VOIR TOUT SUR ALHAMBRA <span className="ml-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
