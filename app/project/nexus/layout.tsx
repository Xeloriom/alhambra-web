import type { Metadata } from 'next';
import Script from 'next/script';

const BASE = 'https://alhambra-web.com';

export const metadata: Metadata = {
    title: 'Nexus — Plateforme SaaS Business Intelligence | Showcase Alhambra',
    description: 'Création de Nexus, plateforme SaaS d\'analytics et business intelligence. Dashboard temps réel, prédictions IA, 200+ intégrations, design produit moderne. Réalisé par Alhambra Web Lyon.',
    keywords: [
        'création site web saas paris', 'design produit saas',
        'développement application web saas', 'dashboard analytics next.js',
        'agence web saas paris', 'création application web métier',
        'nexus analytics business intelligence', 'design ui ux application saas',
        'dashboard temps réel next.js', 'plateforme b2b analytics',
    ],
    alternates: { canonical: '/project/nexus', languages: { 'fr': 'https://www.alhambra-web.com/project/nexus', 'fr-FR': 'https://www.alhambra-web.com/project/nexus' } },
    openGraph: {
        title: 'Nexus — SaaS Business Intelligence | Alhambra Web Lyon',
        description: 'Plateforme SaaS analytics avec dashboard temps réel, prédictions IA et 200+ intégrations. Design produit moderne et performant par Alhambra Web.',
        url: `${BASE}/project/nexus`,
        type: 'website',
        images: [{ url: `${BASE}/image%201.png`, width: 1200, height: 630, alt: 'Nexus SaaS Analytics — Showcase Alhambra Web' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Nexus SaaS — Business Intelligence | Alhambra Web',
        description: 'Plateforme SaaS analytics avec dashboard temps réel, prédictions IA. Design produit moderne.',
        images: [`${BASE}/image%201.png`],
    },
};

const SCHEMA = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'WebPage',
            '@id': `${BASE}/project/nexus/#webpage`,
            'url': `${BASE}/project/nexus/`,
            'name': 'Nexus — Plateforme SaaS Business Intelligence | Showcase Alhambra Web Lyon',
            'description': "Création de Nexus, plateforme SaaS d'analytics et business intelligence. Dashboard temps réel, prédictions IA, design produit moderne.",
            'inLanguage': 'fr-FR',
            'isPartOf': { '@id': `${BASE}/#website` },
            'dateModified': '2026-05-19',
            'breadcrumb': {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                    { '@type': 'ListItem', 'position': 1, 'name': 'Accueil', 'item': `${BASE}/` },
                    { '@type': 'ListItem', 'position': 2, 'name': 'Portfolio', 'item': `${BASE}/project/` },
                    { '@type': 'ListItem', 'position': 3, 'name': 'Nexus SaaS', 'item': `${BASE}/project/nexus/` },
                ],
            },
        },
        {
            '@type': 'CreativeWork',
            '@id': `${BASE}/project/nexus/#project`,
            'name': 'Nexus — Plateforme SaaS Analytics & Business Intelligence',
            'url': `${BASE}/project/nexus/`,
            'description': "Création de l'interface et du site web pour Nexus, plateforme SaaS de business intelligence. Dashboard analytique temps réel avec visualisations de données avancées, moteur de prédictions IA intégré, 200+ connecteurs d'intégration, gestion multi-équipes. Design produit B2B moderne avec dark mode, animations de données, tableaux de bord configurables. Stack : Next.js 16, React 19, TypeScript, Recharts, Framer Motion.",
            'genre': 'SaaS Product Design & Développement',
            'keywords': 'saas business intelligence, dashboard analytics, prédictions IA, design produit b2b, Next.js, React, TypeScript, data visualisation',
            'creator': { '@id': `${BASE}/#organization` },
            'dateCreated': '2026-02-01',
            'dateModified': '2026-05-19',
            'inLanguage': 'fr-FR',
            'about': { '@type': 'Thing', 'name': 'Business Intelligence & Analytics SaaS' },
            'mainEntityOfPage': `${BASE}/project/nexus/`,
            'isPartOf': { '@id': `${BASE}/#website` },
        },
    ],
};

export default function NexusLayout({ children }: { children: React.ReactNode }) {
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
