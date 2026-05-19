"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import {
    Menu, X, ArrowRight, Flame, Droplets,
    Star, MapPin, Clock, Phone, Mail, ChevronDown, Utensils, Shield
} from 'lucide-react';

// --- CONFIGURATION ---
const EASE_ELITE: [number, number, number, number] = [0.19, 1, 0.22, 1];

// --- ANIMATION TEXTE PAR CARACTÈRE ---
const CharReveal = ({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) => (
    <span className={`inline-flex flex-wrap ${className}`}>
        {text.split("").map((char, i) => (
            <span key={i} className="overflow-hidden inline-block">
                <motion.span
                    initial={{ y: "100%", rotate: 5 }}
                    whileInView={{ y: 0, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: EASE_ELITE, delay: delay + (i * 0.015) }}
                    className="inline-block origin-left"
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            </span>
        ))}
    </span>
);

export default function AetheraMaximized() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll();

    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
    const scaleVideo = useTransform(smoothProgress, [0, 0.2], [1, 1.1]);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div ref={containerRef} className="bg-white text-[#0A0A0A] antialiased selection:bg-black selection:text-white">

            {/* 1. NAVIGATION FIXE HAUTE COUTURE */}
            <nav className="fixed top-0 w-full z-[100] px-8 md:px-20 py-12 flex justify-between items-center mix-blend-difference pointer-events-none">
                <div className="font-serif text-4xl italic font-bold pointer-events-auto cursor-pointer">æ.</div>
                <div className="flex items-center gap-12 pointer-events-auto">
                    <div className="hidden lg:flex gap-10 text-[9px] font-black uppercase tracking-[0.4em] opacity-40">
                        <button className="hover:opacity-100 transition-opacity">Le Concept</button>
                        <button className="hover:opacity-100 transition-opacity">La Carte</button>
                        <button className="hover:opacity-100 transition-opacity">L'Atelier</button>
                    </div>
                    <button onClick={() => setMenuOpen(true)} className="flex items-center gap-4 group">
                        <span className="text-[9px] font-black uppercase tracking-[0.3em]">Menu</span>
                        <div className="p-4 bg-black/5 rounded-full group-hover:bg-black group-hover:text-white transition-all">
                            <Menu size={18} />
                        </div>
                    </button>
                </div>
            </nav>

            {/* 2. HERO : VIDEO SALADE (La Précision) */}
            <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
                <motion.div style={{ scale: scaleVideo }} className="absolute inset-0">
                    <video autoPlay muted playsInline loop className="w-full h-full object-cover brightness-[0.95] contrast-[1.02]">
                        <source src="https://cdn.pixabay.com/video/2017/08/29/11610-231571879_large.mp4" />
                    </video>
                </motion.div>

                <div className="relative z-10 text-center px-6">
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="block text-[10px] font-black uppercase tracking-[1em] mb-12 opacity-40">
                        Haute Gastronomie Parisienne
                    </motion.span>
                    <h1 className="text-[14vw] md:text-[11vw] font-serif leading-[0.75] tracking-[-0.06em]">
                        <CharReveal text="L'INSTINCT" delay={0.8} /><br />
                        <span className="italic font-light opacity-30">
                            <CharReveal text="SUR LE FEU" delay={1.2} />
                        </span>
                    </h1>
                </div>

                <div className="absolute bottom-12 flex flex-col items-center gap-4">
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-20">DÉCOUVRIR</span>
                    <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-[1px] h-12 bg-black/20" />
                </div>
            </section>

            {/* 3. SECTION 01 : LE GESTE (VIDEO VERTICALE VIANDE) */}
            <section className="py-60 px-10 md:px-20 max-w-[1600px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
                    <div className="lg:col-span-7 sticky top-40">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-black/30 mb-12 block">01 — LA MATIÈRE</span>
                        <h2 className="text-7xl md:text-[110px] font-serif leading-[0.85] tracking-tighter mb-20">
                            La découpe <br />
                            <span className="italic text-black/20">comme un art.</span>
                        </h2>
                        <p className="text-2xl font-serif italic text-black/50 leading-relaxed max-w-xl">
                            "Nous ne servons pas simplement de la nourriture. Nous servons un moment de tension entre le couteau et le produit, capturé dans sa forme la plus pure."
                        </p>
                        <div className="grid grid-cols-2 gap-10 mt-24">
                            <div className="space-y-4">
                                <div className="w-12 h-[1px] bg-black" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest">Sourcing Radical</h4>
                                <p className="text-sm opacity-40 leading-relaxed">Produits sourcés à moins de 150km de la capitale, livrés chaque matin à 5h.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="w-12 h-[1px] bg-black/20" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest">Maturation</h4>
                                <p className="text-sm opacity-40 leading-relaxed">Caves de vieillissement à hygrométrie contrôlée pour une tendreté absolue.</p>
                            </div>
                        </div>
                    </div>

                    {/* LA VIDEO VERTICALE ICI */}
                    <div className="lg:col-span-5">
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: EASE_ELITE }}
                            className="aspect-[9/16] rounded-[60px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)]"
                        >
                            <video autoPlay muted playsInline loop className="w-full h-full object-cover">
                                <source src="https://cdn.pixabay.com/video/2024/08/18/227128_large.mp4" />
                            </video>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 4. SECTION 02 : LE RÉSULTAT (VIDEO HORIZONTALE POULET) */}
            <section className="py-40 bg-zinc-50">
                <div className="px-6 md:px-20 max-w-[1800px] mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
                        <h2 className="text-6xl md:text-9xl font-serif italic tracking-tighter">L'aboutissement.</h2>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center opacity-20"><Star size={14} /></div>
                            <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center opacity-20"><Star size={14} /></div>
                            <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center opacity-20"><Star size={14} /></div>
                        </div>
                    </div>

                    {/* VIDEO HORIZONTALE POULET FRIS */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2 }}
                        className="relative h-[80vh] rounded-[80px] overflow-hidden group shadow-2xl"
                    >
                        <video autoPlay muted playsInline loop className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110">
                            <source src="https://cdn.pixabay.com/video/2024/08/18/227131_large.mp4" />
                        </video>
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                        <div className="absolute bottom-16 left-16 text-white mix-blend-difference">
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Signature No. 4</span>
                            <h3 className="text-5xl font-serif italic">Volaille de Bresse en croûte de cendre.</h3>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 5. SECTION 03 : LA CARTE (INTERACTIVE ET DENSE) */}
            <section className="py-60 px-10 md:px-20">
                <div className="max-w-[1200px] mx-auto">
                    <div className="text-center mb-40">
                        <h2 className="text-8xl md:text-[10vw] font-serif tracking-tighter mb-10">Menu Anthologie.</h2>
                        <p className="font-mono text-[10px] uppercase tracking-[0.5em] opacity-30">Cuisine de saison — Printemps 2026</p>
                    </div>

                    <div className="space-y-0">
                        {[
                            { name: "Asperges Blanches", desc: "Fumées au bois de cerisier, condiment amande.", price: "34" },
                            { name: "Cœur de Longe", desc: "Maturation 60 jours, jus corsé à la moelle.", price: "58" },
                            { name: "Saint-Jacques", desc: "Cuites sur galets brûlants, émulsion d'algues.", price: "46" },
                            { name: "Soufflé Cendre", desc: "Chocolat noir 75%, sel fumé, glace foin.", price: "24" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ x: 30 }}
                                className="group flex justify-between items-center py-16 border-b border-black/5 cursor-pointer"
                            >
                                <div className="flex gap-20 items-center">
                                    <span className="font-mono text-[10px] opacity-20">0{i+1}</span>
                                    <div>
                                        <h3 className="text-4xl md:text-6xl font-serif italic group-hover:text-black transition-colors">{item.name}</h3>
                                        <p className="text-sm opacity-40 mt-4 max-w-sm">{item.desc}</p>
                                    </div>
                                </div>
                                <span className="text-3xl font-serif opacity-20 group-hover:opacity-100 transition-opacity">{item.price}€</span>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-32 flex justify-center">
                        <button className="flex items-center gap-8 group">
                            <span className="text-[10px] font-black uppercase tracking-widest pb-2 border-b border-black">Télécharger la carte des vins</span>
                            <div className="w-16 h-16 rounded-full border border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                                <ArrowRight size={20} />
                            </div>
                        </button>
                    </div>
                </div>
            </section>

            {/* 6. SECTION 04 : INFOS ET CONCIERGERIE */}
            <section className="py-60 bg-black text-white rounded-t-[100px]">
                <div className="px-10 md:px-20 max-w-[1600px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-40 mb-60">
                        <div>
                            <h2 className="text-[12vw] font-serif italic text-white/5 leading-none mb-24">Conciergerie.</h2>
                            <div className="space-y-16">
                                <div className="space-y-6">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30 block">Réservations</span>
                                    <a href="mailto:concierge@aethera.paris" className="text-4xl md:text-6xl font-serif italic hover:text-white/50 transition-colors">concierge@aethera.paris</a>
                                </div>
                                <div className="space-y-6">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30 block">Privatisation</span>
                                    <a href="tel:+33142678900" className="text-4xl md:text-6xl font-serif italic hover:text-white/50 transition-colors">+33 1 42 67 89 00</a>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-20">
                            <div className="space-y-8">
                                <MapPin size={32} strokeWidth={1} className="opacity-30" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest">Localisation</h4>
                                <p className="text-2xl font-serif italic opacity-60">12 Rue du Champ de Mars<br />75007 Paris, France</p>
                            </div>
                            <div className="space-y-8">
                                <Clock size={32} strokeWidth={1} className="opacity-30" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest">Horaires</h4>
                                <p className="text-2xl font-serif italic opacity-60">Mardi au Samedi<br />19:00 — 23:30</p>
                            </div>
                            <div className="space-y-8">
                                <Shield size={32} strokeWidth={1} className="opacity-30" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest">Code Vestimentaire</h4>
                                <p className="text-2xl font-serif italic opacity-60">Tenue élégante requise</p>
                            </div>
                            <div className="space-y-8">
                                <Utensils size={32} strokeWidth={1} className="opacity-30" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest">Allergies</h4>
                                <p className="text-2xl font-serif italic opacity-60">À préciser lors de la<br />réservation</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center pt-20 border-t border-white/10 gap-10">
                        <span className="font-serif text-3xl italic">æthera.</span>
                        <div className="flex gap-16 text-[9px] font-black uppercase tracking-[0.4em] opacity-30">
                            <button className="hover:text-white transition-colors">Mentions Légales</button>
                            <button className="hover:text-white transition-colors">Politique de Cookies</button>
                            <button className="hover:text-white transition-colors">Presse</button>
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-20">© 2026 Designed in Paris</p>
                    </div>
                </div>
            </section>

            {/* 7. MENU OVERLAY PLEIN ÉCRAN */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ y: "-100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-100%" }}
                        transition={{ duration: 1, ease: EASE_ELITE }}
                        className="fixed inset-0 z-[1000] bg-white text-black p-12 md:p-24 flex flex-col justify-between"
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-serif text-4xl italic font-bold">æ.</span>
                            <button onClick={() => setMenuOpen(false)} className="w-20 h-20 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                                <X size={32} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-6">
                            {["L'Origine", "Le Menu", "L'Atelier", "Conciergerie", "Presse"].map((link, i) => (
                                <motion.button
                                    key={link}
                                    initial={{ x: -100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 + i * 0.1 }}
                                    className="text-7xl md:text-[10vw] font-serif italic text-left leading-none hover:pl-12 transition-all duration-700"
                                >
                                    {link}.
                                </motion.button>
                            ))}
                        </div>

                        <div className="flex justify-between items-end border-t border-black/5 pt-12">
                            <div className="space-y-4">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Suivez-nous</span>
                                <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest">
                                    <button className="hover:line-through">Journal</button>
                                    <button className="hover:line-through">Lettre</button>
                                </div>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Paris VII — 2026</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}