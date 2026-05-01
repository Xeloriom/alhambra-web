'use client';

import { motion } from 'framer-motion';

const EASE_POWER: [number,number,number,number] = [0.16, 1, 0.3, 1];

interface HeroTaglineProps {
  ready: boolean;
}

export function HeroTagline({ ready }: HeroTaglineProps) {
  return (
    <>
      {/* Accroche bas-gauche */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={ready ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1.2, ease: EASE_POWER, delay: 0.55 }}
        className="absolute left-10 bottom-[13%] z-20"
      >
        <p className="font-haas text-[1.5vw] leading-[1.3] text-black font-medium">
          Votre vision.<br />
          <span className="text-black/40">Notre obsession.</span>
        </p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 0.4 } : {}}
        transition={{ duration: 1, ease: EASE_POWER, delay: 1.1 }}
        className="absolute left-10 bottom-8 z-20 flex items-center gap-3"
      >
        {/* Barre animée */}
        <div className="w-6 h-[1px] bg-black overflow-hidden">
          <motion.div
            className="h-full bg-black/60 w-full"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.8, ease: 'linear', repeat: Infinity }}
          />
        </div>
        <span className="font-haas text-[10px] font-bold tracking-[0.3em] text-black uppercase">
          Scroll
        </span>
      </motion.div>

      {/* Badge disponibilité — coin bas-droit */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={ready ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1, ease: EASE_POWER, delay: 0.8 }}
        className="absolute right-10 bottom-8 z-20 flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 block animate-pulse" />
        <span className="font-haas text-[10px] font-bold tracking-[0.25em] text-black/50 uppercase">
          Disponible — 2025
        </span>
      </motion.div>
    </>
  );
}
