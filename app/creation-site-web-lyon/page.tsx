import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'

const BASE = 'https://www.alhambra-web.com'
const PAGE_URL = `${BASE}/creation-site-web-lyon`

export const metadata: Metadata = {
  title: 'Création Site Web Lyon — Site Vitrine & Refonte Web',
  description: 'Création de site web à Lyon : site vitrine, landing page, refonte. Next.js, design sur-mesure, Lighthouse 95+ garanti. Livraison 2–8 semaines. Dès 800€.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: PAGE_URL,
    siteName: 'Alhambra Web',
    title: 'Création Site Web Lyon — Site Vitrine & Refonte | Alhambra',
    description: 'Création de site web professionnel à Lyon. Site vitrine, refonte, e-commerce. Next.js, design sur-mesure, Lighthouse 95+. Dès 800€, livraison 2–8 semaines.',
    images: [{ url: `${BASE}/image%201.png`, width: 1200, height: 630, alt: 'Création Site Web Lyon — Alhambra' }],
  },
}

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${PAGE_URL}/#business`,
  name: 'Alhambra Web — Création Site Web Lyon',
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
    { '@type': 'City', name: 'Saint-Priest' },
    { '@type': 'AdministrativeArea', name: 'Métropole de Lyon' },
    { '@type': 'AdministrativeArea', name: 'Auvergne-Rhône-Alpes' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Création site web Lyon — Offres Alhambra',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Site vitrine Lyon',
        description: 'Site vitrine professionnel sur-mesure à Lyon. Design unique, animations, responsive, SEO inclus.',
        priceSpecification: { '@type': 'PriceSpecification', minPrice: '800', priceCurrency: 'EUR' },
      },
      {
        '@type': 'Offer',
        name: 'Refonte site web Lyon',
        description: 'Audit complet, redesign UX/UI, migration SEO sans perte, optimisation Lighthouse.',
        priceSpecification: { '@type': 'PriceSpecification', minPrice: '1500', priceCurrency: 'EUR' },
      },
      {
        '@type': 'Offer',
        name: 'E-commerce Lyon',
        description: 'Boutique en ligne Shopify ou Next.js custom, tunnel de vente optimisé.',
        priceSpecification: { '@type': 'PriceSpecification', minPrice: '3000', priceCurrency: 'EUR' },
      },
    ],
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    reviewCount: '12',
    bestRating: '5',
  },
}

const OFFERS = [
  {
    title: 'Site vitrine',
    price: 'Dès 800€',
    delay: '2–3 semaines',
    items: ['Design sur-mesure', '5–8 sections', 'Responsive mobile', 'SEO inclus', 'Lighthouse 95+'],
  },
  {
    title: 'Site multi-pages',
    price: 'Dès 2 000€',
    delay: '3–5 semaines',
    items: ['Architecture complète', 'Blog / actualités', 'Formulaire avancé', 'Animations Framer Motion', 'Tunnel de contact optimisé'],
  },
  {
    title: 'Refonte site web',
    price: 'Dès 1 500€',
    delay: '3–6 semaines',
    items: ['Audit technique complet', 'Redesign UX/UI', 'Migration SEO sans perte', 'Optimisation performances', 'Formation à la gestion'],
  },
]

const FAQS = [
  {
    q: 'Quelle est la différence entre un site vitrine et un site e-commerce ?',
    a: 'Un site vitrine présente votre activité, vos services et convertit les visiteurs en prospects par formulaire de contact ou appel téléphonique. Un e-commerce permet la vente directe en ligne avec panier et paiement intégré. Alhambra crée les deux avec la même stack Next.js performante.',
  },
  {
    q: 'Pourquoi choisir Next.js pour mon site web à Lyon ?',
    a: "Next.js est le framework React de référence en 2026 : rendu serveur ultra-rapide, score Lighthouse 95+ natif, SEO optimal, déploiement mondial sur CDN. Chez Alhambra, c'est notre choix systématique — vos visiteurs lyonnais et vos robots Google vous remercieront.",
  },
  {
    q: 'Que comprend exactement la refonte d\'un site web ?',
    a: "Une refonte chez Alhambra commence par un audit technique et UX de l'existant : performances Lighthouse, Core Web Vitals, parcours utilisateur, architecture de contenu. Ensuite : redesign complet sous Figma, développement Next.js, migration des URL sans 404, et optimisation SEO continue.",
  },
  {
    q: 'Mon site web sera-t-il visible sur Google après sa création ?',
    a: 'Oui. Chaque site livré par Alhambra intègre le SEO on-page depuis la conception : balises méta, titres sémantiques, données structurées JSON-LD, sitemap XML, robots.txt, Core Web Vitals verts. La base organique est posée — à vous de la faire grandir.',
  },
  {
    q: 'Puis-je modifier moi-même le contenu de mon site ?',
    a: "Oui. Selon votre profil, nous intégrons un CMS headless (Contentful, Sanity) ou des zones de contenu éditables simples. Formation incluse à la livraison. Et si vous préférez qu'on gère tout, nos contrats de maintenance sont là pour ça.",
  },
]

