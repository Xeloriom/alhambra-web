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
const PAGE_URL = `${BASE}/creation-site-web-restaurant`

export const metadata: Metadata = {
  title: 'Création Site Web Restaurant Lyon — Menu & Réservation',
  description: 'Site web restaurant Lyon — menu en ligne, réservation, menu digital sur TV. Next.js, Lighthouse 95+. Dès 200€.',
  alternates: { canonical: PAGE_URL, languages: { 'fr': PAGE_URL, 'fr-FR': PAGE_URL } },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: PAGE_URL,
    siteName: 'Alhambra Web',
    title: 'Création Site Web Restaurant Lyon — Menu & Réservation',
    description: 'Site web restaurant Lyon — menu en ligne, réservation, digital sur TV. Next.js, Lighthouse 95+. Dès 200€.',
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

const WEBPAGE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${PAGE_URL}/#webpage`,
  'url': `${PAGE_URL}/`,
  'name': 'Création Site Web Restaurant Lyon — Menu Digital | Alhambra',
  'inLanguage': 'fr-FR',
  'dateModified': '2026-05-19',
  'datePublished': '2026-01-01',
  'isPartOf': { '@id': 'https://www.alhambra-web.com/#website' },
  'about': { '@id': 'https://www.alhambra-web.com/#organization' },
}

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
      <Script
        id="schema-webpage-creation-site-web-restaurant"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBPAGE_SCHEMA) }}
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
            <Image src="/images/Chez Ramo.webp" alt="" fill className="object-cover" priority />
            <div className="absolute inset-0" style={{ background: 'rgba(10,10,10,0.84)' }} />
          </div>
          <div className="relative z-10 max-w-[1200px] mx-auto">
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


        <ServicesSection />
        <ContactSection />
        <FaqSection />
        <FooterSection />
      </main>
    </>
  )
}
