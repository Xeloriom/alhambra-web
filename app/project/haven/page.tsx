'use client'

import { motion, useScroll, useTransform, useSpring, useAnimationFrame, useMotionValue } from 'framer-motion'
import { useRef } from 'react'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 48 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 1.1, ease: EASE, delay },
})

const PROPERTIES = [
  {
    addr: 'Avenue Foch, 16e',
    price: '3.2M€',
    type: 'Appartement de prestige',
    rooms: '7 pièces · 320m²',
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
  },
  {
    addr: 'Île Saint-Louis, 4e',
    price: '1.8M€',
    type: 'Hôtel particulier',
    rooms: '5 pièces · 180m²',
    img: 'https://images.unsplash.com/photo-1613977257592-4a9a32f9141b?w=800&q=80',
  },
  {
    addr: 'Place Vendôme, 1er',
    price: '5.5M€',
    type: 'Penthouse panoramique',
    rooms: '9 pièces · 480m²',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  },
]

const STEPS = [
  { n: '01', title: 'Consultation', desc: 'Entretien confidentiel pour cerner vos aspirations et votre vision.' },
  { n: '02', title: 'Sélection', desc: 'Accès à notre portefeuille off-market, invisible des plateformes publiques.' },
  { n: '03', title: 'Visite privée', desc: 'Accompagnement personnalisé, à votre rythme, aux horaires qui vous conviennent.' },
  { n: '04', title: 'Signature', desc: 'Suivi juridique et notarial de A à Z, sans friction.' },
]

const TESTIMONIALS = [
  { quote: 'Haven a su comprendre exactement ce que nous cherchions. L\'appartement de nos rêves, déniché en 3 semaines.', name: 'Isabelle M.', title: 'Cliente — 16e arrondissement' },
  { quote: 'Un niveau de service qui dépasse toutes les attentes. Discrétion, réactivité et expertise réunies.', name: 'Thomas L.', title: 'Client — Neuilly-sur-Seine' },
]

function RunningMarquee() {
  const x = useMotionValue(0)
  const ref = useRef<HTMLDivElement>(null)
  useAnimationFrame((_, delta) => {
    x.set(x.get() - delta * 0.055)
    if (ref.current) {
      const w = ref.current.scrollWidth / 2
      if (Math.abs(x.get()) >= w) x.set(0)
    }
  })
  const text = 'PARIS · NEUILLY · BOULOGNE · SAINT-GERMAIN · LE MARAIS · VERSAILLES · PASSY · AUTEUIL · '
  return (
    <div className="overflow-hidden border-t border-b border-[#EBEBEB] py-4">
      <motion.div ref={ref} style={{ x, whiteSpace: 'nowrap', display: 'inline-block' }}
        className="text-[10px] uppercase tracking-[0.45em] text-black/30 font-bold">
        {text.repeat(8)}
      </motion.div>
    </div>
  )
}

