"use client";

import { RevealText, FadeUp } from "@/components/reveal-text";
import { MagneticButton } from "@/components/magnetic-button";
import { EditableText } from "@/components/editable-text";

interface CTABannerProps {
  data?: {
    title: string;
    button: string;
  };
  onUpdate?: (path: string, value: any) => void;
  isEditing?: boolean;
}

export function CTABanner({ data, onUpdate, isEditing = false }: CTABannerProps) {
  const bData = data || {
    title: "Prêt à transformer votre présence ?",
    button: "DÉMARRER MAINTENANT"
  };

  const handleUpdate = (field: string, value: any) => {
    if (onUpdate) onUpdate(`cta_banner.${field}`, value);
  };

  return (
    <section id="cta-banner" className="bg-white text-black border-b border-black/10 overflow-hidden relative">
      {/* Background glow - subtle for light mode */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-black/5 blur-[150px] pointer-events-none rounded-full" />
      
      <div className="px-8 md:px-12 py-48 md:py-64 flex flex-col items-center text-center gap-20 relative z-10">
        <div className="max-w-5xl">
          <EditableText
            isEditing={isEditing}
            value={bData.title}
            onSave={(v) => handleUpdate("title", v)}
            as="h2"
            className="text-[clamp(2.5rem,7vw,10rem)] font-black tracking-tighter text-black uppercase leading-[0.85] mb-16"
          />
        </div>
        
        <FadeUp delay={0.3}>
          <MagneticButton strength={0.4}>
            <button className="bg-black text-white px-16 md:px-24 py-10 md:py-12 rounded-full text-sm md:text-xl font-black tracking-[0.2em] hover:bg-[#FF4D00] transition-all shadow-2xl shadow-black/10 group active:scale-95">
               <EditableText
                  isEditing={isEditing}
                  value={bData.button}
                  onSave={(v) => handleUpdate("button", v)}
                  as="span"
                  className="flex items-center gap-6"
                />
            </button>
          </MagneticButton>
        </FadeUp>
      </div>
      <div className="hidden">alhambra-web.com</div>
    </section>
  );
}
