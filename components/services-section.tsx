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

export function ServicesSection() {
  return (
    <section id="services" className="bg-[#f5f5f7] py-32 border-b border-[#d2d2d7]">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="mb-20">
          <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#86868b] block mb-4">
            Services
          </span>
          <h2 className="text-[clamp(36px,5vw,64px)] font-bold text-[#1d1d1f] leading-tight mb-6">
            Expertises
          </h2>
          <p className="text-[17px] text-[#6e6e73] max-w-[560px] leading-relaxed">
            Nous combinons design d&apos;exception et ingénierie de pointe pour propulser votre business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#d2d2d7] border border-[#d2d2d7] rounded-[18px] overflow-hidden">
          {SERVICES.map((service, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="bg-white p-10 md:p-12 flex flex-col gap-6 hover:shadow-lg transition-all hover:z-10 relative group"
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-[#f5f5f7] rounded-[10px] flex items-center justify-center text-[#1d1d1f] group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <span className="text-[12px] font-mono text-[#86868b] font-medium tracking-[0.06em]">
                  {service.id}
                </span>
              </div>
              
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-semibold text-[#1d1d1f]">{service.title}</h3>
                <p className="text-[15px] text-[#6e6e73] leading-relaxed max-w-[400px]">
                  {service.description}
                </p>
              </div>

              <div className="mt-auto flex flex-wrap gap-2">
                {service.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-[#f5f5f7] border border-[#e8e8ed] text-[11px] font-medium text-[#6e6e73] rounded-full uppercase tracking-wider">
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
