import Link from 'next/link'

export function SeoNav() {
  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 px-6 sm:px-10 lg:px-12 py-4 sm:py-5 flex justify-between items-center"
      style={{
        background: 'rgba(10,10,10,0.72)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <Link
        href="/"
        className="font-nordique text-white lowercase tracking-tighter leading-none transition-opacity hover:opacity-70"
        style={{ fontSize: 'clamp(16px,1.8vw,24px)' }}
      >
        alhambra web
      </Link>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/#services"
          style={{ fontFamily: 'var(--font-haas)', fontSize: '11px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.2em' }}
          className="hidden sm:block uppercase transition-colors hover:text-white/80"
        >
          services
        </Link>
        <Link
          href="/#work"
          style={{ fontFamily: 'var(--font-haas)', fontSize: '11px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.2em' }}
          className="hidden sm:block uppercase transition-colors hover:text-white/80"
        >
          projets
        </Link>
        <a
          href="/#contact"
          style={{ background: '#F8F6F2', color: '#0A0A0A', fontFamily: 'var(--font-haas)', fontSize: '11px', letterSpacing: '0.18em' }}
          className="px-5 py-[9px] rounded-full font-bold uppercase transition-colors hover:bg-white"
        >
          Devis gratuit
        </a>
      </div>
    </nav>
  )
}
