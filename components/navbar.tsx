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
      className={`fixed top-2 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8`}
    >
      <nav
        className={`flex items-center justify-between rounded-2xl border px-6 py-3 transition-all duration-300 ${
          scrolled
            ? "bg-[#F9F9F9]/90 backdrop-blur-md border-black/10 shadow-sm"
            : "bg-transparent border-transparent"
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="text-[#000000] font-black text-xl tracking-tighter"
        >
          ALHAMBRA<span className="text-[#FF4D00]">.</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              data-cursor-hover
              className="text-xs font-semibold tracking-widest text-[#000000] hover:text-[#FF4D00] transition-colors"
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
            className="inline-flex items-center gap-2 bg-[#000000] text-[#F9F9F9] text-xs font-bold tracking-widest px-5 py-2.5 rounded-full hover:bg-[#FF4D00] transition-colors"
          >
            <TextScramble text="LANCER UN PROJET" />
          </Link>
        </MagneticButton>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-black transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-black transition-all ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-black transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden mt-2 bg-[#F9F9F9] border border-black/10 rounded-2xl p-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-bold tracking-widest text-black hover:text-[#FF4D00] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="inline-flex items-center justify-center bg-black text-white text-xs font-bold tracking-widest px-5 py-3 rounded-full hover:bg-[#FF4D00] transition-colors"
          >
            LANCER UN PROJET
          </Link>
        </div>
      )}
      <div className="hidden">alhambra-web.com</div>
    </header>
  );
}
