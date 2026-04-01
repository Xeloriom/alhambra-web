"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Works", "Services", "About", "Contact"];

  return (
      <>
        <nav className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-500 gpu ${
            isScrolled
                ? "bg-white/90 backdrop-blur-xl border-b border-[#EBEBEB] py-4 px-8"
                : "bg-transparent py-7 px-8"
        }`}>
          <div className="max-w-[1400px] mx-auto flex items-center justify-between">

            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2 group">
            <span className="text-[18px] font-semibold tracking-tight text-[#0A0A0A]" style={{ fontFamily: "var(--font-sans)" }}>
              Alhambra
            </span>
              <span
                  className="w-1.5 h-1.5 rounded-full bg-[#C8DBC9] group-hover:scale-150 transition-transform duration-300"
              />
            </Link>

            {/* CENTER NAV (desktop) */}
            <div className="hidden lg:flex items-center gap-1 bg-white/80 backdrop-blur-md px-2 py-2">
              {links.map((item) => (
                  <Link
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      className="px-5 py-2 rounded-full text-[13px] font-medium text-[#555] hover:text-black hover:bg-[#F5F5F5] transition-all duration-200"
                  >
                    {item}
                  </Link>
              ))}
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4">
            <span className="hidden md:flex items-center gap-2 text-[11px] text-[#9A9A9A] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8DBC9] animate-pulse" />
              Available 2025
            </span>
              <Link href="#contact" className="btn-pill text-[12px] px-6 py-3">
                Start a Project <span className="text-[14px]">→</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Overlay menu (mobile) */}
        <AnimatePresence>
          {menuOpen && (
              <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="fixed inset-0 z-[999] bg-white flex flex-col items-center justify-center gap-10"
              >
                <button onClick={() => setMenuOpen(false)} className="absolute top-8 right-8 text-2xl">✕</button>
                {links.map((item) => (
                    <Link
                        key={item}
                        href={`#${item.toLowerCase()}`}
                        onClick={() => setMenuOpen(false)}
                        className="text-5xl font-light tracking-tight hover:text-[#9A9A9A] transition-colors"
                        style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {item}
                    </Link>
                ))}
              </motion.div>
          )}
        </AnimatePresence>
      </>
  );
}