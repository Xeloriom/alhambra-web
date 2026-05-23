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
const PAGE_URL = `${BASE}/agence-web-ain`

export const metadata: Metadata = {
  title: 'Agence Web Ain — Création Site Web Pont-de-Chéruy',
  description: 'Agence web dans l\'Ain — sites pour artisans, PME et commerces. Pont-de-Chéruy, Lagnieu, La Balme. Dès 800€.',
  alternates: { canonical: PAGE_URL, languages: { 'fr': PAGE_URL, 'fr-FR': PAGE_URL } },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: PAGE_URL,
    siteName: 'Alhambra Web',
    title: 'Agence Web Ain — Création Site Web | Alhambra',
    description: 'Agence web dans l\'Ain — sites pour artisans et PME. Pont-de-Chéruy, Lagnieu, La Balme. Dès 800€.',
    images: [{ url: `${BASE}/image%201.png`, width: 1200, height: 630, alt: 'Agence Web Ain — Alhambra' }],
  },
}

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${PAGE_URL}/#business`,
  name: 'Alhambra Web — Agence Web Ain',
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
    { '@type': 'City', name: 'Pont-de-Chéruy' },
    { '@type': 'City', name: 'Lagnieu' },
    { '@type': 'City', name: 'La Balme-les-Grottes' },
    { '@type': 'City', name: 'Ambérieu-en-Bugey' },
    { '@type': 'City', name: 'Belley' },
    { '@type': 'City', name: 'Bourg-en-Bresse' },
    { '@type': 'AdministrativeArea', name: 'Ain' },
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
  { label: 'Site vitrine artisan Ain', desc: 'Présence professionnelle en ligne pour plombiers, électriciens, menuisiers. Dès 800€.' },
  { label: 'Site web PME Ain', desc: 'Sites multi-pages sur-mesure, responsive, optimisés SEO local.' },
  { label: 'Menu digital restaurant', desc: 'QR code, carte en ligne modifiable en temps réel. Dès 200€.' },
  { label: 'E-commerce Ain', desc: 'Boutique en ligne pour producteurs locaux et commerces de proximité.' },
  { label: 'Refonte site web', desc: 'Modernisation de votre site existant, amélioration des performances.' },
  { label: 'SEO local Ain', desc: 'Visibilité Google Maps, fiches établissements, référencement local.' },
]

const FAQS = [
  {
    q: 'Une agence web peut-elle intervenir dans l\'Ain (département 01) ?',
    a: 'Oui. Alhambra Web est basé à Lyon et se déplace régulièrement dans l\'Ain pour rencontrer ses clients à Pont-de-Chéruy, Lagnieu, La Balme-les-Grottes et dans tout le département 01. Nous pouvons aussi travailler entièrement en visioconférence.',
  },
  {
    q: 'Quel budget prévoir pour un site web à Pont-de-Chéruy ?',
    a: 'Un menu digital ou système d\'affichage débute à 200€. Un site vitrine professionnel est disponible dès 800€. Pour une boutique e-commerce ou une application sur-mesure, les tarifs démarrent à 2 000€. Devis gratuit et sans engagement sous 24h.',
  },
  {
    q: 'Créez-vous des sites pour les artisans de l\'Ain ?',
    a: 'C\'est l\'un de nos créneaux de prédilection. Nous avons accompagné des artisans, des TPE et des associations de La Balme-les-Grottes, Lagnieu, Pont-de-Chéruy. Sites clés en main, accessibles, qui génèrent de vrais contacts locaux.',
  },
  {
    q: 'Proposez-vous un référencement local pour les entreprises de l\'Ain ?',
    a: 'Oui. Chaque site que nous créons intègre les bases du SEO local : balises titres optimisées, données structurées JSON-LD, fiche Google Business Profile, optimisation pour les recherches géolocalisées. Résultat : vous apparaissez quand vos clients vous cherchent.',
  },
  {
    q: 'Quel délai pour recevoir mon site web ?',
    a: 'Comptez 2 à 4 semaines pour un site vitrine standard, et 4 à 8 semaines pour un projet plus complexe. Nous respectons les délais convenus — c\'est non négociable.',
  },
]


const WEBPAGE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${PAGE_URL}/#webpage`,
  'url': `${PAGE_URL}/`,
  'name': 'Agence Web Ain — Création Site Web | Alhambra Web Lyon',
  'inLanguage': 'fr-FR',
  'dateModified': '2026-05-19',
  'datePublished': '2026-01-01',
  'isPartOf': { '@id': 'https://www.alhambra-web.com/#website' },
  'about': { '@id': 'https://www.alhambra-web.com/#organization' },
}

export default function AgenceWebAinPage() {
  return (
    <>
      <Script
        id="schema-agence-web-ain"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
        strategy="beforeInteractive"
      />
      <Script
        id="schema-webpage-agence-web-ain"
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
            <Image src="/images/work-1.webp" alt="" fill className="object-cover" priority />
            <div className="absolute inset-0" style={{ background: 'rgba(10,10,10,0.84)' }} />
          </div>
          <div className="relative z-10 max-w-[1200px] mx-auto">
            <p
              style={{ letterSpacing: '0.45em', fontSize: '11px' }}
              className="uppercase text-white/30 font-bold mb-6"
            >
              Alhambra Web · Ain (01), France
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-nordique)',
                fontSize: 'clamp(44px, 8vw, 112px)',
                lineHeight: 0.92,
                letterSpacing: '-0.03em',
              }}
            >
              Agence Web<br />
              <span style={{ color: 'rgba(248,246,242,0.2)', fontStyle: 'italic' }}>Ain</span>
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-haas)',
                fontSize: 'clamp(16px,2vw,20px)',
                color: 'rgba(248,246,242,0.55)',
                lineHeight: 1.65,
                maxWidth: '620px',
              }}
              className="mt-8 mb-10"
            >
              Artisans, commerçants et entreprises de l'Ain : nous créons votre présence en
              ligne sur-mesure. Pont-de-Chéruy, Lagnieu, La Balme-les-Grottes — nous connaissons
              votre territoire et nous y venons.
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

            <div className="mt-16 grid grid-cols-3 gap-8 max-w-[480px]">
              {[['Dès 200€', 'Menu digital'], ['Dès 800€', 'Site vitrine'], ['2–4 sem.', 'Livraison']].map(([val, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(20px,2.8vw,30px)', color: '#F8F6F2' }}>
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
