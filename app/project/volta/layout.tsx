import type { Metadata } from 'next';
import Script from 'next/script';

const BASE = 'https://alhambra-web.com';

export const metadata: Metadata = {
    title: 'Volta — Marque Automobile Électrique Premium | Showcase Alhambra',
    description: 'Création du site web Volta, marque automobile électrique premium. Animations cinématiques 3D, configurateur de véhicules, présentation des modèles, expérience immersive. Réalisé par Alhambra Web Lyon.',
    keywords: [
        'site web automobile électrique', 'création site web voiture électrique',
        'design site auto premium', 'site web marque premium next.js',
        'agence web automobile paris', 'création site produit premium',
        'volta electric vehicle', 'site web véhicule électrique luxe',
        'site web 3d automobile', 'animations cinématiques next.js',
    ],
    alternates: { canonical: '/project/volta', languages: { 'fr': 'https://www.alhambra-web.com/project/volta', 'fr-FR': 'https://www.alhambra-web.com/project/volta' } },
    openGraph: {
        title: 'Volta — Automobile Électrique Premium | Alhambra Web Lyon',
        description: 'Site web cinématique pour une marque automobile électrique premium. Animations 3D immersives, configurateur de modèles, specs techniques, design ultra-moderne.',
        url: `${BASE}/project/volta`,
        type: 'website',
        images: [{ url: `${BASE}/image%201.png`, width: 1200, height: 630, alt: 'Volta Electric Vehicle — Showcase Alhambra Web' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Volta — Automobile Électrique Premium | Alhambra Web',
        description: 'Site web cinématique pour une marque automobile électrique premium. Animations 3D immersives.',
        images: [`${BASE}/image%201.png`],
    },
};

const SCHEMA = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'WebPage',
            '@id': `${BASE}/project/volta/#webpage`,
            'url': `${BASE}/project/volta/`,
            'name': 'Volta — Marque Automobile Électrique Premium | Showcase Alhambra Web Lyon',
            'description': "Création du site web Volta, marque automobile électrique premium. Animations cinématiques, design immersif.",
            'inLanguage': 'fr-FR',
            'isPartOf': { '@id': `${BASE}/#website` },
            'dateModified': '2026-05-19',
            'breadcrumb': {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                    { '@type': 'ListItem', 'position': 1, 'name': 'Accueil', 'item': `${BASE}/` },
                    { '@type': 'ListItem', 'position': 2, 'name': 'Portfolio', 'item': `${BASE}/project/` },
                    { '@type': 'ListItem', 'position': 3, 'name': 'Volta Automobile', 'item': `${BASE}/project/volta/` },
                ],
            },
        },
        {
            '@type': 'CreativeWork',
            '@id': `${BASE}/project/volta/#project`,
            'name': 'Volta — Site Web Marque Automobile Électrique Premium',
            'url': `${BASE}/project/volta/`,
            'description': "Création du site web produit cinématique pour Volta, marque automobile électrique premium. Présentation immersive des modèles avec animations Three.js/Framer Motion, configurateur de véhicules en ligne, présentation des caractéristiques techniques, galerie 360°, localisateur de revendeurs. Expérience utilisateur digne des plus grandes marques automobiles mondiales. Stack : Next.js 16, React 19, TypeScript, Three.js, Framer Motion, GSAP.",
            'genre': 'Site Web Produit & Brand Digital',
            'keywords': 'site web automobile, electric vehicle, voiture électrique luxe, Three.js, animations cinématiques, GSAP, Framer Motion, Next.js, brand digital',
            'creator': { '@id': `${BASE}/#organization` },
            'dateCreated': '2025-11-01',
            'dateModified': '2026-05-19',
            'inLanguage': 'fr-FR',
            'about': { '@type': 'Thing', 'name': 'Automobile Électrique Premium' },
            'mainEntityOfPage': `${BASE}/project/volta/`,
            'isPartOf': { '@id': `${BASE}/#website` },
        },
    ],
};

export default function VoltaLayout({ children }: { children: React.ReactNode }) {
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
