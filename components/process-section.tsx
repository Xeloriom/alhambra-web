'use client';

import React, { useRef, memo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Target, PenTool, Code2, Rocket } from 'lucide-react';

const STEPS = [
    { id: '01', title: 'STRATÉGIE', desc: 'Analyse chirurgicale de votre marché.', Icon: Target },
    { id: '02', title: 'DESIGN',    desc: "L'esthétique au service de la fonction.", Icon: PenTool },
    { id: '03', title: 'CODE',      desc: 'Performance native sans compromis.',     Icon: Code2 },
    { id: '04', title: 'IMPACT',    desc: 'Domination digitale et résultats.',       Icon: Rocket },
] as const;

const STEP_NUMS = ['01', '02', '03', '04'] as const;

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
            style={{ opacity, y, willChange: 'transform, opacity' }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
        >
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 mb-6 sm:mb-8 lg:mb-12 text-black/20">
                <Icon className="w-full h-full" strokeWidth={1} />
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.4em] sm:tracking-[0.5em] text-black/30 mb-4 sm:mb-6 uppercase">
                Phase — {step.id}
            </span>
            <h2
                className="font-bold tracking-tighter leading-[0.9] text-black mb-6 sm:mb-8 uppercase"
                style={{ fontSize: 'clamp(48px, 10vw, 160px)' }}
            >
                {step.title}
            </h2>
            <p
                className="font-medium text-black/40 max-w-lg italic"
                style={{ fontSize: 'clamp(14px, 1.5vw, 24px)' }}
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
    stepNumber: ReturnType<typeof useTransform>;
}) {
    const stripY = useTransform(stepNumber, (v) => (Math.round(v) - 1) * -52);

    return (
        <div className="absolute bottom-6 sm:bottom-10 lg:bottom-12 right-6 sm:right-10 lg:right-12 flex items-baseline font-bold tracking-tighter overflow-hidden h-[52px]">
            <motion.div
                style={{ y: stripY, willChange: 'transform' }}
                className="flex flex-col"
            >
                {STEP_NUMS.map((num) => (
                    <span key={num} className="text-4xl sm:text-5xl lg:text-6xl leading-[52px] text-black h-[52px]">
                        {num}
                    </span>
                ))}
            </motion.div>
            <span className="text-base sm:text-lg lg:text-xl text-black/20 ml-2 self-end mb-1">/ 04</span>
        </div>
    );
});
CounterStrip.displayName = 'CounterStrip';

export const ProcessSection = memo(function ProcessSection() {
    const containerRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    const smoothProgress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });

    const stepNumber = useTransform(
        smoothProgress,
        [0, 0.25, 0.5, 0.75, 1],
        [1, 2, 3, 4, 4],
    );

    return (
        <section ref={containerRef} className="relative h-[300vh] bg-white font-haas" id="process">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                <div className="relative w-full max-w-[90vw] h-full">
                    {STEPS.map((step, i) => (
                        <StepCard key={step.id} step={step} i={i} smoothProgress={smoothProgress} />
                    ))}
                </div>

                <CounterStrip stepNumber={stepNumber} />
            </div>
        </section>
    );
});

ProcessSection.displayName = 'ProcessSection';
