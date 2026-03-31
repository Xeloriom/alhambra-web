"use client";

import { motion } from "framer-motion";

const LOGOS = ["STRIPE", "NOTION", "FIGMA", "SLACK", "SPOTIFY", "AIRBNB"];

export function Marquee() {
  return (
    <section id="marquee" className="bg-[#f5f5f7] py-8 border-y border-[#d2d2d7] overflow-hidden">
      <div className="mb-5 text-center">
        <span className="text-[12px] font-medium uppercase tracking-[0.06em] text-[#86868b]">
          Trusted by industry leaders
        </span>
      </div>
      
      <div className="relative flex overflow-hidden">
        {/* Masking for fade effect */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#f5f5f7] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#f5f5f7] to-transparent z-10" />
        
        <motion.div 
          className="flex whitespace-nowrap gap-16 items-center px-16"
          animate={{ x: [0, -1032] }} // Adjust based on content width
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          {[...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS].map((logo, i) => (
            <div key={i} className="flex items-center gap-16">
              <span className="text-[15px] font-semibold text-[#86868b] tracking-[0.08em]">
                {logo}
              </span>
              <span className="text-[#d2d2d7]">·</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
