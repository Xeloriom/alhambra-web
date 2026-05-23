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
const PAGE_URL = `${BASE}/agence-web-isere`

export const metadata: Metadata = {
  title: 'Agence Web Isère — Création Site Web L\'Isle-d\'Abeau',
  description: 'Agence web en Isère — sites vitrines et e-commerce. L\'Isle-d\'Abeau, Bourgoin-Jallieu, Grenoble. Dès 800€, devis 24h.',
  alternates: { canonical: PAGE_URL, languages: { 'fr': PAGE_URL, 'fr-FR': PAGE_URL } },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: PAGE_URL,
    siteName: 'Alhambra Web',
    title: 'Agence Web Isère — Création Site Web | Alhambra',
    description: 'Agence web Isère — sites vitrines et e-commerce. Isle-d\'Abeau, Bourgoin-Jallieu, Grenoble. Dès 800€.',
    images: [{ url: `${BASE}/image%201.png`, width: 1200, height: 630, alt: 'Agence Web Isère — Alhambra' }],
  },
}

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${PAGE_URL}/#business`,
  name: 'Alhambra Web — Agence Web Isère',
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
    { '@type': 'City', name: "L'Isle-d'Abeau" },
    { '@type': 'City', name: 'Bourgoin-Jallieu' },
    { '@type': 'City', name: 'Grenoble' },
    { '@type': 'City', name: 'Vienne' },
    { '@type': 'City', name: 'Voiron' },
    { '@type': 'City', name: 'Villefontaine' },
    { '@type': 'AdministrativeArea', name: 'Isère' },
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
  { label: 'Création site web Isère', desc: 'Sites vitrines sur-mesure pour entreprises isèroises. Dès 800€.' },
  { label: 'Agence web L\'Isle-d\'Abeau', desc: 'Proximité avec la CAPI, connaissance du bassin économique nord-isérois.' },
  { label: 'Création site Bourgoin-Jallieu', desc: 'Sites professionnels pour PME, artisans et professions libérales.' },
  { label: 'E-commerce Isère', desc: 'Boutiques en ligne optimisées pour les producteurs et commerces locaux.' },
  { label: 'SEO Isère', desc: 'Référencement naturel local pour apparaître sur les recherches isèroises.' },
  { label: 'Refonte site web', desc: 'Modernisation et optimisation de votre site existant, Lighthouse 95+.' },
]

const FAQS = [
  {
    q: 'Alhambra Web intervient-elle en Isère ?',
    a: "Oui. Depuis Lyon, nous intervenons régulièrement en nord-Isère : L'Isle-d'Abeau, Bourgoin-Jallieu, Villefontaine, Vienne et au-delà. Nous nous déplaçons chez vous ou travaillons en visioconférence selon votre préférence.",
  },
  {
    q: 'Combien coûte un site web pour une entreprise iséroise ?',
    a: "Nos tarifs s'adaptent à chaque réalité : menu digital ou affichage simple dès 200€, site vitrine professionnel dès 800€, site multi-pages avec animations dès 2 000€, e-commerce ou application sur-mesure dès 3 000€. Devis gratuit et personnalisé sous 24h.",
  },
  {
    q: "Pouvez-vous créer le site d'un commerce basé à Bourgoin-Jallieu ?",
    a: "Tout à fait. Que vous soyez artisan, restaurant, professionnel de santé ou commerce de détail à Bourgoin-Jallieu ou dans la communauté d'agglomération CAPI, nous créons votre présence web en ligne de A à Z : design, développement, SEO local et mise en ligne.",
  },
  {
    q: "Combien de temps dure la création d'un site en Isère ?",
    a: "Un site vitrine est livré sous 2 à 4 semaines après validation du cahier des charges. Pour les projets e-commerce ou applicatifs plus complexes, comptez 4 à 8 semaines. Nous respectons les délais convenus, c'est notre engagement.",
  },
  {
    q: "Le site sera-t-il optimisé pour les recherches locales isèroises ?",
    a: "Absolument. Chaque site inclut : balises title et meta optimisées pour votre ville, données structurées LocalBusiness, intégration Google Business Profile, optimisation pour les recherches de proximité. Votre site apparaît quand vos clients locaux vous cherchent.",
  },
]


const WEBPAGE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${PAGE_URL}/#webpage`,
  'url': `${PAGE_URL}/`,
  'name': 'Agence Web Isère — Création Site Web | Alhambra Web Lyon',
  'inLanguage': 'fr-FR',
  'dateModified': '2026-05-19',
  'datePublished': '2026-01-01',
  'isPartOf': { '@id': 'https://www.alhambra-web.com/#website' },
  'about': { '@id': 'https://www.alhambra-web.com/#organization' },
}

export default function AgenceWebIserePage() {
  return (
    <>
      <Script
        id="schema-agence-web-isere"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
        strategy="beforeInteractive"
      />
      <Script
        id="schema-webpage-agence-web-isere"
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
            <Image src="/images/work-2.webp" alt="" fill className="object-cover" priority />
            <div className="absolute inset-0" style={{ background: 'rgba(10,10,10,0.84)' }} />
          </div>
          <div className="relative z-10 max-w-[1200px] mx-auto">
            <p
              style={{ letterSpacing: '0.45em', fontSize: '11px' }}
              className="uppercase text-white/30 font-bold mb-6"
            >
              Alhambra Web · Isère (38), France
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
              <span style={{ color: 'rgba(248,246,242,0.2)', fontStyle: 'italic' }}>Isère</span>
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
              Entreprises, artisans et commerçants d'Isère : votre site web sur-mesure,
              livré en 2 à 8 semaines. L'Isle-d'Abeau, Bourgoin-Jallieu, Vienne —
              nous connaissons votre territoire.
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
              {[['95+', 'Score Lighthouse'], ['Dès 800€', 'Site vitrine'], ['2–8 sem.', 'Livraison']].map(([val, label]) => (
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
