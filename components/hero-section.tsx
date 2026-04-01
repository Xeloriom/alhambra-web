"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

const LOGOS = ["Next.js", "React Native", "Tailwind", "TypeScript", "Node.js", "PostgreSQL", "Figma", "Vercel", "AWS", "Docker"];

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { 
        duration: 0.9, 
        delay, 
        ease: [0.16, 1, 0.3, 1] as any // Fix for TS type mismatch
    }
});

interface HeroSectionProps {
    data?: any;
    onUpdate?: (path: string, value: any) => void;
    isEditing?: boolean;
}

export function HeroSection({ data, onUpdate, isEditing }: HeroSectionProps) {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 60]);
    const y3 = useTransform(scrollYProgress, [0, 1], [0, -40]);

    return (
        <section
            ref={ref}
            className="relative min-h-screen mesh-bg pt-36 pb-0 overflow-hidden gpu"
        >
            <div className="max-w-[1400px] mx-auto px-8">

                <motion.div {...fadeUp(0)} className="flex justify-center mb-10">
                    <div className="tag">
                        <span>🚀</span>
                        <span>Agence Tech</span>
                        <span>💻</span>
                    </div>
                </motion.div>

                <motion.h1
                    {...fadeUp(0.08)}
                    className="text-center text-[clamp(3rem,8vw,8.5rem)] leading-[0.93] tracking-[-0.03em] text-[#0A0A0A] mb-10 gpu"
                >
                    Excellence Digitale.<br />
                    <span className="italic text-[#9A9A9A]">Solutions SaaS & Mobile.</span>
                </motion.h1>

                <motion.p
                    {...fadeUp(0.18)}
                    className="text-center text-[16px] text-[#9A9A9A] max-w-[500px] mx-auto leading-relaxed mb-10"
                >
                    Équipe diplômée. Développement live. Transparence totale. 
                    Nous bâtissons le futur de votre produit.
                </motion.p>

                <motion.div {...fadeUp(0.25)} className="flex flex-col items-center gap-3 mb-16">
                    <Link href="#contact" className="btn-pill text-[13px] px-10 py-5 shadow-xl shadow-black/10">
                        Lancer mon projet <span className="text-[15px]">→</span>
                    </Link>
                    <span className="text-[11px] text-[#9A9A9A] font-medium tracking-tight">
            ✦ Suivi temps réel & Accès direct.
          </span>
                </motion.div>

                <motion.div
                    {...fadeUp(0.3)}
                    className="border-y border-[#EBEBEB] py-5 overflow-hidden mb-12"
                >
                    <div className="animate-marquee">
                        {[...LOGOS, ...LOGOS].map((logo, i) => (
                            <span
                                key={i}
                                className="text-[13px] font-medium text-[#BBBBBB] hover:text-[#888] transition-colors mx-10 tracking-wide cursor-default whitespace-nowrap gpu"
                            >
                ✦ {logo}
              </span>
                        ))}
                    </div>
                </motion.div>

                <div className="relative h-[480px] overflow-visible gpu">
                    <motion.div
                        style={{ y: y1 }}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] as any }}
                        className="absolute left-[2%] bottom-0 w-[220px] gpu"
                    >
                        <div className="img-card aspect-[3/4] rounded-[22px] overflow-hidden shadow-2xl border-4 border-white">
                            <img
                                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80"
                                alt="Code"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        style={{ y: y3 }}
                        initial={{ opacity: 0, x: -30, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 1, delay: 0.55, ease: [0.16, 1, 0.3, 1] as any }}
                        className="floating-card absolute left-[14%] bottom-[80px] w-[260px] z-20 gpu"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            {[1,2,3,4].map((n, idx) => (
                                <div key={n} className={`h-1.5 flex-1 rounded-full transition-all ${idx === 2 ? 'bg-black' : idx < 2 ? 'bg-[#C8DBC9]' : 'bg-[#EBEBEB]'}`} />
                            ))}
                            <span className="text-[11px] text-[#9A9A9A] ml-1 font-medium">Live →</span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                            {["https://i.pravatar.cc/32?img=11","https://i.pravatar.cc/32?img=12","https://i.pravatar.cc/32?img=13"].map((src, i) => (
                                <img key={i} src={src} className="w-7 h-7 rounded-full border-2 border-white -ml-2 first:ml-0 shadow" alt="" />
                            ))}
                        </div>
                        <p className="text-[11px] text-[#9A9A9A] mb-1">En cours de déploiement</p>
                        <h3 className="text-[17px] font-medium leading-tight tracking-tight text-[#0A0A0A]">
                            Livraison accélérée.<br />Suivi transparent 🚀
                        </h3>
                    </motion.div>

                    <motion.div
                        style={{ y: y2 }}
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.1, delay: 0.42, ease: [0.16, 1, 0.3, 1] as any }}
                        className="absolute left-[27%] bottom-0 w-[270px] gpu"
                    >
                        <div className="img-card aspect-[4/5] rounded-[22px] overflow-hidden shadow-2xl border-4 border-white">
                            <img
                                src="https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&w=600&q=80"
                                alt="Design"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        style={{ y: y1 }}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.1, delay: 0.48, ease: [0.16, 1, 0.3, 1] as any }}
                        className="absolute left-[46%] bottom-0 w-[310px] gpu"
                    >
                        <div className="img-card aspect-[4/5] rounded-[22px] overflow-hidden shadow-2xl border-4 border-white">
                            <img
                                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=700&q=80"
                                alt="Mobile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        style={{ y: y2 }}
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.1, delay: 0.55, ease: [0.16, 1, 0.3, 1] as any }}
                        className="absolute right-[2%] bottom-0 w-[240px] gpu"
                    >
                        <div className="img-card aspect-[3/4] rounded-[22px] overflow-hidden shadow-2xl border-4 border-white">
                            <img
                                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"
                                alt="SaaS"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
