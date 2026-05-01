// app/components/seo-head.tsx
// Drop this into your root layout <head> via a Server Component

import type { Metadata } from 'next';

// ─── Metadata export for Next.js App Router ─────────────────────────────────
export const siteMetadata: Metadata = {
  metadataBase: new URL('https://alhambra-web.fr'),
  title: {
    default: 'Alhambra Web — Studio Créatif & Digital',
    template: '%s | Alhambra Web',
  },
  description:
    'Studio digital premium basé à Lyon & Paris. Conception de sites web haute performance, identités visuelles et expériences numériques de niveau Awwwards. Next.js, animation, SEO.',
  keywords: [
    'agence web Lyon',
    'studio digital Paris',
    'création site web premium',
    'Next.js agence France',
    'design UI/UX haut de gamme',
    'Framer Motion animation',
    'identité visuelle',
    'agence digitale',
    'Alhambra Web',
  ],
  authors: [{ name: 'Alhambra Web', url: 'https://alhambra-web.fr' }],
  creator: 'Alhambra Web',
  publisher: 'Alhambra Web',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://alhambra-web.fr',
    siteName: 'Alhambra Web',
    title: 'Alhambra Web — Studio Créatif & Digital',
    description:
      'Studio digital premium. Sites web Awwwards-level, motion design, identité visuelle. Lyon & Paris.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Alhambra Web — Studio Créatif & Digital',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alhambra Web — Studio Créatif & Digital',
    description: 'Studio digital premium. Sites web Awwwards-level. Lyon & Paris.',
    images: ['/og-image.jpg'],
    creator: '@AlhambraWeb',
  },
  alternates: {
    canonical: 'https://alhambra-web.fr',
    languages: { 'fr-FR': 'https://alhambra-web.fr' },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'YOUR_GOOGLE_SITE_VERIFICATION_TOKEN', // replace
  },
};

// ─── JSON-LD Structured Data ─────────────────────────────────────────────────
// Inject into your root layout via <script type="application/ld+json">
export const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://alhambra-web.fr/#organization',
      name: 'Alhambra Web',
      url: 'https://alhambra-web.fr',
      logo: {
        '@type': 'ImageObject',
        url: 'https://alhambra-web.fr/logo.svg',
      },
      description:
        'Studio créatif & digital premium spécialisé dans la création de sites web haute performance, identités visuelles et expériences numériques.',
      foundingDate: '2017',
      areaServed: ['FR'],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lyon',
        addressCountry: 'FR',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: 'French',
      },
      sameAs: [
        'https://www.instagram.com/alhambraweb',
        'https://www.linkedin.com/company/alhambra-web',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://alhambra-web.fr/#website',
      url: 'https://alhambra-web.fr',
      name: 'Alhambra Web',
      publisher: { '@id': 'https://alhambra-web.fr/#organization' },
      inLanguage: 'fr-FR',
    },
    {
      '@type': 'ProfessionalService',
      '@id': 'https://alhambra-web.fr/#service',
      name: 'Alhambra Web — Studio Digital',
      image: 'https://alhambra-web.fr/og-image.jpg',
      url: 'https://alhambra-web.fr',
      priceRange: '€€€',
      serviceType: [
        'Création de sites web',
        'Design UI/UX',
        'Identité visuelle',
        'Motion design',
        'SEO technique',
        'Développement Next.js',
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'Quel est le délai de réalisation ?', acceptedAnswer: { '@type': 'Answer', text: '4 à 8 semaines pour un impact chirurgical.' } },
        { '@type': 'Question', name: 'Quelles technologies utilisez-vous ?', acceptedAnswer: { '@type': 'Answer', text: 'Next.js, TypeScript, Framer Motion, TailwindCSS. Performance brute, zéro compromis.' } },
        { '@type': 'Question', name: 'Proposez-vous de la maintenance ?', acceptedAnswer: { '@type': 'Answer', text: 'Oui, nous veillons sur votre empire digital 24/7.' } },
        { '@type': 'Question', name: 'Quel est le budget minimum ?', acceptedAnswer: { '@type': 'Answer', text: 'Nos projets démarrent à partir de 3 000 €, selon la complexité.' } },
        { '@type': 'Question', name: 'Travaillez-vous à distance ?', acceptedAnswer: { '@type': 'Answer', text: 'Oui, depuis Lyon, Paris ou partout ailleurs via le digital.' } },
        { '@type': 'Question', name: 'Le code m'appartient-il ?', acceptedAnswer: { '@type': 'Answer', text: 'Oui, le code vous appartient à 100%. Livraison du repo Git à la fin du projet.' } },
      ],
    },
  ],
};

// ─── Component: inject JSON-LD (use in layout.tsx) ───────────────────────────
export function StructuredDataScript() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
