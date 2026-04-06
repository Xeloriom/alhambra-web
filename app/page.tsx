'use client';

import dynamic from 'next/dynamic';

const HeroSection     = dynamic(() => import('@/components/hero-section').then(m => m.HeroSection), { ssr: false });
const WorkSection     = dynamic(() => import('@/components/work-section').then(m => m.WorkSection), { ssr: false });
const ServicesSection = dynamic(() => import('@/components/services-section').then(m => m.ServicesSection), { ssr: false });
const ContactSection  = dynamic(() => import('@/components/contact-section').then(m => m.ContactSection), { ssr: false });
const FooterSection   = dynamic(() => import('@/components/footer-section').then(m => m.FooterSection), { ssr: false });

export default function Home() {
    return (
        <main className="min-h-screen bg-white">
            <HeroSection />
            <WorkSection />
            <ServicesSection />
            <ContactSection />
            <FooterSection />
        </main>
    );
}