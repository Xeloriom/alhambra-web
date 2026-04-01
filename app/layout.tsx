import type { Metadata, Viewport } from 'next'
import './globals.css'
import { CustomCursor } from "@/components/custom-cursor";
import { Analytics } from '@vercel/analytics/next'
import { SmoothScroll } from "@/components/smooth-scroll";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
};

export const metadata: Metadata = {
  title: 'ALHAMBRAWeb — Agence Digitale de Haute Performance',
  description: 'L\'excellence Digitale sur Mesure. Web Design, Apps Mobiles & Logiciels.',
  metadataBase: new URL('https://alhambra-web.com'),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="lenis lenis-smooth">
      <head>
        <link rel="canonical" href="https://alhambra-web.com" />
      </head>
      <body>
        <SmoothScroll>
          <CustomCursor />
          {children}
          <Analytics />
        </SmoothScroll>
      </body>
    </html>
  )
}
