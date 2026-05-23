import Image from 'next/image'
import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'
import { SeoNav } from '@/components/seo-nav'

import dynamic from 'next/dynamic'

const ServicesSection = dynamic(() => import('@/components/services-section').then(m => ({ default: m.ServicesSection })))
const ContactSection  = dynamic(() => import('@/components/contact-section').then(m => ({ default: m.ContactSection })))
const FaqSection      = dynamic(() => import('@/components/faq-section').then(m => ({ default: m.FaqSection })))
const FooterSection   = dynamic(() => import('@/components/footer-section').then(m => ({ default: m.FooterSection })))


const BASE = 'https://www.alhambra-web.com'
const PAGE_URL = `${BASE}/agence-web-lyon`

export const metadata: Metadata = {
  title: 'Agence Web Lyon — Création Site & Design UI/UX',
  description: 'Agence web à Lyon — sites sur-mesure, design UI/UX, Next.js. Lighthouse 95+ garanti. Sites vitrines dès 800€.',
  alternates: { canonical: PAGE_URL, languages: { 'fr': PAGE_URL, 'fr-FR': PAGE_URL } },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: PAGE_URL,
    siteName: 'Alhambra Web',
    title: 'Agence Web Lyon — Création Site Web & Design UI/UX | Alhambra',
    description: 'Agence web Lyon — sites sur-mesure, design UI/UX & Next.js. Lighthouse 95+ garanti. Dès 800€.',
    images: [{ url: `${BASE}/image%201.png`, width: 1200, height: 630, alt: 'Agence Web Lyon — Alhambra' }],
  },
}

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${PAGE_URL}/#business`,
  name: 'Alhambra Web — Agence Web Lyon',
  url: BASE,
  image: `${BASE}/image%201.png`,
  priceRange: 'Dès 800€',
  email: 'contact@alhambra-web.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Lyon',
    addressRegion: 'Auvergne-Rhône-Alpes',
    postalCode: '69000',
    addressCountry: 'FR',
  },
  geo: { '@type': 'GeoCoordinates', latitude: '45.7640', longitude: '4.8357' },
  areaServed: [
    { '@type': 'City', name: 'Lyon' },
    { '@type': 'City', name: 'Villeurbanne' },
    { '@type': 'City', name: 'Vénissieux' },
    { '@type': 'City', name: 'Caluire-et-Cuire' },
    { '@type': 'City', name: 'Bron' },
    { '@type': 'City', name: 'Décines-Charpieu' },
    { '@type': 'AdministrativeArea', name: 'Métropole de Lyon' },
    { '@type': 'AdministrativeArea', name: 'Auvergne-Rhône-Alpes' },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    reviewCount: '12',
    bestRating: '5',
  },
}

const SERVICES = [
  { label: 'Création site vitrine Lyon', desc: 'Site professionnel sur-mesure, animé, responsive. Dès 800€.' },
  { label: 'Design UI/UX Lyon', desc: 'Maquettes Figma, branding, identité visuelle premium.' },
  { label: 'Développement Next.js', desc: 'Applications React performantes, TypeScript, Lighthouse 95+.' },
  { label: 'Refonte site web Lyon', desc: 'Audit complet, redesign UX, migration SEO sans perte.' },
  { label: 'E-commerce Lyon', desc: 'Boutiques Shopify ou Next.js custom, tunnel de vente optimisé.' },
  { label: 'SEO technique Lyon', desc: 'Core Web Vitals, JSON-LD, optimisation organique durable.' },
]

const FAQS = [
  {
    q: 'Pourquoi choisir une agence web basée à Lyon ?',
    a: 'Travailler avec une agence web lyonnaise vous garantit une proximité réelle : réunions en présentiel, connaissance du tissu économique local, réactivité sur le même fuseau horaire. Alhambra Web accompagne des entreprises de Lyon 1er au 9e, ainsi que toute la Métropole.',
  },
  {
    q: 'Quel est le coût d\'un site web vitrine à Lyon ?',
    a: 'Nos sites vitrines démarrent à 800€ pour une page unique élaborée, jusqu\'à 3 000–5 000€ pour un site multi-pages avec animations avancées. Chaque devis est personnalisé et gratuit sous 24h.',
  },
  {
    q: 'Combien de temps pour créer un site web à Lyon ?',
    a: 'Un site vitrine est livré en 2 à 4 semaines. Un site e-commerce ou une application web prend 4 à 8 semaines selon la complexité du cahier des charges.',
  },
  {
    q: 'Proposez-vous la refonte de site web à Lyon ?',
    a: 'Oui. Nous réalisons des audits techniques complets, repensons l\'UX/UI et migrons votre contenu sans perte SEO. La refonte inclut l\'optimisation Lighthouse 95+ garantie.',
  },
  {
    q: 'Êtes-vous disponibles pour des projets hors Métropole de Lyon ?',
    a: 'Absolument. Nous intervenons dans toute l\'Isère, l\'Ain, la Savoie et au-delà — en visioconférence ou sur site. Nos clients viennent aussi de toute la France, de Suisse, de Belgique et du Canada.',
  },
]


