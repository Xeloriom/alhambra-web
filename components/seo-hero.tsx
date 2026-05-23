'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const HLS_URL = 'https://stream.mux.com/4IMYGcL01xjs7ek5ANO17JC4VQVUTsojZlnw4fXzwSxc.m3u8';
const PSI_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
const EASE: [number, number, number, number]       = [0.16, 1, 0.3, 1];
const EASE_SHARP: [number, number, number, number] = [0.76, 0, 0.24, 1];

// ── Types ─────────────────────────────────────────────────────────────────────
interface AuditData {
  url: string;
  performance: number;
  seo: number;
  accessibility: number;
  bestPractices: number;
  lcp: { value: string; pass: boolean };
  cls: { value: string; pass: boolean };
  tbt: { value: string; pass: boolean };
  fcp: { value: string; pass: boolean };
  si:  { value: string; pass: boolean };
  opportunities: { title: string; savings: string }[];
}

// ── HLS Video Background ──────────────────────────────────────────────────────
function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let hlsInstance: import('hls.js').default | null = null;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = HLS_URL;
      video.play().catch(() => {});
    } else {
      import('hls.js').then(({ default: Hls }) => {
        if (!Hls.isSupported() || !ref.current) return;
        hlsInstance = new Hls({ startLevel: -1, maxBufferLength: 30 });
        hlsInstance.loadSource(HLS_URL);
        hlsInstance.attachMedia(ref.current);
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
          ref.current?.play().catch(() => {});
        });
      });
    }
    return () => { hlsInstance?.destroy(); };
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <video
        ref={ref}
        autoPlay loop muted playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0" style={{ background: 'rgba(5,5,5,0.68)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 60% 50%, transparent 30%, rgba(0,0,0,0.5) 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-48" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)' }} />
    </div>
  );
}

// ── Score Ring ────────────────────────────────────────────────────────────────
function ScoreRing({ score, label }: { score: number; label: string }) {
  const color = score >= 90 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';
  const r = 26, circ = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="4" />
          <motion.circle
            cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - (score / 100) * circ }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.15 }}
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center font-bold text-white"
          style={{ fontFamily: 'var(--font-haas)', fontSize: '14px' }}
        >
          {score}
        </span>
      </div>
      <span className="text-white/35 uppercase tracking-[0.18em]" style={{ fontFamily: 'var(--font-haas)', fontSize: '9px' }}>
        {label}
      </span>
    </div>
  );
}

