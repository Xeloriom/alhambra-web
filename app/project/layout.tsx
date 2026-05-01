import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Nos Projets — Portfolio Web & Design',
    description: 'Découvrez les projets créés par Alhambra Studio : sites web premium, applications digitales et identités visuelles. Daftar, ON Coaching, Xpertive et plus.',
    keywords: [
        'portfolio agence web paris', 'réalisations web', 'projets web premium',
        'exemples sites web', 'portfolio design digital', 'references agence web'
    ],
    alternates: {
        canonical: '/project',
    },
    openGraph: {
        title: 'Nos Projets — Alhambra Studio Portfolio',
        description: 'Portfolio de nos réalisations : sites web sur-mesure, design UI/UX et expériences digitales percutantes.',
        url: 'https://alhambra-web.com/project',
        type: 'website',
    },
};

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
    return children;
}
