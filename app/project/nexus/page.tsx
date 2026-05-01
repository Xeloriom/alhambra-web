'use client'

import { motion } from 'framer-motion'
import { BarChart2, Brain, FileText, Bell, Puzzle, ShieldCheck } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1]
const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 1, ease: EASE, delay },
})

const metrics = [
  { label: 'Revenu MRR', value: '€847K', change: '+12.4%', w: '78%', color: '#2563EB' },
  { label: 'Churn Rate', value: '2.1%', change: '-0.3%', w: '21%', color: '#7C3AED' },
  { label: 'NPS Score', value: '72', change: '+8pts', w: '72%', color: '#2563EB' },
  { label: 'Nouveaux clients', value: '143', change: '+31%', w: '55%', color: '#7C3AED' },
]

const features = [
  { icon: BarChart2, title: 'Analytics temps réel', desc: 'Tableaux de bord live sur toutes vos métriques clés.' },
  { icon: Brain, title: 'Prédictions IA', desc: 'Anticipez churn, LTV et opportunités de croissance.' },
  { icon: FileText, title: 'Rapports auto', desc: 'Rapports PDF envoyés chaque lundi à votre équipe.' },
  { icon: Bell, title: 'Alertes smart', desc: 'Notifications intelligentes sur anomalies détectées.' },
  { icon: Puzzle, title: 'Intégrations', desc: '200+ connecteurs : Stripe, HubSpot, Salesforce, etc.' },
  { icon: ShieldCheck, title: 'Sécurité SOC2', desc: 'Certifié SOC2 Type II — vos données sont protégées.' },
]

const plans = [
  { name: 'Starter', price: '49€', per: '/mois', features: ['5 utilisateurs', 'Analytics 30 jours', '3 intégrations', 'Support email'], highlight: false },
  { name: 'Pro', price: '199€', per: '/mois', features: ['20 utilisateurs', 'Analytics illimitée', '50 intégrations', 'Alertes IA', 'Support prioritaire'], highlight: true },
  { name: 'Enterprise', price: 'Sur devis', per: '', features: ['Utilisateurs illimités', 'Données illimitées', 'Intégrations custom', 'SLA 99.9%', 'CSM dédié'], highlight: false },
]

