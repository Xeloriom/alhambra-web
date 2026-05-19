'use client';

import React, { useState, useEffect, useRef, memo } from 'react';
import {
    motion,
    AnimatePresence,
    useScroll,
    useTransform,
} from 'framer-motion';
import { useSatisfyingSounds } from '@/hooks/use-satisfying-sounds';
import { useContactPanel } from '@/components/contact-panel-context';
import { useHeroReady } from '@/components/hero-ready-context';

const EASE: [number, number, number, number]       = [0.16, 1, 0.3, 1];
const EASE_SHARP: [number, number, number, number] = [0.76, 0, 0.24, 1];

const HERO_VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260428_193507_4286c423-2fd9-4efd-92bd-91a939453fc1.mp4';

const NAV_LINKS = [
    { label: 'projets',  href: '#work'     },
    { label: 'agence',   href: '#about'    },
    { label: 'services', href: '#services' },
    { label: 'contact',  href: '#contact'  },
];

// ─────────────────────────────────────────────────
// HeroNav — white text on dark background
// ─────────────────────────────────────────────────
const HeroNav = memo(function HeroNav({ ready, logoGone, onDarkBg, navVisible, onChatOpen, onMenuToggle, menuOpen }: {
    ready: boolean;
    logoGone: boolean;
    onDarkBg: boolean;
    navVisible: boolean;
    onChatOpen: () => void;
    onMenuToggle: () => void;
    menuOpen: boolean;
}) {
    const { playClick, playHover } = useSatisfyingSounds();

    // Fond sombre → bouton blanc solide / Fond clair → bouton noir solide
    // Pas de backdrop-blur : couleur directe, toujours lisible peu importe le fond
    const pill    = onDarkBg ? 'bg-white hover:bg-white/90'  : 'bg-black hover:bg-black/80';
    const txt     = onDarkBg ? 'text-black'                   : 'text-white';
    const dot     = onDarkBg ? 'bg-black'                     : 'bg-white';
    const dotWrap = onDarkBg ? 'bg-black/10'                  : 'bg-white/10';
    const iconFg  = onDarkBg ? 'black'                        : 'white';
    const iconBg  = onDarkBg ? 'bg-black'                     : 'bg-white';
    const logoCol = onDarkBg ? '#fff'                         : '#000';

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={ready ? { y: navVisible ? 0 : -80, opacity: navVisible ? 1 : 0 } : {}}
            transition={{ duration: navVisible ? 0.55 : 0.3, ease: navVisible ? EASE : EASE_SHARP }}
            className="fixed top-0 left-0 w-full px-6 sm:px-10 lg:px-12 py-5 sm:py-6 flex justify-between items-center z-[100]"
        >
            {/* Logo */}
            <div className="overflow-hidden" style={{ height: 'clamp(18px, 1.8vw, 30px)', pointerEvents: logoGone ? 'none' : 'auto' }}>
                <motion.a
                    href="#"
                    className="font-nordique tracking-tighter leading-none lowercase cursor-pointer block transition-colors duration-500"
                    style={{ fontSize: 'clamp(16px, 1.8vw, 28px)', color: logoCol }}
                    animate={{ y: logoGone ? '-130%' : '0%' }}
                    transition={{ duration: 0.65, ease: EASE_SHARP }}
                >
                    alhambra web
                </motion.a>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                {/* CTA desktop */}
                <motion.button
                    onMouseEnter={playHover}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => { playClick(); onChatOpen(); }}
                    className={`hidden sm:flex items-center pl-5 lg:pl-6 pr-2 py-2 rounded-full transition-all duration-500 cursor-pointer ${pill}`}
                >
                    <span className={`font-haas text-[11px] lg:text-[12px] tracking-[0.08em] lowercase font-semibold mr-4 ${txt}`}>
                        parler à l&apos;agence
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconBg}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={iconFg === 'black' ? 'white' : 'black'} strokeWidth="2.5">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    </div>
                </motion.button>

                {/* CTA mobile */}
                <button
                    onMouseEnter={playHover}
                    onClick={() => { playClick(); onChatOpen(); }}
                    aria-label="Parler à l'agence"
                    className={`sm:hidden w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 ${pill}`}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={iconFg} strokeWidth="2.5">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                </button>

                {/* Menu */}
                <button
                    onMouseEnter={playHover}
                    onClick={() => { playClick(); onMenuToggle(); }}
                    className={`flex items-center pl-5 lg:pl-6 pr-2 py-2 rounded-full cursor-pointer h-[42px] sm:h-[44px] transition-all duration-500 ${pill}`}
                >
                    <span className={`font-haas text-[11px] lg:text-[12px] tracking-[0.08em] font-semibold mr-5 lg:mr-7 lowercase ${txt}`}>
                        {menuOpen ? 'fermer' : 'menu'}
                    </span>
                    <div className={`flex gap-[5px] w-[38px] h-[30px] rounded-full items-center justify-center ${dotWrap}`}>
                        <motion.div animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 1 : 0 }}  transition={{ duration: 0.3, ease: EASE_SHARP }} className={`w-[5px] h-[5px] rounded-full ${dot}`} />
                        <motion.div animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -1 : 0 }} transition={{ duration: 0.3, ease: EASE_SHARP }} className={`w-[5px] h-[5px] rounded-full ${dot}`} />
                    </div>
                </button>
            </div>
        </motion.nav>
    );
});

