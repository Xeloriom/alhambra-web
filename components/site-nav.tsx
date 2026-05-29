'use client';

import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSatisfyingSounds } from '@/hooks/use-satisfying-sounds';
import { useContactPanel } from '@/components/contact-panel-context';

const EASE: [number, number, number, number]       = [0.16, 1, 0.3, 1];
const EASE_SHARP: [number, number, number, number] = [0.76, 0, 0.24, 1];

const NAV_LINKS = [
    { label: 'projets',  href: '/#work'     },
    { label: 'agence',   href: '/#about'    },
    { label: 'services', href: '/#services' },
    { label: 'contact',  href: '/#contact'  },
];

// ── Menu overlay ─────────────────────────────────────────────────────────────
const MenuOverlay = memo(function MenuOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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

// ── SiteNav — même design que HeroNav, pour les pages secondaires ─────────────
export function SiteNav() {
    const [menuOpen,   setMenuOpen]   = useState(false);
    const [pastHero,   setPastHero]   = useState(false);
    const [navVisible, setNavVisible] = useState(true);
    const lastScrollY                 = useRef(0);
    const { openPanel }               = useContactPanel();
    const { playClick, playHover }    = useSatisfyingSounds();

    useEffect(() => {
        let rafId = 0;
        const onScroll = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const y    = window.scrollY;
                const vh   = window.innerHeight;
                const past = y > vh * 0.85;

                if (past) {
                    if (y > lastScrollY.current + 3)      setNavVisible(false);
                    else if (y < lastScrollY.current - 3) setNavVisible(true);
                } else {
                    setNavVisible(true);
                }
                lastScrollY.current = y;
                setPastHero(past);
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(rafId); };
    }, []);

    // Dark hero → white pills / white content → black pills
    const onDarkBg = !pastHero;
    const pill    = onDarkBg ? 'bg-white hover:bg-white/90'  : 'bg-black hover:bg-black/80';
    const txt     = onDarkBg ? 'text-black'                   : 'text-white';
    const dot     = onDarkBg ? 'bg-black'                     : 'bg-white';
    const dotWrap = onDarkBg ? 'bg-black/10'                  : 'bg-white/10';
    const iconFg  = onDarkBg ? 'black'                        : 'white';
    const iconBg  = onDarkBg ? 'bg-black'                     : 'bg-white';
    const logoCol = onDarkBg ? '#fff'                         : '#000';

    return (
        <>
            <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: navVisible ? 0 : -80, opacity: navVisible ? 1 : 0 }}
                transition={{ duration: navVisible ? 0.55 : 0.3, ease: navVisible ? EASE : EASE_SHARP }}
                className="fixed top-0 left-0 w-full px-6 sm:px-10 lg:px-12 py-5 sm:py-6 flex justify-between items-center z-[100]"
            >
                {/* Logo → retour accueil */}
                <a
                    href="/"
                    className="font-nordique tracking-tighter leading-none lowercase cursor-pointer transition-colors duration-500"
                    style={{ fontSize: 'clamp(16px, 1.8vw, 28px)', color: logoCol }}
                >
                    alhambra web
                </a>

                <div className="flex items-center gap-2 sm:gap-3">
                    {/* CTA desktop */}
                    <motion.button
                        onMouseEnter={playHover}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => { playClick(); openPanel(); }}
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
                        onClick={() => { playClick(); openPanel(); }}
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
                        onClick={() => { playClick(); setMenuOpen(v => !v); }}
                        className={`flex items-center pl-5 lg:pl-6 pr-2 py-2 rounded-full cursor-pointer h-[42px] sm:h-[44px] transition-all duration-500 ${pill}`}
                    >
                        <span className={`font-haas text-[11px] lg:text-[12px] tracking-[0.08em] font-semibold mr-5 lg:mr-7 lowercase ${txt}`}>
                            {menuOpen ? 'fermer' : 'menu'}
                        </span>
                        <div className={`flex gap-[5px] w-[38px] h-[30px] rounded-full items-center justify-center ${dotWrap}`}>
                            <motion.div animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 1 : 0 }}   transition={{ duration: 0.3, ease: EASE_SHARP }} className={`w-[5px] h-[5px] rounded-full ${dot}`} />
                            <motion.div animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -1 : 0 }} transition={{ duration: 0.3, ease: EASE_SHARP }} className={`w-[5px] h-[5px] rounded-full ${dot}`} />
                        </div>
                    </button>
                </div>
            </motion.nav>
        </>
    );
}
