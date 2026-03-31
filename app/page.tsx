"use client";

import { useEffect, useState } from "react";
import { PageLoader } from "@/components/page-loader";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { Marquee } from "@/components/marquee";
import { ServicesSection } from "@/components/services-section";
import { WorksSection } from "@/components/works-section";
import { BigStatement } from "@/components/big-statement";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import Lenis from "lenis";

// Direct import for static export compatibility
import siteData from "@/locales/fr.json";

// GitHub Deployment Status Badge Component - UPDATED FOR DARK THEME
function DeploymentStatus() {
  const repo = "Xeloriom/alhambra-web";
  const [status, setStatus] = useState<string>("loading");

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}/actions/runs?per_page=3`, {
          cache: 'no-store'
        });
        const data = await res.json();
        const runs = data.workflow_runs || [];
        const activeRun = runs.find((r: any) => r.status === "in_progress" || r.status === "queued");
        
        if (activeRun) {
          setStatus("in_progress");
        } else if (runs.length > 0) {
          setStatus(runs[0].conclusion);
        }
      } catch (e) {
        setStatus("error");
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const isBuilding = status === "in_progress";
  const isSuccess = status === "success";

  return (
    <a 
      href={`https://github.com/${repo}/actions`} 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-12 left-12 z-[9999] bg-[#0f0f0f] border border-white/10 px-6 py-4 rounded-full flex items-center gap-5 hover:border-[#C9A84C] transition-all group shadow-2xl backdrop-blur-xl"
    >
      <div className="relative">
        <div className={`w-2.5 h-2.5 rounded-full ${
          isBuilding ? "bg-[#C9A84C] animate-pulse" : isSuccess ? "bg-emerald-500" : "bg-rose-500"
        }`} />
        {isBuilding && (
          <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-[#C9A84C] animate-ping opacity-75" />
        )}
      </div>
      
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-white leading-none">
            {isBuilding ? "BUILDING..." : isSuccess ? "STABLE" : "ERROR"}
          </span>
          {isBuilding && (
            <svg className="animate-spin h-3 w-3 text-[#C9A84C]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
        </div>
      </div>
    </a>
  );
}

export default function Home() {
  const data = siteData;

  useEffect(() => {
    // Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="relative bg-[#080808]">
      <PageLoader />
      <Navbar />
      
      {/* GitHub Status */}
      <DeploymentStatus />
      
      <div className="flex flex-col">
        <HeroSection data={data.hero} />
        <Marquee />
        <ServicesSection data={data.services} />
        <WorksSection />
        <BigStatement data={data.statement} />
        <ContactSection />
        <Footer />
      </div>
    </main>
  );
}
