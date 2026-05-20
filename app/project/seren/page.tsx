'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 1.1, ease: EASE, delay },
})

const SERVICES = [
  { tag: 'Yoga', color: '#6B8F71', name: 'Vinyasa Flow', duration: '60 min · 35€', desc: 'Enchaînement fluide synchronisé avec le souffle. Ouverture des hanches, renforcement doux, ancrage profond. Tous niveaux.', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=75' },
  { tag: 'Méditation', color: '#C4694F', name: 'Pleine conscience', duration: '45 min · 28€', desc: 'Techniques de respiration 4-7-8 et visualisation guidée pour apaiser le mental et retrouver un ancrage durable.', img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=75' },
  { tag: 'Pilates', color: '#B8966A', name: 'Pilates reformer', duration: '55 min · 42€', desc: 'Renforcement en profondeur sur le reformer. Gainage, posture, équilibre. Séances limitées à 4 personnes.', img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&q=75' },
  { tag: 'Balnéo', color: '#1C1C1A', name: 'Balnéothérapie', duration: '90 min · 78€', desc: 'Immersion dans nos bains à jets avec sels de la mer Morte et huiles essentielles. Soin corps complet inclus.', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&q=75' },
]

const TESTIMONIALS = [
  { quote: 'Seren a changé mon rapport au stress. Après 6 semaines, je dors mieux et je suis plus concentrée au travail.', name: 'Camille R.', since: 'Membre depuis 8 mois' },
  { quote: 'Le pilates reformer est incroyable. Mon dos ne m\'a jamais été aussi bien. Je recommande sans hésitation.', name: 'Marc T.', since: 'Membre depuis 14 mois' },
  { quote: 'Un espace hors du temps. L\'équipe est aux petits soins, l\'ambiance est parfaite. Mon rituel du dimanche.', name: 'Sophie L.', since: 'Membre depuis 2 ans' },
]

const SCHEDULE = ['Lundi · 08h — Vinyasa Flow', 'Mercredi · 12h — Pilates reformer', 'Vendredi · 18h30 — Pleine conscience', 'Samedi · 10h — Balnéothérapie']

export default function SerenPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 28 })
  const heroScale = useTransform(smooth, [0, 0.25], [1, 1.06])

  return (
    <div ref={containerRef} style={{ background: '#FAF8F4', color: '#1C1C1A', fontFamily: 'var(--font-haas), sans-serif' }} className="antialiased overflow-x-hidden">

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
            <span className="text-[9px] uppercase tracking-[0.38em] text-white/30 font-medium">Wellness & Spa</span>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3 ml-auto">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[9px] text-white/15 hidden sm:block">dès</span>
              <span className="text-[12px] font-bold text-white/80 tabular-nums">590 €</span>
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
        style={{ top: '44px', background: 'rgba(250,248,244,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(28,28,26,0.06)' }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(18px,1.8vw,24px)', fontStyle: 'italic', color: '#6B8F71', letterSpacing: '0.05em' }}>Seren</span>
        <div className="hidden md:flex gap-8 text-[11px] uppercase tracking-[0.25em] text-[#1C1C1A]/40">
          {['Soins', 'Planning', 'Tarifs', 'À propos'].map(l => (
            <button key={l} className="hover:text-[#1C1C1A]/80 transition-colors">{l}</button>
          ))}
        </div>
        <button style={{ background: '#1C1C1A', color: '#FAF8F4' }}
          className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-[10px] sm:text-xs uppercase tracking-[0.2em] hover:bg-[#6B8F71] transition-colors">
          Réserver
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className="relative h-screen w-full overflow-hidden">
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80"
            alt="Seren Studio" className="w-full h-full object-cover"
            loading="eager" fetchpriority="high" decoding="async" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(250,248,244,0.2) 0%, rgba(250,248,244,0.15) 40%, rgba(250,248,244,0.85) 100%)' }} />
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 pointer-events-none"
          style={{ transform: 'translate(-50%, -50%)', width: 'min(520px, 70vw)', height: 'min(520px, 70vw)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(107,143,113,0.1) 0%, transparent 70%)' }}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.6, duration: 1 }}
            className="block text-[10px] tracking-[0.8em] uppercase font-bold text-[#6B8F71] mb-10">
            Studio de bien-être — Paris 11e
          </motion.span>
          {['TROUVER', 'SON', 'SOUFFLE.'].map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.span
                initial={{ y: '110%' }} animate={{ y: 0 }}
                transition={{ duration: 1.3, ease: EASE, delay: 0.7 + i * 0.12 }}
                style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(80px,15vw,200px)', lineHeight: 0.82, letterSpacing: '-0.04em', display: 'block', color: i === 1 ? '#6B8F71' : '#1C1C1A', fontStyle: i === 1 ? 'italic' : 'normal', fontWeight: i === 1 ? 300 : 900 }}>
                {line}
              </motion.span>
            </div>
          ))}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 1.4 }}
            className="text-sm sm:text-base mt-8 max-w-sm leading-relaxed text-[#1C1C1A]">
            Yoga, méditation, pilates et balnéothérapie réunis dans un espace pensé pour votre équilibre.
          </motion.p>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="w-[1px] h-10" style={{ background: 'linear-gradient(to bottom, rgba(28,28,26,0.2), transparent)' }} />
        </motion.div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-40 sm:py-60 px-6 sm:px-10 lg:px-16">
        <motion.div {...fade(0)} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14 sm:mb-20">
          <h2 style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(28px,4vw,56px)', letterSpacing: '-0.03em', lineHeight: 1 }}>
            Nos soins
          </h2>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#1C1C1A]/30">4 disciplines · Paris 11e</span>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {SERVICES.map((s, i) => (
            <motion.div key={i} {...fade(i * 0.1)} className="group cursor-pointer">
              <div className="relative aspect-[16/9] rounded-[20px] sm:rounded-[24px] overflow-hidden mb-5">
                <img src={s.img} alt={s.name}
                  className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  loading="lazy" decoding="async" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(28,28,26,0.6) 0%, transparent 60%)' }} />
                <div className="absolute bottom-5 left-5">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full"
                    style={{ background: s.color, color: s.color === '#1C1C1A' ? '#FAF8F4' : '#FAF8F4' }}>
                    {s.tag}
                  </span>
                </div>
              </div>
              <div className="px-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(18px,2vw,24px)' }}>{s.name}</h3>
                  <span className="text-[11px] text-[#1C1C1A]/40 text-right">{s.duration}</span>
                </div>
                <p className="text-sm text-[#1C1C1A]/50 leading-[1.7]">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="py-40 sm:py-60 px-6 sm:px-10 lg:px-16 bg-[#1C1C1A] text-[#FAF8F4]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-[1400px] mx-auto">
          <motion.div {...fade(0)}>
            <span className="block text-[10px] tracking-[0.5em] uppercase text-[#6B8F71] font-bold mb-8">Notre philosophie</span>
            <h2 style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(28px,4vw,56px)', lineHeight: 1.05, letterSpacing: '-0.03em' }} className="mb-8">
              Le bien-être n'est pas<br /><span className="italic font-light text-white/20">un luxe.</span>
            </h2>
            <p className="text-white/50 leading-[1.9] text-sm sm:text-base mb-6">
              Chez Seren, nous croyons que prendre soin de soi est un acte fondamental, pas une récompense. Depuis 2019, notre studio parisien accueille plus de 300 membres réguliers dans un espace épuré, chaleureux et sans jugement.
            </p>
            <p className="text-white/50 leading-[1.9] text-sm sm:text-base">
              Nos instructeurs certifiés adaptent chaque séance à votre niveau et vos besoins. Un accompagnement personnalisé, dans un cadre collectif bienveillant.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-6">
              {[['300+', 'Membres actifs'], ['6', 'Instructeurs'], ['4.9★', 'Avis Google']].map(([val, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(22px,3vw,40px)', color: '#6B8F71' }}>{val}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/25 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div {...fade(0.15)}>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] rounded-[20px] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500&q=75" alt="Studio" className="w-full h-full object-cover"
                  loading="lazy" decoding="async" />
              </div>
              <div className="aspect-[3/4] rounded-[20px] overflow-hidden mt-8">
                <img src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&q=75" alt="Soin" className="w-full h-full object-cover"
                  loading="lazy" decoding="async" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PLANNING ── */}
      <section className="py-40 sm:py-56 px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <motion.span {...fade(0)} className="block text-[10px] tracking-[0.5em] uppercase text-[#1C1C1A]/30 font-bold mb-10">Planning de la semaine</motion.span>
            <div className="space-y-3 sm:space-y-4">
              {SCHEDULE.map((s, i) => (
                <motion.div key={i} {...fade(i * 0.08)}
                  className="flex justify-between items-center py-5 border-b border-[#1C1C1A]/10 group cursor-pointer hover:border-[#6B8F71]/40 transition-colors">
                  <span className="text-sm sm:text-base group-hover:text-[#6B8F71] transition-colors">{s}</span>
                  <span className="text-[10px] uppercase tracking-widest text-[#1C1C1A]/30 group-hover:text-[#6B8F71] transition-colors">Réserver →</span>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div {...fade(0.15)} className="relative aspect-[4/5] rounded-[28px] sm:rounded-[36px] overflow-hidden">
            <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=75"
              alt="Méditation Seren" className="w-full h-full object-cover"
              loading="lazy" decoding="async" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(28,28,26,0.5) 0%, transparent 50%)' }} />
            <div className="absolute bottom-8 left-8 right-8">
              <div style={{ background: 'rgba(250,248,244,0.95)', borderRadius: '16px', padding: '20px 24px' }}>
                <div className="text-[10px] uppercase tracking-[0.3em] text-[#1C1C1A]/40 mb-1">Prochain cours</div>
                <div style={{ fontFamily: 'var(--font-nordique)', fontSize: '20px' }}>Vinyasa Flow</div>
                <div className="text-sm text-[#6B8F71] mt-1">Lundi · 08h00 · 4 places restantes</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-40 sm:py-56 px-6 sm:px-10 lg:px-16 bg-[#F0EDE8]">
        <motion.span {...fade(0)} className="block text-[10px] tracking-[0.5em] uppercase text-[#1C1C1A]/30 font-bold mb-14 sm:mb-16">Ce qu'ils en disent</motion.span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i} {...fade(i * 0.1)} className="bg-white rounded-[20px] sm:rounded-[24px] p-7 sm:p-8">
              <div style={{ color: '#6B8F71', fontSize: '36px', fontFamily: 'Georgia, serif', lineHeight: 1 }} className="mb-5">"</div>
              <p className="text-[#1C1C1A]/60 leading-[1.8] text-sm italic mb-6">{t.quote}</p>
              <div className="border-t border-[#1C1C1A]/8 pt-5">
                <div style={{ fontFamily: 'var(--font-nordique)', fontSize: '15px' }}>{t.name}</div>
                <div className="text-[10px] uppercase tracking-widest text-[#1C1C1A]/30 mt-1">{t.since}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-40 sm:py-60 px-6 sm:px-10 lg:px-16 text-center">
        <motion.span {...fade(0)} className="block text-[10px] tracking-[0.5em] uppercase text-[#6B8F71] font-bold mb-8">Première séance offerte</motion.span>
        <motion.h2 {...fade(0.1)} style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(36px,7vw,100px)', lineHeight: 0.88, letterSpacing: '-0.04em' }} className="mb-12">
          Commencez<br /><span style={{ color: '#6B8F71', fontStyle: 'italic', fontWeight: 300 }}>aujourd'hui.</span>
        </motion.h2>
        <motion.button {...fade(0.2)} style={{ background: '#1C1C1A', color: '#FAF8F4' }}
          className="px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold text-sm uppercase tracking-[0.2em] hover:bg-[#6B8F71] transition-colors">
          Réserver ma séance d'essai
        </motion.button>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#1C1C1A', color: '#FAF8F4' }} className="px-6 sm:px-10 lg:px-16 py-12 border-t border-white/5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
          <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '22px', color: '#6B8F71' }}>Seren</span>
          <p className="text-[9px] text-white/20 tracking-[0.3em] uppercase">© 2026 Seren Studio · Paris 11e</p>
          <a href="/#work" className="group flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-white/25 hover:text-[#6B8F71] transition-colors duration-300">
            <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">←</span>
            Alhambra Studio
          </a>
        </div>
      </footer>
    </div>
  )
}
