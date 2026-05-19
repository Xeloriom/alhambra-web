import type { Metadata } from 'next';
import Script from 'next/script';

const BASE = 'https://alhambra-web.com';

export const metadata: Metadata = {
    title: 'Seren — Centre Wellness & Spa Paris | Showcase Alhambra',
    description: 'Création du site web Seren, centre de bien-être premium parisien. Réservation de soins en ligne, yoga, méditation, spa. Design apaisant et élégant. Réalisé par Alhambra Web Lyon.',
    keywords: [
        'site web spa paris', 'création site web bien-être',
        'design site centre yoga paris', 'réservation soins en ligne',
        'site web wellness premium', 'agence web spa beauté paris',
        'seren wellness centre', 'création site web soin beauté',
        'design site méditation yoga', 'site réservation bien-être',
    ],
    alternates: { canonical: '/project/seren', languages: { 'fr': 'https://www.alhambra-web.com/project/seren', 'fr-FR': 'https://www.alhambra-web.com/project/seren' } },
    openGraph: {
        title: 'Seren — Wellness & Spa Centre Premium | Alhambra Web Lyon',
        description: 'Site web apaisant pour un centre de bien-être premium parisien. Réservation en ligne, yoga, méditation, spa. Design élégant et immersif.',
        url: `${BASE}/project/seren`,
        type: 'website',
        images: [{ url: `${BASE}/image%201.png`, width: 1200, height: 630, alt: 'Seren Wellness Spa — Showcase Alhambra Web' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Seren Wellness & Spa Paris | Alhambra Web',
        description: 'Site web apaisant pour un centre de bien-être premium parisien. Réservation en ligne, design élégant.',
        images: [`${BASE}/image%201.png`],
    },
};

const SCHEMA = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'WebPage',
            '@id': `${BASE}/project/seren/#webpage`,
            'url': `${BASE}/project/seren/`,
            'name': 'Seren — Centre Wellness & Spa Paris | Showcase Alhambra Web Lyon',
            'description': 'Création du site web Seren, centre de bien-être premium parisien. Réservation de soins en ligne, yoga, méditation, spa. Design apaisant.',
            'inLanguage': 'fr-FR',
            'isPartOf': { '@id': `${BASE}/#website` },
            'dateModified': '2026-05-19',
            'breadcrumb': {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                    { '@type': 'ListItem', 'position': 1, 'name': 'Accueil', 'item': `${BASE}/` },
                    { '@type': 'ListItem', 'position': 2, 'name': 'Portfolio', 'item': `${BASE}/project/` },
                    { '@type': 'ListItem', 'position': 3, 'name': 'Seren Wellness', 'item': `${BASE}/project/seren/` },
                ],
            },
        },
        {
            '@type': 'CreativeWork',
            '@id': `${BASE}/project/seren/#project`,
            'name': 'Seren — Site Web Centre Wellness & Spa Premium Paris',
            'url': `${BASE}/project/seren/`,
            'description': "Création du site web pour Seren, centre de bien-être premium parisien. Système de réservation de soins en ligne, présentation des offres (yoga, méditation, massages, spa), galerie des espaces, tarifs et forfaits, témoignages clients. Design apaisant avec palette naturelle, animations fluides Framer Motion, typographie élégante. Expérience digitale reflétant le calme et la sérénité de la marque. Stack : Next.js 16, React 19, TypeScript, Framer Motion, Tailwind CSS v4.",
            'genre': 'Web Design & Développement Wellness',
            'keywords': 'wellness spa paris, bien-être digital, réservation soins en ligne, yoga méditation, design apaisant, Next.js, Framer Motion',
            'creator': { '@id': `${BASE}/#organization` },
            'dateCreated': '2025-10-01',
            'dateModified': '2026-05-19',
            'inLanguage': 'fr-FR',
            'about': { '@type': 'Thing', 'name': 'Centre Wellness & Spa Premium Paris' },
            'mainEntityOfPage': `${BASE}/project/seren/`,
            'isPartOf': { '@id': `${BASE}/#website` },
        },
    ],
};

export default function SerenLayout({ children }: { children: React.ReactNode }) {
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
