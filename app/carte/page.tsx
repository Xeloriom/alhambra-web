import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Globe, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Carte de Contact — Alhambra Web Lyon',
  description: 'Ajoutez Alhambra Web à vos contacts. Agence web premium à Lyon — création de sites sur-mesure, design UI/UX & Next.js.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Alhambra Web — Agence Web Lyon',
    description: 'Enregistrez notre contact. Agence web premium à Lyon, dès 200€.',
    images: [{ url: 'https://www.alhambra-web.com/image%201.png', width: 1200, height: 630 }],
  },
}

const LINKS = [
  { href: 'mailto:contact@alhambra-web.com', Icon: Mail,       label: 'contact@alhambra-web.com' },
  { href: 'https://www.alhambra-web.com',     Icon: Globe,      label: 'alhambra-web.com' },
  { href: '#',                                Icon: MapPin,     label: 'Lyon, France' },
]

type SvgProps = { className?: string }

function IconInstagram({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconLinkedin({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function IconX({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.622 5.905-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

const SOCIALS = [
  { href: 'https://www.instagram.com/alhambraweb',         Icon: IconInstagram, label: 'Instagram' },
  { href: 'https://www.linkedin.com/company/alhambra-web', Icon: IconLinkedin,  label: 'LinkedIn' },
  { href: 'https://x.com/AlhambraWeb',                     Icon: IconX,         label: 'X / Twitter' },
]

export default function CartePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-5 py-12">

      {/* Card */}
      <div className="w-full max-w-[360px] flex flex-col items-center gap-8">

        {/* Logo + Brand */}
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_20px_60px_rgba(0,0,0,0.6)]">
            <Image
              src="/logo.png"
              alt="Alhambra Web"
              width={52}
              height={52}
              className="object-contain"
            />
          </div>

          <div>
            <h1
              className="text-white text-3xl tracking-tight leading-none"
              style={{ fontFamily: 'var(--font-nordique), sans-serif' }}
            >
              Alhambra Web
            </h1>
            <p className="mt-1.5 text-[#6B6B6B] text-sm tracking-widest uppercase">
              Agence Web · Lyon
            </p>
          </div>
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-white/[0.06]" />

        {/* Contact info */}
        <ul className="w-full flex flex-col gap-4">
          {LINKS.map(({ href, Icon, label }) => (
            <li key={label}>
              <a
                href={href}
                className="flex items-center gap-3.5 text-[#A0A0A0] hover:text-white transition-colors duration-200 group"
              >
                <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center group-hover:bg-white/[0.10] transition-colors duration-200">
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                </span>
                <span className="text-sm">{label}</span>
              </a>
            </li>
          ))}
        </ul>

        {/* Separator */}
        <div className="w-full h-px bg-white/[0.06]" />

        {/* Social links */}
        <div className="flex gap-3">
          {SOCIALS.map(({ href, Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center text-[#A0A0A0] hover:text-white hover:bg-white/[0.10] transition-colors duration-200"
            >
              <Icon className="w-[18px] h-[18px]" />
            </a>
          ))}
        </div>

        {/* CTA — Download vCard */}
        <a
          href="/alhambra.vcf"
          download="Alhambra-Web.vcf"
          className="w-full py-4 bg-white text-black text-sm font-medium rounded-2xl text-center tracking-wide hover:bg-[#EBEBEB] active:scale-[0.98] transition-all duration-200"
          style={{ fontFamily: 'var(--font-nordique), sans-serif' }}
        >
          Enregistrer le contact
        </a>

        {/* Tagline */}
        <p className="text-[#3A3A3A] text-xs text-center leading-relaxed">
          On ne fait pas du web —<br />on bâtit des empires.
        </p>

        {/* Back link */}
        <Link
          href="/"
          className="text-[#3A3A3A] text-xs hover:text-[#6B6B6B] transition-colors duration-200"
        >
          ← Retour au site
        </Link>
      </div>
    </main>
  )
}