// ─────────────────────────────────────────────────
// HeroVideo — full-screen background
// ─────────────────────────────────────────────────
const HeroVideo = memo(function HeroVideo({ ready }: { ready: boolean }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { scrollYProgress } = useScroll();
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.06]);

    useEffect(() => {
        if (ready && videoRef.current) {
            videoRef.current.play().catch(() => {});
        }
    }, [ready]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={ready ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 2.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-0"
            style={{ scale, willChange: 'transform' }}
        >
            <video
                ref={videoRef}
                id="hero-video"
                autoPlay
                loop
                muted
                playsInline
                preload="none"
                className="absolute inset-0 w-full h-full object-cover z-0"
            >
                <source src={HERO_VIDEO_URL} type="video/mp4" />
                <track kind="captions" />
            </video>

            <div className="absolute inset-0 bg-black/20 z-10" />
            <div className="absolute inset-0 z-10" style={{
                background: 'radial-gradient(ellipse at 60% 50%, transparent 30%, rgba(0,0,0,0.5) 100%)',
            }} />
            <div className="absolute inset-y-0 left-0 w-2/3 z-10" style={{
                background: 'linear-gradient(to right, rgba(0,0,0,0.45) 0%, transparent 100%)',
            }} />
            <div className="absolute bottom-0 left-0 right-0 h-72 z-10" style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
            }} />
            <div className="absolute top-0 left-0 right-0 h-48 z-10" style={{
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)',
            }} />
        </motion.div>
    );
});

// ─────────────────────────────────────────────────
// CharReveal — per-character slide-up inside a line mask
// Usage: wrap with an overflow-hidden container at call site
// ─────────────────────────────────────────────────
const CHAR_EASE: [number, number, number, number] = [0.19, 1, 0.22, 1];
const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;

function CharReveal({
    text,
    ready,
    baseDelay,
    stagger,
    duration,
}: {
    text: string;
    ready: boolean;
    baseDelay: number;
    stagger: number;
    duration: number;
}) {
    if (isMobileDevice) {
        return (
            <motion.span
                style={{ display: 'inline-block', whiteSpace: 'pre-wrap' }}
                initial={{ y: '100%', opacity: 0 }}
                animate={ready ? { y: '0%', opacity: 1 } : {}}
                transition={{ duration: duration * 0.9, ease: CHAR_EASE, delay: baseDelay }}
            >
                {text}
            </motion.span>
        );
    }
    return (
        <>
            {text.split('').map((ch, i) => (
                <motion.span
                    key={i}
                    aria-hidden="true"
                    style={{ display: 'inline-block', willChange: 'transform', whiteSpace: 'pre' }}
                    initial={{ y: '105%' }}
                    animate={ready ? { y: '0%' } : {}}
                    transition={{ duration, ease: CHAR_EASE, delay: baseDelay + i * stagger }}
                >
                    {ch}
                </motion.span>
            ))}
        </>
    );
}

