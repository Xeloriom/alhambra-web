'use client';

import React, { memo, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const faqs = [
    {
        q: 'Quel est le délai moyen pour un projet ?',
        a: '4 à 8 semaines pour un impact chirurgical. On livre vite, on livre bien — sans jamais sacrifier la qualité.',
        tag: 'Délais',
    },
    {
        q: 'Quelles technologies utilisez-vous ?',
        a: 'Next.js, React, Framer Motion, TypeScript, Tailwind. La stack la plus performante du marché, sans compromis.',
        tag: 'Tech',
    },
    {
        q: 'Quel est votre budget minimum ?',
        a: 'À partir de 3 000€ pour un site vitrine premium. Chaque projet est sur-mesure — on aligne budget et ambition.',
        tag: 'Budget',
    },
    {
        q: 'Proposez-vous de la maintenance ?',
        a: 'Oui. On veille sur votre empire digital 24/7. Support, mises à jour, évolutions — on est là sur le long terme.',
        tag: 'Support',
    },
    {
        q: 'Le code m\'appartient-il après livraison ?',
        a: 'À 100%. Livraison du repo complet à la fin de chaque projet. Votre propriété intellectuelle, pas la nôtre.',
        tag: 'Propriété',
    },
    {
        q: 'Travaillez-vous sur des refontes ?',
        a: 'Oui. On prend en charge l\'existant et on le transforme. Audit technique, design, performance — refonte totale si besoin.',
        tag: 'Refonte',
    },
    {
        q: 'Gérez-vous le SEO et les performances ?',
        a: 'Score Lighthouse 95+ garanti. On code pour Google autant que pour vos utilisateurs — performance et visibilité, toujours.',
        tag: 'SEO',
    },
    {
        q: 'Faites-vous du e-commerce ?',
        a: 'Shopify, custom cart, tunnel de conversion optimisé. On construit des boutiques qui convertissent, pas juste qui existent.',
        tag: 'E-commerce',
    },
] as const;

const EASE: [number, number, number, number]       = [0.16, 1, 0.3, 1];
const EASE_SHARP: [number, number, number, number] = [0.76, 0, 0.24, 1];

const FaqRow = memo(function FaqRow({
    faq,
    index,
    isOpen,
    onToggle,
}: {
    faq: (typeof faqs)[number];
    index: number;
    isOpen: boolean;
    onToggle: () => void;
}) {
    const prefersReduced = useReducedMotion();
    const num = String(index + 1).padStart(2, '0');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-32px' }}
            transition={{ duration: 0.6, delay: index * 0.04, ease: EASE }}
            className="border-b border-black/[0.07]"
        >
            <button
                onClick={onToggle}
                className="w-full flex items-center gap-5 sm:gap-8 py-6 sm:py-7 lg:py-8 text-left group cursor-pointer"
                aria-expanded={isOpen}
            >
                {/* Number */}
                <span
                    className="font-haas text-[10px] sm:text-[11px] tracking-[0.3em] flex-shrink-0 tabular-nums transition-colors duration-300"
                    style={{ color: isOpen ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)' }}
                >
                    {num}
                </span>

                {/* Question */}
                <span
                    className="font-nordique leading-tight tracking-tight flex-1 transition-colors duration-300"
                    style={{
                        fontSize: 'clamp(18px, 2.4vw, 38px)',
                        color: isOpen ? '#000' : 'rgba(0,0,0,0.5)',
                    }}
                >
                    {faq.q}
                </span>

                {/* Tag — hidden on small screens */}
                <span
                    className="hidden lg:block font-haas text-[10px] tracking-[0.2em] uppercase flex-shrink-0 mr-6 transition-colors duration-300"
                    style={{ color: isOpen ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)' }}
                >
                    {faq.tag}
                </span>

                {/* Toggle icon */}
                <div
                    className="flex-shrink-0 w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-400"
                    style={{
                        borderColor: isOpen ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)',
                        background: isOpen ? '#000' : 'transparent',
                    }}
                >
                    <motion.svg
                        animate={prefersReduced ? {} : { rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.35, ease: EASE_SHARP }}
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={isOpen ? 'white' : 'black'}
                        strokeWidth="2"
                    >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </motion.svg>
                </div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: prefersReduced ? 0.01 : 0.45, ease: EASE }}
                        className="overflow-hidden"
                    >
                        <motion.p
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 6, opacity: 0 }}
                            transition={{ duration: 0.35, delay: 0.08, ease: EASE }}
                            className="font-haas text-[14px] sm:text-[15px] lg:text-[16px] leading-[1.7] text-black/45 max-w-2xl pb-7 sm:pb-8"
                            style={{ paddingLeft: 'calc(1.25rem + 2.5rem)' }}
                        >
                            {faq.a}
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
});
FaqRow.displayName = 'FaqRow';

export const FaqSection = memo(function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const handleToggle = useCallback(
        (i: number) => setOpenIndex(prev => (prev === i ? null : i)),
        [],
    );

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpenIndex(null);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    return (
        <section
            className="relative w-full bg-white py-20 sm:py-28 lg:py-32 px-4 sm:px-8 lg:px-16"
            id="faq"
            aria-label="FAQ — Questions fréquentes sur nos services web"
        >
            {/* Header */}
            <div className="flex items-end justify-between mb-14 sm:mb-16 lg:mb-20 border-b border-black/[0.07] pb-8 sm:pb-10">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: EASE }}
                >
                    <span className="block font-haas text-[10px] sm:text-[11px] tracking-[0.35em] uppercase text-black/30 mb-3">
                        Questions fréquentes
                    </span>
                    <h2
                        className="font-nordique text-black leading-none tracking-tighter"
                        style={{ fontSize: 'clamp(34px, 5.5vw, 88px)' }}
                    >
                        FAQ
                    </h2>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
                    className="hidden md:block font-haas text-[12px] text-black/25 text-right leading-relaxed"
                >
                    {faqs.length} questions,<br />autant de réponses directes.
                </motion.p>
            </div>

            {/* Rows */}
            <div>
                {faqs.map((faq, i) => (
                    <FaqRow
                        key={i}
                        faq={faq}
                        index={i}
                        isOpen={openIndex === i}
                        onToggle={() => handleToggle(i)}
                    />
                ))}
            </div>

            {/* Bottom CTA */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                className="mt-14 sm:mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-5"
            >
                <p className="font-haas text-[13px] text-black/30">
                    Une question qui n&apos;est pas là ?
                </p>
                <a
                    href="#contact"
                    className="group flex items-center gap-3 font-haas text-[13px] text-black/50 hover:text-black transition-colors duration-300 cursor-pointer"
                >
                    <span className="tracking-[0.12em] uppercase text-[11px]">Parlons-en directement</span>
                    <div className="w-7 h-7 rounded-full border border-black/15 group-hover:border-black/50 flex items-center justify-center transition-all duration-300 group-hover:bg-black group-hover:border-black">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:stroke-white transition-colors duration-300">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </div>
                </a>
            </motion.div>
        </section>
    );
});

FaqSection.displayName = 'FaqSection';
