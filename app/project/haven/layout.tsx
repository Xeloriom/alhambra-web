import type { Metadata } from 'next';
import Script from 'next/script';

const BASE = 'https://alhambra-web.com';

export const metadata: Metadata = {
    title: 'Haven — Agence Immobilière Prestige Paris | Showcase Alhambra',
    description: 'Création du site web Haven, agence immobilière de prestige parisienne. Catalogue de propriétés de luxe, carte interactive, filtres avancés, UX premium. Réalisé par Alhambra Web Lyon.',
    keywords: [
        'site web immobilier luxe paris', 'création site agence immobilière',
        'design site immobilier prestige', 'site web propriétés luxe paris',
        'agence web immobilier paris', 'création site vitrine immobilier',
        'haven immobilier prestige', 'site web real estate premium',
        'carte interactive immobilier', 'catalogue propriétés luxe',
    ],
    alternates: { canonical: '/project/haven' },
    openGraph: {
        title: 'Haven — Immobilier Prestige Paris | Alhambra Web Lyon',
        description: 'Site web de prestige pour une agence immobilière parisienne. Catalogue de propriétés luxe, carte interactive, design raffiné, animations fluides.',
        url: `${BASE}/project/haven`,
        type: 'website',
        images: [{ url: `${BASE}/image%201.png`, width: 1200, height: 630, alt: 'Haven Immobilier Prestige — Showcase Alhambra Web' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Haven — Immobilier Prestige Paris | Alhambra Web',
        description: 'Site web de prestige pour une agence immobilière parisienne. Design luxe, catalogue interactif.',
        images: [`${BASE}/image%201.png`],
    },
};

const SCHEMA = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'WebPage',
            '@id': `${BASE}/project/haven/#webpage`,
            'url': `${BASE}/project/haven/`,
            'name': 'Haven — Agence Immobilière Prestige Paris | Showcase Alhambra Web Lyon',
            'description': 'Création du site web Haven, agence immobilière de prestige parisienne. Catalogue de propriétés de luxe, design élégant, UX premium.',
            'inLanguage': 'fr-FR',
            'isPartOf': { '@id': `${BASE}/#website` },
            'dateModified': '2026-05-18',
            'breadcrumb': {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                    { '@type': 'ListItem', 'position': 1, 'name': 'Accueil', 'item': `${BASE}/` },
                    { '@type': 'ListItem', 'position': 2, 'name': 'Portfolio', 'item': `${BASE}/project/` },
                    { '@type': 'ListItem', 'position': 3, 'name': 'Haven Immobilier', 'item': `${BASE}/project/haven/` },
                ],
            },
        },
        {
            '@type': 'CreativeWork',
            '@id': `${BASE}/project/haven/#project`,
            'name': 'Haven — Site Web Agence Immobilière Prestige Paris',
            'url': `${BASE}/project/haven/`,
            'description': "Création complète du site web pour Haven, agence immobilière de prestige parisienne. Catalogue interactif de propriétés de luxe, filtres de recherche avancés, fiches propriétés premium, carte interactive, animations Framer Motion fluides. Design élégant orienté conversion et expérience utilisateur d'exception. Stack : Next.js, React 19, TypeScript, Framer Motion, Tailwind CSS v4.",
            'genre': 'Web Design & Développement',
            'keywords': 'immobilier luxe, real estate prestige, agence immobilière paris, design web premium, Next.js, Framer Motion, catalogue propriétés luxe',
            'creator': { '@id': `${BASE}/#organization` },
            'dateCreated': '2026-01-01',
            'dateModified': '2026-05-18',
            'inLanguage': 'fr-FR',
            'about': { '@type': 'Thing', 'name': 'Immobilier de Luxe Paris' },
            'mainEntityOfPage': `${BASE}/project/haven/`,
            'isPartOf': { '@id': `${BASE}/#website` },
        },
    ],
};

export default function HavenLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Script
                id="ld-json" type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
            />
            {children}
        </>
    );
}
