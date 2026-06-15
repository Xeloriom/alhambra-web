'use client';

import { useState, useEffect, useRef, memo } from 'react';
import dynamic from 'next/dynamic';
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
            className="fixed top-0 left-0 w-full px-4 sm:px-10 lg:px-12 py-4 sm:py-6 flex justify-between items-center z-[100]"
        >
            {/* Logo */}
            <div className="overflow-hidden" style={{ height: 'clamp(18px, 1.8vw, 30px)', pointerEvents: logoGone ? 'none' : 'auto' }}>
                <motion.a
                    href="#"
                    title="Alhambra Web — Retour en haut de page"
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
                    className={`sm:hidden w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 ${pill}`}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={iconFg} strokeWidth="2.5">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                </button>

                {/* Menu */}
                <button
                    onMouseEnter={playHover}
                    onClick={() => { playClick(); onMenuToggle(); }}
                    className={`flex items-center pl-5 lg:pl-6 pr-2 py-2 rounded-full cursor-pointer h-[44px] sm:h-[44px] transition-all duration-500 ${pill}`}
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
// HeroMesh — aurora subtile + grain + curseur
// ─────────────────────────────────────────────────
const HeroMesh = memo(function HeroMesh({ ready }: { ready: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouse     = useRef({ x: 0.5, y: 0.5 });
    const sm        = useRef({ x: 0.5, y: 0.5 });
    const rafRef    = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);

        const onMove = (e: MouseEvent) => {
            mouse.current.x = e.clientX / window.innerWidth;
            mouse.current.y = e.clientY / window.innerHeight;
        };
        window.addEventListener('mousemove', onMove);

        const draw = (t: number) => {
            const W = canvas.width, H = canvas.height;
            const D = Math.max(W, H);

            sm.current.x += (mouse.current.x - sm.current.x) * 0.025;
            sm.current.y += (mouse.current.y - sm.current.y) * 0.025;
            const mx = sm.current.x, my = sm.current.y;

            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = '#08080E';
            ctx.fillRect(0, 0, W, H);

            ctx.globalCompositeOperation = 'screen';

            // Blob principal — indigo, lent, large, haut-droite
            const b1x = (0.68 + Math.sin(t * 0.00009) * 0.06 + (mx - 0.5) * 0.06) * W;
            const b1y = (0.28 + Math.cos(t * 0.00011) * 0.05 + (my - 0.5) * 0.04) * H;
            const g1  = ctx.createRadialGradient(b1x, b1y, 0, b1x, b1y, D * 0.72);
            g1.addColorStop(0,   'rgba(90, 60, 200, 0.18)');
            g1.addColorStop(0.4, 'rgba(70, 45, 160, 0.07)');
            g1.addColorStop(1,   'rgba(50, 30, 120, 0)');
            ctx.fillStyle = g1;
            ctx.fillRect(0, 0, W, H);

            // Blob secondaire — bleu froid, bas-gauche, très subtil
            const b2x = (0.18 + Math.sin(t * 0.00007 + 2) * 0.05 + (mx - 0.5) * 0.03) * W;
            const b2y = (0.72 + Math.cos(t * 0.00008 + 1) * 0.04 + (my - 0.5) * 0.02) * H;
            const g2  = ctx.createRadialGradient(b2x, b2y, 0, b2x, b2y, D * 0.55);
            g2.addColorStop(0,   'rgba(40, 80, 200, 0.10)');
            g2.addColorStop(0.5, 'rgba(30, 60, 160, 0.03)');
            g2.addColorStop(1,   'rgba(20, 40, 120, 0)');
            ctx.fillStyle = g2;
            ctx.fillRect(0, 0, W, H);

            // Lueur curseur — très discrète
            const g3 = ctx.createRadialGradient(mx * W, my * H, 0, mx * W, my * H, D * 0.30);
            g3.addColorStop(0,   'rgba(110, 80, 255, 0.08)');
            g3.addColorStop(0.6, 'rgba(90, 60, 220, 0.02)');
            g3.addColorStop(1,   'rgba(70, 40, 180, 0)');
            ctx.fillStyle = g3;
            ctx.fillRect(0, 0, W, H);

            ctx.globalCompositeOperation = 'source-over';
            rafRef.current = requestAnimationFrame(draw);
        };

        rafRef.current = requestAnimationFrame(draw);
        return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); window.removeEventListener('mousemove', onMove); };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-0"
        >
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

            {/* Grain — texture premium */}
            <div className="absolute inset-0 z-10 pointer-events-none" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                backgroundSize: '256px 256px',
                opacity: 0.055,
                mixBlendMode: 'overlay',
            }} />

            {/* Gradients lisibilité texte */}
            <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 70% at 72% 30%, transparent 0%, rgba(8,8,14,0.45) 100%)' }} />
            <div className="absolute inset-y-0 left-0 w-3/4 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(8,8,14,0.55) 0%, transparent 100%)' }} />
            <div className="absolute bottom-0 left-0 right-0 h-80 z-10 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(8,8,14,0.85) 0%, rgba(8,8,14,0.2) 55%, transparent 100%)' }} />
            <div className="absolute top-0 left-0 right-0 h-44 z-10 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(8,8,14,0.35) 0%, transparent 100%)' }} />
        </motion.div>
    );
});

