"use client";

import { useState, useTransition } from "react";
import { RevealText, FadeUp } from "@/components/reveal-text";
import { sendCallRequest } from "@/actions/send-call-request";

export function ContactSection() {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<{ success?: boolean; message?: string; errors?: any } | null>(null);

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await sendCallRequest(null, formData);
      setState(result);
    });
  };

  return (
    <section id="contact" className="bg-[#000000] text-[#F9F9F9] border-b border-white/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#FF4D00]/5 blur-[120px] pointer-events-none" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 relative z-10">
        <div className="px-8 md:px-16 py-20 md:py-32 border-r border-white/10 flex flex-col justify-between gap-16">
          <div>
            <FadeUp>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#FF4D00] animate-pulse" />
                <p className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">
                  Appel Gratuit & Devis
                </p>
              </div>
            </FadeUp>
            <RevealText
              as="h2"
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-balance text-[#F9F9F9] uppercase leading-[0.85]"
            >
              Parlons de Votre Projet
            </RevealText>
            <FadeUp delay={0.3} className="mt-10">
              <p className="text-lg md:text-xl text-white/50 leading-relaxed max-w-md font-medium">
                Réservez un créneau ou envoyez-nous un message. On vous répond avec une stratégie concrète.
              </p>
            </FadeUp>
          </div>

          <FadeUp delay={0.4}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
              <div className="space-y-2">
                <p className="text-[10px] font-black tracking-[0.2em] text-[#FF4D00] uppercase">Email</p>
                <p className="text-lg font-black tracking-tight">hello@alhambra-web.com</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black tracking-[0.2em] text-[#FF4D00] uppercase">Bureau</p>
                <p className="text-lg font-black tracking-tight">Paris, France — Remote</p>
              </div>
            </div>
          </FadeUp>
        </div>

        <div className="px-8 md:px-20 py-20 md:py-32 bg-white/5 backdrop-blur-sm">
          {state?.success ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 rounded-full bg-[#FF4D00] flex items-center justify-center shadow-2xl shadow-[#FF4D00]/20">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Demande Reçue !</h3>
                <p className="text-white/50 text-lg font-medium max-w-xs mx-auto">{state.message}</p>
              </div>
              <button 
                onClick={() => setState(null)}
                className="text-xs font-black tracking-widest text-[#FF4D00] uppercase border-b-2 border-[#FF4D00] pb-1 hover:text-white hover:border-white transition-all"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form action={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-700">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase block px-1">Votre Nom</label>
                  <input
                    name="name"
                    required
                    placeholder="Jean Dupont"
                    className={`w-full bg-white/5 border-2 rounded-2xl px-6 py-5 text-white placeholder:text-white/10 outline-none transition-all duration-300 ${
                      state?.errors?.name ? "border-red-500" : "border-white/10 focus:border-[#FF4D00]"
                    }`}
                  />
                  {state?.errors?.name && <p className="text-red-500 text-[10px] font-bold uppercase">{state.errors.name[0]}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase block px-1 text-left">Email</label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="jean@entreprise.com"
                      className={`w-full bg-white/5 border-2 rounded-2xl px-6 py-5 text-white placeholder:text-white/10 outline-none transition-all duration-300 ${
                        state?.errors?.email ? "border-red-500" : "border-white/10 focus:border-[#FF4D00]"
                      }`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase block px-1 text-left">Téléphone</label>
                    <input
                      name="phone"
                      required
                      placeholder="06 12 34 56 78"
                      className={`w-full bg-white/5 border-2 rounded-2xl px-6 py-5 text-white placeholder:text-white/10 outline-none transition-all duration-300 ${
                        state?.errors?.phone ? "border-red-500" : "border-white/10 focus:border-[#FF4D00]"
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase block px-1">Votre Projet (Optionnel)</label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Décrivez brièvement vos besoins..."
                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-white/10 outline-none focus:border-[#FF4D00] transition-all duration-300 resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full group flex items-center justify-between bg-[#FF4D00] text-white px-10 py-6 rounded-2xl transition-all duration-300 shadow-xl shadow-[#FF4D00]/20 hover:bg-white hover:text-black disabled:opacity-50 active:scale-[0.98]"
              >
                <span className="text-xs font-black uppercase tracking-[0.3em]">
                  {isPending ? "Traitement..." : "Demander un Appel Gratuit"}
                </span>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="hidden">alhambra-web.com</div>
    </section>
  );
}
