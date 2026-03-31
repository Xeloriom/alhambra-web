"use client";

import Link from "next/link";
import { RevealText, FadeUp } from "@/components/reveal-text";
import { MouseParallax } from "@/components/mouse-parallax";
import { MagneticButton } from "@/components/magnetic-button";
import { TextScramble } from "@/components/text-scramble";
import { EditableText } from "@/components/editable-text";

interface HeroSectionProps {
  data?: {
    tagline: string;
    title: string;
    description: string;
    cta_work: string;
    cta_contact: string;
    stats: { value: string; label: string; }[];
  };
  onUpdate?: (path: string, value: any) => void;
  isEditing?: boolean;
}

export function HeroSection({ data, onUpdate, isEditing = false }: HeroSectionProps) {
  const heroData = data || {
    tagline: "Studio — Est. 2017",
    title: "L'excellence Digitale sur Mesure",
    description: "Web, mobile & software conçus pour la performance et la croissance.",
    cta_work: "PROJETS",
    cta_contact: "CONTACT",
    stats: [
      { value: "120+", label: "Projets" },
      { value: "95%", label: "Performance" },
      { value: "08", label: "Ans d'Expertise" },
      { value: "3×", label: "Croissance" },
    ],
  };

  const handleUpdate = (field: string, value: any) => {
    if (onUpdate) onUpdate(`hero.${field}`, value);
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-between overflow-hidden border-b border-[#171717] bg-black">
      {/* Top spacing */}
      <div className="pt-40 md:pt-48 px-8 md:px-20 lg:px-32 flex-1 flex flex-col justify-start">
        {/* Subtle tagline */}
        <FadeUp delay={0.1}>
          <div className="flex items-center gap-4 mb-10 md:mb-14">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FFFFFF]" />
            <EditableText
              isEditing={isEditing}
              value={heroData.tagline}
              onSave={(v) => handleUpdate("tagline", v)}
              as="span"
              className="text-[10px] font-bold tracking-[0.4em] text-white/40 uppercase"
            />
          </div>
        </FadeUp>

        {/* Pure Headline - Lightweight & Bold mix */}
        <MouseParallax intensity={10} className="max-w-6xl">
          <EditableText
            isEditing={isEditing}
            value={heroData.title}
            onSave={(v) => handleUpdate("title", v)}
            as="h1"
            className="text-[clamp(3rem,12vw,10rem)] font-bold tracking-tighter leading-[0.85] text-white uppercase block w-full outline-none"
          />
        </MouseParallax>

        {/* Description and CTA with heavy spacing */}
        <FadeUp delay={0.4} className="mt-16 md:mt-24 flex flex-col md:flex-row items-start md:items-end gap-10 md:gap-24 w-full">
          <EditableText
            isEditing={isEditing}
            value={heroData.description}
            onSave={(v) => handleUpdate("description", v)}
            as="p"
            className="text-lg md:text-xl text-white/50 max-w-sm leading-relaxed font-light block"
          />
          <div className="flex items-center gap-6">
            <MagneticButton strength={0.2}>
              <Link
                href="#work"
                className="inline-flex items-center gap-3 bg-white text-black text-[10px] font-black tracking-widest px-10 py-5 rounded-lg hover:bg-black hover:text-white border border-white transition-all active:scale-95 group"
              >
                <EditableText isEditing={isEditing} value={heroData.cta_work} onSave={(v) => handleUpdate("cta_work", v)} as="span" />
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="group-hover:rotate-45 transition-transform duration-500">
                  <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </MagneticButton>
            <MagneticButton strength={0.2}>
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest text-white border border-white/20 px-10 py-5 rounded-lg hover:border-white transition-all active:scale-95"
              >
                <EditableText isEditing={isEditing} value={heroData.cta_contact} onSave={(v) => handleUpdate("cta_contact", v)} as="span" />
              </Link>
            </MagneticButton>
          </div>
        </FadeUp>
      </div>

      {/* Modern Stats bar - Minimal & Thin borders */}
      <div className="border-t border-[#171717] grid grid-cols-2 md:grid-cols-4 bg-black">
        {heroData.stats.map((stat, i) => (
          <FadeUp key={stat.label + i} delay={0.6 + i * 0.1}>
            <div
              className={`px-12 py-10 md:py-14 flex flex-col gap-2 ${
                i < heroData.stats.length - 1 ? "border-r border-[#171717]" : ""
              }`}
            >
              <EditableText
                isEditing={isEditing}
                value={stat.value}
                onSave={(v) => {
                  const newStats = [...heroData.stats];
                  newStats[i].value = v;
                  handleUpdate("stats", newStats);
                }}
                as="span"
                className="text-4xl md:text-5xl font-bold tracking-tighter text-white block"
              />
              <EditableText
                isEditing={isEditing}
                value={stat.label}
                onSave={(v) => {
                  const newStats = [...heroData.stats];
                  newStats[i].label = v;
                  handleUpdate("stats", newStats);
                }}
                as="span"
                className="text-[9px] font-black tracking-[0.3em] text-white/30 uppercase block"
              />
            </div>
          </FadeUp>
        ))}
      </div>
      <div className="hidden">alhambra-web.com</div>
    </section>
  );
}
