import Image from 'next/image'
import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'
import { SeoNav } from '@/components/seo-nav'
import { FooterSection } from '@/components/footer-section'

const BASE = 'https://www.alhambra-web.com'
const PAGE_URL = `${BASE}/agence-web-villeurbanne`

export const metadata: Metadata = {
  title: 'Agence Web Villeurbanne — Création Site Web & UI/UX',
  description: 'Agence web à Villeurbanne (69) — sites sur-mesure, design UI/UX, Next.js. Lighthouse 95+ garanti. Dès 800€.',
  alternates: { canonical: PAGE_URL, languages: { 'fr': PAGE_URL, 'fr-FR': PAGE_URL } },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: PAGE_URL,
    siteName: 'Alhambra Web',
    title: 'Agence Web Villeurbanne — Création Site Web & UI/UX',
    description: 'Agence web Villeurbanne (69) — sites sur-mesure Next.js, design UI/UX. Lighthouse 95+ garanti. Dès 800€.',
    images: [{ url: `${BASE}/image%201.png`, width: 1200, height: 630, alt: 'Agence Web Villeurbanne — Alhambra' }],
  },
}

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${PAGE_URL}/#business`,
  name: 'Alhambra Web — Agence Web Villeurbanne',
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
    { '@type': 'City', name: 'Villeurbanne' },
    { '@type': 'City', name: 'Lyon' },
    { '@type': 'City', name: 'Caluire-et-Cuire' },
    { '@type': 'City', name: 'Vaulx-en-Velin' },
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

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Alhambra Web intervient-il à Villeurbanne ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui. Alhambra Web est une agence web basée à Lyon (quelques minutes de Villeurbanne) et accompagne les entreprises, startups, commerces et artisans de Villeurbanne. Déplacement possible pour les réunions en présentiel.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quel est le tarif d\'un site web à Villeurbanne ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nos sites vitrines démarrent à 800€. Les applications web et e-commerce à partir de 3 000€. Chaque devis est gratuit et personnalisé sous 24h selon vos besoins réels.',
      },
    },
    {
      '@type': 'Question',
      name: 'Pourquoi choisir Alhambra Web plutôt qu\'une agence basée à Villeurbanne ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Alhambra Web propose une expertise technique rare en région lyonnaise : stack Next.js dernière génération, score Lighthouse 95+ garanti contractuellement, code livré et propriété totale du client. La qualité de Lyon au service des entreprises de Villeurbanne.',
      },
    },
  ],
}

const SERVICES = [
  { label: 'Création site vitrine Villeurbanne', desc: 'Site professionnel sur-mesure, animé, responsive. Dès 800€.' },
  { label: 'Développement Web Next.js', desc: 'Applications React performantes, TypeScript, Lighthouse 95+.' },
  { label: 'Design UI/UX Villeurbanne', desc: 'Maquettes Figma, branding, identité visuelle pour entreprises.' },
  { label: 'E-commerce Villeurbanne', desc: 'Boutiques Shopify ou Next.js custom, tunnel de vente optimisé.' },
  { label: 'SEO technique local', desc: 'Core Web Vitals, JSON-LD, Google Business Profile, référencement local.' },
  { label: 'Refonte site web', desc: 'Audit complet, redesign UX/UI, migration SEO sans perte.' },
]

const FAQS = [
  {
    q: 'Alhambra Web intervient-il à Villeurbanne ?',
    a: 'Oui. Alhambra Web est basée à Lyon, à quelques minutes de Villeurbanne. Nous accompagnons les entreprises villeurbannaises — startups de la French Tech Lyon, commerces de la Rue Mancey, PME des Gratte-Ciel. Réunions en présentiel possibles.',
  },
  {
    q: 'Quel est le prix d\'un site web pour une PME à Villeurbanne ?',
    a: 'Un site vitrine est facturé à partir de 800€. Un site e-commerce ou une application web démarre à 3 000€. Devis gratuit et personnalisé sous 24h, sans engagement.',
  },
  {
    q: 'Faites-vous des sites web pour les startups de Villeurbanne ?',
    a: 'Oui. Stack Next.js, React 19, TypeScript — idéal pour les produits digitaux, les SaaS, les MVP et les applications web ambitieuses. Nous avons réalisé plusieurs plateformes pour des startups de la région lyonnaise.',
  },
  {
    q: 'Proposez-vous le SEO local pour les commerces de Villeurbanne ?',
    a: 'Oui. Optimisation Google Business Profile, SEO technique (Core Web Vitals, JSON-LD), contenu optimisé pour les requêtes locales "commerce Villeurbanne". Chaque site livré obtient un score Lighthouse 95+.',
  },
  {
    q: 'Quelle est votre délai de livraison pour un site web à Villeurbanne ?',
    a: '2 à 4 semaines pour un site vitrine, 4 à 8 semaines pour un e-commerce ou une application web. Nous livrons vite sans jamais sacrifier la qualité technique.',
  },
]


