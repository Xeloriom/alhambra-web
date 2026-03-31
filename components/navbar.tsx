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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled ? "nav-blur border-b border-[#d2d2d7] py-4" : "bg-transparent py-8 md:py-10"
      }`}
    >
      <nav className="max-w-[1120px] mx-auto flex items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl md:text-2xl font-extrabold tracking-tighter text-[#1d1d1f] uppercase flex items-center gap-1"
        >
          ALHAMBRA<span className="text-[#1d1d1f]">.</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[14px] font-medium text-[#1d1d1f] hover:text-[#6e6e73] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#contact"
            className="px-6 py-2 bg-[#1d1d1f] text-white rounded-full text-[14px] font-semibold hover:opacity-90 active:scale-95 transition-all shadow-md shadow-black/5"
          >
            LANCER UN PROJET
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-2 p-2 relative z-50"
          aria-label="Toggle menu"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 10, backgroundColor: "#1d1d1f" } : { rotate: 0, y: 0, backgroundColor: "#1d1d1f" }}
            className="block w-6 h-[1.5px] transition-all"
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1, backgroundColor: "#1d1d1f" }}
            className="block w-6 h-[1.5px] transition-all"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -10, backgroundColor: "#1d1d1f" } : { rotate: 0, y: 0, backgroundColor: "#1d1d1f" }}
            className="block w-6 h-[1.5px] transition-all"
          />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center gap-10 p-12 md:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-4xl font-bold text-[#1d1d1f] hover:text-[#6e6e73] transition-colors uppercase tracking-tight"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12 w-full"
            >
              <Link
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center px-12 py-5 bg-[#1d1d1f] text-white text-sm font-bold tracking-widest uppercase rounded-full"
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
