'use client';

import React, { useRef, memo } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { Target, PenTool, Code2, Rocket } from 'lucide-react';

const STEPS = [
    { id: '01', title: 'STRATÉGIE', desc: 'Analyse chirurgicale de votre marché.', Icon: Target },
    { id: '02', title: 'DESIGN',    desc: "L'esthétique au service de la fonction.", Icon: PenTool },
    { id: '03', title: 'CODE',      desc: 'Performance native sans compromis.',     Icon: Code2 },
    { id: '04', title: 'IMPACT',    desc: 'Domination digitale et résultats.',       Icon: Rocket },
] as const;

const STEP_NUMS = ['01', '02', '03', '04'] as const;
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ── Mobile: simple stacked steps ──────────────────────────────
const MobileStep = memo(function MobileStep({
    step,
    i,
}: {
    step: (typeof STEPS)[number];
    i: number;
}) {
    const { Icon } = step;
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.65, ease: EASE, delay: i * 0.07 }}
            className="py-10 flex flex-col gap-5 border-t border-black/8"
        >
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-[0.4em] text-black/30 uppercase">
                    Phase — {step.id}
                </span>
                <Icon className="w-6 h-6 text-black/15" strokeWidth={1} />
            </div>
            <h3
                className="font-bold tracking-tighter leading-[0.88] text-black uppercase"
                style={{ fontSize: 'clamp(52px, 13vw, 80px)' }}
            >
                {step.title}
            </h3>
            <p className="font-medium text-black/40 italic text-[14px] leading-relaxed max-w-[280px]">
                {step.desc}
            </p>
        </motion.div>
    );
});
MobileStep.displayName = 'MobileStep';

// ── Desktop: scroll-driven step ───────────────────────────────
const StepCard = memo(function StepCard({
    step,
    i,
    smoothProgress,
}: {
    step: (typeof STEPS)[number];
    i: number;
    smoothProgress: ReturnType<typeof useSpring>;
}) {
    const start = i * 0.25;
    const end   = (i + 1) * 0.25;

    const opacity = useTransform(
        smoothProgress,
        [start - 0.1, start, end - 0.1, end],
        [i === 0 ? 1 : 0, 1, 1, 0],
    );
    const y = useTransform(
        smoothProgress,
        [start - 0.1, start, end - 0.1, end],
        [i === 0 ? 0 : 40, 0, 0, -40],
    );

    const { Icon } = step;

    return (
        <motion.div
            style={{ opacity, y, willChange: 'transform' }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
        >
            <div className="w-12 h-12 lg:w-16 lg:h-16 mb-8 lg:mb-12 text-black/20">
                <Icon className="w-full h-full" strokeWidth={1} />
            </div>
            <span className="text-[10px] font-bold tracking-[0.5em] text-black/30 mb-6 uppercase">
                Phase — {step.id}
            </span>
            <p
                aria-hidden="true"
                className="font-bold tracking-tighter leading-[0.9] text-black mb-8 uppercase"
                style={{ fontSize: 'clamp(64px, 10vw, 160px)' }}
            >
                {step.title}
            </p>
            <p
                className="font-medium text-black/40 max-w-lg italic"
                style={{ fontSize: 'clamp(15px, 1.5vw, 24px)' }}
            >
                {step.desc}
            </p>
        </motion.div>
    );
});
StepCard.displayName = 'StepCard';

const CounterStrip = memo(function CounterStrip({
    stepNumber,
}: {
    stepNumber: MotionValue<number>;
}) {
    const stripY = useTransform(stepNumber, (v: number) => (Math.round(v) - 1) * -52);

    return (
        <div className="absolute bottom-10 lg:bottom-12 right-10 lg:right-12 flex items-baseline font-bold tracking-tighter overflow-hidden h-[52px]">
            <motion.div
                style={{ y: stripY, willChange: 'transform' }}
                className="flex flex-col"
            >
                {STEP_NUMS.map((num) => (
                    <span key={num} className="text-5xl lg:text-6xl leading-[52px] text-black h-[52px]">
                        {num}
                    </span>
                ))}
            </motion.div>
            <span className="text-lg lg:text-xl text-black/20 ml-2 self-end mb-1">/ 04</span>
        </div>
    );
});
CounterStrip.displayName = 'CounterStrip';

export const ProcessSection = memo(function ProcessSection() {
    const desktopRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: desktopRef,
        offset: ['start start', 'end end'],
    });

    const smoothProgress = useSpring(scrollYProgress, { stiffness: 260, damping: 45, restDelta: 0.001 });

    const stepNumber = useTransform(
        smoothProgress,
        [0, 0.25, 0.5, 0.75, 1],
        [1, 2, 3, 4, 4],
    );

    return (
        <section className="bg-white font-haas" id="process">

            {/* ── Mobile layout (< md) ─────────────────────── */}
            <div className="md:hidden px-6 py-16 sm:py-20">
                <motion.h3
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 0.5, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: EASE }}
                    className="block text-black text-[24px] sm:text-[28px] font-bold mb-10 sm:mb-12"
                >
                    Processus
                </motion.h3>
                <div className="flex flex-col">
                    {STEPS.map((step, i) => (
                        <MobileStep key={step.id} step={step} i={i} />
                    ))}
                </div>
            </div>

            {/* ── Desktop layout (≥ md) — sticky scroll ────── */}
            <div ref={desktopRef} className="hidden md:block relative h-[300vh]">
                <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                    <div className="relative w-full max-w-[90vw] h-full">
                        {STEPS.map((step, i) => (
                            <StepCard key={step.id} step={step} i={i} smoothProgress={smoothProgress} />
                        ))}
                    </div>
                    <CounterStrip stepNumber={stepNumber} />
                </div>
            </div>

        </section>
    );
});

ProcessSection.displayName = 'ProcessSection';