const WEBPAGE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${PAGE_URL}/#webpage`,
  'url': `${PAGE_URL}/`,
  'name': 'Agence Web Lyon — Création Site Web & Design UI/UX | Alhambra',
  'inLanguage': 'fr-FR',
  'dateModified': '2026-05-19',
  'datePublished': '2026-01-01',
  'isPartOf': { '@id': 'https://www.alhambra-web.com/#website' },
  'about': { '@id': 'https://www.alhambra-web.com/#organization' },
}

export default function AgenceWebLyonPage() {
  return (
    <>
      <Script
        id="schema-agence-web-lyon"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
        strategy="beforeInteractive"
      />
      <Script
        id="schema-webpage-agence-web-lyon"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBPAGE_SCHEMA) }}
        strategy="beforeInteractive"
      />

      <SeoNav />
      <main>
        {/* ── HERO ── */}
        <section
          className="relative overflow-hidden px-6 sm:px-10 lg:px-20 pt-28 pb-24 sm:pt-36 sm:pb-32"
          style={{ color: '#F8F6F2' }}
        >
          <div className="absolute inset-0 z-0">
            <Image src="/images/work-4.webp" alt="" fill className="object-cover" priority />
            <div className="absolute inset-0" style={{ background: 'rgba(10,10,10,0.84)' }} />
          </div>
          <div className="relative z-10 max-w-[1200px] mx-auto">
            <p
              style={{ letterSpacing: '0.45em', fontSize: '11px' }}
              className="uppercase text-white/30 font-bold mb-6"
            >
              Alhambra Web · Lyon, France
            </p>
            <h1
              className="font-nordique"
              style={{
                fontSize: 'clamp(44px, 8vw, 112px)',
                lineHeight: 0.92,
                letterSpacing: '-0.03em',
                fontFamily: 'var(--font-nordique)',
              }}
            >
              Agence Web<br />
              <span style={{ color: 'rgba(248,246,242,0.2)', fontStyle: 'italic' }}>Lyon</span>
            </h1>
            <p
              style={{ fontFamily: 'var(--font-haas)', fontSize: 'clamp(16px,2vw,20px)', color: 'rgba(248,246,242,0.55)', lineHeight: 1.65, maxWidth: '620px' }}
              className="mt-8 mb-10"
            >
              Nous créons des sites web et des expériences digitales qui transforment les visiteurs
              en clients. Stack Next.js dernière génération, design radical, performance garantie.
              Score Lighthouse 95+ sur chaque livraison.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <a
                href="/#contact"
                style={{ background: '#F8F6F2', color: '#0A0A0A', fontFamily: 'var(--font-haas)' }}
                className="inline-block px-8 py-4 rounded-full text-sm font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors"
              >
                Devis gratuit 24h
              </a>
              <Link
                href="/"
                style={{ color: 'rgba(248,246,242,0.3)', fontFamily: 'var(--font-haas)', fontSize: '13px' }}
                className="hover:text-white/60 transition-colors tracking-wide"
              >
                ← Retour à l'accueil
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-[480px]">
              {[['95+', 'Score Lighthouse'], ['2–4 sem.', 'Livraison'], ['Dès 800€', 'Site vitrine']].map(([val, label]) => (
                <div key={label}>
                  <div
                    style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(22px,3vw,34px)', color: '#F8F6F2' }}
                  >
                    {val}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-white/30 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>


        <ServicesSection />
        <ContactSection />
        <FaqSection />
        <FooterSection />
      </main>
    </>
  )
}
