import type { Metadata } from 'next';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/hero-section';

// ── Page-level metadata (overrides layout defaults for homepage) ────────────
export const metadata: Metadata = {
    title: "Agence Web Lyon | Création Site Web & Design UI/UX | Alhambra",
    description: "Agence web à Lyon — création de sites sur-mesure, design UI/UX & développement Next.js. Score Lighthouse 95+ garanti. Devis gratuit en 24h. Dès 200€.",
    alternates: {
        canonical: 'https://www.alhambra-web.com',
    },
};

const BASE = 'https://www.alhambra-web.com';

// ── Page-level JSON-LD: individual Service entities ────────────────────────
const SERVICES_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Services Alhambra Web Lyon",
    "description": "Services proposés par Alhambra Web, agence web premium à Lyon.",
    "numberOfItems": 5,
    "itemListElement": [
        {
            "@type": "ListItem",
            "position": 1,
            "item": {
                "@type": "Service",
                "@id": `${BASE}/#service-creation-site`,
                "name": "Création de site web à Lyon",
                "alternateName": "Création site web sur-mesure",
                "description": "Conception et développement de sites web sur-mesure à Lyon. Stack Next.js, React, TypeScript. Score Lighthouse 95+ garanti. Sites vitrines, landing pages, menus digitaux. Dès 800€.",
                "serviceType": "Web Design and Development",
                "provider": { "@id": `${BASE}/#organization` },
                "areaServed": [
                    { "@type": "City", "name": "Lyon" },
                    { "@type": "AdministrativeArea", "name": "Métropole de Lyon" },
                    { "@type": "AdministrativeArea", "name": "Auvergne-Rhône-Alpes" },
                ],
                "offers": {
                    "@type": "Offer",
                    "priceCurrency": "EUR",
                    "priceSpecification": {
                        "@type": "PriceSpecification",
                        "minPrice": "800",
                        "priceCurrency": "EUR",
                    },
                },
                "url": `${BASE}/#services`,
            },
        },
        {
            "@type": "ListItem",
            "position": 2,
            "item": {
                "@type": "Service",
                "@id": `${BASE}/#service-design-uiux`,
                "name": "Design UI/UX & Identité Visuelle Lyon",
                "alternateName": "Agence UI/UX Lyon",
                "description": "Direction artistique, maquettes Figma haute-fidélité, branding et design system pour marques ambitieuses. Identité visuelle premium pour entreprises lyonnaises.",
                "serviceType": "UI/UX Design",
                "provider": { "@id": `${BASE}/#organization` },
                "areaServed": [
                    { "@type": "City", "name": "Lyon" },
                    { "@type": "Country", "name": "France" },
                ],
                "url": `${BASE}/#services`,
            },
        },
        {
            "@type": "ListItem",
            "position": 3,
            "item": {
                "@type": "Service",
                "@id": `${BASE}/#service-nextjs`,
                "name": "Développement Next.js & React Lyon",
                "alternateName": "Agence Next.js Lyon",
                "description": "Développement d'applications web full-stack avec Next.js et React. APIs REST/GraphQL, SaaS, e-commerce, tableaux de bord. Code TypeScript clean, architecture scalable.",
                "serviceType": "Web Application Development",
                "provider": { "@id": `${BASE}/#organization` },
                "areaServed": [
                    { "@type": "City", "name": "Lyon" },
                    { "@type": "Country", "name": "France" },
                ],
                "url": `${BASE}/#services`,
            },
        },
        {
            "@type": "ListItem",
            "position": 4,
            "item": {
                "@type": "Service",
                "@id": `${BASE}/#service-seo`,
                "name": "SEO Technique & Optimisation Lighthouse Lyon",
                "alternateName": "Référencement naturel Lyon",
                "description": "Audit SEO technique complet, optimisation Core Web Vitals, données structurées JSON-LD Schema.org, score Lighthouse 95+ garanti. GEO (Generative Engine Optimization) inclus.",
                "serviceType": "Search Engine Optimization",
                "provider": { "@id": `${BASE}/#organization` },
                "areaServed": [
                    { "@type": "City", "name": "Lyon" },
                    { "@type": "Country", "name": "France" },
                ],
                "url": `${BASE}/#services`,
            },
        },
        {
            "@type": "ListItem",
            "position": 5,
            "item": {
                "@type": "Service",
                "@id": `${BASE}/#service-ecommerce`,
                "name": "Création boutique e-commerce Lyon",
                "alternateName": "Agence e-commerce Lyon",
                "description": "Création de boutiques en ligne Shopify, WooCommerce ou e-commerce custom Next.js. Tunnel de vente optimisé, paiement Stripe/PayPal, intégrations CRM. Dès 3 000€.",
                "serviceType": "E-commerce Development",
                "provider": { "@id": `${BASE}/#organization` },
                "areaServed": [
                    { "@type": "City", "name": "Lyon" },
                    { "@type": "Country", "name": "France" },
                ],
                "offers": {
                    "@type": "Offer",
                    "priceCurrency": "EUR",
                    "priceSpecification": {
                        "@type": "PriceSpecification",
                        "minPrice": "3000",
                        "priceCurrency": "EUR",
                    },
                },
                "url": `${BASE}/#services`,
            },
        },
    ],
};

