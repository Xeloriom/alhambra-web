"use client";

import { motion } from "framer-motion";

const MarqueeItems = [
  "WEB DESIGN",
  "MOBILE APPS",
  "SAAS",
  "UI/UX",
  "PERFORMANCE",
  "CROISSANCE",
  "STRATÉGIE",
  "L'EXCELLENCE",
];

export function Marquee() {
  return (
    <div className="relative overflow-hidden bg-[#080808] border-y border-white/5 py-12 md:py-16">
      <div className="flex flex-nowrap overflow-hidden">
        <motion.div
          animate={{ x: "-50%" }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap"
        >
          {/* Duplicate for infinite effect */}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center">
              {MarqueeItems.map((item, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-4xl md:text-6xl lg:text-8xl font-display italic font-black text-white/10 uppercase tracking-tighter px-10 hover:text-[#C9A84C] transition-colors duration-500">
                    {item}
                  </span>
                  <span className="text-2xl text-[#C9A84C] opacity-50">★</span>
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