// ── Vital Row ─────────────────────────────────────────────────────────────────
function VitalRow({ label, value, pass }: { label: string; value: string; pass: boolean }) {
  return (
    <div className="flex items-center justify-between py-[10px] border-b border-white/[0.06] last:border-0">
      <span style={{ fontFamily: 'var(--font-haas)', fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>{label}</span>
      <div className="flex items-center gap-2">
        <span style={{ fontFamily: 'var(--font-haas)', fontSize: '13px', fontWeight: 700, color: pass ? '#4ade80' : '#fbbf24' }}>{value}</span>
        <div className={`w-[6px] h-[6px] rounded-full flex-shrink-0 ${pass ? 'bg-emerald-400' : 'bg-amber-400'}`} />
      </div>
    </div>
  );
}

// ── Audit Panel ───────────────────────────────────────────────────────────────
function AuditPanel({ onClose }: { onClose: () => void }) {
  const [url,     setUrl]     = useState('');
  const [status,  setStatus]  = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [result,  setResult]  = useState<AuditData | null>(null);
  const [errMsg,  setErrMsg]  = useState('');
  const [strategy, setStrategy] = useState<'mobile' | 'desktop'>('mobile');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const normalise = (raw: string) => {
    let u = raw.trim();
    if (!u.startsWith('http://') && !u.startsWith('https://')) u = 'https://' + u;
    return u;
  };

  const runAudit = useCallback(async (strat: 'mobile' | 'desktop' = strategy) => {
    const cleanUrl = normalise(url);
    if (!cleanUrl) return;
    setStatus('loading');
    setResult(null);
    setErrMsg('');
    try {
      const cats = ['performance', 'seo', 'accessibility', 'best-practices'];
      const qs = new URLSearchParams({ url: cleanUrl, strategy: strat, ...Object.fromEntries(cats.map(c => ['category', c])) });
      // URLSearchParams doesn't support multiple same-key params, build manually
      const catParam = cats.map(c => `category=${c}`).join('&');
      const res = await fetch(`${PSI_URL}?url=${encodeURIComponent(cleanUrl)}&strategy=${strat}&${catParam}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      const lr   = data.lighthouseResult;
      const cats2 = lr.categories;
      const aud  = lr.audits;

      const score = (k: string) => Math.round((cats2[k]?.score ?? 0) * 100);
      const audit = (k: string) => ({
        value: aud[k]?.displayValue ?? '—',
        pass:  (aud[k]?.score ?? 0) >= 0.9,
      });

      const opps = Object.values(aud as Record<string, { details?: { type?: string }; score?: number; title?: string; description?: string; displayValue?: string }>)
        .filter(a => a.details?.type === 'opportunity' && (a.score ?? 1) < 0.9)
        .slice(0, 4)
        .map(a => ({ title: a.title ?? '', savings: a.displayValue ?? '' }));

      setResult({
        url: cleanUrl,
        performance:   score('performance'),
        seo:           score('seo'),
        accessibility: score('accessibility'),
        bestPractices: score('best-practices'),
        lcp: audit('largest-contentful-paint'),
        cls: audit('cumulative-layout-shift'),
        tbt: audit('total-blocking-time'),
        fcp: audit('first-contentful-paint'),
        si:  audit('speed-index'),
        opportunities: opps,
      });
      setStatus('done');
    } catch (e: unknown) {
      setErrMsg(e instanceof Error ? e.message : 'Erreur inconnue');
      setStatus('error');
    }
  }, [url, strategy]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="w-full sm:max-w-[560px] rounded-t-3xl sm:rounded-3xl overflow-hidden"
        style={{ background: '#0e0e0e', border: '1px solid rgba(255,255,255,0.08)', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-5 flex items-start justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <p className="text-white/30 uppercase tracking-[0.3em] mb-1" style={{ fontFamily: 'var(--font-haas)', fontSize: '10px' }}>
              Alhambra Web · Outil SEO
            </p>
            <h2 className="text-white font-nordique tracking-tighter" style={{ fontSize: 'clamp(22px,3vw,32px)', lineHeight: 1 }}>
              Audit SEO gratuit
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Input */}
        <div className="px-6 py-5">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && status !== 'loading' && runAudit()}
              placeholder="https://votre-site.com"
              className="flex-1 rounded-full px-5 py-3 text-white placeholder-white/25 outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                fontFamily: 'var(--font-haas)',
                fontSize: '13px',
              }}
            />
            <button
              onClick={() => runAudit()}
              disabled={status === 'loading' || !url.trim()}
              className="px-5 py-3 rounded-full font-bold uppercase tracking-[0.15em] transition-all disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
              style={{ background: '#F8F6F2', color: '#0A0A0A', fontFamily: 'var(--font-haas)', fontSize: '11px' }}
            >
              {status === 'loading' ? '...' : 'Analyser'}
            </button>
          </div>

          {/* Strategy toggle */}
          <div className="flex gap-2 mt-3">
            {(['mobile', 'desktop'] as const).map(s => (
              <button
                key={s}
                onClick={() => { setStrategy(s); if (status === 'done') runAudit(s); }}
                className="px-4 py-[6px] rounded-full text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer"
                style={{
                  fontFamily: 'var(--font-haas)',
                  background: strategy === s ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: strategy === s ? '#fff' : 'rgba(255,255,255,0.35)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {status === 'loading' && (
          <div className="px-6 pb-8 flex flex-col items-center gap-4">
            <div className="w-full h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #fff, rgba(255,255,255,0.3))' }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
              />
            </div>
            <p className="text-white/30 text-[12px]" style={{ fontFamily: 'var(--font-haas)' }}>
              Analyse en cours… (10–30s)
            </p>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="px-6 pb-6">
            <div className="rounded-2xl px-4 py-3" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <p className="text-red-400 text-[13px]" style={{ fontFamily: 'var(--font-haas)' }}>
                {errMsg || 'URL invalide ou site inaccessible.'}
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {status === 'done' && result && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="px-6 pb-8"
            >
              {/* URL analysée */}
              <p className="text-white/25 text-[11px] mb-5 truncate" style={{ fontFamily: 'var(--font-haas)' }}>
                ↗ {result.url}
              </p>

              {/* Score rings */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                <ScoreRing score={result.performance}   label="Perf." />
                <ScoreRing score={result.seo}           label="SEO" />
                <ScoreRing score={result.accessibility} label="Access." />
                <ScoreRing score={result.bestPractices} label="Pratiques" />
              </div>

              {/* Core Web Vitals */}
              <p className="text-white/25 uppercase tracking-[0.28em] mb-2 mt-2" style={{ fontFamily: 'var(--font-haas)', fontSize: '9px' }}>
                Core Web Vitals
              </p>
              <div className="rounded-2xl px-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <VitalRow label="LCP — Largest Contentful Paint" value={result.lcp.value} pass={result.lcp.pass} />
                <VitalRow label="CLS — Cumulative Layout Shift"  value={result.cls.value} pass={result.cls.pass} />
                <VitalRow label="TBT — Total Blocking Time"      value={result.tbt.value} pass={result.tbt.pass} />
                <VitalRow label="FCP — First Contentful Paint"   value={result.fcp.value} pass={result.fcp.pass} />
                <VitalRow label="Speed Index"                    value={result.si.value}  pass={result.si.pass}  />
              </div>

              {/* Opportunities */}
              {result.opportunities.length > 0 && (
                <>
                  <p className="text-white/25 uppercase tracking-[0.28em] mb-2 mt-5" style={{ fontFamily: 'var(--font-haas)', fontSize: '9px' }}>
                    Optimisations prioritaires
                  </p>
                  <div className="space-y-2">
                    {result.opportunities.map((opp, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-2xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="w-[5px] h-[5px] rounded-full bg-amber-400 flex-shrink-0 mt-[5px]" />
                        <div>
                          <p className="text-white/70 text-[12px]" style={{ fontFamily: 'var(--font-haas)' }}>{opp.title}</p>
                          {opp.savings && <p className="text-amber-400/60 text-[11px] mt-[2px]" style={{ fontFamily: 'var(--font-haas)' }}>{opp.savings}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* CTA */}
              <a
                href="/#contact"
                className="mt-6 w-full flex items-center justify-center gap-3 rounded-full py-4 font-bold uppercase tracking-[0.18em] transition-colors hover:bg-white"
                style={{ background: '#F8F6F2', color: '#0A0A0A', fontFamily: 'var(--font-haas)', fontSize: '11px' }}
              >
                Améliorer mon score avec Alhambra
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ── SeoHero — exported component ─────────────────────────────────────────────
export function SeoHero() {
  const [auditOpen, setAuditOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {auditOpen && <AuditPanel onClose={() => setAuditOpen(false)} />}
      </AnimatePresence>

      <section
        className="relative overflow-hidden px-6 sm:px-10 lg:px-20 pt-28 pb-24 sm:pt-36 sm:pb-32"
        style={{ color: '#F8F6F2' }}
      >
        <HeroVideo />

        <div className="relative z-10 max-w-[1200px] mx-auto">
          <p style={{ letterSpacing: '0.45em', fontSize: '11px' }} className="uppercase text-white/30 font-bold mb-6">
            Alhambra Web · Agence de référencement Lyon
          </p>
          <h1
            className="font-nordique"
            style={{ fontSize: 'clamp(44px, 8vw, 112px)', lineHeight: 0.92, letterSpacing: '-0.03em', fontFamily: 'var(--font-nordique)' }}
          >
            Agence SEO<br />
            <span style={{ color: 'rgba(248,246,242,0.2)', fontStyle: 'italic' }}>Lyon</span>
          </h1>
          <p
            style={{ fontFamily: 'var(--font-haas)', fontSize: 'clamp(16px,2vw,20px)', color: 'rgba(248,246,242,0.55)', lineHeight: 1.65, maxWidth: '620px' }}
            className="mt-8 mb-10"
          >
            Nous positionnons vos pages en tête de Google grâce au référencement naturel.
            Audit technique, optimisation on-page, création de contenu, netlinking —
            une stratégie SEO complète et mesurable dès le premier mois.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={() => setAuditOpen(true)}
              style={{ background: '#F8F6F2', color: '#0A0A0A', fontFamily: 'var(--font-haas)' }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors cursor-pointer"
            >
              Audit SEO gratuit
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </button>
            <Link
              href="/"
              style={{ color: 'rgba(248,246,242,0.3)', fontFamily: 'var(--font-haas)', fontSize: '13px' }}
              className="hover:text-white/60 transition-colors tracking-wide"
            >
              ← Retour à l&apos;accueil
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-[480px]">
            {[['95+', 'Score Lighthouse'], ['4–6 mois', 'Premiers résultats'], ['Dès 400€', 'Audit SEO']].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(22px,3vw,34px)', color: '#F8F6F2' }}>{val}</div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-white/30 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