// ─────────────────────────────────────────────────
// HeroContent
// ─────────────────────────────────────────────────
const HeroContent = memo(function HeroContent({ ready, onChatOpen }: { ready: boolean; onChatOpen: () => void }) {
    const { playClick, playHover } = useSatisfyingSounds();

    return (
        <div className="absolute inset-0 z-20 flex flex-col justify-between px-5 sm:px-10 lg:px-12 pt-24 sm:pt-32 sm:pb-12 lg:pb-14 pb-safe">

            {/* Top — status badge */}
            <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={ready ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 1, ease: EASE, delay: 0.2 }}
                className="flex items-center gap-2"
            >
                <span className="w-[5px] h-[5px] sm:w-[6px] sm:h-[6px] rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <span className="font-haas text-[9px] sm:text-[10px] lg:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] text-white uppercase" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
                    Studio Créatif · Lyon · Disponible
                </span>
            </motion.div>

            {/* Middle — headline */}
            <div className="w-full">
                {/* Label */}
                <div className="mb-2 sm:mb-3" style={{ overflow: 'hidden' }}>
                    <p
                        className="font-haas text-white/50 leading-none tracking-[0.4em] uppercase"
                        style={{ fontSize: 'clamp(9px, 0.9vw, 12px)', textShadow: '0 1px 12px rgba(0,0,0,0.6)' }}
                        aria-label="Agence Web Premium"
                    >
                        <CharReveal text="Agence Web Premium" ready={ready} baseDelay={0.38} stagger={0.018} duration={0.7} />
                    </p>
                </div>

                {/* H1 unique wrapping the two visual lines */}
                <h1
                    aria-label="l'avenir digital."
                    className="contents"
                >
                    {/* Line 1 — "l'avenir" italic */}
                    <div style={{ overflow: 'hidden', paddingBottom: '0.1em', marginBottom: '-0.1em' }}>
                        <span
                            className="font-nordique text-white italic leading-[0.88] tracking-[-0.03em] block"
                            style={{ fontSize: 'clamp(58px, 11vw, 168px)', textShadow: '0 2px 32px rgba(0,0,0,0.3)' }}
                        >
                            <CharReveal text="l'avenir" ready={ready} baseDelay={0.62} stagger={0.048} duration={1.15} />
                        </span>
                    </div>

                    {/* Line 2 — "digital." */}
                    <div style={{ overflow: 'hidden', paddingBottom: '0.12em', marginBottom: '-0.12em' }}>
                        <span
                            className="font-nordique text-white leading-[0.88] tracking-[-0.03em] block"
                            style={{ fontSize: 'clamp(58px, 11vw, 168px)', textShadow: '0 2px 32px rgba(0,0,0,0.3)' }}
                        >
                            <CharReveal text="digital." ready={ready} baseDelay={0.95} stagger={0.048} duration={1.15} />
                        </span>
                    </div>
                </h1>
            </div>

            {/* Bottom — desc + CTAs */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={ready ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1.2, ease: EASE, delay: 1.5 }}
                className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6"
            >
                {/* Description */}
                <p className="font-haas text-[11px] sm:text-[13px] lg:text-[14px] text-white/65 leading-[1.75] max-w-[220px] sm:max-w-[300px]" style={{ textShadow: '0 1px 10px rgba(0,0,0,0.5)' }}>
                    Design radical, développement de pointe.<br />
                    On ne fait pas du web — on bâtit des empires.
                </p>

                {/* CTAs + scroll */}
                <div className="flex flex-col gap-4 sm:items-end">
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Primary CTA */}
                        <button
                            onMouseEnter={playHover}
                            onClick={() => { playClick(); onChatOpen(); }}
                            className="group relative overflow-hidden bg-white text-black pl-5 sm:pl-6 pr-2 py-[9px] sm:py-[10px] rounded-full flex items-center gap-4 sm:gap-5 cursor-pointer"
                        >
                            <motion.div
                                className="absolute inset-0 bg-black/8"
                                initial={{ x: '-100%' }}
                                whileHover={{ x: 0 }}
                                transition={{ duration: 0.4, ease: EASE_SHARP }}
                            />
                            <span className="relative font-haas text-[11px] sm:text-[12px] tracking-[0.1em] lowercase font-semibold">
                                démarrer un projet
                            </span>
                            <div className="relative w-7 h-7 sm:w-8 sm:h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-black/80 transition-colors duration-300">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                                </svg>
                            </div>
                        </button>

                        {/* Secondary CTA */}
                        <a
                            href="#work"
                            onMouseEnter={playHover}
                            onClick={playClick}
                            className="group flex items-center gap-2 font-haas text-[11px] sm:text-[12px] tracking-[0.1em] lowercase text-white/65 hover:text-white/90 transition-colors duration-300 cursor-pointer"
                        >
                            nos projets
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-300 group-hover:translate-x-0.5">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>

                    {/* Scroll indicator */}
                    <div className="flex items-center gap-2 opacity-30">
                        <div className="w-4 sm:w-5 h-[1px] bg-white overflow-hidden relative">
                            <div className="absolute inset-0 bg-white animate-scroll-bar" />
                        </div>
                        <span className="font-haas text-[8px] sm:text-[9px] tracking-[0.25em] text-white uppercase">scroll</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
});