// ─────────────────────────────────────────────────
// HeroVideo — gardé en fallback (désactivé)
// ─────────────────────────────────────────────────
const HeroVideo = memo(function HeroVideo({ ready }: { ready: boolean }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { scrollYProgress } = useScroll();
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.06]);

    useEffect(() => {
        if (ready && videoRef.current) videoRef.current.play().catch(() => {});
    }, [ready]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={ready ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 2.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-0"
            style={{ scale, willChange: 'transform' }}
        >
            <video ref={videoRef} id="hero-video" autoPlay loop muted playsInline preload="none" className="absolute inset-0 w-full h-full object-cover z-0">
                <source src={HERO_VIDEO_URL} type="video/mp4" />
                <track kind="captions" />
            </video>
            <div className="absolute inset-0 bg-black/25 z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-72 z-10" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)' }} />
        </motion.div>
    );
});

// ─────────────────────────────────────────────────
// CharReveal — per-character slide-up inside a line mask
// Usage: wrap with an overflow-hidden container at call site
// ─────────────────────────────────────────────────
const CHAR_EASE: [number, number, number, number] = [0.19, 1, 0.22, 1];

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
    return (
        <>
            {text.split('').map((ch, i) => (
                <motion.span
                    key={i}
                    aria-hidden="true"
                    style={{ display: 'inline-block', whiteSpace: 'pre' }}
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
        <div className="absolute inset-0 z-20 flex flex-col justify-between px-4 sm:px-10 lg:px-12 pt-20 sm:pt-32 pb-8 sm:pb-12 lg:pb-14 pointer-events-none">

            {/* Top — status badge */}
            <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={ready ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 1, ease: EASE, delay: 0.2 }}
                className="flex items-center gap-2"
            >
                <span className="w-[6px] h-[6px] rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <span className="font-haas text-[11px] tracking-[0.25em] text-white uppercase" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
                    Agence Web · Lyon · Disponible
                </span>
            </motion.div>

            {/* Milieu — label + titre */}
            <div className="flex flex-col">

                {/* Label */}
                <div style={{ overflow: 'hidden' }}>
                    <p
                        className="font-haas text-white/50 leading-none tracking-[0.3em] uppercase"
                        style={{ fontSize: 'clamp(10px, 1.2vw, 12px)', textShadow: '0 1px 12px rgba(0,0,0,0.6)', marginBottom: '0.5rem' }}
                        aria-label="Agence Web Premium"
                    >
                        <CharReveal text="Agence Web Premium" ready={ready} baseDelay={0.38} stagger={0.018} duration={0.7} />
                    </p>
                </div>

                {/* H1 */}
                <h1 className="contents" aria-label="l'avenir digital. — Agence Web Lyon">
                    <div style={{ overflow: 'hidden', paddingBottom: '0.2em', marginBottom: '-0.1em' }}>
                        <span
                            className="font-nordique text-white italic leading-[0.9] tracking-[-0.03em] block"
                            style={{ fontSize: 'clamp(76px, 11vw, 168px)', textShadow: '0 2px 32px rgba(0,0,0,0.3)' }}
                        >
                            <CharReveal text="l'avenir" ready={ready} baseDelay={0.62} stagger={0.048} duration={1.15} />
                        </span>
                    </div>
                    <div style={{ overflow: 'hidden', paddingBottom: '0.2em' }}>
                        <span
                            className="font-nordique text-white leading-[0.9] tracking-[-0.03em] block"
                            style={{ fontSize: 'clamp(76px, 11vw, 168px)', textShadow: '0 2px 32px rgba(0,0,0,0.3)' }}
                        >
                            <CharReveal text="digital." ready={ready} baseDelay={0.95} stagger={0.048} duration={1.15} />
                        </span>
                    </div>
                </h1>
            </div>

            {/* Bas — desc + CTAs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={ready ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1.2, ease: EASE, delay: 1.5 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6"
            >
                <p className="font-haas text-[13px] lg:text-[14px] text-white/65 leading-[1.7] max-w-[280px] sm:max-w-[300px]" style={{ textShadow: '0 1px 10px rgba(0,0,0,0.5)' }}>
                    Design radical, développement de pointe.<br />
                    On ne fait pas du web — on bâtit des empires.
                </p>

                <div className="flex flex-col gap-3 sm:items-end">
                    <div className="flex items-center gap-3 flex-wrap">
                        <button
                            onMouseEnter={playHover}
                            onClick={() => { playClick(); onChatOpen(); }}
                            className="group relative overflow-hidden bg-white text-black pl-5 sm:pl-6 pr-2 py-[11px] rounded-full flex items-center gap-4 cursor-pointer pointer-events-auto"
                        >
                            <motion.div className="absolute inset-0 bg-black/8" initial={{ x: '-100%' }} whileHover={{ x: 0 }} transition={{ duration: 0.4, ease: EASE_SHARP }} />
                            <span className="relative font-haas text-[12px] tracking-[0.1em] lowercase font-semibold">démarrer un projet</span>
                            <div className="relative w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg>
                            </div>
                        </button>
                        <a
                            href="#work"
                            title="Voir nos projets réalisés"
                            onMouseEnter={playHover}
                            onClick={playClick}
                            className="group flex items-center gap-2 font-haas text-[12px] tracking-[0.1em] lowercase text-white/65 hover:text-white/90 transition-colors cursor-pointer pointer-events-auto"
                        >
                            nos projets
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </a>
                    </div>
                    <div className="flex items-center gap-2 opacity-30 mt-3 sm:mt-0">
                        <div className="w-5 h-[1px] bg-white overflow-hidden relative">
                            <div className="absolute inset-0 bg-white animate-scroll-bar" />
                        </div>
                        <span className="font-haas text-[9px] tracking-[0.25em] text-white uppercase">scroll</span>
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
    const text = 'agence web lyon · création site web · next.js · design ui/ux · lighthouse 95+ · développement sur-mesure · ';
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
                            {text.repeat(8)}
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
                                style={{ fontSize: 'clamp(38px, 9.5vw, 120px)', lineHeight: 0.88 }}
                            >
                                {link.label}
                            </motion.a>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="absolute bottom-8 left-0 w-full px-5 sm:px-8 flex items-center justify-between"
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
        <section className="relative w-full h-screen font-haas bg-[#07070F]">
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
