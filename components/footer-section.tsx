'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function FooterSection() {
    const basePath = '/alhambra-web';
    const uranium_tech = `${basePath}/image 3.png`;
    const containerRef = useRef(null);

    // 1. On écoute le scroll spécifiquement sur cette section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"] // Déclenche quand le haut du footer entre, finit quand il sort
    });

    // 2. On transforme le scroll en mouvement vertical (Parallaxe)
    // Ici, l'image va bouger de 100px à -100px par rapport à sa place
    const yParallax = useTransform(scrollYProgress, [0, 1], [100, -100]);

    const cubicEase = [0.16, 1, 0.3, 1];

    return (
        <footer
            ref={containerRef}
            className="relative w-full bg-[#F8F8F8] pt-40 pb-10 px-16 font-haas overflow-hidden"
        >

            {/* 1. TEXTE GÉANT EN FOND "SOHUB" ANIMÉ */}
            <div className="absolute top-[2%] left-1/2 -translate-x-1/2 w-full pointer-events-none select-none z-1">
                <motion.h1
                    initial={{ opacity: 0, scale: 1.1, y: 50 }}
                    whileInView={{ opacity: 0.95, scale: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{
                        duration: 2,
                        ease: cubicEase as any,
                        delay: 0.1
                    }}
                    className="font-nordique text-black text-[28vw] font-bold tracking-tighter text-center leading-[0.7]"
                >
                    sohub
                </motion.h1>
            </div>

            {/* 2. L'ÉLÉMENT TECHNIQUE AVEC PARALLAXE AU SCROLL */}
            <motion.div
                style={{ y: yParallax }} // <--- C'est ici que la magie du scroll opère
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 1.6, ease: cubicEase as any }}
                className="relative z-20 w-[75%] max-w-[1100px] mx-auto -mb-24 pointer-events-none"
            >
                <img
                    src={uranium_tech}
                    alt="Uranium Tech"
                    className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
                />
            </motion.div>

            {/* 3. LA CARTE NOIRE PRINCIPALE */}
            <motion.div
                initial={{ y: 200, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 1.4, ease: cubicEase as any }}
                className="relative z-10 w-full bg-[#111111] rounded-[40px] pt-48 pb-24 px-10 flex flex-col items-center justify-center shadow-[0_-20px_60px_rgba(0,0,0,0.1)]"
            >
                <div className="text-center">
                    <h2 className="text-white text-[5.5vw] font-bold leading-none tracking-tight flex items-center justify-center gap-4">
                        <span className="text-[3.5vw] font-light">©</span> SOHub Digital
                    </h2>
                    <p className="text-[#555] text-[1.4vw] mt-6 font-medium tracking-tight uppercase">
                        Award-Winning Digital Agency
                    </p>
                </div>
            </motion.div>

            {/* 4. BARRE DE NAVIGATION */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative z-30 mt-8 w-full bg-[#1A1A1A] rounded-[38px] p-4 flex flex-wrap items-center justify-between gap-4"
            >
                <div className="flex gap-4">
                    <NavButton text="STUDIO" />
                    <NavButton text="WORK" />
                    <NavButton text="CONTACT" />
                </div>

                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="bg-black text-white pl-8 pr-3 py-3 rounded-full flex items-center gap-6 border border-white/5 transition-all duration-500 hover:bg-white hover:text-black group"
                >
                    <span className="text-[13px] font-bold tracking-widest uppercase">Go Up</span>
                    <div className="w-10 h-10 bg-[#222] group-hover:bg-black rounded-full flex items-center justify-center transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 19V5M5 12l7-7 7 7" />
                        </svg>
                    </div>
                </button>
            </motion.div>
        </footer>
    );
}

function NavButton({ text }: { text: string }) {
    return (
        <button className="bg-white text-black pl-8 pr-3 py-3 rounded-full flex items-center gap-6 transition-all duration-500 hover:scale-[1.03] group">
            <span className="text-[13px] font-bold tracking-widest uppercase">{text}</span>
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center transition-transform duration-300 group-hover:rotate-[15deg]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
            </div>
        </button>
    );
}
