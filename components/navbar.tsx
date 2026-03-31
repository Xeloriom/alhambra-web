"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "TRAVAUX", href: "#work" },
    { name: "SERVICES", href: "#services" },
    { name: "TARIFS", href: "#pricing" },
    { name: "CONTACT", href: "#contact" },
  ];

  return (
    <>
      <nav 
        id="navbar" 
        className={`fixed top-0 left-0 right-0 h-20 z-[1000] transition-all duration-500 flex items-center justify-between px-6 md:px-12 ${
          isScrolled 
            ? "bg-[#0a0a0a]/85 backdrop-blur-[20px] saturate-[180%] border-b border-[#C9A84C]/15 h-16" 
            : "bg-transparent h-24"
        }`}
      >
        {/* Left: Logo */}
        <Link 
          href="/" 
          data-cursor="hover"
          className={`text-2xl font-black tracking-tighter transition-colors duration-300 ${isScrolled ? "text-white" : "text-white"}`}
        >
          ALHAMBRA<span className="text-[#C9A84C]">.</span>
        </Link>

        {/* Center: Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map(link => (
            <Link 
              key={link.name} 
              href={link.href} 
              data-cursor="hover"
              className="text-[11px] font-bold tracking-[0.2em] text-white/70 hover:text-[#C9A84C] transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Desktop CTA & Mobile Burger */}
        <div className="flex items-center gap-6">
          <Link 
            href="#contact" 
            data-cursor="hover"
            className="hidden md:block px-6 py-2.5 bg-[#C9A84C] text-[#0a0a0a] text-[12px] font-bold rounded-full tracking-wider hover:scale-105 active:scale-95 transition-all"
          >
            LANCER UN PROJET
          </Link>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex flex-col gap-[6px] w-[24px]"
            aria-label="Toggle Menu"
          >
            <motion.span 
              animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="w-full h-[2px] bg-white block rounded-full" 
            />
            <motion.span 
              animate={isMobileMenuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
              className="w-full h-[2px] bg-[#C9A84C] block rounded-full" 
            />
            <motion.span 
              animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="w-full h-[2px] bg-white block rounded-full" 
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-[#0a0a0a] z-[999] flex flex-col items-center justify-center pt-20"
          >
            <div className="flex flex-col items-center gap-2 w-full px-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="w-full"
                >
                  <Link 
                    href={link.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-6 border-b border-white/5 text-[42px] font-black text-white hover:text-[#C9A84C] transition-colors block"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12"
              >
                <Link 
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-10 py-4 bg-[#C9A84C] text-[#0a0a0a] rounded-full font-bold text-lg"
                >
                  CONTACTER L'AGENCE
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
