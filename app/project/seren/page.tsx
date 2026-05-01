'use client'

import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]
const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 1.1, ease: EASE, delay },
})

const services = [
  { tag: 'Yoga Flow', tagColor: '#6B8F71', name: 'Vinyasa Flow', duration: '60 min · 35€', desc: 'Un enchaînement fluide de postures synchronisées avec le souffle. Tous niveaux.' },
  { tag: 'Méditation', tagColor: '#C4694F', name: 'Pleine conscience', duration: '45 min · 28€', desc: 'Techniques de respiration et visualisation pour apaiser le mental durablement.' },
  { tag: 'Pilates', tagColor: '#D4C5A9', name: 'Pilates reformer', duration: '55 min · 42€', desc: 'Renforcement en profondeur avec le reformer. Gainage, posture, équilibre.' },
  { tag: 'Balnéo', tagColor: '#1C1C1A', name: 'Balnéothérapie', duration: '90 min · 78€', desc: 'Immersion dans nos bains à jets chauds avec sels de la mer Morte et huiles essentielles.' },
]

export default function SerenPage() {
  return (
    <div style={{ background: '#FAF8F4', color: '#1C1C1A', fontFamily: 'var(--font-haas), sans-serif' }} className="antialiased overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 md:px-16 py-5" style={{ background: 'rgba(250,248,244,0.92)', backdropFilter: 'blur(12px)' }}>
        <span style={{ fontFamily: 'var(--font-nordique), serif', fontSize: '22px', fontStyle: 'italic', color: '#6B8F71', letterSpacing: '0.05em' }}>Seren</span>
        <button style={{ background: '#1C1C1A', color: '#FAF8F4', borderRadius: '100px', padding: '10px 24px', fontSize: '12px', letterSpacing: '0.15em' }} className="uppercase hover:opacity-80 transition-opacity">
          Réserver
        </button>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-20 px-8 text-center">
        {/* Breathing circle */}
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            width: 'min(500px, 70vw)', height: 'min(500px, 70vw)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(107,143,113,0.14) 0%, rgba(107,143,113,0.05) 50%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            width: 'min(360px, 50vw)', height: 'min(360px, 50vw)',
            borderRadius: '50%',
            border: '1px solid rgba(107,143,113,0.2)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 10 }}>
          {['TROUVER', 'SON', 'SOUFFLE.'].map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.h1
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1.4, ease: EASE, delay: 0.2 + i * 0.15 }}
                style={{
                  fontFamily: 'var(--font-nordique), serif',
                  fontSize: 'clamp(64px,12vw,170px)',
                  lineHeight: 0.85,
                  letterSpacing: '-0.04em',
                  color: '#1C1C1A',
                }}
              >
                {line}
              </motion.h1>
            </div>
          ))}
          <motion.p {...fade(0.8)} style={{ color: '#6B8F71', fontSize: '12px', letterSpacing: '0.3em', marginTop: '32px' }} className="uppercase">
            Studio de bien-être premium · Paris 8e · Depuis 2019
          </motion.p>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section style={{ background: '#FFFFFF' }} className="py-24 md:py-40 px-8 md:px-20">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-start">
          <motion.div {...fade(0)}>
            <h2 style={{ fontFamily: 'var(--font-nordique), serif', fontSize: 'clamp(36px,5vw,72px)', fontStyle: 'italic', lineHeight: 1.0, color: '#1C1C1A', letterSpacing: '-0.03em' }}>
              «&nbsp;Le vrai luxe<br />c'est d'avoir<br />le temps.&nbsp;»
            </h2>
          </motion.div>
          <motion.div {...fade(0.2)}>
            <p style={{ color: '#1C1C1A', opacity: 0.6, lineHeight: 1.8, fontSize: '15px', marginBottom: '48px' }}>
              Chez Seren, nous croyons que le bien-être véritable ne s'achète pas — il se cultive. Notre studio du 8e arrondissement est un sanctuaire conçu pour offrir aux Parisiens un espace de reconnexion totale : corps, souffle, et esprit. Chaque détail a été pensé pour ralentir le temps.
            </p>
            <div className="space-y-6">
              {[['2 400+', 'membres actifs'], ['12', 'instructeurs experts'], ['98%', 'de satisfaction']].map(([val, label]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '24px', paddingBottom: '16px', borderBottom: '1px solid #EBEBEB' }}>
                  <span style={{ fontFamily: 'var(--font-nordique), serif', fontSize: 'clamp(24px,3vw,40px)', color: '#6B8F71', flexShrink: 0, minWidth: '80px' }}>{val}</span>
                  <span style={{ color: '#1C1C1A', opacity: 0.5, fontSize: '13px', letterSpacing: '0.1em' }} className="uppercase">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 md:py-40 px-8 md:px-20">
        <motion.h2 {...fade(0)} style={{ fontFamily: 'var(--font-nordique), serif', fontSize: 'clamp(32px,4vw,60px)', marginBottom: '48px', letterSpacing: '-0.02em' }}>
          Nos pratiques
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s, i) => (
            <motion.div key={i} {...fade(i * 0.1)} style={{ background: '#FFFFFF', borderRadius: '24px', padding: '28px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
              <span style={{ background: s.tagColor, color: s.tagColor === '#D4C5A9' ? '#1C1C1A' : s.tagColor === '#1C1C1A' ? '#FAF8F4' : '#FAF8F4', fontSize: '9px', padding: '4px 12px', borderRadius: '100px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, display: 'inline-block', marginBottom: '20px' }}>
                {s.tag}
              </span>
              <h3 style={{ fontFamily: 'var(--font-nordique), serif', fontSize: '22px', marginBottom: '8px', color: '#1C1C1A', fontStyle: 'italic' }}>{s.name}</h3>
              <p style={{ color: '#6B8F71', fontSize: '11px', letterSpacing: '0.15em', marginBottom: '16px' }} className="uppercase">{s.duration}</p>
              <p style={{ color: '#1C1C1A', opacity: 0.5, fontSize: '13px', lineHeight: 1.7, marginBottom: '24px' }}>{s.desc}</p>
              <button style={{ color: '#6B8F71', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', borderBottom: '1px solid #6B8F71', paddingBottom: '2px' }}>
                Réserver →
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#1C1C1A', color: '#FAF8F4' }} className="py-24 md:py-40 px-8 md:px-20">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-center">
          <motion.div {...fade(0)}>
            <h2 style={{ fontFamily: 'var(--font-nordique), serif', fontSize: 'clamp(36px,5vw,80px)', lineHeight: 0.9, letterSpacing: '-0.03em' }}>
              Votre première séance<br />est <span style={{ color: '#6B8F71', fontStyle: 'italic' }}>offerte.</span>
            </h2>
          </motion.div>
          <motion.div {...fade(0.2)} className="space-y-4">
            <input type="text" placeholder="Votre prénom"
              style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#FAF8F4', borderRadius: '12px', padding: '14px 20px', outline: 'none', fontSize: '14px' }} />
            <input type="email" placeholder="Votre adresse email"
              style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#FAF8F4', borderRadius: '12px', padding: '14px 20px', outline: 'none', fontSize: '14px' }} />
            <button style={{ width: '100%', background: '#6B8F71', color: '#FAF8F4', borderRadius: '12px', padding: '16px', fontSize: '13px', letterSpacing: '0.2em', fontWeight: 600 }} className="uppercase hover:opacity-90 transition-opacity">
              Je réserve
            </button>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#FAF8F4', borderTop: '1px solid rgba(107,143,113,0.15)' }} className="py-16 px-8 text-center">
        <p style={{ fontFamily: 'var(--font-nordique), serif', fontStyle: 'italic', fontSize: '20px', color: '#6B8F71', marginBottom: '12px' }}>Seren Studio</p>
        <p style={{ color: '#1C1C1A', opacity: 0.4, fontSize: '13px', marginBottom: '6px' }}>32 Avenue Montaigne, Paris 8e</p>
        <p style={{ color: '#1C1C1A', opacity: 0.4, fontSize: '13px', marginBottom: '6px' }}>hello@seren-studio.fr · +33 1 47 23 88 00</p>
        <p style={{ color: '#1C1C1A', opacity: 0.4, fontSize: '12px', marginBottom: '20px' }}>Lun–Sam 7h–21h · Dim 9h–18h</p>
        <p style={{ color: '#1C1C1A', opacity: 0.2, fontSize: '11px', letterSpacing: '0.2em' }} className="uppercase">© 2024 Seren Studio Paris — Tous droits réservés</p>
      </footer>
    </div>
  )
}
