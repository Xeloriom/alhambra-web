"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";

export function HeroSection({ data, onUpdate, isEditing }: { data: any, onUpdate?: (path: string, value: any) => void, isEditing?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;
      const spacing = 40;
      
      for (let x = 0; x < canvas.width; x += spacing) {
        for (let y = 0; y < canvas.height; y += spacing) {
          const moveX = Math.sin(x * 0.01 + time) * 3;
          const moveY = Math.cos(y * 0.01 + time) * 3;
          
          ctx.beginPath();
          ctx.arc(x + moveX, y + moveY, 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 0, 0, ${0.05 + Math.sin(time + x * 0.005) * 0.05})`;
          ctx.fill();
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const revealProps = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as any },
  };

  return (
    <section className="relative min-h-screen pt-40 pb-32 md:pt-64 md:pb-48 bg-white flex flex-col items-center justify-center text-center px-6 border-b border-[#d2d2d7] overflow-hidden">
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />
      
      <div className="max-w-[1120px] mx-auto w-full relative z-10">
        {/* Label */}
        <motion.span 
          {...revealProps}
          transition={{ ...revealProps.transition, delay: 0.2 }}
          className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#6e6e73] mb-8 block"
        >
          AGENCE DIGITALE — EST. 2017
        </motion.span>

        {/* Hero Title */}
        <h1 className="text-[clamp(64px,10vw,140px)] font-extrabold text-[#1d1d1f] leading-[1.05] tracking-[-0.03em] mb-12">
          <span className="inline-block overflow-hidden pb-2">
            <motion.span 
              initial={{ y: "120%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="block"
            >
              L&apos;Excellence
            </motion.span>
          </span>
          <br />
          <span className="inline-block overflow-hidden pb-2">
            <motion.span 
              initial={{ y: "120%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
              className="block italic font-serif"
            >
              Digitale
            </motion.span>
          </span>
        </h1>

        {/* Hero Subtitle */}
        <motion.p 
          {...revealProps}
          transition={{ ...revealProps.transition, delay: 0.8 }}
          className="text-[17px] md:text-xl text-[#6e6e73] leading-[1.7] max-w-[560px] mx-auto mb-16"
        >
          Web, mobile & software conçus pour la performance et la croissance.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          {...revealProps}
          transition={{ ...revealProps.transition, delay: 1 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6"
        >
          <Link href="#work" className="px-10 py-4 bg-[#1d1d1f] text-white rounded-full font-semibold transition-all hover:opacity-90 active:scale-95 shadow-md">
            VOIR NOS PROJETS
          </Link>
          <Link href="#contact" className="px-10 py-4 border border-[#1d1d1f] text-[#1d1d1f] rounded-full font-semibold transition-all hover:bg-[#f5f5f7] active:scale-95">
            NOUS CONTACTER
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
