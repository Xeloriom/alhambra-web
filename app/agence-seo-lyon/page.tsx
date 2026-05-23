import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'

const BASE = 'https://www.alhambra-web.com'
const PAGE_URL = `${BASE}/agence-seo-lyon`

export const metadata: Metadata = {
  title: 'Agence SEO Lyon — Référencement Web & Visibilité Google',
  description: 'Agence SEO à Lyon — référencement naturel, audit technique, Google My Business. Résultats durables. Dès 400€.',
  alternates: { canonical: PAGE_URL, languages: { 'fr': PAGE_URL, 'fr-FR': PAGE_URL } },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: PAGE_URL,
    siteName: 'Alhambra Web',
    title: 'Agence SEO Lyon — Référencement & Visibilité Google',
    description: 'Agence SEO Lyon — référencement naturel, audit technique, Google My Business. Résultats durables. Dès 400€.',
    images: [{ url: `${BASE}/image%201.png`, width: 1200, height: 630, alt: 'Agence SEO Lyon — Alhambra' }],
  },
}

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${PAGE_URL}/#business`,
  name: 'Alhambra Web — Agence SEO Lyon',
  url: BASE,
  image: `${BASE}/image%201.png`,
  priceRange: 'Dès 400€',
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
  name: 'Agence SEO Lyon — Référencement Web & Visibilité Google | Alhambra',
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
      name: 'Qu\'est-ce que le référencement naturel (SEO) ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Le SEO (Search Engine Optimization) est l\'ensemble des techniques qui améliorent la position d\'un site dans les résultats Google sans payer la publicité. Un bon référencement génère du trafic gratuit et durable sur le long terme.',
      },
    },
    {
      '@type': 'Question',
      name: 'Combien coûte le SEO à Lyon ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nos prestations SEO démarrent à 400€ pour un audit technique complet. Une campagne SEO mensuelle (optimisation + suivi) est disponible dès 300€/mois. Chaque devis est personnalisé selon la taille du site et les objectifs.',
      },
    },
    {
      '@type': 'Question',
      name: 'Combien de temps pour voir des résultats SEO ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Les premiers effets sont visibles en 2 à 3 mois. Une progression significative des positions se constate généralement entre 4 et 6 mois selon la concurrence sur vos mots-clés cibles.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quelle est la différence entre SEO et Google Ads ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Google Ads génère du trafic immédiat mais payant — dès que vous arrêtez de payer, le trafic s\'arrête. Le SEO prend plus de temps mais ses effets sont durables : une fois bien positionné, vous continuez à recevoir des visites sans coût publicitaire.',
      },
    },
    {
      '@type': 'Question',
      name: 'Proposez-vous l\'optimisation Google My Business à Lyon ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui. Nous optimisons votre fiche Google My Business : catégories, photos, avis, horaires, posts réguliers. Une fiche GMB bien tenue peut multiplier par 3 les appels et visites depuis Google Maps.',
      },
    },
  ],
}

const SERVICES = [
  { label: 'Audit SEO technique', desc: 'Analyse complète : vitesse, crawl, structure, Core Web Vitals. Rapport actionnable livré sous 48h.' },
  { label: 'Référencement local Lyon', desc: 'Optimisation Google My Business, citations locales, mots-clés géolocalisés.' },
  { label: 'SEO on-page', desc: 'Balises, H1-H6, méta descriptions, maillage interne, schema JSON-LD structuré.' },
  { label: 'Création de contenu SEO', desc: 'Pages de destination, articles de blog optimisés pour les mots-clés à fort potentiel.' },
  { label: 'Netlinking & backlinks', desc: 'Acquisition de liens de qualité depuis des sites français à forte autorité de domaine.' },
  { label: 'Suivi & reporting mensuel', desc: 'Rapport de positions, trafic organique, Core Web Vitals. Ajustements chaque mois.' },
]

const FAQS = [
  {
    q: 'Qu\'est-ce que le référencement naturel (SEO) ?',
    a: 'Le SEO (Search Engine Optimization) regroupe toutes les techniques qui améliorent la visibilité d\'un site dans les résultats Google sans passer par la publicité payante. Un bon référencement génère du trafic gratuit, qualifié et durable sur le long terme.',
  },
  {
    q: 'Combien coûte le SEO à Lyon ?',
    a: 'Nos prestations SEO démarrent à 400€ pour un audit technique complet. Une campagne SEO mensuelle (optimisation continue + suivi) est disponible dès 300€/mois. Chaque devis est personnalisé selon la taille du site et vos objectifs de visibilité.',
  },
  {
    q: 'Combien de temps pour voir des résultats SEO ?',
    a: 'Les premiers effets sont visibles en 2 à 3 mois. Une progression significative des positions se constate entre 4 et 6 mois selon la concurrence sur vos mots-clés cibles. Le SEO est un investissement long terme — mais ses effets se cumulent.',
  },
  {
    q: 'Quelle est la différence entre SEO et Google Ads ?',
    a: 'Google Ads génère du trafic immédiat mais coûteux — dès que vous arrêtez de payer, le trafic disparaît. Le SEO prend plus de temps mais ses effets sont durables : une fois bien positionné, vous continuez à recevoir des visites sans coût publicitaire.',
  },
  {
    q: 'Proposez-vous l\'optimisation Google My Business à Lyon ?',
    a: 'Oui. Nous optimisons votre fiche Google My Business : catégories, photos, avis, horaires, publications régulières. Une fiche GMB bien tenue peut multiplier par 3 les appels et visites depuis Google Maps.',
  },
]

