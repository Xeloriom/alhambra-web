"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { RevealText, FadeUp } from "@/components/reveal-text";
import { MagneticButton } from "@/components/magnetic-button";

const works = [
  {
    id: "01",
    title: "EcoSphere Dashboard",
    category: "App Web",
    year: "2024",
    image: "/images/work-1.jpg",
  },
  {
    id: "02",
    title: "Nova Mobile App",
    category: "App Mobile",
    year: "2024",
    image: "/images/work-2.jpg",
  },
  {
    id: "03",
    title: "Quantum SaaS",
    category: "Logiciel",
    year: "2023",
    image: "/images/work-3.jpg",
  },
  {
    id: "04",
    title: "Zenith Identity",
    category: "Branding",
    year: "2023",
    image: "/images/work-4.jpg",
  },
];

export function WorksSection() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="work" className="bg-white text-black border-b border-black/10">
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-black/10">
        <div className="px-8 md:px-12 py-24 md:py-32 border-r border-black/10">
          <FadeUp>
            <p className="text-xs font-semibold tracking-[0.2em] text-black/30 uppercase mb-6">
              Réalisations
            </p>
          </FadeUp>
          <RevealText
            as="h2"
            className="text-4xl md:text-5xl lg:text-8xl font-black tracking-tighter text-balance text-black uppercase leading-[0.85]"
          >
            Nos Travaux
          </RevealText>
        </div>
        <div className="px-8 md:px-12 py-24 md:py-32 flex items-end">
          <FadeUp delay={0.2}>
            <p className="text-xl text-black/40 leading-relaxed max-w-sm">
              Une sélection de projets qui ont produit des résultats concrets.
            </p>
          </FadeUp>
        </div>
      </div>

      {/* Works Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {works.map((work, i) => (
          <FadeUp key={work.id} delay={i * 0.1}>
            <article
              data-cursor-view
              className={`relative overflow-hidden group cursor-pointer ${
                i % 2 === 0 ? "border-r border-black/10" : ""
              } border-b border-black/10`}
              onMouseEnter={() => setHovered(work.id)}
              onMouseLeave={() => setHovered(null)}
              aria-label={`${work.title} — ${work.category}`}
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden relative">
                <Image
                  src={work.image}
                  alt={`Projet ${work.title}`}
                  fill
                  className={`object-cover transition-transform duration-700 ${
                    hovered === work.id ? "scale-105" : "scale-100"
                  }`}
                />
                {/* Overlay */}
                <div
                  className={`absolute inset-0 bg-white transition-opacity duration-500 ${
                    hovered === work.id ? "opacity-10" : "opacity-0"
                  }`}
                />
              </div>

              {/* Info bar */}
              <div className="flex items-center justify-between px-8 py-10 border-t border-black/10 bg-white">
                <div className="overflow-hidden relative h-12">
                  <div
                    className={`transition-all duration-500 ${
                      hovered === work.id ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
                    }`}
                  >
                    <span className="text-xs font-bold tracking-widest text-black/30 uppercase block">
                      {work.category}
                    </span>
                    <span className="text-xl font-bold text-black block">
                      {work.title}
                    </span>
                  </div>
                  <div
                    className={`absolute inset-0 transition-all duration-500 ${
                      hovered === work.id ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                    }`}
                    aria-hidden="true"
                  >
                    <span className="text-xs font-bold tracking-widest text-black uppercase block">
                      Voir le Projet
                    </span>
                    <span className="text-xl font-bold text-black block">
                      {work.title}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xs text-black/30 font-mono">{work.year}</span>
                  <div
                    className={`w-12 h-12 rounded-full border border-black/10 flex items-center justify-center transition-all duration-300 ${
                      hovered === work.id ? "bg-black text-white rotate-45" : ""
                    }`}
                    aria-hidden="true"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </article>
          </FadeUp>
        ))}
      </div>

      {/* CTA */}
      <FadeUp>
        <div className="px-8 md:px-12 py-24 md:py-32 flex items-center justify-center border-t border-black/10">
          <MagneticButton strength={0.3}>
            <a
              href="https://www.alhambra-web.com/Work"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover
              className="inline-flex items-center gap-4 text-sm font-bold tracking-widest text-black/40 hover:text-black transition-colors group"
            >
              VOIR TOUT SUR ALHAMBRA
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="group-hover:rotate-45 transition-transform">
                <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </MagneticButton>
        </div>
      </FadeUp>
      <div className="hidden">alhambra-web.com</div>
    </section>
  );
}
