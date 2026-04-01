"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full h-20 px-12 flex items-center justify-between z-[1000] transition-all duration-500 ${isScrolled ? "nav-glass" : "bg-transparent"}`}>
      <Link href="/" className="text-xl font-bold tracking-tighter text-black mix-blend-difference">
        ALHAMBRAWeb<span className="text-black">.</span>
      </Link>
      
      <div className="hidden md:flex gap-12">
        {["Works", "Expertise", "Studio"].map((item) => (
          <Link key={item} href={`#${item.toLowerCase()}`} className="label-mono text-[9px] text-black hover:opacity-50 transition-opacity">
            {item}
          </Link>
        ))}
      </div>

      <Link 
        href="#contact" 
        className="px-6 py-2 bg-black text-white rounded-full text-[10px] font-bold tracking-widest uppercase hover:scale-105 transition-all"
      >
        Lancer un projet
      </Link>
    </nav>
  );
}
