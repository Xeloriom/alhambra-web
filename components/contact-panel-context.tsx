'use client';

import React, { createContext, useContext, useState, useRef, useCallback, memo, ReactNode } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import * as Tone from 'tone';
import { useSatisfyingSounds } from '@/hooks/use-satisfying-sounds';

// ─── Constants ────────────────────────────────
const EASE_POWER: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_SHARP: [number, number, number, number] = [0.76, 0, 0.24, 1];

// ─── Supabase ──────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';

async function saveToSupabase(table: string, record: Record<string, unknown>) {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
        console.log(`📋 [${table}]`, record);
        return;
    }
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal',
        },
        body: JSON.stringify(record),
    });
    if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
}

// ─── Data ────────────────────────────────────
const STEPS = [
    { id: 'service',  tag: 'Équipe',  question: 'Comment vous aider ?',       type: 'multi',    options: ['Branding', 'Site Web', 'App', 'Marketing', 'Animation', 'Design'],   key: 'services' },
    { id: 'goal',     tag: 'Vision',  question: 'Votre objectif ?',            type: 'single',   options: ['Lancement', 'Croissance', 'Conversion', 'Modernisation', 'De Zéro'], key: 'goal'     },
    { id: 'audience', tag: 'Cible',   question: 'À qui parlez-vous ?',         type: 'single',   options: ['B2B', 'B2C', 'Les deux', 'Niche'],                                   key: 'audience' },
    { id: 'timeline', tag: 'Délai',   question: 'Quelle urgence ?',            type: 'single',   options: ['ASAP', '1–2 Mois', '3–6 Mois', '6+ Mois'],                          key: 'timeline' },
    { id: 'budget',   tag: 'Budget',  question: 'Investissement ?',            type: 'single',   options: ['< 3k€', '3k – 8k€', '8k – 20k€', '> 20k€'],                        key: 'budget'   },
    { id: 'extra',    tag: 'Détails', question: 'Un mot de plus ?',            type: 'textarea', placeholder: 'Liens, concurrents, inspirations…',                               key: 'extra'    },
    { id: 'contact',  tag: 'Contact', question: 'Comment vous joindre ?',      type: 'contact',  placeholder: '',                                                                key: 'contact'  },
] as const;

const CAREER_STEPS = [
    { id: 'role',    tag: 'Poste',     question: 'Quel rôle vous intéresse ?',   type: 'single',   options: ['Dev Front', 'Dev Full-Stack', 'Designer UI/UX', 'Chef de projet', 'Motion', 'Autre'], key: 'role'    },
    { id: 'xp',      tag: 'XP',        question: 'Votre expérience ?',            type: 'single',   options: ['Junior (0–2 ans)', 'Intermédiaire (2–5 ans)', 'Senior (5+ ans)', 'Lead / Expert'],     key: 'xp'      },
    { id: 'type',    tag: 'Contrat',   question: 'Type de collaboration ?',       type: 'single',   options: ['CDI', 'Freelance', 'Stage', 'Alternance'],                                             key: 'type'    },
    { id: 'cv',      tag: 'Portfolio', question: 'Votre portfolio / LinkedIn ?',  type: 'textarea', placeholder: 'https://votre-portfolio.com ou linkedin.com/in/vous',                               key: 'cv'      },
    { id: 'contact', tag: 'Contact',   question: 'Comment vous joindre ?',        type: 'contact',  placeholder: '',                                                                                   key: 'contact' },
] as const;

const CALL_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
const CALL_DURATIONS = ['30 min – Découverte', '60 min – Stratégie', '90 min – Workshop'];

// ─── Types ───────────────────────────────────────
type Answers = Record<string, string | string[]>;
type FlowType = 'project' | 'call' | 'join' | 'hi' | null;
interface ContactField { name: string; email: string; phone: string; message?: string; }

