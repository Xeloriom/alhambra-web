import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'

const BASE = 'https://www.alhambra-web.com'
const PAGE_URL = `${BASE}/agence-web-ain`

export const metadata: Metadata = {
  title: 'Agence Web Ain — Création Site Web Pont-de-Chéruy',
  description: 'Agence web dans l\'Ain : création de sites pour artisans, PME et commerces. Pont-de-Chéruy, Lagnieu, La Balme-les-Grottes. Sites vitrines dès 800€. Devis gratuit.',
  alternates: { canonical: PAGE_URL, languages: { 'fr': PAGE_URL, 'fr-FR': PAGE_URL } },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: PAGE_URL,
    siteName: 'Alhambra Web',
    title: 'Agence Web Ain — Création Site Web | Alhambra',
    description: 'Agence web pour les entreprises de l\'Ain. Pont-de-Chéruy, Lagnieu, La Balme-les-Grottes. Sites professionnels dès 800€. Devis gratuit sous 24h.',
    images: [{ url: `${BASE}/image%201.png`, width: 1200, height: 630, alt: 'Agence Web Ain — Alhambra' }],
  },
}

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${PAGE_URL}/#business`,
  name: 'Alhambra Web — Agence Web Ain',
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
    { '@type': 'City', name: 'Pont-de-Chéruy' },
    { '@type': 'City', name: 'Lagnieu' },
    { '@type': 'City', name: 'La Balme-les-Grottes' },
    { '@type': 'City', name: 'Ambérieu-en-Bugey' },
    { '@type': 'City', name: 'Belley' },
    { '@type': 'City', name: 'Bourg-en-Bresse' },
    { '@type': 'AdministrativeArea', name: 'Ain' },
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
  { label: 'Site vitrine artisan Ain', desc: 'Présence professionnelle en ligne pour plombiers, électriciens, menuisiers. Dès 800€.' },
  { label: 'Site web PME Ain', desc: 'Sites multi-pages sur-mesure, responsive, optimisés SEO local.' },
  { label: 'Menu digital restaurant', desc: 'QR code, carte en ligne modifiable en temps réel. Dès 200€.' },
  { label: 'E-commerce Ain', desc: 'Boutique en ligne pour producteurs locaux et commerces de proximité.' },
  { label: 'Refonte site web', desc: 'Modernisation de votre site existant, amélioration des performances.' },
  { label: 'SEO local Ain', desc: 'Visibilité Google Maps, fiches établissements, référencement local.' },
]

const FAQS = [
  {
    q: 'Une agence web peut-elle intervenir dans l\'Ain (département 01) ?',
    a: 'Oui. Alhambra Web est basé à Lyon et se déplace régulièrement dans l\'Ain pour rencontrer ses clients à Pont-de-Chéruy, Lagnieu, La Balme-les-Grottes et dans tout le département 01. Nous pouvons aussi travailler entièrement en visioconférence.',
  },
  {
    q: 'Quel budget prévoir pour un site web à Pont-de-Chéruy ?',
    a: 'Un menu digital ou système d\'affichage débute à 200€. Un site vitrine professionnel est disponible dès 800€. Pour une boutique e-commerce ou une application sur-mesure, les tarifs démarrent à 2 000€. Devis gratuit et sans engagement sous 24h.',
  },
  {
    q: 'Créez-vous des sites pour les artisans de l\'Ain ?',
    a: 'C\'est l\'un de nos créneaux de prédilection. Nous avons accompagné des artisans, des TPE et des associations de La Balme-les-Grottes, Lagnieu, Pont-de-Chéruy. Sites clés en main, accessibles, qui génèrent de vrais contacts locaux.',
  },
  {
    q: 'Proposez-vous un référencement local pour les entreprises de l\'Ain ?',
    a: 'Oui. Chaque site que nous créons intègre les bases du SEO local : balises titres optimisées, données structurées JSON-LD, fiche Google Business Profile, optimisation pour les recherches géolocalisées. Résultat : vous apparaissez quand vos clients vous cherchent.',
  },
  {
    q: 'Quel délai pour recevoir mon site web ?',
    a: 'Comptez 2 à 4 semaines pour un site vitrine standard, et 4 à 8 semaines pour un projet plus complexe. Nous respectons les délais convenus — c\'est non négociable.',
  },
]


const WEBPAGE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${PAGE_URL}/#webpage`,
  'url': `${PAGE_URL}/`,
  'name': 'Agence Web Ain — Création Site Web | Alhambra Web Lyon',
  'inLanguage': 'fr-FR',
  'dateModified': '2026-05-19',
  'datePublished': '2026-01-01',
  'isPartOf': { '@id': 'https://www.alhambra-web.com/#website' },
  'about': { '@id': 'https://www.alhambra-web.com/#organization' },
}

