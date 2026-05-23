import Image from 'next/image'
import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'
import { SeoNav } from '@/components/seo-nav'

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

        {/* ── CONTENT ── */}
        <article style={{ background: '#FFFFFF', color: '#0A0A0A' }} className="px-6 sm:px-10 lg:px-20 py-20 sm:py-28">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <div>
                <h2
                  style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(28px,4vw,48px)', letterSpacing: '-0.02em', lineHeight: 1.05 }}
                  className="mb-6"
                >
                  Agence de développement<br />
                  <span style={{ color: 'rgba(10,10,10,0.25)', fontStyle: 'italic' }}>mobile à Lyon.</span>
                </h2>
                <div style={{ fontFamily: 'var(--font-haas)', color: 'rgba(10,10,10,0.6)', lineHeight: 1.8, fontSize: '15px' }} className="space-y-4">
                  <p>
                    Alhambra Web conçoit et développe des applications mobiles pour les
                    entreprises lyonnaises et régionales. De l'idée à la publication sur
                    les stores, nous gérons l'intégralité du projet en interne.
                  </p>
                  <p>
                    Nous utilisons React Native pour livrer une application iOS et Android
                    à partir d'une seule base de code — ce qui divise les coûts par deux
                    sans sacrifier les performances ni l'expérience utilisateur.
                  </p>
                  <p>
                    Chaque application est accompagnée d'un back-end robuste, d'un tableau
                    de bord administrateur et d'une stratégie d'optimisation sur les stores
                    (ASO) pour maximiser les téléchargements dès le lancement.
                  </p>
                </div>
              </div>

              {/* Services */}
              <div>
                <h2
                  style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(20px,2.5vw,28px)', letterSpacing: '-0.01em' }}
                  className="mb-6"
                >
                  Nos services mobile
                </h2>
                <ul className="space-y-3">
                  {SERVICES.map((s) => (
                    <li
                      key={s.label}
                      className="flex gap-4 p-4 rounded-2xl border border-black/8 hover:border-black/20 transition-colors"
                    >
                      <span
                        style={{ width: '6px', height: '6px', background: '#0A0A0A', borderRadius: '50%', flexShrink: 0, marginTop: '7px' }}
                      />
                      <div>
                        <strong style={{ fontFamily: 'var(--font-haas)', fontSize: '14px', fontWeight: 700, display: 'block', marginBottom: '2px' }}>
                          {s.label}
                        </strong>
                        <span style={{ fontFamily: 'var(--font-haas)', fontSize: '13px', color: 'rgba(10,10,10,0.5)' }}>
                          {s.desc}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Internal links */}
            <div className="mt-16 pt-10 border-t border-black/8">
              <p style={{ fontFamily: 'var(--font-haas)', fontSize: '13px', color: 'rgba(10,10,10,0.4)' }} className="mb-4 uppercase tracking-[0.2em]">
                Nos autres services
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { href: '/agence-logiciel-lyon/', label: 'Logiciel sur mesure Lyon' },
                  { href: '/agence-web-lyon/', label: 'Agence Web Lyon' },
                  { href: '/agence-seo-lyon/', label: 'Agence SEO Lyon' },
                  { href: '/creation-site-web-lyon/', label: 'Création Site Web Lyon' },
                  { href: '/agence-web-rhone-alpes/', label: 'Agence Web Rhône-Alpes' },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    style={{ fontFamily: 'var(--font-haas)', fontSize: '13px' }}
                    className="px-4 py-2 rounded-full border border-black/10 hover:border-black/30 transition-colors text-black/60 hover:text-black"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* ── FAQ ── */}
        <section style={{ background: '#F5F4F0', color: '#0A0A0A' }} className="px-6 sm:px-10 lg:px-20 py-20 sm:py-28">
          <div className="max-w-[800px] mx-auto">
            <h2
              style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(24px,3.5vw,40px)', letterSpacing: '-0.02em' }}
              className="mb-10"
            >
              Questions fréquentes — App Mobile Lyon
            </h2>
            <div className="space-y-6">
              {FAQS.map((faq) => (
                <details
                  key={faq.q}
                  className="group border-b border-black/10 pb-6"
                >
                  <summary
                    style={{ fontFamily: 'var(--font-haas)', fontSize: '15px', fontWeight: 700, cursor: 'pointer', listStyle: 'none' }}
                    className="flex justify-between items-start gap-4"
                  >
                    <h3 style={{ fontFamily: 'var(--font-haas)', fontWeight: 700, fontSize: '15px' }}>{faq.q}</h3>
                    <span className="text-black/30 flex-shrink-0 text-lg leading-none">+</span>
                  </summary>
                  <p style={{ fontFamily: 'var(--font-haas)', fontSize: '14px', color: 'rgba(10,10,10,0.6)', lineHeight: 1.75 }} className="mt-4">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section
          style={{ background: '#0A0A0A', color: '#F8F6F2' }}
          className="px-6 sm:px-10 lg:px-20 py-24 sm:py-32 text-center"
        >
          <h2
            style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(36px,6vw,80px)', lineHeight: 0.9, letterSpacing: '-0.03em' }}
            className="mb-6"
          >
            Donnons vie à<br />
            <span style={{ color: 'rgba(248,246,242,0.22)', fontStyle: 'italic' }}>votre app mobile.</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-haas)', color: 'rgba(248,246,242,0.45)', fontSize: '15px' }} className="mb-10 max-w-md mx-auto">
            Devis gratuit sous 24h · iOS & Android · Publication stores incluse
          </p>
          <a
            href="/#contact"
            style={{ background: '#F8F6F2', color: '#0A0A0A', fontFamily: 'var(--font-haas)' }}
            className="inline-block px-10 py-5 rounded-full text-sm font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors"
          >
            Démarrer le projet
          </a>
        </section>
      </main>
    </>
  )
}