export default function NexusPage() {
  return (
    <div style={{ background: '#050A14', color: '#E2E8F0', fontFamily: 'var(--font-haas), sans-serif' }} className="antialiased overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 md:px-16 py-5" style={{ background: 'rgba(5,10,20,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <span style={{ fontFamily: 'var(--font-nordique), serif', color: '#2563EB', fontSize: '20px', letterSpacing: '0.1em' }} className="font-bold uppercase">NEXUS</span>
        <div className="flex gap-4">
          <button style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#E2E8F0' }} className="text-xs uppercase tracking-[0.2em] px-5 py-2 rounded-full hover:bg-white/5 transition-all hidden md:block">
            Se connecter
          </button>
          <button style={{ background: '#2563EB', color: '#fff' }} className="text-xs uppercase tracking-[0.2em] px-5 py-2 rounded-full hover:opacity-90 transition-opacity">
            Démarrer
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center px-8 md:px-20 pt-28 pb-20">
        <motion.div {...fade(0)} style={{ display: 'inline-block', border: '1px solid rgba(37,99,235,0.4)', borderRadius: '100px', padding: '6px 16px', marginBottom: '32px', width: 'fit-content' }}>
          <span style={{ color: '#2563EB', fontSize: '11px', letterSpacing: '0.2em' }} className="uppercase">Nouvelle plateforme · Bêta disponible</span>
        </motion.div>
        <div className="overflow-hidden mb-2">
          <motion.h1 initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.3, ease: EASE, delay: 0.1 }}
            style={{ fontFamily: 'var(--font-nordique), serif', fontSize: 'clamp(56px,10vw,150px)', lineHeight: 0.85, letterSpacing: '-0.04em', color: '#E2E8F0' }}>
            Vos données.
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-8">
          <motion.h1 initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.3, ease: EASE, delay: 0.22 }}
            style={{ fontFamily: 'var(--font-nordique), serif', fontSize: 'clamp(56px,10vw,150px)', lineHeight: 0.85, letterSpacing: '-0.04em', color: '#E2E8F0' }}>
            Vos décisions.
          </motion.h1>
        </div>
        <motion.p {...fade(0.5)} style={{ color: '#64748B', maxWidth: '560px', lineHeight: 1.7, marginBottom: '40px', fontSize: '16px' }}>
          Nexus transforme vos données brutes en intelligence stratégique. En temps réel.
        </motion.p>
        <motion.div {...fade(0.6)} className="flex flex-wrap gap-4 mb-20">
          <button style={{ background: '#2563EB', color: '#fff', padding: '14px 32px', borderRadius: '100px', fontSize: '13px', letterSpacing: '0.1em' }} className="uppercase hover:opacity-90 transition-opacity">
            Démarrer gratuitement
          </button>
          <button style={{ border: '1px solid rgba(255,255,255,0.12)', color: '#E2E8F0', padding: '14px 32px', borderRadius: '100px', fontSize: '13px', letterSpacing: '0.1em' }} className="uppercase hover:bg-white/5 transition-all">
            Voir la démo
          </button>
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div {...fade(0.7)} style={{ background: '#0D1526', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px', maxWidth: '760px' }}>
          <div className="flex items-center gap-2 mb-6">
            {['#ef4444','#f59e0b','#22c55e'].map(c => (
              <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />
            ))}
            <span style={{ color: '#64748B', fontSize: '11px', marginLeft: '8px', letterSpacing: '0.1em' }}>nexus — dashboard</span>
          </div>
          <div className="space-y-5">
            {metrics.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.8 + i * 0.1 }}>
                <div className="flex justify-between items-center mb-2">
                  <span style={{ fontSize: '12px', color: '#64748B', letterSpacing: '0.05em' }}>{m.label}</span>
                  <div className="flex gap-4 items-center">
                    <span style={{ color: m.color, fontSize: '11px', fontWeight: 600 }}>{m.change}</span>
                    <span style={{ color: '#E2E8F0', fontSize: '14px', fontWeight: 700 }}>{m.value}</span>
                  </div>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                  <motion.div initial={{ width: 0 }} whileInView={{ width: m.w }} viewport={{ once: true }} transition={{ duration: 1.2, ease: EASE, delay: 1 + i * 0.12 }}
                    style={{ height: '100%', background: `linear-gradient(90deg, ${m.color}, ${m.color}88)`, borderRadius: '2px' }} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="py-24 md:py-40 px-8 md:px-20">
        <motion.h2 {...fade(0)} style={{ fontFamily: 'var(--font-nordique), serif', fontSize: 'clamp(32px,4vw,60px)', marginBottom: '56px', letterSpacing: '-0.02em' }}>
          Tout ce dont vous avez besoin.
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div key={i} {...fade(i * 0.08)} style={{ background: '#0D1526', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '28px' }}
              whileHover={{ borderColor: 'rgba(37,99,235,0.3)', background: '#0f1a2e' }} transition={{ duration: 0.3 }}>
              <f.icon size={24} style={{ color: '#2563EB', marginBottom: '16px' }} strokeWidth={1.5} />
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#E2E8F0' }}>{f.title}</h3>
              <p style={{ color: '#64748B', fontSize: '13px', lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section style={{ background: '#0D1526', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="py-24 px-8 md:px-20">
        <div className="flex flex-wrap justify-center gap-12 mb-16">
          {['Société Générale', 'L\'Oréal', 'BNP Paribas'].map(name => (
            <span key={name} style={{ color: '#64748B', fontSize: '16px', letterSpacing: '0.1em', fontWeight: 600 }} className="uppercase">{name}</span>
          ))}
        </div>
        <motion.blockquote {...fade(0)} className="max-w-[680px] mx-auto text-center">
          <p style={{ fontFamily: 'var(--font-nordique), serif', fontSize: 'clamp(20px,3vw,36px)', fontStyle: 'italic', lineHeight: 1.4, color: '#E2E8F0', marginBottom: '24px' }}>
            "Nexus a transformé notre façon d'analyser la croissance. On gagne 8 heures par semaine en reporting."
          </p>
          <p style={{ color: '#64748B', fontSize: '12px', letterSpacing: '0.2em' }} className="uppercase">Alexandre M. — CTO, L'Oréal Digital</p>
        </motion.blockquote>
      </section>

      {/* PRICING */}
      <section className="py-24 md:py-40 px-8 md:px-20">
        <motion.h2 {...fade(0)} style={{ fontFamily: 'var(--font-nordique), serif', fontSize: 'clamp(32px,4vw,60px)', marginBottom: '16px', letterSpacing: '-0.02em', textAlign: 'center' }}>
          Tarifs simples et transparents.
        </motion.h2>
        <motion.p {...fade(0.1)} style={{ color: '#64748B', textAlign: 'center', marginBottom: '56px', fontSize: '14px' }}>Sans engagement. Annulez quand vous voulez.</motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[960px] mx-auto">
          {plans.map((p, i) => (
            <motion.div key={i} {...fade(i * 0.1)} style={{
              background: p.highlight ? 'linear-gradient(135deg, #0D1526 0%, #0f1d3a 100%)' : '#0D1526',
              border: p.highlight ? '2px solid #2563EB' : '1px solid rgba(255,255,255,0.07)',
              borderRadius: '20px', padding: '36px',
            }}>
              {p.highlight && <div style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#2563EB', background: 'rgba(37,99,235,0.15)', padding: '4px 12px', borderRadius: '100px', display: 'inline-block', marginBottom: '16px' }} className="uppercase">Populaire</div>}
              <h3 style={{ fontSize: '14px', letterSpacing: '0.2em', color: '#64748B', marginBottom: '16px' }} className="uppercase">{p.name}</h3>
              <div style={{ marginBottom: '32px' }}>
                <span style={{ fontFamily: 'var(--font-nordique), serif', fontSize: 'clamp(32px,4vw,48px)', color: '#E2E8F0' }}>{p.price}</span>
                {p.per && <span style={{ color: '#64748B', fontSize: '14px' }}>{p.per}</span>}
              </div>
              <ul className="space-y-3 mb-8">
                {p.features.map(feat => (
                  <li key={feat} style={{ color: '#94A3B8', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: p.highlight ? '#2563EB' : '#64748B', flexShrink: 0 }} />
                    {feat}
                  </li>
                ))}
              </ul>
              <button style={{
                width: '100%', padding: '12px', borderRadius: '100px', fontSize: '12px', letterSpacing: '0.15em',
                background: p.highlight ? '#2563EB' : 'transparent',
                border: p.highlight ? 'none' : '1px solid rgba(255,255,255,0.12)',
                color: p.highlight ? '#fff' : '#E2E8F0',
              }} className="uppercase hover:opacity-80 transition-opacity">
                {p.name === 'Enterprise' ? 'Nous contacter' : 'Commencer'}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA FOOTER */}
      <section style={{ background: '#0D1526', borderTop: '1px solid rgba(255,255,255,0.05)' }} className="py-24 px-8 md:px-20 text-center">
        <motion.h2 {...fade(0)} style={{ fontFamily: 'var(--font-nordique), serif', fontSize: 'clamp(32px,5vw,72px)', marginBottom: '40px', letterSpacing: '-0.03em' }}>
          Rejoignez <span style={{ color: '#2563EB' }}>500+</span> équipes.
        </motion.h2>
        <motion.div {...fade(0.2)} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <input type="email" placeholder="votre@email.com"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#E2E8F0', borderRadius: '100px', padding: '14px 22px', flex: 1, outline: 'none', fontSize: '14px' }} />
          <button style={{ background: '#2563EB', color: '#fff', padding: '14px 28px', borderRadius: '100px', fontSize: '12px', letterSpacing: '0.15em', whiteSpace: 'nowrap' }} className="uppercase hover:opacity-90 transition-opacity">
            Démarrer
          </button>
        </motion.div>
        <p style={{ color: '#64748B', fontSize: '12px', marginTop: '48px' }}>© 2024 Nexus Analytics — Tous droits réservés</p>
      </section>
    </div>
  )
}
