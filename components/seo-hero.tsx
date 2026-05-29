'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useContactPanel } from '@/components/contact-panel-context';
import { HeroVideo } from '@/components/hero-video';

const HLS_URL        = 'https://stream.mux.com/4IMYGcL01xjs7ek5ANO17JC4VQVUTsojZlnw4fXzwSxc.m3u8';
const AUDIT_ENDPOINT = 'https://www.alhambra-web.com/api/seo-audit.php';
const EASE: [number, number, number, number]       = [0.16, 1, 0.3, 1];
const EASE_SHARP: [number, number, number, number] = [0.76, 0, 0.24, 1];

// ── Types ─────────────────────────────────────────────────────────────────────
interface Check { pass: boolean; label: string; message: string; category: string }
interface Category { label: string; score: number; pass: number; total: number }
interface AuditResult {
  url: string; score: number; responseMs: number; htmlSizeKb: number; wordCount: number;
  checks: Record<string, Check>;
  categories: Category[];
}

// ── Score Ring ────────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? '#4ade80' : score >= 50 ? '#fbbf24' : '#f87171';
  const r = 42, circ = 2 * Math.PI * r;
  const label = score >= 80 ? 'Bon' : score >= 50 ? 'À améliorer' : 'Critique';
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6" />
          <motion.circle
            cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - (score / 100) * circ }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.1 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-white font-bold" style={{ fontFamily: 'var(--font-nordique)', fontSize: '28px', lineHeight: 1 }}>{score}</span>
          <span style={{ fontFamily: 'var(--font-haas)', fontSize: '9px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em' }}>/ 100</span>
        </div>
      </div>
      <span style={{ fontFamily: 'var(--font-haas)', fontSize: '11px', color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</span>
    </div>
  );
}

