"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-[#0A0A0A] text-white pt-24 pb-12 px-8 relative overflow-hidden gpu">
            <div className="max-w-[1400px] mx-auto relative z-10">

                {/* ── TOP ── */}
                <div className="flex flex-col md:flex-row justify-between gap-16 pb-16 border-b border-white/5">
                    <div className="max-w-xs">
                        <div className="flex items-center gap-2 mb-6">
              <span className="text-[20px] font-semibold tracking-tight" style={{ fontFamily: "var(--font-sans)" }}>
                Alhambra
              </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C8DBC9]" />
                        </div>
                        <p className="text-[14px] text-[#555] leading-relaxed">
                            We design and develop world-class digital products for brands that demand the best.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-16">
                        {[
                            { title: "Platform", links: ["Works", "Services", "About", "Contact"] },
                            { title: "Connect", links: ["LinkedIn", "Twitter", "Instagram", "Behance"] },
                            { title: "Legal", links: ["Privacy Policy", "Terms", "Cookies"] }
                        ].map((col) => (
                            <div key={col.title}>
                                <h4 className="label !text-[#333] mb-6">{col.title}</h4>
                                <ul className="space-y-3">
                                    {col.links.map((item) => (
                                        <li key={item}>
                                            <Link
                                                href="#"
                                                className="text-[14px] text-[#555] hover:text-white transition-colors duration-300"
                                            >
                                                {item}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── BOTTOM ── */}
                <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-6">
                    <span className="label !text-[#333]">© {year} Alhambra Web Agency — Digital Excellence Guaranteed.</span>

                    <div className="flex gap-3">
                        {["T", "I", "D", "B"].map((icon) => (
                            <a
                                key={icon}
                                href="#"
                                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[12px] text-[#555] hover:text-white hover:border-white/30 transition-all"
                            >
                                {icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* ── BIG WATERMARK ── */}
                <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-[clamp(4rem,12vw,14rem)] font-semibold tracking-tighter leading-none text-white/[0.03] select-none pointer-events-none mt-8 gpu"
                    style={{ fontFamily: "var(--font-serif)" }}
                >
                    ALHAMBRA
                </motion.h2>
            </div>

            {/* Ambient glow */}
            <div className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] bg-[#C8DBC9]/5 rounded-full blur-[200px] pointer-events-none gpu" />
        </footer>
    );
}