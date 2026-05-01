'use client'

import { motion, useAnimationFrame, useMotionValue } from 'framer-motion'
import { useRef } from 'react'

const EASE = [0.16, 1, 0.3, 1]
const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 1.1, ease: EASE, delay },
})

const properties = [
  { addr: 'Avenue Foch, 16e', price: '3.2M€', type: 'Appartement de prestige', rooms: '7 pièces · 320m²' },
  { addr: 'Île Saint-Louis, 4e', price: '1.8M€', type: 'Hôtel particulier', rooms: '5 pièces · 180m²' },
  { addr: 'Place Vendôme, 1er', price: '5.5M€', type: 'Penthouse panoramique', rooms: '9 pièces · 480m²' },
]

const steps = [
  { n: '01', title: 'Consultation', desc: 'Entretien confidentiel pour cerner vos aspirations.' },
  { n: '02', title: 'Recherche exclusive', desc: 'Accès à notre portefeuille off-market et confidentiel.' },
  { n: '03', title: 'Visite privée', desc: 'Accompagnement personnalisé, à votre rythme.' },
  { n: '04', title: 'Signature', desc: 'Suivi juridique et notarial de A à Z.' },
]

function Marquee() {
  const x = useMotionValue(0)
  const ref = useRef<HTMLDivElement>(null)
  useAnimationFrame((_, delta) => {
    x.set(x.get() - delta * 0.06)
    if (ref.current) {
      const w = ref.current.scrollWidth / 2
      if (Math.abs(x.get()) >= w) x.set(0)
    }
  })
  const text = 'PARIS · NEUILLY · BOULOGNE · SAINT-GERMAIN · MARAIS · VERSAILLES · '
  const repeated = text.repeat(6)
  return (
    <div className="overflow-hidden border-t border-b py-4" style={{ borderColor: '#EBEBEB' }}>
      <motion.div ref={ref} style={{ x, whiteSpace: 'nowrap', display: 'inline-block' }}
        className="text-[10px] uppercase tracking-[0.4em] opacity-40" >
        {repeated}
      </motion.div>
    </div>
  )
}

