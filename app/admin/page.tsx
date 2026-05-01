"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminStore, Project, Task, Message, ChatMessage, KnowledgeEntry } from "../../store/admin-store";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface Appointment {
  id: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  date: string;
  time: string;
  service: string;
  status: string;
  notes?: string;
  created_at: string;
}

interface AppData {
  projects: Project[];
  tasks: Task[];
  messages: Message[];
  appointments: Appointment[];
  knowledgeBase: KnowledgeEntry[];
}

// ─────────────────────────────────────────────
// SUPABASE CONFIG
// ─────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || "";

async function sbFetch(path: string, options?: { method?: string; body?: unknown; prefer?: string }) {
  const url = `${SUPABASE_URL}/rest/v1/${path}`;
  const headers: Record<string, string> = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  };

  const fetchOptions: RequestInit = {
    method: options?.method || "GET",
    headers: headers,
  };

  if (options?.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  if (options?.method === "DELETE") {
    headers["Prefer"] = options.prefer || "return=minimal";
  }

  if (options?.method === "POST" && options?.prefer) {
    headers["Prefer"] = options.prefer;
  }

  const res = await fetch(url, fetchOptions);

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase error ${res.status}: ${err}`);
  }

  if (options?.method === "DELETE") {
    return { success: true };
  }

  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

const db = {
  get: <T,>(table: string, query = "") => sbFetch(`${table}?${query}&order=created_at.desc`) as Promise<T[]>,
  insert: <T,>(table: string, data: unknown) => sbFetch(table, { method: "POST", body: data, prefer: "return=representation" }) as Promise<T[]>,
  update: <T,>(table: string, id: string, data: unknown) => sbFetch(`${table}?id=eq.${id}`, { method: "PATCH", body: data }) as Promise<T[]>,
  delete: (table: string, id: string) => sbFetch(`${table}?id=eq.${id}`, { method: "DELETE", prefer: "return=minimal" }),
};

// ─────────────────────────────────────────────
// FALLBACK DATA
// ─────────────────────────────────────────────
const DEMO_DATA: AppData = {
  projects: [
    { id: "daftar-2026", name: "DAFTAR", client: "Daftar Global Secure Core", year: "2026", category: "Fintech / SaaS", status: "BETA", description: "Digitalisation sécurisée des créances pour commerçants.", links: { live: "https://daftar.ma" }, metrics: { seo: 98, performance: 99, accessibility: 100 }, notes: ["Sync offline résolu v1.2"] },
    { id: "on-coaching", name: "ON Coaching", client: "ON Professional", year: "2025", category: "Coaching de Luxe", status: "LIVE", description: "Accompagnement d'excellence pour leaders et dirigeants.", links: { live: "https://oncoaching.fr" }, metrics: { seo: 100, performance: 94, accessibility: 98 }, notes: [] },
    { id: "xpertive", name: "Xpertive", client: "Famille Xpertive Lyon", year: "2024", category: "Industrie / Maintenance", status: "LIVE", description: "Ateliers de maintenance 4.0 — Solutions clés en main.", links: { live: "https://xpertive.fr" }, metrics: { seo: 92, performance: 88, accessibility: 90 }, notes: [] },
    { id: "ocea", name: "Ocea Smart Building", client: "Ocea Group", year: "2023", category: "Logiciel Industriel", status: "MAINTENANCE", description: "Logiciel de migration critique de données.", links: {}, metrics: { seo: 0, performance: 99, accessibility: 85 }, notes: [] },
  ],
  tasks: [
    { id: "t1", title: "Intégration SMS rappel Daftar", project_id: "daftar-2026", priority: "HIGH", status: "backlog", kanban_column: "backlog", created_at: new Date().toISOString() },
    { id: "t2", title: "Audit SEO mensuel ON Coaching", project_id: "on-coaching", priority: "MEDIUM", status: "in_progress", kanban_column: "inprogress", created_at: new Date().toISOString() },
    { id: "t3", title: "Refonte module stock Xpertive", project_id: "xpertive", priority: "LOW", status: "review", kanban_column: "review", created_at: new Date().toISOString() },
    { id: "t4", title: "Migration .NET 9 Ocea", project_id: "ocea", priority: "HIGH", status: "done", kanban_column: "done", created_at: new Date().toISOString() },
  ],
  messages: [
    { id: "m1", sender: "Karim B.", subject: "Question Daftar APK", body: "Bonjour, comment je peux installer l'APK sur Android ?", time: "14:02", is_read: false, created_at: new Date().toISOString() },
    { id: "m2", sender: "ON Coaching", subject: "Nouveau contrat 2025", body: "Le contrat est prêt pour signature, merci de revenir vers nous.", time: "Hier", is_read: false, created_at: new Date().toISOString() },
  ],
  appointments: [
    { id: "a1", client_name: "Sarah Dupont", client_email: "sarah@example.com", date: new Date(Date.now() + 86400000).toISOString().split("T")[0], time: "10:00", service: "Site Web", status: "confirmed", notes: "Projet e-commerce", created_at: new Date().toISOString() },
    { id: "a2", client_name: "Marc Lévesque", client_email: "marc@startup.fr", date: new Date(Date.now() + 172800000).toISOString().split("T")[0], time: "14:30", service: "Branding", status: "pending", notes: "Refonte identité", created_at: new Date().toISOString() },
  ],
  knowledgeBase: [
    { id: "k1", problem: "Erreur 400 invalid input value for enum task_status", solution: "Utilisez 'backlog' au lieu de 'todo'. Les valeurs valides sont: backlog, in_progress, review, done.", tags: ["supabase", "enum", "database"], severity: "medium", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "k2", problem: "CORS error lors d'appels API depuis le navigateur", solution: "Utilisez une API route Next.js comme proxy ou ajoutez les headers CORS appropriés.", tags: ["cors", "api", "browser"], severity: "medium", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ],
};

// ─────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────
interface IconProps {
  d: string;
  size?: number;
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
}

const Icon = ({ d, size = 18, stroke = "currentColor", fill = "none", strokeWidth = 1.8 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
);

const Icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
  projects: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  ai: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M17 20.386l-.707-.707M12 21v-1m-5.657-.707l-.707-.707M3 12H2m4.343-6.657L5.636 4.636M12 7a5 5 0 100 10A5 5 0 0012 7z",
  kanban: "M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h4M9 3h10a2 2 0 012 2v4M9 3v18M14 14h7M14 18h7M14 10h7",
  messages: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",
  send: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
  plus: "M12 5v14M5 12h14",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6",
  link: "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
  check: "M20 6L9 17l-5-5",
  globe: "M12 2a10 10 0 100 20A10 10 0 0012 2zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z",
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  x: "M18 6L6 18M6 6l12 12",
  bot: "M12 2a2 2 0 012 2v2h4a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h4V4a2 2 0 012-2zM9 13a1 1 0 100 2 1 1 0 000-2zm6 0a1 1 0 100 2 1 1 0 000-2z",
  user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z",
  sparkles: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M17 20.386l-.707-.707M12 21v-1m-5.657-.707l-.707-.707M3 12H2m4.343-6.657L5.636 4.636M12 7a5 5 0 100 10A5 5 0 0012 7z",
  clock: "M12 2a10 10 0 100 20A10 10 0 0012 2zm0 5v5l4 2",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 0l8 8 8-8",
  phone: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.63a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z",
  refresh: "M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15",
  image: "M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z",
  video: "M15 10l4.553-2.553A1 1 0 0121 8.382v7.236a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z",
  externalLink: "M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3",
  copy: "M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-2M8 4a2 2 0 012-2h4a2 2 0 012 2v0a2 2 0 01-2 2h-4a2 2 0 01-2-2zM16 12H8M12 8v8",
  code: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  play: "M5 3l14 9-14 9V3z",
  maximize: "M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3",
  download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
};

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  BETA: { bg: "#FFF3CD", text: "#856404", border: "#FFECB5" },
  LIVE: { bg: "#D1FAE5", text: "#065F46", border: "#A7F3D0" },
  MAINTENANCE: { bg: "#FEE2E2", text: "#991B1B", border: "#FECACA" },
  ARCHIVED: { bg: "#F3F4F6", text: "#6B7280", border: "#E5E7EB" },
};

const APPT_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  confirmed: { bg: "#D1FAE5", text: "#065F46" },
  pending: { bg: "#FEF3C7", text: "#92400E" },
  cancelled: { bg: "#FEE2E2", text: "#991B1B" },
  done: { bg: "#F3F4F6", text: "#6B7280" },
};

const PRIORITY_COLORS: Record<string, { bg: string; text: string }> = {
  HIGH: { bg: "#FEE2E2", text: "#991B1B" },
  MEDIUM: { bg: "#FEF3C7", text: "#92400E" },
  LOW: { bg: "#D1FAE5", text: "#065F46" },
};

const StatusBadge = ({ status }: { status: string }) => {
  const c = STATUS_COLORS[status] || STATUS_COLORS.ARCHIVED;
  return (
      <span style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}`, borderRadius: 99, fontSize: 9, fontWeight: 900, letterSpacing: "0.12em", padding: "3px 10px", textTransform: "uppercase" }}>
      {status}
    </span>
  );
};

// ─────────────────────────────────────────────
// CODE BLOCK COMPONENT — syntax highlight + live preview
// ─────────────────────────────────────────────
function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const isPreviewable = ["html", "css", "javascript", "js", "jsx", "tsx", "react"].includes(language.toLowerCase());

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Basic syntax highlight via regex
  const highlight = (src: string) => {
    const lines = src.split("\n");
    return lines.map((line, li) => {
      // Replace tokens with spans
      let html = line
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          // strings
          .replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span style="color:#a8ff78">$1$2$1</span>')
          // keywords
          .replace(/\b(const|let|var|function|return|import|export|default|from|if|else|for|while|class|extends|new|this|async|await|try|catch|throw|typeof|interface|type|enum|void|null|undefined|true|false)\b/g, '<span style="color:#79c0ff">$1</span>')
          // JSX/HTML tags
          .replace(/(&lt;\/?)([\w.-]+)/g, '$1<span style="color:#ff7b72">$2</span>')
          // numbers
          .replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#d2a679">$1</span>')
          // comments
          .replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/g, '<span style="color:#6e7681;font-style:italic">$1</span>')
          // functions/methods
          .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, '<span style="color:#d2a679">$1</span>')
          // css properties
          .replace(/([a-zA-Z-]+)\s*(?=:)/g, '<span style="color:#79c0ff">$1</span>');
      return `<span style="color:#8b949e;user-select:none;margin-right:16px;font-size:11px;opacity:0.5">${String(li + 1).padStart(2, " ")}</span>${html}`;
    }).join("\n");
  };

  const buildPreviewDoc = () => {
    const lang = language.toLowerCase();
    if (lang === "html") return code;
    if (["css"].includes(lang)) return `<html><head><style>${code}</style></head><body><p style="font-family:sans-serif;padding:20px;color:#666">Preview CSS</p></body></html>`;
    return `<html><head><style>body{margin:0;font-family:system-ui;background:#fff}</style></head><body><script>${code}</script></body></html>`;
  };

  const LANG_COLORS: Record<string, string> = {
    html: "#e34c26", css: "#264de4", javascript: "#f7df1e", js: "#f7df1e",
    jsx: "#61dafb", tsx: "#3178c6", react: "#61dafb",
    typescript: "#3178c6", ts: "#3178c6", python: "#3572A5",
    json: "#292929", bash: "#89e051", shell: "#89e051", sql: "#e38c00",
  };

  const langColor = LANG_COLORS[language.toLowerCase()] || "#6e7681";

  return (
      <div style={{ margin: "12px 0", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", background: "#0d1117" }}>
        {/* Header bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: "#161b22", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Mac dots */}
            {["#ff5f57","#febc2e","#28c840"].map(c => (
                <span key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c, display: "inline-block" }} />
            ))}
            <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, color: langColor, letterSpacing: "0.1em", textTransform: "uppercase", background: `${langColor}20`, borderRadius: 6, padding: "2px 8px", border: `1px solid ${langColor}30` }}>
            {language || "code"}
          </span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {isPreviewable && (
                <button onClick={() => setShowPreview(v => !v)}
                        style={{ background: showPreview ? "rgba(97,218,251,0.15)" : "rgba(255,255,255,0.05)", border: `1px solid ${showPreview ? "rgba(97,218,251,0.3)" : "rgba(255,255,255,0.1)"}`, borderRadius: 8, color: showPreview ? "#61dafb" : "rgba(255,255,255,0.5)", padding: "5px 12px", cursor: "pointer", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 5, transition: "all 0.2s" }}>
                  <Icon d={Icons.play} size={11} stroke="currentColor" />
                  {showPreview ? "Code" : "Preview"}
                </button>
            )}
            <button onClick={copy}
                    style={{ background: copied ? "rgba(40,200,120,0.15)" : "rgba(255,255,255,0.05)", border: `1px solid ${copied ? "rgba(40,200,120,0.3)" : "rgba(255,255,255,0.1)"}`, borderRadius: 8, color: copied ? "#28c840" : "rgba(255,255,255,0.5)", padding: "5px 12px", cursor: "pointer", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 5, transition: "all 0.2s" }}>
              <Icon d={copied ? Icons.check : Icons.copy} size={11} stroke="currentColor" />
              {copied ? "Copié !" : "Copier"}
            </button>
          </div>
        </div>

        {/* Code or Preview */}
        {showPreview && isPreviewable ? (
            <div style={{ position: "relative" }}>
              <iframe
                  srcDoc={buildPreviewDoc()}
                  style={{ width: "100%", height: 340, border: "none", background: "white", display: "block" }}
                  sandbox="allow-scripts"
                  title="code preview"
              />
            </div>
        ) : (
            <div style={{ overflowX: "auto", padding: "18px 0" }}>
          <pre style={{ margin: 0, padding: "0 20px", fontSize: 13, lineHeight: 1.7, fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace", color: "#c9d1d9" }}
               dangerouslySetInnerHTML={{ __html: highlight(code) }} />
            </div>
        )}

        {/* Footer: lines count */}
        <div style={{ padding: "6px 16px", background: "#161b22", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "flex-end" }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: "monospace" }}>{code.split("\n").length} lignes</span>
        </div>
      </div>
  );
}

