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

// Direct import for static export compatibility
import siteData from "@/locales/fr.json";

// GitHub Deployment Status Badge Component - RE-IMPLEMENTED AND ENHANCED
function DeploymentStatus() {
  const repo = "Xeloriom/alhambra-web";
  const [status, setStatus] = useState<string>("loading");

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}/actions/runs?per_page=1`);
        const data = await res.json();
        const lastRun = data.workflow_runs?.[0];
        
        if (lastRun) {
          if (lastRun.status === "completed") {
            setStatus(lastRun.conclusion); // "success" or "failure"
          } else {
            setStatus("in_progress");
          }
        }
      } catch (e) {
        setStatus("error");
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  const statusColor = status === "success" ? "bg-green-500" : status === "in_progress" ? "bg-yellow-500 animate-pulse" : "bg-red-500";
  const statusText = status === "success" ? "SITE À JOUR" : status === "in_progress" ? "MISE À JOUR EN COURS..." : "ERREUR SYNC";

  return (
    <a 
      href={`https://github.com/${repo}/actions`} 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-12 left-12 z-[9999] bg-white border border-black/10 px-6 py-4 rounded-2xl flex items-center gap-4 hover:shadow-2xl transition-all group shadow-md"
    >
      <div className={`w-3 h-3 rounded-full ${statusColor}`} />
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black leading-none">{statusText}</span>
        <span className="text-[8px] font-bold text-black/30 uppercase tracking-widest mt-1.5">Statut de Déploiement</span>
      </div>
    </a>
  );
}

export default function Home() {
  const data = siteData;

  return (
    <main className="min-h-screen bg-white relative overflow-x-hidden font-sans selection:bg-black selection:text-white">
      <ScrollProgress />
      <FloatingElements />
      <Navbar />
      
      {/* GitHub Deployment Status Indicator - FIXED POSITION */}
      <DeploymentStatus />
      
      <div className="flex flex-col gap-40 md:gap-64 pb-40 md:pb-64">
        <HeroSection data={data.hero} />
        
        <div className="space-y-40 md:space-y-64">
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
        </div>
      </div>

      <Footer />
      <SEOPanel />
    </main>
  );
}
