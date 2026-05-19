import type { Metadata } from 'next';
import Script from 'next/script';

const BASE = 'https://alhambra-web.com';

export const metadata: Metadata = {
    title: 'Zénith — Hôtel 5 Étoiles Lyon | Showcase Alhambra',
    description: 'Création du site web Zénith, hôtel de luxe 5 étoiles à Lyon. Restaurant gastronomique étoilé Michelin, spa 800m², 48 suites premium, réservation en ligne. Réalisé par Alhambra Web Lyon.',
    keywords: [
        'site web hôtel luxe lyon', 'création site web hôtel 5 étoiles',
        'design site hôtel prestige lyon', 'site web restaurant étoilé michelin',
        'hôtel presqu île lyon', 'agence web hôtellerie luxe',
        'site hôtelier premium next.js', 'zenith hotel lyon showcase',
        'réservation hôtel en ligne', 'design web hôtellerie haut de gamme',
    ],
    alternates: { canonical: '/project/zenith', languages: { 'fr': 'https://www.alhambra-web.com/project/zenith', 'fr-FR': 'https://www.alhambra-web.com/project/zenith' } },
    openGraph: {
        title: 'Zénith — Hôtel 5 Étoiles Lyon | Alhambra Web Lyon',
        description: 'Site web immersif pour un hôtel 5 étoiles lyonnais. Restaurant étoilé Michelin, spa 800m², 48 suites premium. Design hôtelier haut de gamme, réservation en ligne.',
        url: `${BASE}/project/zenith`,
        type: 'website',
        images: [{ url: `${BASE}/image%201.png`, width: 1200, height: 630, alt: 'Zénith Hôtel Lyon — Showcase Alhambra Web' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Zénith Hôtel 5 Étoiles Lyon | Alhambra Web',
        description: 'Site web immersif pour un hôtel 5 étoiles à Lyon. Restaurant Michelin, spa 800m², 48 suites premium.',
        images: [`${BASE}/image%201.png`],
    },
};

const SCHEMA = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'WebPage',
            '@id': `${BASE}/project/zenith/#webpage`,
            'url': `${BASE}/project/zenith/`,
            'name': 'Zénith — Hôtel 5 Étoiles Lyon | Showcase Alhambra Web Lyon',
            'description': "Création du site web Zénith, hôtel de luxe 5 étoiles à Lyon. Restaurant étoilé Michelin, spa 800m², 48 suites premium.",
            'inLanguage': 'fr-FR',
            'isPartOf': { '@id': `${BASE}/#website` },
            'dateModified': '2026-05-19',
            'breadcrumb': {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                    { '@type': 'ListItem', 'position': 1, 'name': 'Accueil', 'item': `${BASE}/` },
                    { '@type': 'ListItem', 'position': 2, 'name': 'Portfolio', 'item': `${BASE}/project/` },
                    { '@type': 'ListItem', 'position': 3, 'name': 'Zénith Hôtel', 'item': `${BASE}/project/zenith/` },
                ],
            },
        },
        {
            '@type': 'CreativeWork',
            '@id': `${BASE}/project/zenith/#project`,
            'name': "Zénith — Site Web Hôtel 5 Étoiles Lyon",
            'url': `${BASE}/project/zenith/`,
            'description': "Création du site web immersif pour le Zénith, hôtel de luxe 5 étoiles situé sur la Presqu'île lyonnaise. Présentation des 48 chambres et suites premium, galerie photographique haut de gamme, restaurant gastronomique étoilé Michelin, spa 800m² avec piscine, bar panoramique, système de réservation en ligne. Expérience digitale cinématique avec parallaxe avancé, transitions fluides et typographie éditoriale. Stack : Next.js 16, React 19, TypeScript, Framer Motion, GSAP.",
            'genre': 'Web Design Hôtellerie & Gastronomie',
            'keywords': 'hôtel luxe lyon, 5 étoiles, restaurant michelin, spa premium, réservation hôtel, design web hôtellerie, Next.js, Framer Motion, GSAP',
            'creator': { '@id': `${BASE}/#organization` },
            'dateCreated': '2026-03-01',
            'dateModified': '2026-05-19',
            'inLanguage': 'fr-FR',
            'about': { '@type': 'Thing', 'name': "Hôtellerie de Luxe Lyon 5 Étoiles" },
            'mainEntityOfPage': `${BASE}/project/zenith/`,
            'isPartOf': { '@id': `${BASE}/#website` },
        },
    ],
};

export default function ZenithLayout({ children }: { children: React.ReactNode }) {
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
