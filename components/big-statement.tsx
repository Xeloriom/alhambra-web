"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function BigStatement({ data }: { data: any }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const words = "NOUS NE CRÉONS PAS DES SITES. NOUS CRÉONS DES EXPÉRIENCES QUI REDÉFINISSENT LES STANDARDS.".split(" ");

  return (
    <section ref={containerRef} className="relative min-h-screen py-32 md:py-64 flex flex-col items-center justify-center bg-[#080808] px-6 md:px-16 overflow-hidden">
      {/* Texture Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      
      <div className="max-w-6xl text-center z-10">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = (i + 1) / words.length;
            const opacity = useTransform(scrollYProgress, [start, end], [0.1, 1]);
            const y = useTransform(scrollYProgress, [start, end], [20, 0]);

            return (
              <motion.span
                key={i}
                style={{ opacity, y }}
                className="text-4xl md:text-8xl font-display italic font-black text-white uppercase tracking-tighter"
              >
                {word}
              </motion.span>
            );
          })}
        </div>
      </div>
      
      {/* Decorative large text background */}
      <motion.div
        style={{ x: useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]) }}
        className="absolute bottom-1/4 left-0 w-full whitespace-nowrap opacity-[0.02] pointer-events-none"
      >
        <span className="text-[20rem] font-display font-black text-[#C9A84C] uppercase italic">
          ALHAMBRA ALHAMBRA ALHAMBRA
        </span>
      </motion.div>
    </section>
  );
}
