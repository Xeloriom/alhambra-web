import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'

const BASE = 'https://www.alhambra-web.com'
const PAGE_URL = `${BASE}/creation-site-web-restaurant`

export const metadata: Metadata = {
  title: 'Création Site Web Restaurant Lyon — Menu Digital & Réservation | Alhambra',
  description: 'Création de site web pour restaurant à Lyon : menu en ligne, réservation, menu digital sur TV. Dès 200€. Développement Next.js, Lighthouse 95+. Devis gratuit 24h.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: PAGE_URL,
    siteName: 'Alhambra Web',
    title: 'Création Site Web Restaurant Lyon — Menu Digital & Réservation | Alhambra',
    description: 'Agence spécialisée en création de sites web pour restaurants à Lyon et en région. Menu digital sur TV dès 200€, site vitrine restaurant dès 800€. Devis gratuit 24h.',
    images: [{ url: `${BASE}/image%201.png`, width: 1200, height: 630, alt: 'Création Site Web Restaurant Lyon — Alhambra' }],
  },
}

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${PAGE_URL}/#business`,
  name: 'Alhambra Web — Création Site Web Restaurant Lyon',
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
    { '@type': 'City', name: 'Lyon' },
    { '@type': 'AdministrativeArea', name: 'Métropole de Lyon' },
    { '@type': 'AdministrativeArea', name: 'Auvergne-Rhône-Alpes' },
    { '@type': 'Country', name: 'France' },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    reviewCount: '12',
    bestRating: '5',
  },
}

const SERVICE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Création de site web pour restaurant',
  description: 'Conception et développement de sites web pour restaurants, brasseries, traiteurs et établissements de restauration. Menu en ligne, système de réservation, menu digital sur TV.',
  provider: {
    '@type': 'Organization',
    name: 'Alhambra Web',
    url: BASE,
  },
  serviceType: 'Web Design and Development',
  areaServed: [
    { '@type': 'City', name: 'Lyon' },
    { '@type': 'Country', name: 'France' },
  ],
  offers: [
    {
      '@type': 'Offer',
      name: 'Menu digital sur TV',
      description: 'Affichage de menu sur écran TV avec modification de prix en temps réel, sans abonnement.',
      price: '200',
      priceCurrency: 'EUR',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '200',
        priceCurrency: 'EUR',
        unitText: 'projet',
      },
    },
    {
      '@type': 'Offer',
      name: 'Site web restaurant vitrine',
      description: 'Site web restaurant complet : menu, horaires, galerie, contact, réservation en ligne. Design sur-mesure.',
      priceSpecification: {
        '@type': 'PriceSpecification',
        minPrice: '800',
        priceCurrency: 'EUR',
      },
    },
    {
      '@type': 'Offer',
      name: 'Site web restaurant premium',
      description: 'Site restaurant haut de gamme avec système de réservation avancé, CMS de contenu, animations, SEO local optimisé.',
      priceSpecification: {
        '@type': 'PriceSpecification',
        minPrice: '2000',
        priceCurrency: 'EUR',
      },
    },
  ],
}

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Combien coûte un site web pour un restaurant à Lyon ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Alhambra propose 3 formules : menu digital sur TV dès 200€, site vitrine restaurant dès 800€, site premium avec réservation en ligne dès 2 000€. Chaque devis est personnalisé et gratuit sous 24h.',
      },
    },
    {
      '@type': 'Question',
      name: 'Qu\'est-ce qu\'un menu digital sur TV pour restaurant ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Un menu digital est un système d\'affichage de votre carte sur un écran TV, connecté à une interface de gestion en ligne. Vous modifiez les prix et plats en temps réel depuis votre téléphone. Alhambra a développé cette solution dès 200€ pour le restaurant Chez Ramo à Lyon.',
      },
    },
    {
      '@type': 'Question',
      name: 'Proposez-vous la réservation en ligne pour les restaurants ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui. Nous intégrons des systèmes de réservation en ligne (custom ou via TheFork/Zenchef) dans vos sites web de restaurant. Le client choisit la date, l\'heure et le nombre de couverts directement depuis votre site.',
      },
    },
    {
      '@type': 'Question',
      name: 'Comment un site web aide-t-il un restaurant à avoir plus de clients ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Un site restaurant bien référencé apparaît sur Google pour des recherches comme "restaurant [ville]" ou "restaurant [type de cuisine] Lyon". Nous optimisons le SEO local, le Google Business Profile et les données structurées Schema.org pour maximiser votre visibilité locale.',
      },
    },
  ],
}

