'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Positions relatives sur un SVG 500x360
const ZONES = [
  // ── Géographiques ───────────────────────────────────────────────────────────
  { href: '/agence-web-lyon/',             label: 'Agence Web Lyon',           tag: 'Agence Web',    x: 195, y: 195, r: 10, main: true  },
  { href: '/agence-web-villeurbanne/',     label: 'Agence Web Villeurbanne',   tag: 'Métropole',     x: 225, y: 178, r: 6,  main: false },
  { href: '/agence-web-pont-de-cheruy/',   label: 'Pont-de-Chéruy',            tag: 'Commune',       x: 300, y: 185, r: 5,  main: false },
  { href: '/agence-web-ain/',              label: 'Agence Web Ain',            tag: 'Ain',           x: 330, y: 120, r: 6,  main: false },
  { href: '/agence-web-isere/',            label: 'Agence Web Isère',          tag: 'Isère',         x: 265, y: 290, r: 6,  main: false },
  { href: '/agence-web-rhone-alpes/',      label: 'Agence Web Rhône-Alpes',    tag: 'Région',        x: 390, y: 240, r: 7,  main: false },
  // ── Services ────────────────────────────────────────────────────────────────
  { href: '/agence-seo-lyon/',             label: 'Agence SEO Lyon',           tag: 'Référencement', x: 130, y: 160, r: 6,  main: false },
  { href: '/creation-site-web-lyon/',      label: 'Création Site Web Lyon',    tag: 'Création',      x: 105, y: 230, r: 6,  main: false },
  { href: '/application-mobile-lyon/',     label: 'Application Mobile Lyon',   tag: 'Mobile',        x: 145, y: 300, r: 5,  main: false },
  { href: '/agence-logiciel-lyon/',        label: 'Agence Logiciel Lyon',      tag: 'Logiciel',      x: 210, y: 320, r: 5,  main: false },
  { href: '/creation-site-web-restaurant/',label: 'Site Web Restaurant',       tag: 'Restaurant',    x: 200, y: 105, r: 5,  main: false },
];

const LYON = { x: 195, y: 195 };

export function ZonesSection() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="w-full bg-white px-4 sm:px-8 lg:px-16 py-16 sm:py-24 lg:py-32 font-haas" data-nav-dark>
      {/* Label identique à "Services" */}
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.5 }}
        viewport={{ once: true }}
        className="block text-black text-[24px] sm:text-[28px] lg:text-[32px] mb-10 sm:mb-14 font-bold font-nordique"
      >
        Zones
      </motion.span>

      {/* Map */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative w-full"
        style={{ maxWidth: 700, margin: '0 auto' }}
      >
        <svg
          viewBox="0 0 500 380"
          className="w-full"
          style={{ overflow: 'visible' }}
        >
          {/* Grid dots décoratifs */}
          {Array.from({ length: 10 }).map((_, row) =>
            Array.from({ length: 13 }).map((_, col) => (
              <circle
                key={`${row}-${col}`}
                cx={col * 42 + 8}
                cy={row * 42 + 8}
                r={1}
                fill="rgba(10,10,10,0.06)"
              />
            ))
          )}

          {/* Lignes vers Lyon */}
          {ZONES.filter((_, i) => i !== 0).map((z, i) => (
            <motion.line
              key={z.href}
              x1={LYON.x} y1={LYON.y}
              x2={z.x}    y2={z.y}
              stroke="rgba(10,10,10,0.08)"
              strokeWidth="1"
              strokeDasharray="3 4"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE, delay: i * 0.06 + 0.3 }}
            />
          ))}

          {/* Ligne active */}
          {active !== null && active !== 0 && (
            <line
              x1={LYON.x} y1={LYON.y}
              x2={ZONES[active].x} y2={ZONES[active].y}
              stroke="rgba(10,10,10,0.4)"
              strokeWidth="1.5"
            />
          )}

          {/* Dots */}
          {ZONES.map((z, i) => (
            <motion.g
              key={z.href}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onClick={() => { window.location.href = z.href; }}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 + 0.2 }}
            >
              {/* Pulsing ring — main only */}
              {z.main && (
                <motion.circle
                  cx={z.x} cy={z.y}
                  animate={{ r: [z.r + 6, z.r + 14], opacity: [0.3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                  fill="none"
                  stroke="rgba(10,10,10,0.25)"
                  strokeWidth="1"
                />
              )}

              {/* Outer ring on hover */}
              {active === i && (
                <circle
                  cx={z.x} cy={z.y}
                  r={z.r + 7}
                  fill="none"
                  stroke="rgba(10,10,10,0.15)"
                  strokeWidth="1"
                />
              )}

              {/* Dot */}
              <motion.circle
                cx={z.x} cy={z.y}
                r={active === i ? z.r + 2 : z.r}
                fill={active === i ? '#0A0A0A' : z.main ? '#0A0A0A' : 'rgba(10,10,10,0.35)'}
                transition={{ duration: 0.2 }}
              />

              {/* Label */}
              <AnimatePresence>
                {active === i && (
                  <motion.g
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Label bg */}
                    <rect
                      x={z.x - 68} y={z.y - z.r - 38}
                      width={136} height={26}
                      rx={13}
                      fill="#0A0A0A"
                    />
                    <text
                      x={z.x} y={z.y - z.r - 20}
                      textAnchor="middle"
                      fill="white"
                      style={{ fontFamily: 'var(--font-haas)', fontSize: 10, letterSpacing: '0.03em' }}
                    >
                      {z.label}
                    </text>
                    {/* Tag */}
                    <text
                      x={z.x} y={z.y + z.r + 16}
                      textAnchor="middle"
                      fill="rgba(10,10,10,0.35)"
                      style={{ fontFamily: 'var(--font-haas)', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase' }}
                    >
                      {z.tag}
                    </text>
                  </motion.g>
                )}
              </AnimatePresence>
            </motion.g>
          ))}
        </svg>

        {/* Légende */}
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 justify-center">
          {[
            { dot: '#0A0A0A', label: 'Zone principale' },
            { dot: 'rgba(10,10,10,0.35)', label: 'Zone couverte' },
          ].map(({ dot, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dot }} />
              <span style={{ fontFamily: 'var(--font-haas)', fontSize: '11px', color: 'rgba(10,10,10,0.35)', letterSpacing: '0.1em' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
