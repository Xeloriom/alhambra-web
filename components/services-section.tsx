"use client";

import { motion } from "framer-motion";

const SERVICES = [
  {
    id: "01",
    title: "Web Design & Dev",
    description: "Sites Next.js ultra-rapides et optimisés pour la conversion et le SEO.",
    tags: ["Next.js", "Performance", "SEO"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="18" rx="2" ry="2"></rect><line x1="2" y1="8" x2="22" y2="8"></line><circle cx="5" cy="5.5" r="0.5" fill="currentColor"></circle><circle cx="7.5" cy="5.5" r="0.5" fill="currentColor"></circle><circle cx="10" cy="5.5" r="0.5" fill="currentColor"></circle></svg>
    )
  },
  {
    id: "02",
    title: "Apps Mobiles",
    description: "Applications iOS & Android natives et hybrides performantes.",
    tags: ["iOS", "Android", "React Native"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
    )
  },
  {
    id: "03",
    title: "SaaS & Logiciels",
    description: "Systèmes complexes et évolutifs pour entreprises exigeantes.",
    tags: ["Cloud", "API", "Database"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
    )
  },
  {
    id: "04",
    title: "Design UI/UX",
    description: "Interfaces intuitives centrées sur l'utilisateur et l'émotion.",
    tags: ["Figma", "Prototyping", "Research"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.5 1.5"></path><path d="M7.6 7.6L2 2"></path></svg>
    )
  }
];

export function ServicesSection({ data, onUpdate, isEditing }: { data?: any, onUpdate?: (path: string, value: any) => void, isEditing?: boolean }) {
  return (
    <section id="services" className="bg-[#0f0f0f] py-32 border-b border-white/10">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="mb-20">
          <span className="text-[12px] font-mono uppercase tracking-[0.2em] text-[#C9A84C] block mb-4">
            Services
          </span>
          <h2 className="text-[clamp(36px,5vw,64px)] font-bold text-white leading-[0.9] tracking-[-0.04em] mb-6">
            Expertises
          </h2>
          <p className="text-[17px] text-[#888888] max-w-[560px] leading-relaxed">
            Nous combinons design d&apos;exception et ingénierie de pointe pour propulser votre business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES.map((service, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              data-cursor="hover"
              className="bg-[#111111] p-10 md:p-12 flex flex-col gap-6 border border-white/10 rounded-[24px] hover:border-[#C9A84C]/40 hover:shadow-[0_0_40px_rgba(201,168,76,0.08)] transition-all duration-500 relative group"
            >
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 bg-white/5 rounded-[12px] flex items-center justify-center text-[#C9A84C] group-hover:scale-110 transition-transform duration-500">
                  {service.icon}
                </div>
                <span className="text-[14px] font-mono text-[#C9A84C]/20 font-black tracking-widest">
                  {service.id}
                </span>
              </div>
              
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-bold text-white tracking-tight">{service.title}</h3>
                <p className="text-[15px] text-[#888888] leading-relaxed max-w-[400px]">
                  {service.description}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {service.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-bold text-[#888888] rounded-full uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
