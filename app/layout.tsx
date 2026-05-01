import type { Metadata, Viewport } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { SmoothScroll } from "@/components/smooth-scroll";
import LayoutClient from "@/components/layout-client";
import { ContactPanelProvider } from "@/components/contact-panel-context";
import Script from "next/script";

// On utilise localFont pour une optimisation automatique des polices (Next.js 14/15/16+)
// Cela réduit le Cumulative Layout Shift (CLS) et accélère le chargement.
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

// Metadata API : C'est la bibliothèque SEO intégrée de Next.js (remplace next-seo)
// Elle est ultra-performante car elle est gérée côté serveur de manière native.
export const metadata: Metadata = {
    title: {
        default: "Alhambra | Agence Web Premium Paris — Création de Sites & Design Digital",
        template: "%s | Alhambra Studio"
    },
    description: "Alhambra, agence web premium à Paris. Création de sites web sur-mesure, design UI/UX, développement Next.js & React. Scores Lighthouse 95+. À partir de 3 000€. Devis gratuit.",
    keywords: [
        "agence web paris", "création site web", "agence digitale paris", "studio web premium",
        "développement web paris", "design site web", "agence next.js", "agence react paris",
        "creation site web paris", "agence web sur-mesure", "design ui ux paris",
        "refonte site web", "site web vitrine", "agence web luxe", "développeur web freelance paris",
        "alhambra", "alhambra studio", "agence digitale", "studio créatif paris"
    ],
    metadataBase: new URL('https://alhambra-web.com'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'fr_FR',
        url: 'https://alhambra-web.com',
        siteName: 'Alhambra Studio',
        title: 'Alhambra | Agence Web Premium Paris — Sites Web & Design Digital',
        description: 'Studio digital parisien spécialisé dans la création de sites web premium. Design radical, développement de pointe, scores Lighthouse 95+. Devis gratuit.',
        images: [
            {
                url: '/image 1.png',
                width: 1200,
                height: 630,
                alt: 'Alhambra Studio Paris — Agence Web & Design Digital',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Alhambra | Agence Web Premium Paris',
        description: 'Création de sites web sur-mesure, design UI/UX, développement Next.js. Studio digital parisien. Scores Lighthouse 95+.',
        images: ['/image 1.png'],
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
        icon: '/icon.svg',
        apple: '/apple-icon.png',
    },
    category: 'technology',
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#ffffff',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="fr" className={`scroll-smooth ${haas.variable} ${nordique.variable}`}>
        <head>
            {/* ── JSON-LD @graph : Organisation + WebSite + ProfessionalService ── */}
            <Script
                id="json-ld-graph"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@graph": [
                            {
                                "@type": "Organization",
                                "@id": "https://alhambra-web.com/#organization",
                                "name": "Alhambra",
                                "alternateName": "Alhambra Studio",
                                "url": "https://alhambra-web.com",
                                "logo": {
                                    "@type": "ImageObject",
                                    "url": "https://alhambra-web.com/logo.svg",
                                    "width": 200,
                                    "height": 60
                                },
                                "description": "Studio Créatif & Digital parisien spécialisé dans la création de sites web premium, le design d'interfaces et le développement d'expériences numériques percutantes.",
                                "foundingDate": "2017",
                                "address": {
                                    "@type": "PostalAddress",
                                    "addressLocality": "Paris",
                                    "addressRegion": "Île-de-France",
                                    "addressCountry": "FR"
                                },
                                "areaServed": ["FR", "BE", "CH", "CA"],
                                "knowsAbout": ["Web Design", "Développement Web", "UI/UX Design", "SEO", "Next.js", "React", "Branding", "E-commerce"],
                                "slogan": "On ne fait pas du web — on bâtit des empires."
                            },
                            {
                                "@type": "WebSite",
                                "@id": "https://alhambra-web.com/#website",
                                "url": "https://alhambra-web.com",
                                "name": "Alhambra | Studio Créatif & Digital",
                                "description": "Agence web premium basée à Paris. Design radical, développement de pointe, impact garanti.",
                                "publisher": { "@id": "https://alhambra-web.com/#organization" },
                                "inLanguage": "fr-FR",
                                "potentialAction": {
                                    "@type": "SearchAction",
                                    "target": { "@type": "EntryPoint", "urlTemplate": "https://alhambra-web.com/?q={search_term_string}" },
                                    "query-input": "required name=search_term_string"
                                }
                            },
                            {
                                "@type": "WebPage",
                                "@id": "https://alhambra-web.com/#webpage",
                                "url": "https://alhambra-web.com",
                                "name": "Alhambra | Studio Créatif & Digital — Agence Web Paris",
                                "description": "Alhambra est un studio digital spécialisé dans la création d'expériences numériques percutantes. Design radical, développement de pointe et impact garanti.",
                                "isPartOf": { "@id": "https://alhambra-web.com/#website" },
                                "about": { "@id": "https://alhambra-web.com/#organization" },
                                "inLanguage": "fr-FR",
                                "dateModified": new Date().toISOString().split("T")[0]
                            },
                            {
                                "@type": "ProfessionalService",
                                "@id": "https://alhambra-web.com/#business",
                                "name": "Alhambra Studio",
                                "url": "https://alhambra-web.com",
                                "image": "https://alhambra-web.com/image 1.png",
                                "priceRange": "€€€",
                                "address": {
                                    "@type": "PostalAddress",
                                    "addressLocality": "Paris",
                                    "addressRegion": "Île-de-France",
                                    "addressCountry": "FR"
                                },
                                "areaServed": "France",
                                "currenciesAccepted": "EUR",
                                "openingHours": "Mo-Fr 09:00-18:00",
                                "hasOfferCatalog": {
                                    "@type": "OfferCatalog",
                                    "name": "Services Digitaux Alhambra",
                                    "itemListElement": [
                                        {
                                            "@type": "Offer",
                                            "itemOffered": {
                                                "@type": "Service",
                                                "name": "Création de site web premium",
                                                "description": "Sites web sur-mesure, performants et optimisés SEO. Stack Next.js, React, TypeScript."
                                            }
                                        },
                                        {
                                            "@type": "Offer",
                                            "itemOffered": {
                                                "@type": "Service",
                                                "name": "Design & Identité Visuelle",
                                                "description": "Branding, UI/UX design, direction artistique pour marques ambitieuses."
                                            }
                                        },
                                        {
                                            "@type": "Offer",
                                            "itemOffered": {
                                                "@type": "Service",
                                                "name": "Développement Web & Applications",
                                                "description": "Développement full-stack, API, intégrations. Code propre, architecture scalable."
                                            }
                                        },
                                        {
                                            "@type": "Offer",
                                            "itemOffered": {
                                                "@type": "Service",
                                                "name": "SEO & Growth Digital",
                                                "description": "Audit SEO, optimisation Lighthouse 95+, stratégie de croissance organique."
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    })
                }}
            />
            {/* ── FAQ Schema → Rich Snippets Google ── */}
            <Script
                id="json-ld-faq"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": "Quel est le délai moyen pour un projet web ?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "4 à 8 semaines pour un impact chirurgical. Alhambra livre vite, livre bien — sans jamais sacrifier la qualité. Les projets complexes peuvent aller jusqu'à 3 mois selon le périmètre."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Quelles technologies utilisez-vous pour créer des sites web ?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Alhambra utilise Next.js, React, Framer Motion, TypeScript et Tailwind CSS. La stack la plus performante du marché, garantissant des scores Lighthouse 95+ et une expérience utilisateur optimale."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Quel est votre budget minimum pour un projet ?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "À partir de 3 000€ pour un site vitrine premium. Chaque projet est sur-mesure — nous alignons budget et ambition pour maximiser le retour sur investissement."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Proposez-vous de la maintenance pour les sites web ?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Oui. Alhambra assure la maintenance et le support de votre site 24/7. Support technique, mises à jour de sécurité, évolutions fonctionnelles — nous sommes présents sur le long terme."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Le code source m'appartient-il après la livraison du projet ?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "À 100%. Alhambra livre le repository complet à la fin de chaque projet. Votre propriété intellectuelle, pas la nôtre. Aucun lock-in, aucune contrainte."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Gérez-vous le SEO et les performances des sites web ?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Score Lighthouse 95+ garanti sur chaque projet. Alhambra code pour Google autant que pour vos utilisateurs — performance technique, accessibilité et visibilité organique, toujours inclus."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Faites-vous du e-commerce et des boutiques en ligne ?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Oui. Shopify, panier personnalisé, tunnel de conversion optimisé. Alhambra construit des boutiques qui convertissent réellement — design, UX et performance au service des ventes."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Prenez-vous en charge les refontes de sites existants ?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Oui. Alhambra prend en charge l'existant et le transforme. Audit technique complet, redesign, amélioration des performances et du SEO — refonte totale ou partielle selon les besoins."
                                }
                            }
                        ]
                    })
                }}
            />
            {/* Pré-connexion aux domaines critiques */}
            <link rel="preconnect" href="https://d8j0ntlcm91z4.cloudfront.net" crossOrigin="anonymous" />
            <link rel="dns-prefetch" href="https://d8j0ntlcm91z4.cloudfront.net" />
            <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
            <link rel="dns-prefetch" href="https://res.cloudinary.com" />
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