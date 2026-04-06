'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';

const basePath = process.env.NODE_ENV === 'production' ? '/alhambra-web' : '';

export function ContactSection() {
  const robot_image = `${basePath}/Group 4.png`;

  const textVariant = {
    initial: { y: 100, opacity: 0 },
    whileInView: { y: 0, opacity: 1 },
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
  };

  return (
      <section className="relative w-full bg-[#F8F8F8] px-16 py-48 font-haas min-h-screen flex items-center " id="contact">
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1.5 }}
            className="absolute right-[7%] top-[70%] -translate-y-1/2 w-[30%] h-full pointer-events-none z-1 will-change-transform"
        >
          <img src={robot_image} alt="Hive Unit" className="w-full h-auto object-contain transform scale-150" loading="lazy" />
        </motion.div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto grid grid-cols-12">
          <div className="col-span-12 lg:col-span-9 flex flex-col justify-center">
            <div className="mb-20">
              <h2 className="font-nordique text-[10vw] leading-[0.85] text-black tracking-tighter ">
                <div className="overflow-hidden inline-block w-full">
                  <motion.span variants={textVariant} initial="initial" whileInView="whileInView" className="block italic">Ne soyez</motion.span>
                </div>
                <div className="inline-block w-full">
                  <motion.span variants={textVariant} initial="initial" whileInView="whileInView" transition={{ ...textVariant.transition, delay: 0.1 } as any} className="block">pas timide</motion.span>
                </div>
              </h2>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="flex flex-wrap gap-8 items-center font-haas uppercase">
              <button className="relative group bg-black text-white px-10 py-3 rounded-full flex items-center gap-6 transition-all duration-500 hover:scale-[1.05]">
                <span className="text-[16px] font-bold tracking-widest">Discuter avec SoHub</span>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center transition-transform duration-300 group-hover:rotate-[15deg]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
              </button>

              <button className="relative group bg-[#E0E0E0] text-black px-10 py-3 rounded-full flex items-center gap-6 transition-all duration-500 hover:scale-[1.05]">
                <span className="text-[16px] font-bold tracking-widest">Prendre RDV</span>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center transition-transform duration-300 group-hover:rotate-[15deg]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
              </button>
            </motion.div>
          </div>
        </div>
      </section>
  );
}