// ─────────────────────────────────────────────
// IMAGE CARD
// ─────────────────────────────────────────────
function ImageCard({ url, label, isAI }: { url: string; label?: string; isAI: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error) return null;

  return (
      <a href={url} target="_blank" rel="noreferrer"
         style={{ display: "block", margin: "10px 0", maxWidth: 380, textDecoration: "none" }}>
        <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${isAI ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.12)"}`, background: isAI ? "#F1F1F1" : "rgba(255,255,255,0.05)", transition: "transform 0.2s, box-shadow 0.2s" }}
             onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1.01)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 32px rgba(0,0,0,0.15)"; }}
             onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
          {!loaded && (
              <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", background: isAI ? "#F8F8F8" : "rgba(255,255,255,0.05)" }}>
                <Icon d={Icons.image} size={28} stroke={isAI ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)"} />
              </div>
          )}
          <img src={url} alt={label || "image"}
               style={{ width: "100%", display: loaded ? "block" : "none", maxHeight: 280, objectFit: "cover" }}
               onLoad={() => setLoaded(true)}
               onError={() => setError(true)} />
          {label && label !== url && (
              <div style={{ padding: "8px 12px", background: isAI ? "rgba(0,0,0,0.03)" : "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", gap: 6 }}>
                <Icon d={Icons.image} size={11} stroke={isAI ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.4)"} />
                <span style={{ fontSize: 11, fontWeight: 600, color: isAI ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)", fontStyle: "italic" }}>{label}</span>
              </div>
          )}
        </div>
      </a>
  );
}

