'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const EASE_POWER: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_SHARP: [number, number, number, number] = [0.76, 0, 0.24, 1];

const STEPS = [
    { id: 'service',  tag: 'Team Up',    question: 'How can we help you?',      type: 'multi',    options: ['Branding', 'Website', 'App', 'Marketing', 'Animation', 'Design'],    key: 'services'  },
    { id: 'goal',     tag: 'Vision',     question: "What's your primary goal?",  type: 'single',   options: ['New Launch', 'Growth', 'Conversion', 'Modernisation', 'Build Scratch'], key: 'goal'      },
    { id: 'audience', tag: 'Target',     question: 'Who are you reaching?',      type: 'single',   options: ['B2B', 'B2C', 'Both', 'Niche'],                                        key: 'audience'  },
    { id: 'timeline', tag: 'Speed',      question: "What's the timeline?",       type: 'single',   options: ['ASAP', '1–2 Months', '3–6 Months', '6+ Months'],                     key: 'timeline'  },
    { id: 'budget',   tag: 'Investment', question: 'Budget range?',              type: 'single',   options: ['< €5k', '€5k – €15k', '€15k – €50k', '> €50k'],                     key: 'budget'    },
    { id: 'extra',    tag: 'Details',    question: 'Anything else?',             type: 'textarea', placeholder: 'Links, competitors, inspirations…',                                key: 'extra'     },
] as const;

const CALL_SLOTS = [
    'Mon 14 Apr\n10:00', 'Mon 14 Apr\n14:00', 'Tue 15 Apr\n11:00', 'Tue 15 Apr\n16:00',
    'Wed 16 Apr\n09:00', 'Wed 16 Apr\n15:00', 'Thu 17 Apr\n10:00', 'Fri 18 Apr\n11:00',
];

const NAV_LINKS = [
    { label: 'Work',     href: '#work'     },
    { label: 'About',    href: '#about'    },
    { label: 'Services', href: '#services' },
    { label: 'Contact',  href: '#contact'  },
];

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type Answers  = Record<string, string | string[]>;
type FormData = { name: string; contact: string };

interface StepQuestionProps {
    step:        typeof STEPS[number];
    stepIndex:   number;
    totalSteps:  number;
    answers:     Answers;
    onAnswer:    (key: string, val: string | string[]) => void;
    onNext:      () => void;
    onBack:      () => void;
}

interface QuoteDisplayProps {
    quoteRaw:  string;
    onBook:    () => void;
    onRestart: () => void;
}

interface BookCallProps {
    formData:        FormData;
    setFormData:     React.Dispatch<React.SetStateAction<FormData>>;
    onConfirm:       () => void;
    onBack:          () => void;
    booked:          boolean;
    selectedSlot:    number | null;
    setSelectedSlot: React.Dispatch<React.SetStateAction<number | null>>;
    projectAnswers:  Answers;
}

interface MagneticButtonProps {
    children:   React.ReactNode;
    className?: string;
    onClick?:   () => void;
    strength?:  number;
    disabled?:  boolean;
}

// ─────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────

const IconRocket = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3" />
        <path d="M12 15v5s3.03-.55 5-2c2.2-1.62 3-5 3-5" />
    </svg>
);

const IconSparkles = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" /><path d="M3 5h4" /><path d="M21 17v4" /><path d="M19 19h4" />
    </svg>
);

const IconMessage = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
    </svg>
);

const IconCheckCircle = () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

// ─────────────────────────────────────────────
// Shared UI primitives
// ─────────────────────────────────────────────

const MaskText = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
    <div className={`overflow-hidden ${className}`}>
        <motion.div initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1, ease: EASE_POWER, delay }}>
            {children}
        </motion.div>
    </div>
);

const MagneticButton = ({ children, className = '', onClick, strength = 0.3, disabled = false }: MagneticButtonProps) => {
    const ref     = useRef<HTMLButtonElement>(null);
    const x       = useMotionValue(0);
    const y       = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 150, damping: 15 });
    const springY = useSpring(y, { stiffness: 150, damping: 15 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (disabled || !ref.current) return;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        x.set((e.clientX - (left + width / 2)) * strength);
        y.set((e.clientY - (top + height / 2)) * strength);
    };

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            onClick={onClick}
            disabled={disabled}
            style={{ x: springX, y: springY }}
            className={className}
        >
            {children}
        </motion.button>
    );
};

