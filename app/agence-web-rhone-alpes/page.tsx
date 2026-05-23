import Image from 'next/image'
import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'
import { FooterSection } from '@/components/footer-section'

const BASE = 'https://www.alhambra-web.com'
const PAGE_URL = `${BASE}/agence-web-rhone-alpes`

export const metadata: Metadata = {
  title: 'Agence Web Rhône-Alpes — Auvergne-Rhône-Alpes',
  description: 'Agence web Rhône-Alpes — Lyon, Grenoble, Annecy, Chambéry. Sites sur-mesure, design UI/UX, Next.js. Dès 800€.',
  alternates: { canonical: PAGE_URL, languages: { 'fr': PAGE_URL, 'fr-FR': PAGE_URL } },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: PAGE_URL,
    siteName: 'Alhambra Web',
    title: 'Agence Web Rhône-Alpes — Auvergne-Rhône-Alpes | Alhambra',
    description: "Agence web Rhône-Alpes — Lyon, Grenoble, Annecy, Chambéry. Sites sur-mesure, UI/UX. Lighthouse 95+. Dès 800€.",
    images: [{ url: `${BASE}/image%201.png`, width: 1200, height: 630, alt: 'Agence Web Rhône-Alpes — Alhambra' }],
  },
}

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${PAGE_URL}/#business`,
  name: 'Alhambra Web — Agence Web Auvergne-Rhône-Alpes',
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
    { '@type': 'City', name: 'Grenoble' },
    { '@type': 'City', name: 'Annecy' },
    { '@type': 'City', name: 'Chambéry' },
    { '@type': 'City', name: 'Valence' },
    { '@type': 'City', name: 'Clermont-Ferrand' },
    { '@type': 'City', name: 'Saint-Étienne' },
    { '@type': 'AdministrativeArea', name: 'Auvergne-Rhône-Alpes' },
    { '@type': 'AdministrativeArea', name: 'Rhône-Alpes' },
    { '@type': 'Country', name: 'France' },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    reviewCount: '12',
    bestRating: '5',
  },
}

const CITIES = [
  { city: 'Lyon', dept: 'Rhône (69)', desc: 'Notre siège. Nous y accompagnons startups, PME et grandes marques.' },
  { city: 'Grenoble', dept: 'Isère (38)', desc: 'Technopole de référence : biotech, deep tech, entreprises innovantes.' },
  { city: 'Annecy', dept: 'Haute-Savoie (74)', desc: 'Tourisme, sport outdoor, hôtellerie : sites haut de gamme.' },
  { city: 'Chambéry', dept: 'Savoie (73)', desc: 'Commerces, artisans, institutions : présence locale forte.' },
  { city: 'Valence', dept: 'Drôme (26)', desc: 'Industrie, agro-alimentaire, services : sites performants.' },
  { city: 'Saint-Étienne', dept: 'Loire (42)', desc: 'Reconversion industrielle, design, créativité stéphanoise.' },
]

const FAQS = [
  {
    q: "Votre agence web intervient-elle hors de Lyon en Rhône-Alpes ?",
    a: "Oui. Alhambra Web opère dans toute la région Auvergne-Rhône-Alpes. Nous avons des clients à Grenoble, Annecy, Chambéry, Valence et Saint-Étienne. La proximité géographique facilite les échanges, mais nous travaillons aussi très efficacement en full remote.",
  },
  {
    q: "Pourquoi choisir une agence lyonnaise pour un projet en Rhône-Alpes ?",
    a: "Lyon est le hub digital de la région : une heure de Grenoble, 45 minutes d'Annecy par le train, 1h30 de Chambéry. Nos équipes se déplacent facilement. Et techniquement, nous apportons la même expertise à un client stéphanois qu'à un client lyonnais.",
  },
  {
    q: "Quels types d'entreprises accompagnez-vous en Auvergne-Rhône-Alpes ?",
    a: "Notre clientèle régionale est très diverse : startups grenobloises, hôtels savoyards, cabinets médicaux valentinois, commerces annéciens, associations clermontoise. Toutes partagent un point commun : elles veulent un site web qui fonctionne vraiment, pas une vitrine vide.",
  },
  {
    q: "Proposez-vous des sites web multilingues pour les entreprises touristiques des Alpes ?",
    a: "Oui. Pour les hôtels, stations de ski, hébergements et prestataires touristiques des Alpes, nous créons des sites web en français, anglais et allemand. Contenu traduit, URL multilingues, hreflang correct — visible dans tous les pays.",
  },
  {
    q: "Y a-t-il des tarifs spéciaux pour les associations de la région ?",
    a: "Nous appliquons des tarifs adaptés aux associations loi 1901 et aux structures à but non lucratif de la région. Contactez-nous pour discuter de votre situation — nous trouvons toujours une solution juste.",
  },
]


const WEBPAGE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${PAGE_URL}/#webpage`,
  'url': `${PAGE_URL}/`,
  'name': 'Agence Web Rhône-Alpes — Auvergne-Rhône-Alpes | Alhambra',
  'inLanguage': 'fr-FR',
  'dateModified': '2026-05-19',
  'datePublished': '2026-01-01',
  'isPartOf': { '@id': 'https://www.alhambra-web.com/#website' },
  'about': { '@id': 'https://www.alhambra-web.com/#organization' },
}