// ── Audit Panel ───────────────────────────────────────────────────────────────
function AuditPanel({ onClose, onContact }: { onClose: () => void; onContact: () => void }) {
  const [url,      setUrl]      = useState('');
  const [status,   setStatus]   = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [result,   setResult]   = useState<AuditResult | null>(null);
  const [errMsg,   setErrMsg]   = useState('');
  const [strategy, setStrategy] = useState<'mobile' | 'desktop'>('mobile');
  const [tab,      setTab]      = useState<string>('Technique');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const runAudit = useCallback(async (strat = strategy) => {
    let u = url.trim();
    if (!u) return;
    if (!u.startsWith('http')) u = 'https://' + u;
    setStatus('loading'); setResult(null); setErrMsg('');
    try {
      const res = await fetch(AUDIT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: u, strategy: strat }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setResult(data);
      setTab(data.categories?.[0]?.label ?? 'Technique');
      setStatus('done');
    } catch (e: unknown) {
      setErrMsg(e instanceof Error ? e.message : 'Erreur inconnue');
      setStatus('error');
    }
  }, [url, strategy]);

  const grouped = result
    ? Object.entries(result.checks).filter(([, c]) => c.category === tab)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(10px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ y: 64, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 64, opacity: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="w-full sm:max-w-[860px] rounded-t-3xl sm:rounded-3xl flex flex-col"
        style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.07)', maxHeight: '92vh' }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-haas)', fontSize: '10px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.3em' }} className="uppercase mb-1">Alhambra Web · Audit SEO</p>
            <h2 className="font-nordique text-white tracking-tighter" style={{ fontSize: 'clamp(22px,3vw,30px)', lineHeight: 1 }}>Audit SEO gratuit</h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Input */}
        <div className="px-6 py-4 flex-shrink-0">
          <div className="flex gap-2">
            <input
              ref={inputRef} type="text" value={url} placeholder="https://votre-site.com"
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && status !== 'loading' && runAudit()}
              className="flex-1 rounded-full px-5 py-3 text-white placeholder-white/20 outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-haas)', fontSize: '13px' }}
            />
            <button
              onClick={() => runAudit()} disabled={status === 'loading' || !url.trim()}
              className="px-6 py-3 rounded-full font-bold uppercase tracking-[0.15em] transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed flex-shrink-0 hover:bg-white"
              style={{ background: '#F8F6F2', color: '#0A0A0A', fontFamily: 'var(--font-haas)', fontSize: '11px' }}
            >
              {status === 'loading' ? '…' : 'Analyser'}
            </button>
          </div>
          <div className="flex gap-2 mt-3">
            {(['mobile', 'desktop'] as const).map(s => (
              <button key={s} onClick={() => { setStrategy(s); if (status === 'done') runAudit(s); }}
                className="px-4 py-[6px] rounded-full text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer"
                style={{ fontFamily: 'var(--font-haas)', background: strategy === s ? 'rgba(255,255,255,0.1)' : 'transparent', color: strategy === s ? '#fff' : 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.07)' }}
              >{s}</button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {status === 'loading' && (
          <div className="px-6 pb-8 flex flex-col items-center gap-3 flex-shrink-0">
            <div className="w-full h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div className="h-full rounded-full" style={{ background: '#F8F6F2' }} animate={{ x: ['-100%', '200%'] }} transition={{ repeat: Infinity, duration: 1.3, ease: 'linear' }} />
            </div>
            <p style={{ fontFamily: 'var(--font-haas)', fontSize: '12px', color: 'rgba(255,255,255,0.28)' }}>Analyse en cours — fetch + parsing HTML…</p>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="px-6 pb-6 flex-shrink-0">
            <div className="rounded-2xl px-4 py-3" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <p style={{ fontFamily: 'var(--font-haas)', fontSize: '13px', color: '#f87171' }}>{errMsg}</p>
            </div>
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {status === 'done' && result && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
              className="flex flex-col sm:flex-row overflow-hidden min-h-0 flex-1"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              {/* ── LEFT: score + catégories + CTA ── */}
              <div className="flex-shrink-0 sm:w-[220px] px-6 py-5 flex flex-col gap-5 sm:overflow-y-auto"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', borderRight: 'none' }}
              >
                <div className="hidden sm:block" style={{ borderRight: '1px solid rgba(255,255,255,0.06)', position: 'absolute', left: '220px', top: 0, bottom: 0 }} />

                {/* Score ring */}
                <ScoreRing score={result.score} />

                {/* Catégories */}
                <div className="flex flex-col gap-3">
                  {result.categories.map(c => (
                    <button key={c.label} onClick={() => setTab(c.label)} className="text-left cursor-pointer group">
                      <div className="flex items-center justify-between mb-[5px]">
                        <span style={{ fontFamily: 'var(--font-haas)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: tab === c.label ? '#fff' : 'rgba(255,255,255,0.35)' }}>{c.label}</span>
                        <span style={{ fontFamily: 'var(--font-haas)', fontSize: '10px', color: c.score >= 80 ? '#4ade80' : c.score >= 50 ? '#fbbf24' : '#f87171' }}>{c.pass}/{c.total}</span>
                      </div>
                      <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                        <motion.div className="h-full rounded-full" style={{ background: c.score >= 80 ? '#4ade80' : c.score >= 50 ? '#fbbf24' : '#f87171' }}
                          initial={{ width: 0 }} animate={{ width: `${c.score}%` }} transition={{ duration: 1, ease: EASE }} />
                      </div>
                    </button>
                  ))}
                  <div className="pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontFamily: 'var(--font-haas)', fontSize: '12px', fontWeight: 700, color: result.responseMs < 1000 ? '#4ade80' : result.responseMs < 3000 ? '#fbbf24' : '#f87171' }}>{result.responseMs}ms</span>
                    <span style={{ fontFamily: 'var(--font-haas)', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', display: 'block', textTransform: 'uppercase', marginTop: '2px' }}>Temps de réponse</span>
                  </div>
                </div>

                {/* CTA */}
                <button onClick={() => { onClose(); onContact(); }}
                  className="w-full flex items-center justify-center gap-2 rounded-full py-3 font-bold uppercase tracking-[0.15em] transition-colors hover:bg-white cursor-pointer mt-auto"
                  style={{ background: '#F8F6F2', color: '#0A0A0A', fontFamily: 'var(--font-haas)', fontSize: '10px' }}>
                  Corriger mon SEO
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                </button>
              </div>

              {/* ── RIGHT: checklist scrollable ── */}
              <div className="flex-1 overflow-y-auto px-5 py-5 min-h-0" style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ fontFamily: 'var(--font-haas)', fontSize: '9px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.3em', textTransform: 'uppercase' }} className="mb-3">
                  {tab} · {grouped.filter(([,c]) => c.pass).length}/{grouped.length} OK
                </p>
                <div className="space-y-[5px]">
                  {grouped.map(([id, check]) => (
                    <div key={id} className="flex items-start gap-3 rounded-xl px-3 py-[9px]"
                      style={{ background: check.pass ? 'rgba(74,222,128,0.04)' : 'rgba(248,113,113,0.04)', border: `1px solid ${check.pass ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)'}` }}>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-[1px] ${check.pass ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                        {check.pass
                          ? <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                          : <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        }
                      </div>
                      <div className="min-w-0">
                        <p style={{ fontFamily: 'var(--font-haas)', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>{check.label}</p>
                        <p style={{ fontFamily: 'var(--font-haas)', fontSize: '11px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>{check.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ── SeoHero ───────────────────────────────────────────────────────────────────
export function SeoHero() {
  const [auditOpen, setAuditOpen] = useState(false);
  const { openPanel } = useContactPanel();
  return (
    <>
      <AnimatePresence>{auditOpen && <AuditPanel onClose={() => setAuditOpen(false)} onContact={openPanel} />}</AnimatePresence>
      <section className="relative overflow-hidden px-6 sm:px-10 lg:px-20 pt-28 pb-24 sm:pt-36 sm:pb-32" style={{ color: '#F8F6F2' }}>
        <HeroVideo url={HLS_URL} />
        <div className="relative z-10 max-w-[1200px] mx-auto">
          <p style={{ letterSpacing: '0.45em', fontSize: '11px' }} className="uppercase text-white/30 font-bold mb-6">
            Alhambra Web · Agence de référencement Lyon
          </p>
          <h1 className="font-nordique" style={{ fontSize: 'clamp(44px, 8vw, 112px)', lineHeight: 0.92, letterSpacing: '-0.03em', fontFamily: 'var(--font-nordique)' }}>
            Agence SEO<br />
            <span style={{ color: 'rgba(248,246,242,0.2)', fontStyle: 'italic' }}>Lyon</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-haas)', fontSize: 'clamp(16px,2vw,20px)', color: 'rgba(248,246,242,0.55)', lineHeight: 1.65, maxWidth: '620px' }} className="mt-8 mb-10">
            Nous positionnons vos pages en tête de Google grâce au référencement naturel.
            Audit technique, optimisation on-page, création de contenu, netlinking —
            une stratégie SEO complète et mesurable dès le premier mois.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <button onClick={() => setAuditOpen(true)}
              style={{ background: '#F8F6F2', color: '#0A0A0A', fontFamily: 'var(--font-haas)' }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors cursor-pointer">
              Audit SEO gratuit
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
            </button>
            <Link href="/" style={{ color: 'rgba(248,246,242,0.3)', fontFamily: 'var(--font-haas)', fontSize: '13px' }} className="hover:text-white/60 transition-colors tracking-wide">
              ← Retour à l&apos;accueil
            </Link>
          </div>
          <div className="mt-10 sm:mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-[480px]">
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
