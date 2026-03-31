"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

export function ContactSection() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("loading");
    setTimeout(() => setFormStatus("success"), 2000);
  };

  return (
    <section id="contact" ref={containerRef} className="relative py-32 md:py-64 bg-[#080808] px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-32">
          
          {/* Left Column - Content */}
          <div className="flex flex-col justify-between">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1 }}
            >
              <span className="text-[10px] font-mono tracking-[0.5em] text-[#C9A84C] uppercase mb-8 block">
                PRÊT À TRANSFORMER VOTRE VISION ? —
              </span>
              <h2 className="text-7xl md:text-[10rem] font-display font-black leading-[0.85] italic uppercase tracking-tighter text-white mb-16">
                DISCUTONS <br />
                <span className="text-[#C9A84C]">DU PROJET</span>
              </h2>
              
              <div className="space-y-12">
                <div className="flex items-center gap-8 group">
                  <div className="w-16 h-16 border border-white/5 rounded-full flex items-center justify-center text-[#C9A84C] group-hover:bg-[#C9A84C] group-hover:text-black transition-all duration-500">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                      <path d="M22 7l-10 7L2 7"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-1 block">Email</span>
                    <a href="mailto:hello@alhambra-web.com" className="text-xl md:text-2xl font-display font-bold text-white hover:text-[#C9A84C] transition-colors">hello@alhambra-web.com</a>
                  </div>
                </div>
                
                <div className="flex items-center gap-8 group">
                   <div className="w-16 h-16 border border-white/5 rounded-full flex items-center justify-center text-[#C9A84C] group-hover:bg-[#C9A84C] group-hover:text-black transition-all duration-500">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-1 block">Location</span>
                    <span className="text-xl md:text-2xl font-display font-bold text-white">Paris, France — Remote Worldwide</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Minimal Social Links */}
            <div className="mt-24 flex items-center gap-12 pt-12 border-t border-white/5">
              {['Twitter', 'LinkedIn', 'Instagram', 'Dribbble'].map((social) => (
                <a key={social} href="#" className="text-[10px] font-mono tracking-[0.3em] text-white/20 hover:text-[#C9A84C] uppercase transition-colors">{social}</a>
              ))}
            </div>
          </div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="bg-[#0f0f0f] border border-white/5 p-12 md:p-20 relative overflow-hidden"
          >
             {/* Form background decorative */}
             <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#C9A84C]/5 blur-[120px] pointer-events-none rounded-full" />
             
             {formStatus === 'success' ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                   <div className="w-24 h-24 border border-[#C9A84C] rounded-full flex items-center justify-center text-[#C9A84C] mb-8">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                         <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                   </div>
                   <h3 className="text-4xl font-display italic font-black text-white uppercase mb-4">Message Envoyé !</h3>
                   <p className="text-white/40 max-w-xs">Merci pour votre confiance. Nous reviendrons vers vous sous 24h.</p>
                   <button onClick={() => setFormStatus('idle')} className="mt-12 text-[10px] font-mono text-[#C9A84C] uppercase tracking-[0.4em] underline decoration-1 underline-offset-8">Envoyer un autre</button>
                </div>
             ) : (
                <form onSubmit={handleSubmit} className="relative z-10 space-y-12">
                   <div className="relative group">
                      <input 
                        type="text" required
                        className="w-full bg-transparent border-b border-white/10 py-6 text-xl font-display font-bold text-white focus:outline-none focus:border-[#C9A84C] peer placeholder-transparent"
                        placeholder="Nom Complet"
                        id="name"
                      />
                      <label 
                        htmlFor="name" 
                        className="absolute left-0 top-6 text-sm font-mono tracking-widest text-white/30 uppercase pointer-events-none transition-all duration-300 peer-focus:-top-4 peer-focus:text-[#C9A84C] peer-focus:text-[10px] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px]"
                      >
                        Nom Complet
                      </label>
                   </div>

                   <div className="relative group">
                      <input 
                        type="email" required
                        className="w-full bg-transparent border-b border-white/10 py-6 text-xl font-display font-bold text-white focus:outline-none focus:border-[#C9A84C] peer placeholder-transparent"
                        placeholder="Email Professionnel"
                        id="email"
                      />
                      <label 
                        htmlFor="email" 
                        className="absolute left-0 top-6 text-sm font-mono tracking-widest text-white/30 uppercase pointer-events-none transition-all duration-300 peer-focus:-top-4 peer-focus:text-[#C9A84C] peer-focus:text-[10px] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px]"
                      >
                        Email Professionnel
                      </label>
                   </div>

                   <div className="relative group">
                      <textarea 
                        required rows={4}
                        className="w-full bg-transparent border-b border-white/10 py-6 text-xl font-display font-bold text-white focus:outline-none focus:border-[#C9A84C] peer placeholder-transparent resize-none"
                        placeholder="Votre Projet"
                        id="project"
                      />
                      <label 
                        htmlFor="project" 
                        className="absolute left-0 top-6 text-sm font-mono tracking-widest text-white/30 uppercase pointer-events-none transition-all duration-300 peer-focus:-top-4 peer-focus:text-[#C9A84C] peer-focus:text-[10px] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px]"
                      >
                        Dites-nous tout sur votre projet
                      </label>
                   </div>

                   <button 
                    disabled={formStatus === 'loading'}
                    className="group relative w-full py-10 bg-transparent border border-[#C9A84C] overflow-hidden flex items-center justify-center gap-6"
                   >
                      <div className="absolute inset-0 bg-[#C9A84C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
                      <span className="relative z-10 text-[12px] font-black tracking-[0.5em] text-[#C9A84C] group-hover:text-[#080808] uppercase">
                        {formStatus === 'loading' ? 'ENVOI EN COURS...' : 'LANCER LA COLLABORATION'}
                      </span>
                      {formStatus !== 'loading' && (
                        <svg className="relative z-10 text-[#C9A84C] group-hover:text-[#080808] transition-colors" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      )}
                   </button>
                </form>
             )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
