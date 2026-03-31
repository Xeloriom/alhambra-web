"use client";

import { useState, useEffect } from "react";
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

export default function Home() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/config")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Error loading content", err));
  }, []);

  if (!data) return <PageLoader />;

  return (
    <main className="min-h-screen bg-[#F9F9F9] relative overflow-x-hidden font-sans">
      <ScrollProgress />
      <FloatingElements />
      <Navbar />
      
      <HeroSection data={data.hero} />
      <ClientLogos />
      <ServicesSection data={data.services} />
      <ProcessSection data={data.process} />
      <WorksSection /> 
      <WhyChooseUs />
      <BigStatement />
      <TestimonialsSection />
      <FAQSection data={data.faq} />
      <PricingSection />
      <CTABanner />
      <ContactSection />
      <Footer />
      <SEOPanel />
    </main>
  );
}