export default function AgenceWebAinPage() {
  return (
    <>
      <Script
        id="schema-agence-web-ain"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
        strategy="beforeInteractive"
      />
      <Script
        id="schema-webpage-agence-web-ain"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBPAGE_SCHEMA) }}
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
              Alhambra Web · Ain (01), France
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-nordique)',
                fontSize: 'clamp(44px, 8vw, 112px)',
                lineHeight: 0.92,
                letterSpacing: '-0.03em',
              }}
            >
              Agence Web<br />
              <span style={{ color: 'rgba(248,246,242,0.2)', fontStyle: 'italic' }}>Ain</span>
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-haas)',
                fontSize: 'clamp(16px,2vw,20px)',
                color: 'rgba(248,246,242,0.55)',
                lineHeight: 1.65,
                maxWidth: '620px',
              }}
              className="mt-8 mb-10"
            >
              Artisans, commerçants et entreprises de l'Ain : nous créons votre présence en
              ligne sur-mesure. Pont-de-Chéruy, Lagnieu, La Balme-les-Grottes — nous connaissons
              votre territoire et nous y venons.
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
              {[['Dès 200€', 'Menu digital'], ['Dès 800€', 'Site vitrine'], ['2–4 sem.', 'Livraison']].map(([val, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(20px,2.8vw,30px)', color: '#F8F6F2' }}>
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
                  L'agence web qui connaît<br />
                  <span style={{ color: 'rgba(10,10,10,0.25)', fontStyle: 'italic' }}>l'Ain de l'intérieur.</span>
                </h2>
                <div style={{ fontFamily: 'var(--font-haas)', color: 'rgba(10,10,10,0.6)', lineHeight: 1.8, fontSize: '15px' }} className="space-y-4">
                  <p>
                    L'Ain est un département dynamique : artisans de la Côtière, vignerons du Bugey,
                    industriels de la Plaine de l'Ain, restaurateurs du Pays de Gex. Tous ont
                    besoin d'une présence web à la hauteur de leur savoir-faire.
                  </p>
                  <p>
                    Alhambra Web est l'agence digitale basée à Lyon qui connaît le tissu économique
                    de l'Ain. Nous nous déplaçons à Pont-de-Chéruy, Lagnieu et La Balme-les-Grottes,
                    et nous collaborons régulièrement avec des clients d'Ambérieu-en-Bugey,
                    Bourg-en-Bresse et Belley.
                  </p>
                  <p>
                    De la vitrine simple pour un artisan à l'application web pour une PME
                    de la zone industrielle de Montluel, nous calibrons notre travail à votre
                    budget et à vos objectifs réels. Aucun projet n'est trop petit.
                  </p>
                </div>
              </div>

              <div>
                <h2
                  style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(20px,2.5vw,28px)', letterSpacing: '-0.01em' }}
                  className="mb-6"
                >
                  Nos services dans l'Ain
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
              Questions fréquentes — Ain
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

        {/* ── INTERNAL LINKS ── */}
        <section style={{ background: '#FFFFFF' }} className="px-6 sm:px-10 lg:px-20 py-14 border-t border-black/5">
          <div className="max-w-[1200px] mx-auto">
            <p style={{ fontFamily: 'var(--font-haas)', fontSize: '12px', color: 'rgba(10,10,10,0.3)', letterSpacing: '0.3em', textTransform: 'uppercase' }} className="mb-5">
              Zones voisines
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Agence Web Lyon', href: '/agence-web-lyon/' },
                { label: 'Agence Web Isère', href: '/agence-web-isere/' },
                { label: 'Agence Web Pont-de-Chéruy', href: '/agence-web-pont-de-cheruy/' },
                { label: 'Agence Web Villeurbanne', href: '/agence-web-villeurbanne/' },
                { label: 'Agence Web Rhône-Alpes', href: '/agence-web-rhone-alpes/' },
                { label: 'Site Web Restaurant', href: '/creation-site-web-restaurant/' },
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
            style={{ fontFamily: 'var(--font-nordique)', fontSize: 'clamp(36px,6vw,80px)', lineHeight: 0.9, letterSpacing: '-0.03em' }}
            className="mb-6"
          >
            Votre projet<br />
            <span style={{ color: 'rgba(248,246,242,0.22)', fontStyle: 'italic' }}>dans l&apos;Ain.</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-haas)', color: 'rgba(248,246,242,0.45)', fontSize: '15px' }} className="mb-10 max-w-md mx-auto">
            Déplacement possible à Pont-de-Chéruy, Lagnieu, La Balme-les-Grottes · Dès 200€
          </p>
          <a
            href="/#contact"
            style={{ background: '#F8F6F2', color: '#0A0A0A', fontFamily: 'var(--font-haas)' }}
            className="inline-block px-10 py-5 rounded-full text-sm font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors"
          >
            Demander un devis
          </a>
        </section>
      </main>
    </>
  )
}
