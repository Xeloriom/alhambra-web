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
        default: "Alhambra | Studio Créatif & Digital",
        template: "%s | Alhambra"
    },
    description: "Alhambra est un studio digital spécialisé dans la création d'expériences numériques percutantes. Design radical, développement de pointe et impact garanti.",
    keywords: ["studio digital", "création web", "design", "développement web", "paris", "alhambra", "agence digitale"],
    metadataBase: new URL('https://alhambra-web.com'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'fr_FR',
        url: 'https://alhambra-web.com',
        siteName: 'Alhambra',
        title: 'Alhambra | Studio Créatif & Digital',
        description: 'Studio digital spécialisé dans la création d\'expériences numériques percutantes.',
        images: [
            {
                url: '/image 1.png',
                width: 1200,
                height: 630,
                alt: 'Alhambra Studio - Robot',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Alhambra | Studio Créatif & Digital',
        description: 'Studio digital spécialisé dans la création d\'expériences numériques percutantes.',
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
    }
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
            {/* Données structurées JSON-LD pour booster le référencement local et l'autorité */}
            <Script
                id="json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "Alhambra",
                        "url": "https://alhambra-web.com",
                        "logo": "https://alhambra-web.com/logo.svg",
                        "description": "Studio Créatif & Digital spécialisé dans le design et le développement d'expériences numériques.",
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": "Paris",
                            "addressCountry": "FR"
                        }
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