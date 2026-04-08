'use client';

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import * as Tone from 'tone';
import { useSatisfyingSounds } from '@/hooks/use-satisfying-sounds';

// ─────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────

const EASE_POWER: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_SHARP: [number, number, number, number] = [0.76, 0, 0.24, 1];

const basePath = process.env.NODE_ENV === 'production' ? '/alhambra-web' : '';

// ── Supabase direct ──
const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL  || '';
const SUPABASE_KEY  = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';

// Table Supabase pour les rendez-vous (existante)
async function saveAppointmentToSupabase(record: Record<string, unknown>): Promise<void> {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
        console.log('📅 Nouveau RDV (Supabase non configuré):', record);
        return;
    }
    const res = await fetch(`${SUPABASE_URL}/rest/v1/appointments`, {
        method: 'POST',
        headers: {
            apikey:          SUPABASE_KEY,
            Authorization:   `Bearer ${SUPABASE_KEY}`,
            'Content-Type':  'application/json',
            Prefer:          'return=minimal',
        },
        body: JSON.stringify(record),
    });
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Supabase error ${res.status}: ${err}`);
    }
}

// Table Supabase pour les messages "Salut" (table messages existante)
async function saveMessageToSupabase(record: Record<string, unknown>): Promise<void> {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
        console.log('💬 Nouveau message (Supabase non configuré):', record);
        return;
    }
    const res = await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
        method: 'POST',
        headers: {
            apikey:          SUPABASE_KEY,
            Authorization:   `Bearer ${SUPABASE_KEY}`,
            'Content-Type':  'application/json',
            Prefer:          'return=minimal',
        },
        body: JSON.stringify(record),
    });
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Supabase error ${res.status}: ${err}`);
    }
}

// Table Supabase pour les projets (table projects existante)
async function saveProjectToSupabase(record: Record<string, unknown>): Promise<void> {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
        console.log('📋 Nouveau projet (Supabase non configuré):', record);
        return;
    }
    const res = await fetch(`${SUPABASE_URL}/rest/v1/projects`, {
        method: 'POST',
        headers: {
            apikey:          SUPABASE_KEY,
            Authorization:   `Bearer ${SUPABASE_KEY}`,
            'Content-Type':  'application/json',
            Prefer:          'return=minimal',
        },
        body: JSON.stringify(record),
    });
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Supabase error ${res.status}: ${err}`);
    }
}

// Table Supabase pour les candidatures (à créer si nécessaire)
async function saveApplicationToSupabase(record: Record<string, unknown>): Promise<void> {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
        console.log('👔 Nouvelle candidature (Supabase non configuré):', record);
        return;
    }
    const res = await fetch(`${SUPABASE_URL}/rest/v1/applications`, {
        method: 'POST',
        headers: {
            apikey:          SUPABASE_KEY,
            Authorization:   `Bearer ${SUPABASE_KEY}`,
            'Content-Type':  'application/json',
            Prefer:          'return=minimal',
        },
        body: JSON.stringify(record),
    });
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Supabase error ${res.status}: ${err}`);
    }
}

// ── FLUX PROJET : étapes du devis ──
const STEPS = [
    { id: 'service',  tag: 'Équipe',    question: 'Comment vous aider ?',       type: 'multi',    options: ['Branding', 'Site Web', 'App', 'Marketing', 'Animation', 'Design'],    key: 'services'  },
    { id: 'goal',     tag: 'Vision',    question: "Votre objectif ?",            type: 'single',   options: ['Lancement', 'Croissance', 'Conversion', 'Modernisation', 'De Zéro'],  key: 'goal'      },
    { id: 'audience', tag: 'Cible',     question: 'À qui parlez-vous ?',         type: 'single',   options: ['B2B', 'B2C', 'Les deux', 'Niche'],                                    key: 'audience'  },
    { id: 'timeline', tag: 'Délai',     question: "Quelle urgence ?",            type: 'single',   options: ['ASAP', '1–2 Mois', '3–6 Mois', '6+ Mois'],                           key: 'timeline'  },
    { id: 'budget',   tag: 'Budget',    question: 'Investissement ?',            type: 'single',   options: ['< 3k€', '3k – 8k€', '8k – 20k€', '> 20k€'],                         key: 'budget'    },
    { id: 'extra',    tag: 'Détails',   question: 'Un mot de plus ?',            type: 'textarea', placeholder: 'Liens, concurrents, inspirations…',                                key: 'extra'     },
    { id: 'contact',  tag: 'Contact',   question: 'Comment vous joindre ?',      type: 'contact',  placeholder: '',                                                                  key: 'contact'   },
] as const;

// ── FLUX CALL : créneaux de réservation ──
const CALL_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
const CALL_DURATIONS = ['30 min – Découverte', '60 min – Stratégie', '90 min – Workshop'];
const CALL_SERVICE_MAP: Record<string, string> = {
    '30 min – Découverte': 'Découverte',
    '60 min – Stratégie':  'Stratégie',
    '90 min – Workshop':   'Workshop',
};

// ── FLUX CARRIÈRE ──
const CAREER_STEPS = [
    { id: 'role',     tag: 'Poste',     question: 'Quel rôle vous intéresse ?',  type: 'single',   options: ['Dev Front', 'Dev Full-Stack', 'Designer UI/UX', 'Chef de projet', 'Motion', 'Autre'], key: 'role'      },
    { id: 'xp',       tag: 'XP',        question: 'Votre expérience ?',          type: 'single',   options: ['Junior (0–2 ans)', 'Intermédiaire (2–5 ans)', 'Senior (5+ ans)', 'Lead / Expert'],     key: 'xp'        },
    { id: 'type',     tag: 'Contrat',   question: 'Type de collaboration ?',     type: 'single',   options: ['CDI', 'Freelance', 'Stage', 'Alternance'],                                             key: 'type'      },
    { id: 'cv',       tag: 'Portfolio', question: 'Votre portfolio / LinkedIn ?', type: 'textarea', placeholder: 'https://votre-portfolio.com ou linkedin.com/in/vous',                               key: 'cv'        },
    { id: 'contact',  tag: 'Contact',   question: 'Comment vous joindre ?',      type: 'contact',  placeholder: '',                                                                                   key: 'contact'   },
] as const;

