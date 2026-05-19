'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 1.1, ease: EASE, delay },
})

const COLLECTION = [
  { name: 'Nuit de Grasse', note: 'Rose · Jasmin · Musc blanc', ml: '50ml', price: '320€', img: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&q=80' },
  { name: 'Aurore Dorée', note: 'Bergamote · Ambre · Santal', ml: '100ml', price: '480€', img: 'https://images.unsplash.com/photo-1590156563570-4eda2b37af68?w=600&q=80' },
  { name: 'Velours Noir', note: 'Oud · Iris · Cuir tanné', ml: '75ml', price: '550€', img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80' },
  { name: 'Matin Blanc', note: 'Fleur de coton · Sel · Vétiver', ml: '50ml', price: '280€', img: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&q=80' },
]

const INGREDIENTS = ['Rose de Damas', 'Jasmin de Grasse', 'Ambre gris', 'Oud précieux', 'Vétiver d\'Haïti', 'Iris de Florence']

export default function LumierePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 28 })
  const heroScale = useTransform(smooth, [0, 0.25], [1, 1.07])
  const heroY = useTransform(smooth, [0, 0.3], [0, -60])

  return (
    <div ref={containerRef} className="bg-[#FAF9F6] text-[#1a1a1a] overflow-x-hidden antialiased"
      style={{ fontFamily: 'var(--font-haas), sans-serif' }}>

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
            <span className="text-[9px] uppercase tracking-[0.38em] text-white/30 font-medium">Parfumerie Luxe</span>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3 ml-auto">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[9px] text-white/15 hidden sm:block">dès</span>
              <span className="text-[12px] font-bold text-white/80 tabular-nums">990 €</span>
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
      <nav className="fixed w-full z-[100] flex justify-between items-center px-6 sm:px-10 lg:px-16 py-6 mix-blend-difference"
        style={{ top: '44px' }}>
        <span className="text-white font-bold tracking-[0.3em] text-[13px] sm:text-[15px] uppercase"
          style={{ fontFamily: 'var(--font-nordique)' }}>Lumière</span>
        <div className="flex items-center gap-6 sm:gap-10">
          <div className="hidden md:flex gap-8 text-[10px] uppercase tracking-[0.3em] text-white/60">
            {['Collections', 'Maison', 'Boutiques'].map(l => (
              <button key={l} className="hover:text-white transition-colors">{l}</button>
            ))}
          </div>
          <button className="text-[10px] uppercase tracking-[0.3em] text-white/60 hover:text-white transition-colors">
            Panier (0)
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative h-screen w-full overflow-hidden bg-[#D4C8C0]">
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1541643600914-78b084683702?w=1800&q=85"
            alt="Lumière Parfums" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#1a1a1a]/20" />
        </motion.div>
        <motion.div style={{ y: heroY }}
          className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-6">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.6, duration: 1 }}
            className="block text-[9px] sm:text-[10px] tracking-[1em] uppercase font-bold mb-8">
            Paris — Grasse — Dubaï
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, ease: EASE, delay: 0.8 }}
            style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(80px,18vw,220px)', fontStyle: 'italic', lineHeight: 0.82, letterSpacing: '-0.03em', fontWeight: 400 }}>
            Lumière
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
            transition={{ delay: 1.3, duration: 1 }}
            className="text-[10px] sm:text-[11px] tracking-[0.5em] uppercase mt-8 font-bold">
            Maison de Parfumerie Française
          </motion.p>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-[8px] tracking-[0.4em] uppercase text-white/30">Explorer</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
            className="w-[1px] h-10 bg-white/20" />
        </motion.div>
      </section>

      {/* ── INTRO ── */}
      <section className="py-40 sm:py-60 px-6 sm:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
          <div className="lg:col-span-7">
            <motion.span {...fade(0)} className="block text-[10px] tracking-[0.5em] uppercase text-[#1a1a1a]/30 font-bold mb-10">
              La Maison
            </motion.span>
            <motion.h2 {...fade(0.1)}
              style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(30px,5vw,72px)', lineHeight: 1.05, fontWeight: 400, fontStyle: 'italic' }}
              className="mb-8">
              Depuis 1924, l'art du sillage<br />
              <span className="not-italic font-bold" style={{ fontFamily: 'var(--font-nordique)' }}>élevé au rang du sublime.</span>
            </motion.h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <motion.p {...fade(0.2)} className="text-[#1a1a1a]/50 leading-[1.9] text-sm sm:text-base">
              Née dans les champs de fleurs de Grasse, Lumière puise dans un siècle de savoir-faire pour créer des fragrances d'exception. Chaque flacon est une œuvre d'art ; chaque goutte, un voyage sensoriel unique.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── COLLECTION ── */}
      <section className="py-40 sm:py-60 px-6 sm:px-10 lg:px-16">
        <motion.div {...fade(0)} className="flex justify-between items-end mb-12 sm:mb-16">
          <h2 style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(24px,3.5vw,48px)', letterSpacing: '-0.02em' }}>
            Collection 2026
          </h2>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#1a1a1a]/30 hidden sm:block">4 créations exclusives</span>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {COLLECTION.map((item, i) => (
            <motion.div key={i} {...fade(i * 0.1)} className="group cursor-pointer">
              <div className="aspect-[3/4] rounded-[16px] sm:rounded-[20px] overflow-hidden bg-[#EBEBEB] mb-4 sm:mb-5">
                <img src={item.img} alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-108" />
              </div>
              <div className="px-1">
                <div className="text-[9px] sm:text-[10px] tracking-widest uppercase text-[#1a1a1a]/30 mb-1">{item.note}</div>
                <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(14px,1.4vw,18px)' }} className="mb-1">{item.name}</div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-[#1a1a1a]/40">{item.ml}</span>
                  <span style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(14px,1.4vw,18px)' }}>{item.price}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SAVOIR-FAIRE ── */}
      <section className="py-40 sm:py-60 px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div {...fade(0)}>
            <span className="block text-[10px] tracking-[0.5em] uppercase text-[#1a1a1a]/30 font-bold mb-10">Savoir-faire</span>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px,4vw,56px)', fontStyle: 'italic', fontWeight: 400, lineHeight: 1.1 }} className="mb-8">
              La rigueur de<br />l'artisanat français.
            </h2>
            <p className="text-[#1a1a1a]/50 leading-[1.9] text-sm sm:text-base mb-10">
              Nos nez travaillent en étroite collaboration avec les producteurs de Grasse pour sélectionner uniquement les matières premières les plus nobles. De la récolte à la distillation, chaque étape est contrôlée avec une précision absolue.
            </p>
            <div className="flex flex-wrap gap-3">
              {INGREDIENTS.map((ing, i) => (
                <motion.span key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.5, ease: EASE }}
                  className="px-4 py-2 border border-[#1a1a1a]/10 rounded-full text-[10px] sm:text-[11px] tracking-[0.15em] uppercase text-[#1a1a1a]/50 hover:border-[#1a1a1a]/40 transition-colors">
                  {ing}
                </motion.span>
              ))}
            </div>
          </motion.div>
          <motion.div {...fade(0.15)} className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] rounded-[20px] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1594938298603-e8d9bcc7e9a1?w=600&q=80"
                alt="Atelier parfum" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-[3/4] rounded-[20px] overflow-hidden mt-10">
              <img src="https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80"
                alt="Fleurs de Grasse" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FULL BLEED ── */}
      <section className="relative h-[60vh] sm:h-[80vh] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1800&q=85"
          alt="Lumière atelier" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#1a1a1a]/50 flex items-center justify-center">
          <motion.blockquote {...fade(0)}
            style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(20px,4vw,56px)', color: '#FAF9F6', fontStyle: 'italic', textAlign: 'center', maxWidth: '800px', padding: '0 24px', lineHeight: 1.3, fontWeight: 400 }}>
            « Un parfum, c'est la mémoire<br />de ceux qu'on n'a pas encore rencontrés. »
          </motion.blockquote>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="py-40 sm:py-60 px-6 sm:px-10 lg:px-16 bg-[#1a1a1a] text-[#FAF9F6]">
        <div className="max-w-[700px] mx-auto text-center">
          <motion.span {...fade(0)} className="block text-[10px] tracking-[0.5em] uppercase text-[#FAF9F6]/30 font-bold mb-8">
            Rejoindre la Maison
          </motion.span>
          <motion.h2 {...fade(0.1)}
            style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px,6vw,80px)', fontStyle: 'italic', fontWeight: 400, lineHeight: 0.9 }}
            className="mb-12">
            L'essence de Lumière,<br />livrée chez vous.
          </motion.h2>
          <motion.div {...fade(0.2)} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
            <input type="email" placeholder="Votre email"
              className="flex-1 px-6 py-4 rounded-full text-sm outline-none text-[#1a1a1a]"
              style={{ background: 'rgba(255,255,255,0.9)', border: 'none' }} />
            <button className="px-6 py-4 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] whitespace-nowrap transition-colors"
              style={{ background: '#FAF9F6', color: '#1a1a1a' }}>
              S'inscrire
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#1a1a1a] text-[#FAF9F6] px-6 sm:px-10 lg:px-16 py-12 border-t border-white/5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
          <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '20px' }}>Lumière</span>
          <p className="text-[9px] text-white/20 tracking-[0.3em] uppercase">© 2026 Maison Lumière · Paris — Grasse</p>
          <a href="/#work" className="group flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-white/30 hover:text-white transition-colors duration-300">
            <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">←</span>
            Alhambra Studio
          </a>
        </div>
      </footer>
    </div>
  )
}
