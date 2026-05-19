'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface PreloaderProps {
    onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
    const [isVisible, setIsVisible] = useState(true);
    const barRef     = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);
    const startRef   = useRef<number>(0);
    const rafRef     = useRef<number>(0);
    const DURATION   = 1000;

    useEffect(() => {
        window.scrollTo(0, 0);
        document.body.style.overflow = 'hidden';

        const animate = (now: number) => {
            if (!startRef.current) startRef.current = now;
            const elapsed = now - startRef.current;
            const linear  = Math.min(elapsed / DURATION, 1);
            const eased   = 1 - Math.pow(1 - linear, 3);
            const pct     = Math.round(eased * 100);

            if (barRef.current)     barRef.current.style.transform = `scaleX(${eased})`;
            if (counterRef.current) counterRef.current.textContent  = pct.toString().padStart(3, '0');

            if (linear < 1) {
                rafRef.current = requestAnimationFrame(animate);
            } else {
                setTimeout(() => {
                    setIsVisible(false);
                    setTimeout(() => {
                        document.body.style.overflow = '';
                        onComplete?.();
                    }, 500);
                }, 100);
            }
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, [onComplete]);

    return (
        <AnimatePresence mode="wait">
            {isVisible && (
                <motion.div
                    key="loader"
                    exit={{
                        clipPath: 'inset(0 0 100% 0)',
                        transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1], delay: 0.05 },
                    }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0A0A0A]"
                    style={{ clipPath: 'inset(0 0 0% 0)' }}
                >
                    {/* Logo texte — instantané, zéro latence réseau */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-12"
                    >
                        <span className="font-nordique text-white lowercase tracking-tighter select-none"
                              style={{ fontSize: 'clamp(24px, 6vw, 38px)', letterSpacing: '-0.03em' }}>
                            alhambra web
                        </span>
                    </motion.div>

                    {/* Barre de progression */}
                    <div className="w-[140px] sm:w-[180px] h-[1px] bg-white/10 overflow-hidden">
                        <div
                            ref={barRef}
                            className="h-full bg-white origin-left"
                            style={{ transform: 'scaleX(0)', willChange: 'transform' }}
                        />
                    </div>

                    {/* Compteur */}
                    <motion.span
                        ref={counterRef}
                        className="text-white/25 font-haas tabular-nums mt-3 select-none"
                        style={{ fontSize: '10px', letterSpacing: '0.3em' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        000
                    </motion.span>

                    <motion.div
                        className="absolute bottom-8 left-6 sm:left-10 text-white/15 font-haas uppercase select-none"
                        style={{ fontSize: '9px', letterSpacing: '0.4em' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Studio Créatif · Lyon
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
