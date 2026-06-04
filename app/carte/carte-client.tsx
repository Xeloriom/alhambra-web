"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, Globe, MapPin, Download } from "lucide-react";

const CONTACTS = [
  { href: "tel:+33612832010",                Icon: Phone,  label: "06 12 83 20 10",          sub: "Appel / SMS" },
  { href: "mailto:contact@alhambra-web.com", Icon: Mail,   label: "contact@alhambra-web.com", sub: "Email" },
  { href: "https://www.alhambra-web.com",    Icon: Globe,  label: "alhambra-web.com",          sub: "Site web" },
  { href: "#",                               Icon: MapPin, label: "Lyon, France",              sub: "Localisation" },
];

export default function CarteClient() {
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
