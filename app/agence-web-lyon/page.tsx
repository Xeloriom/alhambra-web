import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'

const BASE = 'https://www.alhambra-web.com'
const PAGE_URL = `${BASE}/agence-web-lyon`

export const metadata: Metadata = {
  title: 'Agence Web Lyon — Création Site & Design UI/UX',
  description: 'Agence web à Lyon : création de sites sur-mesure, design UI/UX, développement Next.js. Lighthouse 95+ garanti. Sites vitrines dès 800€. Devis gratuit 24h.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: PAGE_URL,
    siteName: 'Alhambra Web',
    title: 'Agence Web Lyon — Création Site Web & Design UI/UX | Alhambra',
    description: 'Agence web premium à Lyon. Création de sites sur-mesure, design UI/UX & développement Next.js. Lighthouse 95+ garanti, dès 800€. Devis gratuit 24h.',
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

export default function AgenceWebLyonPage() {
  return (
    <>
      <Script
        id="schema-agence-web-lyon"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
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

        {/* ── CONTENT ── */}
        <article style={{ background: '#FFFFFF', color: '#0A0A0A' }} className="px-6 sm:px-10 lg:px-20 py-20 sm:py-28">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <div>
                <h2
                  style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(28px,4vw,48px)', letterSpacing: '-0.02em', lineHeight: 1.05 }}
                  className="mb-6"
                >
                  Votre agence web à Lyon,<br />
                  <span style={{ color: 'rgba(10,10,10,0.25)', fontStyle: 'italic' }}>sans compromis.</span>
                </h2>
                <div style={{ fontFamily: 'var(--font-haas)', color: 'rgba(10,10,10,0.6)', lineHeight: 1.8, fontSize: '15px' }} className="space-y-4">
                  <p>
                    Alhambra Web est une agence digitale installée à Lyon, au cœur de la métropole
                    lyonnaise. Depuis 2017, nous accompagnons entrepreneurs, PME et grandes marques
                    dans leur transformation numérique — de Villeurbanne à Vénissieux, de Caluire
                    à Bron.
                  </p>
                  <p>
                    Notre approche est simple : chaque projet mérite un design pensé sur-mesure,
                    un code propre et des performances qui forcent le respect. Pas de templates,
                    pas de raccourcis. Seulement du travail qui se remarque.
                  </p>
                  <p>
                    Que vous soyez un artisan de Décines-Charpieu cherchant votre premier site
                    vitrine, ou une startup lyonnaise prête à lancer sa plateforme SaaS, nous
                    adaptons notre expertise à votre réalité et votre budget.
                  </p>
                </div>
              </div>

              {/* Services */}
              <div>
                <h2
                  style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(20px,2.5vw,28px)', letterSpacing: '-0.01em' }}
                  className="mb-6"
                >
                  Nos services à Lyon
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
          </div>
        </article>

        {/* ── FAQ ── */}
        <section style={{ background: '#F5F4F0', color: '#0A0A0A' }} className="px-6 sm:px-10 lg:px-20 py-20 sm:py-28">
          <div className="max-w-[800px] mx-auto">
            <h2
              style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(24px,3.5vw,40px)', letterSpacing: '-0.02em' }}
              className="mb-10"
            >
              Questions fréquentes — Agence Web Lyon
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
            Lançons votre<br />
            <span style={{ color: 'rgba(248,246,242,0.22)', fontStyle: 'italic' }}>projet à Lyon.</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-haas)', color: 'rgba(248,246,242,0.45)', fontSize: '15px' }} className="mb-10 max-w-md mx-auto">
            Devis gratuit sous 24h · Sites vitrines dès 800€ · Livraison 2–8 semaines
          </p>
          <a
            href="/#contact"
            style={{ background: '#F8F6F2', color: '#0A0A0A', fontFamily: 'var(--font-haas)' }}
            className="inline-block px-10 py-5 rounded-full text-sm font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors"
          >
            Nous contacter
          </a>
        </section>
      </main>
    </>
  )
}