/** Reusable close button — consistent across all overlays */
const CloseButton = ({ onClick, label = 'Close' }: { onClick: () => void; label?: string }) => (
    <MagneticButton onClick={onClick} className="flex items-center bg-black pl-8 pr-2 py-2 rounded-full group shadow-2xl">
        <span className="text-white text-[12px] tracking-[0.2em] font-bold mr-10 uppercase font-haas">{label}</span>
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:rotate-180 transition-transform duration-700 pointer-events-none">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
        </div>
    </MagneticButton>
);

// ─────────────────────────────────────────────
// API call (outside component — stable reference)
// ─────────────────────────────────────────────

async function callClaude(answers: Answers): Promise<string> {
    const userMsg = Object.entries(answers)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
        .join('\n');

    const system = `You are SOHub's expert project estimator.
Given a client's answers, generate a detailed personalised estimate.
Return ONLY valid JSON (no markdown, no backticks, no preamble) with this exact structure:
{"headline":"short punchy title (2-6 words)","summary":"2 sentence personalised summary of what SOHub will do","deliverables":[{"name":"...","description":"1-2 sentences of what's included","price":"€X,XXX","duration":"X weeks"}],"total":"€XX,XXX – €XX,XXX","totalDuration":"X–X weeks","insight":"one sharp strategic recommendation"}
Tailor everything to their answers.`;

    try {
        const res  = await fetch('https://api.anthropic.com/v1/messages', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, system, messages: [{ role: 'user', content: userMsg }] }),
        });
        const data = await res.json();
        return data.content?.[0]?.text ?? '';
    } catch {
        return JSON.stringify({
            headline:     'Custom AI Strategy',
            summary:      "We've engineered a bespoke project roadmap based on your unique goals and target audience.",
            deliverables: [
                { name: 'Architecture & UX', description: 'Deep structural planning and user journey mapping.',  price: '€3,500', duration: '2 weeks' },
                { name: 'High-End Design',   description: 'Premium visual identity and interface execution.',     price: '€6,500', duration: '3 weeks' },
                { name: 'System Delivery',   description: 'Production-grade development and deployment.',         price: '€9,000', duration: '4 weeks' },
            ],
            total: '€19,000 – €24,000', totalDuration: '9–11 weeks',
            insight: 'Prioritize mobile responsiveness to capture your core audience segments.',
        });
    }
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
    return (
        <div className="w-full flex gap-2 mb-10">
            {Array.from({ length: total }).map((_, i) => (
                <div key={i} className="h-[3px] flex-1 rounded-full bg-black/5 overflow-hidden">
                    {i < current && (
                        <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} transition={{ duration: 0.8, ease: EASE_SHARP }} className="h-full bg-[#1A1E23]" />
                    )}
                </div>
            ))}
        </div>
    );
}