export default function HavenPage() {
  return (
    <div style={{ background: '#F8F6F2', color: '#0A0A0A', fontFamily: 'var(--font-haas), sans-serif' }} className="antialiased overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 md:px-16 py-6" style={{ background: 'rgba(248,246,242,0.9)', backdropFilter: 'blur(12px)' }}>
        <span style={{ fontFamily: 'var(--font-nordique), serif', fontSize: '18px', letterSpacing: '0.15em' }} className="uppercase font-bold">
          Haven Prestige
        </span>
        <button style={{ background: '#0A0A0A', color: '#F8F6F2' }} className="text-xs uppercase tracking-[0.3em] px-6 py-2.5 rounded-full hover:opacity-80 transition-opacity">
          Prendre RDV
        </button>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-between pt-24 pb-0">
        <div className="px-8 md:px-20 flex-1 flex flex-col justify-center py-20">
          <motion.div {...fade(0.1)}>
            <h1 style={{ fontFamily: 'var(--font-nordique), serif', fontSize: 'clamp(72px,12vw,180px)', lineHeight: 0.85, letterSpacing: '-0.04em', fontWeight: 900 }}>
              VOTRE<br />PROCHAIN
            </h1>
            <p style={{ fontFamily: 'var(--font-nordique), serif', fontSize: 'clamp(36px,6vw,90px)', lineHeight: 0.9, fontStyle: 'italic', color: '#B8966A' }} className="mt-2">
              chef-d'œuvre.
            </p>
          </motion.div>
          <motion.div {...fade(0.35)} className="flex flex-wrap gap-12 mt-16">
            {[['180+', 'propriétés'], ['€2.4M', 'prix moyen'], ['12 ans', 'expertise']].map(([val, label]) => (
              <div key={label}>
                <p style={{ fontFamily: 'var(--font-nordique), serif', fontSize: 'clamp(28px,4vw,52px)', color: '#B8966A' }}>{val}</p>
                <p className="text-xs uppercase tracking-[0.3em] opacity-40 mt-1">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
        <Marquee />
      </section>

      {/* PROPERTIES GRID */}
      <section className="py-24 md:py-40 px-8 md:px-20">
        <motion.h2 {...fade(0)} style={{ fontFamily: 'var(--font-nordique), serif', fontSize: 'clamp(32px,4vw,56px)', letterSpacing: '-0.02em' }} className="mb-16">
          Propriétés en exclusivité
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p, i) => (
            <motion.div
              key={i}
              {...fade(i * 0.12)}
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{ background: '#0A0A0A', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer' }}
            >
              <div style={{ aspectRatio: '3/4', background: `linear-gradient(160deg, #1a1a1a 0%, #0f0f0f 60%, #${['1a1410', '101418', '14101a'][i]} 100%)`, position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 70%, rgba(184,150,106,0.12) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
                  <span style={{ background: '#B8966A', color: '#0A0A0A', fontSize: '9px', padding: '4px 10px', borderRadius: '20px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>
                    {p.type}
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-nordique), serif', color: '#F8F6F2', fontSize: 'clamp(20px,3vw,28px)', marginTop: '12px', lineHeight: 1.1 }}>{p.addr}</h3>
                  <p style={{ color: '#F8F6F2', opacity: 0.4, fontSize: '11px', marginTop: '6px', letterSpacing: '0.1em' }}>{p.rooms}</p>
                  <p style={{ fontFamily: 'var(--font-nordique), serif', color: '#B8966A', fontSize: 'clamp(22px,3vw,32px)', marginTop: '8px' }}>{p.price}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section style={{ background: '#FFFFFF' }} className="py-24 md:py-40 px-8 md:px-20">
        <motion.h2 {...fade(0)} style={{ fontFamily: 'var(--font-nordique), serif', fontSize: 'clamp(32px,4vw,56px)', letterSpacing: '-0.02em', marginBottom: '64px' }}>
          Notre approche
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              {...fade(i * 0.1)}
              style={{ borderLeft: i === 0 ? '1px solid #EBEBEB' : 'none', borderRight: '1px solid #EBEBEB', padding: '32px 32px' }}
            >
              <p style={{ fontFamily: 'var(--font-nordique), serif', color: '#B8966A', fontSize: '40px', lineHeight: 1, opacity: 0.6 }}>{s.n}</p>
              <h3 style={{ fontFamily: 'var(--font-nordique), serif', fontSize: '22px', marginTop: '24px', marginBottom: '12px' }}>{s.title}</h3>
              <p className="text-sm opacity-50 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CONTACT CTA */}
      <section style={{ background: '#0A0A0A', color: '#F8F6F2' }} className="py-24 md:py-40 px-8 md:px-20">
        <div className="max-w-[900px] mx-auto">
          <motion.h2 {...fade(0)} style={{ fontFamily: 'var(--font-nordique), serif', fontSize: 'clamp(48px,8vw,120px)', lineHeight: 0.88, letterSpacing: '-0.04em', marginBottom: '64px' }}>
            Discutons<br />de votre<br /><span style={{ color: '#B8966A', fontStyle: 'italic' }}>projet.</span>
          </motion.h2>
          <motion.div {...fade(0.2)} className="flex flex-col sm:flex-row gap-4 max-w-lg">
            <input
              type="email"
              placeholder="Votre adresse email"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#F8F6F2', borderRadius: '100px', padding: '16px 24px', flex: 1, outline: 'none', fontSize: '14px' }}
            />
            <button style={{ background: '#F8F6F2', color: '#0A0A0A', borderRadius: '100px', padding: '16px 28px', fontWeight: 700, fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}
              className="hover:bg-[#B8966A] hover:text-white transition-colors">
              Nous contacter
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
