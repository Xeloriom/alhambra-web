import { HeroSection } from '@/components/hero-section';
import { WorkSection } from '@/components/work-section';
import { AboutSection } from '@/components/about-section';
import { ProcessSection } from '@/components/process-section';
import { ServicesSection } from '@/components/services-section';
import { FaqSection } from '@/components/faq-section';
import { ContactSection } from '@/components/contact-section';
import { FooterSection } from '@/components/footer-section';

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