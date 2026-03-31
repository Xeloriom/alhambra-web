"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

export function HeroSection({ data }: { data: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInView = useInView(containerRef, { once: true });
  
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityFade = useTransform(scrollY, [0, 300], [1, 0]);

  // Canvas Particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 60;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 1.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = canvas!.width;
        if (this.x > canvas!.width) this.x = 0;
        if (this.y < 0) this.y = canvas!.height;
        if (this.y > canvas!.height) this.y = 0;
      }

      draw() {
        ctx!.fillStyle = "rgba(201, 168, 76, 0.4)";
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: particleCount }, () => new Particle());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        p.update();
        p.draw();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.strokeStyle = `rgba(201, 168, 76, ${0.1 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    window.addEventListener("resize", init);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", init);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#080808]">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40" />
      
      {/* Editorial Content */}
      <div className="relative z-10 px-6 md:px-16 lg:px-24 pt-20">
        <motion.div 
          style={{ y: yParallax, opacity: opacityFade }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex items-center gap-4 mb-10"
          >
            <span className="w-12 h-[1px] bg-[#C9A84C]" />
            <span className="text-[10px] font-mono tracking-[0.5em] text-[#C9A84C] uppercase">
              STUDIO — EST. 2017
            </span>
          </motion.div>

          {/* Hero Title */}
          <h1 className="text-[clamp(60px,12vw,180px)] font-display italic font-black leading-[0.85] tracking-tighter text-white uppercase overflow-hidden">
            <motion.span 
              initial={{ y: "100%" }}
              animate={isInView ? { y: 0 } : {}}
              transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1], delay: 1 }}
              className="block"
            >
              L&apos;EXCELLENCE
            </motion.span>
            <motion.span 
              initial={{ y: "100%" }}
              animate={isInView ? { y: 0 } : {}}
              transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1], delay: 1.2 }}
              className="block text-[#C9A84C] mt-2"
            >
              DIGITALE
            </motion.span>
          </h1>

          <div className="mt-16 flex flex-col md:flex-row items-start md:items-end gap-12 md:gap-24">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 1.5 }}
              className="max-w-md text-lg text-white/40 leading-relaxed font-sans"
            >
              Web design & développement de haute performance. Nous concevons des outils digitaux sur mesure pour booster votre croissance.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 1.8 }}
              className="flex items-center gap-6"
            >
              <Link href="#work" className="group relative px-12 py-5 bg-[#C9A84C] text-[#080808] font-bold tracking-[0.2em] text-[10px] transition-all hover:bg-white overflow-hidden">
                <span className="relative z-10 uppercase">Voir Projets</span>
              </Link>
              <Link href="#contact" className="group px-12 py-5 border border-white/10 text-white font-bold tracking-[0.2em] text-[10px] transition-all hover:border-[#C9A84C] hover:text-[#C9A84C]">
                <span className="uppercase">Contact</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Modern Stats Bar */}
      <div className="absolute bottom-0 left-0 w-full border-t border-white/5 bg-[#0f0f0f]/50 backdrop-blur-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 px-6 md:px-16">
          {[
            { value: 120, suffix: "+", label: "PROJETS RÉALISÉS" },
            { value: 95, suffix: "%", label: "PERFORMANCE MOYENNE" },
            { value: 0, prefix: "0", valueOverride: "08", label: "ANS D'EXPERTISE" },
            { value: 3, suffix: "×", label: "CROISSANCE" },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 2 + i * 0.1 }}
              className={`py-10 md:py-16 flex flex-col gap-2 ${i < 3 ? "border-r border-white/5" : ""} items-center md:items-start md:pl-10`}
            >
              <span className="text-4xl md:text-5xl font-mono font-bold text-[#C9A84C]">
                {stat.valueOverride || (
                  <StatCounter value={stat.value} duration={2 + i * 0.5} />
                )}
                {stat.suffix}
              </span>
              <span className="text-[8px] font-mono tracking-[0.4em] text-white/30 uppercase">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCounter({ value, duration }: { value: number; duration: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const animate = (time: number) => {
        if (!startTime) startTime = time;
        const progress = Math.min((time - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * value));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}</span>;
}