export default function AgenceSeoLyonPage() {
  return (
    <>
      <Script
        id="schema-agence-seo-lyon"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
        strategy="beforeInteractive"
      />
      <Script
        id="schema-webpage-agence-seo-lyon"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBPAGE_SCHEMA) }}
        strategy="beforeInteractive"
      />
      <Script
        id="schema-faq-agence-seo-lyon"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
        strategy="beforeInteractive"
      />

      <main>
        {/* ── HERO ── */}
        <section
          style={{ background: '#0A0A0A', color: '#F8F6F2' }}
          className="px-6 sm:px-10 lg:px-20 pt-28 pb-24 sm:pt-36 sm:pb-32"
        >
          <div className="max-w-[1200px] mx-auto">
            <p
              style={{ letterSpacing: '0.45em', fontSize: '11px' }}
              className="uppercase text-white/30 font-bold mb-6"
            >
              Alhambra Web · Agence de référencement Lyon
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
              Agence SEO<br />
              <span style={{ color: 'rgba(248,246,242,0.2)', fontStyle: 'italic' }}>Lyon</span>
            </h1>
            <p
              style={{ fontFamily: 'var(--font-haas)', fontSize: 'clamp(16px,2vw,20px)', color: 'rgba(248,246,242,0.55)', lineHeight: 1.65, maxWidth: '620px' }}
              className="mt-8 mb-10"
            >
              Nous positionnons vos pages en tête de Google grâce au référencement naturel.
              Audit technique, optimisation on-page, création de contenu, netlinking —
              une stratégie SEO complète et mesurable dès le premier mois.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <a
                href="/#contact"
                style={{ background: '#F8F6F2', color: '#0A0A0A', fontFamily: 'var(--font-haas)' }}
                className="inline-block px-8 py-4 rounded-full text-sm font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors"
              >
                Audit SEO gratuit
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
              {[['95+', 'Score Lighthouse'], ['4–6 mois', 'Premiers résultats'], ['Dès 400€', 'Audit SEO']].map(([val, label]) => (
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

        {/* ── CONTENT ── */}
        <article style={{ background: '#FFFFFF', color: '#0A0A0A' }} className="px-6 sm:px-10 lg:px-20 py-20 sm:py-28">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <div>
                <h2
                  style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(28px,4vw,48px)', letterSpacing: '-0.02em', lineHeight: 1.05 }}
                  className="mb-6"
                >
                  Votre agence de référencement<br />
                  <span style={{ color: 'rgba(10,10,10,0.25)', fontStyle: 'italic' }}>à Lyon.</span>
                </h2>
                <div style={{ fontFamily: 'var(--font-haas)', color: 'rgba(10,10,10,0.6)', lineHeight: 1.8, fontSize: '15px' }} className="space-y-4">
                  <p>
                    Alhambra Web est une agence web SEO basée à Lyon. Nous combinons la création
                    de sites performants et le référencement naturel pour vous apporter une visibilité
                    durable sur Google — sans dépendre d'un budget publicitaire.
                  </p>
                  <p>
                    Notre approche SEO est technique et éditoriale à la fois : optimisation du code,
                    Core Web Vitals, architecture du site, contenu optimisé et backlinks de qualité.
                    Chaque levier est activé dans le bon ordre pour des résultats solides.
                  </p>
                  <p>
                    Que vous soyez un restaurant lyonnais, une PME en Isère ou une startup en
                    pleine croissance, nous adaptons la stratégie SEO à votre secteur et à
                    votre concurrence réelle sur Google.
                  </p>
                </div>
              </div>

              {/* Services */}
              <div>
                <h2
                  style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(20px,2.5vw,28px)', letterSpacing: '-0.01em' }}
                  className="mb-6"
                >
                  Nos services SEO à Lyon
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
                  { href: '/agence-web-lyon/', label: 'Agence Web Lyon' },
                  { href: '/creation-site-web-lyon/', label: 'Création Site Web Lyon' },
                  { href: '/agence-web-villeurbanne/', label: 'Agence Web Villeurbanne' },
                  { href: '/creation-site-web-restaurant/', label: 'Site Web Restaurant' },
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
              Questions fréquentes — Agence SEO Lyon
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
            Montez en première<br />
            <span style={{ color: 'rgba(248,246,242,0.22)', fontStyle: 'italic' }}>page Google.</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-haas)', color: 'rgba(248,246,242,0.45)', fontSize: '15px' }} className="mb-10 max-w-md mx-auto">
            Audit SEO gratuit · Résultats mesurables · Stratégie sur-mesure
          </p>
          <a
            href="/#contact"
            style={{ background: '#F8F6F2', color: '#0A0A0A', fontFamily: 'var(--font-haas)' }}
            className="inline-block px-10 py-5 rounded-full text-sm font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors"
          >
            Demander un audit SEO
          </a>
        </section>
      </main>
    </>
  )
}
