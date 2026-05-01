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

// ═══════════════════════════════════════════════════════════
// ANIMATIONS UNIQUES PAR CARD
// ═══════════════════════════════════════════════════════════

// Card 0 — Identité de Marque : palette couleurs animée
const PaletteAnimation = memo(function PaletteAnimation() {
    const swatches = [
        { bg: '#1C1C2E', h: 44 },
        { bg: '#E8D5B0', h: 60 },
        { bg: '#C9A96E', h: 76 },
        { bg: '#8B4513', h: 56 },
        { bg: '#F0EDE6', h: 68 },
        { bg: '#2D4A3E', h: 52 },
        { bg: '#B8A99A', h: 80 },
    ];
    return (
        <div className="w-full">
            <p className="font-haas text-[10px] tracking-[0.25em] text-white/45 uppercase mb-4">Palette générée</p>
            <div className="flex items-end gap-2 sm:gap-3">
                {swatches.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ scaleY: 0, opacity: 0 }}
                        whileInView={{ scaleY: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.07, duration: 0.7, ease: EASE }}
                        style={{ transformOrigin: 'bottom', height: s.h }}
                        className="flex-1 rounded-md sm:rounded-lg relative overflow-hidden group cursor-default"
                    >
                        <div className="absolute inset-0" style={{ backgroundColor: s.bg }} />
                        <motion.div
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute inset-0"
                            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)' }}
                        />
                    </motion.div>
                ))}
            </div>
            <div className="flex items-center gap-2 mt-4">
                {/* scaleX instead of width — GPU composited, no layout cost */}
                <div className="h-[1px] overflow-hidden" style={{ width: '60%' }}>
                    <motion.div
                        animate={{ scaleX: [0, 1, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        className="h-full bg-white/30 rounded-full"
                        style={{ transformOrigin: 'left' }}
                    />
                </div>
                <span className="font-haas text-[9px] text-white/40 tracking-widest uppercase whitespace-nowrap">Génération en cours</span>
            </div>
        </div>
    );
});

