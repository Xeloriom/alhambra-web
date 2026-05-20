'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef, useState } from 'react'
import { BarChart2, Brain, FileText, Bell, Puzzle, ShieldCheck, ArrowRight } from 'lucide-react'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 1, ease: EASE, delay },
})

const METRICS = [
  { label: 'Revenu MRR', value: '€847K', change: '+12.4%', pct: 78, color: '#2563EB' },
  { label: 'Churn Rate', value: '2.1%', change: '-0.3%', pct: 21, color: '#7C3AED' },
  { label: 'NPS Score', value: '72', change: '+8pts', pct: 72, color: '#2563EB' },
  { label: 'Nouveaux clients', value: '143', change: '+31%', pct: 55, color: '#7C3AED' },
]

const FEATURES = [
  { icon: BarChart2, title: 'Analytics temps réel', desc: 'Tableaux de bord live sur toutes vos métriques clés. Visualisations interactives et exports automatiques.' },
  { icon: Brain, title: 'Prédictions IA', desc: 'Anticipez churn, LTV et opportunités de croissance grâce à nos modèles entraînés sur vos données.' },
  { icon: FileText, title: 'Rapports automatiques', desc: 'Rapports PDF envoyés chaque lundi à votre équipe. Personnalisables selon vos KPIs prioritaires.' },
  { icon: Bell, title: 'Alertes intelligentes', desc: 'Notifications temps réel sur anomalies détectées. Seuils configurables par métrique et par équipe.' },
  { icon: Puzzle, title: '200+ intégrations', desc: 'Connecteurs natifs : Stripe, HubSpot, Salesforce, Notion, Slack et bien plus encore.' },
  { icon: ShieldCheck, title: 'Sécurité SOC2', desc: 'Certifié SOC2 Type II. Chiffrement AES-256. Vos données ne quittent jamais vos serveurs.' },
]

const PLANS = [
  { name: 'Starter', price: '49€', features: ['5 utilisateurs', 'Analytics 30j', '3 intégrations', 'Support email'] },
  { name: 'Pro', price: '199€', features: ['20 utilisateurs', 'Analytics illimitée', '50 intégrations', 'Alertes IA', 'Support prioritaire'], hot: true },
  { name: 'Enterprise', price: 'Sur devis', features: ['Illimité', 'Données illimitées', 'Custom API', 'SLA 99.9%', 'CSM dédié'] },
]

const LOGOS = ['Stripe', 'Figma', 'Notion', 'Linear', 'Vercel', 'GitHub']

