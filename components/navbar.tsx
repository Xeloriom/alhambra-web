"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
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
        className={`fixed top-0 left-0 right-0 h-16 z-[1000] transition-all flex items-center justify-between px-6 md:px-12 backdrop-blur-[20px] saturate-[180%] ${
          isScrolled ? "bg-white/85 border-b border-[#d2d2d7]" : "bg-transparent"
        }`}
      >
        {/* Left: Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight text-[#1d1d1f]">
          ALHAMBRAWeb<span className="text-[#1d1d1f]">.</span>
        </Link>

        {/* Center: Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-[14px] font-medium text-[#1d1d1f] hover:text-[#6e6e73] transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Desktop CTA & Mobile Burger */}
        <div className="flex items-center gap-6">
          <Link 
            href="#contact" 
            className="hidden md:block px-5 py-2.5 bg-[#1d1d1f] text-white text-[13px] font-medium rounded-full tracking-wide hover:bg-[#333333] transition-colors"
          >
            LANCER UN PROJET
          </Link>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex flex-col gap-[5px] w-[22px]"
          >
            <motion.span 
              animate={isMobileMenuOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
              className="w-full h-[1.5px] bg-[#1d1d1f] block" 
            />
            <motion.span 
              animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-full h-[1.5px] bg-[#1d1d1f] block" 
            />
            <motion.span 
              animate={isMobileMenuOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
              className="w-full h-[1.5px] bg-[#1d1d1f] block" 
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-white z-[999] flex flex-col items-center justify-center pt-16"
          >
            <div className="flex flex-col items-center gap-0 w-full px-6">
              {navLinks.map((link, i) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-8 border-b border-[#e8e8ed] text-[32px] font-bold text-[#1d1d1f] last:border-0"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
