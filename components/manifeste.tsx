"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export function Manifeste() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lines = entry.target.querySelectorAll('h2');
          lines.forEach((line, i) => {
            setTimeout(() => {
              (line as HTMLElement).style.transition = 'clip-path 0.9s cubic-bezier(0.16,1,0.3,1), opacity 0.4s';
              (line as HTMLElement).style.clipPath = 'inset(0 0 0% 0)';
              (line as HTMLElement).style.opacity = '1';
            }, i * 200);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="manifeste" 
      className="bg-[#1d1d1f] py-40 border-b border-white/10 relative overflow-hidden"
    >
      {/* Decorative quotes */}
      <div className="absolute top-20 left-10 md:left-20 text-[180px] font-mono font-black text-white/5 pointer-events-none select-none">“</div>
      <div className="absolute bottom-20 right-10 md:right-20 text-[180px] font-mono font-black text-white/5 pointer-events-none select-none">”</div>
      
      <div className="max-w-[1120px] mx-auto px-6 text-center relative z-10">
        <div className="w-full h-[1px] bg-white/10 mb-20" />
        
        <div className="space-y-4">
          <h2 
            className="text-[clamp(28px,4vw,56px)] font-bold text-white tracking-tight leading-[1.15] opacity-0"
            style={{ clipPath: "inset(0 0 100% 0)" }}
          >
            &quot;NOUS NE CRÉONS PAS SEULEMENT DES SITES WEB.
          </h2>
          <h2 
            className="text-[clamp(28px,4vw,56px)] font-bold text-white tracking-tight leading-[1.15] opacity-0"
            style={{ clipPath: "inset(0 0 100% 0)" }}
          >
            NOUS CRÉONS DES EXPÉRIENCES QUI GÉNÈRENT DE LA CROISSANCE
          </h2>
          <h2 
            className="text-[clamp(28px,4vw,56px)] font-bold text-white tracking-tight leading-[1.15] mb-8 opacity-0"
            style={{ clipPath: "inset(0 0 100% 0)" }}
          >
            ET REDÉFINISSENT LES STANDARDS DE VOTRE INDUSTRIE.&quot;
          </h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-[17px] text-white/60 max-w-[560px] mx-auto pt-8"
          >
            Depuis 2017, nous aidons les marques ambitieuses à se démarquer.
          </motion.p>
        </div>

        <div className="w-full h-[1px] bg-white/10 mt-20" />
      </div>
    </section>
  );
}
