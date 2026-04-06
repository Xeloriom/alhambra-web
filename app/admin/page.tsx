"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { HeroSection } from "@/components/hero-section";
import { ServicesSection } from "@/components/services-section";
import { WorkSection } from "@/components/work-section";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN SYSTEM CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const SHARP_EASE = [0.76, 0, 0.24, 1] as const;
const POWER_EASE = [0.16, 1, 0.3, 1] as const;

// ─────────────────────────────────────────────────────────────────────────────
// SHARED ANIMATED COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const MaskText = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <div className={`overflow-hidden ${className}`}>
    <motion.div
      initial={{ y: "110%" }}
      animate={{ y: 0 }}
      transition={{ duration: 1, ease: POWER_EASE as any, delay }}
    >
      {children}
    </motion.div>
  </div>
);

const MagneticButton = ({ children, className = "", onClick, strength = 0.3, disabled = false }: { children: React.ReactNode; className?: string; onClick?: () => void; strength?: number; disabled?: boolean }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled || !ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    x.set((clientX - (left + width / 2)) * strength);
    y.set((clientY - (top + height / 2)) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// INQUIRIES VIEW (AWWWARDS LEVEL)
// ─────────────────────────────────────────────────────────────────────────────
function InquiriesView() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings`);
      if (res.ok) {
        const json = await res.json();
        setInquiries(json.sort((a: any, b: any) => b.id - a.id));
      }
    } catch (e) {
      console.error("Fetch error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this inquiry?")) return;
    try {
      const res = await fetch(`/api/admin/bookings?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setInquiries(inquiries.filter(i => i.id !== id));
      }
    } catch (e) {
      alert("Error deleting inquiry");
    }
  };

  return (
    <div className="p-8 md:p-20 bg-[#F8F8F8] min-h-[1000px] font-haas selection:bg-black selection:text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-32">
        <div className="flex-1">
          <MaskText className="text-[12vw] font-nordique text-black leading-[0.85] tracking-tighter uppercase">Inquiries</MaskText>
          <MaskText delay={0.2} className="text-[2.5vw] text-black/30 font-nordique leading-[1] mt-6 italic uppercase">Track your growth &<br />client interactions.</MaskText>
        </div>
        <MagneticButton 
          onClick={fetchInquiries}
          className="bg-black text-white px-12 py-6 rounded-full font-bold uppercase text-[12px] tracking-[0.3em] shadow-2xl hover:scale-105 transition-all"
        >
          {loading ? "SYNCING..." : "REFRESH FLOW"}
        </MagneticButton>
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-6">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="w-16 h-16 border-2 border-dashed border-black/10 rounded-full" />
          <p className="text-[12px] font-bold tracking-[0.4em] text-black/20 uppercase">Retrieving Data</p>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="h-96 border-2 border-dashed border-black/10 rounded-[60px] flex flex-col items-center justify-center gap-6">
          <p className="text-black/20 font-bold uppercase tracking-[0.4em] text-lg italic">The collective is silent.</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {inquiries.map((inquiry, index) => (
            <motion.div 
              key={inquiry.id} 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: SHARP_EASE as any }}
              className="bg-white rounded-[50px] p-12 md:p-16 transition-all hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] group relative border border-black/[0.02]"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-12">
                <div className="flex-1 space-y-10">
                  {/* Header */}
                  <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-[#E9EBEF] rounded-[30px] flex items-center justify-center text-black text-2xl font-black shadow-inner">
                      {inquiry.fname?.[0]?.toUpperCase() || "?" }
                    </div>
                    <div>
                      <h3 className="text-[clamp(24px,3vw,48px)] font-bold text-black uppercase tracking-tight leading-none mb-2">{inquiry.fname}</h3>
                      <p className="text-black/30 font-bold text-[14px] tracking-[0.3em] uppercase">{new Date(inquiry.date).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-black/[0.05] pt-10">
                    <div className="space-y-2">
                      <p className="text-[11px] font-black uppercase tracking-[0.4em] text-black/20">Client Channel</p>
                      <p className="font-bold text-2xl tracking-tight text-black">{inquiry.email}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[11px] font-black uppercase tracking-[0.4em] text-black/20">Selected Focus</p>
                      <p className="font-bold text-2xl tracking-tight text-black italic">{inquiry.service || "Exploratory"}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-black/20">Message / AI Context</p>
                    <div className="bg-[#F8F8F8] border border-black/[0.03] rounded-[40px] p-10 font-medium text-black/60 text-lg whitespace-pre-wrap leading-relaxed shadow-inner italic">
                      {inquiry.message}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col justify-end gap-6 border-l border-black/[0.05] pl-12">
                  <MagneticButton 
                    onClick={() => handleDelete(inquiry.id)}
                    className="w-16 h-16 rounded-full border border-black/5 flex items-center justify-center text-black/10 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                  </MagneticButton>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
function AdminPageContent() {
  const [activeTab, setActiveTab] = useState<"editor" | "inquiries">("inquiries");
  const [data, setData] = useState<any>(null);
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

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const handleSave = async () => {
    if (!data) return;
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }), // Removed password for now
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

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-haas selection:bg-white selection:text-black">
      {/* HEADER DASHBOARD */}
      <header className="h-28 border-b border-white/5 px-16 flex items-center justify-between sticky top-0 bg-black/90 backdrop-blur-2xl z-[500]">
        <div className="flex items-center gap-16">
          <div className="flex items-center gap-6 group cursor-pointer">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
              <span className="text-black font-black italic text-xl">A</span>
            </div>
            <div>
               <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">Alhambra <span className="text-white/20 italic">Studio</span></h1>
               <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em] mt-1">Admin Dashboard</p>
            </div>
          </div>

          <nav className="flex gap-3 bg-white/5 p-2 rounded-[24px]">
            <button 
              onClick={() => setActiveTab("inquiries")}
              className={`px-10 py-4 rounded-[18px] font-bold uppercase text-[11px] tracking-[0.25em] transition-all ${activeTab === "inquiries" ? "bg-white text-black shadow-xl scale-105" : "text-white/30 hover:text-white"}`}
            >
              Inquiries
            </button>
            <button 
              onClick={() => setActiveTab("editor")}
              className={`px-10 py-4 rounded-[18px] font-bold uppercase text-[11px] tracking-[0.25em] transition-all ${activeTab === "editor" ? "bg-white text-black shadow-xl scale-105" : "text-white/30 hover:text-white"}`}
            >
              Content Editor
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-10">
          {activeTab === "editor" && (
            <>
              {status === "success" && <span className="text-[11px] font-black text-green-500 uppercase tracking-widest animate-pulse">✓ Site Sync</span>}
              <MagneticButton
                onClick={handleSave}
                disabled={status === "saving"}
                className={`px-12 py-5 rounded-full font-black uppercase text-[11px] tracking-[0.3em] transition-all shadow-2xl ${
                  status === "saving" ? "bg-white/10 text-white/20" : 
                  status === "success" ? "bg-green-500 text-white" : "bg-white text-black hover:bg-[#F8F8F8] active:scale-95"
                }`}
              >
                {status === "saving" ? "Syncing..." : "Publish Changes"}
              </MagneticButton>
            </>
          )}
        </div>
      </header>

      {/* MAIN ADMIN AREA */}
      <main className="flex-1 overflow-y-auto scrollbar-hide bg-[#F8F8F8]">
        <div className="min-h-full">
          {activeTab === "inquiries" ? (
            <InquiriesView />
          ) : (
            <div className="flex flex-col">
              <div className="bg-black text-white py-10 px-16">
                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-white/20">Live Visual Editor</p>
              </div>
              <div className="scale-[0.95] origin-top rounded-[60px] overflow-hidden shadow-[0_100px_200px_-20px_rgba(0,0,0,0.2)] bg-white">
                <HeroSection />
                <ServicesSection />
                <WorkSection />
              </div>
              
              <div className="p-40 bg-black text-white text-center">
                 <div className="max-w-xl mx-auto space-y-8">
                    <div className="w-20 h-[2px] bg-white/10 mx-auto" />
                    <p className="text-[clamp(24px,3vw,48px)] font-bold italic tracking-tighter uppercase leading-none">
                      End of page content.
                    </p>
                    <p className="text-white/20 font-bold uppercase tracking-[0.5em] text-[12px]">© 2026 ALHAMBRA STUDIO</p>
                 </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(AdminPageContent), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-black" />
});
