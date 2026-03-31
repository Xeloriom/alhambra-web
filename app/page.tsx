"use client";

import { ScrollProgress } from "@/components/scroll-progress";
import { PageLoader } from "@/components/page-loader";
import { FloatingElements } from "@/components/floating-elements";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { ClientLogos } from "@/components/client-logos";
import { ServicesSection } from "@/components/services-section";
import { ProcessSection } from "@/components/process-section";
import { WorksSection } from "@/components/works-section";
import { WhyChooseUs } from "@/components/why-choose-us";
import { BigStatement } from "@/components/big-statement";
import { TestimonialsSection } from "@/components/testimonials-section";
import { FAQSection } from "@/components/faq-section";
import { PricingSection } from "@/components/pricing-section";
import { CTABanner } from "@/components/cta-banner";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { SEOPanel } from "@/components/seo-panel";

// Direct import for static export compatibility
import siteData from "@/locales/fr.json";

export default function Home() {
  // On GitHub Pages, data is bundled at build time.
  // Locally, changes to fr.json will be reflected after a fast-refresh.
  const data = siteData;

  return (
    <main className="min-h-screen bg-[#000000] relative overflow-x-hidden font-sans selection:bg-white selection:text-black">
      <ScrollProgress />
      <FloatingElements />
      <Navbar />
      
      <HeroSection data={data.hero} />
      <ClientLogos />
      <ServicesSection data={data.services} />
      <ProcessSection data={data.process} />
      <WorksSection /> 
      <WhyChooseUs data={data.why} />
      <BigStatement data={data.statement} />
      <TestimonialsSection data={data.testimonials} />
      <FAQSection data={data.faq} />
      <PricingSection />
      <CTABanner data={data.cta_banner} />
      <ContactSection />
      <Footer />
      <SEOPanel />
    </main>
  );
}
