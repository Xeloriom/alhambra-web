'use client';

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';

// ─────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────

const EASE_POWER: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_SHARP: [number, number, number, number] = [0.76, 0, 0.24, 1];

const basePath = process.env.NODE_ENV === 'production' ? '/alhambra-web' : '';

const STEPS = [
    { id: 'service',  tag: 'Équipe',    question: 'Comment vous aider ?',      type: 'multi',    options: ['Branding', 'Site Web', 'App', 'Marketing', 'Animation', 'Design'],    key: 'services'  },
    { id: 'goal',     tag: 'Vision',     question: "Votre objectif ?",           type: 'single',   options: ['Lancement', 'Croissance', 'Conversion', 'Modernisation', 'De Zéro'], key: 'goal'      },
    { id: 'audience', tag: 'Cible',      question: 'À qui parlez-vous ?',         type: 'single',   options: ['B2B', 'B2C', 'Les deux', 'Niche'],                                    key: 'audience'  },
    { id: 'timeline', tag: 'Délai',      question: "Quelle urgence ?",            type: 'single',   options: ['ASAP', '1–2 Mois', '3–6 Mois', '6+ Mois'],                        key: 'timeline'  },
    { id: 'budget',   tag: 'Budget',     question: 'Investissement ?',           type: 'single',   options: ['< 5k€', '5k – 15k€', '15k – 50k€', '> 50k€'],                     key: 'budget'    },
    { id: 'extra',    tag: 'Détails',    question: 'Un mot de plus ?',           type: 'textarea', placeholder: 'Liens, concurrents, inspirations…',                                key: 'extra'     },
] as const;

const CALL_SLOTS = [
    'Lun 14 Avr\n10:00', 'Lun 14 Avr\n14:00', 'Mar 15 Avr\n11:00', 'Mar 15 Avr\n16:00',
    'Mer 16 Avr\n09:00', 'Mer 16 Avr\n15:00', 'Jeu 17 Avr\n10:00', 'Ven 18 Avr\n11:00',
];

const NAV_LINKS = [
    { label: 'Projets',  href: '#work'     },
    { label: 'Agence',   href: '#about'    },
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

const MagneticButton = ({ children, className = '', onClick, strength = 0.3, disabled = false }: any) => {
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
            style={{ x: springX, y: springY, willChange: 'transform' }}
            className={className}
        >
            {children}
        </motion.button>
    );
};