// ─────────────────────────────────────────────────
// HeroMarquee — bottom strip
// ─────────────────────────────────────────────────
const HeroMarquee = memo(function HeroMarquee({ ready }: { ready: boolean }) {
    const text = 'alhambra web · studio créatif & digital · lyon · ';
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ duration: 1.2, ease: EASE, delay: 0.8 }}
            className="absolute bottom-0 left-0 w-full z-30 overflow-hidden pointer-events-none select-none"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
            <div className="flex whitespace-nowrap py-[10px]">
                <div className="flex animate-marquee" style={{ animationDuration: '50s' }}>
                    {[0, 1].map(k => (
                        <span key={k} className="font-haas text-[9px] sm:text-[10px] tracking-[0.28em] text-white/25 uppercase">
                            {text.repeat(14)}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
});

// ─────────────────────────────────────────────────
// HeroMenuOverlay
// ─────────────────────────────────────────────────
const HeroMenuOverlay = memo(function HeroMenuOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { playHover } = useSatisfyingSounds();

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ duration: 0.6, ease: EASE_SHARP }}
                    className="fixed inset-0 z-[150] bg-[#060606] flex items-center justify-center"
                >
                    <div className="absolute left-1/2 top-0 w-[1px] h-full bg-white/5 pointer-events-none" />

                    <div className="flex flex-col gap-3 sm:gap-4 text-center px-8 w-full">
                        {NAV_LINKS.map((link, i) => (
                            <motion.a
                                key={link.href}
                                href={link.href}
                                onClick={onClose}
                                onMouseEnter={playHover}
                                initial={{ opacity: 0, y: 28 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07 + 0.08, duration: 0.6, ease: EASE }}
                                className="font-nordique text-white lowercase tracking-tighter hover:text-white/40 transition-colors duration-200 block"
                                style={{ fontSize: 'clamp(44px, 9.5vw, 120px)', lineHeight: 0.88 }}
                            >
                                {link.label}
                            </motion.a>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="absolute bottom-8 left-0 w-full px-8 flex items-center justify-between"
                    >
                        <span className="font-haas text-[10px] tracking-[0.3em] uppercase text-white/20">
                            alhambra web · lyon
                        </span>
                        <button
                            onClick={onClose}
                            className="font-haas text-[10px] uppercase tracking-[0.3em] text-white/50 cursor-pointer hover:text-white/80 transition-colors"
                        >
                            Fermer ×
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
});

// ─────────────────────────────────────────────────
// HeroSection
// ─────────────────────────────────────────────────
export function HeroSection({ ready: readyProp }: { ready?: boolean }) {
    const contextReady = useHeroReady();
    const ready = readyProp !== undefined ? readyProp : contextReady;

    const [menuOpen,    setMenuOpen]    = useState(false);
    const [logoGone,    setLogoGone]    = useState(false);
    const [pastHero,    setPastHero]    = useState(false);
    const [isOverDark,  setIsOverDark]  = useState(false);
    const [navVisible,  setNavVisible]  = useState(true);
    const lastScrollY                   = useRef(0);
    const { openPanel }                 = useContactPanel();
    const { playClick }                 = useSatisfyingSounds();

    useEffect(() => {
        let rafId = 0;
        const onScroll = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const y  = window.scrollY;
                const vh = window.innerHeight;
                const isPast = y > vh * 0.85;

                if (isPast) {
                    if (y > lastScrollY.current + 3)       setNavVisible(false);
                    else if (y < lastScrollY.current - 3)  setNavVisible(true);
                } else {
                    setNavVisible(true);
                }
                lastScrollY.current = y;

                setLogoGone(y > 60);
                setPastHero(isPast);

                const darkEls = document.querySelectorAll('[data-nav-dark]');
                let overDark = false;
                darkEls.forEach(el => {
                    const r = el.getBoundingClientRect();
                    if (r.top <= 80 && r.bottom > 0) overDark = true;
                });
                setIsOverDark(overDark);
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(rafId); };
    }, []);

    const onDarkBg = !pastHero || isOverDark;

    return (
        <section className="relative w-full h-screen overflow-hidden font-haas bg-black">
            <HeroMenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

            <HeroNav
                ready={ready}
                logoGone={logoGone}
                onDarkBg={onDarkBg}
                navVisible={navVisible}
                onChatOpen={() => openPanel()}
                onMenuToggle={() => { playClick(); setMenuOpen(v => !v); }}
                menuOpen={menuOpen}
            />

            <HeroVideo ready={ready} />
            <HeroContent ready={ready} onChatOpen={() => openPanel()} />
            <HeroMarquee ready={ready} />
        </section>
    );
}
