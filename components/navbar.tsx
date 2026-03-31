"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "TRAVAUX", href: "#work" },
  { label: "SERVICES", href: "#services" },
  { label: "TARIFS", href: "#pricing" },
  { label: "CONTACT", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 px-6 md:px-12 py-8 md:py-10 ${
        scrolled ? "bg-[#080808]/80 backdrop-blur-xl border-b border-white/5 py-6 md:py-6" : "bg-transparent"
      }`}
    >
      <nav className="max-w-[1800px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="group text-2xl md:text-3xl font-display italic font-black tracking-tighter text-white uppercase flex items-center gap-1"
        >
          ALHAMBRA<span className="text-[#C9A84C] group-hover:rotate-45 transition-transform duration-500">.</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-16">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="relative text-[10px] font-mono font-bold tracking-[0.4em] text-white/40 hover:text-white transition-colors group overflow-hidden"
            >
              <span className="block group-hover:-translate-y-full transition-transform duration-500">{link.label}</span>
              <span className="absolute top-0 left-0 block translate-y-full group-hover:translate-y-0 text-[#C9A84C] transition-transform duration-500">{link.label}</span>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-10">
          <Link
            href="#contact"
            className="group relative px-10 py-4 border border-[#C9A84C]/40 hover:border-[#C9A84C] transition-all duration-500 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[#C9A84C] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />
            <span className="relative z-10 text-[10px] font-mono font-bold tracking-[0.4em] text-[#C9A84C] group-hover:text-[#080808] uppercase">
              LANCER UN PROJET
            </span>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden flex flex-col gap-2 p-2 relative z-50"
          aria-label="Toggle menu"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 10 } : { rotate: 0, y: 0 }}
            className="block w-8 h-[1px] bg-white transition-all"
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-8 h-[1px] bg-white transition-all"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -10 } : { rotate: 0, y: 0 }}
            className="block w-8 h-[1px] bg-white transition-all"
          />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 bg-[#080808] z-40 flex flex-col items-center justify-center gap-12 p-12 lg:hidden"
          >
            <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-[#C9A84C]/5 blur-[150px] pointer-events-none rounded-full" />
            
            {navLinks.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-5xl md:text-7xl font-display italic font-black text-white hover:text-[#C9A84C] transition-colors uppercase tracking-tighter"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-12"
            >
              <Link
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="px-12 py-6 bg-[#C9A84C] text-[#080808] text-sm font-black tracking-[0.4em] uppercase"
              >
                Lancer un projet
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
