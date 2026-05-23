'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useContactPanel } from '@/components/contact-panel-context';

const DEFAULT_VIDEO = 'https://stream.mux.com/4IMYGcL01xjs7ek5ANO17JC4VQVUTsojZlnw4fXzwSxc.m3u8';

interface Stat { value: string; label: string }

interface PageHeroProps {
  eyebrow?: string
  title: React.ReactNode
  subtitle: string
  ctaLabel?: string
  stats?: Stat[]
  videoUrl?: string
}

function HeroVideo({ url }: { url: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current; if (!video) return;
    let hls: import('hls.js').default | null = null;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url; video.play().catch(() => {});
    } else {
      import('hls.js').then(({ default: Hls }) => {
        if (!Hls.isSupported() || !ref.current) return;
        hls = new Hls({ startLevel: -1, maxBufferLength: 30 });
        hls.loadSource(url); hls.attachMedia(ref.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => ref.current?.play().catch(() => {}));
      });
    }
    return () => { hls?.destroy(); };
  }, [url]);
  return (
    <div className="absolute inset-0 z-0">
      <video ref={ref} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0" style={{ background: 'rgba(5,5,5,0.68)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 60% 50%, transparent 30%, rgba(0,0,0,0.5) 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-48" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)' }} />
    </div>
  );
}

export function PageHero({
  eyebrow = 'Alhambra Web · Lyon, France',
  title,
  subtitle,
  ctaLabel = 'Devis gratuit 24h',
  stats = [],
  videoUrl = DEFAULT_VIDEO,
}: PageHeroProps) {
  const { openPanel } = useContactPanel();
  return (
    <section
      className="relative overflow-hidden px-6 sm:px-10 lg:px-20 pt-28 pb-24 sm:pt-36 sm:pb-32"
      style={{ color: '#F8F6F2' }}
    >
      <HeroVideo url={videoUrl} />
      <div className="relative z-10 max-w-[1200px] mx-auto">
        <p
          style={{ letterSpacing: '0.45em', fontSize: '11px' }}
          className="uppercase text-white/30 font-bold mb-6"
        >
          {eyebrow}
        </p>
        <h1
          className="font-nordique"
          style={{ fontSize: 'clamp(44px,8vw,112px)', lineHeight: 0.92, letterSpacing: '-0.03em' }}
        >
          {title}
        </h1>
        <p
          style={{ fontFamily: 'var(--font-haas)', fontSize: 'clamp(16px,2vw,20px)', color: 'rgba(248,246,242,0.55)', lineHeight: 1.65, maxWidth: '620px' }}
          className="mt-8 mb-10"
        >
          {subtitle}
        </p>
        <div className="flex flex-wrap gap-4 items-center">
          <button
            onClick={() => openPanel()}
            style={{ background: '#F8F6F2', color: '#0A0A0A', fontFamily: 'var(--font-haas)' }}
            className="inline-block px-8 py-4 rounded-full text-sm font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors cursor-pointer"
          >
            {ctaLabel}
          </button>
          <Link
            href="/"
            style={{ color: 'rgba(248,246,242,0.3)', fontFamily: 'var(--font-haas)', fontSize: '13px' }}
            className="hover:text-white/60 transition-colors tracking-wide"
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>
        {stats.length > 0 && (
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-[480px]">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <div style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(22px,3vw,34px)', color: '#F8F6F2' }}>{value}</div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-white/30 mt-1">{label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
