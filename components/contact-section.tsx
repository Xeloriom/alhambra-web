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
    <section id="contact" className="bg-white text-black border-b border-[#E5E5E5] relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 relative z-10">
        {/* Info Side with huge padding */}
        <div className="px-8 md:px-24 py-24 md:py-48 border-r border-[#E5E5E5] flex flex-col justify-between gap-24">
          <div className="text-left">
            <FadeUp>
              <div className="flex items-center gap-3 mb-10">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                <p className="text-[10px] font-black tracking-[0.4em] text-black/40 uppercase">
                  Appel Gratuit & Devis
                </p>
              </div>
            </FadeUp>
            <RevealText
              as="h2"
              className="text-5xl md:text-8xl font-bold tracking-tighter text-black uppercase leading-[0.85]"
            >
              Parlons de Votre Projet
            </RevealText>
            <FadeUp delay={0.3} className="mt-12">
              <p className="text-lg md:text-xl text-black/50 leading-relaxed max-w-md font-light">
                Réservez un créneau ou envoyez-nous un message. On vous répond avec une stratégie concrète sous 24h.
              </p>
            </FadeUp>
          </div>

          <FadeUp delay={0.4}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-left">
              <div className="space-y-3">
                <p className="text-[10px] font-black tracking-[0.3em] text-black/30 uppercase">Email</p>
                <p className="text-xl font-bold tracking-tight">hello@alhambra-web.com</p>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black tracking-[0.3em] text-black/30 uppercase">Bureau</p>
                <p className="text-xl font-bold tracking-tight">Paris, France — Remote</p>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* Form Side with cleaner look */}
        <div className="px-8 md:px-24 py-24 md:py-48 bg-[#FAFAFA]">
          {state?.success ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-10 animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 rounded-full border-2 border-black flex items-center justify-center shadow-2xl">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <h3 className="text-3xl font-bold uppercase tracking-tighter mb-4">Demande Reçue</h3>
                <p className="text-black/50 text-lg font-light max-w-xs mx-auto">{state.message}</p>
              </div>
              <button 
                onClick={() => setState(null)}
                className="text-[10px] font-black tracking-widest text-black uppercase border-b border-black pb-1 hover:text-black/50 transition-all"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form action={handleSubmit} className="space-y-12 animate-in fade-in slide-in-from-right-10 duration-700">
              <div className="space-y-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black tracking-[0.3em] text-black/30 uppercase block px-1 text-left">Votre Nom</label>
                  <input
                    name="name"
                    required
                    placeholder="Jean Dupont"
                    className="w-full bg-transparent border-b border-black/10 py-4 text-xl font-bold text-black placeholder:text-black/10 outline-none focus:border-black transition-all duration-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black tracking-[0.3em] text-black/30 uppercase block px-1 text-left">Email</label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="jean@entreprise.com"
                      className="w-full bg-transparent border-b border-black/10 py-4 text-xl font-bold text-black placeholder:text-black/10 outline-none focus:border-black transition-all duration-500"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black tracking-[0.3em] text-black/30 uppercase block px-1 text-left">Téléphone</label>
                    <input
                      name="phone"
                      required
                      placeholder="06 12 34 56 78"
                      className="w-full bg-transparent border-b border-black/10 py-4 text-xl font-bold text-black placeholder:text-black/10 outline-none focus:border-black transition-all duration-500"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black tracking-[0.3em] text-black/30 uppercase block px-1 text-left">Votre Projet</label>
                  <textarea
                    name="message"
                    rows={1}
                    placeholder="Décrivez brièvement vos besoins..."
                    className="w-full bg-transparent border-b border-black/10 py-4 text-xl font-bold text-black placeholder:text-black/10 outline-none focus:border-black transition-all duration-500 resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full group flex items-center justify-between bg-black text-white px-12 py-8 rounded-lg transition-all duration-500 shadow-2xl hover:bg-black/90 disabled:opacity-50 active:scale-[0.98]"
              >
                <span className="text-xs font-black uppercase tracking-[0.4em]">
                  {isPending ? "Traitement..." : "Demander un Appel Gratuit"}
                </span>
                <div className="w-10 h-10 bg-white text-black rounded flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                  <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
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
