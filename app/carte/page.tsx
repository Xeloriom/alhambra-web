import type { Metadata } from 'next'
import CarteClient from './carte-client'

export const metadata: Metadata = {
  title: 'Carte de Contact — Alhambra Web Lyon',
  description: 'Ajoutez Alhambra Web à vos contacts. Agence web premium à Lyon — création de sites sur-mesure, design UI/UX & Next.js.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Alhambra Web — Agence Web Lyon',
    description: 'Enregistrez notre contact. Agence web premium à Lyon, dès 200€.',
    images: [{ url: 'https://www.alhambra-web.com/image%201.png', width: 1200, height: 630 }],
  },
}

export default function CartePage() {
  return <CarteClient />
}
