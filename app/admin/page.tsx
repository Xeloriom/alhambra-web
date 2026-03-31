"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/hero-section";
import { ServicesSection } from "@/components/services-section";
// @ts-ignore
import { ProcessSection } from "@/components/process-section";
import { WorksSection } from "@/components/works-section";
// @ts-ignore
import { WhyChooseUs } from "@/components/why-choose-us";
// @ts-ignore
import { BigStatement } from "@/components/big-statement";
import { TestimonialsSection } from "@/components/testimonials-section";
import { FaqSection } from "@/components/faq-section";
// @ts-ignore
import { PricingSection } from "@/components/pricing-section";
import { CtaBanner } from "@/components/cta-banner";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
// @ts-ignore
import { EditableText } from "@/components/editable-text";

function AdminPageContent() {
  const [data, setData] = useState<any>(null);
  const [password, setPassword] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [status, setStatus] = useState<"" | "saving" | "success" | "error">("");

  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/config");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error("Fetch error");
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "AlhambraAdmin2024!") {
      setIsLogged(true);
      fetchConfig();
    } else {
      alert("Accès refusé");
    }
  };

  const handleUpdate = (path: string, value: any) => {
    if (!data) return;
    const keys = path.split('.');
    const newData = JSON.parse(JSON.stringify(data));
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setData(newData);
  };

  const handleSave = async () => {
    if (!data) return;
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, data }),
      });
      if (res.ok) {
        setStatus("success");
        setTimeout(() => setStatus(""), 3000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  if (!isLogged) {
    return (
      <div className="fixed inset-0 bg-[#0A0A0A] flex items-center justify-center p-6 z-[99999] font-sans">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white/5 border border-white/10 rounded-[40px] p-12 backdrop-blur-3xl shadow-2xl">
          <div className="flex justify-center mb-10">
            <div className="w-16 h-16 bg-[#FF4D00] rounded-3xl flex items-center justify-center rotate-12 shadow-2xl shadow-[#FF4D00]/20">
              <span className="text-white font-black text-2xl italic">A</span>
            </div>
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 text-center">ALHAMBRA STUDIO</h1>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em] text-center mb-12">System Locked</p>
          <div className="space-y-4">
            <input
              autoFocus
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-[#FF4D00] outline-none transition-all text-center text-2xl tracking-widest placeholder:text-white/5"
            />
            <button type="submit" className="w-full bg-[#FF4D00] text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#FF4D00]/20 mt-4">
              Unlock Studio
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans selection:bg-[#FF4D00]">
      {/* Premium Studio Header */}
      <header className="h-24 border-b border-white/5 px-8 md:px-12 flex items-center justify-between sticky top-0 bg-[#0A0A0A]/90 backdrop-blur-2xl z-[500]">
        <div className="flex items-center gap-6">
          <div className="w-10 h-10 bg-[#FF4D00] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF4D00]/20 rotate-3">
            <span className="text-white font-black italic">A</span>
          </div>
          <div>
             <h1 className="text-xl font-black uppercase tracking-tighter leading-none">Alhambra <span className="text-white/20">Studio</span></h1>
             <p className="text-[9px] font-black text-[#FF4D00] uppercase tracking-[0.3em] mt-1">Live Engine Mode</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          {status === "success" && <span className="text-[9px] font-black text-green-500 uppercase tracking-widest animate-in fade-in slide-in-from-right-4">✓ Site synchronisé</span>}
          <button
            onClick={handleSave}
            disabled={status === "saving"}
            className={`px-12 py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all ${
              status === "saving" ? "bg-white/10 text-white/20" : 
              status === "success" ? "bg-green-500 text-white shadow-xl shadow-green-500/20" : "bg-[#FF4D00] text-white hover:bg-white hover:text-black shadow-2xl shadow-[#FF4D00]/20 active:scale-95"
            }`}
          >
            {status === "saving" ? "Sauvegarde..." : "Publier les changements"}
          </button>
        </div>
      </header>

      {/* Main Studio Area */}
      <main className="flex-1 bg-black overflow-y-auto p-4 md:p-10 scrollbar-hide">
        <div className="max-w-[1500px] mx-auto bg-white rounded-[40px] shadow-2xl border border-white/5 overflow-hidden relative text-black">
          {data ? (
            <div className="flex flex-col">
              <HeroSection data={data.hero} onUpdate={handleUpdate} isEditing={true} />
              <ServicesSection data={data.services} onUpdate={handleUpdate} isEditing={true} />
              {/* @ts-ignore */}
              <ProcessSection data={data.process} onUpdate={handleUpdate} isEditing={true} />
              {/* @ts-ignore */}
              <WhyChooseUs data={data.why} onUpdate={handleUpdate} isEditing={true} />
              {/* @ts-ignore */}
              <BigStatement data={data.statement} onUpdate={handleUpdate} isEditing={true} />
              <TestimonialsSection data={data.testimonials} onUpdate={handleUpdate} isEditing={true} />
              <FaqSection />
              {/* @ts-ignore */}
              <PricingSection />
              <CtaBanner />
              <ContactSection />
              
              {/* Footer Studio Editor */}
              <div className="p-24 bg-black text-white text-center flex flex-col items-center gap-10">
                 <div className="flex flex-col gap-4">
                    <p className="text-[10px] font-black tracking-[0.4em] text-[#FF4D00] uppercase">Signature & Mentions</p>
                    <div className="space-y-4">
                       {/* @ts-ignore */}
                       <EditableText isEditing={true} value={data.footer.rights} onSave={(v) => handleUpdate("footer.rights", v)} as="p" className="text-2xl font-black uppercase tracking-tight" />
                       <div className="flex gap-8 justify-center">
                          {/* @ts-ignore */}
                          <EditableText isEditing={true} value={data.footer.legal} onSave={(v) => handleUpdate("footer.legal", v)} as="span" className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-[#FF4D00] transition-colors underline decoration-[#FF4D00] decoration-2" />
                          {/* @ts-ignore */}
                          <EditableText isEditing={true} value={data.footer.privacy} onSave={(v) => handleUpdate("footer.privacy", v)} as="span" className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-[#FF4D00] transition-colors underline decoration-[#FF4D00] decoration-2" />
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          ) : (
            <div className="h-[800px] flex items-center justify-center bg-[#0A0A0A]">
               <div className="w-12 h-12 border-4 border-white/5 border-t-[#FF4D00] rounded-full animate-spin" />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(AdminPageContent), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#0A0A0A]" />
});
