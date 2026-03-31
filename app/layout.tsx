import type { Metadata, Viewport } from 'next'
import { Inter_Tight, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { CustomCursor } from "@/components/custom-cursor";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const _geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: 'ALHAMBRA — Agence Digitale de Haute Performance',
    template: '%s | ALHAMBRA'
  },
  description: 'Agence experte en design web, apps mobiles et logiciels sur mesure. Nous boostons votre croissance avec des solutions digitales d\'exception.',
  keywords: ['agence digitale', 'création site web', 'développement mobile', 'UI/UX design', 'SaaS', 'performance web'],
  authors: [{ name: 'ALHAMBRA Studio' }],
  creator: 'ALHAMBRA Studio',
  publisher: 'ALHAMBRA Studio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://alhambra-web.com'),
  alternates: {
    canonical: '/',
    languages: {
      'fr-FR': '/fr',
    },
  },
  openGraph: {
    title: 'ALHAMBRA — Agence Digitale de Haute Performance',
    description: 'Design web, apps mobiles et logiciels sur mesure conçus pour la performance.',
    url: 'https://alhambra-web.com',
    siteName: 'ALHAMBRA Studio',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ALHAMBRA Studio - Agence Digitale',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ALHAMBRA — Agence Digitale',
    description: 'Design web et développement de haute performance.',
    creator: '@alhambrastudio',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${interTight.variable} ${_geistMono.variable}`}>
      <head>
        <link rel="canonical" href="https://alhambra-web.com" />
      </head>
      <body className="font-sans antialiased overflow-x-hidden">
        <CustomCursor />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
