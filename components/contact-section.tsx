"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ContactSection() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <section id="contact" className="bg-white py-32 border-b border-[#d2d2d7]">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="mb-20">
          <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#86868b] block mb-4">
            Appel Gratuit & Devis
          </span>
          <h2 className="text-[clamp(36px,5vw,64px)] font-bold text-[#1d1d1f] leading-[1.1] mb-6">
            Parlons de<br />Votre Projet
          </h2>
          <p className="text-[17px] text-[#6e6e73] max-w-[560px] leading-relaxed">
            Réservez un créneau ou envoyez-nous un message. On vous répond avec une stratégie concrète sous 24h.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-16">
          {/* Info Column */}
          <div className="flex flex-col gap-10">
            <div>
              <span className="text-[12px] font-medium uppercase tracking-[0.06em] text-[#86868b] block mb-2">Email</span>
              <a href="mailto:hello@alhambra-web.com" className="text-[17px] font-semibold text-[#1d1d1f] hover:underline">
                hello@alhambra-web.com
              </a>
            </div>
            <div>
              <span className="text-[12px] font-medium uppercase tracking-[0.06em] text-[#86868b] block mb-2">Bureau</span>
              <span className="text-[17px] font-semibold text-[#1d1d1f]">Paris, France — Remote</span>
            </div>
            <div className="mt-auto">
              <span className="text-[13px] font-mono text-[#86868b]">alhambra-web.com</span>
            </div>
          </div>

          {/* Form Column */}
          <div id="form-container">
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 bg-[#f5f5f7] rounded-[24px] border border-[#d2d2d7]"
                >
                  <div className="text-4xl mb-6">🎉</div>
                  <h3 className="text-xl font-bold text-[#1d1d1f] mb-2">Message envoyé !</h3>
                  <p className="text-[#6e6e73]">Merci ! On revient vers vous sous 24h avec une stratégie concrète.</p>
                </motion.div>
              ) : (
                <motion.form 
                  onSubmit={handleSubmit}
                  className="space-y-4"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative group">
                      <input type="text" name="name" required className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-[10px] px-4 pt-6 pb-2 focus:bg-white focus:border-[#1d1d1f] outline-none text-[15px] text-[#1d1d1f] transition-all" />
                      <label className="absolute left-4 top-4 text-[13px] text-[#86868b] pointer-events-none transition-all peer-placeholder-shown:text-[15px] group-focus-within:top-1.5 group-focus-within:text-[11px] group-focus-within:text-[#86868b]">Votre Nom</label>
                    </div>
                    <div className="relative group">
                      <input type="email" name="email" required className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-[10px] px-4 pt-6 pb-2 focus:bg-white focus:border-[#1d1d1f] outline-none text-[15px] text-[#1d1d1f] transition-all" />
                      <label className="absolute left-4 top-4 text-[13px] text-[#86868b] pointer-events-none transition-all group-focus-within:top-1.5 group-focus-within:text-[11px]">Email</label>
                    </div>
                  </div>
                  <div className="relative group">
                    <input type="tel" name="phone" className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-[10px] px-4 pt-6 pb-2 focus:bg-white focus:border-[#1d1d1f] outline-none text-[15px] text-[#1d1d1f] transition-all" />
                    <label className="absolute left-4 top-4 text-[13px] text-[#86868b] pointer-events-none transition-all group-focus-within:top-1.5 group-focus-within:text-[11px]">Téléphone</label>
                  </div>
                  <div className="relative group">
                    <textarea name="project" rows={4} className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-[10px] px-4 pt-6 pb-2 focus:bg-white focus:border-[#1d1d1f] outline-none text-[15px] text-[#1d1d1f] transition-all resize-none"></textarea>
                    <label className="absolute left-4 top-4 text-[13px] text-[#86868b] pointer-events-none transition-all group-focus-within:top-1.5 group-focus-within:text-[11px]">Votre Projet</label>
                  </div>
                  <button type="submit" className="w-full py-5 bg-[#1d1d1f] text-white rounded-[12px] font-bold text-[15px] tracking-wide transition-all hover:bg-[#333333] active:scale-[0.98]">
                    Demander un Appel Gratuit
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
