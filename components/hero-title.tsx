'use client';

import { motion } from 'framer-motion';

const EASE_POWER: [number,number,number,number] = [0.16, 1, 0.3, 1];

const TITLE = 'AW'; // Alhambra Web — initiales en grand

interface HeroTitleProps {
  ready: boolean;
}

export function HeroTitle({ ready }: HeroTitleProps) {
  const letters = TITLE.split('');

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <motion.div
        className="flex"
        initial="hidden"
        animate={ready ? 'visible' : 'hidden'}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } }
        }}
      >
        {letters.map((char, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { y: '105%', opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: { duration: 1.6, ease: EASE_POWER }
              }
            }}
            className="font-nordique text-[28vw] leading-none text-black select-none inline-block"
            style={{ letterSpacing: '-0.04em' }}
          >
            {char}
          </motion.span>
        ))}
      </motion.div>

      {/* Sous-titre raffiné */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={ready ? { opacity: 0.45, y: 0 } : {}}
        transition={{ duration: 1.2, ease: EASE_POWER, delay: 0.7 }}
        className="absolute bottom-[14%] right-[8%] font-haas text-[1.1vw] text-black tracking-[0.18em] uppercase text-right"
      >
        Studio Créatif & Digital<br />
        <span className="opacity-60">Paris — France</span>
      </motion.p>
    </div>
  );
}