// ─────────────────────────────────────────────
// VIDEO CARD
// ─────────────────────────────────────────────
function VideoCard({ url, label, isAI }: { url: string; label?: string; isAI: boolean }) {
  return (
      <div style={{ margin: "10px 0", maxWidth: 420, borderRadius: 16, overflow: "hidden", border: `1px solid ${isAI ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.12)"}` }}>
        <div style={{ background: isAI ? "#0d1117" : "rgba(0,0,0,0.4)", padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
          <Icon d={Icons.video} size={13} stroke="rgba(255,255,255,0.5)" />
          <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>{label && label !== url ? label : "video"}</span>
        </div>
        <video controls style={{ width: "100%", display: "block", background: "#000", maxHeight: 260 }}>
          <source src={url} />
          Votre navigateur ne supporte pas la vidéo.
        </video>
      </div>
  );
}

// ─────────────────────────────────────────────
// LINK CARD
// ─────────────────────────────────────────────
function LinkCard({ url, label, isAI }: { url: string; label?: string; isAI: boolean }) {
  let domain = url;
  let pathname = "";
  try {
    const u = new URL(url);
    domain = u.hostname.replace("www.", "");
    pathname = u.pathname.length > 1 ? u.pathname : "";
  } catch { /* keep */ }

  const displayLabel = label && label !== url ? label : domain;

  if (isAI) {
    return (
        <a href={url} target="_blank" rel="noreferrer"
           style={{ display: "inline-flex", alignItems: "center", gap: 8, verticalAlign: "middle", margin: "1px 3px", textDecoration: "none",
             background: "linear-gradient(135deg, #F8F8F8 0%, #F1F0ED 100%)",
             border: "1px solid rgba(0,0,0,0.1)", borderRadius: 10, padding: "5px 12px",
             boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
             transition: "all 0.15s", color: "#0A0A0A",
           }}
           onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "linear-gradient(135deg, #F0F0F0 0%, #E8E6E2 100%)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 3px 10px rgba(0,0,0,0.1)"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)"; }}
           onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "linear-gradient(135deg, #F8F8F8 0%, #F1F0ED 100%)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"; (e.currentTarget as HTMLAnchorElement).style.transform = "none"; }}>
          <div style={{ width: 18, height: 18, borderRadius: 5, background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon d={Icons.globe} size={10} stroke="white" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
            <span style={{ fontSize: 12, fontWeight: 700, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayLabel}</span>
            {pathname && <span style={{ fontSize: 9, color: "rgba(0,0,0,0.35)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{domain}{pathname}</span>}
          </div>
          <Icon d={Icons.externalLink} size={10} stroke="rgba(0,0,0,0.3)" />
        </a>
    );
  }

  return (
      <a href={url} target="_blank" rel="noreferrer"
         style={{ display: "inline-flex", alignItems: "center", gap: 8, verticalAlign: "middle", margin: "1px 3px", textDecoration: "none",
           background: "rgba(255,255,255,0.1)",
           border: "1px solid rgba(255,255,255,0.18)", borderRadius: 10, padding: "5px 12px",
           transition: "all 0.15s", color: "white",
           backdropFilter: "blur(4px)",
         }}
         onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.18)"; }}
         onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.1)"; }}>
        <div style={{ width: 18, height: 18, borderRadius: 5, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d={Icons.globe} size={10} stroke="white" />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayLabel}</span>
        <Icon d={Icons.externalLink} size={10} stroke="rgba(255,255,255,0.4)" />
      </a>
  );
}

// ─────────────────────────────────────────────
// RICH MESSAGE RENDERER — FULL MARKDOWN + CODE + MEDIA
// ─────────────────────────────────────────────
function RichMessage({ content, isAI }: { content: string; isAI: boolean }) {
  const nodes: React.ReactNode[] = [];
  let key = 0;

  // ── 1. Extract code blocks first ──
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;
  const segments: { type: "code"; lang: string; code: string; index: number; end: number }[] = [];
  let m;
  while ((m = codeBlockRegex.exec(content)) !== null) {
    segments.push({ type: "code", lang: m[1] || "code", code: m[2].trim(), index: m.index, end: m.index + m[0].length });
  }

  // ── 2. Split content by code blocks ──
  let lastEnd = 0;
  for (const seg of segments) {
    if (seg.index > lastEnd) {
      nodes.push(<InlineMarkdown key={key++} text={content.slice(lastEnd, seg.index)} isAI={isAI} />);
    }
    nodes.push(<CodeBlock key={key++} code={seg.code} language={seg.lang} />);
    lastEnd = seg.end;
  }
  if (lastEnd < content.length) {
    nodes.push(<InlineMarkdown key={key++} text={content.slice(lastEnd)} isAI={isAI} />);
  }

  return <>{nodes}</>;
}

// ─────────────────────────────────────────────
// INLINE MARKDOWN — bold, italic, lists, links, images
// ─────────────────────────────────────────────
function InlineMarkdown({ text, isAI }: { text: string; isAI: boolean }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // H3
    if (line.startsWith("### ")) {
      elements.push(<h3 key={key++} style={{ fontSize: 13, fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase", margin: "16px 0 8px", color: isAI ? "#0A0A0A" : "white", opacity: 0.9 }}>{line.slice(4)}</h3>);
      i++; continue;
    }
    // H2
    if (line.startsWith("## ")) {
      elements.push(<h2 key={key++} style={{ fontSize: 15, fontWeight: 900, letterSpacing: "-0.02em", margin: "20px 0 10px", color: isAI ? "#0A0A0A" : "white" }}>{line.slice(3)}</h2>);
      i++; continue;
    }
    // H1
    if (line.startsWith("# ")) {
      elements.push(<h1 key={key++} style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.03em", margin: "20px 0 12px", color: isAI ? "#0A0A0A" : "white" }}>{line.slice(2)}</h1>);
      i++; continue;
    }
    // HR
    if (line.trim() === "---" || line.trim() === "***") {
      elements.push(<hr key={key++} style={{ border: "none", borderTop: isAI ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.12)", margin: "12px 0" }} />);
      i++; continue;
    }
    // Bullet list
    if (line.match(/^(\s*[-*+]\s)/)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].match(/^(\s*[-*+]\s)/)) {
        listItems.push(lines[i].replace(/^\s*[-*+]\s/, ""));
        i++;
      }
      elements.push(
          <ul key={key++} style={{ margin: "8px 0", paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
            {listItems.map((item, idx) => (
                <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: isAI ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.5)", marginTop: 7, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, lineHeight: 1.6, color: isAI ? "rgba(0,0,0,0.75)" : "rgba(255,255,255,0.85)" }}>
                <InlineSpan text={item} isAI={isAI} />
              </span>
                </li>
            ))}
          </ul>
      );
      continue;
    }
    // Numbered list
    if (line.match(/^\d+\.\s/)) {
      const listItems: string[] = [];
      let num = 1;
      while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
        listItems.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
          <ol key={key++} style={{ margin: "8px 0", paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
            {listItems.map((item, idx) => (
                <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ width: 20, height: 20, borderRadius: 6, background: isAI ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: isAI ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.6)", flexShrink: 0, marginTop: 2 }}>{num++}</span>
                  <span style={{ fontSize: 14, lineHeight: 1.6, color: isAI ? "rgba(0,0,0,0.75)" : "rgba(255,255,255,0.85)" }}>
                <InlineSpan text={item} isAI={isAI} />
              </span>
                </li>
            ))}
          </ol>
      );
      continue;
    }
    // Blockquote
    if (line.startsWith("> ")) {
      elements.push(
          <div key={key++} style={{ borderLeft: isAI ? "3px solid rgba(0,0,0,0.15)" : "3px solid rgba(255,255,255,0.25)", paddingLeft: 14, margin: "8px 0", color: isAI ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.6)", fontStyle: "italic", fontSize: 13 }}>
            <InlineSpan text={line.slice(2)} isAI={isAI} />
          </div>
      );
      i++; continue;
    }
    // Empty line
    if (line.trim() === "") {
      elements.push(<div key={key++} style={{ height: 6 }} />);
      i++; continue;
    }
    // Normal paragraph
    elements.push(
        <p key={key++} style={{ margin: "2px 0", fontSize: 14, lineHeight: 1.7, color: isAI ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.9)" }}>
          <InlineSpan text={line} isAI={isAI} />
        </p>
    );
    i++;
  }

  return <>{elements}</>;
}

// ─────────────────────────────────────────────
// INLINE SPAN — bold, italic, code, links, images
// ─────────────────────────────────────────────
function InlineSpan({ text, isAI }: { text: string; isAI: boolean }): React.ReactElement {
  // Pattern: matches **bold**, *italic*, `code`, [label](url), bare URLs, ![img](url)
  const tokenRegex = /(\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`|!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<>")\]]+))/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let m;
  let k = 0;

  while ((m = tokenRegex.exec(text)) !== null) {
    if (m.index > lastIndex) {
      parts.push(<span key={k++}>{text.slice(lastIndex, m.index)}</span>);
    }

    const full = m[0];

    // **bold**
    if (full.startsWith("**")) {
      parts.push(<strong key={k++} style={{ fontWeight: 800, color: isAI ? "#0A0A0A" : "white" }}>{m[2]}</strong>);
    }
    // *italic*
    else if (full.startsWith("*")) {
      parts.push(<em key={k++} style={{ fontStyle: "italic", opacity: 0.85 }}>{m[3]}</em>);
    }
    // `inline code`
    else if (full.startsWith("`")) {
      parts.push(
          <code key={k++} style={{ background: isAI ? "#1a1a2e" : "rgba(0,0,0,0.4)", color: isAI ? "#a8ff78" : "#a8ff78", borderRadius: 5, padding: "1px 7px", fontSize: 12, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", border: isAI ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(255,255,255,0.08)" }}>
            {m[4]}
          </code>
      );
    }
    // ![img](url)
    else if (full.startsWith("![")) {
      parts.push(<ImageCard key={k++} url={m[6]} label={m[5]} isAI={isAI} />);
    }
    // [label](url)
    else if (full.startsWith("[")) {
      const url = m[8];
      const label = m[7];
      const isImage = /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url);
      const isVideo = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
      if (isImage) parts.push(<ImageCard key={k++} url={url} label={label} isAI={isAI} />);
      else if (isVideo) parts.push(<VideoCard key={k++} url={url} label={label} isAI={isAI} />);
      else parts.push(<LinkCard key={k++} url={url} label={label} isAI={isAI} />);
    }
    // bare URL
    else {
      const url = m[9];
      const isImage = /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url);
      const isVideo = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
      if (isImage) parts.push(<ImageCard key={k++} url={url} isAI={isAI} />);
      else if (isVideo) parts.push(<VideoCard key={k++} url={url} isAI={isAI} />);
      else parts.push(<LinkCard key={k++} url={url} isAI={isAI} />);
    }

    lastIndex = m.index + full.length;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={k++}>{text.slice(lastIndex)}</span>);
  }

  return <>{parts}</>;
}

// ─────────────────────────────────────────────
// HOOK: useData
// ─────────────────────────────────────────────
function useData() {
  const [data, setData] = useState<AppData>(DEMO_DATA);
  const [loading, setLoading] = useState(false);
  const [useSupabase, setUseSupabase] = useState(false);

  const storeChatHistory = useAdminStore((state) => state.chatHistory);
  const setStoreChatHistory = useAdminStore((state) => state.setChatHistory);
  const addStoreChatMessage = useAdminStore((state) => state.addChatMessage);
  const clearStoreChat = useAdminStore((state) => state.clearChat);

  const isConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL !== "https://TON_PROJECT.supabase.co" && SUPABASE_URL.length > 0);

  const refresh = useCallback(async () => {
    if (!isConfigured) return;
    setLoading(true);
    try {
      const [projects, tasks, messages, appointments, knowledgeBase] = await Promise.all([
        db.get<Project>("projects"),
        db.get<Task>("tasks"),
        db.get<Message>("messages"),
        db.get<Appointment>("appointments"),
        db.get<KnowledgeEntry>("knowledge_base").catch(() => DEMO_DATA.knowledgeBase),
      ]);
      setData({ projects, tasks, messages, appointments, knowledgeBase });
      setUseSupabase(true);
    } catch (e) {
      console.warn("Supabase non disponible, mode démo:", (e as Error).message);
      setUseSupabase(false);
    } finally {
      setLoading(false);
    }
  }, [isConfigured]);

  useEffect(() => {
    refresh().catch(console.error);
  }, [refresh]);

  const addProject = useCallback(async (project: Partial<Project>) => {
    const newProject = { ...project, id: project.id || `p-${Date.now()}` };
    if (useSupabase) {
      const res = await db.insert<Project>("projects", newProject);
      setData(d => ({ ...d, projects: [res[0], ...d.projects] }));
    } else {
      setData(d => ({ ...d, projects: [newProject as Project, ...d.projects] }));
    }
  }, [useSupabase]);

  const updateProject = useCallback(async (id: string, updates: Partial<Project>) => {
    if (useSupabase) await db.update<Project>("projects", id, updates);
    setData(d => ({ ...d, projects: d.projects.map(p => p.id === id ? { ...p, ...updates } : p) }));
  }, [useSupabase]);

  const deleteProject = useCallback(async (id: string) => {
    if (useSupabase) await db.delete("projects", id);
    setData(d => ({ ...d, projects: d.projects.filter(p => p.id !== id) }));
  }, [useSupabase]);

  const addTask = useCallback(async (taskData: Partial<Task>) => {
    try {
      const taskToSend = {
        ...taskData,
        id: taskData.id || `t-${Date.now()}`,
        status: taskData.status || "backlog",
        created_at: new Date().toISOString()
      };
      if (useSupabase) {
        const res = await db.insert<Task>("tasks", taskToSend);
        setData(prev => ({ ...prev, tasks: [...prev.tasks, res[0]] }));
      } else {
        setData(prev => ({ ...prev, tasks: [...prev.tasks, taskToSend as Task] }));
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      throw error;
    }
  }, [useSupabase]);

  const moveTask = useCallback(async (id: string, kanban_column: string) => {
    if (useSupabase) await db.update<Task>("tasks", id, { kanban_column });
    setData(d => ({ ...d, tasks: d.tasks.map(t => t.id === id ? { ...t, kanban_column } : t) }));
  }, [useSupabase]);

  const deleteTask = useCallback(async (id: string) => {
    if (useSupabase) await db.delete("tasks", id);
    setData(d => ({ ...d, tasks: d.tasks.filter(t => t.id !== id) }));
  }, [useSupabase]);

  const addMessage = useCallback(async (msg: Partial<Message>) => {
    const full = { ...msg, id: msg.id || `m-${Date.now()}`, created_at: new Date().toISOString(), time: "À l'instant", is_read: false };
    if (useSupabase) {
      const res = await db.insert<Message>("messages", full);
      setData(d => ({ ...d, messages: [res[0], ...d.messages] }));
    } else {
      setData(d => ({ ...d, messages: [full as Message, ...d.messages] }));
    }
  }, [useSupabase]);

  const markRead = useCallback(async (id: string) => {
    if (useSupabase) await db.update<Message>("messages", id, { is_read: true });
    setData(d => ({ ...d, messages: d.messages.map(m => m.id === id ? { ...m, is_read: true } : m) }));
  }, [useSupabase]);

  const deleteMessage = useCallback(async (id: string) => {
    if (useSupabase) await db.delete("messages", id);
    setData(d => ({ ...d, messages: d.messages.filter(m => m.id !== id) }));
  }, [useSupabase]);

  const addAppointment = useCallback(async (appt: Partial<Appointment>) => {
    const full = { ...appt, id: appt.id || `a-${Date.now()}`, created_at: new Date().toISOString(), status: appt.status || "pending" };
    if (useSupabase) {
      const res = await db.insert<Appointment>("appointments", full);
      setData(d => ({ ...d, appointments: [...d.appointments, res[0]] }));
    } else {
      setData(d => ({ ...d, appointments: [...d.appointments, full as Appointment] }));
    }
  }, [useSupabase]);

  const updateAppointment = useCallback(async (id: string, updates: Partial<Appointment>) => {
    if (useSupabase) await db.update<Appointment>("appointments", id, updates);
    setData(d => ({ ...d, appointments: d.appointments.map(a => a.id === id ? { ...a, ...updates } : a) }));
  }, [useSupabase]);

  const deleteAppointment = useCallback(async (id: string) => {
    if (useSupabase) await db.delete("appointments", id);
    setData(d => ({ ...d, appointments: d.appointments.filter(a => a.id !== id) }));
  }, [useSupabase]);

  const addKnowledgeEntry = useCallback(async (entry: Partial<KnowledgeEntry>) => {
    const full = {
      ...entry,
      id: entry.id || `k-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      severity: entry.severity || "medium",
      tags: entry.tags || []
    };
    if (useSupabase) {
      const res = await db.insert<KnowledgeEntry>("knowledge_base", full);
      setData(d => ({ ...d, knowledgeBase: [res[0], ...d.knowledgeBase] }));
    } else {
      setData(d => ({ ...d, knowledgeBase: [full as KnowledgeEntry, ...d.knowledgeBase] }));
    }
  }, [useSupabase]);

  const updateKnowledgeEntry = useCallback(async (id: string, updates: Partial<KnowledgeEntry>) => {
    const withTimestamp = { ...updates, updated_at: new Date().toISOString() };
    if (useSupabase) await db.update<KnowledgeEntry>("knowledge_base", id, withTimestamp);
    setData(d => ({ ...d, knowledgeBase: d.knowledgeBase.map(k => k.id === id ? { ...k, ...withTimestamp } : k) }));
  }, [useSupabase]);

  const deleteKnowledgeEntry = useCallback(async (id: string) => {
    if (useSupabase) await db.delete("knowledge_base", id);
    setData(d => ({ ...d, knowledgeBase: d.knowledgeBase.filter(k => k.id !== id) }));
  }, [useSupabase]);

  return {
    data, loading, useSupabase, refresh,
    chatHistory: storeChatHistory,
    setChatHistory: setStoreChatHistory,
    addChatMessage: addStoreChatMessage,
    clearChat: clearStoreChat,
    addProject, updateProject, deleteProject,
    addTask, moveTask, deleteTask,
    addMessage, markRead, deleteMessage,
    addAppointment, updateAppointment, deleteAppointment,
    addKnowledgeEntry, updateKnowledgeEntry, deleteKnowledgeEntry,
  };
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function AlhambraOS() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const store = useData();
  const { data, loading, useSupabase, refresh } = store;

  useEffect(() => { setMounted(true); }, []);

  const unreadCount = data.messages.filter(m => !m.is_read).length;
  const todayAppts = (data.appointments || []).filter(a => a.date === new Date().toISOString().split("T")[0]).length;

  const MENU = [
    { id: "dashboard", label: "Dashboard", icon: Icons.dashboard },
    { id: "projects", label: "Projets", icon: Icons.projects },
    { id: "kanban", label: "Agile Board", icon: Icons.kanban },
    { id: "appointments", label: "Rendez-vous", icon: Icons.calendar, badge: todayAppts },
    { id: "ai", label: "Nexus AI", icon: Icons.ai },
    { id: "messages", label: "Messages", icon: Icons.messages, badge: unreadCount },
  ];

  return (
      <div style={{ display: "flex", height: "100vh", background: "#F0EEE9", fontFamily: "'Helvetica Neue', Arial, sans-serif", overflow: "hidden" }}>
        {/* SIDEBAR */}
        <aside style={{
          width: sidebarOpen ? 280 : 72, minWidth: sidebarOpen ? 280 : 72,
          background: "#0A0A0A", display: "flex", flexDirection: "column",
          padding: sidebarOpen ? "2rem 1.5rem" : "2rem 0.75rem",
          transition: "all 0.4s cubic-bezier(0.76,0,0.24,1)", overflow: "hidden",
          borderRight: "1px solid rgba(255,255,255,0.05)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 40, cursor: "pointer" }} onClick={() => setSidebarOpen(v => !v)}>
            <div style={{ width: 40, height: 40, background: "white", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transform: "rotate(3deg)" }}>
              <span style={{ fontWeight: 900, fontSize: 20, fontStyle: "italic", color: "#0A0A0A" }}>A</span>
            </div>
            {sidebarOpen && (
                <div>
                  <div style={{ color: "white", fontWeight: 900, fontSize: 16, letterSpacing: "-0.03em", textTransform: "uppercase" }}>Alhambra</div>
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" }}>OS v3.0</div>
                </div>
            )}
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
            {MENU.map(item => (
                <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: sidebarOpen ? "13px 18px" : "13px 0", justifyContent: sidebarOpen ? "flex-start" : "center",
                  borderRadius: 14, border: "none", cursor: "pointer", transition: "all 0.3s",
                  background: activeTab === item.id ? "white" : "transparent",
                  color: activeTab === item.id ? "#0A0A0A" : "rgba(255,255,255,0.4)",
                  width: "100%", position: "relative"
                }}>
                  <Icon d={item.icon} size={17} strokeWidth={activeTab === item.id ? 2.2 : 1.8} />
                  {sidebarOpen && <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>{item.label}</span>}
                  {item.badge !== undefined && item.badge > 0 && (
                      <span style={{ position: "absolute", top: 6, right: sidebarOpen ? 14 : 6, background: "#EF4444", color: "white", borderRadius: 99, fontSize: 9, fontWeight: 900, padding: "2px 6px", minWidth: 16, textAlign: "center" }}>{item.badge}</span>
                  )}
                </button>
            ))}
          </nav>

          {sidebarOpen && (
              <div style={{ marginTop: 16 }}>
                <button onClick={() => { refresh().catch(console.error); }} style={{ width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "rgba(255,255,255,0.5)", padding: "10px", cursor: "pointer", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <Icon d={Icons.refresh} size={12} stroke="rgba(255,255,255,0.5)" /> Actualiser
                </button>
              </div>
          )}

          {sidebarOpen && (
              <div style={{ marginTop: 12, background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ width: 6, height: 6, background: useSupabase ? "#10B981" : "#F59E0B", borderRadius: "50%", display: "inline-block" }} />
                  <span style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.5)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                {useSupabase ? "Supabase Connecté" : "Mode Démo"}
              </span>
                </div>
                <p style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
                  {loading ? "Chargement..." : "Nexus AI · Claude Sonnet 4"}
                </p>
              </div>
          )}
        </aside>

        {/* MAIN */}
        <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "2rem 3rem 1.5rem", background: "#F0EEE9", flexShrink: 0 }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(0,0,0,0.25)", letterSpacing: "0.5em", textTransform: "uppercase", marginBottom: 4 }}>
              Alhambra OS v3.0{mounted ? ` — ${new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}` : ""}
            </div>
            <h1 style={{ fontSize: "min(6vw, 56px)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: 0.85, color: "#0A0A0A", margin: 0 }}>
              {activeTab === "dashboard" ? "Tableau de bord" : activeTab === "projects" ? "Projets" : activeTab === "kanban" ? "Agile Board" : activeTab === "appointments" ? "Rendez-vous" : activeTab === "ai" ? "Nexus AI" : "Messages"}.
            </h1>
          </div>

          <div style={{ flex: 1, overflow: "auto", padding: "0.5rem 3rem 3rem" }}>
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}>
                {activeTab === "dashboard" && <Dashboard data={data} setActiveTab={setActiveTab} />}
                {activeTab === "projects" && <Projects data={data} store={store} />}
                {activeTab === "kanban" && <Kanban data={data} store={store} />}
                {activeTab === "appointments" && <Appointments data={data} store={store} />}
                {activeTab === "ai" && <AiNexus data={data} chatHistory={store.chatHistory} setChatHistory={store.setChatHistory} addChatMessage={store.addChatMessage} store={store} />}
                {activeTab === "messages" && <Messages data={data} store={store} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <style>{`
        @keyframes ping { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        ::-webkit-scrollbar{width:4px;height:4px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.15);border-radius:99px}
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        input, select, textarea { font-family: inherit; }
      `}</style>
      </div>
  );
}

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────
function Dashboard({ data, setActiveTab }: { data: AppData; setActiveTab: (tab: string) => void }) {
  const appointments = data.appointments || [];
  const liveCount = data.projects.filter(p => p.status === "LIVE").length;
  const avgSeo = Math.round(data.projects.reduce((a, b) => a + b.metrics.seo, 0) / (data.projects.length || 1));
  const doneTasks = data.tasks.filter(t => t.kanban_column === "done").length;
  const upcomingAppts = appointments.filter(a => a.date >= new Date().toISOString().split("T")[0] && a.status !== "cancelled").length;

  const stats = [
    { label: "Projets Live", value: liveCount, sub: `sur ${data.projects.length} total`, color: "#10B981", tab: "projects" },
    { label: "SEO Moyen", value: `${avgSeo}%`, sub: "tous projets", color: "#3B82F6", tab: "projects" },
    { label: "Tâches Done", value: doneTasks, sub: `sur ${data.tasks.length} total`, color: "#8B5CF6", tab: "kanban" },
    { label: "Rendez-vous", value: upcomingAppts, sub: "à venir", color: "#F59E0B", tab: "appointments" },
  ];

  return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                          onClick={() => setActiveTab(s.tab)}
                          style={{ background: "white", borderRadius: 24, padding: "28px 24px", border: "1px solid rgba(0,0,0,0.05)", cursor: "pointer", transition: "transform 0.2s" }}
                          onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
                          onMouseLeave={e => (e.currentTarget.style.transform = "none")}
              >
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, marginBottom: 16 }} />
                <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(0,0,0,0.4)", marginTop: 8 }}>{s.label}</div>
                <div style={{ fontSize: 10, color: "rgba(0,0,0,0.25)", marginTop: 4 }}>{s.sub}</div>
              </motion.div>
          ))}
        </div>

        <div style={{ background: "white", borderRadius: 32, padding: 32, border: "1px solid rgba(0,0,0,0.05)" }}>
          <h3 style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(0,0,0,0.4)", marginBottom: 24 }}>Performance Projets</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {data.projects.map((p, i) => (
                <div key={p.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <StatusBadge status={p.status} />
                      <span style={{ fontWeight: 800, fontSize: 13 }}>{p.name}</span>
                      <span style={{ fontSize: 11, color: "rgba(0,0,0,0.3)" }}>{p.category}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(0,0,0,0.5)" }}>SEO {p.metrics.seo}% · Perf {p.metrics.performance}%</span>
                  </div>
                  <div style={{ height: 6, background: "#F1F1F1", borderRadius: 99, overflow: "hidden" }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${p.metrics.seo}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                                style={{ height: "100%", background: "#0A0A0A", borderRadius: 99 }} />
                  </div>
                </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ background: "white", borderRadius: 32, padding: 28, border: "1px solid rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(0,0,0,0.4)", marginBottom: 20 }}>Prochains RDV</h3>
            {appointments.filter(a => a.status !== "cancelled").slice(0, 4).map(a => {
              const sc = APPT_STATUS_COLORS[a.status] || APPT_STATUS_COLORS.pending;
              return (
                  <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                    <span style={{ background: sc.bg, color: sc.text, borderRadius: 99, fontSize: 8, fontWeight: 900, padding: "3px 8px", textTransform: "uppercase" }}>{a.status}</span>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{a.client_name}</span>
                      <span style={{ fontSize: 10, color: "rgba(0,0,0,0.4)", marginLeft: 8 }}>{a.service}</span>
                    </div>
                      <span
                          suppressHydrationWarning
                          style={{ fontSize: 10, fontWeight: 700, color: "rgba(0,0,0,0.4)" }}
                      >
                        {a.date} {a.time}
                      </span>
                  </div>
              );
            })}
            {appointments.length === 0 && <p style={{ fontSize: 13, color: "rgba(0,0,0,0.3)", fontWeight: 600 }}>Aucun rendez-vous</p>}
          </div>

          <div style={{ background: "#0A0A0A", borderRadius: 32, padding: 28, color: "white" }}>
            <h3 style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>Liens Rapides</h3>
            {data.projects.filter(p => p.links?.live).map(p => (
                <a key={p.id} href={p.links.live} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", color: "white", textDecoration: "none" }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{p.name}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{p.links.live?.replace("https://", "")}</span>
                    <Icon d={Icons.link} size={14} stroke="rgba(255,255,255,0.4)" />
                  </div>
                </a>
            ))}
          </div>
        </div>
      </div>
  );
}

// ─────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────
function Projects({ data, store }: { data: AppData; store: ReturnType<typeof useData> }) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", client: "", category: "", year: new Date().getFullYear().toString(), status: "BETA", description: "", liveLink: "", docsLink: "", seo: 90, performance: 90, accessibility: 90 });

  const openNew = () => {
    setForm({ name: "", client: "", category: "", year: new Date().getFullYear().toString(), status: "BETA", description: "", liveLink: "", docsLink: "", seo: 90, performance: 90, accessibility: 90 });
    setEditId(null); setShowForm(true);
  };

  const openEdit = (p: Project) => {
    setForm({ name: p.name, client: p.client, category: p.category, year: p.year, status: p.status, description: p.description, liveLink: p.links?.live || "", docsLink: p.links?.docs || "", seo: p.metrics.seo, performance: p.metrics.performance, accessibility: p.metrics.accessibility });
    setEditId(p.id); setShowForm(true);
  };

  const save = async () => {
    if (!form.name.trim()) return;
    const project = {
      name: form.name.trim(), client: form.client.trim(), category: form.category.trim(),
      year: form.year, status: form.status, description: form.description.trim(),
      links: { live: form.liveLink || undefined, docs: form.docsLink || undefined },
      metrics: { seo: Number(form.seo), performance: Number(form.performance), accessibility: Number(form.accessibility) },
      notes: [],
    };
    if (editId) {
      await store.updateProject(editId, project);
    } else {
      await store.addProject({ ...project, id: `p-${Date.now()}` });
    }
    setShowForm(false);
  };

  const del = async (id: string) => {
    if (window.confirm("Supprimer ce projet ?")) await store.deleteProject(id);
  };

  const inputStyle = { width: "100%", background: "#F8F8F8", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 14, fontWeight: 600, outline: "none" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(0,0,0,0.4)", marginBottom: 8 };

  return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <p style={{ color: "rgba(0,0,0,0.4)", fontSize: 13, fontWeight: 600 }}>{data.projects.length} projets · {data.projects.filter(p => p.status === "LIVE").length} en ligne</p>
          <button onClick={openNew} style={{ background: "#0A0A0A", color: "white", border: "none", borderRadius: 99, padding: "12px 24px", fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon d={Icons.plus} size={14} stroke="white" /> Nouveau Projet
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
          <AnimatePresence>
            {data.projects.map((p, i) => (
                <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }}
                            style={{ background: "white", borderRadius: 32, padding: 32, border: "1px solid rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                    <StatusBadge status={p.status} />
                    <span style={{ fontSize: 9, fontWeight: 800, color: "rgba(0,0,0,0.3)", letterSpacing: "0.15em", textTransform: "uppercase" }}>{p.year}</span>
                  </div>
                  <h3 style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.03em", textTransform: "uppercase", fontStyle: "italic", margin: "0 0 6px" }}>{p.name}</h3>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(0,0,0,0.3)", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 12px" }}>{p.category}</p>
                  <p style={{ fontSize: 13, color: "rgba(0,0,0,0.55)", lineHeight: 1.6, margin: "0 0 20px", minHeight: 40 }}>{p.description}</p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
                    {[["SEO", p.metrics.seo], ["Perf", p.metrics.performance], ["A11y", p.metrics.accessibility]].map(([label, val]) => (
                        <div key={label as string}>
                          <div style={{ background: "#F8F8F8", borderRadius: 12, padding: "10px 12px", textAlign: "center" }}>
                            <div style={{ fontSize: 18, fontWeight: 900 }}>{val as number}<span style={{ fontSize: 11 }}>%</span></div>
                            <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(0,0,0,0.35)", textTransform: "uppercase" }}>{label as string}</div>
                          </div>
                        </div>
                    ))}
                  </div>

                  {(p.links?.live || p.links?.docs) && (
                      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                        {p.links?.live && (
                            <a href={p.links.live} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, background: "#0A0A0A", color: "white", borderRadius: 10, padding: "8px 14px", fontSize: 10, fontWeight: 700, textDecoration: "none" }}>
                              <Icon d={Icons.globe} size={12} stroke="white" /> Live
                            </a>
                        )}
                      </div>
                  )}

                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => openEdit(p)} style={{ flex: 1, background: "#F1F1F1", border: "none", borderRadius: 12, padding: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 11, fontWeight: 700 }}>
                      <Icon d={Icons.edit} size={13} /> Éditer
                    </button>
                    <button onClick={() => del(p.id)} style={{ width: 40, height: 40, background: "#FEE2E2", border: "none", borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon d={Icons.trash} size={14} stroke="#991B1B" />
                    </button>
                  </div>
                </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {showForm && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                          style={{ background: "white", borderRadius: 32, padding: 40, width: "min(640px, 95vw)", maxHeight: "90vh", overflow: "auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                  <h2 style={{ fontWeight: 900, fontSize: 22, letterSpacing: "-0.03em", textTransform: "uppercase", fontStyle: "italic", margin: 0 }}>
                    {editId ? "Éditer" : "Nouveau"} Projet
                  </h2>
                  <button onClick={() => setShowForm(false)} style={{ background: "#F1F1F1", border: "none", borderRadius: 10, padding: "8px", cursor: "pointer" }}>
                    <Icon d={Icons.x} size={16} />
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {([["Nom *", "name"], ["Client", "client"], ["Catégorie", "category"], ["Année", "year"]] as const).map(([label, key]) => (
                      <div key={key}>
                        <label style={labelStyle}>{label}</label>
                        <input value={form[key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={inputStyle} />
                      </div>
                  ))}
                  <div>
                    <label style={labelStyle}>Statut</label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={inputStyle}>
                      {["BETA", "LIVE", "MAINTENANCE", "ARCHIVED"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <label style={labelStyle}>Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
                  {([["Lien Live", "liveLink"], ["Lien Docs", "docsLink"]] as const).map(([label, key]) => (
                      <div key={key}>
                        <label style={labelStyle}>{label}</label>
                        <input type="url" value={form[key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder="https://" style={inputStyle} />
                      </div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 16 }}>
                  {([["SEO", "seo"], ["Performance", "performance"], ["Accessibilité", "accessibility"]] as const).map(([label, key]) => (
                      <div key={key}>
                        <label style={labelStyle}>{label} — {form[key as keyof typeof form]}%</label>
                        <input type="range" min="0" max="100" value={form[key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={{ width: "100%" }} />
                      </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
                  <button onClick={save} style={{ flex: 1, background: "#0A0A0A", color: "white", border: "none", borderRadius: 14, padding: "16px", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", cursor: "pointer" }}>
                    {editId ? "Mettre à jour" : "Créer"}
                  </button>
                  <button onClick={() => setShowForm(false)} style={{ background: "#F1F1F1", border: "none", borderRadius: 14, padding: "16px 24px", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>Annuler</button>
                </div>
              </motion.div>
            </div>
        )}
      </div>
  );
}

// ─────────────────────────────────────────────
// KANBAN
// ─────────────────────────────────────────────
const COLUMNS = [
  { id: "backlog", label: "Backlog", color: "#6B7280" },
  { id: "inprogress", label: "En cours", color: "#3B82F6" },
  { id: "review", label: "En review", color: "#F59E0B" },
  { id: "done", label: "Terminé", color: "#10B981" },
];

function Kanban({ data, store }: { data: AppData; store: ReturnType<typeof useData> }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", project_id: "", priority: "MEDIUM", kanban_column: "backlog" });
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const addTask = async () => {
    if (!form.title.trim()) return;
    try {
      await store.addTask({ title: form.title, project_id: form.project_id, priority: form.priority, kanban_column: form.kanban_column, status: "backlog" });
      setShowForm(false);
      setForm({ title: "", project_id: "", priority: "MEDIUM", kanban_column: "backlog" });
    } catch (error) {
      console.error("Erreur lors de l'ajout de la tâche:", error);
      alert("Erreur lors de l'ajout de la tâche");
    }
  };

  return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 28 }}>
          <p style={{ color: "rgba(0,0,0,0.4)", fontSize: 13, fontWeight: 600 }}>{data.tasks.length} tâches</p>
          <button onClick={() => { setForm({ title: "", project_id: "", priority: "MEDIUM", kanban_column: "backlog" }); setShowForm(true); }}
                  style={{ background: "#0A0A0A", color: "white", border: "none", borderRadius: 99, padding: "12px 24px", fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon d={Icons.plus} size={14} stroke="white" /> Nouvelle Tâche
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, alignItems: "start" }}>
          {COLUMNS.map(col => {
            const tasks = (data.tasks || []).filter(t => t && t.kanban_column === col.id);
            return (
                <div key={col.id}
                     onDragOver={e => { e.preventDefault(); setDragOver(col.id); }}
                     onDrop={() => { if (dragging) { store.moveTask(dragging, col.id); setDragging(null); setDragOver(null); } }}
                     style={{ background: dragOver === col.id ? "rgba(0,0,0,0.04)" : "#F8F8F6", borderRadius: 24, padding: 16, minHeight: 200, border: `2px dashed ${dragOver === col.id ? col.color : "transparent"}`, transition: "all 0.2s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: col.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(0,0,0,0.5)" }}>{col.label}</span>
                    <span style={{ marginLeft: "auto", background: "rgba(0,0,0,0.08)", borderRadius: 99, fontSize: 9, fontWeight: 800, padding: "2px 8px" }}>{tasks.length}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <AnimatePresence>
                      {tasks.map(task => {
                        const pc = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.MEDIUM;
                        const projectName = data.projects.find(p => p.id === task.project_id)?.name;
                        return (
                            <motion.div key={task.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        draggable onDragStart={() => setDragging(task.id)} onDragEnd={() => { setDragging(null); setDragOver(null); }}
                                        style={{ background: "white", borderRadius: 16, padding: 16, border: "1px solid rgba(0,0,0,0.06)", cursor: "grab", userSelect: "none" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                                <span style={{ background: pc.bg, color: pc.text, borderRadius: 99, fontSize: 8, fontWeight: 900, padding: "3px 8px", textTransform: "uppercase" }}>{task.priority}</span>
                                <button onClick={() => store.deleteTask(task.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(0,0,0,0.2)", padding: 2 }}>
                                  <Icon d={Icons.x} size={12} />
                                </button>
                              </div>
                              <p style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.4, margin: "0 0 8px" }}>{task.title}</p>
                              {projectName && <p style={{ fontSize: 10, color: "rgba(0,0,0,0.35)", fontWeight: 600, margin: 0 }}>{projectName}</p>}
                              <div style={{ display: "flex", gap: 4, marginTop: 10, flexWrap: "wrap" }}>
                                {COLUMNS.filter(c => c.id !== col.id).map(c => (
                                    <button key={c.id} onClick={() => store.moveTask(task.id, c.id)}
                                            style={{ fontSize: 8, fontWeight: 800, padding: "3px 8px", borderRadius: 99, border: `1px solid ${c.color}30`, background: `${c.color}10`, color: c.color, cursor: "pointer", textTransform: "uppercase" }}>
                                      → {c.label.split(" ")[0]}
                                    </button>
                                ))}
                              </div>
                            </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
            );
          })}
        </div>

        {showForm && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                          style={{ background: "white", borderRadius: 28, padding: 36, width: "min(480px, 95vw)" }}>
                <h3 style={{ fontWeight: 900, fontSize: 20, textTransform: "uppercase", fontStyle: "italic", margin: "0 0 28px" }}>Nouvelle Tâche</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(0,0,0,0.4)", marginBottom: 8 }}>Titre *</label>
                    <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                           style={{ width: "100%", background: "#F8F8F8", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 14, fontWeight: 600, outline: "none" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(0,0,0,0.4)", marginBottom: 8 }}>Projet</label>
                    <select value={form.project_id} onChange={e => setForm(f => ({ ...f, project_id: e.target.value }))}
                            style={{ width: "100%", background: "#F8F8F8", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 14, fontWeight: 600, outline: "none", cursor: "pointer" }}>
                      <option value="">-- Sélectionner un projet --</option>
                      {data.projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(0,0,0,0.4)", marginBottom: 8 }}>Priorité</label>
                      <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                              style={{ width: "100%", background: "#F8F8F8", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 14, fontWeight: 600, outline: "none", cursor: "pointer" }}>
                        {["HIGH", "MEDIUM", "LOW"].map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(0,0,0,0.4)", marginBottom: 8 }}>Colonne</label>
                      <select value={form.kanban_column} onChange={e => setForm(f => ({ ...f, kanban_column: e.target.value }))}
                              style={{ width: "100%", background: "#F8F8F8", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 14, fontWeight: 600, outline: "none", cursor: "pointer" }}>
                        {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
                  <button onClick={addTask} style={{ flex: 1, background: "#0A0A0A", color: "white", border: "none", borderRadius: 14, padding: "15px", fontSize: 11, fontWeight: 800, textTransform: "uppercase", cursor: "pointer" }}>Ajouter</button>
                  <button onClick={() => setShowForm(false)} style={{ background: "#F1F1F1", border: "none", borderRadius: 14, padding: "15px 24px", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>Annuler</button>
                </div>
              </motion.div>
            </div>
        )}
      </div>
  );
}

// ─────────────────────────────────────────────
// APPOINTMENTS
// ─────────────────────────────────────────────
const SERVICES = ["Site Web", "App Mobile", "Branding", "Marketing", "Animation", "Design", "Consulting", "Audit SEO"];
const TIME_SLOTS = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];

interface AppointmentForm {
  client_name: string;
  client_email: string;
  client_phone: string;
  date: string;
  time: string;
  service: string;
  notes: string;
  status: string;
}

function Appointments({ data, store }: { data: AppData; store: ReturnType<typeof useData> }) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [form, setForm] = useState<AppointmentForm>({ client_name: "", client_email: "", client_phone: "", date: selectedDate, time: "10:00", service: "Site Web", notes: "", status: "pending" });

  const appointments = data.appointments || [];

  const openNew = () => {
    setForm({ client_name: "", client_email: "", client_phone: "", date: selectedDate, time: "10:00", service: "Site Web", notes: "", status: "pending" });
    setEditId(null); setShowForm(true);
  };

  const openEdit = (a: Appointment) => {
    setForm({ client_name: a.client_name, client_email: a.client_email || "", client_phone: a.client_phone || "", date: a.date, time: a.time, service: a.service, notes: a.notes || "", status: a.status });
    setEditId(a.id); setShowForm(true);
  };

  const save = async () => {
    if (!form.client_name.trim()) return;
    if (editId) { await store.updateAppointment(editId, form); } else { await store.addAppointment(form); }
    setShowForm(false);
  };

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDay = (year: number, month: number) => new Date(year, month, 1).getDay();
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = (getFirstDay(calYear, calMonth) + 6) % 7;
  const MONTH_NAMES = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  const DAY_NAMES = ["L", "M", "M", "J", "V", "S", "D"];

  const getApptForDay = (day: number) => {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return appointments.filter(a => a.date === dateStr && a.status !== "cancelled");
  };

  const filteredByDate = appointments.filter(a => a.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time));
  const upcoming = appointments.filter(a => a.date >= new Date().toISOString().split("T")[0] && a.status !== "cancelled").sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  const inputStyle = { width: "100%", background: "#F8F8F8", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 14, fontWeight: 600, outline: "none" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(0,0,0,0.4)", marginBottom: 8 };

  return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 8 }}>
            {(["list", "calendar"] as const).map((mode) => (
                <button key={mode} onClick={() => setViewMode(mode)}
                        style={{ background: viewMode === mode ? "#0A0A0A" : "#F1F1F1", color: viewMode === mode ? "white" : "#0A0A0A", border: "none", borderRadius: 99, padding: "8px 20px", fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
                  {mode === "list" ? "Liste" : "Calendrier"}
                </button>
            ))}
          </div>
          <button onClick={openNew}
                  style={{ background: "#0A0A0A", color: "white", border: "none", borderRadius: 99, padding: "12px 24px", fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon d={Icons.plus} size={14} stroke="white" /> Nouveau RDV
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {([
            ["Confirmés", appointments.filter(a => a.status === "confirmed").length, "#10B981"],
            ["En attente", appointments.filter(a => a.status === "pending").length, "#F59E0B"],
            ["Aujourd'hui", appointments.filter(a => a.date === new Date().toISOString().split("T")[0]).length, "#3B82F6"],
            ["Total", appointments.length, "#8B5CF6"],
          ] as [string, number, string][]).map(([label, val, color]) => (
              <div key={label} style={{ background: "white", borderRadius: 20, padding: "20px 20px", border: "1px solid rgba(0,0,0,0.05)" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, marginBottom: 12 }} />
                <div style={{ fontSize: 28, fontWeight: 900 }}>{val}</div>
                <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(0,0,0,0.4)", marginTop: 6 }}>{label}</div>
              </div>
          ))}
        </div>

        {viewMode === "calendar" ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ background: "white", borderRadius: 32, padding: 28, border: "1px solid rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }}
                          style={{ background: "#F1F1F1", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontWeight: 800 }}>‹</button>
                  <span style={{ fontWeight: 900, fontSize: 15, textTransform: "uppercase", letterSpacing: "0.05em" }}>{MONTH_NAMES[calMonth]} {calYear}</span>
                  <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }}
                          style={{ background: "#F1F1F1", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontWeight: 800 }}>›</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 8 }}>
                  {DAY_NAMES.map((d, i) => (
                      <div key={`${d}-${i}`} style={{ textAlign: "center", fontSize: 9, fontWeight: 900, color: "rgba(0,0,0,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", padding: "4px 0" }}>{d}</div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
                  {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const dayAppts = getApptForDay(day);
                    const isToday = dateStr === new Date().toISOString().split("T")[0];
                    const isSelected = dateStr === selectedDate;
                    return (
                        <button key={day} onClick={() => setSelectedDate(dateStr)}
                                style={{ aspectRatio: "1", borderRadius: 10, border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, background: isSelected ? "#0A0A0A" : isToday ? "#F0EEE9" : "transparent", color: isSelected ? "white" : "#0A0A0A", position: "relative" }}>
                          <span style={{ fontSize: 12, fontWeight: isToday ? 900 : 600 }}>{day}</span>
                          {dayAppts.length > 0 && <span style={{ width: 5, height: 5, borderRadius: "50%", background: isSelected ? "white" : "#3B82F6" }} />}
                        </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ background: "white", borderRadius: 32, padding: 28, border: "1px solid rgba(0,0,0,0.05)" }}>
                <h3 style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(0,0,0,0.4)", marginBottom: 20 }}>
                  {new Date(selectedDate + "T00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                </h3>
                {filteredByDate.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(0,0,0,0.2)", fontSize: 13, fontWeight: 700 }}>
                      Aucun rendez-vous ce jour<br />
                      <button onClick={openNew} style={{ marginTop: 16, background: "#0A0A0A", color: "white", border: "none", borderRadius: 99, padding: "10px 20px", fontSize: 10, fontWeight: 800, cursor: "pointer" }}>+ Ajouter</button>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {filteredByDate.map(a => {
                        const sc = APPT_STATUS_COLORS[a.status] || APPT_STATUS_COLORS.pending;
                        return (
                            <div key={a.id} style={{ background: "#F8F8F8", borderRadius: 20, padding: "16px 20px", display: "flex", gap: 16, alignItems: "center" }}>
                              <div style={{ background: "#0A0A0A", color: "white", borderRadius: 12, padding: "10px 14px", textAlign: "center", flexShrink: 0 }}>
                                <div style={{ fontSize: 14, fontWeight: 900 }}>{a.time}</div>
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 800, fontSize: 14 }}>{a.client_name}</div>
                                <div style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", marginTop: 2 }}>{a.service} · {a.client_email}</div>
                                {a.notes && <div style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", marginTop: 4, fontStyle: "italic" }}>{a.notes}</div>}
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                                <span style={{ background: sc.bg, color: sc.text, borderRadius: 99, fontSize: 8, fontWeight: 900, padding: "3px 10px", textTransform: "uppercase" }}>{a.status}</span>
                                <div style={{ display: "flex", gap: 4 }}>
                                  <button onClick={() => openEdit(a)} style={{ background: "#E5E7EB", border: "none", borderRadius: 8, padding: "4px 8px", cursor: "pointer", fontSize: 10 }}>Éditer</button>
                                  <button onClick={() => store.deleteAppointment(a.id)} style={{ background: "#FEE2E2", border: "none", borderRadius: 8, padding: "4px 8px", cursor: "pointer" }}>
                                    <Icon d={Icons.trash} size={11} stroke="#991B1B" />
                                  </button>
                                </div>
                              </div>
                            </div>
                        );
                      })}
                    </div>
                )}
              </div>
            </div>
        ) : (
            <div style={{ background: "white", borderRadius: 32, padding: 28, border: "1px solid rgba(0,0,0,0.05)" }}>
              <h3 style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(0,0,0,0.4)", marginBottom: 20 }}>Rendez-vous à venir</h3>
              {upcoming.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(0,0,0,0.2)" }}>
                    <Icon d={Icons.calendar} size={40} stroke="rgba(0,0,0,0.1)" />
                    <p style={{ marginTop: 16, fontWeight: 700 }}>Aucun rendez-vous à venir</p>
                  </div>
              ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <AnimatePresence>
                      {upcoming.map(a => {
                        const sc = APPT_STATUS_COLORS[a.status] || APPT_STATUS_COLORS.pending;
                        const apptDate = new Date(a.date + "T00:00");
                        const isToday = a.date === new Date().toISOString().split("T")[0];
                        return (
                            <motion.div key={a.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 20px", background: isToday ? "#F0EEE9" : "#F8F8F8", borderRadius: 20, border: isToday ? "2px solid #0A0A0A" : "1px solid rgba(0,0,0,0.05)" }}>
                              <div style={{ background: isToday ? "#0A0A0A" : "white", color: isToday ? "white" : "#0A0A0A", borderRadius: 16, padding: "12px 16px", textAlign: "center", flexShrink: 0, minWidth: 70, border: "1px solid rgba(0,0,0,0.1)" }}>
                                <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.6 }}>{apptDate.toLocaleDateString("fr-FR", { weekday: "short" }).toUpperCase()}</div>
                                <div style={{ fontSize: 22, fontWeight: 900, lineHeight: 1 }}>{apptDate.getDate()}</div>
                                <div style={{ fontSize: 9, fontWeight: 700, opacity: 0.6 }}>{apptDate.toLocaleDateString("fr-FR", { month: "short" }).toUpperCase()}</div>
                              </div>
                              <div style={{ background: "#0A0A0A", color: "white", borderRadius: 12, padding: "8px 14px", flexShrink: 0, fontSize: 13, fontWeight: 900 }}>{a.time}</div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 800, fontSize: 15 }}>{a.client_name}</div>
                                <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                                  {a.client_email && <span style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", gap: 4 }}><Icon d={Icons.mail} size={10} /> {a.client_email}</span>}
                                  {a.client_phone && <span style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", gap: 4 }}><Icon d={Icons.phone} size={10} /> {a.client_phone}</span>}
                                </div>
                                {a.notes && <div style={{ fontSize: 11, color: "rgba(0,0,0,0.5)", marginTop: 4, fontStyle: "italic" }}>{a.notes}</div>}
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                                <span style={{ background: "#F1F1F1", color: "#0A0A0A", borderRadius: 99, fontSize: 9, fontWeight: 800, padding: "3px 10px", textTransform: "uppercase", letterSpacing: "0.1em" }}>{a.service}</span>
                                <span style={{ background: sc.bg, color: sc.text, borderRadius: 99, fontSize: 8, fontWeight: 900, padding: "3px 10px", textTransform: "uppercase" }}>{a.status}</span>
                                <div style={{ display: "flex", gap: 6 }}>
                                  {a.status === "pending" && (
                                      <button onClick={() => store.updateAppointment(a.id, { status: "confirmed" })}
                                              style={{ background: "#D1FAE5", border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer", fontSize: 9, fontWeight: 800, color: "#065F46", textTransform: "uppercase" }}>
                                        ✓ Confirmer
                                      </button>
                                  )}
                                  <button onClick={() => openEdit(a)} style={{ background: "#E5E7EB", border: "none", borderRadius: 8, padding: "5px 8px", cursor: "pointer" }}>
                                    <Icon d={Icons.edit} size={11} />
                                  </button>
                                  <button onClick={() => store.deleteAppointment(a.id)} style={{ background: "#FEE2E2", border: "none", borderRadius: 8, padding: "5px 8px", cursor: "pointer" }}>
                                    <Icon d={Icons.trash} size={11} stroke="#991B1B" />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
              )}
            </div>
        )}

        {showForm && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                          style={{ background: "white", borderRadius: 32, padding: 40, width: "min(580px, 95vw)", maxHeight: "90vh", overflow: "auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                  <h2 style={{ fontWeight: 900, fontSize: 22, textTransform: "uppercase", fontStyle: "italic", margin: 0 }}>
                    {editId ? "Modifier le RDV" : "Nouveau Rendez-vous"}
                  </h2>
                  <button onClick={() => setShowForm(false)} style={{ background: "#F1F1F1", border: "none", borderRadius: 10, padding: "8px", cursor: "pointer" }}>
                    <Icon d={Icons.x} size={16} />
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={labelStyle}>Nom du client *</label>
                    <input value={form.client_name} onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))} style={inputStyle} placeholder="Prénom Nom" />
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input type="email" value={form.client_email} onChange={e => setForm(f => ({ ...f, client_email: e.target.value }))} style={inputStyle} placeholder="email@exemple.com" />
                  </div>
                  <div>
                    <label style={labelStyle}>Téléphone</label>
                    <input type="tel" value={form.client_phone} onChange={e => setForm(f => ({ ...f, client_phone: e.target.value }))} style={inputStyle} placeholder="+33 6 00 00 00 00" />
                  </div>
                  <div>
                    <label style={labelStyle}>Date *</label>
                    <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Heure</label>
                    <select value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} style={inputStyle}>
                      {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Service</label>
                    <select value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} style={inputStyle}>
                      {SERVICES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Statut</label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={inputStyle}>
                      {["pending", "confirmed", "done", "cancelled"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={labelStyle}>Notes</label>
                    <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} style={{ ...inputStyle, resize: "vertical" }} placeholder="Budget, contexte, liens..." />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
                  <button onClick={save} style={{ flex: 1, background: "#0A0A0A", color: "white", border: "none", borderRadius: 14, padding: "16px", fontSize: 11, fontWeight: 800, textTransform: "uppercase", cursor: "pointer" }}>
                    {editId ? "Mettre à jour" : "Créer le RDV"}
                  </button>
                  <button onClick={() => setShowForm(false)} style={{ background: "#F1F1F1", border: "none", borderRadius: 14, padding: "16px 24px", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>Annuler</button>
                </div>
              </motion.div>
            </div>
        )}
      </div>
  );
}

// ─────────────────────────────────────────────
// AI NEXUS — UPGRADED
// ─────────────────────────────────────────────
function AiNexus({ data, chatHistory, setChatHistory, addChatMessage, store }: {
  data: AppData;
  chatHistory: ChatMessage[];
  setChatHistory: (history: ChatMessage[]) => void;
  addChatMessage: (msg: ChatMessage) => void;
  store: ReturnType<typeof useData>;
}) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showKnowledge, setShowKnowledge] = useState(false);
  const [newEntry, setNewEntry] = useState({
    problem: "",
    solution: "",
    tags: "",
    severity: "medium" as "low" | "medium" | "high" | "critical",
    image_url: "",
    video_url: "",
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatHistory, isTyping]);

  const buildSystemPrompt = () => {
    const appts = data.appointments || [];
    return `Tu es Nexus, l'assistant IA interne de l'agence Alhambra. Réponds en français, de manière professionnelle et concise.

PROJETS ACTIFS (${data.projects.length}):
${data.projects.map(p => `- ${p.name} [${p.status}] ${p.year} - ${p.description} | SEO: ${p.metrics.seo}% | Perf: ${p.metrics.performance}%${p.links?.live ? ` | ${p.links.live}` : ""}`).join("\n")}

TACHES EN COURS:
${data.tasks.filter(t => t.kanban_column !== "done").map(t => `- [${t.priority}] ${t.title} - ${t.kanban_column}${t.project_id ? ` (${t.project_id})` : ""}`).join("\n") || "Aucune tache active"}

RENDEZ-VOUS A VENIR (${appts.filter(a => a.status !== "cancelled").length}):
${appts.filter(a => a.date >= new Date().toISOString().split("T")[0] && a.status !== "cancelled").slice(0, 5).map(a => `- ${a.date} ${a.time} - ${a.client_name} (${a.service}) [${a.status}]`).join("\n") || "Aucun RDV a venir"}

FORMATAGE MARKDOWN: Utilise du markdown pour structurer tes réponses :
- **texte** pour le gras (mots importants, termes techniques)
- *texte* pour l'italique
- \`code inline\` pour les commandes ou variables
- ## Titres pour les sections
- Listes à puces avec - pour énumérer
- Listes numérotées avec 1. 2. 3. pour les étapes
- Blocs de code avec \`\`\`langage pour du code (html, css, js, tsx, etc.)
- > Citation pour les notes importantes
- --- pour les séparateurs

LIENS: Utilise TOUJOURS [texte descriptif](url) pour les liens.

SITES WEB: Quand tu génères du code HTML/CSS/JS pour un site, utilise des blocs \`\`\`html avec le code complet. L'utilisateur peut cliquer "Preview" pour le voir rendu directement.

Tu peux: analyser les projets, suggerer des ameliorations SEO/perf, debugger, planifier, resumer les RDV, générer des sites web complets, etc.`;
  };

  const ask = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = input.trim();
    setInput("");

    addChatMessage({ role: "user", content: userMsg });
    setIsTyping(true);

    try {
      const uiMessages = [...chatHistory, { role: "user" as const, content: userMsg }].map((m, i) => ({
        id: `msg-${i}`,
        role: m.role === "ai" ? "assistant" as const : "user" as const,
        parts: [{ type: "text" as const, text: m.content }],
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: uiMessages,
          systemPrompt: buildSystemPrompt(),
          knowledgeBase: data.knowledgeBase,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let fullContent = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data:")) {
            const dataStr = trimmed.slice(5).trim();
            if (dataStr === "[DONE]") continue;
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.type === "text-delta" && parsed.delta) {
                fullContent += parsed.delta;
              }
            } catch { /* skip */ }
          }
        }
      }

      if (fullContent) {
        addChatMessage({ role: "ai", content: fullContent });
      } else {
        throw new Error("Reponse vide de l'API");
      }
    } catch (err) {
      const errorMessage = (err as Error).message;
      addChatMessage({ role: "ai", content: `**Erreur :** \`${errorMessage}\`\n\nVérifiez que le serveur est bien démarré.` });
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setChatHistory([{ role: "ai", content: "## Nexus réinitialisé\n\nBonjour ! Je suis **Nexus**, votre assistant IA Alhambra. Je peux analyser vos projets, générer du code, créer des sites web et bien plus. Que puis-je faire pour vous ?" }]);
  };

  const addKnowledge = async () => {
    if (!newEntry.problem.trim() || !newEntry.solution.trim()) return;
    await store.addKnowledgeEntry({
      problem: newEntry.problem,
      solution: newEntry.solution,
      tags: newEntry.tags.split(",").map(t => t.trim()).filter(Boolean),
      severity: newEntry.severity,
      image_url: newEntry.image_url || undefined,
      video_url: newEntry.video_url || undefined,
    } as Partial<KnowledgeEntry>);
    setNewEntry({ problem: "", solution: "", tags: "", severity: "medium", image_url: "", video_url: "" });
  };

  const SUGGESTIONS = [
    "Analyse SEO de mes projets",
    "Génère un site landing page HTML",
    "Résume les prochains RDV",
    "Tâches prioritaires ?",
  ];

  const SEVERITY_COLORS: Record<string, { bg: string; text: string }> = {
    low: { bg: "#D1FAE5", text: "#065F46" },
    medium: { bg: "#FEF3C7", text: "#92400E" },
    high: { bg: "#FEE2E2", text: "#991B1B" },
    critical: { bg: "#7F1D1D", text: "white" },
  };

  const inputStyleKB = { width: "100%", background: "white", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 12, padding: "10px 14px", fontSize: 13, fontWeight: 500, outline: "none" };
  const labelStyleKB: React.CSSProperties = { display: "block", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(0,0,0,0.4)", marginBottom: 6 };

  return (
      <div style={{ display: "flex", gap: 24, height: "calc(100vh - 220px)" }}>
        {/* Chat Panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "white", borderRadius: 40, border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden" }}>

          {/* Header */}
          <div style={{ background: "#0A0A0A", padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
                <Icon d={Icons.sparkles} size={18} stroke="white" strokeWidth={1.5} />
              </div>
              <div>
                <div style={{ color: "white", fontWeight: 900, fontSize: 15, textTransform: "uppercase", letterSpacing: "-0.02em" }}>Nexus Intelligence</div>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", marginTop: 2 }}>
                  Claude Sonnet 4 · Alhambra OS
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {/* Status dot */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 99, padding: "5px 12px" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 6px rgba(16,185,129,0.6)", animation: "ping 2s infinite" }} />
                <span style={{ fontSize: 9, fontWeight: 800, color: "#10B981", letterSpacing: "0.15em", textTransform: "uppercase" }}>En ligne</span>
              </div>
              <button onClick={() => setShowKnowledge(v => !v)}
                      style={{ background: showKnowledge ? "white" : "rgba(255,255,255,0.08)", border: `1px solid ${showKnowledge ? "transparent" : "rgba(255,255,255,0.12)"}`, borderRadius: 10, color: showKnowledge ? "#0A0A0A" : "rgba(255,255,255,0.5)", padding: "7px 14px", cursor: "pointer", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", transition: "all 0.2s" }}>
                KB ({data.knowledgeBase?.length || 0})
              </button>
              <button onClick={clearChat}
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "rgba(255,255,255,0.4)", padding: "7px 14px", cursor: "pointer", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Effacer
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "28px 28px 16px", display: "flex", flexDirection: "column", gap: 16, background: "#F7F6F3" }}>
            <AnimatePresence>
              {chatHistory.map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                              style={{ display: "flex", justifyContent: m.role === "ai" ? "flex-start" : "flex-end" }}>
                    <div style={{ display: "flex", gap: 10, maxWidth: "84%", flexDirection: m.role === "user" ? "row-reverse" : "row", alignItems: "flex-end" }}>

                      {/* Avatar */}
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: m.role === "ai" ? "#0A0A0A" : "linear-gradient(135deg, #6366F1, #8B5CF6)",
                        boxShadow: m.role === "ai" ? "0 2px 8px rgba(0,0,0,0.2)" : "0 2px 8px rgba(99,102,241,0.3)",
                        marginBottom: 2,
                      }}>
                        <Icon d={m.role === "ai" ? Icons.sparkles : Icons.user} size={13} stroke="white" strokeWidth={1.8} />
                      </div>

                      {/* Bubble */}
                      <div style={{
                        padding: m.role === "ai" ? "16px 20px" : "12px 18px",
                        borderRadius: m.role === "ai" ? "20px 20px 20px 4px" : "20px 20px 4px 20px",
                        background: m.role === "ai"
                            ? "white"
                            : "linear-gradient(135deg, #1a1a2e 0%, #0A0A0A 100%)",
                        color: m.role === "ai" ? "#0A0A0A" : "white",
                        boxShadow: m.role === "ai"
                            ? "0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)"
                            : "0 4px 16px rgba(0,0,0,0.2)",
                        border: m.role === "ai" ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.08)",
                        fontSize: 14,
                        maxWidth: "100%",
                        wordBreak: "break-word",
                      }}>
                        <RichMessage content={m.content} isAI={m.role === "ai"} />
                      </div>
                    </div>
                  </motion.div>
              ))}

              {isTyping && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
                      <Icon d={Icons.sparkles} size={13} stroke="white" strokeWidth={1.8} />
                    </div>
                    <div style={{ background: "white", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "20px 20px 20px 4px", padding: "14px 20px", display: "flex", gap: 5, alignItems: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                      {[0, 0.18, 0.36].map((delay, idx) => (
                          <span key={idx} style={{ width: 7, height: 7, background: "#0A0A0A", borderRadius: "50%", display: "inline-block", opacity: 0.4, animation: `typingBounce 1.2s ${delay}s infinite` }} />
                      ))}
                    </div>
                  </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Suggestions */}
          <div style={{ padding: "10px 24px 0", display: "flex", gap: 6, flexWrap: "wrap", flexShrink: 0, background: "#F7F6F3" }}>
            {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => setInput(s)}
                        style={{ background: "white", border: "1px solid rgba(0,0,0,0.09)", borderRadius: 99, padding: "6px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer", color: "rgba(0,0,0,0.55)", transition: "all 0.15s", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#F0EEE9"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "white"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}>
                  {s}
                </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: "14px 20px 18px", background: "#F7F6F3", display: "flex", gap: 10, flexShrink: 0 }}>
            <div style={{ flex: 1, background: "white", border: "1px solid rgba(0,0,0,0.09)", borderRadius: 20, display: "flex", alignItems: "center", gap: 12, padding: "4px 8px 4px 18px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "box-shadow 0.2s" }}
                 onFocusCapture={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 0 3px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.08)"; }}
                 onBlurCapture={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}>
              <Icon d={Icons.sparkles} size={15} stroke="rgba(0,0,0,0.25)" />
              <input value={input} onChange={e => setInput(e.target.value)}
                     onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask().catch(console.error); } }}
                     placeholder="Demandez à Nexus... (Entrée pour envoyer)"
                     style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, fontWeight: 500, color: "#0A0A0A", padding: "10px 0" }} />
            </div>
            <button onClick={() => { ask().catch(console.error); }} disabled={isTyping || !input.trim()}
                    style={{ width: 50, height: 50, background: isTyping || !input.trim() ? "#E5E7EB" : "#0A0A0A", border: "none", borderRadius: 16, cursor: isTyping ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s", boxShadow: isTyping || !input.trim() ? "none" : "0 4px 12px rgba(0,0,0,0.2)" }}>
              <Icon d={Icons.send} size={17} stroke={isTyping || !input.trim() ? "#9CA3AF" : "white"} />
            </button>
          </div>

          <style>{`
            @keyframes typingBounce {
              0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
              30% { transform: translateY(-6px); opacity: 1; }
            }
          `}</style>
        </div>

        {/* Knowledge Base Panel */}
        {showKnowledge && (
            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.3 }}
                        style={{ width: 400, background: "white", borderRadius: 32, border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "22px 20px", borderBottom: "1px solid rgba(0,0,0,0.06)", flexShrink: 0, background: "#0A0A0A" }}>
                <h3 style={{ margin: "0 0 4px", fontWeight: 900, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.05em", color: "white" }}>Base de Connaissances</h3>
                <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>Bugs, solutions & ressources pour Nexus</p>
              </div>

              {/* Add form */}
              <div style={{ padding: "16px", background: "#FAFAFA", borderBottom: "1px solid rgba(0,0,0,0.06)", flexShrink: 0 }}>
                <div style={{ marginBottom: 10 }}>
                  <label style={labelStyleKB}>Problème / Titre *</label>
                  <textarea value={newEntry.problem} onChange={e => setNewEntry(p => ({ ...p, problem: e.target.value }))}
                            placeholder="Description du bug ou titre de la ressource..."
                            style={{ ...inputStyleKB, resize: "none", minHeight: 48 }} />
                </div>
                <div style={{ marginBottom: 10 }}>
                  <label style={labelStyleKB}>Solution *</label>
                  <textarea value={newEntry.solution} onChange={e => setNewEntry(p => ({ ...p, solution: e.target.value }))}
                            placeholder="Comment résoudre..."
                            style={{ ...inputStyleKB, resize: "none", minHeight: 48 }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  <div>
                    <label style={labelStyleKB}>Image URL</label>
                    <input value={newEntry.image_url} onChange={e => setNewEntry(p => ({ ...p, image_url: e.target.value }))} placeholder="https://..." style={inputStyleKB} />
                  </div>
                  <div>
                    <label style={labelStyleKB}>Vidéo URL</label>
                    <input value={newEntry.video_url} onChange={e => setNewEntry(p => ({ ...p, video_url: e.target.value }))} placeholder="https://..." style={inputStyleKB} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyleKB}>Tags (séparés par ,)</label>
                    <input value={newEntry.tags} onChange={e => setNewEntry(p => ({ ...p, tags: e.target.value }))} placeholder="api, bug..." style={inputStyleKB} />
                  </div>
                  <div>
                    <label style={labelStyleKB}>Sévérité</label>
                    <select value={newEntry.severity} onChange={e => setNewEntry(p => ({ ...p, severity: e.target.value as "low" | "medium" | "high" | "critical" }))}
                            style={{ background: "white", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 10, padding: "8px 10px", fontSize: 12, fontWeight: 600, outline: "none", cursor: "pointer" }}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>
                <button onClick={addKnowledge} disabled={!newEntry.problem.trim() || !newEntry.solution.trim()}
                        style={{ width: "100%", background: newEntry.problem.trim() && newEntry.solution.trim() ? "#0A0A0A" : "#E5E7EB", color: newEntry.problem.trim() && newEntry.solution.trim() ? "white" : "#9CA3AF", border: "none", borderRadius: 12, padding: "11px", fontSize: 11, fontWeight: 800, textTransform: "uppercase", cursor: newEntry.problem.trim() && newEntry.solution.trim() ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
                  + Ajouter à la base
                </button>
              </div>

              {/* List */}
              <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>
                {(data.knowledgeBase || []).length === 0 ? (
                    <p style={{ textAlign: "center", color: "rgba(0,0,0,0.3)", fontSize: 13, padding: "24px 0" }}>
                      Aucune entrée. Ajoutez vos premiers bugs !
                    </p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {(data.knowledgeBase || []).map(entry => {
                        const sc = SEVERITY_COLORS[entry.severity] || SEVERITY_COLORS.medium;
                        const e = entry as KnowledgeEntry & { image_url?: string; video_url?: string; url?: string };
                        return (
                            <motion.div key={e.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        style={{ background: "#F8F8F8", borderRadius: 16, padding: "14px", border: "1px solid rgba(0,0,0,0.05)" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                                <span style={{ background: sc.bg, color: sc.text, borderRadius: 6, padding: "2px 8px", fontSize: 9, fontWeight: 800, textTransform: "uppercase" }}>{e.severity}</span>
                                <button onClick={() => store.deleteKnowledgeEntry(e.id)} style={{ background: "transparent", border: "none", cursor: "pointer", opacity: 0.3, padding: 2 }}>
                                  <Icon d={Icons.trash} size={13} />
                                </button>
                              </div>
                              <p style={{ margin: "0 0 5px", fontWeight: 700, fontSize: 13, color: "#0A0A0A", lineHeight: 1.4 }}>{e.problem}</p>
                              <p style={{ margin: "0 0 8px", fontSize: 12, color: "rgba(0,0,0,0.55)", lineHeight: 1.5 }}>
                                {(e.solution || "").slice(0, 100)}{(e.solution || "").length > 100 ? "..." : ""}
                              </p>
                              {e.image_url && (
                                  <div style={{ marginBottom: 8, borderRadius: 10, overflow: "hidden" }}>
                                    <img src={e.image_url} alt="preview" style={{ width: "100%", display: "block", maxHeight: 140, objectFit: "cover" }} onError={ev => { (ev.currentTarget as HTMLImageElement).style.display = "none"; }} />
                                  </div>
                              )}
                              {e.video_url && (
                                  <div style={{ marginBottom: 8, borderRadius: 10, overflow: "hidden" }}>
                                    <video controls style={{ width: "100%", display: "block", maxHeight: 140 }}>
                                      <source src={e.video_url} />
                                    </video>
                                  </div>
                              )}
                              {e.tags && e.tags.length > 0 && (
                                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                                    {e.tags.map(tag => (
                                        <span key={tag} style={{ background: "rgba(0,0,0,0.06)", borderRadius: 4, padding: "2px 7px", fontSize: 10, fontWeight: 600, color: "rgba(0,0,0,0.45)" }}>{tag}</span>
                                    ))}
                                  </div>
                              )}
                            </motion.div>
                        );
                      })}
                    </div>
                )}
              </div>
            </motion.div>
        )}
      </div>
  );
}

// ─────────────────────────────────────────────
// MESSAGES
// ─────────────────────────────────────────────
function Messages({ data, store }: { data: AppData; store: ReturnType<typeof useData> }) {
  const [selected, setSelected] = useState<Message | null>(null);
  const [compose, setCompose] = useState(false);
  const [newMsg, setNewMsg] = useState({ sender: "", subject: "", body: "" });

  const addMsg = async () => {
    if (!newMsg.sender.trim()) return;
    await store.addMessage(newMsg);
    setCompose(false);
    setNewMsg({ sender: "", subject: "", body: "" });
  };

  const unread = data.messages.filter(m => !m.is_read).length;
  const inputStyle = { width: "100%", background: "#F8F8F8", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 14, fontWeight: 600, outline: "none" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(0,0,0,0.4)", marginBottom: 8 };

  return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          {unread > 0 && <span style={{ background: "#0A0A0A", color: "white", borderRadius: 99, padding: "4px 14px", fontSize: 11, fontWeight: 800 }}>{unread} non lu{unread > 1 ? "s" : ""}</span>}
          <div style={{ marginLeft: "auto" }}>
            <button onClick={() => setCompose(true)}
                    style={{ background: "#0A0A0A", color: "white", border: "none", borderRadius: 99, padding: "12px 24px", fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              <Icon d={Icons.plus} size={14} stroke="white" /> Nouveau message
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1fr" : "1fr", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <AnimatePresence>
              {data.messages.map(msg => (
                  <motion.div key={msg.id} layout whileHover={{ x: 4 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                              onClick={() => { setSelected(msg); store.markRead(msg.id); }}
                              style={{ background: selected?.id === msg.id ? "#0A0A0A" : "white", borderRadius: 24, padding: "20px 24px", border: `1px solid ${msg.is_read ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.15)"}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 44, height: 44, background: selected?.id === msg.id ? "rgba(255,255,255,0.1)" : "#F1F1F1", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon d={Icons.messages} size={18} stroke={selected?.id === msg.id ? "white" : "#0A0A0A"} />
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontWeight: 900, fontSize: 14, fontStyle: "italic", textTransform: "uppercase", color: selected?.id === msg.id ? "white" : "#0A0A0A" }}>{msg.sender}</span>
                          {!msg.is_read && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3B82F6" }} />}
                        </div>
                        <p style={{ fontSize: 10, fontWeight: 700, color: selected?.id === msg.id ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)", margin: "2px 0 4px", textTransform: "uppercase" }}>{msg.subject}</p>
                        <p style={{ fontSize: 12, color: selected?.id === msg.id ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)", margin: 0, maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.body}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: selected?.id === msg.id ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)" }}>{msg.time}</span>
                      <button onClick={e => { e.stopPropagation(); store.deleteMessage(msg.id); if (selected?.id === msg.id) setSelected(null); }}
                              style={{ background: "none", border: "none", cursor: "pointer", color: selected?.id === msg.id ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)", padding: 0 }}>
                        <Icon d={Icons.trash} size={13} />
                      </button>
                    </div>
                  </motion.div>
              ))}
            </AnimatePresence>
            {data.messages.length === 0 && <div style={{ textAlign: "center", padding: 60, color: "rgba(0,0,0,0.2)", fontWeight: 700 }}>Aucun message</div>}
          </div>

          {selected && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                          style={{ background: "white", borderRadius: 32, padding: 32, border: "1px solid rgba(0,0,0,0.06)", position: "sticky", top: 0, alignSelf: "flex-start" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
                  <div>
                    <h3 style={{ fontWeight: 900, fontSize: 18, fontStyle: "italic", textTransform: "uppercase", margin: "0 0 4px" }}>{selected.sender}</h3>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "0.15em", margin: 0 }}>{selected.subject}</p>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background: "#F1F1F1", border: "none", borderRadius: 10, padding: "8px", cursor: "pointer" }}>
                    <Icon d={Icons.x} size={16} />
                  </button>
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(0,0,0,0.7)", padding: "24px", background: "#F8F8F8", borderRadius: 20 }}>
                  <RichMessage content={selected.body} isAI={true} />
                </div>
                <p style={{ fontSize: 10, color: "rgba(0,0,0,0.3)", fontWeight: 700, marginTop: 16, textAlign: "right" }}>Reçu : {selected.time}</p>
              </motion.div>
          )}
        </div>

        {compose && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                          style={{ background: "white", borderRadius: 28, padding: 36, width: "min(480px, 95vw)" }}>
                <h3 style={{ fontWeight: 900, fontSize: 20, textTransform: "uppercase", fontStyle: "italic", margin: "0 0 28px" }}>Nouveau Message</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {([["De", "sender"], ["Sujet", "subject"]] as const).map(([label, key]) => (
                      <div key={key}>
                        <label style={labelStyle}>{label}</label>
                        <input value={newMsg[key as keyof typeof newMsg]} onChange={e => setNewMsg(f => ({ ...f, [key]: e.target.value }))} style={inputStyle} />
                      </div>
                  ))}
                  <div>
                    <label style={labelStyle}>Message</label>
                    <textarea value={newMsg.body} onChange={e => setNewMsg(f => ({ ...f, body: e.target.value }))} rows={4} style={{ ...inputStyle, resize: "vertical" }} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
                  <button onClick={() => { addMsg().catch(console.error); }} style={{ flex: 1, background: "#0A0A0A", color: "white", border: "none", borderRadius: 14, padding: "15px", fontSize: 11, fontWeight: 800, textTransform: "uppercase", cursor: "pointer" }}>Envoyer</button>
                  <button onClick={() => setCompose(false)} style={{ background: "#F1F1F1", border: "none", borderRadius: 14, padding: "15px 24px", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>Annuler</button>
                </div>
              </motion.div>
            </div>
        )}
      </div>
  );
}