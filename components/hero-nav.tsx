'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const basePath = process.env.NODE_ENV === 'production' ? '/alhambra-web' : '';

const NAV_LINKS = [
  { label: 'Projets',  href: '#work'     },
  { label: 'Agence',   href: '#about'    },
  { label: 'Services', href: '#services' },
  { label: 'Contact',  href: '#contact'  },
];

const EASE_POWER: [number,number,number,number] = [0.16, 1, 0.3, 1];

interface HeroNavProps {
  ready: boolean;
  onPanelOpen: () => void;
}

export function HeroNav({ ready, onPanelOpen }: HeroNavProps) {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-8">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: EASE_POWER, delay: 0.1 }}
        className="relative w-[130px] h-[38px]"
      >
        <Image
          src={`${basePath}/logo.svg`}
          alt="Alhambra"
          fill
          className="object-contain"
          priority
        />
      </motion.div>

      {/* Liens centraux */}
      <motion.div
        className="hidden lg:flex items-center gap-8"
        initial={{ opacity: 0, y: -12 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: EASE_POWER, delay: 0.2 }}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-[12px] font-haas font-bold tracking-[0.2em] text-black/50 uppercase hover:text-black transition-colors duration-300"
          >
            {link.label}
          </a>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: -12 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: EASE_POWER, delay: 0.3 }}
        onClick={onPanelOpen}
        className="group flex items-center gap-3 bg-black text-white pl-6 pr-2 py-2 rounded-full hover:scale-[1.03] transition-transform duration-500"
      >
        <span className="text-[11px] font-haas font-bold tracking-[0.2em] uppercase">Démarrer</span>
        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center group-hover:rotate-[20deg] transition-transform duration-500">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </motion.button>
    </nav>
  );
}
