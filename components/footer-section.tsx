'use client';

import React, { useRef, memo } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useContactPanel } from '@/components/contact-panel-context';

const NAV_LINKS = [
    { label: 'STUDIO',   href: '#about',    title: 'À propos — Alhambra Web' },
    { label: 'WORK',     href: '#work',     title: 'Nos projets & réalisations' },
    { label: 'SERVICES', href: '#services', title: 'Nos services web' },
    { label: 'CONTACT',  href: '#contact',  title: 'Nous contacter' },
];


const cubicEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const FooterSection = memo(function FooterSection() {
    const containerRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const { openPanel } = useContactPanel();

    // Scroll-driven parallax — starts at 0 so text isn't pushed down on entry
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });
    const rawY = useTransform(scrollYProgress, [0, 1], [0, -60]);
    const titleY = useSpring(rawY, { stiffness: 80, damping: 20 });
    const titleScale = useTransform(scrollYProgress, [0, 0.5], [1.02, 1]);

    const handleNavClick = (href: string) => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <footer ref={containerRef} className="relative w-full pt-28 sm:pt-36 lg:pt-44 pb-8 sm:pb-10 px-4 sm:px-8 lg:px-16 font-haas z-0 overflow-hidden">

            {/* Decorative large title — image clipped, scroll parallax */}
            <div
                ref={titleRef}
                className="absolute top-2 left-1/2 -translate-x-1/2 w-full pointer-events-none select-none z-0"
            >
                {/* motion wrapper: only scroll-driven transform, no static styles → avoids SSR/client mismatch */}
                <motion.div
                    style={{ y: titleY, scale: titleScale, willChange: 'transform' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, ease: cubicEase, delay: 0.05 }}
                >
                    {/* Decorative only — aria-hidden so screen readers + Google ignore it */}
                    <div
                        aria-hidden="true"
                        className="footer-alhambra font-nordique font-bold tracking-tighter text-center leading-[0.75]"
                    >
                        alhambra
                    </div>
                </motion.div>
            </div>

            {/* Dark main block */}
            <motion.div
                initial={{ y: 150, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: cubicEase }}
                className="relative z-10 w-full bg-[#111111] rounded-[28px] sm:rounded-[36px] lg:rounded-[40px] pt-20 sm:pt-28 lg:pt-36 pb-14 sm:pb-18 lg:pb-24 px-6 sm:px-8 lg:px-10 flex flex-col items-center justify-center"
                style={{ boxShadow: '0 -16px 48px rgba(0,0,0,0.08)' }}
            >
                <div className="text-center">
                    <p
                        className="text-white font-bold leading-none tracking-tight flex items-center justify-center gap-3 sm:gap-4 uppercase"
                        style={{ fontSize: 'clamp(28px, 5.5vw, 90px)' }}
                    >
                        <span className="font-light" style={{ fontSize: 'clamp(20px, 3.5vw, 56px)' }}>©</span>
                        Alhambra Web
                    </p>
                    <p
                        className="text-[#555] mt-4 sm:mt-6 font-medium tracking-tight uppercase"
                        style={{ fontSize: 'clamp(12px, 1.4vw, 22px)' }}
                    >
                        Studio Créatif &amp; Digital
                    </p>
                </div>

            </motion.div>

            {/* Bottom nav bar */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="relative z-30 mt-4 sm:mt-6 lg:mt-8 w-full bg-[#1A1A1A] rounded-[28px] sm:rounded-[34px] lg:rounded-[38px] p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 uppercase"
            >
                <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4">
                    {NAV_LINKS.map(({ label, href, title }) => (
                        <NavButton key={label} text={label} title={title} onClick={() => handleNavClick(href)} />
                    ))}
                </div>

                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="bg-black text-white pl-5 sm:pl-7 lg:pl-8 pr-2 sm:pr-3 py-2 sm:py-3 rounded-full flex items-center gap-4 sm:gap-5 lg:gap-6 border border-white/5 transition-all duration-300 hover:bg-white hover:text-black group cursor-pointer"
                >
                    <span className="text-[11px] sm:text-[12px] lg:text-[13px] font-bold tracking-widest">Remonter</span>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-[#222] group-hover:bg-black rounded-full flex items-center justify-center transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 19V5M5 12l7-7 7 7" />
                        </svg>
                    </div>
                </button>
            </motion.div>
        </footer>
    );
});

const NavButton = memo(function NavButton({ text, title, onClick }: { text: string; title?: string; onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            title={title}
            className="bg-white text-black pl-5 sm:pl-6 lg:pl-8 pr-2 sm:pr-2.5 lg:pr-3 py-2 sm:py-2.5 lg:py-3 rounded-full flex items-center gap-3 sm:gap-4 lg:gap-6 transition-transform duration-300 hover:scale-[1.03] group cursor-pointer"
        >
            <span className="text-[10px] sm:text-[11px] lg:text-[13px] font-bold tracking-widest uppercase">{text}</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-black rounded-full flex items-center justify-center transition-transform duration-300 group-hover:rotate-[15deg]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
            </div>
        </button>
    );
});
