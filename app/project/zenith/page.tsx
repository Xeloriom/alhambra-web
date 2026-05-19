'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 1.1, ease: EASE, delay },
})

const ROOMS = [
  { name: 'Prestige', view: "Vue presqu'île", size: '42 m²', price: '340 €', img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=85' },
  { name: 'Junior Suite', view: 'Vue Fourvière', size: '68 m²', price: '520 €', img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&q=85' },
  { name: 'Suite Zénith', view: 'Vue panoramique', size: '120 m²', price: '980 €', img: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=85' },
]

export default function ZenithPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const smooth     = useSpring(scrollYProgress, { stiffness: 55, damping: 26 })
  const heroScale  = useTransform(smooth, [0, 0.3], [1, 1.06])
  const heroY      = useTransform(smooth, [0, 0.3], [0, -50])

  return (
    <div ref={containerRef} className="bg-white text-[#0A0A0A] antialiased overflow-x-hidden"
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
            <span className="text-[9px] uppercase tracking-[0.38em] text-white/30 font-medium">Hôtellerie</span>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3 ml-auto">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[9px] text-white/15 hidden sm:block">dès</span>
              <span className="text-[12px] font-bold text-white/80 tabular-nums">790 €</span>
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
      <nav className="fixed left-0 right-0 z-[200] flex justify-between items-center px-5 sm:px-10 lg:px-16"
        style={{ top: '44px', height: '60px', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <span style={{ fontFamily: 'var(--font-nordique)', letterSpacing: '0.28em', fontSize: '12px' }}
          className="font-black uppercase">ZÉNITH</span>
        <div className="hidden md:flex gap-7 text-[10px] uppercase tracking-[0.22em] text-black/35">
          {['Chambres', 'Restaurant', 'Spa'].map(l => (
            <button key={l} className="hover:text-black transition-colors">{l}</button>
          ))}
        </div>
        <button className="px-5 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] bg-black text-white hover:bg-black/75 transition-colors">
          Réserver
        </button>
      </nav>

      {/* ── HERO ── */}
      <div style={{ paddingTop: '104px' }}>
        <section className="relative overflow-hidden mx-3 sm:mx-5 rounded-[18px] sm:rounded-[28px]"
          style={{ height: 'clamp(480px, 88vh, 900px)' }}>
          <motion.div style={{ scale: heroScale }} className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=2000&q=90"
              alt="Hôtel Zénith Lyon" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30" />
          </motion.div>

          <motion.div style={{ y: heroY }}
            className="relative z-10 h-full flex flex-col justify-end pb-10 sm:pb-16 px-7 sm:px-12">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="text-[9px] sm:text-[10px] uppercase tracking-[0.5em] text-white/50 mb-4 sm:mb-5"
              style={{ fontFamily: 'var(--font-nordique)' }}>
              Lyon · Presqu'île · Depuis 1947
            </motion.p>
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.7 }}
                style={{
                  fontFamily: 'var(--font-nordique)',
                  fontSize: 'clamp(58px, 13vw, 190px)',
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  lineHeight: 0.86,
                  color: '#fff',
                }}>
                ZÉNITH
              </motion.h1>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
            className="absolute bottom-7 right-7 flex items-center gap-2.5">
            <span className="text-[8px] uppercase tracking-[0.4em] text-white/30">Découvrir</span>
            <motion.div animate={{ x: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 2.2 }}
              className="h-[1px] w-7 bg-white/25" />
          </motion.div>
        </section>
      </div>

      {/* ── STATS ── */}
      <section className="px-6 sm:px-10 lg:px-16 py-12 sm:py-16 border-b border-black/6">
        <div className="flex gap-12 sm:gap-20 lg:gap-28">
          {[['48', 'Chambres'], ['1 ★', 'Michelin'], ['1947', 'Fondé en']].map(([n, l]) => (
            <motion.div key={l} {...fade()}>
              <div style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(26px,3.5vw,48px)', letterSpacing: '-0.03em', lineHeight: 1 }}
                className="font-black mb-1.5">{n}</div>
              <div className="text-[9px] uppercase tracking-[0.28em] text-black/28">{l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          <motion.div {...fade()} className="lg:col-span-6">
            <span className="text-[9px] uppercase tracking-[0.5em] text-black/20 block mb-7">La Maison</span>
            <h2 style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(26px,3.8vw,54px)', letterSpacing: '-0.03em', lineHeight: 1.04 }}
              className="font-black">
              L'art du refuge discret<br />au cœur de Lyon.
            </h2>
          </motion.div>
          <motion.div {...fade(0.15)} className="lg:col-span-5 lg:col-start-8">
            <p className="text-black/42 leading-[1.9] text-sm sm:text-[15px]">
              Au cœur de la presqu'île lyonnaise, le Zénith propose 48 chambres et suites d'exception. Restaurant étoilé, spa 800 m², service conciergerie 24h/24.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── IMAGE PLEIN BORD ── */}
      <div className="px-3 sm:px-5 pb-20 sm:pb-32">
        <motion.div
          initial={{ scale: 0.97, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.3, ease: EASE }}
          className="overflow-hidden rounded-[16px] sm:rounded-[24px]"
          style={{ aspectRatio: '16/7' }}>
          <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=2000&q=85"
            alt="Lobby Zénith" className="w-full h-full object-cover" />
        </motion.div>
      </div>

      {/* ── CHAMBRES ── */}
      <section className="px-3 sm:px-5 pb-20 sm:pb-32">
        <div className="flex justify-between items-end mb-8 sm:mb-12 px-2 sm:px-5">
          <motion.h2 {...fade()}
            style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(20px,2.8vw,40px)', letterSpacing: '-0.03em' }}
            className="font-black">Chambres & Suites</motion.h2>
          <motion.span {...fade(0.1)} className="text-[9px] uppercase tracking-[0.28em] text-black/20 hidden sm:block">48 unités</motion.span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {ROOMS.map((room, i) => (
            <motion.div key={i} {...fade(i * 0.08)} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-[12px] sm:rounded-[18px] bg-[#F2EFE9] mb-4"
                style={{ aspectRatio: '3/4' }}>
                <img src={room.img} alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-[1100ms] group-hover:scale-[1.04]" />
              </div>
              <div className="flex justify-between items-start px-1">
                <div>
                  <div style={{ fontFamily: 'var(--font-nordique)', fontSize: '14px', letterSpacing: '-0.01em' }}
                    className="font-black mb-0.5">{room.name}</div>
                  <div className="text-[9px] uppercase tracking-[0.18em] text-black/28">{room.view} · {room.size}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-nordique)', fontSize: '14px' }} className="font-black text-black/52">
                  {room.price}<span className="text-[9px] font-normal text-black/22"> /nuit</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── RESTAURANT ── */}
      <section className="px-3 sm:px-5 pb-20 sm:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-[16px] sm:rounded-[24px]">
          <div className="bg-[#0A0A0A] text-white p-8 sm:p-14 lg:p-16 flex flex-col justify-between min-h-[300px] order-2 lg:order-1">
            <motion.div {...fade()}>
              <span className="text-[9px] uppercase tracking-[0.45em] text-white/22 block mb-8">Restaurant</span>
              <h2 style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(32px,5vw,68px)', letterSpacing: '-0.04em', lineHeight: 0.9 }}
                className="font-black mb-6">L'ÉTOILE</h2>
              <p className="text-white/38 leading-[1.8] text-sm max-w-xs">
                Cuisine lyonnaise réinventée. Une étoile Michelin, une cave de 800 références.
              </p>
            </motion.div>
            <motion.a {...fade(0.15)} href="#"
              className="mt-8 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/28 hover:text-white transition-colors">
              Réserver <span>→</span>
            </motion.a>
          </div>
          <div className="aspect-[4/3] lg:aspect-auto order-1 lg:order-2">
            <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1000&q=85"
              alt="Restaurant L'Étoile" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* ── SPA ── */}
      <section className="px-6 sm:px-10 lg:px-16 pb-20 sm:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div {...fade(0.1)} className="order-2 lg:order-1 rounded-[16px] sm:rounded-[22px] overflow-hidden" style={{ aspectRatio: '4/5' }}>
            <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=900&q=85"
              alt="Spa Zénith" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div {...fade()} className="order-1 lg:order-2">
            <span className="text-[9px] uppercase tracking-[0.45em] text-black/20 block mb-8">Spa & Bien-être</span>
            <h2 style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(24px,3.5vw,50px)', letterSpacing: '-0.03em', lineHeight: 1.02 }}
              className="font-black mb-10">800 m² dédiés<br />à votre silence.</h2>
            <div>
              {['Piscine intérieure 25 m', 'Hammam & Sauna finlandais', 'Soins corps & visage', 'Fitness 24h/24'].map((s, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.7, ease: EASE }}
                  className="flex items-center gap-4 py-4 border-b border-black/6">
                  <span className="text-[9px] text-black/18 font-bold" style={{ fontFamily: 'var(--font-nordique)' }}>0{i + 1}</span>
                  <span className="text-sm text-black/58">{s}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-3 sm:mx-5 mb-20 sm:mb-32 rounded-[16px] sm:rounded-[24px] bg-[#0A0A0A] text-white px-8 sm:px-16 py-16 sm:py-24 text-center">
        <motion.span {...fade()} className="text-[9px] uppercase tracking-[0.45em] text-white/20 block mb-8">Réservation</motion.span>
        <motion.h2 {...fade(0.1)}
          style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(28px,5.5vw,80px)', letterSpacing: '-0.04em', lineHeight: 0.9 }}
          className="font-black mb-10">VOTRE REFUGE<br />VOUS ATTEND.</motion.h2>
        <motion.a {...fade(0.2)} href="mailto:concierge@zenith-lyon.fr"
          className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-white/16 text-[10px] uppercase tracking-[0.22em] hover:bg-white hover:text-black transition-all duration-300">
          Contacter le concierge
        </motion.a>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-6 sm:px-10 py-7 border-t border-black/6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <span style={{ fontFamily: 'var(--font-nordique)', fontSize: '12px', letterSpacing: '0.25em' }} className="font-black uppercase">ZÉNITH</span>
        <p className="text-[9px] uppercase tracking-[0.22em] text-black/18">© 2026 Hôtel Zénith · Lyon · Conçu par Alhambra</p>
        <a href="/#work" className="text-[9px] uppercase tracking-[0.22em] text-black/25 hover:text-black transition-colors">← Alhambra Studio</a>
      </footer>

    </div>
  )
}