export default function HavenPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 28 })
  const heroScale = useTransform(smooth, [0, 0.3], [1, 1.08])
  const heroOpacity = useTransform(smooth, [0.1, 0.35], [1, 0])

  return (
    <div ref={containerRef} style={{ background: '#F8F6F2', color: '#0A0A0A', fontFamily: 'var(--font-haas), sans-serif' }} className="antialiased overflow-x-hidden">

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
            <span className="text-[9px] uppercase tracking-[0.38em] text-white/30 font-medium">Immobilier Prestige</span>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3 ml-auto">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[9px] text-white/15 hidden sm:block">dès</span>
              <span className="text-[12px] font-bold text-white/80 tabular-nums">890 €</span>
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
      <nav className="fixed w-full z-[100] flex justify-between items-center px-6 sm:px-10 lg:px-16 py-5 sm:py-6"
        style={{ top: '44px', background: 'rgba(248,246,242,0.88)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <span style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(15px,1.5vw,20px)', letterSpacing: '0.15em' }} className="uppercase font-bold">
          Haven Prestige
        </span>
        <div className="hidden md:flex gap-8 text-[11px] uppercase tracking-[0.25em] text-black/40">
          {['Propriétés', 'Services', 'À propos'].map(l => (
            <button key={l} className="hover:text-black/80 transition-colors">{l}</button>
          ))}
        </div>
        <button style={{ background: '#0A0A0A', color: '#F8F6F2' }}
          className="text-[10px] sm:text-xs uppercase tracking-[0.25em] px-5 sm:px-7 py-2.5 sm:py-3 rounded-full hover:bg-[#B8966A] transition-colors">
          Prendre RDV
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className="relative h-screen w-full overflow-hidden">
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&q=85"
            alt="Haven Prestige" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#F8F6F2]/10 via-transparent to-[#F8F6F2]/80" />
        </motion.div>
        <motion.div style={{ opacity: heroOpacity }}
          className="absolute inset-0 flex flex-col justify-end px-6 sm:px-12 lg:px-20 pb-16 sm:pb-20 lg:pb-28 z-10">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
            className="block text-[10px] sm:text-[11px] font-bold tracking-[0.6em] uppercase text-[#B8966A] mb-6">
            Immobilier de Prestige — Paris
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.6 }}
            style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(80px, 14vw, 200px)', lineHeight: 0.82, letterSpacing: '-0.04em' }}
            className="font-black text-[#0A0A0A] mb-8">
            VOTRE<br /><span className="text-[#B8966A] italic font-light">chef-d'œuvre.</span>
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
            className="flex flex-wrap gap-8 sm:gap-12">
            {[['180+', 'propriétés'], ['€2.4M', 'prix moyen'], ['12 ans', 'expertise']].map(([val, label]) => (
              <div key={label}>
                <p style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(24px,3.5vw,44px)', color: '#B8966A' }}>{val}</p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 mt-1">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <RunningMarquee />

      {/* ── PROPERTIES ── */}
      <section className="py-40 sm:py-60 px-6 sm:px-10 lg:px-16">
        <motion.div {...fade(0)} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14 sm:mb-20">
          <h2 style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(28px,4vw,56px)', letterSpacing: '-0.03em', lineHeight: 1 }}>
            Propriétés en exclusivité
          </h2>
          <span className="text-[11px] uppercase tracking-[0.3em] text-black/30">Off-market · Confidentiel</span>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {PROPERTIES.map((p, i) => (
            <motion.div key={i} {...fade(i * 0.12)}
              whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="group cursor-pointer">
              <div className="relative aspect-[3/4] rounded-[20px] sm:rounded-[24px] overflow-hidden mb-5">
                <img src={p.img} alt={p.addr}
                  className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-5 sm:bottom-6 left-5 sm:left-6 right-5 sm:right-6">
                  <span style={{ background: '#B8966A', color: '#0A0A0A', fontSize: '9px', padding: '4px 10px', borderRadius: '20px', letterSpacing: '0.2em' }}
                    className="uppercase font-bold">{p.type}</span>
                  <h3 style={{ fontFamily: 'var(--font-nordique)', color: '#F8F6F2', fontSize: 'clamp(18px,2.2vw,26px)', marginTop: '10px', lineHeight: 1.1 }}>{p.addr}</h3>
                  <p style={{ color: 'rgba(248,246,242,0.5)', fontSize: '11px', marginTop: '5px', letterSpacing: '0.1em' }}>{p.rooms}</p>
                  <p style={{ fontFamily: 'var(--font-nordique)', color: '#B8966A', fontSize: 'clamp(20px,2.5vw,30px)', marginTop: '8px' }}>{p.price}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="py-40 sm:py-60 px-6 sm:px-10 lg:px-16 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-[1400px] mx-auto">
          <motion.div {...fade(0)}>
            <span className="block text-[10px] tracking-[0.5em] uppercase text-[#B8966A] font-bold mb-8">Notre vision</span>
            <h2 style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(28px,4vw,54px)', letterSpacing: '-0.03em', lineHeight: 1.05 }} className="mb-8">
              L'immobilier pensé<br /><span className="italic font-light text-black/30">comme un art de vivre.</span>
            </h2>
            <p className="text-black/55 leading-[1.8] text-sm sm:text-base mb-6">
              Fondée en 2012, Haven Prestige est l'agence de référence pour l'acquisition et la vente de biens d'exception à Paris et en Île-de-France. Nous croyons que chaque propriété raconte une histoire — et que notre rôle est d'en être le parfait narrateur.
            </p>
            <p className="text-black/55 leading-[1.8] text-sm sm:text-base">
              Notre réseau confidentiel de plus de 180 biens off-market nous permet de proposer des opportunités invisibles des plateformes publiques.
            </p>
            <div className="mt-10 flex gap-8 sm:gap-12">
              {[['97%', 'Satisfaction client'], ['3 sem.', 'Délai moyen'], ['100%', 'Confidentiel']].map(([val, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(24px,3vw,40px)', color: '#B8966A' }}>{val}</div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-black/35 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div {...fade(0.15)} className="relative">
            <div className="aspect-[4/5] rounded-[24px] sm:rounded-[32px] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80"
                alt="Intérieur prestige" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-40 sm:w-52 aspect-square rounded-[20px] overflow-hidden border-4 border-[#F8F6F2] hidden sm:block">
              <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80"
                alt="Détail" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="py-40 sm:py-60 px-6 sm:px-10 lg:px-16">
        <motion.h2 {...fade(0)} style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(28px,4vw,56px)', letterSpacing: '-0.02em' }} className="mb-14 sm:mb-20">
          Notre approche
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-[#EBEBEB] rounded-[24px] overflow-hidden">
          {STEPS.map((s, i) => (
            <motion.div key={i} {...fade(i * 0.1)}
              className="p-8 sm:p-10 border-r border-[#EBEBEB] last:border-r-0 hover:bg-[#0A0A0A] hover:text-white transition-colors duration-500 group">
              <p style={{ fontFamily: 'var(--font-nordique)', color: '#B8966A', fontSize: '36px', lineHeight: 1 }} className="opacity-60 group-hover:opacity-100">{s.n}</p>
              <h3 style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(18px,1.8vw,24px)', marginTop: '20px', marginBottom: '10px' }}>{s.title}</h3>
              <p className="text-sm leading-relaxed text-black/50 group-hover:text-white/50">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-40 sm:py-56 px-6 sm:px-10 lg:px-16 bg-[#0A0A0A] text-[#F8F6F2]">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i} {...fade(i * 0.15)}
              className="p-8 sm:p-10 border border-white/10 rounded-[24px] hover:border-[#B8966A]/40 transition-colors">
              <div className="text-[#B8966A] text-4xl leading-none mb-6" style={{ fontFamily: 'Georgia, serif' }}>"</div>
              <p className="text-white/70 leading-[1.8] text-sm sm:text-base mb-8 italic">{t.quote}</p>
              <div className="border-t border-white/10 pt-6">
                <div style={{ fontFamily: 'var(--font-nordique)', fontSize: '15px', letterSpacing: '0.05em' }}>{t.name}</div>
                <div className="text-[11px] text-white/35 tracking-[0.2em] mt-1 uppercase">{t.title}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-40 sm:py-60 px-6 sm:px-10 lg:px-16 bg-[#0A0A0A] text-[#F8F6F2]">
        <div className="max-w-[900px] mx-auto text-center">
          <motion.h2 {...fade(0)} style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(40px,8vw,120px)', lineHeight: 0.88, letterSpacing: '-0.04em' }} className="mb-12">
            Discutons<br />de votre<br /><span style={{ color: '#B8966A', fontStyle: 'italic' }}>projet.</span>
          </motion.h2>
          <motion.div {...fade(0.2)} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Votre adresse email"
              className="flex-1 px-6 py-4 rounded-full text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#F8F6F2' }} />
            <button className="px-7 py-4 rounded-full font-bold text-xs uppercase tracking-[0.2em] whitespace-nowrap transition-colors hover:bg-[#B8966A] hover:text-white"
              style={{ background: '#F8F6F2', color: '#0A0A0A' }}>
              Nous contacter
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 bg-[#0A0A0A] text-[#F8F6F2] px-6 sm:px-10 lg:px-16 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
          <span style={{ fontFamily: 'var(--font-nordique)', fontSize: '16px', letterSpacing: '0.1em' }} className="uppercase">Haven Prestige</span>
          <p className="text-[10px] text-white/25 tracking-[0.25em] uppercase">© 2026 Haven Prestige · Paris</p>
          <a href="/#work" className="group flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-white/30 hover:text-white transition-colors duration-300">
            <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">←</span>
            Alhambra Studio
          </a>
        </div>
      </footer>
    </div>
  )
}
