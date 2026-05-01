'use client';

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence, useInView, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { useSatisfyingSounds } from '@/hooks/use-satisfying-sounds';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const tabTransition = { duration: 0.28, ease: [0.4, 0, 0.2, 1] } as const;

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
} as const;

const childVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1, ease: [0.2, 0.65, 0.3, 0.9] } },
} as const;

interface ServiceTab    { name: string; text: string; }
interface ServiceMetric { label: string; value: number; }
interface Service {
    id: string | number;
    titleMain: string;
    titleSub: string;
    features?: string[];
    metrics?: ServiceMetric[];
    tabs: ServiceTab[];
}

// ─── AnimatedBar ─────────────────────────────────────────────────────────────
const AnimatedBar = memo(function AnimatedBar({ metric, delay }: { metric: ServiceMetric; delay: number }) {
    const ref      = useRef<HTMLDivElement>(null);
    const inView   = useInView(ref, { once: true, margin: '-60px' });
    const raw      = useMotionValue(0);
    const spring   = useSpring(raw, { stiffness: 60, damping: 20 });
    const widthPct = useTransform(spring, v => `${v}%`);
    const display  = useTransform(spring, v => `${Math.round(v)}%`);

    useEffect(() => {
        if (inView) {
            const t = setTimeout(() => raw.set(metric.value), delay * 1000);
            return () => clearTimeout(t);
        }
    }, [inView, metric.value, delay, raw]);

    return (
        <div ref={ref} className="group">
            <div className="flex items-center justify-between mb-1.5">
                <span className="font-haas text-[11px] sm:text-[12px] tracking-[0.04em] text-white/35 group-hover:text-white/55 transition-colors duration-300">
                    {metric.label}
                </span>
                <motion.span className="font-nordique text-[13px] sm:text-[15px] text-white/60 tabular-nums tracking-tight">
                    {display}
                </motion.span>
            </div>
            <div className="h-[2px] w-full bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                    style={{ width: widthPct }}
                    className="h-full rounded-full"
                    style={{ width: widthPct, background: 'linear-gradient(to right, rgba(255,255,255,0.3), rgba(255,255,255,0.7))' }}
                />
            </div>
        </div>
    );
});

// ─── FloatingOrb ─────────────────────────────────────────────────────────────
const FloatingOrb = memo(function FloatingOrb({ index }: { index: number }) {
    const colors = [
        'radial-gradient(circle, rgba(120,120,255,0.18) 0%, transparent 70%)',
        'radial-gradient(circle, rgba(255,120,120,0.15) 0%, transparent 70%)',
        'radial-gradient(circle, rgba(120,220,180,0.15) 0%, transparent 70%)',
        'radial-gradient(circle, rgba(255,200,80,0.15) 0%, transparent 70%)',
    ];
    const durations  = [8, 10, 9, 11];
    const positions  = [
        { right: '-5%', bottom: '-10%'  },
        { right: '10%', bottom: '-15%'  },
        { right: '-8%', bottom: '5%'    },
        { right: '5%',  bottom: '-8%'   },
    ];
    const color    = colors[index % colors.length];
    const duration = durations[index % durations.length];
    const pos      = positions[index % positions.length];

    return (
        <div
            className="absolute w-[50%] h-[50%] pointer-events-none rounded-full"
            style={{
                ...pos,
                background: color,
                filter: 'blur(60px)',
                animation: `heroFloat ${duration}s ease-in-out infinite alternate`,
            }}
        />
    );
});

