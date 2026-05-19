import type { Metadata, Viewport } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { SmoothScroll } from "@/components/smooth-scroll";
import LayoutClient from "@/components/layout-client";
import { ContactPanelProvider } from "@/components/contact-panel-context";
import Script from "next/script";

const haas = localFont({
    src: "./fonts/Neue.ttf",
    variable: "--font-haas",
    display: "swap",
    weight: "500",
});

const nordique = localFont({
    src: "./fonts/NordiquePro.ttf",
    variable: "--font-nordique",
    display: "swap",
    weight: "600",
});

const BASE = 'https://www.alhambra-web.com';

export const metadata: Metadata = {
    title: {
        default: "Agence Web Lyon | Création Site Web & Design UI/UX | Alhambra",
        template: "%s | Alhambra — Agence Web Lyon",
    },
    description: "Agence web à Lyon — création de sites sur-mesure, design UI/UX & développement Next.js. Score Lighthouse 95+ garanti. Devis gratuit en 24h. Dès 200€.",
    keywords: [
        // Primary — local Lyon
        "agence web lyon", "agence web premium lyon", "création site web lyon",
        "agence digitale lyon", "agence web sur mesure lyon", "studio web lyon",
        "développement web lyon", "design web lyon", "design ui ux lyon",
        "agence ux ui lyon", "site web vitrine lyon", "création site vitrine lyon",
        // Zone d'intervention
        "agence web pont-de-chéruy", "création site web pont-de-chéruy",
        "agence web lagnieu", "création site web lagnieu",
        "agence web lagnieu ain",
        "agence web la balme les grottes", "création site web la balme les grottes",
        "agence web ain", "agence web ain 01",
        "agence web pontcharra", "site web artisan ain",
        "agence web isère", "agence web métropole lyon",
        "agence web auvergne-rhône-alpes", "agence web rhône-alpes",
        "création site web ain", "création site web isère",
        // Services
        "création site web", "refonte site web", "refonte site internet",
        "développement web sur mesure",
        "site web vitrine", "création site e-commerce lyon",
        // Tech stack
        "agence next.js", "agence next.js lyon", "développement next.js",
        "agence react lyon", "développement react", "typescript react",
        // Performance
        "agence web performance", "lighthouse 95", "core web vitals",
        "site web rapide", "optimisation seo technique",
        // Premium
        "agence web luxe", "agence web luxe lyon", "studio digital lyon",
        "studio créatif lyon", "création site web premium",
        // Long-tail conversion
        "meilleure agence web lyon", "agence web devis gratuit lyon",
        "création site web professionnel lyon", "agence web stratégie digitale",
        "refonte site web professionnel", "agence web avec garantie seo",
        // E-commerce
        "agence e-commerce lyon", "création boutique shopify lyon",
        "création boutique en ligne sur mesure",
        // Brand
        "alhambra", "alhambra web", "alhambra studio",
        // Emerging 2026
        "agence web ia lyon", "agence geo lyon",
    ],
    metadataBase: new URL(BASE),
    alternates: {
        canonical: 'https://www.alhambra-web.com',
    },
    openGraph: {
        type: 'website',
        locale: 'fr_FR',
        url: 'https://www.alhambra-web.com',
        siteName: 'Alhambra Web',
        title: 'Agence Web Lyon | Création Site Web Sur-Mesure | Alhambra',
        description: 'Agence web premium à Lyon — création de sites sur-mesure, design UI/UX & développement Next.js. Lighthouse 95+ garanti, code livré, dès 200€. Devis gratuit 24h.',
        images: [
            {
                url: 'https://www.alhambra-web.com/360_F_277496258_5IhE5FT8VoYdByzr0FUjkTBz968ea6zV-removebg-preview-DjTx7Qcd%20copy.png',
                width: 1200,
                height: 630,
                alt: 'Alhambra Web — Agence Web Premium Lyon',
                type: 'image/png',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Agence Web Lyon | Création Site Web Sur-Mesure | Alhambra',
        description: 'Agence web premium à Lyon — création de sites sur-mesure, design UI/UX & développement Next.js. Lighthouse 95+ garanti, code livré, dès 200€. Devis gratuit 24h.',
        images: ['https://www.alhambra-web.com/360_F_277496258_5IhE5FT8VoYdByzr0FUjkTBz968ea6zV-removebg-preview-DjTx7Qcd%20copy.png'],
        creator: '@AlhambraWeb',
        site: '@AlhambraWeb',
    },
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
    icons: {
        icon: [
            { url: '/logo.svg', type: 'image/svg+xml' },
            { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
            { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
        ],
        apple: '/apple-touch-icon.png',
        shortcut: '/logo.svg',
    },
    manifest: '/manifest.json',
    category: 'technology',
    creator: 'Alhambra Web Lyon',
    publisher: 'Alhambra Web Lyon',
    authors: [{ name: 'Alhambra Web Lyon', url: BASE }],
    generator: 'Next.js',
    applicationName: 'Alhambra Web',
    referrer: 'origin-when-cross-origin',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
    ],
};

// ── Structured Data (JSON-LD) ──────────────────────────────────────────────

const GRAPH_SCHEMA = {
    "@context": "https://schema.org",
    "@graph": [
        // ── 1. Organization ──────────────────────────────────────────────
        {
            "@type": "Organization",
            "@id": `${BASE}/#organization`,
            "name": "Alhambra Web",
            "alternateName": ["Alhambra Studio", "Alhambra"],
            "url": BASE,
            "logo": {
                "@type": "ImageObject",
                "url": `${BASE}/logo.svg`,
                "width": 200,
                "height": 60,
                "caption": "Alhambra Web Lyon — Agence Web Premium",
            },
            "image": `${BASE}/image%201.png`,
            "description": "Agence web premium basée à Lyon, spécialisée dans la création de sites web sur-mesure, le design UI/UX et le développement Next.js haute performance. Intervient à Lyon, Pont-de-Chéruy, Lagnieu et La Balme-les-Grottes.",
            "foundingDate": "2017",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Lyon",
                "addressRegion": "Auvergne-Rhône-Alpes",
                "postalCode": "69000",
                "addressCountry": "FR",
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": "45.7640",
                "longitude": "4.8357",
            },
            "areaServed": [
                { "@type": "City", "name": "Lyon" },
                { "@type": "City", "name": "Pont-de-Chéruy" },
                { "@type": "City", "name": "Lagnieu" },
                { "@type": "City", "name": "La Balme-les-Grottes" },
                { "@type": "AdministrativeArea", "name": "Métropole de Lyon" },
                { "@type": "AdministrativeArea", "name": "Ain" },
                { "@type": "AdministrativeArea", "name": "Isère" },
                { "@type": "AdministrativeArea", "name": "Auvergne-Rhône-Alpes" },
                { "@type": "Country", "name": "France" },
                { "@type": "Country", "name": "Belgique" },
                { "@type": "Country", "name": "Suisse" },
                { "@type": "Country", "name": "Canada" },
            ],
            "knowsAbout": [
                "Web Design", "UI/UX Design", "Développement Web",
                "Next.js", "React", "TypeScript", "Tailwind CSS",
                "SEO Technique", "Branding", "E-commerce", "Performance Web",
                "Core Web Vitals", "Framer Motion",
            ],
            "knowsLanguage": ["fr", "en"],
            "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "contact@alhambra-web.com",
                "availableLanguage": ["French", "English"],
                "url": `${BASE}/#contact`,
            },
            "slogan": "On ne fait pas du web — on bâtit des empires.",
            "numberOfEmployees": { "@type": "QuantitativeValue", "value": "2" },
            "priceRange": "Dès 200€",
            "sameAs": [
                "https://twitter.com/AlhambraWeb",
                "https://www.linkedin.com/company/alhambra-web",
                "https://www.instagram.com/alhambraweb",
                "https://github.com/alhambra-web",
            ],
        },

        // ── 2. WebSite ────────────────────────────────────────────────────
        {
            "@type": "WebSite",
            "@id": `${BASE}/#website`,
            "url": BASE,
            "name": "Alhambra Web Lyon",
            "description": "Agence web premium basée à Lyon. Design radical, développement de pointe, impact garanti.",
            "publisher": { "@id": `${BASE}/#organization` },
            "inLanguage": "fr-FR",
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${BASE}/?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
            },
        },

        // ── 3. WebPage ────────────────────────────────────────────────────
        {
            "@type": "WebPage",
            "@id": `${BASE}/#webpage`,
            "url": BASE,
            "name": "Agence Web Lyon | Création Site Web & Design UI/UX | Alhambra",
            "description": "Agence web premium à Lyon. Création de sites sur-mesure, design UI/UX & développement Next.js. Lighthouse 95+ garanti.",
            "isPartOf": { "@id": `${BASE}/#website` },
            "about": { "@id": `${BASE}/#organization` },
            "inLanguage": "fr-FR",
            "dateModified": "2026-05-19",
            "datePublished": "2017-01-01",
            "speakable": {
                "@type": "SpeakableSpecification",
                "cssSelector": ["h1", "h2", ".hero-headline", "meta[name='description']"],
            },
            "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Accueil",
                        "item": BASE,
                    },
                ],
            },
        },

        // ── 4. LocalBusiness + ProfessionalService ────────────────────────
        {
            "@type": ["LocalBusiness", "ProfessionalService"],
            "@id": `${BASE}/#business`,
            "name": "Alhambra Web Lyon",
            "url": BASE,
            "image": `${BASE}/image%201.png`,
            "priceRange": "Dès 200€",
            "currenciesAccepted": "EUR",
            "paymentAccepted": "Virement bancaire, Carte bancaire",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Lyon",
                "addressRegion": "Auvergne-Rhône-Alpes",
                "postalCode": "69000",
                "addressCountry": "FR",
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": "45.7640",
                "longitude": "4.8357",
            },
            "areaServed": [
                { "@type": "City", "name": "Lyon" },
                { "@type": "City", "name": "Pont-de-Chéruy" },
                { "@type": "City", "name": "Lagnieu" },
                { "@type": "City", "name": "La Balme-les-Grottes" },
                { "@type": "AdministrativeArea", "name": "Métropole de Lyon" },
                { "@type": "AdministrativeArea", "name": "Ain" },
                { "@type": "AdministrativeArea", "name": "Isère" },
            ],
            "email": "contact@alhambra-web.com",
            "openingHoursSpecification": [
                {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                    "opens": "09:00",
                    "closes": "18:00",
                },
            ],
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5",
                "reviewCount": "12",
                "bestRating": "5",
                "worstRating": "1",
            },
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Services Digitaux Alhambra Web",
                "itemListElement": [
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Création de site web premium",
                            "description": "Sites web sur-mesure, hautement performants et optimisés SEO. Stack Next.js, React, TypeScript. Score Lighthouse 95+ garanti.",
                            "serviceType": "Web Design and Development",
                            "provider": { "@id": `${BASE}/#organization` },
                            "areaServed": "Lyon, Pont-de-Chéruy, Lagnieu, La Balme-les-Grottes, Ain, Isère",
                            "url": `${BASE}/#services`,
                        },
                    },
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Design UI/UX & Identité Visuelle",
                            "description": "Branding, design d'interfaces, direction artistique et identité visuelle pour marques ambitieuses.",
                            "serviceType": "UI/UX Design",
                            "provider": { "@id": `${BASE}/#organization` },
                            "areaServed": "Lyon, Ain, Isère, Auvergne-Rhône-Alpes",
                            "url": `${BASE}/#services`,
                        },
                    },
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Développement Web & Applications",
                            "description": "Développement full-stack Next.js, APIs REST/GraphQL, intégrations tiers. Code clean, architecture scalable, TypeScript.",
                            "serviceType": "Web Development",
                            "provider": { "@id": `${BASE}/#organization` },
                            "areaServed": "Lyon, Ain, Isère, Auvergne-Rhône-Alpes",
                            "url": `${BASE}/#services`,
                        },
                    },
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "SEO Technique & Growth Digital",
                            "description": "Audit SEO complet, optimisation Core Web Vitals, score Lighthouse 95+, stratégie de croissance organique durable.",
                            "serviceType": "SEO and Digital Growth",
                            "provider": { "@id": `${BASE}/#organization` },
                            "areaServed": "Lyon, Ain, Isère, Auvergne-Rhône-Alpes",
                            "url": `${BASE}/#services`,
                        },
                    },
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Refonte de Site Web",
                            "description": "Audit technique, redesign complet, amélioration des performances et du SEO. Refonte totale ou partielle selon les besoins.",
                            "serviceType": "Website Redesign",
                            "provider": { "@id": `${BASE}/#organization` },
                            "areaServed": "Lyon, Ain, Isère, Auvergne-Rhône-Alpes",
                        },
                    },
                ],
            },
        },

        // ── 5. VideoObject — hero video ───────────────────────────────────────
        {
            "@type": "VideoObject",
            "@id": `${BASE}/#hero-video`,
            "name": "Alhambra Web Lyon — Studio Créatif Digital",
            "description": "Vidéo de présentation du studio créatif Alhambra Web Lyon. Agence web premium : création de sites sur-mesure, design UI/UX radical, développement Next.js haute performance.",
            "thumbnailUrl": `${BASE}/image%201.png`,
            "contentUrl": "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260428_193507_4286c423-2fd9-4efd-92bd-91a939453fc1.mp4",
            "uploadDate": "2026-05-13",
            "inLanguage": "fr-FR",
            "publisher": { "@id": `${BASE}/#organization` },
            "embedUrl": BASE,
        },

        // ── 6. HowTo — Process ────────────────────────────────────────────
        {
            "@type": "HowTo",
            "@id": `${BASE}/#process`,
            "name": "Comment créer un site web premium avec Alhambra Web Lyon",
            "description": "Processus de création de site web en 4 étapes par Alhambra Web Lyon. De la stratégie à la mise en ligne, avec garantie Lighthouse 95+.",
            "totalTime": "P6W",
            "estimatedCost": {
                "@type": "MonetaryAmount",
                "currency": "EUR",
                "minValue": 3000,
            },
            "step": [
                {
                    "@type": "HowToStep",
                    "position": 1,
                    "name": "Stratégie",
                    "text": "Analyse de votre marché, de vos concurrents et définition précise du cahier des charges. Compréhension de vos objectifs business et de vos cibles.",
                    "url": `${BASE}/#process`,
                },
                {
                    "@type": "HowToStep",
                    "position": 2,
                    "name": "Design",
                    "text": "Création de maquettes UI/UX haute-fidélité sur Figma, validées avant le développement. Direction artistique, prototypes interactifs, design system.",
                    "url": `${BASE}/#process`,
                },
                {
                    "@type": "HowToStep",
                    "position": 3,
                    "name": "Développement",
                    "text": "Code Next.js performant, testé et optimisé SEO. Stack React 19, TypeScript, Tailwind CSS v4, Framer Motion. Score Lighthouse 95+ garanti.",
                    "url": `${BASE}/#process`,
                },
                {
                    "@type": "HowToStep",
                    "position": 4,
                    "name": "Impact",
                    "text": "Mise en ligne, formation à la gestion du contenu et suivi post-lancement. Support continu disponible sur contrat mensuel.",
                    "url": `${BASE}/#process`,
                },
            ],
        },

        // ── 7. ServiceArea — Géographie locale ───────────────────────────
        {
            "@type": "Service",
            "@id": `${BASE}/#service-la-balme`,
            "name": "Création de site web à La Balme-les-Grottes",
            "description": "Alhambra Web crée des sites web professionnels pour les entreprises, artisans et commerces de La Balme-les-Grottes et de l'Ain. Sites vitrines, e-commerce, menus numériques — sur-mesure et à prix adapté, dès 200€.",
            "provider": { "@id": `${BASE}/#organization` },
            "serviceType": "Web Design and Development",
            "areaServed": {
                "@type": "City",
                "name": "La Balme-les-Grottes",
                "containedInPlace": {
                    "@type": "AdministrativeArea",
                    "name": "Ain",
                    "containedInPlace": { "@type": "Country", "name": "France" },
                },
            },
            "url": `${BASE}/#services`,
        },

        // ── 8. Portfolio — ItemList ────────────────────────────────────────
        {
            "@type": "ItemList",
            "name": "Portfolio Alhambra Web — Projets Réalisés",
            "description": "Sélection de sites web et applications digitales réalisés par Alhambra Web Lyon.",
            "numberOfItems": 7,
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Chez Ramo — Site Restaurant",
                    "url": "https://xeloriom-sketch.github.io/chezramo/",
                    "description": "Site web pour un restaurant. Design élégant, menu interactif, réservations en ligne.",
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Daftar — Application Web SaaS",
                    "url": "https://apidaftar.com",
                    "description": "Plateforme SaaS de gestion d'entreprise. Interface utilisateur moderne, tableau de bord temps réel.",
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "ON Coaching — Site Coach Sportif",
                    "url": "https://oncoaching.fr",
                    "description": "Site web pour un coach sportif. Présentation des programmes, blog, prise de rendez-vous en ligne.",
                },
                {
                    "@type": "ListItem",
                    "position": 4,
                    "name": "Mosquée Es-Salam — Site Institutionnel",
                    "url": "http://mosquee-essalem.fr",
                    "description": "Site web institutionnel avec horaires de prières, agenda des événements et actualités.",
                },
                {
                    "@type": "ListItem",
                    "position": 5,
                    "name": "Xpertive — Plateforme SaaS",
                    "url": "https://xpertive.com",
                    "description": "Application web SaaS. Interface complexe, performance optimisée, expérience utilisateur soignée.",
                },
                {
                    "@type": "ListItem",
                    "position": 6,
                    "name": "LuxFlora — Site E-commerce Luxe",
                    "url": "https://xeloriom.github.io/LuxFlora/",
                    "description": "Boutique en ligne premium pour fleuriste de luxe. Design haut de gamme, catalogue produits, commandes en ligne.",
                },
                {
                    "@type": "ListItem",
                    "position": 7,
                    "name": "ARLEA Promotion — Site Immobilier",
                    "url": "https://arleapromotion.com",
                    "description": "Site web pour un promoteur immobilier. Catalogue de programmes, visites virtuelles, contact.",
                },
            ],
        },
    ],
};

