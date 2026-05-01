'use client'

import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 1.2, ease: EASE, delay },
})

const fragrances = [
  { num: '01', name: 'Nuit Éternelle', cat: 'Floral Oriental' },
  { num: '02', name: 'Rose Sauvage', cat: 'Chypré Floral' },
  { num: '03', name: 'Bois Sacré', cat: 'Boisé Ambré' },
]

export default function LumierePage() {
  return (
    <div style={{ background: '#0A0608', color: '#F5EFE6', fontFamily: 'var(--font-haas), sans-serif' }} className="antialiased overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 md:px-16 py-6">
        <span style={{ fontFamily: 'var(--font-nordique), serif', color: '#C9A96E', fontSize: 'clamp(18px,2vw,24px)' }} className="italic font-bold tracking-widest">
          Lumière
        </span>
        <button style={{ border: '1px solid #C9A96E', color: '#C9A96E' }} className="text-xs uppercase tracking-[0.3em] px-6 py-2.5 rounded-full hover:bg-[#C9A96E] hover:text-[#0A0608] transition-all duration-500">
          Découvrir
        </button>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 text-center">
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: '700px', height: '700px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,169,110,0.18) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{ color: '#C9A96E', fontFamily: 'var(--font-haas), sans-serif' }}
          className="text-[10px] uppercase tracking-[0.5em] mb-12 opacity-60"
        >
          Parfumerie de Luxe · Paris · Est. 1924
        </motion.div>

        {['L\'ART', 'DE', 'L\'INVISIBLE'].map((line, i) => (
          <div key={i} className="overflow-hidden">
            <motion.h1
              initial={{ y: '110%', rotate: 2 }}
              animate={{ y: 0, rotate: 0 }}
              transition={{ duration: 1.4, ease: EASE, delay: 0.2 + i * 0.18 }}
              style={{
                fontFamily: 'var(--font-nordique), serif',
                fontSize: 'clamp(72px, 14vw, 200px)',
                color: '#C9A96E',
                lineHeight: 0.88,
                fontStyle: 'italic',
                letterSpacing: '-0.04em',
              }}
            >
              {line}
            </motion.h1>
          </div>
        ))}

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: EASE, delay: 0.9 }}
          style={{ width: '1px', height: '80px', background: '#C9A96E', margin: '48px auto 0', transformOrigin: 'top' }}
        />
      </section>

      {/* THREE SIGNATURES */}
      <section className="py-24 md:py-40 px-8 md:px-20 max-w-[1400px] mx-auto">
        {fragrances.map((f, i) => (
          <motion.div
            key={i}
            {...fade(i * 0.15)}
            className={`flex ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center gap-8 md:gap-20 py-12 md:py-20 border-b`}
            style={{ borderColor: 'rgba(201,169,110,0.15)' }}
          >
            <span style={{ color: '#C9A96E', fontFamily: 'var(--font-nordique), serif', fontSize: 'clamp(60px,8vw,120px)', lineHeight: 1, opacity: 0.4, flexShrink: 0 }}>
              {f.num}
            </span>
            <div className="flex-1 min-w-0">
              <h2 style={{ fontFamily: 'var(--font-nordique), serif', fontSize: 'clamp(32px,5vw,72px)', color: '#F5EFE6', fontStyle: 'italic' }}>
                {f.name}
              </h2>
              <p style={{ color: '#C9A96E' }} className="text-xs uppercase tracking-[0.4em] mt-3 opacity-60">{f.cat}</p>
            </div>
            <div className="hidden md:block flex-1">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: EASE, delay: 0.3 }}
                style={{ height: '1px', background: 'rgba(201,169,110,0.4)', transformOrigin: i % 2 === 0 ? 'left' : 'right' }}
              />
            </div>
          </motion.div>
        ))}
      </section>

      {/* MAISON */}
      <section style={{ background: '#F5EFE6', color: '#0A0608' }} className="py-24 md:py-40 px-8 md:px-20">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-center">
          <motion.div {...fade(0)}>
            <h2 style={{ fontFamily: 'var(--font-nordique), serif', fontSize: 'clamp(40px,6vw,96px)', lineHeight: 0.92, fontStyle: 'italic', letterSpacing: '-0.03em' }}>
              Chaque flacon<br />est une œuvre.
            </h2>
          </motion.div>
          <motion.div {...fade(0.2)} className="space-y-8">
            <p className="text-base leading-relaxed opacity-60" style={{ fontFamily: 'var(--font-haas), sans-serif' }}>
              Fondée en 1924 par Henri Blanc dans le cœur du Marais, la Maison Lumière perpétue l'art de la parfumerie d'exception. Chaque fragrance est le fruit d'une quête obsessionnelle des matières premières les plus rares — résines d'Arabie, roses de Grasse, bois de oud du Cambodge.
            </p>
            <p className="text-sm leading-relaxed opacity-40">
              Nos maîtres parfumeurs composent avec une liberté totale, sans compromis. Une création peut naître en quelques heures comme en plusieurs années. Le temps n'a ici aucune valeur marchande.
            </p>
            <button style={{ background: '#0A0608', color: '#F5EFE6', fontFamily: 'var(--font-haas), sans-serif' }} className="text-xs uppercase tracking-[0.3em] px-8 py-3.5 rounded-full mt-4 hover:opacity-80 transition-opacity">
              Découvrir la Maison
            </button>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0A0608', color: '#F5EFE6', borderTop: '1px solid rgba(201,169,110,0.1)' }} className="py-20 px-8 text-center">
        <p style={{ fontFamily: 'var(--font-nordique), serif', color: '#C9A96E', fontSize: '20px', fontStyle: 'italic' }} className="mb-6">
          Lumière Parfums Paris
        </p>
        <p className="text-xs opacity-40 tracking-[0.3em] uppercase mb-4">contact@lumiere-parfums.fr</p>
        <div className="flex justify-center gap-8 text-xs uppercase tracking-widest opacity-30 mb-6">
          <span>Instagram</span>
          <span>·</span>
          <span>Pinterest</span>
          <span>·</span>
          <span>Journal</span>
        </div>
        <p className="text-xs opacity-20">© 2024 Lumière Parfums Paris — Tous droits réservés</p>
      </footer>
    </div>
  )
}