function StepQuestion({ step, stepIndex, totalSteps, answers, onAnswer, onNext, onBack }: StepQuestionProps) {
    const cur     = answers[step.key];
    const canNext = step.type === 'textarea' ? true : step.type === 'multi' ? (cur as string[])?.length > 0 : !!cur;
    const isLast  = stepIndex === totalSteps - 1;

    const handleOptionClick = (opt: string) => {
        if (step.type === 'multi') {
            const prev = (cur as string[]) || [];
            onAnswer(step.key, prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt]);
        } else {
            onAnswer(step.key, opt);
        }
    };

    return (
        <motion.div key={step.id} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.8, ease: EASE_SHARP }}>
            <ProgressBar current={stepIndex + 1} total={totalSteps} />
            <p className="text-center text-[12px] tracking-[0.4em] uppercase text-black/35 mb-4 font-haas font-bold">
                {step.tag} — {stepIndex + 1}/{totalSteps}
            </p>
            <h3 className="text-[clamp(32px,5.5vw,72px)] font-bold text-black text-center mb-12 leading-[1] tracking-tighter font-haas">
                {step.question}
            </h3>

            {step.type === 'textarea' ? (
                <div className="max-w-xl mx-auto mb-10">
                    <textarea
                        rows={4}
                        placeholder={'placeholder' in step ? step.placeholder : ''}
                        value={(cur as string) || ''}
                        onChange={e => onAnswer(step.key, e.target.value)}
                        className="w-full px-7 py-5 rounded-[28px] border-2 border-[#1A1E23] bg-transparent text-[16px] font-semibold outline-none resize-none placeholder:text-black/25 text-black font-haas"
                    />
                </div>
            ) : (
                <div className="flex flex-wrap gap-4 justify-center mb-12">
                    {'options' in step && step.options.map(opt => {
                        const selected = step.type === 'multi' ? (cur as string[])?.includes(opt) : cur === opt;
                        return (
                            <button
                                key={opt}
                                onClick={() => handleOptionClick(opt)}
                                className={`px-8 py-5 rounded-full text-[15px] font-bold font-haas transition-all duration-300 border-2 border-[#1A1E23] ${
                                    selected ? 'bg-white text-[#1A1E23] scale-105 shadow-xl' : 'bg-[#1A1E23] text-white hover:scale-105'
                                }`}
                            >
                                {opt}
                            </button>
                        );
                    })}
                </div>
            )}

            <div className="flex justify-between items-center px-4">
                <button onClick={onBack} className="text-[12px] text-black/40 font-bold font-haas uppercase tracking-[0.2em] underline hover:text-black transition-colors">
                    ← Back
                </button>
                {canNext && (
                    <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onClick={onNext} className="flex items-center gap-3 px-10 py-5 bg-[#1A1E23] text-white rounded-full text-[12px] font-bold font-haas tracking-[0.2em] hover:scale-105 transition-all shadow-lg">
                        {isLast ? 'GENERATE MY QUOTE →' : 'CONTINUE →'}
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}

function QuoteDisplay({ quoteRaw, onBook, onRestart }: QuoteDisplayProps) {
    let parsed: any = null;
    try { parsed = JSON.parse(quoteRaw.replace(/```json|```/g, '').trim()); } catch { parsed = null; }

    if (!parsed) return (
        <div className="text-center py-10">
            <p className="text-black/60 text-[16px] font-haas leading-relaxed">{quoteRaw}</p>
            <button onClick={onBook} className="mt-8 px-10 py-5 bg-[#1A1E23] text-white rounded-full text-[13px] font-bold font-haas tracking-[0.2em] hover:scale-105 transition-all">
                BOOK A CALL →
            </button>
        </div>
    );

    return (
        <motion.div key="quote" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-center text-[12px] tracking-[0.4em] uppercase text-black/35 mb-4 font-haas font-bold">Your personalised estimate</p>
            <h3 className="text-[clamp(32px,5.5vw,72px)] font-bold text-black text-center mb-4 leading-[1] tracking-tighter font-haas">{parsed.headline}</h3>
            <p className="text-center text-black/50 text-[18px] mb-12 max-w-2xl mx-auto font-haas leading-relaxed">{parsed.summary}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                {(parsed.deliverables || []).map((d: any, i: number) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }} className="bg-white/70 rounded-[24px] p-6 border border-black/10 shadow-sm">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                                <p className="font-bold text-[17px] text-black mb-2 font-haas">{d.name}</p>
                                <p className="text-[14px] text-black/50 font-haas">{d.description}</p>
                            </div>
                            <div className="shrink-0 text-right">
                                <p className="font-bold text-[16px] text-black font-haas">{d.price}</p>
                                <p className="text-[12px] text-black/40 font-haas">{d.duration}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="flex justify-between items-center bg-[#1A1E23] text-white rounded-[28px] px-10 py-8 mb-8 shadow-2xl">
                <div>
                    <p className="text-[12px] uppercase text-white/40 mb-2">Total</p>
                    <p className="text-[32px] font-bold tracking-tighter font-haas">{parsed.total}</p>
                </div>
                <div className="text-right">
                    <p className="text-[12px] uppercase text-white/40 mb-2">Timeline</p>
                    <p className="text-[22px] font-bold font-haas">{parsed.totalDuration}</p>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <button onClick={onRestart} className="text-[12px] text-black/40 font-bold uppercase tracking-[0.2em] underline hover:text-black">
                    Restart
                </button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onBook} className="px-12 py-6 bg-[#1A1E23] text-white rounded-full text-[14px] font-bold tracking-[0.2em] shadow-xl">
                    BOOK A CALL →
                </motion.button>
            </div>
        </motion.div>
    );
}

