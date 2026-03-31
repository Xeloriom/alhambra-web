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

// GitHub Deployment Status Badge Component
function DeploymentStatus() {
  const repo = "Xeloriom/alhambra-web";
  const workflowName = "Deploy to GitHub Pages";
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
    const interval = setInterval(checkStatus, 15000); // Check every 15s
    return () => clearInterval(interval);
  }, []);

  const statusColor = status === "success" ? "bg-green-500" : status === "in_progress" ? "bg-yellow-500 animate-pulse" : "bg-red-500";
  const statusText = status === "success" ? "Live v5.0" : status === "in_progress" ? "Syncing..." : "Offline";

  return (
    <a 
      href={`https://github.com/${repo}/actions`} 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-10 left-10 z-[100] bg-black/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full flex items-center gap-3 hover:bg-white hover:text-black transition-all group shadow-2xl"
    >
      <div className={`w-2 h-2 rounded-full ${statusColor}`} />
      <span className="text-[9px] font-black uppercase tracking-[0.2em]">{statusText}</span>
      <span className="text-[9px] font-black text-white/30 group-hover:text-black/30">Actions →</span>
    </a>
  );
}

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
    <main className="min-h-screen bg-[#000000] relative overflow-x-hidden font-sans selection:bg-white selection:text-black">
      <ScrollProgress />
      <FloatingElements />
      <Navbar />
      
      {/* GitHub Deployment Status Indicator */}
      <DeploymentStatus />
      
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