export default function NexusPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activePlan, setActivePlan] = useState(1)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 28 })
  const dashY = useTransform(smooth, [0.05, 0.25], [40, -20])

  return (
    <div ref={containerRef} style={{ background: '#050A14', color: '#E2E8F0', fontFamily: 'var(--font-haas), sans-serif' }} className="antialiased overflow-x-hidden">

      {/* ── PRICE BANNER ── */}
      <div className="fixed top-0 left-0 right-0 z-[300]"
        style={{ height: '44px', background: 'linear-gradient(135deg,#0D0D0D 0%,#131313 50%,#0D0D0D 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="relative h-full flex items-center px-5 sm:px-10">
          <a href="/#work" className="hidden sm:flex items-center gap-2 group text-[9px] uppercase tracking-[0.3em] text-white/20 hover:text-white/50 transition-colors duration-300">
            <span className="inline-block group-hover:-translate-x-0.5 transition-transform duration-300">←</span>
            Alhambra
          </a>
          <div className="sm:absolute sm:left-1/2 sm:-translate-x-1/2 flex items-center gap-2 mr-auto sm:mr-0">
            <span className="w-[5px] h-[5px] rounded-full bg-emerald-400 flex-shrink-0" style={{ boxShadow: '0 0 8px rgba(52,211,153,0.7)' }} />
            <span className="text-[9px] uppercase tracking-[0.38em] text-white/30 font-medium">SaaS Analytics</span>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3 ml-auto">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[9px] text-white/15 hidden sm:block">dès</span>
              <span className="text-[12px] font-bold text-white/80 tabular-nums">1 390 €</span>
            </div>
            <div className="w-px h-3.5 bg-white/[0.08] hidden sm:block" />
            <a href="/#contact"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}
              className="px-3.5 py-[5px] rounded-full text-[8px] sm:text-[8.5px] uppercase tracking-[0.22em] text-white/45 hover:bg-white hover:text-black hover:border-transparent transition-all duration-300 font-semibold whitespace-nowrap leading-none">
              Obtenir ce design
            </a>
          </div>
        </div>
      </div>

      {/* ── NAV ── */}
      <nav className="fixed w-full z-[100] flex justify-between items-center px-6 sm:px-10 lg:px-16 py-4 sm:py-5"
        style={{ top: '44px', background: 'rgba(5,10,20,0.88)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <span style={{ fontFamily: 'var(--font-nordique)', color: '#2563EB', fontSize: 'clamp(16px,1.5vw,20px)', letterSpacing: '0.1em' }} className="font-bold uppercase">NEXUS</span>
        <div className="hidden md:flex gap-6 text-[11px] uppercase tracking-[0.2em] text-white/40">
          {['Produit', 'Tarifs', 'Documentation', 'Blog'].map(l => (
            <button key={l} className="hover:text-white/70 transition-colors">{l}</button>
          ))}
        </div>
        <div className="flex gap-3">
          <button style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#E2E8F0' }}
            className="text-[10px] uppercase tracking-[0.2em] px-4 sm:px-5 py-2 rounded-full hover:bg-white/5 transition-all hidden sm:block">
            Se connecter
          </button>
          <button style={{ background: '#2563EB' }}
            className="text-[10px] uppercase tracking-[0.2em] px-4 sm:px-5 py-2 rounded-full hover:opacity-90 transition-opacity text-white flex items-center gap-2">
            Essai gratuit
            <ArrowRight size={12} />
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-20 pt-28 sm:pt-32 pb-16 sm:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(37,99,235,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        </div>
        <div className="max-w-[900px]">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(37,99,235,0.4)', borderRadius: '100px', padding: '6px 16px', marginBottom: '32px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2563EB', display: 'inline-block' }} className="animate-pulse" />
            <span style={{ color: '#2563EB', fontSize: '11px', letterSpacing: '0.2em' }} className="uppercase">Bêta publique disponible</span>
          </motion.div>
          <div className="overflow-hidden mb-2">
            <motion.h1 initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.3, ease: EASE, delay: 0.1 }}
              style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(80px,14vw,200px)', lineHeight: 0.82, letterSpacing: '-0.04em' }}>
              Décisions
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-6">
            <motion.h1 initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.3, ease: EASE, delay: 0.18 }}
              style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(80px,14vw,200px)', lineHeight: 0.82, letterSpacing: '-0.04em', color: '#2563EB', fontStyle: 'italic', fontWeight: 300 }}>
              data-driven.
            </motion.h1>
          </div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="text-white/50 max-w-xl text-sm sm:text-base leading-[1.8] mb-10">
            Nexus agrège toutes vos métriques business en un tableau de bord intelligent. Analytics, prédictions IA et alertes temps réel — pour des décisions fondées sur des faits.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, ease: EASE }}
            className="flex flex-col sm:flex-row gap-3">
            <button style={{ background: '#2563EB' }}
              className="px-7 py-4 rounded-full text-sm font-bold uppercase tracking-[0.15em] hover:opacity-90 transition-opacity flex items-center justify-center gap-3">
              Démarrer gratuitement
              <ArrowRight size={16} />
            </button>
            <button style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              className="px-7 py-4 rounded-full text-sm text-white/60 hover:text-white hover:border-white/20 transition-all">
              Voir la démo →
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── LOGOS ── */}
      <section className="py-12 sm:py-16 px-6 border-y border-white/5">
        <p className="text-center text-[10px] uppercase tracking-[0.4em] text-white/20 mb-8">Utilisé par les équipes des meilleures startups</p>
        <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
          {LOGOS.map((logo, i) => (
            <motion.span key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 0.3 }} viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(14px,1.5vw,18px)', letterSpacing: '0.1em' }}
              className="uppercase hover:opacity-60 transition-opacity">
              {logo}
            </motion.span>
          ))}
        </div>
      </section>

      {/* ── DASHBOARD MOCKUP ── */}
      <section className="py-40 sm:py-60 px-6 sm:px-10 lg:px-16">
        <motion.div {...fade(0)} className="text-center mb-14">
          <h2 style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(28px,4vw,56px)', letterSpacing: '-0.03em' }} className="mb-4">
            Tout votre business, en un coup d'œil.
          </h2>
          <p className="text-white/40 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Un dashboard conçu pour la clarté. Chaque métrique au bon endroit, avec le contexte pour la comprendre.
          </p>
        </motion.div>
        <motion.div style={{ y: dashY }}
          initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 1.3, ease: EASE }}
          className="bg-[#0D1526] rounded-[20px] sm:rounded-[28px] border border-white/[0.07] p-5 sm:p-8 max-w-[1000px] mx-auto">
          <div className="flex items-center gap-2 mb-6 sm:mb-8">
            {['#FF5F57', '#FEBC2E', '#28C840'].map(c => (
              <div key={c} style={{ width: '11px', height: '11px', borderRadius: '50%', background: c }} />
            ))}
            <div style={{ flex: 1, height: '22px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', marginLeft: '8px' }} />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {METRICS.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08, ease: EASE }}
                className="rounded-[14px] sm:rounded-[16px] p-4 sm:p-5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-[10px] uppercase tracking-widest text-white/30 mb-2">{m.label}</div>
                <div style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(20px,2.5vw,32px)', color: '#E2E8F0' }}>{m.value}</div>
                <div style={{ color: m.change.startsWith('+') ? '#22C55E' : '#EF4444', fontSize: '11px' }} className="mt-1 font-bold">{m.change}</div>
                <div className="mt-3 h-1 rounded-full bg-white/5">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${m.pct}%` }} viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: EASE, delay: 0.3 + i * 0.1 }}
                    className="h-full rounded-full" style={{ background: m.color }} />
                </div>
              </motion.div>
            ))}
          </div>
          <div className="rounded-[14px] sm:rounded-[16px] overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=75" alt="Analytics chart"
              className="w-full h-36 sm:h-48 object-cover opacity-30"
              loading="lazy" decoding="async" />
          </div>
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-40 sm:py-60 px-6 sm:px-10 lg:px-16">
        <motion.h2 {...fade(0)} style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(28px,4vw,56px)', letterSpacing: '-0.03em' }} className="mb-14 sm:mb-20">
          Tout ce dont vous avez besoin.
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {FEATURES.map((f, i) => (
            <motion.div key={i} {...fade(i * 0.08)}
              className="p-7 sm:p-8 rounded-[20px] sm:rounded-[24px] border border-white/[0.07] hover:border-[#2563EB]/30 transition-colors group"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              <f.icon size={28} className="text-[#2563EB] mb-5 sm:mb-6 opacity-80 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
              <h3 style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(16px,1.5vw,20px)' }} className="mb-3">{f.title}</h3>
              <p className="text-white/40 text-sm leading-[1.8]">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-40 sm:py-60 px-6 sm:px-10 lg:px-16">
        <motion.div {...fade(0)} className="text-center mb-14 sm:mb-20">
          <h2 style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(28px,4vw,56px)', letterSpacing: '-0.03em' }} className="mb-4">
            Tarifs transparents.
          </h2>
          <p className="text-white/35 text-sm">Pas de frais cachés. Pas d'engagement. Changez de plan à tout moment.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-[1000px] mx-auto">
          {PLANS.map((plan, i) => (
            <motion.div key={i} {...fade(i * 0.1)}
              onClick={() => setActivePlan(i)}
              className={`relative rounded-[24px] sm:rounded-[28px] p-7 sm:p-8 cursor-pointer transition-all ${plan.hot ? 'border-[#2563EB]/60' : 'border-white/[0.07]'} border`}
              style={{ background: plan.hot ? 'rgba(37,99,235,0.08)' : 'rgba(255,255,255,0.02)' }}>
              {plan.hot && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#2563EB] rounded-full text-[9px] uppercase tracking-[0.2em] font-bold">
                  Populaire
                </span>
              )}
              <div className="text-[11px] uppercase tracking-[0.3em] text-white/40 mb-4">{plan.name}</div>
              <div style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(28px,3.5vw,44px)', lineHeight: 1 }} className="mb-1">
                {plan.price}
              </div>
              <div className="text-[11px] text-white/30 mb-8">/mois, facturé annuellement</div>
              <div className="space-y-3 mb-8">
                {plan.features.map((feat, j) => (
                  <div key={j} className="flex items-center gap-3 text-sm text-white/60">
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#2563EB', flexShrink: 0 }} />
                    {feat}
                  </div>
                ))}
              </div>
              <button style={{ background: plan.hot ? '#2563EB' : 'rgba(255,255,255,0.06)', border: plan.hot ? 'none' : '1px solid rgba(255,255,255,0.1)' }}
                className="w-full py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:opacity-80 transition-opacity">
                {plan.price === 'Sur devis' ? 'Nous contacter' : 'Commencer'}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-40 sm:py-60 px-6 sm:px-10 lg:px-16 text-center">
        <motion.h2 {...fade(0)} style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(36px,7vw,100px)', lineHeight: 0.88, letterSpacing: '-0.04em' }} className="mb-8 sm:mb-12">
          Vos données méritent<br /><span style={{ color: '#2563EB' }}>mieux.</span>
        </motion.h2>
        <motion.button {...fade(0.15)} style={{ background: '#2563EB' }}
          className="px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold text-sm uppercase tracking-[0.2em] hover:opacity-90 transition-opacity inline-flex items-center gap-3">
          Essayer Nexus gratuitement
          <ArrowRight size={16} />
        </motion.button>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 px-6 sm:px-10 lg:px-16 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
          <span style={{ fontFamily: 'var(--font-nordique)', color: '#2563EB', fontSize: '17px', letterSpacing: '0.1em' }} className="uppercase">NEXUS</span>
          <p className="text-[10px] text-white/20 tracking-[0.25em] uppercase">© 2026 Nexus Analytics · Tous droits réservés</p>
          <a href="/#work" className="group flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-white/25 hover:text-white transition-colors duration-300">
            <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">←</span>
            Alhambra Studio
          </a>
        </div>
      </footer>
    </div>
  )
}