// Card 1 — Expérience Digitale : flow UX interactif
const UXFlowAnimation = memo(function UXFlowAnimation() {
    const [active, setActive] = useState(0);
    const steps = ['Découverte', 'Wireframe', 'Prototype', 'Test', 'Livraison'];

    useEffect(() => {
        const t = setInterval(() => setActive(p => (p + 1) % steps.length), 1400);
        return () => clearInterval(t);
    }, [steps.length]);

    return (
        <div className="w-full">
            <p className="font-haas text-[10px] tracking-[0.25em] text-white/45 uppercase mb-5">Processus UX</p>
            <div className="flex items-center gap-0">
                {steps.map((step, i) => (
                    <React.Fragment key={i}>
                        <div className="flex flex-col items-center gap-2">
                            <motion.div
                                animate={{
                                    scale: active === i ? 1.25 : 1,
                                    backgroundColor: active === i ? '#fff' : i < active ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.08)',
                                    boxShadow: active === i ? '0 0 20px rgba(255,255,255,0.35)' : 'none',
                                }}
                                transition={{ duration: 0.4, ease: EASE }}
                                className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full"
                            />
                            <motion.span
                                animate={{ opacity: active === i ? 0.7 : i < active ? 0.3 : 0.12 }}
                                transition={{ duration: 0.3 }}
                                className="font-haas text-[8px] sm:text-[9px] text-white tracking-[0.05em] whitespace-nowrap"
                            >
                                {step}
                            </motion.span>
                        </div>
                        {i < steps.length - 1 && (
                            <div className="flex-1 h-[1px] mb-5 mx-1 overflow-hidden bg-white/8 rounded-full">
                                <motion.div
                                    animate={{ scaleX: active > i ? 1 : 0 }}
                                    transition={{ duration: 0.5, ease: EASE }}
                                    style={{ transformOrigin: 'left' }}
                                    className="h-full bg-white/40 rounded-full"
                                />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Mini mockup card */}
            <motion.div
                className="mt-6 rounded-xl border border-white/8 bg-white/[0.03] p-3 sm:p-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.7, ease: EASE }}
            >
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                    <div className="h-[6px] w-20 rounded-full bg-white/10" />
                    <div className="ml-auto h-[6px] w-10 rounded-full bg-white/8" />
                </div>
                <div className="space-y-1.5">
                    {[80, 60, 90].map((w, i) => (
                        <motion.div
                            key={i}
                            className="h-[5px] rounded-full bg-white/8"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 + i * 0.1, duration: 0.6, ease: EASE }}
                            style={{ transformOrigin: 'left', width: `${w}%` }}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
});

// Card 2 — Développement Web : terminal live
const TerminalAnimation = memo(function TerminalAnimation() {
    const lines = [
        { text: '▸ next build',              color: 'rgba(255,255,255,0.5)',  delay: 0    },
        { text: '  ✓ Compiled in 1.8s',      color: 'rgba(134,239,172,0.7)', delay: 0.5  },
        { text: '  ✓ TypeScript — no errors', color: 'rgba(134,239,172,0.7)', delay: 0.9  },
        { text: '  ✓ 11 pages generated',    color: 'rgba(134,239,172,0.7)', delay: 1.3  },
        { text: '  ⚡ Lighthouse  97 / 100', color: 'rgba(251,191,36,0.8)',  delay: 1.7  },
        { text: '  ▸ Deploying to GitHub…',  color: 'rgba(255,255,255,0.3)', delay: 2.1  },
        { text: '  ✓ Live in 2.3s',          color: 'rgba(134,239,172,0.9)', delay: 2.6  },
    ];

    const ref    = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    const [visible, setVisible] = useState<number[]>([]);

    useEffect(() => {
        if (!inView) return;
        lines.forEach((l, i) => {
            setTimeout(() => setVisible(p => [...p, i]), l.delay * 1000);
        });
    }, [inView]); // eslint-disable-line

    return (
        <div ref={ref} className="w-full">
            <div className="rounded-xl border border-white/8 bg-[#0d0d0d] overflow-hidden">
                {/* Terminal bar */}
                <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                    <span className="ml-3 font-haas text-[10px] text-white/45 tracking-widest">terminal</span>
                </div>
                {/* Lines */}
                <div className="px-4 py-3 space-y-1 min-h-[120px]">
                    {lines.map((l, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -6 }}
                            animate={visible.includes(i) ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.3, ease: EASE }}
                            className="font-haas text-[10px] sm:text-[11px] leading-relaxed tracking-[0.04em]"
                            style={{ color: l.color }}
                        >
                            {l.text}
                        </motion.div>
                    ))}
                    {/* Blinking cursor */}
                    <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="inline-block w-[6px] h-[13px] bg-white/40 ml-0.5"
                    />
                </div>
            </div>
        </div>
    );
});

// Card 3 — Stratégie Digitale : graphe SVG animé
const ChartAnimation = memo(function ChartAnimation() {
    const ref    = useRef<SVGPathElement>(null);
    const inView = useInView({ current: ref.current ? ref.current.closest('div') as HTMLElement : null }, { once: true });
    const containerRef = useRef<HTMLDivElement>(null);
    const inView2 = useInView(containerRef, { once: true, margin: '-60px' });

    const W = 400; const H = 100;
    const pts = [
        { x: 0,   y: 80 }, { x: 60,  y: 70 }, { x: 110, y: 65 },
        { x: 160, y: 50 }, { x: 220, y: 40 }, { x: 280, y: 28 },
        { x: 340, y: 18 }, { x: 400, y: 8  },
    ];

    const d = pts.reduce((acc, p, i) => {
        if (i === 0) return `M ${p.x} ${p.y}`;
        const prev = pts[i - 1];
        const cpx  = (prev.x + p.x) / 2;
        return `${acc} C ${cpx} ${prev.y}, ${cpx} ${p.y}, ${p.x} ${p.y}`;
    }, '');

    const months = ['Jan', 'Mar', 'Mai', 'Jul', 'Sep', 'Nov'];

    return (
        <div ref={containerRef} className="w-full">
            <div className="flex items-end justify-between mb-2">
                <p className="font-haas text-[10px] tracking-[0.25em] text-white/45 uppercase">Croissance trafic</p>
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={inView2 ? { opacity: 1 } : {}}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="font-nordique text-[18px] sm:text-[22px] text-white/70 tracking-tight"
                >
                    +186%
                </motion.span>
            </div>
            <div className="relative">
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 90 }} preserveAspectRatio="none">
                    {/* Grid lines */}
                    {[25, 50, 75].map(y => (
                        <line key={y} x1={0} y1={y} x2={W} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    ))}
                    {/* Fill */}
                    <motion.path
                        d={`${d} L ${W} ${H} L 0 ${H} Z`}
                        fill="url(#grad)"
                        initial={{ opacity: 0 }}
                        animate={inView2 ? { opacity: 1 } : {}}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    />
                    <defs>
                        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%"   stopColor="rgba(255,255,255,0.12)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0)"    />
                        </linearGradient>
                    </defs>
                    {/* Line */}
                    <motion.path
                        ref={ref}
                        d={d}
                        fill="none"
                        stroke="rgba(255,255,255,0.6)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={inView2 ? { pathLength: 1 } : {}}
                        transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
                    />
                    {/* Dots */}
                    {pts.filter((_, i) => i % 2 === 0).map((p, i) => (
                        <motion.circle
                            key={i}
                            cx={p.x} cy={p.y} r={3}
                            fill="#111"
                            stroke="rgba(255,255,255,0.5)"
                            strokeWidth="1.5"
                            initial={{ scale: 0 }}
                            animate={inView2 ? { scale: 1 } : {}}
                            transition={{ delay: 0.4 + i * 0.15, duration: 0.4, ease: EASE }}
                        />
                    ))}
                </svg>
                {/* X labels */}
                <div className="flex justify-between mt-1">
                    {months.map(m => (
                        <span key={m} className="font-haas text-[8px] text-white/40 tracking-wide">{m}</span>
                    ))}
                </div>
            </div>
        </div>
    );
});