export default function CreationSiteWebLyonPage() {
  return (
    <>
      <Script
        id="schema-creation-site-web-lyon"
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
              style={{
                fontFamily: 'var(--font-nordique)',
                fontSize: 'clamp(40px, 7.5vw, 104px)',
                lineHeight: 0.92,
                letterSpacing: '-0.03em',
              }}
            >
              Création Site<br />Web Lyon
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
              Site vitrine, refonte ou e-commerce : nous créons des sites web qui performent
              techniquement et qui convertissent commercialement. Next.js, TypeScript,
              Tailwind CSS v4. Livraison garantie dans les délais.
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
          </div>
        </section>

        {/* ── OFFERS ── */}
        <section style={{ background: '#FFFFFF', color: '#0A0A0A' }} className="px-6 sm:px-10 lg:px-20 py-20 sm:py-28">
          <div className="max-w-[1200px] mx-auto">
            <h2
              style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(28px,4vw,52px)', letterSpacing: '-0.02em', lineHeight: 1.05 }}
              className="mb-12"
            >
              Nos formules création<br />
              <span style={{ color: 'rgba(10,10,10,0.25)', fontStyle: 'italic' }}>site web à Lyon.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {OFFERS.map((offer) => (
                <div
                  key={offer.title}
                  className="p-8 rounded-[24px] border border-black/10 hover:border-black/30 transition-colors"
                >
                  <h3 style={{ fontFamily: 'var(--font-nordique)', fontSize: '24px', letterSpacing: '-0.01em' }} className="mb-1">
                    {offer.title}
                  </h3>
                  <div style={{ fontFamily: 'var(--font-nordique)', fontSize: '28px', color: '#0A0A0A' }} className="mb-1">
                    {offer.price}
                  </div>
                  <div style={{ fontFamily: 'var(--font-haas)', fontSize: '12px', color: 'rgba(10,10,10,0.4)', letterSpacing: '0.1em' }} className="uppercase mb-6">
                    Livraison {offer.delay}
                  </div>
                  <ul className="space-y-2">
                    {offer.items.map((item) => (
                      <li key={item} style={{ fontFamily: 'var(--font-haas)', fontSize: '13px', color: 'rgba(10,10,10,0.65)' }} className="flex items-center gap-2">
                        <span style={{ width: '5px', height: '5px', background: '#0A0A0A', borderRadius: '50%', flexShrink: 0 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
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
              Pourquoi nous confier votre création de site web à Lyon ?
            </h2>
            <div style={{ fontFamily: 'var(--font-haas)', color: 'rgba(10,10,10,0.6)', lineHeight: 1.8, fontSize: '15px' }} className="space-y-4">
              <p>
                Lyon est une des métropoles les plus compétitives de France. Entre le tissu
                industriel de la vallée de la chimie, le secteur biotech de Gerland, les agences
                de la Presqu'île et les commerces des arrondissements, la concurrence en ligne
                est réelle. Un site médiocre, c'est de l'argent perdu.
              </p>
              <p>
                Alhambra Web construit des sites web lyonnais qui durent : code propre sans
                dépendances inutiles, design intemporel, SEO technique solide dès le lancement.
                Nos clients à Saint-Priest, Vénissieux ou Villeurbanne constatent des résultats
                organiques concrets dans les 3 à 6 mois suivant la mise en ligne.
              </p>
              <p>
                Que vous souhaitiez une landing page de conversion, un site vitrine élaboré,
                ou la refonte complète de votre présence en ligne, nous avons la méthode,
                la stack technique et l'expérience pour le faire bien — du premier pixel à
                la mise en production.
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
              Questions fréquentes — Création site web Lyon
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
            Votre site web Lyon,<br />
            <span style={{ color: 'rgba(248,246,242,0.22)', fontStyle: 'italic' }}>livré en 2–8 semaines.</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-haas)', color: 'rgba(248,246,242,0.45)', fontSize: '15px' }} className="mb-10 max-w-md mx-auto">
            Site vitrine dès 800€ · Refonte dès 1 500€ · E-commerce dès 3 000€
          </p>
          <a
            href="/#contact"
            style={{ background: '#F8F6F2', color: '#0A0A0A', fontFamily: 'var(--font-haas)' }}
            className="inline-block px-10 py-5 rounded-full text-sm font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors"
          >
            Démarrer mon projet
          </a>
        </section>
      </main>
    </>
  )
}
