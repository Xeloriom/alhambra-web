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
    <section id="cta-banner" className="bg-[#000000] text-[#F9F9F9] border-b border-white/10 overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#FF4D00]/10 blur-[150px] pointer-events-none rounded-full" />
      
      <div className="px-8 md:px-12 py-32 md:py-48 flex flex-col items-center text-center gap-12 relative z-10">
        <div className="max-w-4xl">
          <EditableText
            isEditing={isEditing}
            value={bData.title}
            onSave={(v) => handleUpdate("title", v)}
            as="h2"
            className="text-[clamp(2.5rem,7vw,8rem)] font-black tracking-tighter text-[#F9F9F9] uppercase leading-[0.85] mb-12"
          />
        </div>
        
        <FadeUp delay={0.3}>
          <MagneticButton strength={0.4}>
            <button className="bg-[#FF4D00] text-white px-12 md:px-20 py-8 md:py-10 rounded-full text-sm md:text-lg font-black tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-2xl shadow-[#FF4D00]/20 group active:scale-95">
               <EditableText
                  isEditing={isEditing}
                  value={bData.button}
                  onSave={(v) => handleUpdate("button", v)}
                  as="span"
                  className="flex items-center gap-4"
                />
            </button>
          </MagneticButton>
        </FadeUp>
      </div>
      <div className="hidden">alhambra-web.com</div>
    </section>
  );
}