// ─── ServiceCard ─────────────────────────────────────────────────────────────
const ServiceCard = memo(function ServiceCard({ service, index }: { service: Service; index: number }) {
    const [activeTab, setActiveTab] = useState(0);
    const eyeRef       = useRef<HTMLDivElement>(null);
    const cardRef      = useRef<HTMLDivElement>(null);
    const rafRef       = useRef<number>(0);
    const targetRef    = useRef({ x: 0, y: 0 });
    const currentRef   = useRef({ x: 0, y: 0 });
    const isHoveredRef = useRef(false);
    const { playClick, playHover } = useSatisfyingSounds();

    const runLoop = useCallback(() => {
        const LERP = 0.1;
        currentRef.current.x += (targetRef.current.x - currentRef.current.x) * LERP;
        currentRef.current.y += (targetRef.current.y - currentRef.current.y) * LERP;
        if (eyeRef.current) {
            eyeRef.current.style.transform = `translate(${currentRef.current.x}px, ${currentRef.current.y}px)`;
        }
        const dx = Math.abs(targetRef.current.x - currentRef.current.x);
        const dy = Math.abs(targetRef.current.y - currentRef.current.y);
        if (isHoveredRef.current || dx > 0.05 || dy > 0.05) {
            rafRef.current = requestAnimationFrame(runLoop);
        }
    }, []);

    const handleMouseEnter = useCallback(() => {
        isHoveredRef.current = true;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(runLoop);
    }, [runLoop]);

    const handleMouseLeave = useCallback(() => {
        isHoveredRef.current = false;
        targetRef.current = { x: 0, y: 0 };
        if (!rafRef.current) rafRef.current = requestAnimationFrame(runLoop);
    }, [runLoop]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        const limit = 12;
        targetRef.current = {
            x: Math.max(-limit, Math.min(limit, (left + width / 2 - e.clientX) / 25)),
            y: Math.max(-limit, Math.min(limit, (top + height / 2  - e.clientY) / 25)),
        };
    }, []);

    useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            initial={{ y: 120, opacity: 0, scale: 0.92 }}
            whileInView={{ y: 0, opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 1.2, ease: EASE, delay: index * 0.05 }}
            className="sticky w-full bg-[#111] rounded-[28px] sm:rounded-[36px] lg:rounded-[40px] p-6 sm:p-10 lg:p-14 overflow-hidden"
            style={{
                top: `${8 + index * 2}vh`,
                marginTop: index === 0 ? 0 : -20 * index,
                minHeight: 'clamp(480px, 82vh, 820px)',
                zIndex: index + 1,
                willChange: 'transform, opacity',
                boxShadow: '0 12px 48px rgba(0,0,0,0.25)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}
        >
            {/* Ambient color orb */}
            <FloatingOrb index={index} />

            {/* ── TOP : titre + badge ── */}
            <div className="flex items-start justify-between gap-4 relative z-10">
                <h3
                    className="text-white font-bold leading-[0.85] tracking-tighter"
                    style={{ fontSize: 'clamp(34px, 7.5vw, 120px)' }}
                >
                    {service.titleMain}
                    <br />
                    <span className="text-[#3a3a3a]">{service.titleSub}</span>
                </h3>
                <div className="flex flex-col items-end gap-1 mt-1 flex-shrink-0">
                    <span className="font-haas text-[10px] tracking-[0.3em] text-white/12 tabular-nums">
                        {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08]">
                        <span className="w-[5px] h-[5px] rounded-full bg-emerald-400/70 animate-pulse" />
                        <span className="font-haas text-[9px] tracking-[0.15em] text-white/25 uppercase">actif</span>
                    </span>
                </div>
            </div>

            {/* ── CENTER : métriques animées + feature tags ── */}
            <div className="relative z-10 flex flex-col gap-6 sm:gap-8 py-4 sm:py-6">

                {/* Barre métriques */}
                {service.metrics && service.metrics.length > 0 && (
                    <div className="space-y-4 sm:space-y-5">
                        {service.metrics.map((m, i) => (
                            <AnimatedBar key={i} metric={m} delay={i * 0.2} />
                        ))}
                    </div>
                )}

                {/* Divider */}
                <div className="h-[1px] bg-white/[0.05]" />

                {/* Feature pills animées */}
                {service.features && service.features.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {service.features.map((feat, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, y: 8 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: EASE }}
                                whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.25)', backgroundColor: 'rgba(255,255,255,0.07)' }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] cursor-default"
                                style={{ transition: 'background-color 0.2s, border-color 0.2s' }}
                            >
                                <span className="w-[3px] h-[3px] rounded-full bg-white/20 flex-shrink-0" />
                                <span className="font-haas text-[10px] sm:text-[11px] tracking-[0.08em] text-white/35">
                                    {feat}
                                </span>
                            </motion.span>
                        ))}
                    </div>
                )}
            </div>

            {/* ── BOTTOM : tabs + description + eye ── */}
            <div className="relative z-10">
                {/* Tab bar */}
                <div className="flex flex-wrap gap-x-5 lg:gap-x-8 gap-y-3 mb-5 lg:mb-8 border-b border-white/[0.07] pb-4">
                    {service.tabs.map((tab, i) => (
                        <button
                            key={i}
                            onMouseEnter={playHover}
                            onClick={() => { playClick(); setActiveTab(i); }}
                            className="relative pb-1.5 cursor-pointer"
                        >
                            <span
                                className={`font-haas font-medium transition-colors duration-200 ${
                                    activeTab === i ? 'text-white' : 'text-[#555]'
                                }`}
                                style={{ fontSize: 'clamp(12px, 1.1vw, 18px)' }}
                            >
                                {tab.name}
                            </span>
                            {activeTab === i && (
                                <motion.div
                                    layoutId={`tab-line-${service.id}`}
                                    className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-white rounded-full"
                                    transition={tabTransition}
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Description + eye widget */}
                <div className="flex items-start gap-4 sm:gap-5">
                    <div className="relative w-10 h-10 sm:w-11 sm:h-11 border border-white/15 rounded-full flex items-center justify-center bg-[#1a1a1a] overflow-hidden flex-shrink-0">
                        <div
                            ref={eyeRef}
                            className="w-4 h-4 bg-white rounded-full"
                            style={{ willChange: 'transform', boxShadow: '0 0 10px rgba(255,255,255,0.5)' }}
                        />
                    </div>
                    <div className="min-h-[64px] sm:min-h-[80px]">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={activeTab}
                                initial={{ opacity: 0, x: 12 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -12 }}
                                transition={tabTransition}
                                className="text-[#888] leading-relaxed font-haas"
                                style={{ fontSize: 'clamp(13px, 1.2vw, 20px)' }}
                            >
                                {service.tabs[activeTab].text}
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

ServiceCard.displayName = 'ServiceCard';

// ─── ServicesSection ──────────────────────────────────────────────────────────
export function ServicesSection() {
    const [services, setServices] = useState<Service[]>([]);

    useEffect(() => {
        const prefix =
            typeof window !== 'undefined' && window.location.hostname.includes('github.io')
                ? '/alhambra-web'
                : '';
        fetch(`${prefix}/data/services.json`)
            .then(r => r.json())
            .then(setServices)
            .catch(err => console.error('Erreur services:', err));
    }, []);

    const words1 = 'Une agence digitale atypique concentrée sur'.split(' ');
    const words2 = 'la transformation de votre vision en expérience.'.split(' ');

    return (
        <section className="w-full px-4 sm:px-8 lg:px-16 py-16 sm:py-24 lg:py-32 font-haas" id="services">
            <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.5 }}
                viewport={{ once: true }}
                className="block text-black text-[24px] sm:text-[28px] lg:text-[32px] mb-10 sm:mb-12 font-bold"
            >
                Services
            </motion.span>

            <div className="mb-20 sm:mb-28 lg:mb-32 overflow-hidden">
                {[words1, words2].map((words, li) => (
                    <motion.h2
                        key={li}
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="leading-[1.05] text-black font-bold tracking-tighter flex flex-wrap"
                        style={{ fontSize: 'clamp(22px, 3.5vw, 56px)', marginTop: li ? '0.5rem' : 0 }}
                    >
                        {words.map((w, i) => (
                            <motion.span variants={childVariants} key={i} className="mr-[0.25em] inline-block">
                                {w === 'atypique' ? (
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9C9C9C] via-[#666] to-[#9C9C9C]">{w}</span>
                                ) : w}
                            </motion.span>
                        ))}
                    </motion.h2>
                ))}
            </div>

            <div className="relative flex flex-col gap-[8vh] lg:gap-[10vh]">
                {services.map((service, index) => (
                    <ServiceCard key={service.id} service={service} index={index} />
                ))}
            </div>
        </section>
    );
}
