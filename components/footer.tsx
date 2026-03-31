"use client";

import Link from "next/link";
import { motion } from "framer-motion";

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
  return (
    <footer className="bg-[#f5f5f7] pt-32 pb-16 px-6 border-t border-[#d2d2d7]">
      <div className="max-w-[1120px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 lg:gap-32 mb-24">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="text-xl md:text-2xl font-extrabold tracking-tighter text-[#1d1d1f] uppercase flex items-center gap-1 mb-8"
            >
              ALHAMBRA<span className="text-[#1d1d1f]">.</span>
            </Link>
            <p className="text-[#6e6e73] text-[17px] leading-relaxed max-w-[280px] mb-12">
              L&apos;excellence digitale sur mesure. Nous créons des expériences qui redéfinissent les standards du marché.
            </p>
            
            <div className="flex items-center gap-6">
              {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                <a key={social} href="#" className="text-[#6e6e73] hover:text-[#1d1d1f] transition-colors">
                  <span className="sr-only">{social}</span>
                  <div className="w-10 h-10 border border-[#d2d2d7] rounded-full flex items-center justify-center bg-white shadow-sm hover:shadow-md transition-shadow">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                       <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((group) => (
            <div key={group.heading} className="flex flex-col gap-8">
              <span className="text-[12px] font-bold tracking-[0.08em] text-[#1d1d1f] uppercase">
                {group.heading}
              </span>
              <ul className="flex flex-col gap-4">
                {group.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-[14px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-[#d2d2d7] flex flex-col md:flex-row items-center justify-between gap-10">
          <p className="text-[13px] text-[#86868b] font-medium">
            Copyright &copy; {new Date().getFullYear()} ALHAMBRA Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-12">
            <span className="text-[13px] text-[#86868b] font-medium">Paris / France</span>
            <span className="text-[13px] text-[#86868b] font-medium">Remote Worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
