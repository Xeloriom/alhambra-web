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
const PAGE_URL = `${BASE}/agence-web-pont-de-cheruy`

export const metadata: Metadata = {
  title: 'Agence Web Pont-de-Chéruy — Création Site Isère',
  description: 'Agence web à Pont-de-Chéruy (38) — sites sur-mesure, design UI/UX, Next.js. Lighthouse 95+ garanti. Dès 200€.',
  alternates: { canonical: PAGE_URL, languages: { 'fr': PAGE_URL, 'fr-FR': PAGE_URL } },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: PAGE_URL,
    siteName: 'Alhambra Web',
    title: 'Agence Web Pont-de-Chéruy — Création Site Isère',
    description: 'Agence web Pont-de-Chéruy (38) — sites vitrines, menus digitaux, e-commerce. Lighthouse 95+. Dès 200€.',
    images: [{ url: `${BASE}/image%201.png`, width: 1200, height: 630, alt: 'Agence Web Pont-de-Chéruy — Alhambra' }],
  },
}

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${PAGE_URL}/#business`,
  name: 'Alhambra Web — Agence Web Pont-de-Chéruy',
  url: BASE,
  image: `${BASE}/image%201.png`,
  priceRange: 'Dès 200€',
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
    { '@type': 'City', name: 'Pont-de-Chéruy' },
    { '@type': 'City', name: 'Charvieu-Chavagneux' },
    { '@type': 'City', name: 'Chavanoz' },
    { '@type': 'City', name: 'Villette-d\'Anthon' },
    { '@type': 'City', name: 'Tignieu-Jameyzieu' },
    { '@type': 'City', name: 'Meyzieu' },
    { '@type': 'City', name: 'Décines-Charpieu' },
    { '@type': 'AdministrativeArea', name: 'Nord-Isère' },
    { '@type': 'AdministrativeArea', name: 'Isère' },
    { '@type': 'AdministrativeArea', name: 'Métropole de Lyon' },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    reviewCount: '12',
    bestRating: '5',
  },
}

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Alhambra Web intervient-il à Pont-de-Chéruy ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui. Alhambra Web, basée à Lyon, intervient à Pont-de-Chéruy (38230) et dans tout le nord-Isère. Déplacement sur site possible pour les commerces, artisans, PME et associations locaux. Devis gratuit sous 24h.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quel est le prix d\'un site web à Pont-de-Chéruy ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Alhambra propose des tarifs adaptés aux budgets locaux : menu digital sur TV dès 200€, site vitrine dès 800€, application web dès 3 000€. Devis gratuit et personnalisé sous 24h.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quelle agence web est proche de Pont-de-Chéruy ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Alhambra Web (Lyon) est la plus proche agence web premium à Pont-de-Chéruy et dans le nord-Isère, avec déplacement possible sur site. Sites Next.js, design UI/UX, Lighthouse 95+ garanti.',
      },
    },
  ],
}

const SERVICES = [
  { label: 'Site vitrine artisan Pont-de-Chéruy', desc: 'Présence web professionnelle pour artisans, commerçants, services locaux. Dès 800€.' },
  { label: 'Menu digital restaurant', desc: 'Affichage de menu sur écran TV, modification de prix en temps réel. Dès 200€.' },
  { label: 'E-commerce nord-Isère', desc: 'Boutique en ligne Shopify ou Next.js, paiement Stripe, catalogue produits.' },
  { label: 'Design UI/UX Isère', desc: 'Maquettes Figma, identité visuelle, branding pour entreprises locales.' },
  { label: 'Refonte site web', desc: 'Audit, redesign UX/UI, migration SEO sans perte. Performances garanties.' },
  { label: 'SEO local nord-Isère', desc: 'Référencement Google local, Google Business Profile, Core Web Vitals.' },
]