// ── VideoObject — hero background video ───────────────────────────────────
const VIDEO_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "Alhambra Web — Agence Web Premium Lyon",
    "description": "Découvrez Alhambra Web, studio créatif & digital basé à Lyon. Création de sites web sur-mesure, design UI/UX premium, développement Next.js. Score Lighthouse 95+ garanti. Devis gratuit en 24h.",
    "thumbnailUrl": `${BASE}/og-image.jpg`,
    "uploadDate": "2026-04-28T00:00:00+02:00",
    "duration": "PT0M30S",
    "contentUrl": "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260428_193507_4286c423-2fd9-4efd-92bd-91a939453fc1.mp4",
    "embedUrl": `${BASE}/#hero-video`,
    "publisher": {
        "@type": "Organization",
        "name": "Alhambra Web",
        "logo": {
            "@type": "ImageObject",
            "url": `${BASE}/logo.png`,
        },
    },
    "regionsAllowed": "FR",
    "inLanguage": "fr",
};

// ── Standalone BreadcrumbList ──────────────────────────────────────────────
const BREADCRUMB_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        {
            "@type": "ListItem",
            "position": 1,
            "name": "Accueil",
            "item": BASE,
        },
        {
            "@type": "ListItem",
            "position": 2,
            "name": "Services",
            "item": `${BASE}/#services`,
        },
        {
            "@type": "ListItem",
            "position": 3,
            "name": "Portfolio",
            "item": `${BASE}/project/`,
        },
        {
            "@type": "ListItem",
            "position": 4,
            "name": "Contact",
            "item": `${BASE}/#contact`,
        },
    ],
};

const SectionSkeleton = () => (
    <div className="w-full py-32 animate-pulse bg-transparent" aria-hidden="true" />
);

const WorkSection     = dynamic(() => import('@/components/work-section').then(m => ({ default: m.WorkSection })),     { loading: () => <SectionSkeleton /> });
const AboutSection    = dynamic(() => import('@/components/about-section').then(m => ({ default: m.AboutSection })),   { loading: () => <SectionSkeleton /> });
const ProcessSection  = dynamic(() => import('@/components/process-section').then(m => ({ default: m.ProcessSection })), { loading: () => <SectionSkeleton /> });
const ServicesSection = dynamic(() => import('@/components/services-section').then(m => ({ default: m.ServicesSection })), { loading: () => <SectionSkeleton /> });
const ContactSection  = dynamic(() => import('@/components/contact-section').then(m => ({ default: m.ContactSection })), { loading: () => <SectionSkeleton /> });
const FaqSection      = dynamic(() => import('@/components/faq-section').then(m => ({ default: m.FaqSection })),       { loading: () => <SectionSkeleton /> });
const FooterSection   = dynamic(() => import('@/components/footer-section').then(m => ({ default: m.FooterSection })), { loading: () => <SectionSkeleton /> });

export default function Home() {
    return (
        <main className="min-h-screen">
            {/* ── Page-level structured data ─────────────────────────────── */}
            <Script
                id="json-ld-services"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICES_SCHEMA) }}
                strategy="beforeInteractive"
            />
            <Script
                id="json-ld-breadcrumb"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }}
                strategy="beforeInteractive"
            />
            <Script
                id="json-ld-video"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(VIDEO_SCHEMA) }}
                strategy="beforeInteractive"
            />

            <HeroSection />
            <WorkSection />
            <AboutSection />
            <ProcessSection />
            <ServicesSection />
            <ContactSection />
            <FaqSection />
            <FooterSection />
        </main>
    );
}
