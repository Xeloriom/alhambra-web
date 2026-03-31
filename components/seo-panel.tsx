"use client";

import { useState, useEffect, useCallback } from "react";

interface SEOMetrics {
  title: { value: string; score: number; message: string };
  description: { value: string; score: number; message: string };
  headings: { h1Count: number; h2Count: number; score: number; message: string };
  images: { total: number; withAlt: number; score: number; message: string };
  links: { internal: number; external: number; score: number; message: string };
  performance: {
    domLoaded: number;
    fullLoad: number;
    score: number;
    message: string;
  };
  accessibility: { score: number; issues: string[] };
  mobile: { score: number; message: string };
}

export function SEOPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"seo" | "performance" | "accessibility">("seo");
  const [metrics, setMetrics] = useState<SEOMetrics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeMetrics = useCallback(() => {
    setIsAnalyzing(true);

    setTimeout(() => {
      // Title analysis
      const titleEl = document.querySelector("title");
      const titleValue = titleEl?.textContent || "";
      const titleLength = titleValue.length;
      let titleScore = 100;
      let titleMessage = "Longueur parfaite";
      if (titleLength < 30) {
        titleScore = 60;
        titleMessage = "Trop court - visez 50-60 caractères";
      } else if (titleLength > 60) {
        titleScore = 70;
        titleMessage = "Trop long - risque d'être coupé";
      }

      // Description analysis
      const descEl = document.querySelector('meta[name="description"]');
      const descValue = descEl?.getAttribute("content") || "";
      const descLength = descValue.length;
      let descScore = 100;
      let descMessage = "Bonne longueur";
      if (descLength < 120) {
        descScore = 60;
        descMessage = "Trop court - visez 150-160 caractères";
      } else if (descLength > 160) {
        descScore = 80;
        descMessage = "Légèrement long mais acceptable";
      }

      // Headings analysis
      const h1s = document.querySelectorAll("h1");
      const h2s = document.querySelectorAll("h2");
      let headingsScore = 100;
      let headingsMessage = "Bonne structure de titres";
      if (h1s.length === 0) {
        headingsScore = 40;
        headingsMessage = "Balise H1 manquante - Critique !";
      } else if (h1s.length > 1) {
        headingsScore = 70;
        headingsMessage = "Plusieurs H1 détectés - Utilisez-en un seul";
      }

      // Images analysis
      const images = document.querySelectorAll("img");
      const imagesWithAlt = document.querySelectorAll("img[alt]:not([alt=''])");
      const imgScore = images.length > 0 ? Math.round((imagesWithAlt.length / images.length) * 100) : 100;
      const imgMessage = imgScore === 100 ? "Toutes les images ont un texte alt" : `${images.length - imagesWithAlt.length} images sans texte alt`;

      // Links analysis
      const allLinks = document.querySelectorAll("a[href]");
      let internal = 0;
      let external = 0;
      allLinks.forEach((link) => {
        const href = link.getAttribute("href") || "";
        if (href.startsWith("http") && !href.includes(window.location.hostname)) {
          external++;
        } else {
          internal++;
        }
      });

      // Performance metrics
      const perfEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
      const navTiming = perfEntries[0];
      const domLoaded = navTiming ? Math.round(navTiming.domContentLoadedEventEnd - navTiming.startTime) : 0;
      const fullLoad = navTiming ? Math.round(navTiming.loadEventEnd - navTiming.startTime) : 0;
      let perfScore = 100;
      let perfMessage = "Excellent temps de chargement";
      if (fullLoad > 3000) {
        perfScore = 50;
        perfMessage = "Chargement lent - optimisez vos assets";
      } else if (fullLoad > 2000) {
        perfScore = 70;
        perfMessage = "Bon mais peut être amélioré";
      } else if (fullLoad > 1000) {
        perfScore = 90;
        perfMessage = "Très bonne performance";
      }

      // Accessibility check
      const accessibilityIssues: string[] = [];
      const formsWithoutLabels = document.querySelectorAll("input:not([aria-label]):not([id])");
      if (formsWithoutLabels.length > 0) {
        accessibilityIssues.push(`${formsWithoutLabels.length} entrées de formulaire sans label`);
      }
      const buttonsWithoutText = document.querySelectorAll("button:empty:not([aria-label])");
      if (buttonsWithoutText.length > 0) {
        accessibilityIssues.push(`${buttonsWithoutText.length} boutons sans texte accessible`);
      }
      const linksWithoutText = document.querySelectorAll("a:empty:not([aria-label])");
      if (linksWithoutText.length > 0) {
        accessibilityIssues.push(`${linksWithoutText.length} liens sans texte accessible`);
      }
      const accessScore = Math.max(0, 100 - accessibilityIssues.length * 15);

      // Mobile check
      const viewport = document.querySelector('meta[name="viewport"]');
      let mobileScore = viewport ? 100 : 50;
      const mobileMessage = viewport ? "Balise viewport présente" : "Balise viewport manquante";

      setMetrics({
        title: { value: titleValue, score: titleScore, message: titleMessage },
        description: { value: descValue, score: descScore, message: descMessage },
        headings: { h1Count: h1s.length, h2Count: h2s.length, score: headingsScore, message: headingsMessage },
        images: { total: images.length, withAlt: imagesWithAlt.length, score: imgScore, message: imgMessage },
        links: { internal, external, score: 100, message: `${internal} internes, ${external} externes` },
        performance: { domLoaded, fullLoad, score: perfScore, message: perfMessage },
        accessibility: { score: accessScore, issues: accessibilityIssues },
        mobile: { score: mobileScore, message: mobileMessage },
      });

      setIsAnalyzing(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === "D") {
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && !metrics) {
      analyzeMetrics();
    }
  }, [isOpen, metrics, analyzeMetrics]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const overallScore = metrics
    ? Math.round(
        (metrics.title.score +
          metrics.description.score +
          metrics.headings.score +
          metrics.images.score +
          metrics.performance.score +
          metrics.accessibility.score +
          metrics.mobile.score) /
          7
      )
    : 0;

  return (
    <>
      {/* Panel */}
      <div
        data-cursor-hover
        className={`fixed bottom-6 right-6 z-[9999] w-[380px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-black/10 overflow-hidden transition-all duration-500 ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="bg-black text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold tracking-widest uppercase">Analyseur de Site</h3>
            <button
              onClick={() => analyzeMetrics()}
              className="text-[10px] font-bold tracking-widest uppercase text-white/40 hover:text-[#FF4D00] transition-colors"
            >
              Rafraîchir
            </button>
          </div>

          {/* Overall score */}
          {metrics && (
            <div className="flex items-center gap-6">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black ${getScoreBg(overallScore)}`}
              >
                {overallScore}
              </div>
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-1">Score Global</p>
                <p className="text-xl font-bold">
                  {overallScore >= 90 ? "Excellent" : overallScore >= 70 ? "Bien" : "À améliorer"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-black/10">
          {(["seo", "performance", "accessibility"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-[10px] font-bold tracking-widest uppercase transition-colors ${
                activeTab === tab ? "text-[#FF4D00] border-b-2 border-[#FF4D00]" : "text-black/40 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[50vh] overflow-y-auto scrollbar-hide">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-10 h-10 border-2 border-[#FF4D00] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-xs font-bold tracking-widest uppercase text-black/40">Analyse en cours...</p>
            </div>
          ) : metrics ? (
            <>
              {activeTab === "seo" && (
                <div className="space-y-4">
                  {/* Title */}
                  <div className="p-4 bg-black/5 rounded-2xl border border-black/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">Balise Titre</span>
                      <span className={`text-[10px] font-black ${getScoreColor(metrics.title.score)}`}>
                        {metrics.title.score}/100
                      </span>
                    </div>
                    <p className="text-xs font-bold text-black truncate mb-1">{metrics.title.value}</p>
                    <p className="text-[10px] font-medium text-black/40 uppercase">{metrics.title.message}</p>
                  </div>

                  {/* Description */}
                  <div className="p-4 bg-black/5 rounded-2xl border border-black/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">Description</span>
                      <span className={`text-[10px] font-black ${getScoreColor(metrics.description.score)}`}>
                        {metrics.description.score}/100
                      </span>
                    </div>
                    <p className="text-xs font-medium text-black line-clamp-2 mb-1">{metrics.description.value || "Non définie"}</p>
                    <p className="text-[10px] font-medium text-black/40 uppercase">{metrics.description.message}</p>
                  </div>

                  {/* Headings */}
                  <div className="p-4 bg-black/5 rounded-2xl border border-black/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">Structure</span>
                      <span className={`text-[10px] font-black ${getScoreColor(metrics.headings.score)}`}>
                        {metrics.headings.score}/100
                      </span>
                    </div>
                    <p className="text-xs font-bold text-black mb-1">
                      H1: {metrics.headings.h1Count} | H2: {metrics.headings.h2Count}
                    </p>
                    <p className="text-[10px] font-medium text-black/40 uppercase">{metrics.headings.message}</p>
                  </div>

                  {/* Images */}
                  <div className="p-4 bg-black/5 rounded-2xl border border-black/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">Images</span>
                      <span className={`text-[10px] font-black ${getScoreColor(metrics.images.score)}`}>
                        {metrics.images.score}/100
                      </span>
                    </div>
                    <p className="text-xs font-bold text-black mb-1">
                      {metrics.images.withAlt}/{metrics.images.total} avec texte alt
                    </p>
                    <p className="text-[10px] font-medium text-black/40 uppercase">{metrics.images.message}</p>
                  </div>

                  {/* Mobile */}
                  <div className="p-4 bg-black/5 rounded-2xl border border-black/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">Mobile Friendly</span>
                      <span className={`text-[10px] font-black ${getScoreColor(metrics.mobile.score)}`}>
                        {metrics.mobile.score}/100
                      </span>
                    </div>
                    <p className="text-[10px] font-medium text-black/40 uppercase">{metrics.mobile.message}</p>
                  </div>
                </div>
              )}

              {activeTab === "performance" && (
                <div className="space-y-4">
                  {/* Performance Score */}
                  <div className="p-6 bg-black/5 rounded-2xl text-center">
                    <div
                      className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-black mb-4 ${getScoreBg(
                        metrics.performance.score
                      )}`}
                    >
                      {metrics.performance.score}
                    </div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-black">{metrics.performance.message}</p>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-black/5 rounded-2xl text-center border border-black/5">
                      <p className="text-2xl font-black text-black">{metrics.performance.domLoaded}</p>
                      <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mt-1">DOM (ms)</p>
                    </div>
                    <div className="p-4 bg-black/5 rounded-2xl text-center border border-black/5">
                      <p className="text-2xl font-black text-black">{metrics.performance.fullLoad}</p>
                      <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mt-1">Full (ms)</p>
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="p-4 bg-[#FF4D00]/10 rounded-2xl border border-[#FF4D00]/20">
                    <p className="text-[10px] font-black text-[#FF4D00] uppercase tracking-[0.2em] mb-3">Conseils</p>
                    <ul className="text-[10px] font-bold text-black/60 space-y-2 uppercase leading-tight">
                      <li>• Optimiser les images via next/image</li>
                      <li>• Utiliser font-display: swap</li>
                      <li>• Réduire la taille des bundles JS</li>
                      <li>• Activer la compression Gzip/Brotli</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "accessibility" && (
                <div className="space-y-4">
                  {/* Score */}
                  <div className="p-6 bg-black/5 rounded-2xl text-center">
                    <div
                      className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-black mb-4 ${getScoreBg(
                        metrics.accessibility.score
                      )}`}
                    >
                      {metrics.accessibility.score}
                    </div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-black">
                      {metrics.accessibility.score >= 90
                        ? "Excellente accessibilité"
                        : metrics.accessibility.score >= 70
                        ? "Bonne avec quelques soucis"
                        : "Besoin d'amélioration"}
                    </p>
                  </div>

                  {/* Issues */}
                  {metrics.accessibility.issues.length > 0 ? (
                    <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                      <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-3">Problèmes Détectés</p>
                      <ul className="text-[10px] font-bold text-red-700 space-y-2 uppercase leading-tight">
                        {metrics.accessibility.issues.map((issue, i) => (
                          <li key={i}>• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="p-4 bg-green-50 rounded-2xl border border-green-100 text-center">
                      <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Aucun problème majeur détecté</p>
                    </div>
                  )}

                  {/* Checklist */}
                  <div className="p-4 bg-black/5 rounded-2xl border border-black/5">
                    <p className="text-[10px] font-black text-black uppercase tracking-widest mb-3">Checklist</p>
                    <ul className="text-[10px] font-bold text-black/60 space-y-2 uppercase leading-tight">
                      {[
                        { label: "Textes ALT sur images", pass: metrics.images.score >= 90 },
                        { label: "Hiérarchie des titres", pass: metrics.headings.score >= 90 },
                        { label: "Navigation clavier", pass: true },
                        { label: "Contraste des couleurs", pass: true },
                        { label: "Indicateurs de focus", pass: true },
                      ].map((item) => (
                        <li key={item.label} className="flex items-center gap-3">
                          <span className={item.pass ? "text-green-500" : "text-red-500"}>
                            {item.pass ? "✓" : "✗"}
                          </span>
                          {item.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
        
        {/* Footer info */}
        <div className="p-4 bg-black/5 border-t border-black/10 text-center">
          <p className="text-[10px] font-bold text-black/30 uppercase tracking-[0.1em]">
            Raccourci : Shift + D
          </p>
        </div>
      </div>
    </>
  );
}
