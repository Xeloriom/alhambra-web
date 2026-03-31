"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const footerLinks = [
  {
    heading: "Services",
    links: ["Design Web", "Apps Mobiles", "Logiciels Sur Mesure", "Design UI/UX"],
  },
  {
    heading: "Entreprise",
    links: ["À Propos", "Travaux", "Tarifs", "Blog"],
  },
  {
    heading: "Légal",
    links: ["Politique de Confidentialité", "Conditions d'Utilisation", "Politique de Cookies"],
  },
];

export function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <footer ref={ref} className="bg-[#080808] pt-32 md:pt-48 pb-12 px-6 md:px-16 lg:px-24 overflow-hidden border-t border-white/5">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 lg:gap-32 mb-32">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="text-3xl md:text-4xl font-display italic font-black tracking-tighter text-white uppercase flex items-center gap-1 mb-10"
            >
              ALHAMBRA<span className="text-[#C9A84C]">.</span>
            </Link>
            <p className="text-white/30 text-lg leading-relaxed max-w-[280px] font-sans font-light">
              L&apos;excellence digitale sur mesure. Nous créons des expériences qui redéfinissent les standards du marché.
            </p>
            
            <div className="mt-12 flex items-center gap-6">
              {['TW', 'LI', 'IG', 'DB'].map((social) => (
                <a key={social} href="#" className="w-12 h-12 border border-white/5 rounded-full flex items-center justify-center text-[10px] font-mono text-white/30 hover:bg-[#C9A84C] hover:text-[#080808] hover:border-[#C9A84C] transition-all duration-500 uppercase">{social}</a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((group) => (
            <div key={group.heading} className="flex flex-col gap-10">
              <span className="text-[10px] font-mono tracking-[0.5em] text-[#C9A84C] uppercase">
                {group.heading} —
              </span>
              <ul className="flex flex-col gap-4">
                {group.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-lg font-display font-medium text-white/40 hover:text-white transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Huge Text Background effect */}
        <div className="relative py-20 overflow-hidden pointer-events-none">
           <motion.h2 
            initial={{ x: "20%" }}
            whileInView={{ x: "-20%" }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="text-[12rem] md:text-[25rem] font-display italic font-black text-white/[0.02] uppercase leading-none whitespace-nowrap"
           >
            ALHAMBRA STUDIO ALHAMBRA STUDIO
           </motion.h2>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
          <p className="text-[10px] font-mono tracking-[0.3em] text-white/20 uppercase">
            &copy; {new Date().getFullYear()} ALHAMBRA Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-12">
            <span className="text-[10px] font-mono tracking-[0.3em] text-white/20 uppercase">Paris / France</span>
            <span className="text-[10px] font-mono tracking-[0.3em] text-white/20 uppercase">Remote Worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
