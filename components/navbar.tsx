"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { TextScramble } from "@/components/text-scramble";
import { MagneticButton } from "@/components/magnetic-button";

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
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-4 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-12`}
    >
      <nav
        className={`flex items-center justify-between rounded-3xl border px-8 py-4 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl border-black/10 shadow-2xl shadow-black/5"
            : "bg-transparent border-transparent"
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="text-[#000000] font-black text-2xl tracking-tighter"
        >
          ALHAMBRA<span className="text-[#FF4D00]">.</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              data-cursor-hover
              className="text-[10px] font-black tracking-[0.4em] text-[#000000] hover:text-[#FF4D00] transition-colors"
            >
              <TextScramble text={link.label} />
            </Link>
          ))}
        </div>

        {/* CTA */}
        <MagneticButton strength={0.3} className="hidden md:block">
          <Link
            href="#contact"
            data-cursor-hover
            className="inline-flex items-center gap-3 bg-black text-white text-[10px] font-black tracking-[0.4em] px-8 py-4 rounded-full hover:bg-[#FF4D00] transition-colors shadow-xl shadow-black/10"
          >
            <TextScramble text="LANCER UN PROJET" />
          </Link>
        </MagneticButton>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-2 p-2"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-black transition-all ${menuOpen ? "rotate-45 translate-y-2.5" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-black transition-all ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-black transition-all ${menuOpen ? "-rotate-45 -translate-y-2.5" : ""}`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 bg-white border border-black/10 rounded-3xl p-10 flex flex-col gap-8 shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-lg font-black tracking-[0.2em] text-black hover:text-[#FF4D00] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="inline-flex items-center justify-center bg-black text-white text-xs font-black tracking-[0.3em] px-8 py-5 rounded-full hover:bg-[#FF4D00] transition-colors"
          >
            LANCER UN PROJET
          </Link>
        </div>
      )}
      <div className="hidden">alhambra-web.com</div>
    </header>
  );
}
