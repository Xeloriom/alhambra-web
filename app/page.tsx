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

// GitHub Deployment Status Badge Component - IMPROVED ACCURACY
function DeploymentStatus() {
  const repo = "Xeloriom/alhambra-web";
  const [status, setStatus] = useState<string>("loading");

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Fetch last 3 runs to catch transitions better
        const res = await fetch(`https://api.github.com/repos/${repo}/actions/runs?per_page=3`, {
          cache: 'no-store'
        });
        const data = await res.json();
        const runs = data.workflow_runs || [];
        
        // Find if any run is currently active
        const activeRun = runs.find((r: any) => r.status === "in_progress" || r.status === "queued" || r.status === "requested" || r.status === "waiting");
        
        if (activeRun) {
          setStatus("in_progress");
        } else if (runs.length > 0) {
          setStatus(runs[0].conclusion); // "success", "failure", etc.
        }
      } catch (e) {
        setStatus("error");
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000); // Check every 5s for more responsiveness
    return () => clearInterval(interval);
  }, []);

  const isBuilding = status === "in_progress" || status === "queued";
  const isSuccess = status === "success";
  const isError = status === "failure" || status === "error";

  return (
    <a 
      href={`https://github.com/${repo}/actions`} 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-12 left-12 z-[9999] bg-white border border-black/10 px-6 py-4 rounded-2xl flex items-center gap-5 hover:shadow-2xl transition-all group shadow-md"
    >
      <div className="relative">
        <div className={`w-3.5 h-3.5 rounded-full ${
          isBuilding ? "bg-amber-400" : isSuccess ? "bg-emerald-500" : isError ? "bg-rose-500" : "bg-zinc-200"
        }`} />
        {isBuilding && (
          <div className="absolute inset-0 w-3.5 h-3.5 rounded-full bg-amber-400 animate-ping opacity-75" />
        )}
      </div>
      
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black leading-none">
            {isBuilding ? "Mise à jour en cours" : isSuccess ? "Site à jour" : isError ? "Erreur de build" : "Vérification..."}
          </span>
          {isBuilding ? (
            <svg className="animate-spin h-3 w-3 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : isSuccess ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : null}
        </div>
        <span className="text-[8px] font-bold text-black/30 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
          GitHub Production
        </span>
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