const OFFERINGS = [
  {
    title: 'Menu digital sur TV',
    price: 'Dès 200€',
    desc: 'Affichez votre carte sur un écran TV. Modification des prix et plats en temps réel depuis votre téléphone. Solution simple, élégante, sans abonnement mensuel. Livraison en 1 à 3 jours.',
    bullets: ['Interface d\'administration mobile', 'Modifications instantanées', 'Design sur-mesure à vos couleurs', 'Pas d\'abonnement mensuel', 'Livraison 1–3 jours'],
  },
  {
    title: 'Site web restaurant vitrine',
    price: 'Dès 800€',
    desc: 'Site web complet pour votre restaurant : menu en ligne, horaires, galerie photo, localisation, contact. Design professionnel sur-mesure, optimisé mobile et Google.',
    bullets: ['Menu en ligne mis à jour facilement', 'Galerie photos', 'Carte Google intégrée', 'SEO local optimisé', 'Livraison 2–3 semaines'],
  },
  {
    title: 'Site restaurant premium',
    price: 'Dès 2 000€',
    desc: 'Site haut de gamme avec réservation en ligne, CMS pour gérer le contenu, animations cinématiques, intégration réseaux sociaux et SEO local avancé.',
    bullets: ['Réservation en ligne', 'CMS pour gérer le menu', 'Animations premium', 'SEO local poussé', 'Livraison 3–5 semaines'],
  },
]

const FAQS_DISPLAY = [
  {
    q: 'Combien coûte un site web pour un restaurant à Lyon ?',
    a: 'Nous proposons 3 niveaux : menu digital sur TV dès 200€, site vitrine dès 800€, site premium avec réservation dès 2 000€. Devis personnalisé gratuit sous 24h selon votre situation.',
  },
  {
    q: 'Qu\'est-ce qu\'un menu digital sur TV ?',
    a: 'C\'est un système d\'affichage de votre carte sur un écran TV (ou plusieurs), géré depuis une interface web sur votre téléphone. Vous modifiez les prix et plats en temps réel. Nous avons développé cette solution pour le restaurant Chez Ramo à Lyon — livrée pour 200€.',
  },
  {
    q: 'Faites-vous des sites web pour tous types de restaurants ?',
    a: 'Oui. Restaurants gastronomiques, brasseries, pizzerias, sushis, food trucks, traiteurs, salons de thé — nous adaptons le design et les fonctionnalités à votre établissement et votre clientèle cible.',
  },
  {
    q: 'Mon site sera-t-il visible sur Google Maps et Google Search ?',
    a: 'Oui. Nous optimisons le SEO local et le Google Business Profile pour que votre restaurant apparaisse sur Google Maps et dans les résultats "restaurant [ville]". Score Lighthouse 95+ garanti — Google valorise les sites rapides.',
  },
  {
    q: 'Puis-je mettre à jour le menu moi-même après livraison ?',
    a: 'Oui. Chaque livraison inclut une formation à la gestion du contenu. Selon la formule, vous disposez d\'une interface d\'administration simple pour modifier votre menu, vos horaires et vos photos.',
  },
]

