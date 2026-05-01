'use client';

import { motion } from 'framer-motion';

const basePath = process.env.NODE_ENV === 'production' ? '/alhambra-web' : '';
const EASE_POWER: [number,number,number,number] = [0.16, 1, 0.3, 1];

const floatingAnimation = {
  y: [0, -18, 0],
  rotate: [-1, 1, -1],
  transition: {
    duration: 6,
    ease: 'easeInOut',
    repeat: Infinity,
    repeatType: 'mirror' as const,
  },
};

interface HeroMediaProps {
  ready: boolean;
}

export function HeroMedia({ ready }: HeroMediaProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 60 }}
      animate={ready ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 1.8, ease: EASE_POWER, delay: 0.35 }}
      className="absolute left-1/2 -translate-x-1/2 top-[50%] -translate-y-[52%] z-20 w-[22vw] max-w-[360px] pointer-events-none will-change-transform"
    >
      <motion.img
        src={`${basePath}/image%201.png`}
        alt="Robot Alhambra"
        className="w-full h-auto drop-shadow-2xl"
        animate={floatingAnimation}
        loading="eager"
      />
    </motion.div>
  );
}