const CARD_ANIMATIONS = [PaletteAnimation, UXFlowAnimation, TerminalAnimation, ChartAnimation];

// ═══════════════════════════════════════════════════════════
// ServiceCard
// ═══════════════════════════════════════════════════════════
const ServiceCard = memo(function ServiceCard({ service, index }: { service: Service; index: number }) {
    const [activeTab, setActiveTab]  = useState(0);
    const eyeRef       = useRef<HTMLDivElement>(null);
    const cardRef      = useRef<HTMLDivElement>(null);
    const rafRef       = useRef<number>(0);
    const targetRef    = useRef({ x: 0, y: 0 });
    const currentRef   = useRef({ x: 0, y: 0 });
    const isHoveredRef = useRef(false);
    const { playClick, playHover } = useSatisfyingSounds();

    const CardAnim = CARD_ANIMATIONS[index % CARD_ANIMATIONS.length];

    const runLoop = useCallback(() => {
        const LERP = 0.1;
        currentRef.current.x += (targetRef.current.x - currentRef.current.x) * LERP;
        currentRef.current.y += (targetRef.current.y - currentRef.current.y) * LERP;
        if (eyeRef.current) {
            eyeRef.current.style.transform = `translate(${currentRef.current.x}px, ${currentRef.current.y}px)`;
        }
        const dx = Math.abs(targetRef.current.x - currentRef.current.x);
        const dy = Math.abs(targetRef.current.y - currentRef.current.y);
        if (isHoveredRef.current || dx > 0.05 || dy > 0.05) rafRef.current = requestAnimationFrame(runLoop);
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
            className="sticky w-full bg-[#111] rounded-[28px] sm:rounded-[36px] lg:rounded-[40px] p-6 sm:p-10 lg:p-14 flex flex-col justify-between overflow-hidden"
            style={{
                top: `${8 + index * 2}vh`,
                marginTop: index === 0 ? 0 : -20 * index,
                minHeight: 'clamp(480px, 82vh, 820px)',
                zIndex: index + 1,
                willChange: 'transform, opacity',
                boxShadow: '0 12px 48px rgba(0,0,0,0.25)',
            }}
        >
            {/* ── TOP ── */}
            <div className="flex items-start justify-between gap-4">
                <h3
                    className="text-white font-bold leading-[0.85] tracking-tighter"
                    style={{ fontSize: 'clamp(34px, 7.5vw, 120px)' }}
                >
                    {service.titleMain}
                    <br />
                    <span className="text-[#3a3a3a]">{service.titleSub}</span>
                </h3>
                <div className="flex flex-col items-end gap-1.5 mt-1 flex-shrink-0">
                    <span className="font-haas text-[10px] tracking-[0.3em] text-white/40 tabular-nums">
                        {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.07]">
                        <span className="w-[5px] h-[5px] rounded-full bg-emerald-400/60 animate-pulse" />
                        <span className="font-haas text-[9px] tracking-[0.15em] text-white/50 uppercase">actif</span>
                    </span>
                </div>
            </div>

            {/* ── CENTER : animation unique par card ── */}
            <div className="py-4 sm:py-6">
                <CardAnim />
            </div>

            {/* ── BOTTOM : tabs + description ── */}
            <div>
                <div className="flex flex-wrap gap-x-5 lg:gap-x-8 gap-y-3 mb-5 lg:mb-7 border-b border-white/[0.06] pb-4">
                    {service.tabs.map((tab, i) => (
                        <button
                            key={i}
                            onMouseEnter={playHover}
                            onClick={() => { playClick(); setActiveTab(i); }}
                            className="relative pb-1.5 cursor-pointer"
                        >
                            <span
                                className={`font-haas font-medium transition-colors duration-200 ${activeTab === i ? 'text-white' : 'text-[#555]'}`}
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

                <div className="flex items-start gap-4 sm:gap-5">
                    <div className="relative w-10 h-10 sm:w-11 sm:h-11 border border-white/15 rounded-full flex items-center justify-center bg-[#1a1a1a] overflow-hidden flex-shrink-0">
                        <div
                            ref={eyeRef}
                            className="w-4 h-4 bg-white rounded-full"
                            style={{ willChange: 'transform', boxShadow: '0 0 10px rgba(255,255,255,0.5)' }}
                        />
                    </div>
                    <div className="min-h-[60px] sm:min-h-[76px]">
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

// ═══════════════════════════════════════════════════════════
// ServicesSection
// ═══════════════════════════════════════════════════════════
export function ServicesSection() {
    const [services, setServices] = useState<Service[]>([]);

    useEffect(() => {
        const prefix = typeof window !== 'undefined' && window.location.hostname.includes('github.io')
            ? '/alhambra-web' : '';
        fetch(`${prefix}/data/services.json`)
            .then(r => r.json())
            .then(setServices)
            .catch(err => console.error('Erreur services:', err));
    }, []);

    const words1 = 'Une agence digitale atypique concentrée sur'.split(' ');
    const words2 = 'la transformation de votre vision en expérience.'.split(' ');

    return (
        <section className="w-full px-4 sm:px-8 lg:px-16 py-16 sm:py-24 lg:py-32 font-haas" id="services" aria-label="Services — Design, Expérience Digitale, Développement, Growth">
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
                                {w === 'atypique'
                                    ? <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9C9C9C] via-[#666] to-[#9C9C9C]">{w}</span>
                                    : w}
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
