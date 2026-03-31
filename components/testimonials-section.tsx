"use client";

import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    text: "Une équipe incroyable. Le résultat a dépassé toutes nos attentes en termes de performance.",
    name: "Julien Robert",
    role: "CEO @ TechFlow",
    initials: "JR"
  },
  {
    text: "Leur approche du design est unique. Notre conversion a augmenté de 40% après la refonte.",
    name: "Sarah Chen",
    role: "Founder @ Lumi",
    initials: "SC"
  }
];

export function TestimonialsSection({ data, onUpdate, isEditing }: { data?: any, onUpdate?: (path: string, value: any) => void, isEditing?: boolean }) {
  return (
    <section id="testimonials" className="bg-[#f5f5f7] py-32 border-b border-[#d2d2d7]">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="mb-20">
          <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#86868b] block mb-4">
            Avis Clients
          </span>
          <h2 className="text-[clamp(32px,4vw,56px)] font-bold text-[#1d1d1f] tracking-tight mb-6">
            Ils Nous Font Confiance
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="bg-white p-12 rounded-[24px] border border-[#d2d2d7] shadow-sm flex flex-col gap-10 hover:shadow-md transition-shadow group"
            >
              <div>
                <span className="text-[80px] font-serif font-black text-[#e8e8ed] leading-[1] block -mb-4 opacity-50 select-none">“</span>
                <p className="text-[17px] text-[#1d1d1f] italic leading-relaxed relative z-10">
                  {t.text}
                </p>
              </div>

              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center border border-[#e8e8ed]">
                  <span className="text-[14px] font-semibold text-[#6e6e73]">{t.initials}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-bold text-[#1d1d1f]">{t.name}</span>
                  <span className="text-[13px] text-[#86868b]">{t.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