// ── SERVICES & TARIFS ──
const SERVICES_PRICING = [
    { name: 'Site Vitrine',      from: '1 500€',      delay: '3–4 sem',   desc: 'Landing page ou site institutionnel, design sur mesure, SEO de base.' },
    { name: 'Site E-Commerce',   from: '4 000€',      delay: '6–10 sem',  desc: 'Boutique complète, paiement sécurisé, tableau de bord vendeur.' },
    { name: 'Application Web',   from: '8 000€',      delay: '8–16 sem',  desc: 'SaaS, plateforme métier, API, authentification, base de données.' },
    { name: 'Branding Complet',  from: '2 500€',      delay: '3–5 sem',   desc: 'Logo, charte graphique, guidelines, assets digitaux.' },
    { name: 'App Mobile',        from: '12 000€',     delay: '12–20 sem', desc: 'iOS & Android, React Native, notifications, AppStore.' },
    { name: 'Marketing Digital', from: '800€/mois',   delay: 'Continu',   desc: 'SEO, SEA, réseaux sociaux, reporting mensuel.' },
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

type Answers = Record<string, string | string[]>;
type FlowType = 'project' | 'call' | 'join' | 'hi' | null;

interface ContactField { name: string; email: string; phone: string; message?: string; }

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
    const { playClick, playHover } = useSatisfyingSounds();

    const handleMouseMove = (e: React.MouseEvent) => {
        if (disabled || !ref.current) return;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        x.set((e.clientX - (left + width / 2)) * strength);
        y.set((e.clientY - (top + height / 2)) * strength);
    };

    return (
        <motion.button
            ref={ref}
            onMouseEnter={() => !disabled && playHover()}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            onClick={(e) => { if (!disabled) { playClick(); onClick?.(e); } }}
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
// ProgressBar
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

// ─────────────────────────────────────────────
// ContactFields
// ─────────────────────────────────────────────

function ContactFields({ value, onChange }: { value: ContactField; onChange: (v: ContactField) => void }) {
    const fieldStyle = "w-full px-7 py-5 rounded-[28px] border-2 border-[#1A1E23] bg-transparent text-[16px] font-semibold outline-none placeholder:text-black/25 text-black font-haas";
    return (
        <div className="max-w-xl mx-auto mb-10 flex flex-col gap-5">
            <input type="text"  placeholder="Votre prénom & nom *"    value={value.name}  onChange={e => onChange({ ...value, name: e.target.value })}  className={fieldStyle} required />
            <input type="email" placeholder="Votre email *"            value={value.email} onChange={e => onChange({ ...value, email: e.target.value })} className={fieldStyle} required />
            <input type="tel"   placeholder="Votre téléphone (optionnel)" value={value.phone} onChange={e => onChange({ ...value, phone: e.target.value })} className={fieldStyle} />
        </div>
    );
}

// ─────────────────────────────────────────────
// StepQuestion
// ─────────────────────────────────────────────

interface StepQuestionProps {
    step: typeof STEPS[number] | typeof CAREER_STEPS[number];
    stepIndex: number;
    totalSteps: number;
    answers: Answers;
    contactInfo: ContactField;
    onAnswer: (key: string, val: string | string[]) => void;
    onContactChange: (v: ContactField) => void;
    onNext: () => void;
    onBack: () => void;
    isLast: boolean;
    isSubmitting?: boolean;
}

function StepQuestion({ step, stepIndex, totalSteps, answers, contactInfo, onAnswer, onContactChange, onNext, onBack, isLast, isSubmitting }: StepQuestionProps) {
    const cur = answers[step.key];
    const isContactStep = step.type === 'contact';
    const canNext = isContactStep
        ? contactInfo.name.trim().length > 1 && contactInfo.email.includes('@')
        : step.type === 'textarea'
            ? true
            : step.type === 'multi'
                ? (cur as string[])?.length > 0
                : !!cur;
    const { playClick, playHover } = useSatisfyingSounds();

    return (
        <motion.div key={step.id} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.8, ease: EASE_SHARP }}>
            <ProgressBar current={stepIndex + 1} total={totalSteps} />
            <p className="text-center text-[12px] tracking-[0.4em] uppercase text-black/35 mb-4 font-haas font-bold">
                {step.tag} — {stepIndex + 1}/{totalSteps}
            </p>
            <h3 className="text-[clamp(32px,5.5vw,72px)] font-bold text-black text-center mb-12 leading-[1] tracking-tighter font-haas">
                {step.question}
            </h3>

            {isContactStep ? (
                <ContactFields value={contactInfo} onChange={onContactChange} />
            ) : step.type === 'textarea' ? (
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
                    {'options' in step && step.options.map((opt: string) => {
                        const selected = step.type === 'multi' ? (cur as string[])?.includes(opt) : cur === opt;
                        return (
                            <button
                                key={opt}
                                onMouseEnter={() => playHover()}
                                onClick={() => {
                                    playClick();
                                    if (step.type === 'multi') {
                                        const prev = (cur as string[]) || [];
                                        onAnswer(step.key, prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt]);
                                    } else {
                                        onAnswer(step.key, opt);
                                    }
                                }}
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
                <button
                    onMouseEnter={() => playHover()}
                    onClick={() => { playClick(); onBack(); }}
                    className="text-[12px] text-black/40 font-bold font-haas uppercase tracking-[0.2em] underline hover:text-black transition-colors"
                >
                    ← Retour
                </button>
                {canNext && (
                    <motion.button
                        onMouseEnter={() => playHover()}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => { playClick(); onNext(); }}
                        disabled={isSubmitting}
                        className="flex items-center gap-3 px-10 py-5 bg-[#1A1E23] text-white rounded-full text-[12px] font-bold font-haas tracking-[0.2em] hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-wait"
                    >
                        {isSubmitting ? 'ENVOI...' : isLast ? 'ENVOYER →' : 'CONTINUER →'}
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────
// SuccessScreen
// ─────────────────────────────────────────────

function SuccessScreen({ title, message, onClose }: { title: string; message: string; onClose: () => void }) {
    const { playClick, playHover } = useSatisfyingSounds();
    return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-24 h-24 rounded-full bg-[#1A1E23] flex items-center justify-center mx-auto mb-10"
            >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M20 6L9 17l-5-5" />
                </svg>
            </motion.div>
            <h3 className="text-[clamp(40px,7vw,100px)] font-bold font-nordique tracking-tighter text-black mb-6">{title}</h3>
            <p className="text-[clamp(16px,2vw,24px)] text-black/50 font-haas mb-16 max-w-xl mx-auto">{message}</p>
            <button
                onMouseEnter={() => playHover()}
                onClick={() => { playClick(); onClose(); }}
                className="px-14 py-6 bg-[#1A1E23] text-white rounded-full text-[13px] font-bold font-haas tracking-[0.2em] hover:scale-105 transition-all"
            >
                FERMER
            </button>
        </motion.div>
    );
}

// ─────────────────────────────────────────────
// BookCallFlow — réservation → Supabase direct
// ─────────────────────────────────────────────

function BookCallFlow({ onBack, onSuccess }: { onBack: () => void; onSuccess: (info: { date: string; time: string; duration: string; name: string }) => void }) {
    const [step, setStep]                     = useState<'date' | 'contact'>('date');
    const [selectedSlot, setSelectedSlot]     = useState('');
    const [selectedDuration, setSelectedDuration] = useState('');
    const [selectedDate, setSelectedDate]     = useState('');
    const [contact, setContact]               = useState<ContactField>({ name: '', email: '', phone: '' });
    const [notes, setNotes]                   = useState('');
    const [isSubmitting, setIsSubmitting]     = useState(false);
    const [error, setError]                   = useState('');
    const { playClick, playHover }            = useSatisfyingSounds();

    // Génère les 7 prochains jours ouvrés
    const getNextBusinessDays = () => {
        const days: { label: string; value: string }[] = [];
        const d = new Date();
        while (days.length < 7) {
            d.setDate(d.getDate() + 1);
            const day = d.getDay();
            if (day !== 0 && day !== 6) {
                days.push({
                    label: d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
                    value: d.toISOString().split('T')[0],
                });
            }
        }
        return days;
    };

    const businessDays    = getNextBusinessDays();
    const canNextDate     = selectedDate && selectedSlot && selectedDuration;
    const canSubmit       = contact.name.trim().length > 1 && contact.email.includes('@');

    const handleSubmit = async () => {
        if (!canSubmit) return;
        setIsSubmitting(true);
        setError('');
        try {
            const record = {
                client_name:  contact.name.trim(),
                client_email: contact.email.trim() || null,
                client_phone: contact.phone.trim() || null,
                date:         selectedDate,
                time:         selectedSlot,
                service:      CALL_SERVICE_MAP[selectedDuration] || selectedDuration,
                status:       'pending',
                notes:        notes.trim() || `Call ${selectedDuration}`,
                created_at:   new Date().toISOString(),
            };

            await saveAppointmentToSupabase(record);

            onSuccess({
                date:     selectedDate,
                time:     selectedSlot,
                duration: selectedDuration,
                name:     contact.name.trim(),
            });
        } catch (e) {
            setError('Erreur lors de la réservation. Réessayez.');
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputStyle = "w-full px-7 py-5 rounded-[28px] border-2 border-[#1A1E23] bg-transparent text-[16px] font-semibold outline-none placeholder:text-black/25 text-black font-haas";

    return (
        <AnimatePresence mode="wait">
            {step === 'date' && (
                <motion.div key="date" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.6, ease: EASE_SHARP }}>

                    {/* ── Recap visuel en haut si déjà sélectionné ── */}
                    {(selectedDate || selectedSlot || selectedDuration) && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-2xl mx-auto mb-8 flex flex-wrap gap-3"
                        >
                            {selectedDate && (
                                <span className="flex items-center gap-2 bg-[#1A1E23] text-white px-5 py-2 rounded-full text-[13px] font-bold font-haas">
                                    📅 {new Date(selectedDate + 'T00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                                </span>
                            )}
                            {selectedSlot && (
                                <span className="flex items-center gap-2 bg-[#1A1E23] text-white px-5 py-2 rounded-full text-[13px] font-bold font-haas">
                                    ⏰ {selectedSlot}
                                </span>
                            )}
                            {selectedDuration && (
                                <span className="flex items-center gap-2 bg-[#1A1E23] text-white px-5 py-2 rounded-full text-[13px] font-bold font-haas">
                                    ⏱ {selectedDuration}
                                </span>
                            )}
                        </motion.div>
                    )}

                    <p className="text-center text-[12px] tracking-[0.4em] uppercase text-black/35 mb-4 font-haas font-bold">Disponibilité — 1/2</p>
                    <h3 className="text-[clamp(32px,5.5vw,72px)] font-bold text-black text-center mb-12 leading-[1] tracking-tighter font-haas">
                        Quand vous convient-il ?
                    </h3>

                    <div className="max-w-2xl mx-auto mb-8 space-y-10">

                        {/* Jour */}
                        <div>
                            <p className="text-[12px] font-bold font-haas uppercase tracking-[0.2em] text-black/40 mb-4">Choisissez un jour</p>
                            <div className="flex flex-wrap gap-3">
                                {businessDays.map(d => (
                                    <button
                                        key={d.value}
                                        onMouseEnter={() => playHover()}
                                        onClick={() => { playClick(); setSelectedDate(d.value); }}
                                        className={`px-6 py-4 rounded-full text-[14px] font-bold font-haas transition-all border-2 border-[#1A1E23] capitalize ${
                                            selectedDate === d.value ? 'bg-[#1A1E23] text-white scale-105 shadow-xl' : 'bg-transparent text-[#1A1E23] hover:scale-105'
                                        }`}
                                    >
                                        {d.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Créneau */}
                        <div>
                            <p className="text-[12px] font-bold font-haas uppercase tracking-[0.2em] text-black/40 mb-4">Créneau horaire</p>
                            <div className="flex flex-wrap gap-3">
                                {CALL_SLOTS.map(slot => (
                                    <button
                                        key={slot}
                                        onMouseEnter={() => playHover()}
                                        onClick={() => { playClick(); setSelectedSlot(slot); }}
                                        className={`px-8 py-4 rounded-full text-[15px] font-bold font-haas transition-all border-2 border-[#1A1E23] ${
                                            selectedSlot === slot ? 'bg-[#1A1E23] text-white scale-105 shadow-xl' : 'bg-transparent text-[#1A1E23] hover:scale-105'
                                        }`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Durée */}
                        <div>
                            <p className="text-[12px] font-bold font-haas uppercase tracking-[0.2em] text-black/40 mb-4">Durée du call</p>
                            <div className="flex flex-wrap gap-3">
                                {CALL_DURATIONS.map(dur => (
                                    <button
                                        key={dur}
                                        onMouseEnter={() => playHover()}
                                        onClick={() => { playClick(); setSelectedDuration(dur); }}
                                        className={`px-8 py-4 rounded-full text-[15px] font-bold font-haas transition-all border-2 border-[#1A1E23] ${
                                            selectedDuration === dur ? 'bg-[#1A1E23] text-white scale-105 shadow-xl' : 'bg-transparent text-[#1A1E23] hover:scale-105'
                                        }`}
                                    >
                                        {dur}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center px-4">
                        <button onMouseEnter={() => playHover()} onClick={() => { playClick(); onBack(); }} className="text-[12px] text-black/40 font-bold font-haas uppercase tracking-[0.2em] underline hover:text-black transition-colors">
                            ← Retour
                        </button>
                        {canNextDate && (
                            <motion.button
                                onMouseEnter={() => playHover()}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={() => { playClick(); setStep('contact'); }}
                                className="flex items-center gap-3 px-10 py-5 bg-[#1A1E23] text-white rounded-full text-[12px] font-bold font-haas tracking-[0.2em] hover:scale-105 transition-all shadow-lg"
                            >
                                CONTINUER →
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            )}

            {step === 'contact' && (
                <motion.div key="contact" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.6, ease: EASE_SHARP }}>

                    {/* Recap du créneau sélectionné */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-xl mx-auto mb-8 bg-[#1A1E23] rounded-[28px] p-6 flex items-center justify-between"
                    >
                        <div className="flex flex-col gap-1">
                            <span className="text-white/40 text-[10px] font-bold font-haas uppercase tracking-[0.2em]">Votre créneau</span>
                            <span className="text-white text-[18px] font-bold font-haas">
                                {new Date(selectedDate + 'T00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </span>
                            <span className="text-white/60 text-[14px] font-haas">{selectedSlot} · {selectedDuration}</span>
                        </div>
                        <button
                            onClick={() => { playClick(); setStep('date'); }}
                            className="text-white/40 hover:text-white text-[11px] font-bold font-haas uppercase tracking-[0.2em] transition-colors underline"
                        >
                            Modifier
                        </button>
                    </motion.div>

                    <p className="text-center text-[12px] tracking-[0.4em] uppercase text-black/35 mb-4 font-haas font-bold">Contact — 2/2</p>
                    <h3 className="text-[clamp(32px,5.5vw,72px)] font-bold text-black text-center mb-12 leading-[1] tracking-tighter font-haas">
                        Comment vous joindre ?
                    </h3>

                    <div className="max-w-xl mx-auto flex flex-col gap-5 mb-10">
                        <input type="text"  placeholder="Votre prénom & nom *" value={contact.name}  onChange={e => setContact(c => ({ ...c, name: e.target.value }))}  className={inputStyle} />
                        <input type="email" placeholder="Votre email *"         value={contact.email} onChange={e => setContact(c => ({ ...c, email: e.target.value }))} className={inputStyle} />
                        <input type="tel"   placeholder="Téléphone (optionnel)" value={contact.phone} onChange={e => setContact(c => ({ ...c, phone: e.target.value }))} className={inputStyle} />
                        <textarea
                            rows={3}
                            placeholder="Contexte, questions, sujet du call... (optionnel)"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            className={`${inputStyle} resize-none`}
                        />
                    </div>

                    {error && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-red-500 text-[14px] font-bold font-haas mb-6">
                            {error}
                        </motion.p>
                    )}

                    <div className="flex justify-between items-center px-4">
                        <button onMouseEnter={() => playHover()} onClick={() => { playClick(); setStep('date'); }} className="text-[12px] text-black/40 font-bold font-haas uppercase tracking-[0.2em] underline hover:text-black transition-colors">
                            ← Retour
                        </button>
                        {canSubmit && (
                            <motion.button
                                onMouseEnter={() => playHover()}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={() => { playClick(); handleSubmit(); }}
                                disabled={isSubmitting}
                                className="flex items-center gap-3 px-10 py-5 bg-[#1A1E23] text-white rounded-full text-[12px] font-bold font-haas tracking-[0.2em] hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-wait"
                            >
                                {isSubmitting ? (
                                    <>
                                        <motion.span
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                        />
                                        RÉSERVATION...
                                    </>
                                ) : 'CONFIRMER LA RÉSERVATION →'}
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ─────────────────────────────────────────────
// HiFlow — Contact général (envoi vers table messages existante)
// ─────────────────────────────────────────────

function HiFlow({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
    const [contact, setContact] = useState<ContactField>({ name: '', email: '', phone: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const { playClick, playHover } = useSatisfyingSounds();

    const canSubmit = contact.name.trim().length > 1 && contact.email.includes('@') && (contact.message?.trim() || '').length > 0;

    const handleSubmit = async () => {
        if (!canSubmit) return;
        setIsSubmitting(true);
        setError('');
        try {
            // Format adapté à la table messages existante
            const record = {
                sender:     contact.name.trim(),
                subject:    `Message de ${contact.name.trim()}`,
                body:       contact.message?.trim() || '',
                time:       new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                is_read:    false,
                created_at: new Date().toISOString(),
            };

            await saveMessageToSupabase(record);
            onSuccess();
        } catch (e) {
            setError('Erreur lors de l\'envoi. Veuillez réessayer.');
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputStyle = "w-full px-7 py-5 rounded-[28px] border-2 border-[#1A1E23] bg-transparent text-[16px] font-semibold outline-none placeholder:text-black/25 text-black font-haas";

    return (
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.8, ease: EASE_SHARP }}>
            <h3 className="text-[clamp(32px,5.5vw,72px)] font-bold text-black text-center mb-4 leading-[1] tracking-tighter font-haas">
                Dites-nous tout.
            </h3>
            <p className="text-center text-black/40 text-[clamp(14px,1.8vw,22px)] mb-12 font-haas">Questions, partenariats, presse, idées folles…</p>
            <div className="max-w-xl mx-auto flex flex-col gap-5 mb-10">
                <input type="text"  placeholder="Votre prénom & nom *" value={contact.name}  onChange={e => setContact(c => ({ ...c, name: e.target.value }))}  className={inputStyle} />
                <input type="email" placeholder="Votre email *"         value={contact.email} onChange={e => setContact(c => ({ ...c, email: e.target.value }))} className={inputStyle} />
                <input type="tel"   placeholder="Téléphone (optionnel)" value={contact.phone} onChange={e => setContact(c => ({ ...c, phone: e.target.value }))} className={inputStyle} />
                <textarea
                    rows={5}
                    placeholder="Votre message *"
                    value={contact.message || ''}
                    onChange={e => setContact(c => ({ ...c, message: e.target.value }))}
                    className={`${inputStyle} resize-none`}
                />
            </div>
            {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-red-500 text-[14px] font-bold font-haas mb-6">
                    {error}
                </motion.p>
            )}
            <div className="flex justify-between items-center px-4">
                <button onMouseEnter={() => playHover()} onClick={() => { playClick(); onBack(); }} className="text-[12px] text-black/40 font-bold font-haas uppercase tracking-[0.2em] underline hover:text-black transition-colors">
                    ← Retour
                </button>
                {canSubmit && (
                    <motion.button
                        onMouseEnter={() => playHover()}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => { playClick(); handleSubmit(); }}
                        disabled={isSubmitting}
                        className="flex items-center gap-3 px-10 py-5 bg-[#1A1E23] text-white rounded-full text-[12px] font-bold font-haas tracking-[0.2em] hover:scale-105 transition-all shadow-lg disabled:opacity-50"
                    >
                        {isSubmitting ? 'ENVOI...' : 'ENVOYER →'}
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
    const [menuOpen,     setMenuOpen]     = useState(false);
    const [chatOpen,     setChatOpen]     = useState(false);
    const [logoGone,     setLogoGone]     = useState(false);
    const [mainFlow,     setMainFlow]     = useState<FlowType>(null);
    const [successType,  setSuccessType]  = useState<string | null>(null);
    const [callInfo,     setCallInfo]     = useState<{ date: string; time: string; duration: string; name: string } | null>(null);

    // Flux Projet
    const [projectStep,    setProjectStep]    = useState(0);
    const [projectAnswers, setProjectAnswers] = useState<Answers>({});
    const [projectContact, setProjectContact] = useState<ContactField>({ name: '', email: '', phone: '' });
    const [isSubmittingProject, setIsSubmittingProject] = useState(false);
    const [projectError, setProjectError] = useState('');

    // Flux Carrière
    const [careerStep,    setCareerStep]    = useState(0);
    const [careerAnswers, setCareerAnswers] = useState<Answers>({});
    const [careerContact, setCareerContact] = useState<ContactField>({ name: '', email: '', phone: '' });
    const [isSubmittingCareer, setIsSubmittingCareer] = useState(false);

    const { playClick, playHover } = useSatisfyingSounds();
    const titleLetters = 'sohub'.split('');

    const unlockAudio = useCallback(async () => {
        if (typeof window !== 'undefined' && Tone.getContext().state !== 'running') {
            await Tone.start();
        }
    }, []);

    useEffect(() => {
        const onScroll = () => setLogoGone(window.scrollY > 80);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const closeChat = useCallback(() => {
        setChatOpen(false);
        setTimeout(() => {
            setMainFlow(null);
            setSuccessType(null);
            setCallInfo(null);
            setProjectStep(0);
            setProjectAnswers({});
            setProjectContact({ name: '', email: '', phone: '' });
            setProjectError('');
            setCareerStep(0);
            setCareerAnswers({});
            setCareerContact({ name: '', email: '', phone: '' });
        }, 800);
    }, []);

    // ── Handlers Projet (envoi vers table projects existante) ──
    const handleProjectAnswer = useCallback((key: string, val: string | string[]) => {
        setProjectAnswers(prev => ({ ...prev, [key]: val }));
    }, []);

    const handleProjectNext = useCallback(async () => {
        const isLastStep = projectStep === STEPS.length - 1;
        if (isLastStep) {
            setIsSubmittingProject(true);
            setProjectError('');
            try {
                // Format adapté à la table projects existante
                const record = {
                    name:        `Brief - ${projectContact.name}`,
                    client:      projectContact.email.trim(),
                    category:    Array.isArray(projectAnswers.services) ? projectAnswers.services[0] : (projectAnswers.services || 'Non spécifié'),
                    year:        new Date().getFullYear().toString(),
                    status:      'BETA',
                    description: `
                        Services: ${Array.isArray(projectAnswers.services) ? projectAnswers.services.join(', ') : projectAnswers.services || ''}
                        Objectif: ${projectAnswers.goal || ''}
                        Audience: ${projectAnswers.audience || ''}
                        Délai: ${projectAnswers.timeline || ''}
                        Budget: ${projectAnswers.budget || ''}
                        Détails: ${projectAnswers.extra || ''}
                        Téléphone: ${projectContact.phone || 'Non fourni'}
                    `,
                    links:       {},
                    metrics:     { seo: 90, performance: 90, accessibility: 90 },
                    notes:       [projectAnswers.extra || ''],
                    created_at:  new Date().toISOString(),
                };

                await saveProjectToSupabase(record);
                setSuccessType('project');
            } catch (e) {
                setProjectError('Erreur lors de l\'envoi. Veuillez réessayer.');
                console.error(e);
            } finally {
                setIsSubmittingProject(false);
            }
        } else {
            setProjectStep(s => s + 1);
        }
    }, [projectStep, projectAnswers, projectContact]);

    const handleProjectBack = useCallback(() => {
        if (projectStep === 0) setMainFlow(null);
        else setProjectStep(s => s - 1);
    }, [projectStep]);

    // ── Handlers Carrière ──
    const handleCareerAnswer = useCallback((key: string, val: string | string[]) => {
        setCareerAnswers(prev => ({ ...prev, [key]: val }));
    }, []);

    const handleCareerNext = useCallback(async () => {
        const isLastStep = careerStep === CAREER_STEPS.length - 1;
        if (isLastStep) {
            setIsSubmittingCareer(true);
            try {
                const record = {
                    id:           `app-${Date.now()}`,
                    candidate_name:  careerContact.name.trim(),
                    candidate_email: careerContact.email.trim(),
                    candidate_phone: careerContact.phone.trim() || null,
                    role:         careerAnswers.role || '',
                    experience:   careerAnswers.xp || '',
                    contract_type: careerAnswers.type || '',
                    portfolio:    careerAnswers.cv || '',
                    status:       'pending',
                    created_at:   new Date().toISOString(),
                };

                await saveApplicationToSupabase(record);
                setSuccessType('career');
            } catch (e) {
                console.error(e);
            } finally {
                setIsSubmittingCareer(false);
            }
        } else {
            setCareerStep(s => s + 1);
        }
    }, [careerStep, careerAnswers, careerContact]);

    const handleCareerBack = useCallback(() => {
        if (careerStep === 0) setMainFlow(null);
        else setCareerStep(s => s - 1);
    }, [careerStep]);

    const floatingAnimation = {
        y: ['0%', '-3%', '0%'],
        rotate: [-1, 1, -1],
        transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
    };

    // ── Textes de succès ──
    const getSuccessTexts = () => ({
        project: {
            title:   'Brief Reçu !',
            message: projectError ? projectError : 'Votre projet a bien été enregistré. Nous revenons vers vous sous 24h avec une proposition personnalisée.',
        },
        call: {
            title:   'Call Réservé !',
            message: callInfo
                ? `RDV confirmé le ${new Date(callInfo.date + 'T00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à ${callInfo.time} (${callInfo.duration}). Votre équipe Sohub sera prête — à très vite ${callInfo.name} !`
                : 'Votre créneau est enregistré. On se parle bientôt !',
        },
        career: {
            title:   'Candidature Reçue !',
            message: 'Votre candidature est entre de bonnes mains. Nous vous contactons très vite.',
        },
        hi: {
            title:   'Message Envoyé !',
            message: 'Nous avons bien reçu votre message. Réponse sous 48h garantie.',
        },
    });

    return (
        <section className="relative w-full h-screen bg-[#F8F8F8] overflow-hidden font-haas selection:bg-black selection:text-white">
            <div className="absolute bottom-0 left-0 w-full h-[93px] z-30 pointer-events-none bg-gradient-to-b from-white/4 to-transparent backdrop-blur-[10px] blur-sm" />

            {/* ── HEADER NAV ── */}
            <motion.nav
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: EASE_POWER, delay: 0.5 }}
                className="fixed top-0 left-0 w-full px-16 py-10 flex justify-between items-center z-[100]"
            >
                <div className="overflow-hidden h-[3vw]" style={{ pointerEvents: logoGone ? 'none' : 'auto' }}>
                    <motion.div
                        className="text-[2.5vw] font-nordique text-black tracking-tighter cursor-pointer"
                        animate={{ y: logoGone ? '-120%' : '0%' }}
                        transition={{ duration: 0.9, ease: EASE_SHARP }}
                    >
                        sohub
                    </motion.div>
                </div>
                <div className="flex items-center gap-8">
                    <motion.button
                        onMouseEnter={() => playHover()}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { unlockAudio(); playClick(); setChatOpen(true); }}
                        className="flex items-center bg-[#E8E8E8] pl-8 pr-2 py-2 rounded-full group transition-colors hover:bg-[#E0E0E0] cursor-pointer"
                    >
                        <span className="font-haas text-[15px] tracking-[0.2em] text-black uppercase font-bold mr-6">PARLER À SOHUB</span>
                        <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm pointer-events-none">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                        </div>
                    </motion.button>
                    <motion.button
                        onMouseEnter={() => playHover()}
                        onClick={() => { unlockAudio(); playClick(); setMenuOpen(!menuOpen); }}
                        className="flex items-center bg-black pl-9 pr-2 py-2 rounded-full shadow-lg group relative overflow-hidden cursor-pointer"
                    >
                        <span className="font-haas text-[15px] tracking-[0.2em] font-bold text-transparent mr-12 uppercase select-none pointer-events-none">FERMER</span>
                        <motion.span className="text-white font-haas text-[15px] tracking-[0.2em] font-bold absolute left-9 pointer-events-none" animate={{ y: menuOpen ? -22 : 0, opacity: menuOpen ? 0 : 1 }}>MENU</motion.span>
                        <motion.span className="text-white font-haas text-[15px] tracking-[0.2em] font-bold absolute left-9 pointer-events-none" animate={{ y: menuOpen ? 0 : 22, opacity: menuOpen ? 1 : 0 }}>FERMER</motion.span>
                        <div className="flex gap-2 bg-[#282828] w-[60px] h-10 rounded-full items-center justify-center pointer-events-none">
                            <motion.span className="w-2 h-2 bg-white rounded-full block" animate={menuOpen ? { rotate: 45, x: 5, y: 5 } : { rotate: 0, x: 0, y: 0 }} />
                            <motion.span className="w-2 h-2 rounded-full block" animate={{ rotate: menuOpen ? -45 : 0, x: menuOpen ? 5 : 0, y: menuOpen ? -5 : 0, backgroundColor: menuOpen ? '#ffffff' : '#555555' }} />
                        </div>
                    </motion.button>
                </div>
            </motion.nav>

            {/* ── MENU ── */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        className="fixed inset-0 z-[200] bg-[#1A1E23] font-haas overflow-hidden"
                        initial={{ clipPath: 'circle(0% at calc(100% - 80px) 60px)' }}
                        animate={{ clipPath: 'circle(150% at calc(100% - 80px) 60px)' }}
                        exit={{ clipPath: 'circle(0% at calc(100% - 80px) 60px)' }}
                        transition={{ duration: 1.2, ease: EASE_SHARP }}
                    >
                        <div className="absolute top-0 left-0 w-full px-16 py-10 flex justify-between items-center z-10">
                            <p className="text-[11px] font-bold tracking-[0.4em] uppercase text-white/20 font-haas">Navigation</p>
                            <CloseButton onClick={() => setMenuOpen(false)} label="Fermer" />
                        </div>
                        <div className="h-full flex flex-col justify-between px-16 md:px-24 py-32">
                            <nav className="flex flex-col gap-0 mt-8">
                                {NAV_LINKS.map((item, i) => (
                                    <motion.a
                                        key={item.label}
                                        href={item.href}
                                        onMouseEnter={() => playHover()}
                                        onClick={() => { playClick(); setMenuOpen(false); }}
                                        initial={{ opacity: 0, x: -60 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.25 + i * 0.08, duration: 0.9, ease: EASE_POWER }}
                                        className="group flex items-center gap-8 border-b border-white/[0.07] py-8"
                                    >
                                        <span className="text-[11px] font-bold tracking-[0.4em] text-white/20 w-8 font-haas uppercase">0{i + 1}</span>
                                        <span className="text-[clamp(40px,7vw,100px)] font-bold font-nordique text-white leading-[1] tracking-tighter uppercase group-hover:text-white/30 transition-colors duration-500">{item.label}</span>
                                    </motion.a>
                                ))}
                            </nav>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─────────────────────────────────────────────────────────────
                CONTACT OVERLAY
            ───────────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {chatOpen && (
                    <motion.div
                        className="fixed inset-0 z-[300] bg-[#F8F8F8] font-haas"
                        style={{ display: 'flex', flexDirection: 'column' }}
                        initial={{ clipPath: 'circle(0% at 85% 10%)' }}
                        animate={{ clipPath: 'circle(150% at 85% 10%)' }}
                        exit={{ clipPath: 'circle(0% at 85% 10%)' }}
                        transition={{ duration: 1.2, ease: EASE_SHARP }}
                        data-lenis-prevent
                    >
                        {/* ── Sticky header ── */}
                        <div
                            className="flex-shrink-0 w-full px-16 py-10 flex justify-between items-center z-[340] bg-[#F8F8F8]"
                            style={{ position: 'sticky', top: 0, borderBottom: '1px solid rgba(0,0,0,0.04)' }}
                        >
                            <div className="text-[11px] font-bold tracking-[0.4em] uppercase text-black/40">Collective d'Enquête</div>
                            <CloseButton onClick={closeChat} label="Quitter" />
                        </div>

                        {/* ── Zone scrollable ── */}
                        <div
                            className="flex-1 overflow-y-auto overscroll-contain"
                            style={{ WebkitOverflowScrolling: 'touch' }}
                        >
                            <div className="px-16 pb-24">

                                {/* Hero header text */}
                                <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-20 pt-10">
                                    <div className="flex-1">
                                        <MaskText className="text-[20vw] font-nordique text-black leading-[0.85] tracking-tighter">CONTACT</MaskText>
                                        <MaskText delay={0.2} className="text-[3vw] text-black font-nordique leading-[1] mt-10 italic uppercase">
                                            Écrivons ensemble<br />votre histoire.
                                        </MaskText>
                                    </div>
                                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="w-[350px] flex-shrink-0">
                                        <img src={`${basePath}/image%201.png`} alt="Robot" className="w-full h-auto grayscale-[0.5] hover:grayscale-0 transition-all duration-1000" loading="eager" />
                                    </motion.div>
                                </div>

                                {/* Main interactive panel */}
                                <motion.div
                                    initial={{ y: 100, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="bg-[#E9EBEF] rounded-[60px] p-16 mb-20 relative"
                                >
                                    <AnimatePresence mode="wait">

                                        {/* ── ÉCRAN SUCCÈS ── */}
                                        {successType && getSuccessTexts()[successType as keyof ReturnType<typeof getSuccessTexts>] && (
                                            <SuccessScreen
                                                key="success"
                                                title={getSuccessTexts()[successType as keyof ReturnType<typeof getSuccessTexts>].title}
                                                message={getSuccessTexts()[successType as keyof ReturnType<typeof getSuccessTexts>].message}
                                                onClose={closeChat}
                                            />
                                        )}

                                        {/* ── ACCUEIL ── */}
                                        {!mainFlow && !successType && (
                                            <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                                <h3 className="text-[clamp(48px,9vw,130px)] text-black text-center mb-8 font-bold italic uppercase font-nordique">Bonjour!</h3>
                                                <p className="text-center text-black/40 text-[clamp(20px,2.5vw,32px)] mb-20 uppercase font-haas">Choisissez votre voie — On s'occupe du reste.</p>
                                                <div className="flex flex-wrap gap-8 justify-center">
                                                    {[
                                                        { id: 'project' as FlowType, label: 'Projet',   sub: 'Stratégie sur mesure', desc: 'Brief complet en 5 min' },
                                                        { id: 'call'    as FlowType, label: 'Call',     sub: 'Réserver un créneau',  desc: 'Direct dans votre agenda' },
                                                        { id: 'join'    as FlowType, label: 'Carrière', sub: 'Nous rejoindre',       desc: 'Candidature rapide' },
                                                        { id: 'hi'      as FlowType, label: 'Salut',    sub: 'Inquiries générales',  desc: 'Réponse sous 48h' },
                                                    ].map(({ id, label, sub, desc }) => (
                                                        <MagneticButton
                                                            key={id}
                                                            onClick={() => { unlockAudio(); setMainFlow(id); setProjectStep(0); setCareerStep(0); }}
                                                            className="flex flex-col items-start gap-6 px-14 py-12 bg-[#1A1E23] text-white rounded-[50px] text-left hover:scale-[1.02] transition-all min-w-[280px] shadow-2xl group"
                                                        >
                                                            <div className="space-y-2 pointer-events-none">
                                                                <span className="text-[28px] font-bold block uppercase font-haas">{label}</span>
                                                                <span className="text-[16px] text-white/30 block uppercase font-haas">{sub}</span>
                                                                <span className="text-[12px] text-white/20 block font-haas">{desc}</span>
                                                            </div>
                                                        </MagneticButton>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* ── FLUX PROJET ── */}
                                        {mainFlow === 'project' && !successType && projectStep < STEPS.length && (
                                            <StepQuestion
                                                key={`proj-step-${projectStep}`}
                                                step={STEPS[projectStep]}
                                                stepIndex={projectStep}
                                                totalSteps={STEPS.length}
                                                answers={projectAnswers}
                                                contactInfo={projectContact}
                                                onAnswer={handleProjectAnswer}
                                                onContactChange={setProjectContact}
                                                onNext={handleProjectNext}
                                                onBack={handleProjectBack}
                                                isLast={projectStep === STEPS.length - 1}
                                                isSubmitting={isSubmittingProject}
                                            />
                                        )}

                                        {/* ── FLUX CALL ── */}
                                        {mainFlow === 'call' && !successType && (
                                            <BookCallFlow
                                                key="call"
                                                onBack={() => setMainFlow(null)}
                                                onSuccess={(info) => {
                                                    setCallInfo(info);
                                                    setSuccessType('call');
                                                }}
                                            />
                                        )}

                                        {/* ── FLUX CARRIÈRE ── */}
                                        {mainFlow === 'join' && !successType && careerStep < CAREER_STEPS.length && (
                                            <StepQuestion
                                                key={`career-step-${careerStep}`}
                                                step={CAREER_STEPS[careerStep]}
                                                stepIndex={careerStep}
                                                totalSteps={CAREER_STEPS.length}
                                                answers={careerAnswers}
                                                contactInfo={careerContact}
                                                onAnswer={handleCareerAnswer}
                                                onContactChange={setCareerContact}
                                                onNext={handleCareerNext}
                                                onBack={handleCareerBack}
                                                isLast={careerStep === CAREER_STEPS.length - 1}
                                                isSubmitting={isSubmittingCareer}
                                            />
                                        )}

                                        {/* ── FLUX HI (Salut) ── */}
                                        {mainFlow === 'hi' && !successType && (
                                            <HiFlow
                                                key="hi"
                                                onBack={() => setMainFlow(null)}
                                                onSuccess={() => setSuccessType('hi')}
                                            />
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── HERO TITLE ── */}
            <div className="relative h-full flex items-center justify-center pointer-events-none">
                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={{ initial: { opacity: 0 }, animate: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}
                    className="absolute w-full ml-[20%] text-right flex justify-end overflow-hidden"
                >
                    {titleLetters.map((char, i) => (
                        <motion.span
                            key={i}
                            variants={{ initial: { y: '100%', opacity: 0 }, animate: { y: 0, opacity: 1, transition: { duration: 1.4, ease: EASE_POWER } } }}
                            className="font-nordique text-[33vw] text-black leading-none inline-block"
                        >
                            {char}
                        </motion.span>
                    ))}
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 100 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1.8, delay: 0.6, ease: EASE_POWER }}
                    className="absolute ml-[20%] top-[20vw] z-20 w-[330px]"
                >
                    <motion.img
                        src={`${basePath}/image%201.png`}
                        alt="Robot"
                        className="w-full h-auto will-change-transform"
                        animate={floatingAnimation as any}
                        loading="eager"
                    />
                </motion.div>
                <div className="absolute w-full mt-[29%] ml-[50%] z-40">
                    <motion.p
                        initial={{ opacity: 0, x: 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.5, delay: 1, ease: EASE_POWER }}
                        className="font-haas text-[3vw] text-black leading-tight"
                    >
                        Votre histoire bâtit<br />
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ duration: 1.5, delay: 1.4 }}>
                            notre futur.
                        </motion.span>
                    </motion.p>
                </div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.47 }}
                    transition={{ duration: 1, delay: 2.2 }}
                    className="absolute left-10 top-[80%] z-20"
                >
                    <span className="font-haas text-[#232222] font-bold text-[32px] inline-block">Scroll</span>
                </motion.div>
            </div>
        </section>
    );
}