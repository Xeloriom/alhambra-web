"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function Manifeste() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const x2 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y1 = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  const words = "Nous créons des solutions Web, Mobile & SaaS. Équipe diplômée, suivi transparent et développement en direct.".split(" ");

  return (
      <section ref={ref} className="bg-white py-36 px-8 overflow-hidden relative gpu">
        <div className="max-w-[1300px] mx-auto relative">

          {/* ── FLOATING IMAGE – top right ── */}
          <motion.div
              style={{ x: x1, y: y1 }}
              className="absolute -top-10 right-0 w-[180px] z-20 gpu hidden lg:block"
          >
            <div className="img-card aspect-square rounded-[20px] overflow-hidden shadow-2xl border-4 border-white">
              <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80"
                  alt="Équipe au travail"
                  className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* ── FLOATING IMAGE – bottom left ── */}
          <motion.div
              style={{ x: x2, y: y2 }}
              className="absolute bottom-10 left-0 w-[200px] z-20 gpu hidden lg:block"
          >
            <div className="img-card aspect-[4/3] rounded-[20px] overflow-hidden shadow-2xl border-4 border-white">
              <img
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80"
                  alt="Développement SaaS"
                  className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* ── LABEL ── */}
          <motion.span
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="label block text-center mb-12"
          >
            Notre Vision
          </motion.span>

          {/* ── ANIMATED HEADLINE ── */}
          <h2
              className="text-center text-[clamp(2rem,5vw,5.5rem)] leading-[1.1] tracking-[-0.03em] text-[#0A0A0A] mb-16"
          >
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0.08 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.4, delay: i * 0.015 }}
                    className={`inline-block mr-[0.22em] gpu ${
                        word === "transparent" || word === "direct." ? "italic text-[#9A9A9A]" : ""
                    }`}
                >
                  {word}
                </motion.span>
            ))}
          </h2>

          {/* ── DIVIDER ── */}
          <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="h-[1px] bg-[#EBEBEB] origin-left gpu"
          />

          {/* ── BOTTOM: LINKS + TAGLINE ── */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mt-12">
            <div className="flex items-center gap-8">
              {["À propos →", "Expertise →", "Contactez-nous →"].map((lnk) => (
                  <a
                      key={lnk}
                      href="#"
                      className="text-[14px] font-medium text-[#0A0A0A] hover:text-[#9A9A9A] transition-colors"
                  >
                    {lnk}
                  </a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              {["Twitter", "LinkedIn", "Instagram"].map((s) => (
                  <a
                      key={s}
                      href="#"
                      className="px-4 py-2 rounded-full border border-[#EBEBEB] flex items-center justify-center text-[13px] text-[#9A9A9A] hover:border-black hover:text-black transition-all duration-300"
                  >
                    {s}
                  </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── BIG WATERMARK TEXT ── */}
        <div className="overflow-hidden mt-10">
          <motion.h2
              style={{ x: x1 }}
              className="text-[clamp(5rem,16vw,18rem)] font-semibold tracking-tighter leading-none text-[#F0F0F0] select-none pointer-events-none gpu whitespace-nowrap"
          >
            ALHAMBRA
          </motion.h2>
        </div>
      </section>
  );
}
