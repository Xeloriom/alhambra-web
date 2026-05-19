import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'

const BASE = 'https://www.alhambra-web.com'
const PAGE_URL = `${BASE}/agence-web-pont-de-cheruy`

export const metadata: Metadata = {
  title: 'Agence Web Pont-de-Chéruy — Création Site Web Isère | Alhambra',
  description: 'Agence web à Pont-de-Chéruy (Isère 38) : création de sites sur-mesure, design UI/UX, développement Next.js. Lighthouse 95+ garanti. Dès 200€. Devis gratuit 24h.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: PAGE_URL,
    siteName: 'Alhambra Web',
    title: 'Agence Web Pont-de-Chéruy — Création Site Web Isère | Alhambra',
    description: 'Agence web premium intervenant à Pont-de-Chéruy (38) et dans tout le nord-Isère. Sites vitrines, menus digitaux, e-commerce. Dès 200€. Devis gratuit 24h.',
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
        id="schema-faq-pont-de-cheruy"
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

        {/* ── CONTENT ── */}
        <article style={{ background: '#FFFFFF', color: '#0A0A0A' }} className="px-6 sm:px-10 lg:px-20 py-20 sm:py-28">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <div>
                <h2
                  style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(26px,3.5vw,44px)', letterSpacing: '-0.02em', lineHeight: 1.05 }}
                  className="mb-6"
                >
                  Votre site web à<br />
                  <span style={{ color: 'rgba(10,10,10,0.25)', fontStyle: 'italic' }}>Pont-de-Chéruy.</span>
                </h2>
                <div style={{ fontFamily: 'var(--font-haas)', color: 'rgba(10,10,10,0.6)', lineHeight: 1.8, fontSize: '15px' }} className="space-y-4">
                  <p>
                    Alhambra Web accompagne les commerces, artisans, PME et associations de
                    Pont-de-Chéruy et du nord-Isère dans leur présence digitale. Nous nous déplaçons
                    directement dans votre commune pour les réunions et la livraison.
                  </p>
                  <p>
                    Un menu sur écran TV pour votre restaurant ? Un site vitrine pour votre artisanat ?
                    Une boutique en ligne pour vos produits ? Nous réalisons chaque projet avec la
                    même exigence : code sur-mesure, design professionnel, performances garanties.
                  </p>
                  <p>
                    Nous intervenons aussi à Charvieu-Chavagneux, Chavanoz, Villette-d&apos;Anthon,
                    Tignieu-Jameyzieu et dans tout le nord-Isère. Tarifs adaptés aux budgets locaux,
                    sans minimum imposé.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-2">
                  {['Pont-de-Chéruy', 'Charvieu-Chavagneux', 'Chavanoz', 'Tignieu-Jameyzieu', 'Meyzieu', 'Nord-Isère'].map(city => (
                    <span
                      key={city}
                      style={{ fontFamily: 'var(--font-haas)', fontSize: '12px', background: '#F5F4F0', borderRadius: '100px', padding: '4px 12px' }}
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2
                  style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(20px,2.5vw,28px)', letterSpacing: '-0.01em' }}
                  className="mb-6"
                >
                  Nos services à Pont-de-Chéruy
                </h2>
                <ul className="space-y-3">
                  {SERVICES.map((s) => (
                    <li
                      key={s.label}
                      className="flex gap-4 p-4 rounded-2xl border border-black/8 hover:border-black/20 transition-colors"
                    >
                      <span style={{ width: '6px', height: '6px', background: '#0A0A0A', borderRadius: '50%', flexShrink: 0, marginTop: '7px' }} />
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
              style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(22px,3vw,38px)', letterSpacing: '-0.02em' }}
              className="mb-10"
            >
              Questions fréquentes — Agence Web Pont-de-Chéruy
            </h2>
            <div className="space-y-6">
              {FAQS.map((faq) => (
                <details key={faq.q} className="group border-b border-black/10 pb-6">
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

        {/* ── INTERNAL LINKS ── */}
        <section style={{ background: '#FFFFFF' }} className="px-6 sm:px-10 lg:px-20 py-14 border-t border-black/5">
          <div className="max-w-[1200px] mx-auto">
            <p style={{ fontFamily: 'var(--font-haas)', fontSize: '12px', color: 'rgba(10,10,10,0.3)', letterSpacing: '0.3em', textTransform: 'uppercase' }} className="mb-5">
              Zones d&apos;intervention
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Agence Web Lyon', href: '/agence-web-lyon/' },
                { label: 'Agence Web Ain', href: '/agence-web-ain/' },
                { label: 'Agence Web Isère', href: '/agence-web-isere/' },
                { label: 'Agence Web Villeurbanne', href: '/agence-web-villeurbanne/' },
                { label: 'Agence Web Rhône-Alpes', href: '/agence-web-rhone-alpes/' },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  style={{ fontFamily: 'var(--font-haas)', fontSize: '13px', color: 'rgba(10,10,10,0.5)', borderBottom: '1px solid rgba(10,10,10,0.15)' }}
                  className="hover:text-black transition-colors pb-0.5"
                >
                  {label}
                </Link>
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
            style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(32px,5.5vw,72px)', lineHeight: 0.9, letterSpacing: '-0.03em' }}
            className="mb-6"
          >
            Votre projet à<br />
            <span style={{ color: 'rgba(248,246,242,0.22)', fontStyle: 'italic' }}>Pont-de-Chéruy.</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-haas)', color: 'rgba(248,246,242,0.45)', fontSize: '15px' }} className="mb-10 max-w-md mx-auto">
            Devis gratuit sous 24h · Menu digital dès 200€ · Sites vitrines dès 800€
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