const FAQS = [
  {
    q: 'Alhambra Web intervient-il à Pont-de-Chéruy ?',
    a: 'Oui. Alhambra Web est basée à Lyon et intervient régulièrement à Pont-de-Chéruy (38230) et dans tout le nord-Isère. Nous pouvons nous déplacer directement chez vous pour les réunions de cadrage, la livraison et la formation.',
  },
  {
    q: 'Quel est le prix d\'un site web pour un commerce à Pont-de-Chéruy ?',
    a: 'Nous adaptons nos tarifs aux réalités des commerces locaux : menu digital sur TV dès 200€, site vitrine à partir de 800€, e-commerce à partir de 3 000€. Devis gratuit et sans engagement sous 24h.',
  },
  {
    q: 'Faites-vous des sites web pour les artisans du nord-Isère ?',
    a: 'Oui. Artisans du bâtiment, plombiers, électriciens, menuisiers, coiffeurs, restaurateurs — nous créons des sites vitrines efficaces qui génèrent de vrais contacts. Simple d\'utilisation, rapide à charger, bien référencé sur Google.',
  },
  {
    q: 'Proposez-vous des menus digitaux pour restaurants à Pont-de-Chéruy ?',
    a: 'Absolument. Nous avons développé un système d\'affichage de menu sur écran TV avec modification de prix en temps réel dès 200€ pour un restaurant de la région. Simple, élégant, sans abonnement mensuel.',
  },
  {
    q: 'Combien de temps pour créer un site web dans le nord-Isère ?',
    a: '1 à 4 semaines pour un site vitrine, 4 à 8 semaines pour un site e-commerce. Nous travaillons vite sans sacrifier la qualité — chaque livraison inclut le score Lighthouse 95+ garanti.',
  },
]


const WEBPAGE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${PAGE_URL}/#webpage`,
  'url': `${PAGE_URL}/`,
  'name': 'Agence Web Pont-de-Chéruy — Création Site Web | Alhambra',
  'inLanguage': 'fr-FR',
  'dateModified': '2026-05-19',
  'datePublished': '2026-01-01',
  'isPartOf': { '@id': 'https://www.alhambra-web.com/#website' },
  'about': { '@id': 'https://www.alhambra-web.com/#organization' },
}

export default function AgenceWebPontDeCheruyPage() {
  return (
    <>
      <Script
        id="schema-agence-web-pont-de-cheruy"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
        strategy="beforeInteractive"
      />
      <Script
        id="schema-webpage-agence-web-pont-de-cheruy"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBPAGE_SCHEMA) }}
        strategy="beforeInteractive"
      />
      <Script
        id="schema-faq-pont-de-cheruy"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
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
            <Image src="/images/work-3.webp" alt="" fill className="object-cover" priority />
            <div className="absolute inset-0" style={{ background: 'rgba(10,10,10,0.84)' }} />
          </div>
          <div className="relative z-10 max-w-[1200px] mx-auto">
            <p
              style={{ letterSpacing: '0.45em', fontSize: '11px' }}
              className="uppercase text-white/30 font-bold mb-6"
            >
              Alhambra Web · Pont-de-Chéruy, Isère (38)
            </p>
            <h1
              className="font-nordique"
              style={{
                fontSize: 'clamp(38px, 7vw, 100px)',
                lineHeight: 0.92,
                letterSpacing: '-0.03em',
                fontFamily: 'var(--font-nordique)',
              }}
            >
              Agence Web<br />
              <span style={{ color: 'rgba(248,246,242,0.2)', fontStyle: 'italic' }}>Pont-de-Chéruy</span>
            </h1>
            <p
              style={{ fontFamily: 'var(--font-haas)', fontSize: 'clamp(15px,2vw,19px)', color: 'rgba(248,246,242,0.55)', lineHeight: 1.65, maxWidth: '620px' }}
              className="mt-8 mb-10"
            >
              Agence web de Lyon intervenant à Pont-de-Chéruy et dans tout le nord-Isère.
              Sites vitrines pour artisans et commerces locaux, menus digitaux, e-commerce.
              Dès 200€. Devis gratuit sous 24h.
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
                ← Retour à l&apos;accueil
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8 max-w-[480px]">
              {[['Dès 200€', 'Menu digital'], ['1–4 sem.', 'Livraison'], ['95+', 'Score Lighthouse']].map(([val, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(20px,2.5vw,30px)', color: '#F8F6F2' }}>
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
