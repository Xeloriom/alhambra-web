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
const PAGE_URL = `${BASE}/agence-logiciel-lyon`

export const metadata: Metadata = {
  title: 'Logiciel sur Mesure Lyon — Développement & Agence',
  description: 'Agence logiciel Lyon — développement sur mesure, ERP, SaaS, outils métier. Stack moderne, livraison agile. Devis gratuit 24h.',
  alternates: { canonical: PAGE_URL, languages: { 'fr': PAGE_URL, 'fr-FR': PAGE_URL } },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: PAGE_URL,
    siteName: 'Alhambra Web',
    title: 'Logiciel sur Mesure Lyon — Développement & Agence',
    description: 'Agence logiciel Lyon — développement sur mesure, ERP, SaaS, outils métier. Devis gratuit 24h.',
    images: [{ url: `${BASE}/image%201.png`, width: 1200, height: 630, alt: 'Logiciel sur Mesure Lyon — Alhambra' }],
  },
}

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${PAGE_URL}/#business`,
  name: 'Alhambra Web — Développement Logiciel Lyon',
  url: BASE,
  image: `${BASE}/image%201.png`,
  priceRange: 'Sur devis',
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
  name: 'Logiciel sur Mesure Lyon — Développement & Agence | Alhambra',
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
      name: 'Qu\'est-ce qu\'un logiciel sur mesure ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Un logiciel sur mesure est une application développée spécifiquement pour les besoins d\'une entreprise, contrairement aux logiciels packagés (Excel, Salesforce, etc.). Il s\'intègre parfaitement à vos processus métier, évolue avec vous et vous appartient entièrement.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quel est le coût d\'un logiciel sur mesure à Lyon ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Le coût dépend de la complexité : un outil interne simple (gestion, tableau de bord) démarre à 5 000€. Un ERP ou une plateforme SaaS complète peut atteindre 30 000€ à 80 000€. Chaque projet fait l\'objet d\'un devis détaillé après analyse du cahier des charges.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quels types de logiciels développez-vous ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nous développons des ERP et CRM sur mesure, des plateformes SaaS, des outils de gestion interne, des applications web métier, des dashboards analytiques, des systèmes de réservation et des APIs.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quelle est votre stack technique pour le développement logiciel ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nous utilisons Next.js / React pour les interfaces, Node.js ou Python pour le back-end, PostgreSQL / MySQL pour les bases de données, et Docker pour le déploiement. Chaque stack est choisie selon les contraintes du projet.',
      },
    },
    {
      '@type': 'Question',
      name: 'Assurez-vous la maintenance du logiciel après livraison ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui. Nous proposons des contrats de maintenance et d\'évolution : correctifs, mises à jour de sécurité, nouvelles fonctionnalités, formation des équipes. Le code source vous appartient à la livraison.',
      },
    },
  ],
}

const SERVICES = [
  { label: 'Application web sur mesure', desc: 'Outils internes, backoffice, plateformes métier — conçus précisément pour vos processus.' },
  { label: 'ERP & CRM personnalisé', desc: 'Gestion de projets, clients, stocks, facturation — tout centralisé dans un seul outil.' },
  { label: 'Plateforme SaaS', desc: 'Architecture multi-tenant, gestion des abonnements, tableau de bord client. Scalable dès le départ.' },
  { label: 'API & intégrations', desc: 'Connexion à vos outils existants (CRM, ERP, paiement, logistique) via des APIs robustes.' },
  { label: 'Dashboard & analytique', desc: 'Visualisation de données en temps réel, KPIs métier, exports automatisés.' },
  { label: 'Maintenance & évolutions', desc: 'Contrat de support, mises à jour de sécurité, nouvelles fonctionnalités selon vos besoins.' },
]

const FAQS = [
  {
    q: 'Qu\'est-ce qu\'un logiciel sur mesure ?',
    a: 'Un logiciel sur mesure est une application développée spécifiquement pour les besoins d\'une entreprise. Contrairement aux solutions packagées, il s\'adapte exactement à vos processus, évolue avec vous et vous appartient entièrement — sans abonnement perpétuel.',
  },
  {
    q: 'Quel est le coût d\'un logiciel sur mesure à Lyon ?',
    a: 'Un outil interne simple (gestion, tableau de bord) démarre à 5 000€. Un ERP ou une plateforme SaaS complète peut atteindre 30 000€ à 80 000€ selon la complexité. Chaque projet fait l\'objet d\'un devis détaillé après analyse de votre cahier des charges.',
  },
  {
    q: 'Quels types de logiciels développez-vous ?',
    a: 'ERP et CRM sur mesure, plateformes SaaS, outils de gestion interne, applications web métier, dashboards analytiques, systèmes de réservation, APIs et connecteurs avec vos outils existants.',
  },
  {
    q: 'Quelle est votre stack technique ?',
    a: 'Nous utilisons Next.js / React pour les interfaces, Node.js ou Python pour le back-end, PostgreSQL / MySQL pour les bases de données, et Docker pour le déploiement. La stack est choisie selon les contraintes de chaque projet.',
  },
  {
    q: 'Assurez-vous la maintenance après livraison ?',
    a: 'Oui. Nous proposons des contrats de maintenance : correctifs, mises à jour de sécurité, nouvelles fonctionnalités, formation des équipes. Le code source vous appartient intégralement à la livraison.',
  },
]

export default function AgenceLogicielLyonPage() {
  return (
    <>
      <Script
        id="schema-logiciel-lyon"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
        strategy="beforeInteractive"
      />
      <Script
        id="schema-webpage-logiciel-lyon"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBPAGE_SCHEMA) }}
        strategy="beforeInteractive"
      />
      <Script
        id="schema-faq-logiciel-lyon"
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
            <Image src="/images/work-3.webp" alt="" fill className="object-cover" priority />
            <div className="absolute inset-0" style={{ background: 'rgba(10,10,10,0.84)' }} />
          </div>
          <div className="relative z-10 max-w-[1200px] mx-auto">
            <p
              style={{ letterSpacing: '0.45em', fontSize: '11px' }}
              className="uppercase text-white/30 font-bold mb-6"
            >
              Alhambra Web · Développement logiciel Lyon
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
              Logiciel sur<br />
              <span style={{ color: 'rgba(248,246,242,0.2)', fontStyle: 'italic' }}>Mesure Lyon</span>
            </h1>
            <p
              style={{ fontFamily: 'var(--font-haas)', fontSize: 'clamp(16px,2vw,20px)', color: 'rgba(248,246,242,0.55)', lineHeight: 1.65, maxWidth: '620px' }}
              className="mt-8 mb-10"
            >
              Nous développons des logiciels et applications web sur mesure pour les entreprises
              lyonnaises. ERP, SaaS, outils métier, APIs — des solutions qui s'adaptent à vos
              processus, pas l'inverse.
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
              {[['100%', 'Code propriétaire'], ['Agile', 'Méthodologie'], ['Sur devis', 'Tarification']].map(([val, label]) => (
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


        <ServicesSection />
        <ContactSection />
        <FaqSection />
        <FooterSection />
      </main>
    </>
  )
}
