'use client';

import React, { memo, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Pause video when off-screen, play when visible — saves bandwidth + GPU
function useVideoVisibility(ref: React.RefObject<HTMLVideoElement | null>) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.play().catch(() => {});
                } else {
                    el.pause();
                }
            },
            { threshold: 0.1 },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [ref]);
}

const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const LINE1 = "L'art du code, la poésie rencontre".split(' ');
const LINE2 = "la structure de l'art.".split(' ');

const GRADIENT_WORDS = new Set(['art', 'poésie']);

const GradientText = memo(function GradientText({ children }: { children: string }) {
    return (
        <span className="relative inline-block italic">
            <span
                className="text-transparent bg-gradient-to-r from-[#888] to-[#333] bg-clip-text"
                style={{
                    WebkitBackgroundClip: 'text',
                    display: 'inline-block',
                    padding: '0.1em 0.15em',
                    margin: '-0.1em -0.15em',
                }}
            >
                {children}
            </span>
        </span>
    );
});
GradientText.displayName = 'GradientText';

const StatItem = memo(function StatItem({
    label,
    value,
    index,
}: {
    label: string;
    value: string;
    index: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: EASE_EXPO }}
            className="flex flex-col border-l border-black/10 pl-6 lg:pl-8 py-2"
        >
            <span className="text-[10px] font-haas font-bold uppercase tracking-[0.3em] text-black/40">
                {label}
            </span>
            <span
                className="font-nordique leading-none text-black tracking-tighter mt-2"
                style={{ fontSize: 'clamp(32px, 4.5vw, 72px)' }}
            >
                {value}
            </span>
        </motion.div>
    );
});
StatItem.displayName = 'StatItem';

export const AboutSection = memo(function AboutSection() {
    const containerRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    useVideoVisibility(videoRef);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    const videoScale = useTransform(scrollYProgress, [0, 0.5], [1.1, 1]);

    return (
        <section
            ref={containerRef}
            className="w-full px-4 sm:px-8 lg:px-16 py-16 sm:py-24 lg:py-32 font-haas bg-white"
            id="about"
        >
            <motion.span
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 0.5, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: EASE_EXPO }}
                className="block text-black text-[24px] sm:text-[28px] lg:text-[32px] mb-10 sm:mb-12 lg:mb-14 font-bold tracking-tight"
            >
                L&apos;Agence
            </motion.span>

            <div className="mb-14 sm:mb-20 lg:mb-24">
                {[LINE1, LINE2].map((words, lineIdx) => (
                    <motion.h2
                        key={lineIdx}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 1.05, ease: EASE_EXPO, delay: lineIdx * 0.1 }}
                        className="leading-[1.15] text-black font-bold tracking-tighter flex flex-wrap items-baseline"
                        style={{ fontSize: 'clamp(22px, 3.5vw, 56px)' }}
                    >
                        {words.map((word, i) => (
                            <span key={i} className="mr-[0.25em] inline-block">
                                {GRADIENT_WORDS.has(word) ? (
                                    <GradientText>{word}</GradientText>
                                ) : (
                                    word
                                )}
                            </span>
                        ))}
                    </motion.h2>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
                {/* Video */}
                <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] sm:rounded-[28px] lg:rounded-[32px] bg-[#EBEBEB]">
                    <motion.div
                        style={{ scale: videoScale, willChange: 'transform' }}
                        className="absolute inset-0"
                    >
                        <video
                            ref={videoRef}
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                            preload="none"
                        >
                            <source
                                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4"
                                type="video/mp4"
                            />
                            <track kind="captions" />
                        </video>
                    </motion.div>

                    <div className="absolute top-4 sm:top-5 lg:top-6 right-4 sm:right-5 lg:right-6 z-20">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-haas font-bold tracking-[0.2em] uppercase bg-black text-white">
                            <span className="w-[5px] h-[5px] rounded-full bg-emerald-400" />
                            Est. 2017
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex flex-col gap-8 lg:gap-12 pt-0 md:pt-4">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="leading-[1.3] font-bold tracking-tight text-black"
                        style={{ fontSize: 'clamp(18px, 2vw, 32px)', maxWidth: '36rem' }}
                    >
                        Nous concevons des{' '}
                        <span className="text-black/30 italic">systèmes visuels</span> uniques.
                        Notre approche fusionne esthétique radicale et performance.
                    </motion.p>

                    <div className="grid grid-cols-2 gap-6 lg:gap-8 border-t border-black/5 pt-8 lg:pt-12">
                        <StatItem label="Expertise" value="08 ans" index={0} />
                        <StatItem label="Impact" value="150+" index={1} />
                    </div>
                </div>
            </div>
        </section>
    );
});

AboutSection.displayName = 'AboutSection';