export default function CreationSiteWebRestaurantPage() {
  return (
    <>
      <Script
        id="schema-restaurant-business"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
        strategy="beforeInteractive"
      />
      <Script
        id="schema-restaurant-service"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_SCHEMA) }}
        strategy="beforeInteractive"
      />
      <Script
        id="schema-faq-restaurant"
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
              Alhambra Web · Sites web pour restaurants
            </p>
            <h1
              className="font-nordique"
              style={{
                fontSize: 'clamp(36px, 6.5vw, 92px)',
                lineHeight: 0.92,
                letterSpacing: '-0.03em',
                fontFamily: 'var(--font-nordique)',
              }}
            >
              Site Web<br />
              <span style={{ color: 'rgba(248,246,242,0.2)', fontStyle: 'italic' }}>Restaurant</span>
            </h1>
            <p
              style={{ fontFamily: 'var(--font-haas)', fontSize: 'clamp(15px,2vw,19px)', color: 'rgba(248,246,242,0.55)', lineHeight: 1.65, maxWidth: '620px' }}
              className="mt-8 mb-10"
            >
              Menu digital sur TV, site vitrine restaurant, réservation en ligne.
              On a développé un menu sur écran TV pour 200€ — dès que vous avez besoin
              d&apos;une présence digitale professionnelle, on s&apos;adapte à votre budget.
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

            <div className="mt-16 grid grid-cols-3 gap-8 max-w-[520px]">
              {[['Dès 200€', 'Menu digital TV'], ['1–3 jours', 'Livraison rapide'], ['95+', 'Score Lighthouse']].map(([val, label]) => (
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

        {/* ── OFFERINGS ── */}
        <article style={{ background: '#FFFFFF', color: '#0A0A0A' }} className="px-6 sm:px-10 lg:px-20 py-20 sm:py-28">
          <div className="max-w-[1200px] mx-auto">
            <h2
              style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(26px,4vw,52px)', letterSpacing: '-0.02em', lineHeight: 1.05 }}
              className="mb-4"
            >
              Nos solutions pour restaurants
            </h2>
            <p style={{ fontFamily: 'var(--font-haas)', color: 'rgba(10,10,10,0.5)', fontSize: '15px' }} className="mb-14 max-w-xl">
              Du menu digital à 200€ au site premium avec réservation — une solution par besoin et par budget.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {OFFERINGS.map((o) => (
                <div
                  key={o.title}
                  className="p-6 rounded-2xl border border-black/8 hover:border-black/20 transition-colors flex flex-col"
                >
                  <div className="mb-4">
                    <span
                      style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(16px,1.8vw,20px)', display: 'block', marginBottom: '4px' }}
                    >
                      {o.title}
                    </span>
                    <span
                      style={{ fontFamily: 'var(--font-haas)', fontSize: '22px', fontWeight: 700, color: '#0A0A0A' }}
                    >
                      {o.price}
                    </span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-haas)', fontSize: '13px', color: 'rgba(10,10,10,0.55)', lineHeight: 1.7 }} className="mb-5 flex-1">
                    {o.desc}
                  </p>
                  <ul className="space-y-1.5">
                    {o.bullets.map(b => (
                      <li key={b} style={{ fontFamily: 'var(--font-haas)', fontSize: '12px', color: 'rgba(10,10,10,0.5)' }} className="flex items-start gap-2">
                        <span style={{ color: '#0A0A0A', marginTop: '3px' }}>✓</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Reference project */}
            <div className="mt-16 p-8 rounded-2xl" style={{ background: '#F5F4F0' }}>
              <p style={{ fontFamily: 'var(--font-haas)', fontSize: '11px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)' }} className="mb-3">
                Référence client
              </p>
              <h3 style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(20px,2.5vw,30px)', letterSpacing: '-0.01em' }} className="mb-3">
                Chez Ramo — Lyon
              </h3>
              <p style={{ fontFamily: 'var(--font-haas)', fontSize: '14px', color: 'rgba(10,10,10,0.6)', lineHeight: 1.75, maxWidth: '640px' }}>
                Chez Ramo est un restaurant lyonnais pour lequel nous avons créé deux solutions :
                un menu digital sur écran TV avec modification de prix en temps réel (200€), et
                un site web restaurant complet avec menu interactif et réservation en ligne.
                Deux projets, deux budgets différents, la même exigence de qualité.
              </p>
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
              Questions fréquentes — Site web restaurant
            </h2>
            <div className="space-y-6">
              {FAQS_DISPLAY.map((faq) => (
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
                { label: 'Création Site Web Lyon', href: '/creation-site-web-lyon/' },
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
            Site web pour<br />
            <span style={{ color: 'rgba(248,246,242,0.22)', fontStyle: 'italic' }}>votre restaurant.</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-haas)', color: 'rgba(248,246,242,0.45)', fontSize: '15px' }} className="mb-10 max-w-md mx-auto">
            Menu digital dès 200€ · Site vitrine dès 800€ · Devis gratuit sous 24h
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