const CloseButton = ({ onClick, label = 'Fermer' }: { onClick: () => void; label?: string }) => (
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
// Components
// ─────────────────────────────────────────────

const ProgressBar = memo(({ current, total }: { current: number; total: number }) => (
    <div className="w-full flex gap-2 mb-10">
        {Array.from({ length: total }).map((_, i) => (
            <div key={i} className="h-[3px] flex-1 rounded-full bg-black/5 overflow-hidden">
                {i < current && (
                    <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} transition={{ duration: 0.8, ease: EASE_SHARP }} className="h-full bg-[#1A1E23]" />
                )}
            </div>
        ))}
    </div>
));
ProgressBar.displayName = 'ProgressBar';

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
        <motion.div key={step.id} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.8, ease: EASE_SHARP }} className="will-change-transform">
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
                    ← Retour
                </button>
                {canNext && (
                    <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onClick={onNext} className="flex items-center gap-3 px-10 py-5 bg-[#1A1E23] text-white rounded-full text-[12px] font-bold font-haas tracking-[0.2em] hover:scale-105 transition-all shadow-lg">
                        {isLast ? 'GÉNÉRER LE DEVIS →' : 'CONTINUER →'}
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────

export function HeroSection() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [logoGone, setLogoGone] = useState(false);
    const [mainFlow, setMainFlow] = useState<string | null>(null);
    const [projectStep, setProjectStep] = useState(0);
    const [projectAnswers, setProjectAnswers] = useState<Answers>({});

    const titleLetters = 'sohub'.split('');

    useEffect(() => {
        const onScroll = () => setLogoGone(window.scrollY > 80);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const closeChat = useCallback(() => {
        setChatOpen(false);
        setTimeout(() => { setMainFlow(null); setProjectStep(0); setProjectAnswers({}); }, 800);
    }, []);

    const handleAnswer   = useCallback((key: string, val: string | string[]) => setProjectAnswers(prev => ({ ...prev, [key]: val })), []);
    const handleStepNext = useCallback(() => { if (projectStep < STEPS.length - 1) setProjectStep(s => s + 1); }, [projectStep]);
    const handleStepBack = useCallback(() => { projectStep === 0 ? setMainFlow(null) : setProjectStep(s => s - 1); }, [projectStep]);

    const floatingAnimation = { y: ['0%', '-3%', '0%'], rotate: [-1, 1, -1], transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' } };

    return (
        <section className="relative w-full h-screen bg-[#F8F8F8] overflow-hidden font-haas selection:bg-black selection:text-white">
            <div className="absolute bottom-0 left-0 w-full h-[93px] z-30 pointer-events-none bg-gradient-to-b from-white/4 to-transparent backdrop-blur-[10px] blur-sm" />

            <motion.nav initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, ease: EASE_POWER, delay: 0.5 }} className="fixed top-0 left-0 w-full px-16 py-10 flex justify-between items-center z-[100]">
                <div className="overflow-hidden h-[3vw]" style={{ pointerEvents: logoGone ? 'none' : 'auto' }}>
                    <motion.div className="text-[2.5vw] font-nordique text-black tracking-tighter cursor-pointer" animate={{ y: logoGone ? '-120%' : '0%' }} transition={{ duration: 0.9, ease: EASE_SHARP }}>sohub</motion.div>
                </div>

                <div className="flex items-center gap-8">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setChatOpen(true)} className="flex items-center bg-[#E8E8E8] pl-8 pr-2 py-2 rounded-full group transition-colors hover:bg-[#E0E0E0]">
                        <span className="font-haas text-[15px] tracking-[0.2em] text-black uppercase font-bold mr-6">PARLER À SOHUB</span>
                        <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                        </div>
                    </motion.button>
                    <motion.button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center bg-black pl-9 pr-2 py-2 rounded-full shadow-lg group relative overflow-hidden">
                        <span className="font-haas text-[15px] tracking-[0.2em] font-bold text-transparent mr-12 uppercase">FERMER</span>
                        <motion.span className="text-white font-haas text-[15px] tracking-[0.2em] font-bold absolute left-9" animate={{ y: menuOpen ? -22 : 0, opacity: menuOpen ? 0 : 1 }}>MENU</motion.span>
                        <motion.span className="text-white font-haas text-[15px] tracking-[0.2em] font-bold absolute left-9" animate={{ y: menuOpen ? 0 : 22, opacity: menuOpen ? 1 : 0 }}>FERMER</motion.span>
                        <div className="flex gap-2 bg-[#282828] w-[60px] h-10 rounded-full items-center justify-center">
                            <motion.span className="w-2 h-2 bg-white rounded-full block" animate={menuOpen ? { rotate: 45, x: 5, y: 5 } : { rotate: 0, x: 0, y: 0 }} />
                            <motion.span className="w-2 h-2 rounded-full block" animate={{ rotate: menuOpen ? -45 : 0, x: menuOpen ? 5 : 0, y: menuOpen ? -5 : 0, backgroundColor: menuOpen ? '#ffffff' : '#555555' }} />
                        </div>
                    </motion.button>
                </div>
            </motion.nav>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div className="fixed inset-0 z-[200] bg-[#1A1E23] font-haas overflow-hidden" initial={{ clipPath: 'circle(0% at calc(100% - 80px) 60px)' }} animate={{ clipPath: 'circle(150% at calc(100% - 80px) 60px)' }} exit={{ clipPath: 'circle(0% at calc(100% - 80px) 60px)' }} transition={{ duration: 1.2, ease: EASE_SHARP }}>
                        <div className="absolute top-0 left-0 w-full px-16 py-10 flex justify-between items-center z-10">
                            <p className="text-[11px] font-bold tracking-[0.4em] uppercase text-white/20 font-haas">Navigation</p>
                            <CloseButton onClick={() => setMenuOpen(false)} label="Fermer" />
                        </div>
                        <div className="h-full flex flex-col justify-between px-16 md:px-24 py-32">
                            <nav className="flex flex-col gap-0 mt-8">
                                {NAV_LINKS.map((item, i) => (
                                    <motion.a key={item.label} href={item.href} initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.08, duration: 0.9, ease: EASE_POWER }} onClick={() => setMenuOpen(false)} className="group flex items-center gap-8 border-b border-white/[0.07] py-8">
                                        <span className="text-[11px] font-bold tracking-[0.4em] text-white/20 w-8 font-haas uppercase">0{i+1}</span>
                                        <span className="text-[clamp(40px,7vw,100px)] font-bold font-nordique text-white leading-[1] tracking-tighter uppercase group-hover:text-white/30 transition-colors duration-500">{item.label}</span>
                                    </motion.a>
                                ))}
                            </nav>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {chatOpen && (
                    <motion.div className="fixed inset-0 z-[300] bg-[#F8F8F8] font-haas overflow-hidden" initial={{ clipPath: 'circle(0% at 85% 10%)' }} animate={{ clipPath: 'circle(150% at 85% 10%)' }} exit={{ clipPath: 'circle(0% at 85% 10%)' }} transition={{ duration: 1.2, ease: EASE_SHARP }}>
                        <div className="absolute top-0 left-0 w-full px-16 py-10 flex justify-between items-center z-[340] bg-[#F8F8F8]">
                            <div className="text-[11px] font-bold tracking-[0.4em] uppercase text-black/40">Collective d'Enquête</div>
                            <CloseButton onClick={closeChat} label="Quitter" />
                        </div>
                        <div className="h-full w-full overflow-y-auto pt-40 pb-20 px-16 overscroll-contain">
                            <div className="min-h-full flex flex-col">
                                <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-32">
                                    <div className="flex-1">
                                        <MaskText className="text-[20vw] font-nordique text-black leading-[0.85] tracking-tighter">CONTACT</MaskText>
                                        <MaskText delay={0.2} className="text-[3vw] text-black font-nordique leading-[1] mt-10 italic uppercase">Écrivons ensemble<br />votre histoire.</MaskText>
                                    </div>
                                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="w-[450px]">
                                        <img src={`${basePath}/image%201.png`} alt="Robot" className="w-full h-auto grayscale-[0.5] hover:grayscale-0 transition-all duration-1000" loading="eager" />
                                    </motion.div>
                                </div>
                                <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#E9EBEF] rounded-[60px] p-24 mb-40 relative">
                                    <AnimatePresence mode="wait">
                                        {!mainFlow ? (
                                            <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                                <h3 className="text-[clamp(48px,9vw,130px)] text-black text-center mb-8 font-bold italic uppercase">Bonjour!</h3>
                                                <p className="text-center text-black/40 text-[clamp(20px,2.5vw,32px)] mb-20 uppercase">Choisissez votre voie — On s'occupe du reste.</p>
                                                <div className="flex flex-wrap gap-8 justify-center">
                                                    {[
                                                        { id: 'project', label: 'Projet', sub: 'Stratégie sur mesure' },
                                                        { id: 'join',    label: 'Carrière', sub: 'Nous rejoindre' },
                                                        { id: 'hi',      label: 'Salut', sub: 'Inquiries générales' },
                                                    ].map(({ id, label, sub }) => (
                                                        <MagneticButton key={id} onClick={() => { setMainFlow(id); setProjectStep(0); }} className="flex flex-col items-start gap-6 px-14 py-12 bg-[#1A1E23] text-white rounded-[50px] text-left hover:scale-[1.02] transition-all min-w-[340px] shadow-2xl group">
                                                            <div className="space-y-2 pointer-events-none">
                                                                <span className="text-[28px] font-bold block uppercase">{label}</span>
                                                                <span className="text-[16px] text-white/30 block uppercase">{sub}</span>
                                                            </div>
                                                        </MagneticButton>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        ) : mainFlow === 'project' && projectStep < STEPS.length ? (
                                            <StepQuestion key={`step-${projectStep}`} step={STEPS[projectStep]} stepIndex={projectStep} totalSteps={STEPS.length} answers={projectAnswers} onAnswer={handleAnswer} onNext={handleStepNext} onBack={handleStepBack} />
                                        ) : (
                                            <div className="text-center py-20"><button onClick={() => setMainFlow(null)} className="underline uppercase font-bold">Retour</button></div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative h-full flex items-center justify-center pointer-events-none">
                <motion.div initial="initial" animate="animate" variants={{ initial: { opacity: 0 }, animate: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }} className="absolute w-full ml-[20%] text-right flex justify-end overflow-hidden">
                    {titleLetters.map((char, i) => (
                        <motion.span key={i} variants={{ initial: { y: '100%', opacity: 0 }, animate: { y: 0, opacity: 1, transition: { duration: 1.4, ease: EASE_POWER } } }} className="font-nordique text-[33vw] text-black leading-none inline-block">
                            {char}
                        </motion.span>
                    ))}
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.8, y: 100 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 1.8, delay: 0.6, ease: EASE_POWER }} className="absolute ml-[20%] top-[20vw] z-20 w-[330px]">
                    <motion.img src={`${basePath}/image%201.png`} alt="Robot" className="w-full h-auto will-change-transform" animate={floatingAnimation as any} loading="eager" />
                </motion.div>
                <div className="absolute w-full mt-[29%] ml-[50%] z-40">
                    <motion.p initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.5, delay: 1, ease: EASE_POWER }} className="font-haas text-[3vw] text-black leading-tight  tracking-tighter">
                        Votre histoire bâtit<br />
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ duration: 1.5, delay: 1.4 }}>notre futur.</motion.span>
                    </motion.p>
                </div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.47 }} transition={{ duration: 1, delay: 2.2 }} className="absolute left-10 top-[80%] z-20">
                    <span className="font-haas text-[#232222] font-bold text-[32px] inline-block ">Défiler</span>
                </motion.div>
            </div>
        </section>
    );
}
