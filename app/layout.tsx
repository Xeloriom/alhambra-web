import type { Metadata, Viewport } from 'next'
import './globals.css'
import { CustomCursor } from "@/components/custom-cursor";
import { Analytics } from '@vercel/analytics/next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#080808',
};

export const metadata: Metadata = {
  title: 'ALHAMBRA — Agence Digitale de Haute Performance',
  description: 'L\'excellence Digitale sur Mesure. Web Design, Apps Mobiles & Logiciels.',
  metadataBase: new URL('https://alhambra-web.com'),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="dark scroll-smooth">
      <head>
        <link rel="canonical" href="https://alhambra-web.com" />
      </head>
      <body className="bg-[#080808] text-white selection:bg-[#C9A84C] selection:text-[#080808]">
        <CustomCursor />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
