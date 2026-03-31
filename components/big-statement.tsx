"use client";

import { motion } from "framer-motion";

export function BigStatement({ data }: { data: any }) {
  const words = "Nous ne créons pas seulement des sites web. Nous créons des expériences qui génèrent de la croissance.".split(" ");

  return (
    <section className="relative min-h-[100vh] py-48 md:py-64 flex flex-col items-center justify-center bg-[#1d1d1f] text-white px-6 overflow-hidden">
      <div className="max-w-[1120px] mx-auto text-center z-10">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 md:gap-y-6">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: i * 0.03, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-[clamp(32px,6vw,72px)] font-bold uppercase tracking-tighter leading-none"
            >
              {word}
            </motion.span>
          ))}
        </div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-24 text-[17px] md:text-xl text-white/40 tracking-[0.2em] font-semibold uppercase max-w-sm mx-auto"
        >
          Depuis 2017, nous aidons les marques ambitieuses à redéfinir leur futur digital.
        </motion.p>
      </div>
      
      {/* Decorative large text background effect */}
      <div className="absolute top-1/2 left-0 w-full whitespace-nowrap opacity-[0.03] pointer-events-none transform -translate-y-1/2 select-none">
        <span className="text-[25rem] font-extrabold text-white uppercase italic">
          ALHAMBRA ALHAMBRA ALHAMBRA
        </span>
      </div>
    </section>
  );
}
