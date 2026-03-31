"use client";

import { useEffect, useState } from "react";
import { PageLoader } from "@/components/page-loader";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { ServicesSection } from "@/components/services-section";
import { WorksSection } from "@/components/works-section";
import { BigStatement } from "@/components/big-statement";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { motion, useScroll, useSpring } from "framer-motion";

// Direct import for static export compatibility
import siteData from "@/locales/fr.json";

// GitHub Deployment Status Badge Component - APPLE STYLE
function DeploymentStatus() {
  const repo = "Xeloriom/alhambra-web";
  const [status, setStatus] = useState<string>("loading");

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}/actions/runs?per_page=1`, {
          cache: 'no-store'
        });
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
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const isBuilding = status === "in_progress";
  const isSuccess = status === "success";

  return (
    <a 
      href={`https://github.com/${repo}/actions`} 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-12 left-12 z-[9999] bg-white border border-[#d2d2d7] px-6 py-3 rounded-full flex items-center gap-4 hover:shadow-xl transition-all group shadow-md"
    >
      <div className={`w-2.5 h-2.5 rounded-full ${
        isBuilding ? "bg-amber-400 animate-pulse" : isSuccess ? "bg-emerald-500" : "bg-rose-500"
      }`} />
      <span className="text-[12px] font-bold text-[#1d1d1f] uppercase tracking-widest">
        {isBuilding ? "Mise à jour..." : isSuccess ? "Stable" : "Sync"}
      </span>
    </a>
  );
}

export default function Home() {
  const data = siteData;
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <main className="relative bg-white min-h-screen">
      <PageLoader />
      
      {/* Scroll Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-[3px] bg-[#1d1d1f] origin-left z-[99999]" style={{ scaleX }} />
      
      <Navbar />
      
      <DeploymentStatus />
      
      <div className="flex flex-col">
        <HeroSection data={data.hero} />
        
        {/* Stats Bande */}
        <section className="bg-[#f5f5f7] py-24 border-b border-[#d2d2d7]">
           <div className="max-w-[1120px] mx-auto grid grid-cols-2 md:grid-cols-4 px-6">
              {[
                { value: "120+", label: "Projets" },
                { value: "95%", label: "Performance" },
                { value: "08", label: "Ans d'Expertise" },
                { value: "3×", label: "Croissance" },
              ].map((stat, i) => (
                <div key={i} className={`flex flex-col items-center md:items-start gap-2 ${i < 3 ? "md:border-r md:border-[#d2d2d7]" : ""} md:px-12`}>
                   <span className="text-4xl md:text-5xl font-extrabold text-[#1d1d1f] tracking-tighter">{stat.value}</span>
                   <span className="text-[12px] font-bold uppercase tracking-widest text-[#6e6e73]">{stat.label}</span>
                </div>
              ))}
           </div>
        </section>

        <ServicesSection data={data.services} />
        <WorksSection />
        <BigStatement data={data.statement} />
        <ContactSection />
        <Footer />
      </div>
    </main>
  );
}
