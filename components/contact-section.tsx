'use client';

import React, { memo, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useContactPanel } from '@/components/contact-panel-context';

function useVideoVisibility(ref: React.RefObject<HTMLVideoElement | null>) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) el.play().catch(() => {});
                else el.pause();
            },
            { threshold: 0.1 },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [ref]);
}

const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const ContactSection = memo(function ContactSection() {
    const { openPanel } = useContactPanel();
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef     = useRef<HTMLVideoElement>(null);
    const videoLink = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4';
    useVideoVisibility(videoRef);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    const videoY       = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
    const videoSpringY = useSpring(videoY, { stiffness: 100, damping: 30 });

    return (
        <section
            ref={containerRef}
            className="relative w-full min-h-screen flex flex-col justify-center px-4 sm:px-10 lg:px-16 py-24 sm:py-28 lg:py-32 overflow-hidden bg-white"
            id="contact"
            aria-label="Contact — Démarrer un projet avec Alhambra"
            style={{
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
            }}
        >
            {/* Vertical line */}
            <div className="absolute left-4 sm:left-10 lg:left-16 top-0 w-[1px] h-full bg-black/[0.08] pointer-events-none z-10" />

            {/* Label */}
            <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.4 }}
                viewport={{ once: true }}
                className="absolute left-4 sm:left-10 lg:left-16 top-12 sm:top-14 lg:top-16 block font-haas text-black text-[16px] sm:text-[18px] lg:text-[20px] tracking-tight uppercase z-20"
            >
                Contact
            </motion.span>

            {/* Video with parallax — hidden on small screens for perf */}
            <motion.div
                style={{ y: videoSpringY }}
                className="absolute right-[-5%] top-0 w-[70%] h-[120%] z-0 pointer-events-none hidden sm:block"
            >
                <div
                    className="w-full h-full"
                    style={{
                        WebkitMaskImage: 'radial-gradient(circle at 60% 50%, black 20%, transparent 70%)',
                        maskImage: 'radial-gradient(circle at 60% 50%, black 20%, transparent 70%)',
                    }}
                >
                    <video
                        ref={videoRef}
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover scale-125"
                        preload="none"
                    >
                        <source src={videoLink} type="video/mp4" />
                        <track kind="captions" />
                    </video>
                </div>
            </motion.div>

            {/* Content */}
            <div className="relative z-20 w-full max-w-[1400px] ml-0 sm:ml-6 lg:ml-12">

                {/* Heading */}
                <div className="mb-8 lg:mb-10 cursor-default">
                    <h2
                        className="font-nordique leading-[0.88] tracking-[-0.04em] text-black uppercase"
                        style={{ fontSize: 'clamp(52px, 7vw, 120px)' }}
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            whileHover={{ x: 20 }}
                            transition={{ duration: 0.8, ease: EASE_EXPO }}
                            className="block origin-left transition-colors duration-300 hover:text-black/60"
                        >
                            Incarnez
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            whileHover={{ x: 40 }}
                            transition={{ duration: 0.8, delay: 0.1, ease: EASE_EXPO }}
                            className="block origin-left transition-colors duration-300 hover:text-black/40"
                        >
                            le futur
                        </motion.div>
                    </h2>
                </div>

                {/* Subtitle */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 0.8, y: 0 }}
                    transition={{ duration: 1, delay: 0.4, ease: EASE_EXPO }}
                    className="max-w-[500px] mb-10 sm:mb-12 lg:mb-14"
                >
                    <p className="font-haas text-[16px] sm:text-[18px] lg:text-[20px] leading-[1.3] tracking-tight text-black/80">
                        On ne se contente pas de coder des sites. On bâtit des empires digitaux.
                        Parlons de votre prochain grand projet.
                    </p>
                </motion.div>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.6, ease: EASE_EXPO }}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
                >
                    <button
                        onClick={() => openPanel()}
                        className="group bg-black text-white px-7 sm:px-9 py-4 sm:py-5 rounded-full flex items-center gap-4 sm:gap-6 transition-all duration-500 hover:scale-105 active:scale-95 shadow-xl hover:shadow-black/20"
                    >
                        <span className="font-haas text-[12px] sm:text-[13px] tracking-[0.2em] uppercase">
                            Lancer le projet
                        </span>
                        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full flex items-center justify-center transition-transform duration-500 group-hover:rotate-45">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5">
                                <path d="M7 17L17 7M17 7H7M17 7V17" />
                            </svg>
                        </div>
                    </button>

                    <button
                        onClick={() => openPanel('call')}
                        className="group bg-white border border-black/10 px-7 sm:px-9 py-4 sm:py-5 rounded-full flex items-center gap-4 sm:gap-6 transition-all duration-500 hover:border-black active:scale-95"
                    >
                        <span className="font-haas text-[12px] sm:text-[13px] tracking-[0.2em] uppercase text-black/40 group-hover:text-black transition-colors">
                            Prendre RDV
                        </span>
                        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white border border-black/10 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-500">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                            </svg>
                        </div>
                    </button>
                </motion.div>
            </div>
        </section>
    );
});