function BookCall({ formData, setFormData, onConfirm, onBack, booked, selectedSlot, setSelectedSlot, projectAnswers }: BookCallProps) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = useCallback(async () => {
        if (selectedSlot === null || !formData.name || !formData.contact) return;
        setLoading(true);
        try {
            await fetch('/api/bookings.php', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ fname: formData.name, email: formData.contact, message: `BOOKING: ${CALL_SLOTS[selectedSlot]}\nContext: ${JSON.stringify(projectAnswers)}`, service: 'Discovery Call' }),
            });
        } catch (e) { console.error(e); }
        finally { setLoading(false); onConfirm(); }
    }, [selectedSlot, formData, projectAnswers, onConfirm]);

    if (booked) {
        const label = (CALL_SLOTS[selectedSlot ?? 0] || '').replace('\n', ' — ');
        return (
            <motion.div key="booked" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-24 gap-12">
                <div className="relative">
                    <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 10, delay: 0.3 }} className="text-black">
                        <IconCheckCircle />
                    </motion.div>
                    <motion.div animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 border-2 border-dashed border-black/10 rounded-full -m-12" />
                </div>
                <div className="space-y-6">
                    <MaskText className="flex justify-center">
                        <h3 className="text-[clamp(40px,8vw,120px)] font-bold text-black italic leading-[0.9] tracking-tighter font-haas">Confirmed.</h3>
                    </MaskText>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-black/40 text-[24px] max-w-xl font-haas leading-tight mx-auto">
                        Your strategy call for <span className="text-black font-bold">{label}</span> is locked.
                        A briefing will be sent to <span className="text-black font-bold">{formData.contact}</span>.
                    </motion.p>
                </div>
                <MagneticButton onClick={onBack} className="mt-10 text-[14px] font-bold uppercase tracking-[0.4em] text-black/30 hover:text-black transition-colors underline underline-offset-8">
                    Change Details
                </MagneticButton>
            </motion.div>
        );
    }

    const canConfirm = selectedSlot !== null && !!formData.name && !!formData.contact;

    return (
        <motion.div key="book" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.8, ease: EASE_SHARP }} className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-24">
                <MaskText className="flex justify-center mb-6">
                    <p className="text-[14px] tracking-[0.6em] uppercase text-black/30 font-bold font-haas">Final Action</p>
                </MaskText>
                <MaskText className="flex justify-center mb-10">
                    <h3 className="text-[clamp(40px,7vw,110px)] font-bold text-black leading-[0.9] tracking-tighter font-haas italic">Choose your moment.</h3>
                </MaskText>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-black/40 text-[24px] font-haas max-w-2xl mx-auto leading-tight">
                    Select a slot to define your project's trajectory with our lead strategist.
                </motion.p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                {CALL_SLOTS.map((s, i) => {
                    const [day, time] = s.split('\n');
                    const isSelected  = selectedSlot === i;
                    return (
                        <motion.button key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05, ease: EASE_POWER }} onClick={() => setSelectedSlot(i)}
                                       className={`group relative py-10 px-6 rounded-[40px] transition-all duration-700 border-2 flex flex-col items-center gap-4 ${
                                           isSelected
                                               ? 'bg-[#1A1E23] border-[#1A1E23] text-white scale-[1.08] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] z-10'
                                               : 'bg-white/40 border-transparent text-[#1A1E23] hover:border-black/10 hover:bg-white hover:scale-[1.03]'
                                       }`}
                        >
                            <span className={`text-[12px] uppercase tracking-[0.3em] font-bold ${isSelected ? 'text-white/30' : 'text-black/20'}`}>{day}</span>
                            <span className="text-[28px] font-bold font-haas tracking-tighter">{time}</span>
                            {isSelected && (
                                <motion.div layoutId="slotIndicator" className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-xl">
                                    <div className="w-3 h-3 bg-[#1A1E23] rounded-full" />
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                <div className="space-y-4">
                    <label className="text-[12px] uppercase tracking-[0.4em] font-bold text-black/30 ml-8">Identification</label>
                    <input placeholder="How should we call you?" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full px-12 py-8 rounded-[40px] border-2 border-black/5 bg-white text-[22px] font-bold font-haas outline-none focus:border-black/20 transition-all shadow-sm" />
                </div>
                <div className="space-y-4">
                    <label className="text-[12px] uppercase tracking-[0.4em] font-bold text-black/30 ml-8">Reach Out</label>
                    <input placeholder="Email or WhatsApp" value={formData.contact} onChange={e => setFormData(p => ({ ...p, contact: e.target.value }))} className="w-full px-12 py-8 rounded-[40px] border-2 border-black/5 bg-white text-[22px] font-bold font-haas outline-none focus:border-black/20 transition-all shadow-sm" />
                </div>
            </motion.div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-12 mb-20">
                <MagneticButton onClick={onBack} className="text-[14px] text-black/30 font-bold uppercase tracking-[0.3em] hover:text-black transition-colors underline underline-offset-8 decoration-black/5">
                    ← Back to Quote
                </MagneticButton>
                <MagneticButton onClick={handleConfirm} disabled={!canConfirm || loading}
                                className={`group flex items-center gap-10 px-16 py-10 rounded-full text-[16px] font-bold tracking-[0.3em] transition-all duration-700 shadow-2xl ${
                                    canConfirm
                                        ? 'bg-[#1A1E23] text-white cursor-pointer hover:bg-black hover:shadow-[0_40px_100px_-15px_rgba(0,0,0,0.6)]'
                                        : 'bg-black/5 text-black/10 cursor-not-allowed shadow-none'
                                }`}
                >
                    <span>{loading ? 'SECURING MOMENT...' : 'LOCK IN CALL'}</span>
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${canConfirm ? 'bg-white/10 group-hover:bg-white/20' : 'bg-black/5'}`}>
                        {loading
                            ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        }
                    </div>
                </MagneticButton>
            </div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────

export function HeroSection() {
    const [menuOpen,       setMenuOpen]       = useState(false);
    const [chatOpen,       setChatOpen]       = useState(false);
    const [logoGone,       setLogoGone]       = useState(false);
    const [mainFlow,       setMainFlow]       = useState<string | null>(null);
    const [projectStep,    setProjectStep]    = useState(0);
    const [projectAnswers, setProjectAnswers] = useState<Answers>({});
    const [aiQuote,        setAiQuote]        = useState<string | null>(null);
    const [aiLoading,      setAiLoading]      = useState(false);
    const [formData,       setFormData]       = useState<FormData>({ name: '', contact: '' });
    const [selectedSlot,   setSelectedSlot]   = useState<number | null>(null);
    const [calBooked,      setCalBooked]      = useState(false);

    const titleLetters = 'sohub'.split('');

    // hide logo on scroll
    useEffect(() => {
        const onScroll = () => setLogoGone(window.scrollY > 80);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // lock body scroll when any overlay is open
    useEffect(() => {
        document.body.style.overflow = menuOpen || chatOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen, chatOpen]);

    const closeChat = useCallback(() => {
        setChatOpen(false);
        setTimeout(() => {
            setMainFlow(null); setProjectStep(0); setProjectAnswers({});
            setAiQuote(null);  setAiLoading(false);
            setFormData({ name: '', contact: '' }); setSelectedSlot(null); setCalBooked(false);
        }, 800);
    }, []);

    // close overlays on Escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return;
            if (chatOpen) closeChat();
            else if (menuOpen) setMenuOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [chatOpen, menuOpen, closeChat]);

    const generateQuote = useCallback(async () => {
        setAiLoading(true);
        setProjectStep(STEPS.length);
        const result = await callClaude(projectAnswers);
        setAiQuote(result);
        setAiLoading(false);
        setProjectStep(STEPS.length + 1);
    }, [projectAnswers]);

    const handleAnswer    = useCallback((key: string, val: string | string[]) => setProjectAnswers(prev => ({ ...prev, [key]: val })), []);
    const handleStepNext  = useCallback(() => { projectStep < STEPS.length - 1 ? setProjectStep(s => s + 1) : generateQuote(); }, [projectStep, generateQuote]);
    const handleStepBack  = useCallback(() => { projectStep === 0 ? setMainFlow(null) : setProjectStep(s => s - 1); }, [projectStep]);

    const floatingAnimation = { y: ['0%', '-3%', '0%'], rotate: [-1, 1, -1], transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' as any } };

    return (
        <section className="relative w-full h-screen bg-[#F8F8F8] overflow-hidden font-haas selection:bg-black selection:text-white">

            {/* Glassmorphism blur bottom */}
            <div className="absolute bottom-0 left-0 w-full h-[93px] z-30 pointer-events-none bg-gradient-to-b from-white/4 to-transparent backdrop-blur-[10px] blur-sm" />

            {/* ── HEADER NAV ── */}
            <motion.nav
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: EASE_POWER, delay: 0.5 }}
                className="fixed top-0 left-0 w-full px-16 py-10 flex justify-between items-center z-[100]"
            >
                {/* Logo */}
                <div className="overflow-hidden h-[3vw]" style={{ pointerEvents: logoGone ? 'none' : 'auto' }}>
                    <motion.div className="text-[2.5vw] font-nordique text-black tracking-tighter cursor-pointer" animate={{ y: logoGone ? '-120%' : '0%' }} transition={{ duration: 0.9, ease: EASE_SHARP }}>
                        sohub
                    </motion.div>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-8">
                    {/* Chat */}
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setChatOpen(true)} className="flex items-center bg-[#E8E8E8] pl-8 pr-2 py-2 rounded-full cursor-pointer group transition-colors hover:bg-[#E0E0E0]">
                        <span className="font-haas text-[15px] tracking-[0.2em] text-black uppercase font-bold mr-6">CHAT WITH SOHUB</span>
                        <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm pointer-events-none">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                        </div>
                    </motion.button>

                    {/* Menu toggle */}
                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => setMenuOpen(o => !o)}
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={menuOpen}
                        className="flex items-center bg-black pl-9 pr-2 py-2 rounded-full cursor-pointer shadow-lg group relative overflow-hidden"
                    >
                        <span className="font-haas text-[15px] tracking-[0.2em] font-bold text-transparent select-none pointer-events-none mr-12 uppercase">CLOSE</span>
                        <motion.span className="text-white font-haas text-[15px] tracking-[0.2em] font-bold absolute left-9 pointer-events-none" animate={{ y: menuOpen ? -22 : 0, opacity: menuOpen ? 0 : 1 }} transition={{ duration: 0.35, ease: EASE_POWER }}>MENU</motion.span>
                        <motion.span className="text-white font-haas text-[15px] tracking-[0.2em] font-bold absolute left-9 pointer-events-none" animate={{ y: menuOpen ? 0 : 22, opacity: menuOpen ? 1 : 0 }} transition={{ duration: 0.35, ease: EASE_POWER }}>CLOSE</motion.span>
                        <div className="flex gap-2 bg-[#282828] w-[60px] h-10 rounded-full items-center justify-center transition-colors group-hover:bg-[#333] pointer-events-none">
                            <motion.span className="w-2 h-2 bg-white rounded-full block"
                                         animate={menuOpen ? { rotate: 45, x: 5, y: 5 } : { rotate: 0, x: 0, y: 0, opacity: [1, 0.4, 1] }}
                                         transition={menuOpen ? { duration: 0.4, ease: EASE_POWER } : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            />
                            <motion.span className="w-2 h-2 rounded-full block"
                                         animate={{ rotate: menuOpen ? -45 : 0, x: menuOpen ? 5 : 0, y: menuOpen ? -5 : 0, backgroundColor: menuOpen ? '#ffffff' : '#555555' }}
                                         transition={{ duration: 0.4, ease: EASE_POWER }}
                            />
                        </div>
                    </motion.button>
                </div>
            </motion.nav>

            {/* ── MENU OVERLAY ── */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        className="fixed inset-0 z-[200] bg-[#1A1E23] font-haas overflow-hidden"
                        initial={{ clipPath: 'circle(0% at calc(100% - 80px) 60px)' }}
                        animate={{ clipPath: 'circle(150% at calc(100% - 80px) 60px)' }}
                        exit={{ clipPath: 'circle(0% at calc(100% - 80px) 60px)' }}
                        transition={{ duration: 1.2, ease: EASE_SHARP }}
                    >
                        {/* Grain texture */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat', backgroundSize: '128px' }} />

                        {/* Decorative letter */}
                        <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 0.03, x: 0 }} transition={{ duration: 1.4, ease: EASE_POWER, delay: 0.3 }} className="absolute right-[-5vw] bottom-[-5vw] text-[40vw] font-nordique text-white leading-none select-none pointer-events-none">s</motion.div>

                        {/* Header row with close button */}
                        <div className="absolute top-0 left-0 w-full px-16 py-10 flex justify-between items-center z-10">
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-[11px] font-bold tracking-[0.4em] uppercase text-white/20 font-haas">
                                Navigation
                            </motion.p>
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6, ease: EASE_POWER }}>
                                <CloseButton onClick={() => setMenuOpen(false)} />
                            </motion.div>
                        </div>

                        <div className="h-full flex flex-col justify-between px-16 md:px-24 py-32">
                            {/* Nav links */}
                            <nav className="flex flex-col gap-0 mt-8">
                                {NAV_LINKS.map((item, i) => (
                                    <motion.a
                                        key={item.label}
                                        href={item.href}
                                        initial={{ opacity: 0, x: -60 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -40 }}
                                        transition={{ delay: 0.25 + i * 0.08, duration: 0.9, ease: EASE_POWER }}
                                        onClick={() => setMenuOpen(false)}
                                        className="group flex items-center gap-8 border-b border-white/[0.07] py-6 md:py-8"
                                    >
                                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.08 }} className="text-[11px] font-bold tracking-[0.4em] text-white/20 w-8 font-haas uppercase">
                                            0{i + 1}
                                        </motion.span>
                                        <span className="text-[clamp(40px,7vw,100px)] font-bold font-nordique text-white leading-[1] tracking-tighter uppercase group-hover:text-white/30 transition-colors duration-500">
                                            {item.label}
                                        </span>
                                        <span className="ml-auto text-white/20 text-[32px] translate-x-[-10px] group-hover:translate-x-0 group-hover:text-white/60 transition-all duration-500">→</span>
                                    </motion.a>
                                ))}
                            </nav>

                            {/* Footer */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8, ease: EASE_POWER }} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                                <div className="space-y-3">
                                    <p className="text-[11px] font-bold tracking-[0.4em] uppercase text-white/20 font-haas">Find us</p>
                                    <div className="flex gap-8">
                                        {['Instagram', 'LinkedIn', 'Twitter'].map(s => (
                                            <a key={s} href="#" className="font-bold text-[13px] text-white/40 uppercase tracking-[0.2em] hover:text-white transition-colors font-haas">{s}</a>
                                        ))}
                                    </div>
                                </div>
                                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => { setMenuOpen(false); setChatOpen(true); }} className="flex items-center gap-4 bg-white text-[#1A1E23] pl-10 pr-3 py-3 rounded-full font-bold font-haas text-[13px] tracking-[0.2em] uppercase shadow-2xl hover:bg-white/90 transition-colors">
                                    Start a project
                                    <div className="w-10 h-10 bg-[#1A1E23] rounded-full flex items-center justify-center">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                    </div>
                                </motion.button>
                                <p className="text-[11px] font-bold text-white/10 tracking-[0.2em] uppercase font-haas">© 2026 SOHUB STUDIO</p>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── CONTACT OVERLAY ── */}
            <AnimatePresence>
                {chatOpen && (
                    <motion.div
                        className="fixed inset-0 z-[300] bg-[#F8F8F8] font-haas overflow-hidden selection:bg-black selection:text-white"
                        initial={{ clipPath: 'circle(0% at 85% 10%)' }}
                        animate={{ clipPath: 'circle(150% at 85% 10%)' }}
                        exit={{ clipPath: 'circle(0% at 85% 10%)' }}
                        transition={{ duration: 1.2, ease: EASE_SHARP }}
                    >
                        <div className="absolute top-0 left-0 w-full px-16 py-10 flex justify-between items-center z-[340] bg-[#F8F8F8]">
                            <div className="text-[11px] font-bold tracking-[0.4em] uppercase text-black/40">Inquiry collective</div>
                            <CloseButton onClick={closeChat} />
                        </div>

                        <div className="h-full w-full overflow-y-auto pt-40 pb-20 px-16 overscroll-contain" data-lenis-prevent>
                            <div className="min-h-full flex flex-col">
                                <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-32">
                                    <div className="flex-1">
                                        <MaskText className="text-[20vw] font-nordique text-black leading-[0.85] tracking-tighter">CONTACT</MaskText>
                                        <MaskText delay={0.2} className="text-[3vw] text-black font-nordique leading-[1] mt-10 italic uppercase">Let's build<br />your history.</MaskText>
                                    </div>
                                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 1.2 }} className="w-[450px]">
                                        <img src="/image%201.png" alt="Robot" className="w-full h-auto filter grayscale-[0.5] hover:grayscale-0 transition-all duration-1000" />
                                    </motion.div>
                                </div>

                                <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8, duration: 1, ease: EASE_POWER }} className="bg-[#E9EBEF] rounded-[60px] p-24 mb-40 relative overflow-hidden">
                                    <AnimatePresence mode="wait">
                                        {!mainFlow && (
                                            <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                                <h3 className="text-[clamp(48px,9vw,130px)] text-black text-center mb-8 leading-[0.85] tracking-tighter font-bold font-haas italic uppercase">Hey There!</h3>
                                                <p className="text-center text-black/40 text-[clamp(20px,2.5vw,32px)] mb-20 font-haas leading-tight max-w-4xl mx-auto uppercase">Pick the pathway that fits — we'll take it from there.</p>
                                                <div className="flex flex-wrap gap-8 justify-center">
                                                    {[
                                                        { id: 'project', label: 'Start Project', sub: 'Personalised AI Strategy', Icon: IconRocket  },
                                                        { id: 'join',    label: 'Join Us',       sub: 'Work with us',            Icon: IconSparkles },
                                                        { id: 'hi',      label: 'Say Hi',        sub: 'General inquiries',       Icon: IconMessage  },
                                                    ].map(({ id, label, sub, Icon }) => (
                                                        <MagneticButton key={id} onClick={() => { setMainFlow(id); setProjectStep(0); }} className="flex flex-col items-start gap-6 px-14 py-12 bg-[#1A1E23] text-white rounded-[50px] text-left hover:scale-[1.02] transition-all min-w-[340px] shadow-2xl group">
                                                            <span className="text-white/40 group-hover:text-white transition-colors scale-125 pointer-events-none"><Icon /></span>
                                                            <div className="space-y-2 pointer-events-none">
                                                                <span className="text-[28px] font-bold block tracking-tight leading-none uppercase">{label}</span>
                                                                <span className="text-[16px] text-white/30 block tracking-wide uppercase">{sub}</span>
                                                            </div>
                                                        </MagneticButton>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}

                                        {mainFlow === 'project' && projectStep < STEPS.length && (
                                            <StepQuestion
                                                key={`step-${projectStep}`}
                                                step={STEPS[projectStep]}
                                                stepIndex={projectStep}
                                                totalSteps={STEPS.length}
                                                answers={projectAnswers}
                                                onAnswer={handleAnswer}
                                                onNext={handleStepNext}
                                                onBack={handleStepBack}
                                            />
                                        )}

                                        {mainFlow === 'project' && projectStep === STEPS.length && aiLoading && (
                                            <motion.div key="loading" className="flex flex-col items-center justify-center py-40 gap-12">
                                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} className="w-32 h-32 border-2 border-dashed border-black/10 rounded-full" />
                                                <p className="text-[14px] text-black/30 font-bold font-haas tracking-[0.6em] uppercase">Calculating Strategy...</p>
                                            </motion.div>
                                        )}

                                        {mainFlow === 'project' && projectStep === STEPS.length + 1 && aiQuote && (
                                            <QuoteDisplay key="quote" quoteRaw={aiQuote} onBook={() => setProjectStep(STEPS.length + 2)} onRestart={() => { setMainFlow(null); setProjectStep(0); setProjectAnswers({}); setAiQuote(null); }} />
                                        )}

                                        {mainFlow === 'project' && projectStep === STEPS.length + 2 && (
                                            <BookCall key="book" formData={formData} setFormData={setFormData} selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} booked={calBooked} projectAnswers={projectAnswers} onBack={() => setProjectStep(STEPS.length + 1)} onConfirm={() => setCalBooked(true)} />
                                        )}

                                        {mainFlow === 'join' && (
                                            <motion.div key="join" className="text-center py-20">
                                                <h3 className="text-[clamp(40px,7vw,110px)] font-bold mb-10 uppercase italic">Join Us</h3>
                                                <button onClick={() => setMainFlow(null)} className="underline uppercase text-black/40 font-bold tracking-widest">Back</button>
                                            </motion.div>
                                        )}

                                        {mainFlow === 'hi' && (
                                            <motion.div key="hi" className="text-center py-20">
                                                <h3 className="text-[clamp(40px,7vw,110px)] font-bold mb-10 uppercase italic">Say Hi</h3>
                                                <button onClick={() => setMainFlow(null)} className="underline uppercase text-black/40 font-bold tracking-widest">Back</button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                <footer className="mt-auto py-16 border-t border-black/[0.05] flex flex-col md:flex-row justify-between items-center gap-10">
                                    <div className="flex gap-12">
                                        {['INSTAGRAM', 'LINKEDIN', 'TWITTER'].map(s => (
                                            <a key={s} href="#" className="font-bold text-[11px] text-black/30 uppercase tracking-[0.4em] hover:text-black transition-colors">{s}</a>
                                        ))}
                                    </div>
                                    <div className="text-[12px] font-bold text-black/10 tracking-[0.2em] uppercase">© 2026 SOHUB STUDIO — ALL RIGHTS RESERVED</div>
                                </footer>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── HERO CONTENT ── */}
            <div className="relative h-full flex items-center justify-center pointer-events-none">

                <motion.div
                    initial="initial" animate="animate"
                    variants={{ initial: { opacity: 0 }, animate: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}
                    className="absolute w-full ml-[20%] text-right z-0 flex justify-end overflow-hidden"
                >
                    {titleLetters.map((char, i) => (
                        <motion.span key={i} variants={{ initial: { y: '100%', opacity: 0 }, animate: { y: 0, opacity: 1, transition: { duration: 1.4, ease: EASE_POWER } } }} className="font-nordique text-[33vw] text-black leading-none inline-block select-none">
                            {char}
                        </motion.span>
                    ))}
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.8, y: 100 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 1.8, delay: 0.6, ease: EASE_POWER }} className="absolute ml-[20%] top-[20vw] z-20 w-[330px]">
                    <motion.img src="/image%201.png" alt="Robot" className="w-full h-auto" animate={floatingAnimation as any} />
                </motion.div>

                <div className="absolute w-full mt-[29%] ml-[50%] z-40">
                    <motion.p initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.5, delay: 1, ease: EASE_POWER }} className="font-haas text-[3vw] text-black leading-tight">
                        Your story builds<br />
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ duration: 1.5, delay: 1.4 }}>our history.</motion.span>
                    </motion.p>
                </div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.47 }} transition={{ duration: 1, delay: 2.2 }} className="absolute left-10 top-[80%] z-20">
                    <span className="font-haas text-[#232222] font-bold text-[32px] inline-block uppercase">Scroll</span>
                </motion.div>

            </div>
        </section>
    );
}