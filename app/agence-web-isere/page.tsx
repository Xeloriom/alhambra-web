import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'
import { PageHero } from '@/components/page-hero'
import { FooterSection } from '@/components/footer-section'

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

      <SiteNav />
      <main>
                <PageHero
          videoUrl="https://stream.mux.com/QgTir2Bu4u6d01CqyKEBCks68PIm2nCM7vhwXgenS00tw.m3u8"
          eyebrow="Alhambra Web · Isère, Auvergne-Rhône-Alpes"
          title={<>
            Agence Web<br />
            <span style={{ color: 'rgba(248,246,242,0.2)', fontStyle: 'italic' }}>
              Isère
            </span>
          </>}
          subtitle="Sites web sur-mesure pour les entreprises de l'Isère. De Grenoble à Bourgoin-Jallieu, nous créons des expériences digitales performantes et mémorables."
          ctaLabel="Devis gratuit 24h"
          stats={[
          { value: '95+', label: 'Score Lighthouse' },
          { value: '2–4 sem.', label: 'Livraison' },
          { value: 'Dès 800€', label: 'Site vitrine' },
          ]}
        />

        {/* ── CONTENT ── */}
        <article style={{ background: '#FFFFFF', color: '#0A0A0A' }} className="px-6 sm:px-10 lg:px-20 py-20 sm:py-28">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <div>
                <h2
                  style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(28px,4vw,48px)', letterSpacing: '-0.02em', lineHeight: 1.05 }}
                  className="mb-6"
                >
                  Création site web Isère :<br />
                  <span style={{ color: 'rgba(10,10,10,0.25)', fontStyle: 'italic' }}>du nord au sud.</span>
                </h2>
                <div style={{ fontFamily: 'var(--font-haas)', color: 'rgba(10,10,10,0.6)', lineHeight: 1.8, fontSize: '15px' }} className="space-y-4">
                  <p>
                    L'Isère concentre un tissu économique exceptionnel : la technopole grenobloise,
                    le bassin d'emploi de Bourgoin-Jallieu, la plaine de l'Ain au nord, les stations
                    alpines à l'est. Chacune de ces zones a ses spécificités, ses clients, ses
                    usages digitaux.
                  </p>
                  <p>
                    Alhambra Web accompagne les entreprises du département 38 depuis Lyon, à 45
                    minutes de L'Isle-d'Abeau. Nous comprenons les besoins des industriels de
                    la CAPI comme ceux des vignerons de Vienne ou des prestataires de services
                    voironnais.
                  </p>
                  <p>
                    Notre promesse est simple : un site web qui vous ressemble, qui performe
                    techniquement (Lighthouse 95+ garanti), et qui convertit vos visiteurs en
                    clients. Livré dans les délais, sans mauvaises surprises.
                  </p>
                </div>
              </div>

              <div>
                <h2
                  style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(20px,2.5vw,28px)', letterSpacing: '-0.01em' }}
                  className="mb-6"
                >
                  Nos services en Isère
                </h2>
                <ul className="space-y-3">
                  {SERVICES.map((s) => (
                    <li
                      key={s.label}
                      className="flex gap-4 p-4 min-h-[44px] rounded-2xl border border-black/8 hover:border-black/20 transition-colors"
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
              Questions fréquentes — Isère
            </h2>
            <div className="space-y-6">
              {FAQS.map((faq) => (
                <details
                  key={faq.q}
                  className="group border-b border-black/10 pb-6"
                >
                  <summary
                    style={{ fontFamily: 'var(--font-haas)', fontSize: '15px', fontWeight: 700, cursor: 'pointer', listStyle: 'none' }}
                    className="flex justify-between items-center gap-4 min-h-[44px] py-3"
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
            Votre site web<br />
            <span style={{ color: 'rgba(248,246,242,0.22)', fontStyle: 'italic' }}>en Isère.</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-haas)', color: 'rgba(248,246,242,0.45)', fontSize: '15px' }} className="mb-10 max-w-md mx-auto">
            L'Isle-d'Abeau · Bourgoin-Jallieu · Vienne · Grenoble · Sites dès 800€
          </p>
          <a
            href="/#contact"
            style={{ background: '#F8F6F2', color: '#0A0A0A', fontFamily: 'var(--font-haas)' }}
            className="inline-block px-10 py-5 rounded-full text-sm font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors"
          >
            Obtenir un devis
          </a>
        </section>
        <FooterSection />
      </main>
    </>
  )
}