const WEBPAGE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${PAGE_URL}/#webpage`,
  'url': `${PAGE_URL}/`,
  'name': 'Agence Web Villeurbanne — Création Site Web & Design UI/UX | Alhambra',
  'inLanguage': 'fr-FR',
  'dateModified': '2026-05-19',
  'datePublished': '2026-01-01',
  'isPartOf': { '@id': 'https://www.alhambra-web.com/#website' },
  'about': { '@id': 'https://www.alhambra-web.com/#organization' },
}

export default function AgenceWebVilleurbannerPage() {
  return (
    <>
      <Script
        id="schema-agence-web-villeurbanne"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
        strategy="beforeInteractive"
      />
      <Script
        id="schema-webpage-agence-web-villeurbanne"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBPAGE_SCHEMA) }}
        strategy="beforeInteractive"
      />
      <Script
        id="schema-faq-villeurbanne"
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
            <Image src="/images/work-1.webp" alt="" fill className="object-cover" priority />
            <div className="absolute inset-0" style={{ background: 'rgba(10,10,10,0.84)' }} />
          </div>
          <div className="relative z-10 max-w-[1200px] mx-auto">
            <p
              style={{ letterSpacing: '0.45em', fontSize: '11px' }}
              className="uppercase text-white/30 font-bold mb-6"
            >
              Alhambra Web · Villeurbanne (69100)
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
              <span style={{ color: 'rgba(248,246,242,0.2)', fontStyle: 'italic' }}>Villeurbanne</span>
            </h1>
            <p
              style={{ fontFamily: 'var(--font-haas)', fontSize: 'clamp(15px,2vw,19px)', color: 'rgba(248,246,242,0.55)', lineHeight: 1.65, maxWidth: '620px' }}
              className="mt-8 mb-10"
            >
              Agence web premium à Lyon, au service des entreprises, startups et commerces
              de Villeurbanne. Sites Next.js haute performance, design radical, Lighthouse 95+ garanti.
              Devis gratuit sous 24h.
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
              {[['95+', 'Score Lighthouse'], ['2–4 sem.', 'Livraison'], ['Dès 800€', 'Site vitrine']].map(([val, label]) => (
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
                  Votre agence web à<br />
                  <span style={{ color: 'rgba(10,10,10,0.25)', fontStyle: 'italic' }}>Villeurbanne.</span>
                </h2>
                <div style={{ fontFamily: 'var(--font-haas)', color: 'rgba(10,10,10,0.6)', lineHeight: 1.8, fontSize: '15px' }} className="space-y-4">
                  <p>
                    Villeurbanne est l&apos;une des villes les plus dynamiques de la région lyonnaise,
                    avec un tissu économique dense — startups, PME industrielles, commerces de
                    quartier, associations culturelles. Alhambra Web accompagne toutes ces structures
                    dans leur transformation digitale.
                  </p>
                  <p>
                    Notre approche : chaque projet est codé de zéro, conçu spécifiquement pour
                    votre identité et vos objectifs. Pas de templates, pas de WordPress générique.
                    Un code Next.js propre, performant et qui vous appartient à 100%.
                  </p>
                  <p>
                    Des Gratte-Ciel à la Croix-Luizet, du Tonkin à Cusset — nous connaissons
                    le tissu économique de Villeurbanne et adaptons nos solutions à vos besoins
                    et votre budget réel.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-2">
                  {['Villeurbanne', 'Gratte-Ciel', 'Tonkin', 'Cusset', 'Charpennes', 'Vaulx-en-Velin'].map(q => (
                    <span
                      key={q}
                      style={{ fontFamily: 'var(--font-haas)', fontSize: '12px', background: '#F5F4F0', borderRadius: '100px', padding: '4px 12px' }}
                    >
                      {q}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2
                  style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(20px,2.5vw,28px)', letterSpacing: '-0.01em' }}
                  className="mb-6"
                >
                  Nos services à Villeurbanne
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
              Questions fréquentes — Agence Web Villeurbanne
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
                { label: 'Agence Web Pont-de-Chéruy', href: '/agence-web-pont-de-cheruy/' },
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
            <span style={{ color: 'rgba(248,246,242,0.22)', fontStyle: 'italic' }}>Villeurbanne.</span>
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
        <FooterSection />
      </main>
    </>
  )
}
