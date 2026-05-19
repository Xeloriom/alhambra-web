import type { Metadata } from 'next';
import Script from 'next/script';

const BASE = 'https://alhambra-web.com';

export const metadata: Metadata = {
    title: 'Portfolio — Réalisations Web Premium | Alhambra Web Lyon',
    description: 'Découvrez les sites web et applications créés par Alhambra Web Lyon : Lumière Parfums, Haven Immobilier, Nexus SaaS, Volta EV, Seren Wellness, Zénith Hôtel et nos clients réels.',
    keywords: [
        'portfolio agence web lyon', 'réalisations web premium',
        'exemples sites web paris', 'portfolio design digital',
        'création site web luxe exemple', 'agence next.js portfolio',
        'refonte site web exemple', 'référence agence web lyon',
        'sites web réalisés france', 'portfolio studio digital',
        'showcase design web', 'projets web next.js react',
    ],
    alternates: { canonical: '/project' },
    openGraph: {
        title: 'Portfolio Web Premium — Réalisations Alhambra Web Lyon',
        description: 'Sites web sur-mesure, design UI/UX et expériences digitales réalisés par Alhambra. Parfumerie de luxe, immobilier prestige, SaaS analytics, automobile électrique, wellness, hôtellerie.',
        url: `${BASE}/project`,
        type: 'website',
        images: [{ url: `${BASE}/image%201.png`, width: 1200, height: 630, alt: 'Portfolio Alhambra Web Lyon — Projets Web Premium' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Portfolio Web Premium — Réalisations Alhambra',
        description: 'Sites web sur-mesure, design UI/UX et applications réalisés par Alhambra Web Lyon.',
        images: [`${BASE}/image%201.png`],
    },
};

const SCHEMA = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'CollectionPage',
            '@id': `${BASE}/project/#webpage`,
            'url': `${BASE}/project/`,
            'name': 'Portfolio — Réalisations Web Premium | Alhambra Web Lyon',
            'description': 'Portfolio complet des sites web et applications digitales réalisés par Alhambra Web Lyon. Design UI/UX, développement Next.js, e-commerce, SaaS, hôtellerie, luxe.',
            'inLanguage': 'fr-FR',
            'isPartOf': { '@id': `${BASE}/#website` },
            'about': { '@id': `${BASE}/#organization` },
            'dateModified': '2026-05-18',
            'breadcrumb': {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                    { '@type': 'ListItem', 'position': 1, 'name': 'Accueil', 'item': `${BASE}/` },
                    { '@type': 'ListItem', 'position': 2, 'name': 'Portfolio', 'item': `${BASE}/project/` },
                ],
            },
        },
        {
            '@type': 'ItemList',
            '@id': `${BASE}/project/#list`,
            'name': 'Portfolio Showcase — Alhambra Web Lyon',
            'description': 'Sélection de projets web réalisés par Alhambra Web Lyon : sites de luxe, SaaS, e-commerce, hôtellerie, bien-être et automobile.',
            'numberOfItems': 6,
            'itemListElement': [
                { '@type': 'ListItem', 'position': 1, 'name': 'Lumière — Parfumerie Française de Luxe', 'url': `${BASE}/project/lumiere/` },
                { '@type': 'ListItem', 'position': 2, 'name': 'Haven — Immobilier Prestige Paris', 'url': `${BASE}/project/haven/` },
                { '@type': 'ListItem', 'position': 3, 'name': 'Nexus — SaaS Business Intelligence', 'url': `${BASE}/project/nexus/` },
                { '@type': 'ListItem', 'position': 4, 'name': 'Volta — Automobile Électrique Premium', 'url': `${BASE}/project/volta/` },
                { '@type': 'ListItem', 'position': 5, 'name': 'Seren — Centre Wellness & Spa Paris', 'url': `${BASE}/project/seren/` },
                { '@type': 'ListItem', 'position': 6, 'name': 'Zénith — Hôtel 5 Étoiles Lyon', 'url': `${BASE}/project/zenith/` },
            ],
        },
    ],
};

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
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
