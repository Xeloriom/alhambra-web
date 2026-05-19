import type { Metadata } from 'next';
import Script from 'next/script';

const BASE = 'https://alhambra-web.com';

export const metadata: Metadata = {
    title: 'Lumière — Maison de Parfumerie Française Luxe | Showcase Alhambra',
    description: 'Création du site web de Lumière, maison de parfumerie de luxe parisienne. E-commerce parfum premium, design éditorial haut de gamme, expérience immersive. Réalisé par Alhambra Web Lyon.',
    keywords: [
        'site web parfumerie luxe', 'création site web luxe paris',
        'e-commerce parfum premium', 'design site maison parfum',
        'site web haut de gamme paris', 'agence web luxe paris',
        'lumière parfums maison', 'création site e-commerce luxe',
        'design éditorial web luxe', 'site web parfum french',
    ],
    alternates: { canonical: '/project/lumiere', languages: { 'fr': 'https://www.alhambra-web.com/project/lumiere', 'fr-FR': 'https://www.alhambra-web.com/project/lumiere' } },
    openGraph: {
        title: 'Lumière — Maison de Parfumerie Française | Alhambra Web Lyon',
        description: 'Site web immersif pour une maison de parfumerie française de luxe. E-commerce premium, design éditorial, animations Framer Motion, expérience olfactive digitale.',
        url: `${BASE}/project/lumiere`,
        type: 'website',
        images: [{ url: `${BASE}/image%201.png`, width: 1200, height: 630, alt: 'Lumière Parfumerie Luxe — Showcase Alhambra Web' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Lumière — Maison de Parfumerie Française | Alhambra Web',
        description: 'Site web immersif pour une maison de parfumerie française de luxe. E-commerce premium.',
        images: [`${BASE}/image%201.png`],
    },
};

const SCHEMA = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'WebPage',
            '@id': `${BASE}/project/lumiere/#webpage`,
            'url': `${BASE}/project/lumiere/`,
            'name': 'Lumière — Maison de Parfumerie Française Luxe | Showcase Alhambra Web',
            'description': 'Création du site web Lumière, maison de parfumerie de luxe parisienne. Design éditorial haut de gamme, e-commerce parfum, expérience immersive.',
            'inLanguage': 'fr-FR',
            'isPartOf': { '@id': `${BASE}/#website` },
            'dateModified': '2026-05-19',
            'breadcrumb': {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                    { '@type': 'ListItem', 'position': 1, 'name': 'Accueil', 'item': `${BASE}/` },
                    { '@type': 'ListItem', 'position': 2, 'name': 'Portfolio', 'item': `${BASE}/project/` },
                    { '@type': 'ListItem', 'position': 3, 'name': 'Lumière Parfumerie', 'item': `${BASE}/project/lumiere/` },
                ],
            },
        },
        {
            '@type': 'CreativeWork',
            '@id': `${BASE}/project/lumiere/#project`,
            'name': 'Lumière — Site Web E-commerce Maison de Parfumerie Française',
            'url': `${BASE}/project/lumiere/`,
            'description': "Création du site web e-commerce haut de gamme pour Lumière, maison de parfumerie française de luxe. Design éditorial immersif, catalogue de parfums premium avec transitions fluides, tunnel d'achat optimisé, storytelling de marque, animations Framer Motion cinématiques. Stack : Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion. Expérience utilisateur d'exception pour marque de luxe.",
            'genre': 'E-commerce & Web Design Luxe',
            'keywords': 'parfumerie luxe, e-commerce premium, maison de parfum france, design web luxe, Next.js e-commerce, Framer Motion, expérience immersive',
            'creator': { '@id': `${BASE}/#organization` },
            'dateCreated': '2025-12-01',
            'dateModified': '2026-05-19',
            'inLanguage': 'fr-FR',
            'about': { '@type': 'Thing', 'name': 'Parfumerie de Luxe Française' },
            'mainEntityOfPage': `${BASE}/project/lumiere/`,
            'isPartOf': { '@id': `${BASE}/#website` },
        },
    ],
};

export default function LumiereLayout({ children }: { children: React.ReactNode }) {
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
