'use client';

import React, { useRef, useCallback, useState } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const PAGES = [
  { href: '/agence-web-lyon/',             label: 'Agence Web\nLyon',             tag: 'Agence Web',     span: 2 },
  { href: '/agence-seo-lyon/',             label: 'Agence SEO\nLyon',             tag: 'Référencement',  span: 1 },
  { href: '/creation-site-web-lyon/',      label: 'Création\nSite Web Lyon',      tag: 'Création Web',   span: 1 },
  { href: '/agence-web-villeurbanne/',     label: 'Agence Web\nVilleurbanne',     tag: 'Métropole',      span: 1 },
  { href: '/agence-web-isere/',            label: 'Agence Web\nIsère',            tag: 'Département',    span: 1 },
  { href: '/agence-web-rhone-alpes/',      label: 'Agence Web\nRhône-Alpes',      tag: 'Région',         span: 2 },
  { href: '/application-mobile-lyon/',     label: 'App Mobile\nLyon',             tag: 'Mobile',         span: 1 },
  { href: '/agence-logiciel-lyon/',        label: 'Logiciel\nLyon',               tag: 'Sur-mesure',     span: 1 },
  { href: '/agence-web-ain/',              label: 'Agence Web\nAin',              tag: 'Département',    span: 1 },
  { href: '/creation-site-web-restaurant/',label: 'Site Web\nRestaurant',         tag: 'Restaurant',     span: 1 },
  { href: '/agence-web-pont-de-cheruy/',   label: 'Pont-de-\nChéruy',             tag: 'Commune',        span: 1 },
];

function PageCard({ page, index }: { page: typeof PAGES[0]; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [spot, setSpot] = useState({ x: 50, y: 50, show: false });

  const onMove = useCallback((e: React.MouseEvent) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    setSpot({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, show: true });
  }, []);

  const lines = page.label.split('\n');

  return (
    <motion.a
      ref={cardRef}
      href={page.href}
      onMouseMove={onMove}
      onMouseLeave={() => setSpot(s => ({ ...s, show: false }))}
      initial={{ opacity: 0, y: 36, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: EASE, delay: index * 0.04 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-7 cursor-pointer"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
        minHeight: 'clamp(160px, 20vw, 240px)',
        gridColumn: `span ${page.span}`,
        transition: 'border-color 0.3s ease',
      }}
    >
      {/* Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: spot.show ? 1 : 0,
          background: `radial-gradient(circle at ${spot.x}% ${spot.y}%, rgba(255,255,255,0.07) 0%, transparent 55%)`,
        }}
      />

      {/* Hover border glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.14)' }}
      />

      {/* Top row: index + tag */}
      <div className="flex items-start justify-between relative z-10">
        <span style={{ fontFamily: 'var(--font-haas)', fontSize: '9px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase' }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span
          className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0"
          style={{ fontFamily: 'var(--font-haas)', fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}
        >
          {page.tag}
        </span>
      </div>

      {/* Ghost number background */}
      <div
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 select-none"
        style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(80px, 12vw, 160px)', lineHeight: 1, color: 'rgba(255,255,255,0.025)', letterSpacing: '-0.04em' }}
        aria-hidden
      >
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Title + arrow */}
      <div className="relative z-10">
        <p
          className="text-white group-hover:text-white/90 transition-colors duration-300"
          style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(20px, 2.8vw, 40px)', lineHeight: 1.05, letterSpacing: '-0.025em' }}
        >
          {lines.map((l, i) => (
            <React.Fragment key={i}>{l}{i < lines.length - 1 && <br />}</React.Fragment>
          ))}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span
            className="opacity-100 group-hover:opacity-60 transition-opacity duration-300"
            style={{ fontFamily: 'var(--font-haas)', fontSize: '9px', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}
          >
            {page.tag}
          </span>
          <svg
            className="opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-300"
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2"
          >
            <path d="M7 17L17 7M17 7H7M17 7V17"/>
          </svg>
        </div>
      </div>
    </motion.a>
  );
}

export function ZonesSection() {
  const titleRef = useRef<HTMLDivElement>(null);
  const inView   = useInView(titleRef, { once: true, margin: '-80px' });

  return (
    <section
      className="w-full px-4 sm:px-8 lg:px-16 py-20 sm:py-28 lg:py-36"
      style={{ background: '#0A0A0A' }}
    >
      {/* Header */}
      <div ref={titleRef} className="mb-12 sm:mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div className="overflow-hidden">
          <motion.h2
            initial={{ y: '105%' }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE }}
            className="font-nordique text-white tracking-tighter leading-[0.88]"
            style={{ fontSize: 'clamp(44px, 7vw, 96px)' }}
          >
            Partout où<br />
            <span style={{ color: 'rgba(255,255,255,0.18)', fontStyle: 'italic' }}>vous êtes.</span>
          </motion.h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
          className="flex flex-col gap-2 sm:items-end"
        >
          <span
            style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(48px, 6vw, 80px)', color: 'rgba(255,255,255,0.07)', lineHeight: 1 }}
            className="font-bold tabular-nums"
          >
            {PAGES.length}
          </span>
          <span style={{ fontFamily: 'var(--font-haas)', fontSize: '11px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            Zones couvertes
          </span>
        </motion.div>
      </div>

      {/* Grid */}
      <div
        className="grid gap-3 sm:gap-4"
        style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
      >
        {PAGES.map((page, i) => (
          <PageCard key={page.href} page={page} index={i} />
        ))}
      </div>

      {/* Bottom line */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{ fontFamily: 'var(--font-haas)', fontSize: '12px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em' }}
        className="mt-10 text-center uppercase"
      >
        Lyon · Villeurbanne · Isère · Ain · Rhône-Alpes
      </motion.p>
    </section>
  );
}
