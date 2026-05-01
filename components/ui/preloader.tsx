'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const basePath = process.env.NODE_ENV === 'production' ? '/alhambra-web' : '';

interface PreloaderProps {
    onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
    const [isVisible, setIsVisible] = useState(true);
    // Use CSS custom property for progress — avoids React re-renders on every tick
    const barRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);
    const startRef = useRef<number>(0);
    const rafRef = useRef<number>(0);
    const DURATION = 1400; // ms

    useEffect(() => {
        window.scrollTo(0, 0);
        document.body.style.overflow = 'hidden';

        const animate = (now: number) => {
            if (!startRef.current) startRef.current = now;
            const elapsed = now - startRef.current;
            // Ease out — fast start, slow finish
            const linear = Math.min(elapsed / DURATION, 1);
            const eased = 1 - Math.pow(1 - linear, 3); // cubic ease-out
            const pct = Math.round(eased * 100);

            if (barRef.current) {
                barRef.current.style.transform = `scaleX(${eased})`;
            }
            if (counterRef.current) {
                counterRef.current.textContent = pct.toString().padStart(3, '0');
            }

            if (linear < 1) {
                rafRef.current = requestAnimationFrame(animate);
            } else {
                // Done — trigger exit
                setTimeout(() => {
                    setIsVisible(false);
                    setTimeout(() => {
                        document.body.style.overflow = 'auto';
                        onComplete?.();
                    }, 550);
                }, 150);
            }
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(rafRef.current);
        };
    }, [onComplete]);

    return (
        <AnimatePresence mode="wait">
            {isVisible && (
                <motion.div
                    key="loader"
                    exit={{
                        clipPath: 'inset(0 0 100% 0)',
                        transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.1 },
                    }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0A0A0A]"
                    style={{ clipPath: 'inset(0 0 0% 0)' }}
                >
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-[200px] h-[60px] mb-16"
                    >
                        <Image
                            src={`${basePath}/logo.svg`}
                            alt="Alhambra"
                            fill
                            className="object-contain invert brightness-200"
                            priority
                        />
                    </motion.div>

                    {/* Progress bar — pure CSS transform, no JS state */}
                    <div className="w-[180px] h-[1px] bg-white/10 overflow-hidden">
                        <div
                            ref={barRef}
                            className="h-full bg-white origin-left"
                            style={{ transform: 'scaleX(0)', willChange: 'transform' }}
                        />
                    </div>

                    {/* Counter — DOM mutation only, no re-renders */}
                    <motion.span
                        ref={counterRef}
                        className="text-white/20 text-[11px] font-haas tracking-[0.3em] mt-4 tabular-nums"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        000
                    </motion.span>

                    <motion.div
                        className="absolute bottom-10 left-10 text-white/15 text-[10px] font-haas tracking-[0.4em] uppercase"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Alhambra — Studio Créatif
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}