// ─── UI Primitives ────────────────────────────────
const MagneticButton = ({ children, className = '', onClick, strength = 0.3, disabled = false }: any) => {
    const ref     = useRef<HTMLButtonElement>(null);
    const x       = useMotionValue(0);
    const y       = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 150, damping: 15 });
    const springY = useSpring(y, { stiffness: 150, damping: 15 });
    const { playClick, playHover } = useSatisfyingSounds();
    const handleMove = (e: React.MouseEvent) => {
        if (disabled || !ref.current) return;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        x.set((e.clientX - (left + width / 2)) * strength);
        y.set((e.clientY - (top + height / 2)) * strength);
    };
    return (
        <motion.button ref={ref} onMouseEnter={() => !disabled && playHover()} onMouseMove={handleMove}
                       onMouseLeave={() => { x.set(0); y.set(0); }} onClick={(e) => { if (!disabled) { playClick(); onClick?.(e); } }}
                       disabled={disabled} style={{ x: springX, y: springY, willChange: 'transform' }} className={className}>
            {children}
        </motion.button>
    );
};

const CloseBtn = ({ onClick }: { onClick: () => void }) => (
    <MagneticButton onClick={onClick} className="flex items-center bg-black pl-8 pr-2 py-2 rounded-full group shadow-xl">
        <span className="text-white text-[11px] tracking-[0.2em] font-bold mr-10 uppercase font-haas">Fermer</span>
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:rotate-180 transition-transform duration-700">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
        </div>
    </MagneticButton>
);

const ProgressBar = memo(({ current, total }: { current: number; total: number }) => (
    <div className="w-full flex gap-2 mb-10">
        {Array.from({ length: total }).map((_, i) => (
            <div key={i} className="h-[2px] flex-1 rounded-full bg-black/8 overflow-hidden">
                {i < current && <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} transition={{ duration: 0.7, ease: EASE_SHARP }} className="h-full bg-black" />}
            </div>
        ))}
    </div>
));
ProgressBar.displayName = 'ProgressBar';

function ContactFields({ value, onChange }: { value: ContactField; onChange: (v: ContactField) => void }) {
    const s = "w-full px-7 py-5 rounded-[28px] border border-black/15 bg-transparent text-[15px] font-medium outline-none placeholder:text-black/25 text-black font-haas focus:border-black/40 transition-colors";
    return (
        <div className="max-w-xl mx-auto mb-10 flex flex-col gap-4">
            <input type="text"  placeholder="Prénom & nom *"         value={value.name}  onChange={e => onChange({ ...value, name: e.target.value })}  className={s} required />
            <input type="email" placeholder="Email *"                 value={value.email} onChange={e => onChange({ ...value, email: e.target.value })} className={s} required />
            <input type="tel"   placeholder="Téléphone (optionnel)"  value={value.phone} onChange={e => onChange({ ...value, phone: e.target.value })} className={s} />
        </div>
    );
}

