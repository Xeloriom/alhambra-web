import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/hero-section';

// Sections sous le fold — chargées en code splitting, SSR maintenu pour le SEO
const WorkSection     = dynamic(() => import('@/components/work-section').then(m => ({ default: m.WorkSection })));
const AboutSection    = dynamic(() => import('@/components/about-section').then(m => ({ default: m.AboutSection })));
const ProcessSection  = dynamic(() => import('@/components/process-section').then(m => ({ default: m.ProcessSection })));
const ServicesSection = dynamic(() => import('@/components/services-section').then(m => ({ default: m.ServicesSection })));
const ContactSection  = dynamic(() => import('@/components/contact-section').then(m => ({ default: m.ContactSection })));
const FaqSection      = dynamic(() => import('@/components/faq-section').then(m => ({ default: m.FaqSection })));
const FooterSection   = dynamic(() => import('@/components/footer-section').then(m => ({ default: m.FooterSection })));

export default function Home() {
    return (
        <main className="min-h-screen">
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
