"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, Globe, MapPin, ArrowUpRight, Download } from "lucide-react";

const CONTACTS = [
  { href: "tel:+33612832010",                Icon: Phone,  label: "06 12 83 20 10",          sub: "Appel / SMS" },
  { href: "mailto:contact@alhambra-web.com", Icon: Mail,   label: "contact@alhambra-web.com", sub: "Email" },
  { href: "https://www.alhambra-web.com",    Icon: Globe,  label: "alhambra-web.com",          sub: "Site web" },
  { href: "#",                               Icon: MapPin, label: "Lyon, France",              sub: "Localisation" },
];

const PROJECTS = [
  { name: "Chez Ramo",        image: "/images/Chez Ramo.webp",            url: "https://xeloriom-sketch.github.io/chezramo/", category: "Restaurant" },
  { name: "Daftar",           image: "/images/daftar.webp",               url: "https://apidaftar.com",                        category: "SaaS / Fintech" },
  { name: "ON Coaching",      image: "/images/ON Coaching.webp",           url: "https://oncoaching.fr",                        category: "Coaching Luxe" },
  { name: "ARLEA Promotion",  image: "/images/ARLEA Promotion.webp",       url: "https://arleapromotion.com",                   category: "Immobilier" },
  { name: "Mosquée Es-Salam", image: "/images/Mosquée Es-Salam.webp",      url: "http://mosquee-essalem.fr",                    category: "Institutionnel" },
  { name: "Xpertive",        image: "/images/Xpertive.webp",              url: "https://xpertive.com",                         category: "Industrie" },
  { name: "LuxFlora",        image: "/images/LuxFlora.webp",              url: "https://xeloriom.github.io/LuxFlora/",         category: "E-commerce Luxe" },
];

const STATS = [
  { value: "95+",  label: "Lighthouse" },
  { value: "200€", label: "Dès" },
  { value: "24h",  label: "Réponse" },
];

