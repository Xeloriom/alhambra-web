"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function HeroSection({ data, onUpdate, isEditing }: { data: any, onUpdate?: (path: string, value: any) => void, isEditing?: boolean }) {
  const revealProps = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as any },
  };

  return (
    <section className="relative min-h-screen pt-40 pb-32 md:pt-64 md:pb-48 bg-white flex flex-col items-center justify-center text-center px-6 border-b border-[#d2d2d7]">
      <div className="max-w-[1120px] mx-auto w-full">
        {/* Label */}
        <motion.span 
          {...revealProps}
          transition={{ ...revealProps.transition, delay: 0.2 }}
          className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#6e6e73] mb-8 block"
        >
          AGENCE DIGITALE — EST. 2017
        </motion.span>

        {/* Hero Title */}
        <h1 className="text-[clamp(64px,10vw,140px)] font-extrabold text-[#1d1d1f] leading-[1.05] tracking-[-0.03em] mb-12">
          <motion.span 
            {...revealProps}
            transition={{ ...revealProps.transition, delay: 0.4 }}
            className="block"
          >
            L&apos;Excellence
          </motion.span>
          <motion.span 
            {...revealProps}
            transition={{ ...revealProps.transition, delay: 0.6 }}
            className="block"
          >
            Digitale
          </motion.span>
        </h1>

        {/* Hero Subtitle */}
        <motion.p 
          {...revealProps}
          transition={{ ...revealProps.transition, delay: 0.8 }}
          className="text-[17px] md:text-xl text-[#6e6e73] leading-[1.7] max-w-[560px] mx-auto mb-16"
        >
          Web, mobile & software conçus pour la performance et la croissance.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          {...revealProps}
          transition={{ ...revealProps.transition, delay: 1 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6"
        >
          <Link href="#work" className="px-10 py-4 bg-[#1d1d1f] text-white rounded-full font-semibold transition-all hover:opacity-90 active:scale-95 shadow-md">
            VOIR NOS PROJETS
          </Link>
          <Link href="#contact" className="px-10 py-4 border border-[#1d1d1f] text-[#1d1d1f] rounded-full font-semibold transition-all hover:bg-[#f5f5f7] active:scale-95">
            NOUS CONTACTER
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
