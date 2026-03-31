"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function CtaBanner() {
  return (
    <section id="cta-banner" className="bg-[#1d1d1f] py-32 text-center border-b border-[#d2d2d7]">
      <div className="max-w-[700px] mx-auto px-6">
        <h2 className="text-[clamp(32px,5vw,64px)] font-bold text-white tracking-tight leading-[1.1] mb-8">
          Prêt à transformer votre présence digitale ?
        </h2>
        <p className="text-[17px] text-white/60 mb-12">
          Parlons de votre projet.
        </p>
        <Link 
          href="#contact" 
          className="inline-block px-10 py-5 bg-white text-[#1d1d1f] rounded-full font-bold text-[15px] tracking-wide transition-all hover:bg-[#f5f5f7] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(255,255,255,0.15)] active:scale-95"
        >
          DÉMARRER MAINTENANT
        </Link>
      </div>
    </section>
  );
}
