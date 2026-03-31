"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export function ContactSection() {
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("loading");
    setTimeout(() => setFormStatus("success"), 1500);
  };

  return (
    <section id="contact" className="relative py-48 md:py-64 bg-[#f5f5f7] px-6">
      <div className="max-w-[1120px] mx-auto text-center mb-32">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#6e6e73] mb-8 block"
        >
          CONTACT —
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-[clamp(48px,5vw,80px)] font-bold text-[#1d1d1f] tracking-tight mb-12"
        >
          Prêt à nous parler ?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-xl text-[#6e6e73] leading-relaxed max-w-[700px] mx-auto"
        >
          Dites-nous tout sur votre projet et voyons comment nous pouvons collaborer.
        </motion.p>
      </div>

      <div className="max-w-[700px] mx-auto bg-white p-12 md:p-24 rounded-[18px] border border-[#d2d2d7] shadow-xl shadow-black/5">
        {formStatus === 'success' ? (
           <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-12"
           >
              <div className="w-20 h-20 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center mb-8">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-[#1d1d1f] mb-4">Message envoyé !</h3>
              <p className="text-[#6e6e73]">Nous reviendrons vers vous sous 24h.</p>
              <button onClick={() => setFormStatus('idle')} className="mt-12 text-[#1d1d1f] font-semibold hover:opacity-70 transition-opacity">Envoyer un autre message</button>
           </motion.div>
        ) : (
           <form onSubmit={handleSubmit} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="flex flex-col gap-4">
                  <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-[#6e6e73]">Nom Complet</label>
                  <input 
                    type="text" required
                    className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-[10px] px-6 py-4 text-[#1d1d1f] font-medium focus:border-[#1d1d1f] focus:ring-1 focus:ring-[#1d1d1f] outline-none transition-all"
                    id="name"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-[#6e6e73]">Email Professionnel</label>
                  <input 
                    type="email" required
                    className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-[10px] px-6 py-4 text-[#1d1d1f] font-medium focus:border-[#1d1d1f] focus:ring-1 focus:ring-[#1d1d1f] outline-none transition-all"
                    id="email"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                  <label htmlFor="project" className="text-xs font-bold uppercase tracking-widest text-[#6e6e73]">Votre Projet</label>
                  <textarea 
                    rows={5} required
                    className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-[10px] px-6 py-4 text-[#1d1d1f] font-medium focus:border-[#1d1d1f] focus:ring-1 focus:ring-[#1d1d1f] outline-none transition-all resize-none"
                    id="project"
                  />
              </div>

              <button 
                disabled={formStatus === 'loading'}
                className="w-full bg-[#1d1d1f] text-white rounded-full py-5 font-bold tracking-widest uppercase text-sm hover:opacity-90 active:scale-95 transition-all shadow-lg"
              >
                {formStatus === 'loading' ? 'ENVOI EN COURS...' : 'Démarrer un projet'}
              </button>
           </form>
        )}
      </div>
    </section>
  );
}
