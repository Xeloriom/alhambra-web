'use client';

import React, { useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const PAGES = [
  { href: '/agence-web-lyon/',              label: 'Agence Web Lyon',              tag: 'Agence Web'     },
  { href: '/agence-seo-lyon/',              label: 'Agence SEO Lyon',              tag: 'Référencement'  },
  { href: '/creation-site-web-lyon/',       label: 'Création Site Web Lyon',       tag: 'Création'       },
  { href: '/agence-web-villeurbanne/',      label: 'Agence Web Villeurbanne',      tag: 'Métropole'      },
  { href: '/agence-web-isere/',             label: 'Agence Web Isère',             tag: 'Isère'          },
  { href: '/agence-web-rhone-alpes/',       label: 'Agence Web Rhône-Alpes',       tag: 'Région'         },
  { href: '/application-mobile-lyon/',      label: 'Application Mobile Lyon',      tag: 'Mobile'         },
  { href: '/agence-logiciel-lyon/',         label: 'Agence Logiciel Lyon',         tag: 'Sur-mesure'     },
  { href: '/agence-web-ain/',               label: 'Agence Web Ain',               tag: 'Ain'            },
  { href: '/creation-site-web-restaurant/', label: 'Site Web Restaurant',          tag: 'Restaurant'     },
  { href: '/agence-web-pont-de-cheruy/',    label: 'Agence Web Pont-de-Chéruy',    tag: 'Commune'        },
];

function ZoneRow({ page, index, total }: { page: typeof PAGES[0]; index: number; total: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={page.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.55, ease: EASE, delay: index * 0.035 }}
      className="group flex items-center gap-4 sm:gap-8 py-4 sm:py-5 border-t border-black/[0.07] relative overflow-hidden cursor-pointer"
    >
      {/* Hover fill */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ background: 'rgba(10,10,10,0.03)' }}
      />

      {/* Number */}
      <span
        className="flex-shrink-0 tabular-nums transition-colors duration-300 w-8 text-right"
        style={{
          fontFamily: 'var(--font-haas)',
          fontSize: 'clamp(10px, 1vw, 13px)',
          color: hovered ? 'rgba(10,10,10,0.5)' : 'rgba(10,10,10,0.2)',
          letterSpacing: '0.2em',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Label */}
      <motion.span
        animate={{ x: hovered ? 8 : 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="flex-1 min-w-0"
        style={{
          fontFamily: 'var(--font-nordique)',
          fontSize: 'clamp(22px, 3.5vw, 52px)',
          lineHeight: 1,
          letterSpacing: '-0.02em',
          color: hovered ? '#0A0A0A' : 'rgba(10,10,10,0.75)',
          transition: 'color 0.25s ease',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {page.label}
      </motion.span>

      {/* Tag — desktop */}
      <span
        className="hidden sm:block flex-shrink-0 transition-opacity duration-300"
        style={{
          fontFamily: 'var(--font-haas)',
          fontSize: '10px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(10,10,10,0.3)',
          opacity: hovered ? 0.7 : 0.4,
        }}
      >
        {page.tag}
      </span>

      {/* Arrow */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -8 }}
        transition={{ duration: 0.25, ease: EASE }}
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
        style={{ background: '#0A0A0A' }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
          <path d="M7 17L17 7M17 7H7M17 7V17"/>
        </svg>
      </motion.div>

      {/* Bottom border last row */}
      {index === total - 1 && (
        <div className="absolute bottom-0 left-0 right-0 border-b border-black/[0.07]" />
      )}
    </motion.a>
  );
}

export function ZonesSection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      className="w-full bg-white px-4 sm:px-8 lg:px-16 py-20 sm:py-28 lg:py-36 font-haas"
      data-nav-dark
    >
      {/* Header */}
      <div ref={ref} className="mb-12 sm:mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 overflow-hidden">
        <div className="overflow-hidden">
          <motion.h2
            initial={{ y: '110%' }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 0.85, ease: EASE }}
            className="font-nordique text-black leading-[0.9] tracking-tighter"
            style={{ fontSize: 'clamp(36px, 5.5vw, 80px)' }}
          >
            Zones<br />
            <span style={{ color: 'rgba(10,10,10,0.2)', fontStyle: 'italic' }}>d&apos;intervention.</span>
          </motion.h2>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
          style={{
            fontFamily: 'var(--font-haas)',
            fontSize: '13px',
            color: 'rgba(10,10,10,0.4)',
            maxWidth: '280px',
            lineHeight: 1.65,
          }}
        >
          {PAGES.length} zones couvertes — de Lyon à l&apos;Isère, de l&apos;Ain à toute la région Rhône-Alpes.
        </motion.p>
      </div>

      {/* Rows */}
      <div>
        {PAGES.map((page, i) => (
          <ZoneRow key={page.href} page={page} index={i} total={PAGES.length} />
        ))}
      </div>
    </section>
  );
}
