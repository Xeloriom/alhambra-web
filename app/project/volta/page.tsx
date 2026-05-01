'use client'

import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]
const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 1.1, ease: EASE, delay },
})

const specs = [
  { val: '2.4s', label: '0 — 100 km/h', unit: 'Accélération' },
  { val: '650km', label: "Autonomie WLTP", unit: 'Portée' },
  { val: '450ch', label: 'Puissance totale', unit: 'Performance' },
  { val: '22min', label: 'Charge 10→80%', unit: 'Rapidité' },
]

export default function VoltaPage() {
  return (
    <div style={{ background: '#060606', color: '#FFFFFF', fontFamily: 'var(--font-haas), sans-serif' }} className="antialiased overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 md:px-16 py-6">
        <span style={{ fontFamily: 'var(--font-nordique), serif', fontSize: '22px', letterSpacing: '0.3em', color: '#00D4AA' }} className="font-black uppercase">VOLTA</span>
        <div className="hidden md:flex gap-8 text-xs uppercase tracking-[0.2em] opacity-50">
          {['Modèles', 'Technologie', 'Commander'].map(l => (
            <button key={l} className="hover:opacity-100 transition-opacity">{l}</button>
          ))}
        </div>
        <button style={{ background: '#00D4AA', color: '#060606', borderRadius: '100px', padding: '10px 24px', fontSize: '12px', letterSpacing: '0.15em' }} className="uppercase font-bold hover:opacity-90 transition-opacity">
          Configurer
        </button>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden px-8 text-center pt-20">
        {/* Teal bottom glow */}
        <div style={{
          position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '900px', height: '400px',
          background: 'radial-gradient(ellipse at center bottom, rgba(0,212,170,0.2) 0%, transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />

        {/* Car silhouette */}
        <motion.div
          initial={{ x: '120%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.8, ease: EASE, delay: 0.4 }}
          style={{ position: 'absolute', bottom: '120px', left: '50%', transform: 'translateX(-50%)', width: 'min(800px, 90vw)' }}
        >
          {/* Car body */}
          <div style={{ position: 'relative', height: '120px' }}>
            {/* Main body */}
            <div style={{
              position: 'absolute', bottom: '30px', left: '5%', right: '5%', height: '60px',
              background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)',
              borderRadius: '60px 60px 16px 16px',
              boxShadow: '0 0 60px rgba(0,212,170,0.25), 0 20px 40px rgba(0,0,0,0.8)',
            }} />
            {/* Cabin */}
            <div style={{
              position: 'absolute', bottom: '80px', left: '25%', right: '30%', height: '55px',
              background: 'linear-gradient(180deg, #141414 0%, #1a1a1a 100%)',
              borderRadius: '30px 30px 0 0',
              boxShadow: '0 0 30px rgba(0,212,170,0.1)',
            }} />
            {/* Headlights */}
            <div style={{ position: 'absolute', bottom: '47px', left: '6%', width: '28px', height: '8px', background: '#fff', borderRadius: '4px', boxShadow: '0 0 20px #fff, 0 0 40px rgba(255,255,255,0.5)', opacity: 0.9 }} />
            <div style={{ position: 'absolute', bottom: '47px', right: '6%', width: '28px', height: '8px', background: '#00D4AA', borderRadius: '4px', boxShadow: '0 0 20px #00D4AA, 0 0 40px rgba(0,212,170,0.6)' }} />
            {/* Wheels */}
            {[20, 70].map((left, i) => (
              <div key={i} style={{ position: 'absolute', bottom: 0, left: `${left}%`, transform: 'translateX(-50%)', width: '70px', height: '70px', borderRadius: '50%', background: '#111', border: '3px solid #333', boxShadow: '0 0 20px rgba(0,212,170,0.15)' }} />
            ))}
            {/* Ground glow */}
            <div style={{ position: 'absolute', bottom: '-10px', left: '10%', right: '10%', height: '20px', background: 'rgba(0,212,170,0.15)', filter: 'blur(12px)', borderRadius: '50%' }} />
          </div>
        </motion.div>

        <div style={{ position: 'relative', zIndex: 10, paddingBottom: '200px' }}>
          {['L\'AVENIR', 'NE', 'CONDUIT'].map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.h1
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1.4, ease: EASE, delay: 0.15 + i * 0.15 }}
                style={{
                  fontFamily: 'var(--font-nordique), serif',
                  fontSize: 'clamp(72px, 15vw, 220px)',
                  lineHeight: 0.82,
                  letterSpacing: '-0.04em',
                  fontWeight: 900,
                  color: line === 'CONDUIT' ? '#00D4AA' : '#FFFFFF',
                }}
              >
                {line}
              </motion.h1>
            </div>
          ))}
          <motion.p {...fade(0.8)} style={{ color: '#C0C0C0', fontSize: '13px', letterSpacing: '0.25em', marginTop: '32px' }} className="uppercase">
            0–100 km/h en 2.4s · 650 km d'autonomie · Zéro émission
          </motion.p>
        </div>
      </section>

      {/* SPECS */}
      <section style={{ background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.05)' }} className="py-24 md:py-40 px-8 md:px-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1200px] mx-auto">
          {specs.map((s, i) => (
            <motion.div key={i} {...fade(i * 0.1)} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '32px 24px' }}>
              <div style={{ width: '32px', height: '2px', background: '#00D4AA', marginBottom: '20px' }} />
              <p style={{ fontFamily: 'var(--font-nordique), serif', fontSize: 'clamp(36px,5vw,64px)', color: '#FFFFFF', lineHeight: 1, letterSpacing: '-0.02em' }}>{s.val}</p>
              <p style={{ color: '#00D4AA', fontSize: '10px', letterSpacing: '0.25em', marginTop: '12px' }} className="uppercase">{s.unit}</p>
              <p style={{ color: '#C0C0C0', fontSize: '12px', marginTop: '6px', opacity: 0.6 }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ALTERNATING FEATURES */}
      <section className="py-24 md:py-40 px-8 md:px-20 max-w-[1200px] mx-auto space-y-0">
        {[
          { title: 'AÉRODYNAMIQUE', sub: 'Design', body: "La carrosserie de la Volta a été sculptée par 14 mois de simulation numérique et 600 heures en soufflerie. Un Cx de 0.19 — le plus bas jamais atteint sur une berline de série. Chaque courbe réduit la traînée et augmente l'autonomie.", side: 'left' },
          { title: 'INTELLIGENCE ARTIFICIELLE', sub: 'Technologie', body: "Nexus Drive, notre système d'autopilotage de niveau 3, analyse 12 millions de données par seconde. Caméras 360°, lidar à longue portée, radar millimétrique. La Volta anticipe. Elle ne réagit plus — elle prévoit.", side: 'right' },
        ].map((f, i) => (
          <motion.div key={i} {...fade(0)} className={`flex flex-col ${f.side === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} gap-16 md:gap-24 items-center py-20 border-b`} style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <div className="flex-1">
              <p style={{ color: '#00D4AA', fontSize: '10px', letterSpacing: '0.4em', marginBottom: '16px' }} className="uppercase">{f.sub}</p>
              <h2 style={{ fontFamily: 'var(--font-nordique), serif', fontSize: 'clamp(32px,5vw,72px)', lineHeight: 0.9, letterSpacing: '-0.03em', marginBottom: '24px' }}>{f.title}</h2>
              <p style={{ color: '#C0C0C0', lineHeight: 1.8, fontSize: '15px', maxWidth: '480px' }}>{f.body}</p>
            </div>
            <div className="flex-1 w-full">
              <div style={{
                aspectRatio: '16/9', borderRadius: '16px',
                background: `linear-gradient(135deg, #0d1a15 0%, #0a0a0a 50%, #00D4AA${i === 0 ? '0d' : '08'} 100%)`,
                border: '1px solid rgba(0,212,170,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: '60px', height: '60px', border: '1px solid rgba(0,212,170,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '20px', height: '20px', background: '#00D4AA', borderRadius: '50%', opacity: 0.6 }} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* CTA */}
      <section style={{ background: '#060606', borderTop: '1px solid rgba(0,212,170,0.1)' }} className="py-24 md:py-40 px-8 text-center">
        <motion.h2 {...fade(0)} style={{ fontFamily: 'var(--font-nordique), serif', fontSize: 'clamp(40px,7vw,100px)', lineHeight: 0.88, letterSpacing: '-0.04em', marginBottom: '16px' }}>
          Configurez<br />votre Volta.
        </motion.h2>
        <motion.p {...fade(0.15)} style={{ color: '#C0C0C0', fontSize: '13px', letterSpacing: '0.2em', marginBottom: '48px' }} className="uppercase">
          À partir de 89 900€
        </motion.p>
        <motion.button {...fade(0.25)} style={{ background: '#00D4AA', color: '#060606', padding: '18px 48px', borderRadius: '100px', fontSize: '13px', letterSpacing: '0.2em', fontWeight: 700 }} className="uppercase hover:opacity-90 transition-opacity">
          Commander maintenant
        </motion.button>
        <motion.p {...fade(0.35)} style={{ color: 'rgba(255,255,255,0.15)', fontSize: '11px', marginTop: '48px', letterSpacing: '0.15em' }} className="uppercase">
          © 2024 Volta Motors — Fabriqué en France
        </motion.p>
      </section>
    </div>
  )
}
