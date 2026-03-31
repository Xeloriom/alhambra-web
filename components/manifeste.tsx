"use client";

import { motion } from "framer-motion";

export function Manifeste() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const lineVariants = {
    hidden: { clipPath: "inset(0 0 100% 0)", opacity: 0 },
    visible: { 
      clipPath: "inset(0 0 0% 0)", 
      opacity: 1,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as any }
    }
  };

  return (
    <section id="manifeste" className="bg-[#1d1d1f] py-40 border-b border-white/10 relative overflow-hidden">
      {/* Decorative quotes */}
      <div className="absolute top-20 left-10 md:left-20 text-[180px] font-mono font-black text-white/5 pointer-events-none select-none">“</div>
      <div className="absolute bottom-20 right-10 md:right-20 text-[180px] font-mono font-black text-white/5 pointer-events-none select-none">”</div>
      
      <div className="max-w-[1120px] mx-auto px-6 text-center relative z-10">
        <div className="w-full h-[1px] bg-white/10 mb-20" />
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <motion.h2 
            variants={lineVariants}
            className="text-[clamp(28px,4vw,56px)] font-bold text-white tracking-tight leading-[1.15] mb-4"
          >
            &quot;NOUS NE CRÉONS PAS SEULEMENT DES SITES WEB.
          </motion.h2>
          <motion.h2 
            variants={lineVariants}
            className="text-[clamp(28px,4vw,56px)] font-bold text-white tracking-tight leading-[1.15] mb-4"
          >
            NOUS CRÉONS DES EXPÉRIENCES QUI GÉNÈRENT DE LA CROISSANCE
          </motion.h2>
          <motion.h2 
            variants={lineVariants}
            className="text-[clamp(28px,4vw,56px)] font-bold text-white tracking-tight leading-[1.15] mb-8"
          >
            ET REDÉFINISSENT LES STANDARDS DE VOTRE INDUSTRIE.&quot;
          </motion.h2>
          
          <motion.p 
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { delay: 0.8, duration: 0.6 } }
            } as any}
            className="text-[17px] text-white/60 max-w-[560px] mx-auto"
          >
            Depuis 2017, nous aidons les marques ambitieuses à se démarquer.
          </motion.p>
        </motion.div>

        <div className="w-full h-[1px] bg-white/10 mt-20" />
      </div>
    </section>
  );
}