export default function CarteClient() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes glow-pulse {
          0%,100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.05); }
        }
        @keyframes dot-pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .carte-scroll::-webkit-scrollbar { display: none; }
        .carte-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .project-card:hover .project-overlay { opacity: 1; }
        .project-card:hover img { transform: scale(1.06); }
        .project-card img { transition: transform 0.6s cubic-bezier(0.16,1,0.3,1); }
        .contact-row:hover { background: rgba(255,255,255,0.06); }
        .cta-btn:hover { background: #E8E8E8; transform: scale(0.99); }
        .cta-btn:active { transform: scale(0.97); }
      `}</style>

      <main
        style={{
          minHeight: "100svh",
          background: "#080808",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 0 env(safe-area-inset-bottom, 24px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow top */}
        <div
          style={{
            position: "absolute",
            top: -120,
            left: "50%",
            transform: "translateX(-50%)",
            width: 500,
            height: 400,
            background: "radial-gradient(ellipse, rgba(120,80,255,0.18) 0%, transparent 70%)",
            animation: "glow-pulse 5s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />

        <div style={{ width: "100%", maxWidth: 430, padding: "52px 24px 40px", display: "flex", flexDirection: "column", gap: 0, animation: "fade-up 0.6s ease both" }}>

          {/* ── HERO ─────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, marginBottom: 36 }}>

            {/* Logo */}
            <div style={{ position: "relative", animation: "float 6s ease-in-out infinite" }}>
              <div style={{
                position: "absolute", inset: -12,
                background: "radial-gradient(circle, rgba(140,100,255,0.3) 0%, transparent 70%)",
                borderRadius: "50%", filter: "blur(8px)",
              }} />
              <div style={{
                width: 88, height: 88, borderRadius: "50%", background: "white",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 24px 64px rgba(0,0,0,0.8)",
                position: "relative", zIndex: 1,
              }}>
                <Image src="/logo.png" alt="Alhambra Web" width={56} height={56} style={{ objectFit: "contain" }} />
              </div>
            </div>

            {/* Brand */}
            <div style={{ textAlign: "center" }}>
              <h1 style={{
                color: "white", fontSize: 34, letterSpacing: "-0.03em", lineHeight: 1,
                fontFamily: "var(--font-nordique, sans-serif)", fontWeight: 600, margin: 0,
              }}>
                Alhambra Web
              </h1>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", flexShrink: 0, animation: "dot-pulse 2s ease-in-out infinite" }} />
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700 }}>
                  Agence Web · Lyon
                </span>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: 8 }}>
              {STATS.map(({ value, label }) => (
                <div key={value} style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: 99, padding: "6px 14px",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
                }}>
                  <span style={{ color: "white", fontSize: 14, fontWeight: 900, letterSpacing: "-0.02em" }}>{value}</span>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 8, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── SEPARATOR ────────────────────────── */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 28 }} />

          {/* ── CONTACT ──────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 32 }}>
            {CONTACTS.map(({ href, Icon, label, sub }) => (
              <a
                key={label}
                href={href}
                className="contact-row"
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "12px 14px", borderRadius: 16,
                  textDecoration: "none", transition: "background 0.2s",
                }}
              >
                <span style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: "rgba(255,255,255,0.07)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={17} color="rgba(255,255,255,0.55)" strokeWidth={1.6} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: "white", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</div>
                  <div style={{ color: "rgba(255,255,255,0.28)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 1 }}>{sub}</div>
                </div>
              </a>
            ))}
          </div>

          {/* ── SEPARATOR ────────────────────────── */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 28 }} />

          {/* ── PORTFOLIO ────────────────────────── */}
          <div style={{ marginBottom: 32 }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, paddingLeft: 4 }}>
              <div>
                <div style={{ color: "white", fontSize: 17, fontWeight: 900, letterSpacing: "-0.02em", fontFamily: "var(--font-nordique, sans-serif)" }}>
                  Réalisations
                </div>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 2 }}>
                  {PROJECTS.length} projets livrés
                </div>
              </div>
              <a
                href="https://www.alhambra-web.com/#work"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  color: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 800,
                  letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none",
                  padding: "6px 12px", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 99, transition: "all 0.2s",
                }}
              >
                Voir tout <ArrowUpRight size={11} />
              </a>
            </div>

            {/* Horizontal scroll */}
            <div
              ref={scrollRef}
              className="carte-scroll"
              style={{
                display: "flex", gap: 12,
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
                paddingLeft: 4, paddingRight: 4, paddingBottom: 4,
                margin: "0 -24px",
                paddingInline: 24,
              }}
            >
              {PROJECTS.map((p) => (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card"
                  style={{
                    flexShrink: 0,
                    width: 190,
                    height: 260,
                    borderRadius: 20,
                    overflow: "hidden",
                    position: "relative",
                    scrollSnapAlign: "start",
                    display: "block",
                    textDecoration: "none",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {/* Image */}
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="190px"
                  />

                  {/* Gradient overlay */}
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to bottom, transparent 35%, rgba(0,0,0,0.85) 100%)",
                  }} />

                  {/* Category chip */}
                  <div style={{
                    position: "absolute", top: 10, right: 10,
                    background: "rgba(0,0,0,0.55)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 99, padding: "3px 9px",
                    fontSize: 8, fontWeight: 800, color: "rgba(255,255,255,0.7)",
                    letterSpacing: "0.1em", textTransform: "uppercase",
                  }}>
                    {p.category}
                  </div>

                  {/* Hover overlay */}
                  <div
                    className="project-overlay"
                    style={{
                      position: "absolute", inset: 0,
                      background: "rgba(120,80,255,0.12)",
                      opacity: 0, transition: "opacity 0.3s",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(8px)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <ArrowUpRight size={16} color="white" />
                    </div>
                  </div>

                  {/* Project name */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 14px" }}>
                    <div style={{ color: "white", fontSize: 13, fontWeight: 800, letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                      {p.name}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* ── SEPARATOR ────────────────────────── */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 28 }} />

          {/* ── CTA ──────────────────────────────── */}
          <a
            href="/alhambra.vcf"
            download="Alhambra-Web.vcf"
            className="cta-btn"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              width: "100%", padding: "18px",
              background: "white", color: "#080808",
              borderRadius: 18, textDecoration: "none",
              fontSize: 13, fontWeight: 800,
              letterSpacing: "0.08em", textTransform: "uppercase",
              fontFamily: "var(--font-nordique, sans-serif)",
              transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
              marginBottom: 28,
            }}
          >
            <Download size={16} strokeWidth={2.2} />
            Enregistrer le contact
          </a>

          {/* Tagline */}
          <p style={{
            color: "rgba(255,255,255,0.15)",
            fontSize: 11, textAlign: "center",
            lineHeight: 1.6, fontStyle: "italic",
            letterSpacing: "0.02em", marginBottom: 20,
          }}>
            On ne fait pas du web — on bâtit des empires.
          </p>

          {/* Back */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Link
              href="/"
              style={{ color: "rgba(255,255,255,0.18)", fontSize: 11, textDecoration: "none", fontWeight: 700, letterSpacing: "0.1em" }}
            >
              ← Retour au site
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