const FAQ_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "Quel est le délai moyen pour créer un site web ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "4 à 8 semaines pour un site web premium. Alhambra livre vite et bien — sans jamais sacrifier la qualité. Les projets complexes (e-commerce, applications) peuvent prendre jusqu'à 3 mois selon le périmètre défini.",
            },
        },
        {
            "@type": "Question",
            "name": "Quelles technologies utilisez-vous pour créer des sites web ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Alhambra utilise Next.js 15+, React 19, TypeScript, Tailwind CSS v4 et Framer Motion. Cette stack garantit des scores Lighthouse 95+, une expérience utilisateur fluide et des performances SEO optimales sur tous les appareils.",
            },
        },
        {
            "@type": "Question",
            "name": "Quel est votre tarif minimum pour un site web ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Chez Alhambra, les tarifs s'adaptent à votre projet et votre budget. Nous avons réalisé des systèmes d'affichage digital sur écran TV avec modification de prix en temps réel pour 200€, comme des applications SaaS complexes à 15 000€+. Aucun projet n'est trop petit ni trop grand — nous cherchons toujours la solution la plus adaptée à vos besoins réels. Devis gratuit et personnalisé sous 24h.",
            },
        },
        {
            "@type": "Question",
            "name": "Proposez-vous de la maintenance pour les sites web ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Oui. Alhambra assure la maintenance, le support et les mises à jour de votre site. Contrats mensuels disponibles incluant : mises à jour de sécurité, évolutions fonctionnelles et support technique prioritaire.",
            },
        },
        {
            "@type": "Question",
            "name": "Le code source nous appartient-il après livraison ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "À 100%. Alhambra livre le repository Git complet à la fin de chaque projet. Votre propriété intellectuelle, votre code. Aucun lock-in, aucune dépendance envers notre agence.",
            },
        },
        {
            "@type": "Question",
            "name": "Gérez-vous le SEO et les performances web ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Score Lighthouse 95+ garanti sur chaque projet livré. Nous intégrons l'optimisation SEO technique, les Core Web Vitals, les données structurées (JSON-LD), et les balises méta dès la conception. Performance et visibilité, toujours inclus.",
            },
        },
        {
            "@type": "Question",
            "name": "Faites-vous du e-commerce et des boutiques en ligne ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Oui. Shopify, WooCommerce ou panier custom sur Next.js. Alhambra crée des boutiques qui convertissent : tunnel de vente optimisé, paiement sécurisé, catalogue produits performant, intégrations CRM/ERP.",
            },
        },
        {
            "@type": "Question",
            "name": "Prenez-vous en charge la refonte de sites existants ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Oui. Audit technique complet de l'existant, redesign UX/UI, migration de contenu, amélioration des performances et du SEO. Refonte partielle ou totale selon vos besoins et votre budget.",
            },
        },
        {
            "@type": "Question",
            "name": "Intervenez-vous à Lyon et dans les villes voisines ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Oui. Basés à Lyon, nous nous déplaçons chez nos clients à Pont-de-Chéruy, Lagnieu, La Balme-les-Grottes et dans toute la Métropole de Lyon, l'Ain et l'Isère. Nous travaillons également avec des clients dans toute la France, en Belgique, Suisse et Canada.",
            },
        },
        {
            "@type": "Question",
            "name": "Comment se déroule un projet avec Alhambra ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "4 phases : 1) Stratégie — analyse de votre marché et définition du cahier des charges. 2) Design — maquettes UI/UX validées avant développement. 3) Développement — code Next.js performant et testé. 4) Impact — livraison, formation et suivi post-lancement.",
            },
        },
        {
            "@type": "Question",
            "name": "Alhambra Web apparaît-il dans les résultats des IA comme ChatGPT ou Perplexity ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Oui. Alhambra Web est optimisé pour le GEO (Generative Engine Optimization) : fichier llms.txt accessible aux LLMs, données structurées JSON-LD Schema.org complètes, crawlers IA autorisés dans robots.txt (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot…), balises SpeakableSpecification et contenu factuel et autoritatif. Notre site est indexable par tous les grands modèles de langage.",
            },
        },
        {
            "@type": "Question",
            "name": "Quelle est la différence entre un site web vitrine et une application web ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Un site vitrine présente votre activité, vos services et génère des contacts ou des ventes. Une application web offre des fonctionnalités interactives complexes (tableaux de bord, gestion de données, espaces membres, SaaS). Alhambra réalise les deux avec la même stack technique Next.js/React, garantissant performance et évolutivité.",
            },
        },
        {
            "@type": "Question",
            "name": "Proposez-vous un accompagnement après la livraison du site ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Oui. Alhambra propose des contrats de maintenance mensuelle incluant : mises à jour de sécurité et de dépendances, évolutions fonctionnelles, support technique prioritaire, optimisation continue des performances et du SEO. Formation à la gestion du contenu (CMS) incluse à la livraison.",
            },
        },
        {
            "@type": "Question",
            "name": "Quelle agence web intervient à La Balme-les-Grottes dans l'Ain ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Alhambra Web, agence basée à Lyon, intervient à La Balme-les-Grottes et dans tout le département de l'Ain (01). Déplacement possible sur site pour les entreprises, artisans, commerces et associations locaux. Tarifs adaptés aux budgets locaux, dès 200€. Devis gratuit sous 24h.",
            },
        },
        {
            "@type": "Question",
            "name": "Alhambra Web crée-t-il des sites web pour les artisans et PME de l'Ain ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Oui. Alhambra Web accompagne les artisans, commerçants, associations et PME de l'Ain (La Balme-les-Grottes, Lagnieu, Pont-de-Chéruy…) dans leur présence digitale. Sites vitrines, menus numériques, boutiques en ligne — chaque solution est sur-mesure et à prix juste. Aucun projet trop petit.",
            },
        },
    ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="fr" className={`scroll-smooth ${haas.variable} ${nordique.variable}`}>
        <head>
            {/* ── JSON-LD Graph Schema ──────────────────────────────────── */}
            <Script
                id="json-ld-graph"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(GRAPH_SCHEMA) }}
                strategy="beforeInteractive"
            />

            {/* ── FAQ Schema → Rich Snippets ────────────────────────────── */}
            <Script
                id="json-ld-faq"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
                strategy="beforeInteractive"
            />

            {/* ── Pré-connexions critiques ──────────────────────────────── */}
            <link rel="preconnect" href="https://d8j0ntlcm91z4.cloudfront.net" crossOrigin="anonymous" />
            <link rel="dns-prefetch" href="https://d8j0ntlcm91z4.cloudfront.net" />
            <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
            <link rel="dns-prefetch" href="https://res.cloudinary.com" />
            <link rel="dns-prefetch" href="https://images.unsplash.com" />
        </head>
        <body className="antialiased selection:bg-black selection:text-white">
        <LayoutClient>
            <ContactPanelProvider>
                <SmoothScroll>
                    {children}
                </SmoothScroll>
            </ContactPanelProvider>
        </LayoutClient>
        </body>
        </html>
    );
}