export default function AgenceWebRhoneAlpesPage() {
  return (
    <>
      <Script
        id="schema-agence-web-rhone-alpes"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
        strategy="beforeInteractive"
      />
      <Script
        id="schema-webpage-agence-web-rhone-alpes"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBPAGE_SCHEMA) }}
        strategy="beforeInteractive"
      />

      <SiteNav />
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
              Alhambra Web · Auvergne-Rhône-Alpes, France
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-nordique)',
                fontSize: 'clamp(38px, 7vw, 100px)',
                lineHeight: 0.9,
                letterSpacing: '-0.03em',
              }}
            >
              Agence Web<br />
              <span style={{ color: 'rgba(248,246,242,0.2)', fontStyle: 'italic' }}>Rhône-Alpes</span>
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-haas)',
                fontSize: 'clamp(16px,2vw,20px)',
                color: 'rgba(248,246,242,0.55)',
                lineHeight: 1.65,
                maxWidth: '640px',
              }}
              className="mt-8 mb-10"
            >
              De Lyon à Grenoble, d'Annecy à Valence : nous créons des sites web premium
              pour les entreprises et entrepreneurs de toute la région Auvergne-Rhône-Alpes.
              Résultat mesurable, code livré, Lighthouse 95+ garanti.
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
              {[['12+', 'Départements'], ['95+', 'Lighthouse'], ['Dès 800€', 'Site vitrine']].map(([val, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(22px,3vw,36px)', color: '#F8F6F2' }}>
                    {val}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-white/30 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CITIES GRID ── */}
        <section style={{ background: '#FFFFFF', color: '#0A0A0A' }} className="px-6 sm:px-10 lg:px-20 py-20 sm:py-28">
          <div className="max-w-[1200px] mx-auto">
            <h2
              style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(28px,4vw,52px)', letterSpacing: '-0.02em', lineHeight: 1.05 }}
              className="mb-12"
            >
              Nous intervenons partout<br />
              <span style={{ color: 'rgba(10,10,10,0.25)', fontStyle: 'italic' }}>en Auvergne-Rhône-Alpes.</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {CITIES.map((c) => (
                <div
                  key={c.city}
                  className="p-7 rounded-[20px] border border-black/8 hover:border-black/25 transition-colors"
                >
                  <h3
                    style={{ fontFamily: 'var(--font-nordique)', fontSize: '22px', letterSpacing: '-0.01em' }}
                    className="mb-1"
                  >
                    {c.city}
                  </h3>
                  <div
                    style={{ fontFamily: 'var(--font-haas)', fontSize: '11px', color: 'rgba(10,10,10,0.35)', letterSpacing: '0.12em' }}
                    className="uppercase mb-3"
                  >
                    {c.dept}
                  </div>
                  <p style={{ fontFamily: 'var(--font-haas)', fontSize: '13px', color: 'rgba(10,10,10,0.55)', lineHeight: 1.65 }}>
                    {c.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTENT ── */}
        <article style={{ background: '#F5F4F0', color: '#0A0A0A' }} className="px-6 sm:px-10 lg:px-20 py-20 sm:py-28">
          <div className="max-w-[800px] mx-auto">
            <h2
              style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(28px,4vw,48px)', letterSpacing: '-0.02em', lineHeight: 1.05 }}
              className="mb-6"
            >
              L'agence web régionale<br />
              <span style={{ color: 'rgba(10,10,10,0.25)', fontStyle: 'italic' }}>à l'ambition nationale.</span>
            </h2>
            <div style={{ fontFamily: 'var(--font-haas)', color: 'rgba(10,10,10,0.6)', lineHeight: 1.8, fontSize: '15px' }} className="space-y-4">
              <p>
                Auvergne-Rhône-Alpes est la deuxième région économique de France. Avec 8 millions
                d'habitants, un tissu entrepreneurial dense et une culture de l'excellence —
                de l'industrie alpine aux biotechs grenobloises — les entreprises régionales
                méritent des sites web à la hauteur de leur ambition.
              </p>
              <p>
                Alhambra Web est basé à Lyon et rayonne sur toute la région. Notre approche :
                des sites web sur-mesure, sans compromis sur la technique. Stack Next.js 16,
                React 19, TypeScript, Tailwind CSS v4. Animations Framer Motion. Score Lighthouse
                95+ garanti sur chaque livraison.
              </p>
              <p>
                Que vous soyez une startup grenobloise, un hôtel annécien, un cabinet comptable
                valentinois ou un artisan savoyard, nous adaptons notre méthode et nos tarifs
                à votre réalité. Sites vitrines dès 800€, livraison en 2 à 8 semaines.
              </p>
            </div>
          </div>
        </article>

        {/* ── FAQ ── */}
        <section style={{ background: '#FFFFFF', color: '#0A0A0A' }} className="px-6 sm:px-10 lg:px-20 py-20 sm:py-28">
          <div className="max-w-[800px] mx-auto">
            <h2
              style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(24px,3.5vw,40px)', letterSpacing: '-0.02em' }}
              className="mb-10"
            >
              Questions fréquentes — Rhône-Alpes
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
            Votre projet digital<br />
            <span style={{ color: 'rgba(248,246,242,0.22)', fontStyle: 'italic' }}>en Rhône-Alpes.</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-haas)', color: 'rgba(248,246,242,0.45)', fontSize: '15px' }} className="mb-10 max-w-md mx-auto">
            Lyon · Grenoble · Annecy · Chambéry · Valence · Sites dès 800€ · Devis 24h
          </p>
          <a
            href="/#contact"
            style={{ background: '#F8F6F2', color: '#0A0A0A', fontFamily: 'var(--font-haas)' }}
            className="inline-block px-10 py-5 rounded-full text-sm font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors"
          >
            Lancer mon projet
          </a>
        </section>
        <FooterSection />
      </main>
    </>
  )
}
