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
const PAGE_URL = `${BASE}/application-mobile-lyon`

export const metadata: Metadata = {
  title: 'Application Mobile Lyon — Développement iOS & Android',
  description: 'Agence application mobile Lyon — développement iOS, Android, React Native. Sur-mesure, Lighthouse 95+. Dès 3 000€, devis gratuit 24h.',
  alternates: { canonical: PAGE_URL, languages: { 'fr': PAGE_URL, 'fr-FR': PAGE_URL } },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: PAGE_URL,
    siteName: 'Alhambra Web',
    title: 'Application Mobile Lyon — Développement iOS & Android',
    description: 'Agence application mobile Lyon — iOS, Android, React Native sur-mesure. Dès 3 000€.',
    images: [{ url: `${BASE}/image%201.png`, width: 1200, height: 630, alt: 'Application Mobile Lyon — Alhambra' }],
  },
}

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${PAGE_URL}/#business`,
  name: 'Alhambra Web — Agence Application Mobile Lyon',
  url: BASE,
  image: `${BASE}/image%201.png`,
  priceRange: 'Dès 3 000€',
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

const WEBPAGE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${PAGE_URL}/#webpage`,
  url: `${PAGE_URL}/`,
  name: 'Application Mobile Lyon — Développement iOS & Android | Alhambra',
  inLanguage: 'fr-FR',
  dateModified: '2026-05-23',
  datePublished: '2026-05-23',
  isPartOf: { '@id': 'https://www.alhambra-web.com/#website' },
  about: { '@id': 'https://www.alhambra-web.com/#organization' },
}

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quel est le coût de développement d\'une application mobile à Lyon ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Le développement d\'une application mobile démarre à 3 000€ pour une app simple (React Native). Une application complète avec back-end, authentification et fonctionnalités avancées se situe entre 8 000€ et 25 000€ selon la complexité.',
      },
    },
    {
      '@type': 'Question',
      name: 'Développez-vous des apps iOS et Android ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui. Nous développons des applications cross-platform avec React Native, ce qui permet de couvrir iOS et Android avec une seule base de code, réduisant ainsi les coûts et les délais de développement.',
      },
    },
    {
      '@type': 'Question',
      name: 'Combien de temps faut-il pour développer une application mobile ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Une application simple est livrée en 6 à 10 semaines. Une application avec fonctionnalités avancées (géolocalisation, paiement, back-end custom) prend 3 à 6 mois selon le cahier des charges.',
      },
    },
    {
      '@type': 'Question',
      name: 'Publiez-vous l\'application sur l\'App Store et Google Play ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui. Nous gérons la publication complète sur l\'App Store (Apple) et le Google Play Store, y compris la création des comptes développeurs, les captures d\'écran, la description et la soumission aux équipes de validation.',
      },
    },
    {
      '@type': 'Question',
      name: 'Proposez-vous la maintenance d\'applications mobiles à Lyon ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui. Nous proposons des contrats de maintenance mensuelle : mises à jour des dépendances, compatibilité avec les nouvelles versions iOS/Android, corrections de bugs et évolutions fonctionnelles.',
      },
    },
  ],
}

const SERVICES = [
  { label: 'Application iOS & Android', desc: 'Développement React Native cross-platform — une app, deux stores. Performances natives.' },
  { label: 'Application mobile sur mesure', desc: 'Fonctionnalités métier spécifiques : géolocalisation, paiement, notifications push, API REST.' },
  { label: 'Design UI/UX mobile', desc: 'Maquettes Figma mobile-first, prototypage interactif, tests utilisateurs.' },
  { label: 'Back-end & API', desc: 'Serveur Node.js, base de données, authentification sécurisée, tableau de bord admin.' },
  { label: 'Publication App Store & Google Play', desc: 'Soumission, validation, fiches stores optimisées ASO pour maximiser les téléchargements.' },
  { label: 'Maintenance & évolutions', desc: 'Contrat mensuel : mises à jour, corrections, nouvelles fonctionnalités, monitoring.' },
]

const FAQS = [
  {
    q: 'Quel est le coût de développement d\'une application mobile à Lyon ?',
    a: 'Le développement d\'une application mobile démarre à 3 000€ pour une app simple (React Native). Une application complète avec back-end, authentification et fonctionnalités avancées se situe entre 8 000€ et 25 000€ selon la complexité du cahier des charges.',
  },
  {
    q: 'Développez-vous des apps iOS et Android ?',
    a: 'Oui. Nous développons des applications cross-platform avec React Native, ce qui permet de couvrir iOS et Android avec une seule base de code — réduisant les coûts et délais. Pour les apps nécessitant des performances maximales, nous développons également en natif Swift (iOS) ou Kotlin (Android).',
  },
  {
    q: 'Combien de temps faut-il pour développer une application mobile ?',
    a: 'Une application simple est livrée en 6 à 10 semaines. Une application avec fonctionnalités avancées (géolocalisation, paiement, back-end custom) prend 3 à 6 mois. Nous travaillons en sprints agiles avec des livrables intermédiaires visibles.',
  },
  {
    q: 'Publiez-vous l\'application sur l\'App Store et Google Play ?',
    a: 'Oui. Nous gérons la publication complète sur l\'App Store et le Google Play Store : création des comptes développeurs, captures d\'écran, description optimisée ASO et soumission aux équipes de validation Apple et Google.',
  },
  {
    q: 'Proposez-vous la maintenance d\'applications mobiles à Lyon ?',
    a: 'Oui. Nos contrats de maintenance couvrent : mises à jour des dépendances, compatibilité avec les nouvelles versions iOS et Android, corrections de bugs et évolutions fonctionnelles. Tarifs à partir de 200€/mois.',
  },
]

export default function ApplicationMobileLyonPage() {
  return (
    <>
      <Script
        id="schema-app-mobile-lyon"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
        strategy="beforeInteractive"
      />
      <Script
        id="schema-webpage-app-mobile-lyon"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBPAGE_SCHEMA) }}
        strategy="beforeInteractive"
      />
      <Script
        id="schema-faq-app-mobile-lyon"
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
            <Image src="/images/work-2.webp" alt="" fill className="object-cover" priority />
            <div className="absolute inset-0" style={{ background: 'rgba(10,10,10,0.84)' }} />
          </div>
          <div className="relative z-10 max-w-[1200px] mx-auto">
            <p
              style={{ letterSpacing: '0.45em', fontSize: '11px' }}
              className="uppercase text-white/30 font-bold mb-6"
            >
              Alhambra Web · Développement mobile Lyon
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
              Application<br />
              <span style={{ color: 'rgba(248,246,242,0.2)', fontStyle: 'italic' }}>Mobile Lyon</span>
            </h1>
            <p
              style={{ fontFamily: 'var(--font-haas)', fontSize: 'clamp(16px,2vw,20px)', color: 'rgba(248,246,242,0.55)', lineHeight: 1.65, maxWidth: '620px' }}
              className="mt-8 mb-10"
            >
              Nous développons des applications mobiles iOS et Android sur-mesure pour les
              entreprises de Lyon et de toute la région. React Native, design premium,
              publication App Store & Google Play incluse.
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
              {[['iOS + Android', 'Cross-platform'], ['6–10 sem.', 'App simple'], ['Dès 3 000€', 'Développement']].map(([val, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(18px,2.5vw,28px)', color: '#F8F6F2', lineHeight: 1.1 }}>
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
