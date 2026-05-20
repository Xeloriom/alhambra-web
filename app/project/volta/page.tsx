'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { Zap, Battery, Clock, Shield, ArrowRight } from 'lucide-react'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 1.1, ease: EASE, delay },
})

const SPECS = [
  { icon: Zap, val: '2.4s', label: '0 → 100 km/h', unit: 'Accélération' },
  { icon: Battery, val: '650km', label: 'Autonomie WLTP', unit: 'Portée réelle' },
  { icon: Shield, val: '450ch', label: 'Puissance totale', unit: 'Performance' },
  { icon: Clock, val: '22min', label: 'Charge 10 → 80%', unit: 'Ultra-rapide' },
]

const GALLERY = [
  { src: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=75', label: 'Volta S — Profil latéral' },
  { src: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=75', label: 'Habitacle' },
  { src: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=75', label: 'Interface conducteur' },
]

const MODELS = [
  { name: 'Volta S', range: '500km', power: '350ch', price: '54 900€', color: '#111' },
  { name: 'Volta S+', range: '650km', power: '450ch', price: '74 900€', color: '#00D4AA' },
  { name: 'Volta GT', range: '420km', power: '620ch', price: '129 900€', color: '#fff' },
]

export default function VoltaPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 28 })
  const heroScale = useTransform(smooth, [0, 0.25], [1, 1.06])

  return (
    <div ref={containerRef} style={{ background: '#060606', color: '#FFFFFF', fontFamily: 'var(--font-haas), sans-serif' }} className="antialiased overflow-x-hidden">

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
            <span className="text-[9px] uppercase tracking-[0.38em] text-white/30 font-medium">Automobile Premium</span>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3 ml-auto">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[9px] text-white/15 hidden sm:block">dès</span>
              <span className="text-[12px] font-bold text-white/80 tabular-nums">1 190 €</span>
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
      <nav className="fixed w-full z-[100] flex justify-between items-center px-6 sm:px-10 lg:px-16 py-5 sm:py-6" style={{ top: '44px' }}>
        <span style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(16px,1.5vw,22px)', letterSpacing: '0.3em', color: '#00D4AA' }} className="font-black uppercase">VOLTA</span>
        <div className="hidden md:flex gap-8 text-[11px] uppercase tracking-[0.2em] text-white/40">
          {['Modèles', 'Technologie', 'Autonomie', 'Recharge'].map(l => (
            <button key={l} className="hover:text-white/70 transition-colors">{l}</button>
          ))}
        </div>
        <button style={{ background: '#00D4AA', color: '#060606' }}
          className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] hover:opacity-90 transition-opacity">
          Configurer
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className="relative h-screen w-full overflow-hidden flex flex-col justify-end pb-16 sm:pb-24 px-6 sm:px-12 lg:px-20">
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&q=80"
            alt="Volta" className="w-full h-full object-cover opacity-60"
            loading="eager" fetchpriority="high" decoding="async" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #060606 0%, rgba(6,6,6,0.5) 40%, transparent 70%)' }} />
        </motion.div>
        <div style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '300px', background: 'radial-gradient(ellipse at center bottom, rgba(0,212,170,0.18) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

        <div className="relative z-10">
          <motion.span initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
            className="block text-[10px] font-bold tracking-[0.6em] uppercase mb-6" style={{ color: '#00D4AA' }}>
            Électrique · Radical · Silencieux
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.3, ease: EASE, delay: 0.6 }}
            style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(80px,15vw,210px)', lineHeight: 0.82, letterSpacing: '-0.04em' }}>
            DOMINEZ<br />
            <span style={{ color: '#00D4AA', fontStyle: 'italic', fontWeight: 300 }}>l'asphalte.</span>
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-4 mt-10">
            <button style={{ background: '#00D4AA', color: '#060606' }}
              className="px-8 py-4 rounded-full font-bold text-sm uppercase tracking-[0.15em] hover:opacity-90 transition-opacity inline-flex items-center gap-3">
              Configurer votre Volta
              <ArrowRight size={16} />
            </button>
            <button style={{ border: '1px solid rgba(255,255,255,0.15)' }}
              className="px-8 py-4 rounded-full text-sm text-white/60 hover:text-white hover:border-white/30 transition-all">
              Essai routier →
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── SPECS ── */}
      <section className="py-40 sm:py-56 px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-[24px] sm:rounded-[32px] overflow-hidden border border-white/5">
          {SPECS.map((s, i) => (
            <motion.div key={i} {...fade(i * 0.1)}
              className="bg-[#0A0A0A] px-6 sm:px-10 py-10 sm:py-14 text-center group hover:bg-[#0F0F0F] transition-colors">
              <s.icon size={24} className="mx-auto mb-5 text-[#00D4AA] opacity-60 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
              <div style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(28px,4vw,52px)', color: '#00D4AA', lineHeight: 1 }} className="mb-2">{s.val}</div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/25 mb-1">{s.unit}</div>
              <div className="text-[11px] text-white/40">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section className="py-40 sm:py-60 px-6 sm:px-10 lg:px-16">
        <motion.span {...fade(0)} className="block text-[10px] tracking-[0.5em] uppercase text-white/25 font-bold mb-12 sm:mb-16">Design & Intérieur</motion.span>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          {GALLERY.map((g, i) => (
            <motion.div key={i} {...fade(i * 0.1)} className={`relative overflow-hidden rounded-[20px] sm:rounded-[24px] group ${i === 0 ? 'lg:col-span-2 aspect-[16/9]' : 'aspect-[4/3]'}`}>
              <img src={g.src} alt={g.label}
                className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105 opacity-70 group-hover:opacity-90 transition-opacity"
                loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060606]/60 to-transparent" />
              <div className="absolute bottom-5 sm:bottom-6 left-5 sm:left-6">
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">{g.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── MODELS ── */}
      <section className="py-40 sm:py-60 px-6 sm:px-10 lg:px-16">
        <motion.h2 {...fade(0)} style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(28px,4vw,56px)', letterSpacing: '-0.03em' }} className="mb-14 sm:mb-20">
          Choisissez votre Volta.
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {MODELS.map((m, i) => (
            <motion.div key={i} {...fade(i * 0.1)}
              className="p-7 sm:p-8 rounded-[24px] sm:rounded-[28px] border border-white/[0.08] hover:border-[#00D4AA]/30 transition-colors group cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="w-3 h-3 rounded-full mb-8" style={{ background: m.color, boxShadow: m.color === '#00D4AA' ? '0 0 12px rgba(0,212,170,0.4)' : 'none' }} />
              <h3 style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(22px,2.5vw,32px)', letterSpacing: '0.05em' }} className="mb-6">{m.name}</h3>
              <div className="space-y-3 mb-8 text-sm text-white/40">
                <div className="flex justify-between"><span>Autonomie</span><span className="text-white/70">{m.range}</span></div>
                <div className="flex justify-between"><span>Puissance</span><span className="text-white/70">{m.power}</span></div>
              </div>
              <div className="border-t border-white/5 pt-6 flex justify-between items-end">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-white/25 mb-1">À partir de</div>
                  <div style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(18px,2vw,26px)', color: '#00D4AA' }}>{m.price}</div>
                </div>
                <button className="text-[10px] uppercase tracking-[0.2em] text-white/30 group-hover:text-[#00D4AA] transition-colors flex items-center gap-2">
                  Choisir <ArrowRight size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TECH ── */}
      <section className="py-40 sm:py-60 px-6 sm:px-10 lg:px-16">
        <div className="bg-[#00D4AA] rounded-[28px] sm:rounded-[40px] p-10 sm:p-16 lg:p-20 text-[#060606]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="block text-[10px] tracking-[0.5em] uppercase font-bold mb-8 opacity-50">Technologie Volta</span>
              <h3 style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(28px,4.5vw,64px)', lineHeight: 0.88, letterSpacing: '-0.03em' }} className="mb-8">
                L'électrique<br />réinventé.
              </h3>
              <p className="leading-[1.8] text-sm sm:text-base opacity-60 max-w-md">
                Notre batterie solide 120 kWh offre une densité énergétique 2× supérieure aux concurrents. Couplée à notre moteur à flux axial, elle garantit performances et fiabilité pour 500 000 km.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[['120 kWh', 'Batterie solide'], ['800V', 'Architecture'], ['500K km', 'Durée de vie'], ['V2G', 'Recharge réseau']].map(([val, label], i) => (
                <div key={i} className="bg-[#060606]/10 rounded-[20px] p-6 hover:bg-[#060606]/20 transition-colors">
                  <div style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(20px,2.5vw,32px)' }} className="mb-1">{val}</div>
                  <div className="text-[10px] uppercase tracking-widest opacity-50">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 px-6 sm:px-10 lg:px-16 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
          <span style={{ fontFamily: 'var(--font-nordique)', color: '#00D4AA', fontSize: '17px', letterSpacing: '0.2em' }} className="uppercase">VOLTA</span>
          <p className="text-[10px] text-white/20 tracking-[0.25em] uppercase">© 2026 Volta Motors · France</p>
          <a href="/#work" className="group flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-white/25 hover:text-[#00D4AA] transition-colors duration-300">
            <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">←</span>
            Alhambra Studio
          </a>
        </div>
      </footer>
    </div>
  )
}