// ─── StepQuestion ──────────────────────────────────
function StepQuestion({ step, stepIndex, totalSteps, answers, contactInfo, onAnswer, onContactChange, onNext, onBack, isLast, isSubmitting }: any) {
    const cur = answers[step.key];
    const isContact = step.type === 'contact';
    const canNext = isContact
        ? contactInfo.name.trim().length > 1 && contactInfo.email.includes('@')
        : step.type === 'textarea' ? true
        : step.type === 'multi' ? (cur as string[])?.length > 0
        : !!cur;
    const { playClick, playHover } = useSatisfyingSounds();

    return (
        <motion.div key={step.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.7, ease: EASE_SHARP }}>
            <ProgressBar current={stepIndex + 1} total={totalSteps} />
            <p className="text-center text-[11px] tracking-[0.4em] uppercase text-black/30 mb-4 font-haas font-bold">
                {step.tag} — {stepIndex + 1}/{totalSteps}
            </p>
            <h3 className="text-[clamp(28px,5vw,64px)] font-bold text-black text-center mb-10 leading-[1] tracking-tighter font-haas">
                {step.question}
            </h3>
            {isContact ? (
                <ContactFields value={contactInfo} onChange={onContactChange} />
            ) : step.type === 'textarea' ? (
                <div className="max-w-xl mx-auto mb-10">
                    <textarea rows={4} placeholder={'placeholder' in step ? step.placeholder : ''} value={(cur as string) || ''}
                              onChange={e => onAnswer(step.key, e.target.value)}
                              className="w-full px-7 py-5 rounded-[28px] border border-black/15 bg-transparent text-[15px] font-medium outline-none resize-none placeholder:text-black/25 text-black font-haas focus:border-black/40 transition-colors" />
                </div>
            ) : (
                <div className="flex flex-wrap gap-3 justify-center mb-10">
                    {'options' in step && step.options.map((opt: string) => {
                        const selected = step.type === 'multi' ? (cur as string[])?.includes(opt) : cur === opt;
                        return (
                            <button key={opt} onMouseEnter={() => playHover()}
                                    onClick={() => { playClick(); if (step.type === 'multi') { const prev = (cur as string[]) || []; onAnswer(step.key, prev.includes(opt) ? prev.filter((x: string) => x !== opt) : [...prev, opt]); } else { onAnswer(step.key, opt); } }}
                                    className={`px-7 py-4 rounded-full text-[14px] font-bold font-haas transition-all duration-300 border ${selected ? 'bg-black text-white border-black scale-105 shadow-lg' : 'bg-transparent text-black border-black/20 hover:border-black/60 hover:scale-105'}`}>
                                {opt}
                            </button>
                        );
                    })}
                </div>
            )}
            <div className="flex justify-between items-center px-2">
                <button onMouseEnter={() => playHover()} onClick={() => { playClick(); onBack(); }}
                        className="text-[11px] text-black/35 font-bold font-haas uppercase tracking-[0.2em] underline hover:text-black transition-colors">
                    ← Retour
                </button>
                {canNext && (
                    <motion.button onMouseEnter={() => playHover()} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                                   onClick={() => { playClick(); onNext(); }} disabled={isSubmitting}
                                   className="flex items-center gap-3 px-9 py-4 bg-black text-white rounded-full text-[11px] font-bold font-haas tracking-[0.2em] hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-wait">
                        {isSubmitting ? 'ENVOI…' : isLast ? 'ENVOYER →' : 'CONTINUER →'}
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}

// ─── SuccessScreen ─────────────────────────────────
function SuccessScreen({ title, message, onClose }: { title: string; message: string; onClose: () => void }) {
    const { playClick, playHover } = useSatisfyingSounds();
    return (
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="w-20 h-20 rounded-full bg-black flex items-center justify-center mx-auto mb-8">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
            </motion.div>
            <h3 className="text-[clamp(36px,6vw,80px)] font-bold font-nordique tracking-tighter text-black mb-5">{title}</h3>
            <p className="text-[clamp(14px,1.8vw,20px)] text-black/45 font-haas mb-12 max-w-lg mx-auto">{message}</p>
            <button onMouseEnter={() => playHover()} onClick={() => { playClick(); onClose(); }}
                    className="px-12 py-5 bg-black text-white rounded-full text-[11px] font-bold font-haas tracking-[0.2em] hover:scale-105 transition-all">
                FERMER
            </button>
        </motion.div>
    );
}

// ─── BookCallFlow ──────────────────────────────────
function BookCallFlow({ onBack, onSuccess }: { onBack: () => void; onSuccess: (info: any) => void }) {
    const [step, setStep]                 = useState<'date' | 'contact'>('date');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [selectedDuration, setDuration] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [contact, setContact]           = useState<ContactField>({ name: '', email: '', phone: '' });
    const [notes, setNotes]               = useState('');
    const [isSubmitting, setSubmitting]   = useState(false);
    const [error, setError]               = useState('');
    const { playClick, playHover }        = useSatisfyingSounds();

    const getNextBusinessDays = () => {
        const days: { label: string; value: string }[] = [];
        const d = new Date();
        while (days.length < 7) {
            d.setDate(d.getDate() + 1);
            if (d.getDay() !== 0 && d.getDay() !== 6)
                days.push({ label: d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }), value: d.toISOString().split('T')[0] });
        }
        return days;
    };

    const businessDays = getNextBusinessDays();
    const canNextDate  = selectedDate && selectedSlot && selectedDuration;
    const canSubmit    = contact.name.trim().length > 1 && contact.email.includes('@');
    const s            = "w-full px-7 py-5 rounded-[28px] border border-black/15 bg-transparent text-[15px] font-medium outline-none placeholder:text-black/25 text-black font-haas focus:border-black/40 transition-colors";

    const handleSubmit = async () => {
        if (!canSubmit) return;
        setSubmitting(true);
        setError('');
        try {
            await saveToSupabase('appointments', {
                client_name: contact.name.trim(), client_email: contact.email.trim(),
                client_phone: contact.phone.trim() || null,
                date: selectedDate, time: selectedSlot, duration: selectedDuration,
                notes: notes.trim() || null, status: 'confirmed',
                created_at: new Date().toISOString(),
            });
            onSuccess({ name: contact.name, date: selectedDate, time: selectedSlot, duration: selectedDuration });
        } catch { setError('Erreur lors de la réservation. Réessayez.'); }
        finally { setSubmitting(false); }
    };

    return (
        <AnimatePresence mode="wait">
            {step === 'date' && (
                <motion.div key="date" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6, ease: EASE_SHARP }}>
                    <p className="text-center text-[11px] tracking-[0.4em] uppercase text-black/30 mb-4 font-haas font-bold">Planification — 1/2</p>
                    <h3 className="text-[clamp(28px,5vw,64px)] font-bold text-black text-center mb-10 leading-[1] tracking-tighter font-haas">Choisissez un créneau.</h3>

                    <div className="mb-8">
                        <p className="text-[11px] tracking-[0.3em] uppercase text-black/30 font-haas font-bold mb-4">Durée</p>
                        <div className="flex flex-wrap gap-3">
                            {CALL_DURATIONS.map(d => (
                                <button key={d} onMouseEnter={() => playHover()} onClick={() => { playClick(); setDuration(d); }}
                                        className={`px-6 py-3 rounded-full text-[13px] font-bold font-haas border transition-all ${selectedDuration === d ? 'bg-black text-white border-black' : 'border-black/20 hover:border-black/50'}`}>
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-8">
                        <p className="text-[11px] tracking-[0.3em] uppercase text-black/30 font-haas font-bold mb-4">Date</p>
                        <div className="flex flex-wrap gap-3">
                            {businessDays.map(day => (
                                <button key={day.value} onMouseEnter={() => playHover()} onClick={() => { playClick(); setSelectedDate(day.value); }}
                                        className={`px-6 py-3 rounded-full text-[13px] font-bold font-haas border capitalize transition-all ${selectedDate === day.value ? 'bg-black text-white border-black' : 'border-black/20 hover:border-black/50'}`}>
                                    {day.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-10">
                        <p className="text-[11px] tracking-[0.3em] uppercase text-black/30 font-haas font-bold mb-4">Heure</p>
                        <div className="flex flex-wrap gap-3">
                            {CALL_SLOTS.map(slot => (
                                <button key={slot} onMouseEnter={() => playHover()} onClick={() => { playClick(); setSelectedSlot(slot); }}
                                        className={`px-6 py-3 rounded-full text-[13px] font-bold font-haas border transition-all ${selectedSlot === slot ? 'bg-black text-white border-black' : 'border-black/20 hover:border-black/50'}`}>
                                    {slot}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center px-2">
                        <button onMouseEnter={() => playHover()} onClick={() => { playClick(); onBack(); }} className="text-[11px] text-black/35 font-bold font-haas uppercase tracking-[0.2em] underline hover:text-black transition-colors">← Retour</button>
                        {canNextDate && <motion.button onMouseEnter={() => playHover()} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} onClick={() => { playClick(); setStep('contact'); }} className="px-9 py-4 bg-black text-white rounded-full text-[11px] font-bold font-haas tracking-[0.2em] hover:scale-105 transition-all shadow-lg">CONTINUER →</motion.button>}
                    </div>
                </motion.div>
            )}
            {step === 'contact' && (
                <motion.div key="contact" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6, ease: EASE_SHARP }}>
                    <div className="max-w-xl mx-auto mb-8 bg-black/4 border border-black/8 rounded-[24px] p-5 flex items-center justify-between">
                        <div>
                            <span className="text-black/40 text-[10px] font-bold font-haas uppercase tracking-[0.2em] block mb-1">Votre créneau</span>
                            <span className="text-black text-[16px] font-bold font-haas block">{new Date(selectedDate + 'T00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                            <span className="text-black/50 text-[13px] font-haas">{selectedSlot} · {selectedDuration}</span>
                        </div>
                        <button onClick={() => { playClick(); setStep('date'); }} className="text-black/35 hover:text-black text-[11px] font-bold font-haas uppercase tracking-[0.2em] underline transition-colors">Modifier</button>
                    </div>
                    <p className="text-center text-[11px] tracking-[0.4em] uppercase text-black/30 mb-4 font-haas font-bold">Contact — 2/2</p>
                    <h3 className="text-[clamp(28px,5vw,64px)] font-bold text-black text-center mb-10 leading-[1] tracking-tighter font-haas">Comment vous joindre ?</h3>
                    <div className="max-w-xl mx-auto flex flex-col gap-4 mb-10">
                        <input type="text"  placeholder="Prénom & nom *"   value={contact.name}  onChange={e => setContact(c => ({ ...c, name: e.target.value }))}  className={s} />
                        <input type="email" placeholder="Email *"            value={contact.email} onChange={e => setContact(c => ({ ...c, email: e.target.value }))} className={s} />
                        <input type="tel"   placeholder="Téléphone"          value={contact.phone} onChange={e => setContact(c => ({ ...c, phone: e.target.value }))} className={s} />
                        <textarea rows={3} placeholder="Sujet du call, questions… (optionnel)" value={notes} onChange={e => setNotes(e.target.value)} className={`${s} resize-none`} />
                    </div>
                    {error && <p className="text-center text-red-500 text-[13px] font-bold font-haas mb-5">{error}</p>}
                    <div className="flex justify-between items-center px-2">
                        <button onMouseEnter={() => playHover()} onClick={() => { playClick(); setStep('date'); }} className="text-[11px] text-black/35 font-bold font-haas uppercase tracking-[0.2em] underline hover:text-black transition-colors">← Retour</button>
                        {canSubmit && <motion.button onMouseEnter={() => playHover()} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} onClick={() => { playClick(); handleSubmit(); }} disabled={isSubmitting} className="flex items-center gap-3 px-9 py-4 bg-black text-white rounded-full text-[11px] font-bold font-haas tracking-[0.2em] hover:scale-105 transition-all shadow-lg disabled:opacity-50">{isSubmitting ? 'RÉSERVATION…' : 'CONFIRMER →'}</motion.button>}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ─── HiFlow ────────────────────────────────────────
function HiFlow({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
    const [contact, setContact]         = useState<ContactField>({ name: '', email: '', phone: '', message: '' });
    const [isSubmitting, setSubmitting] = useState(false);
    const [error, setError]             = useState('');
    const { playClick, playHover }      = useSatisfyingSounds();
    const canSubmit = contact.name.trim().length > 1 && contact.email.includes('@') && (contact.message?.trim() || '').length > 0;
    const s = "w-full px-7 py-5 rounded-[28px] border border-black/15 bg-transparent text-[15px] font-medium outline-none placeholder:text-black/25 text-black font-haas focus:border-black/40 transition-colors";

    const handleSubmit = async () => {
        if (!canSubmit) return;
        setSubmitting(true);
        try {
            await saveToSupabase('messages', { sender: contact.name.trim(), subject: `Message de ${contact.name.trim()}`, body: contact.message?.trim() || '', time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }), is_read: false, created_at: new Date().toISOString() });
            onSuccess();
        } catch { setError('Erreur lors de l\'envoi. Réessayez.'); }
        finally { setSubmitting(false); }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.7, ease: EASE_SHARP }}>
            <h3 className="text-[clamp(28px,5vw,64px)] font-bold text-black text-center mb-3 leading-[1] tracking-tighter font-haas">Dites-nous tout.</h3>
            <p className="text-center text-black/35 text-[clamp(13px,1.6vw,20px)] mb-10 font-haas">Questions, partenariats, idées…</p>
            <div className="max-w-xl mx-auto flex flex-col gap-4 mb-10">
                <input type="text"  placeholder="Prénom & nom *"  value={contact.name}      onChange={e => setContact(c => ({ ...c, name: e.target.value }))}    className={s} />
                <input type="email" placeholder="Email *"          value={contact.email}     onChange={e => setContact(c => ({ ...c, email: e.target.value }))}   className={s} />
                <input type="tel"   placeholder="Téléphone"        value={contact.phone}     onChange={e => setContact(c => ({ ...c, phone: e.target.value }))}   className={s} />
                <textarea rows={5}  placeholder="Votre message *"  value={contact.message || ''} onChange={e => setContact(c => ({ ...c, message: e.target.value }))} className={`${s} resize-none`} />
            </div>
            {error && <p className="text-center text-red-500 text-[13px] font-bold font-haas mb-5">{error}</p>}
            <div className="flex justify-between items-center px-2">
                <button onMouseEnter={() => playHover()} onClick={() => { playClick(); onBack(); }} className="text-[11px] text-black/35 font-bold font-haas uppercase tracking-[0.2em] underline hover:text-black transition-colors">← Retour</button>
                {canSubmit && <motion.button onMouseEnter={() => playHover()} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} onClick={() => { playClick(); handleSubmit(); }} disabled={isSubmitting} className="px-9 py-4 bg-black text-white rounded-full text-[11px] font-bold font-haas tracking-[0.2em] hover:scale-105 transition-all shadow-lg disabled:opacity-50">{isSubmitting ? 'ENVOI…' : 'ENVOYER →'}</motion.button>}
            </div>
        </motion.div>
    );
}

// ─── ContactPanel ──────────────────────────────────
function ContactPanel({ isOpen, onClose, mainFlow, setMainFlow, successType, setSuccessType, callInfo, setCallInfo, projectStep, setProjectStep, projectAnswers, setProjectAnswers, projectContact, setProjectContact, isSubmittingProject, careerStep, setCareerStep, careerAnswers, setCareerAnswers, careerContact, setCareerContact, isSubmittingCareer, onProjectNext, onProjectBack, onProjectAnswer, onCareerAnswer, onCareerNext, onCareerBack, unlockAudio }: any) {
    const { playClick, playHover } = useSatisfyingSounds();

    const getSuccessTexts: Record<string, { title: string; message: string }> = {
        project: { title: 'Brief Reçu !', message: 'Votre projet a bien été enregistré. Nous revenons vers vous sous 24h avec une proposition personnalisée.' },
        call:    { title: 'Call Réservé !', message: callInfo ? `RDV confirmé le ${new Date(callInfo.date + 'T00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à ${callInfo.time} (${callInfo.duration}). À très vite ${callInfo.name} !` : 'Votre créneau est enregistré !' },
        career:  { title: 'Candidature Reçue !', message: 'Votre candidature est entre de bonnes mains. Nous vous contactons très vite.' },
        hi:      { title: 'Message Envoyé !', message: 'Nous avons bien reçu votre message. Réponse sous 48h garantie.' },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/30 backdrop-blur-md"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.94, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 40 }}
                        transition={{ duration: 0.6, ease: EASE_POWER }}
                        className="relative z-10 w-[92vw] max-w-[860px] max-h-[88vh] bg-[#F5F5F5] rounded-[40px] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.25)]"
                    >
                        <div className="absolute top-6 right-6 z-20">
                            <CloseBtn onClick={onClose} />
                        </div>
                        <div className="overflow-y-auto max-h-[88vh] px-6 sm:px-12 py-10 sm:py-14">
                            <AnimatePresence mode="wait">
                                {successType && getSuccessTexts[successType] && (
                                    <SuccessScreen key="success" {...getSuccessTexts[successType]} onClose={onClose} />
                                )}
                                {!mainFlow && !successType && (
                                    <motion.div key="menu" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6, ease: EASE_SHARP }}>
                                        <p className="text-center text-[11px] tracking-[0.4em] uppercase text-black/30 mb-4 font-haas font-bold">Comment pouvons-nous aider ?</p>
                                        <h2 className="text-[clamp(36px,6vw,80px)] font-bold text-black text-center mb-12 leading-[0.95] tracking-tighter font-haas">
                                            Démarrons<br />ensemble.
                                        </h2>
                                        <div className="grid grid-cols-2 gap-4">
                                            {([
                                                { id: 'project', label: 'Projet',   sub: 'Brief & devis',        desc: 'Réponse en 24h' },
                                                { id: 'call',    label: 'Call',     sub: 'Réservation directe',   desc: '30, 60 ou 90 min' },
                                                { id: 'join',    label: 'Carrière', sub: 'Nous rejoindre',         desc: 'Candidature rapide' },
                                                { id: 'hi',      label: 'Salut',    sub: 'Inquiries générales',   desc: 'Réponse sous 48h' },
                                            ] as const).map(({ id, label, sub, desc }) => (
                                                <MagneticButton key={id}
                                                                onClick={() => { unlockAudio(); setMainFlow(id); setProjectStep(0); setCareerStep(0); }}
                                                                className="flex flex-col items-start gap-3 sm:gap-4 px-6 sm:px-10 py-7 sm:py-9 bg-black text-white rounded-[24px] sm:rounded-[32px] text-left hover:scale-[1.02] transition-all shadow-xl group"
                                                >
                                                    <div className="space-y-1 pointer-events-none">
                                                        <span className="text-[24px] font-bold block uppercase font-haas">{label}</span>
                                                        <span className="text-[13px] text-white/55 block uppercase font-haas tracking-[0.1em]">{sub}</span>
                                                        <span className="text-[11px] text-white/45 block font-haas">{desc}</span>
                                                    </div>
                                                </MagneticButton>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                                {mainFlow === 'project' && !successType && projectStep < STEPS.length && (
                                    <StepQuestion key={`proj-${projectStep}`} step={STEPS[projectStep]} stepIndex={projectStep} totalSteps={STEPS.length} answers={projectAnswers} contactInfo={projectContact} onAnswer={onProjectAnswer} onContactChange={setProjectContact} onNext={onProjectNext} onBack={onProjectBack} isLast={projectStep === STEPS.length - 1} isSubmitting={isSubmittingProject} />
                                )}
                                {mainFlow === 'call' && !successType && (
                                    <BookCallFlow key="call" onBack={() => setMainFlow(null)} onSuccess={(info: any) => { setCallInfo(info); setSuccessType('call'); }} />
                                )}
                                {mainFlow === 'join' && !successType && careerStep < CAREER_STEPS.length && (
                                    <StepQuestion key={`career-${careerStep}`} step={CAREER_STEPS[careerStep]} stepIndex={careerStep} totalSteps={CAREER_STEPS.length} answers={careerAnswers} contactInfo={careerContact} onAnswer={onCareerAnswer} onContactChange={setCareerContact} onNext={onCareerNext} onBack={onCareerBack} isLast={careerStep === CAREER_STEPS.length - 1} isSubmitting={isSubmittingCareer} />
                                )}
                                {mainFlow === 'hi' && !successType && (
                                    <HiFlow key="hi" onBack={() => setMainFlow(null)} onSuccess={() => setSuccessType('hi')} />
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ─── Context & Provider ───────────────────────────
interface ContactPanelContextType {
    openPanel: (flow?: FlowType) => void;
}

export const ContactPanelContext = createContext<ContactPanelContextType>({
    openPanel: () => {},
});

export const useContactPanel = () => useContext(ContactPanelContext);

export function ContactPanelProvider({ children }: { children: ReactNode }) {
    const [chatOpen,       setChatOpen]       = useState(false);
    const [mainFlow,       setMainFlow]       = useState<FlowType>(null);
    const [successType,    setSuccessType]    = useState<string | null>(null);
    const [callInfo,       setCallInfo]       = useState<any>(null);

    const [projectStep,    setProjectStep]    = useState(0);
    const [projectAnswers, setProjectAnswers] = useState<Answers>({});
    const [projectContact, setProjectContact] = useState<ContactField>({ name: '', email: '', phone: '' });
    const [isSubmittingProject, setIsSubmittingProject] = useState(false);

    const [careerStep,     setCareerStep]     = useState(0);
    const [careerAnswers,  setCareerAnswers]  = useState<Answers>({});
    const [careerContact,  setCareerContact]  = useState<ContactField>({ name: '', email: '', phone: '' });
    const [isSubmittingCareer, setIsSubmittingCareer] = useState(false);

    const unlockAudio = useCallback(async () => {
        if (typeof window !== 'undefined' && Tone.getContext().state !== 'running') await Tone.start();
    }, []);

    const closePanel = useCallback(() => {
        setChatOpen(false);
        setTimeout(() => {
            setMainFlow(null); setSuccessType(null); setCallInfo(null);
            setProjectStep(0); setProjectAnswers({}); setProjectContact({ name: '', email: '', phone: '' });
            setCareerStep(0);  setCareerAnswers({});  setCareerContact({ name: '', email: '', phone: '' });
        }, 700);
    }, []);

    const openPanel = useCallback((flow?: FlowType) => {
        unlockAudio();
        setChatOpen(true);
        if (flow) {
            setMainFlow(flow);
            setProjectStep(0);
            setCareerStep(0);
        }
    }, [unlockAudio]);

    // Handlers
    const handleProjectAnswer = useCallback((key: string, val: string | string[]) => setProjectAnswers(prev => ({ ...prev, [key]: val })), []);
    const handleProjectNext = useCallback(async () => {
        if (projectStep === STEPS.length - 1) {
            setIsSubmittingProject(true);
            try {
                await saveToSupabase('projects', {
                    name: `Brief - ${projectContact.name}`, client: projectContact.email.trim(),
                    category: Array.isArray(projectAnswers.services) ? projectAnswers.services[0] : (projectAnswers.services || 'Non spécifié'),
                    year: new Date().getFullYear().toString(), status: 'BETA',
                    description: `Services: ${Array.isArray(projectAnswers.services) ? projectAnswers.services.join(', ') : projectAnswers.services || ''} | Objectif: ${projectAnswers.goal || ''} | Audience: ${projectAnswers.audience || ''} | Délai: ${projectAnswers.timeline || ''} | Budget: ${projectAnswers.budget || ''} | Détails: ${projectAnswers.extra || ''}`,
                    links: {}, metrics: { seo: 90, performance: 90, accessibility: 90 }, notes: [projectAnswers.extra || ''], created_at: new Date().toISOString(),
                });
                setSuccessType('project');
            } catch (e) { console.error(e); }
            finally { setIsSubmittingProject(false); }
        } else { setProjectStep(s => s + 1); }
    }, [projectStep, projectAnswers, projectContact]);
    const handleProjectBack = useCallback(() => { if (projectStep === 0) setMainFlow(null); else setProjectStep(s => s - 1); }, [projectStep]);

    const handleCareerAnswer = useCallback((key: string, val: string | string[]) => setCareerAnswers(prev => ({ ...prev, [key]: val })), []);
    const handleCareerNext = useCallback(async () => {
        if (careerStep === CAREER_STEPS.length - 1) {
            setIsSubmittingCareer(true);
            try {
                await saveToSupabase('applications', { candidate_name: careerContact.name.trim(), candidate_email: careerContact.email.trim(), candidate_phone: careerContact.phone.trim() || null, role: careerAnswers.role || '', experience: careerAnswers.xp || '', contract_type: careerAnswers.type || '', portfolio: careerAnswers.cv || '', status: 'pending', created_at: new Date().toISOString() });
                setSuccessType('career');
            } catch (e) { console.error(e); }
            finally { setIsSubmittingCareer(false); }
        } else { setCareerStep(s => s + 1); }
    }, [careerStep, careerAnswers, careerContact]);
    const handleCareerBack = useCallback(() => { if (careerStep === 0) setMainFlow(null); else setCareerStep(s => s - 1); }, [careerStep]);

    return (
        <ContactPanelContext.Provider value={{ openPanel }}>
            {children}
            <ContactPanel
                isOpen={chatOpen} onClose={closePanel}
                mainFlow={mainFlow} setMainFlow={setMainFlow}
                successType={successType} setSuccessType={setSuccessType}
                callInfo={callInfo} setCallInfo={setCallInfo}
                projectStep={projectStep} setProjectStep={setProjectStep}
                projectAnswers={projectAnswers} setProjectAnswers={setProjectAnswers}
                projectContact={projectContact} setProjectContact={setProjectContact}
                isSubmittingProject={isSubmittingProject}
                careerStep={careerStep} setCareerStep={setCareerStep}
                careerAnswers={careerAnswers} setCareerAnswers={setCareerAnswers}
                careerContact={careerContact} setCareerContact={setCareerContact}
                isSubmittingCareer={isSubmittingCareer}
                onProjectAnswer={handleProjectAnswer} onProjectNext={handleProjectNext} onProjectBack={handleProjectBack}
                onCareerAnswer={handleCareerAnswer} onCareerNext={handleCareerNext} onCareerBack={handleCareerBack}
                unlockAudio={unlockAudio}
            />
        </ContactPanelContext.Provider>
    );
}
