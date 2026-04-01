"use client";
import { motion } from "framer-motion";

const SERVICES = [
  {
    id: "01",
    title: "SaaS & Web App",
    desc: "Architecture robuste et performante pour vos applications métiers.",
    tag: "Ingénierie"
  },
  {
    id: "02",
    title: "Applications Mobile",
    desc: "Expériences natives iOS & Android avec React Native.",
    tag: "Mobile"
  },
  {
    id: "03",
    title: "UI/UX Design",
    desc: "Interfaces modernes et parcours utilisateurs optimisés.",
    tag: "Design"
  },
  {
    id: "04",
    title: "Suivi Live",
    desc: "Accès en temps réel à l'avancement et aux modifications.",
    tag: "Transparence"
  }
];

interface ServicesSectionProps {
    data?: any;
    onUpdate?: (path: string, value: any) => void;
    isEditing?: boolean;
}

export function ServicesSection({ data, onUpdate, isEditing }: ServicesSectionProps) {
  return (
      <section id="services" className="bg-white py-36 px-8 overflow-hidden gpu">
        <div className="max-w-[1400px] mx-auto">

          {/* ── HEADER ── */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
            <div>
              <motion.span
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="label mb-5 block"
              >
                Notre Expertise
              </motion.span>
              <motion.h2
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as any }}
                  className="text-[clamp(2.5rem,5.5vw,5.5rem)] leading-[0.93] tracking-[-0.03em] gpu"
              >
                Penser. Créer.<br />
                <span className="italic text-[#9A9A9A]">Innover.</span>
              </motion.h2>
            </div>

            <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-[16px] text-[#9A9A9A] max-w-[300px] leading-relaxed md:text-right"
            >
              Équipe d'experts pour vos projets les plus audacieux.
            </motion.p>
          </div>

          {/* ── SERVICES GRID ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-[#EBEBEB] rounded-[28px] overflow-hidden">
            {SERVICES.map((s, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }}
                    className={`group p-10 flex flex-col gap-8 hover:bg-[#F5F5F5] transition-all duration-500 gpu ${
                        i < 3 ? "border-r border-[#EBEBEB]" : ""
                    }`}
                >
                  <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#C8DBC9] tracking-widest uppercase">
                  {s.id}
                </span>
                    <span className="tag text-[10px]">{s.tag}</span>
                  </div>

                  <div className="flex-1 flex flex-col gap-4">
                    <h3 className="text-[20px] font-medium tracking-tight leading-tight text-[#0A0A0A]">
                      {s.title}
                    </h3>
                    <p className="text-[14px] text-[#9A9A9A] leading-relaxed">{s.desc}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="w-8 h-[1.5px] bg-[#EBEBEB] group-hover:w-full transition-all duration-700 ease-out gpu" />
                    <span className="text-[18px] opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">→</span>
                  </div>
                </motion.div>
            ))}
          </div>

          <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-20 pt-16 border-t border-[#EBEBEB]"
          >
            {[
              { value: "50+", label: "Projets livrés" },
              { value: "Diplômés", label: "Experts Master IT" },
              { value: "100%", label: "Transparence" },
              { value: "Direct", label: "Suivi Temps Réel" }
            ].map((stat, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <span className="stat-value text-[#0A0A0A]">{stat.value}</span>
                  <span className="text-[13px] text-[#9A9A9A]">{stat.label}</span>
                </div>
            ))}
          </motion.div>
        </div>
      </section>
  );
}
