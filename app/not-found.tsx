'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_SHARP: [number, number, number, number] = [0.76, 0, 0.24, 1];

export default function NotFound() {
    const [mounted, setMounted] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        const handle = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const { left, top, width, height } = containerRef.current.getBoundingClientRect();
            setMousePos({
                x: ((e.clientX - left) / width - 0.5) * 2,
                y: ((e.clientY - top) / height - 0.5) * 2,
            });
        };
        window.addEventListener('mousemove', handle, { passive: true });
        return () => window.removeEventListener('mousemove', handle);
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative min-h-screen bg-[#060606] flex flex-col items-center justify-center overflow-hidden px-6"
        >
            {/* Grain overlay */}
            <div
                className="pointer-events-none absolute inset-0 z-0 opacity-[0.035]"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")', backgroundSize: '128px' }}
            />

            {/* Ambient glow */}
            <motion.div
                className="pointer-events-none absolute rounded-full opacity-10 blur-[120px]"
                style={{
                    width: 600,
                    height: 600,
                    background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)',
                    top: '50%',
                    left: '50%',
                }}
                animate={mounted ? {
                    x: mousePos.x * 40 - 300,
                    y: mousePos.y * 40 - 300,
                } : { x: -300, y: -300 }}
                transition={{ type: 'spring', stiffness: 60, damping: 20 }}
            />

            {/* Nav */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
                className="absolute top-0 left-0 w-full px-6 sm:px-10 lg:px-12 py-5 sm:py-6 flex justify-between items-center z-10"
            >
                <Link
                    href="/"
                    className="font-nordique text-white tracking-tighter lowercase leading-none transition-opacity hover:opacity-60"
                    style={{ fontSize: 'clamp(16px, 1.8vw, 26px)' }}
                >
                    alhambra web
                </Link>
                <Link
                    href="/"
                    className="font-haas text-[11px] tracking-[0.1em] text-white/40 uppercase hover:text-white/80 transition-colors"
                >
                    Retour à l&apos;accueil
                </Link>
            </motion.div>

            {/* 404 giant number */}
            <div className="relative z-10 text-center select-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: EASE, delay: 0.15 }}
                    className="relative"
                >
                    <span
                        className="font-nordique text-white/[0.04] leading-none tracking-tighter block"
                        style={{ fontSize: 'clamp(160px, 30vw, 420px)' }}
                        aria-hidden="true"
                    >
                        404
                    </span>
                    <motion.span
                        className="font-nordique text-white leading-none tracking-tighter absolute inset-0 flex items-center justify-center italic"
                        style={{ fontSize: 'clamp(80px, 15vw, 210px)' }}
                        animate={mounted ? {
                            x: mousePos.x * -8,
                            y: mousePos.y * -8,
                        } : {}}
                        transition={{ type: 'spring', stiffness: 80, damping: 18 }}
                    >
                        404
                    </motion.span>
                </motion.div>

                {/* Divider */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.9, ease: EASE_SHARP, delay: 0.5 }}
                    className="h-px bg-white/10 w-full max-w-sm mx-auto my-8 origin-left"
                />

                {/* Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.6 }}
                >
                    <p
                        className="font-haas text-white/40 uppercase tracking-[0.35em] mb-2"
                        style={{ fontSize: 'clamp(9px, 1vw, 11px)' }}
                    >
                        Page introuvable
                    </p>
                    <h1
                        className="font-nordique text-white tracking-tighter mb-10"
                        style={{ fontSize: 'clamp(22px, 4vw, 52px)' }}
                    >
                        Cette page n&apos;existe pas.
                    </h1>

                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-3 bg-white text-black font-haas text-[11px] font-bold tracking-[0.1em] uppercase pl-6 pr-2 py-2 rounded-full hover:bg-white/90 transition-colors"
                            >
                                Accueil
                                <span className="w-8 h-8 rounded-full bg-black/8 flex items-center justify-center">
                                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                                        <path d="M3 8h10M8 3l5 5-5 5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            </Link>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <Link
                                href="/#contact"
                                className="inline-flex items-center font-haas text-[11px] font-bold tracking-[0.1em] uppercase text-white/40 hover:text-white transition-colors px-6 py-3"
                            >
                                Nous contacter
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Bottom marquee */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.9 }}
                className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none select-none z-10"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
                <div className="flex whitespace-nowrap py-[10px]">
                    <div className="flex animate-marquee" style={{ animationDuration: '50s' }}>
                        {[0, 1].map(k => (
                            <span key={k} className="font-haas text-[9px] sm:text-[10px] tracking-[0.28em] text-white/20 uppercase">
                                {'alhambra web · page introuvable · 404 · studio créatif & digital · lyon · '.repeat(12)}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
