"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
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

interface Subscription {
  id: string;
  name: string;
  provider: string;
  category: "server" | "developer" | "enterprise" | "support" | "domain" | "saas" | "ai" | "design";
  price_monthly: number;
  price_yearly: number;
  billing_cycle: "monthly" | "yearly" | "one_time";
  status: "active" | "cancelled" | "trial" | "expired" | "paused";
  next_billing_date: string;
  auto_renew: boolean;
  notes: string;
  url: string;
  created_at: string;
}

interface SiteProject {
  id: string;
  title: string;
  image: string;
  link: string;
  docs_link?: string;
  is_live: boolean;
  sort_order: number;
  created_at?: string;
}

interface SiteServiceTab { name: string; text: string; }
interface SiteServiceMetric { label: string; value: number; }
interface SiteService {
  id: string;
  title_main: string;
  title_sub: string;
  features: string[];
  metrics: SiteServiceMetric[];
  tabs: SiteServiceTab[];
  sort_order: number;
  active: boolean;
  created_at?: string;
}

interface ContactSubmission {
  id: string;
  type: string;
  payload: string;
  subject: string;
  is_read: boolean;
  created_at: string;
}

interface Application {
  id: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone?: string;
  role: string;
  experience: string;
  contract_type: string;
  portfolio?: string;
  status: string;
  created_at: string;
}

interface SentEmail {
  id: string;
  to_email: string;
  to_name: string;
  from_name: string;
  subject: string;
  message: string;
  is_opened: boolean;
  opened_at?: string;
  sent_at: string;
}

interface AppData {
  projects: Project[];
  tasks: Task[];
  messages: Message[];
  appointments: Appointment[];
  knowledgeBase: KnowledgeEntry[];
  subscriptions: Subscription[];
  site_projects: SiteProject[];
  site_services: SiteService[];
  contact_submissions: ContactSubmission[];
  applications: Application[];
  sent_emails: SentEmail[];
}

// ─────────────────────────────────────────────
// DB CONFIG
// ─────────────────────────────────────────────
async function sbFetch(path: string, options?: { method?: string; body?: unknown }) {
  const table = path.replace(/\/$/, '');
  const url = `/api/data.php?table=${table}`;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const fetchOptions: RequestInit = { method: options?.method || "GET", headers };
  if (options?.body) fetchOptions.body = JSON.stringify(options.body);
  const res = await fetch(url, fetchOptions);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }
  if (options?.method === "DELETE") return { success: true };
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

const db = {
  get: <T,>(table: string) => sbFetch(`${table}/`) as Promise<T[]>,
  insert: <T,>(table: string, data: unknown) => sbFetch(`${table}/`, { method: "POST", body: data }) as Promise<T>,
  update: <T,>(table: string, id: string, data: unknown) => sbFetch(`${table}/`, { method: "PATCH", body: { ...(data as object), id } }) as Promise<T[]>,
  delete: (table: string, id: string) => sbFetch(`${table}/`, { method: "DELETE", body: { id } }),
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
  subscriptions: [
    { id: "s1", name: "Vercel Pro", provider: "Vercel", category: "server", price_monthly: 20, price_yearly: 200, billing_cycle: "yearly", status: "active", next_billing_date: "2027-01-15", auto_renew: true, notes: "Hébergement Next.js — bandwidth illimité, Analytics inclus", url: "https://vercel.com", created_at: new Date().toISOString() },
    { id: "s2", name: "Supabase Pro", provider: "Supabase", category: "server", price_monthly: 25, price_yearly: 250, billing_cycle: "monthly", status: "active", next_billing_date: "2026-06-01", auto_renew: true, notes: "Base de données PostgreSQL + Auth + Storage 100 GB", url: "https://supabase.com", created_at: new Date().toISOString() },
    { id: "s3", name: "Apple Developer Program", provider: "Apple", category: "developer", price_monthly: 8.25, price_yearly: 99, billing_cycle: "yearly", status: "active", next_billing_date: "2027-03-22", auto_renew: true, notes: "Publication App Store iOS / macOS / watchOS — accès TestFlight", url: "https://developer.apple.com", created_at: new Date().toISOString() },
    { id: "s4", name: "Google Play Console", provider: "Google", category: "developer", price_monthly: 0, price_yearly: 0, billing_cycle: "one_time", status: "active", next_billing_date: "", auto_renew: false, notes: "Frais d'inscription unique $25 — publication Android", url: "https://play.google.com/console", created_at: new Date().toISOString() },
    { id: "s5", name: "GitHub Teams", provider: "GitHub", category: "enterprise", price_monthly: 12, price_yearly: 132, billing_cycle: "monthly", status: "active", next_billing_date: "2026-06-14", auto_renew: true, notes: "4€/utilisateur × 3 membres — CI/CD Actions 3000 min/mois", url: "https://github.com", created_at: new Date().toISOString() },
    { id: "s6", name: "Cloudflare Pro", provider: "Cloudflare", category: "domain", price_monthly: 20, price_yearly: 200, billing_cycle: "yearly", status: "active", next_billing_date: "2026-11-08", auto_renew: true, notes: "CDN mondial + DDoS + WAF + Page Rules illimitées", url: "https://cloudflare.com", created_at: new Date().toISOString() },
    { id: "s7", name: "Anthropic API", provider: "Anthropic", category: "ai", price_monthly: 50, price_yearly: 600, billing_cycle: "monthly", status: "active", next_billing_date: "2026-06-01", auto_renew: true, notes: "Claude Sonnet 4 — Nexus AI + assistant admin", url: "https://anthropic.com", created_at: new Date().toISOString() },
    { id: "s8", name: "Figma Pro", provider: "Figma", category: "design", price_monthly: 15, price_yearly: 144, billing_cycle: "yearly", status: "active", next_billing_date: "2026-09-30", auto_renew: true, notes: "Design & prototypage UI/UX — variables, dev mode inclus", url: "https://figma.com", created_at: new Date().toISOString() },
    { id: "s9", name: "Notion Teams", provider: "Notion", category: "enterprise", price_monthly: 10, price_yearly: 96, billing_cycle: "yearly", status: "active", next_billing_date: "2026-12-01", auto_renew: true, notes: "Wiki interne + docs clients + base CRM 3 membres", url: "https://notion.so", created_at: new Date().toISOString() },
    { id: "s10", name: "Postmark", provider: "Postmark", category: "server", price_monthly: 15, price_yearly: 0, billing_cycle: "monthly", status: "active", next_billing_date: "2026-06-14", auto_renew: true, notes: "Emails transactionnels — 15 000 messages/mois", url: "https://postmarkapp.com", created_at: new Date().toISOString() },
    { id: "s11", name: "Google Workspace", provider: "Google", category: "enterprise", price_monthly: 18, price_yearly: 0, billing_cycle: "monthly", status: "active", next_billing_date: "2026-06-14", auto_renew: true, notes: "Gmail pro @alhambra.fr + Drive 2TB + Meet + Docs", url: "https://workspace.google.com", created_at: new Date().toISOString() },
    { id: "s12", name: "Stripe", provider: "Stripe", category: "saas", price_monthly: 0, price_yearly: 0, billing_cycle: "one_time", status: "active", next_billing_date: "", auto_renew: false, notes: "Paiements clients — 1.5% + 0.25€/transaction", url: "https://stripe.com", created_at: new Date().toISOString() },
  ],
  site_projects: [
    { id: "sp-12", title: "Chez Ramo", image: "/images/Chez Ramo.webp", link: "https://xeloriom-sketch.github.io/chezramo/", is_live: true, sort_order: 0 },
    { id: "sp-8",  title: "Daftar",    image: "/images/daftar.webp",    link: "https://apidaftar.com",  is_live: true, sort_order: 1 },
    { id: "sp-10", title: "ON Coaching", image: "/images/ON Coaching.webp", link: "https://oncoaching.fr", is_live: true, sort_order: 2 },
    { id: "sp-1",  title: "ARLEA Promotion", image: "/images/ARLEA Promotion.webp", link: "https://arleapromotion.com", is_live: true, sort_order: 3 },
    { id: "sp-11", title: "Mosquée Es-Salam", image: "/images/Mosquée Es-Salam.webp", link: "http://mosquee-essalem.fr", is_live: true, sort_order: 4 },
    { id: "sp-2",  title: "Xpertive", image: "/images/Xpertive.webp", link: "https://xpertive.com", is_live: true, sort_order: 5 },
    { id: "sp-13", title: "LuxFlora", image: "/images/LuxFlora.webp", link: "https://xeloriom.github.io/LuxFlora/", is_live: true, sort_order: 6 },
  ],
  site_services: [
    { id: "ss-1", title_main: "Identité", title_sub: "de Marque", features: ["Logo SVG","Charte graphique","Typographie","Palette couleurs"], metrics: [], tabs: [{name:"Logo",text:"Notre équipe crée des logos uniques qui capturent votre essence."},{name:"Typo",text:"Des polices qui parlent le langage de votre marque."},{name:"Couleurs",text:"Des palettes stratégiques pour susciter les bonnes émotions."}], sort_order: 0, active: true },
    { id: "ss-2", title_main: "Expérience", title_sub: "Digitale", features: ["Design UI/UX","Prototypage","Design system","Tests utilisateurs"], metrics: [], tabs: [{name:"Design UI",text:"Interfaces privilégiant le plaisir de l'utilisateur."},{name:"Recherche UX",text:"Décisions basées sur la data pour des flux fluides."},{name:"Prototypage",text:"Maquettes interactives pour valider avant de développer."}], sort_order: 1, active: true },
    { id: "ss-3", title_main: "Développement", title_sub: "Web", features: ["Next.js / React","TypeScript","Animations Framer","API & backend"], metrics: [], tabs: [{name:"Frontend",text:"Next.js, React, Tailwind — les meilleures stacks du marché."},{name:"Animations",text:"Framer Motion pour des expériences qui marquent les esprits."},{name:"Performance",text:"Score Lighthouse 95+ garanti sur tous nos projets."}], sort_order: 2, active: true },
    { id: "ss-4", title_main: "Stratégie", title_sub: "Digitale", features: ["Audit SEO","Tunnel de conversion","Analytics","Growth hacking"], metrics: [], tabs: [{name:"SEO",text:"Audit technique et stratégie de contenu pour dominer Google."},{name:"Analytics",text:"Tableaux de bord temps réel pour piloter votre croissance."},{name:"Conversion",text:"Optimisation du tunnel pour maximiser chaque visite."}], sort_order: 3, active: true },
  ],
  contact_submissions: [],
  applications: [],
  sent_emails: [],
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
  creditCard: "M1 4h22v16H1zM1 10h22M5 16h4",
  billing: "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  receipt: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
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
  const [data, setData] = useState<AppData>({ projects: [], tasks: [], messages: [], appointments: [], knowledgeBase: [], subscriptions: [], site_projects: [], site_services: [], contact_submissions: [], applications: [], sent_emails: [] });
  const [loading, setLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const clearSyncError = useCallback(() => setSyncError(null), []);
  const flagError = useCallback(() => setSyncError('Erreur de synchronisation — l\'opération n\'a pas été sauvegardée.'), []);

  const storeChatHistory = useAdminStore((state) => state.chatHistory);
  const setStoreChatHistory = useAdminStore((state) => state.setChatHistory);
  const addStoreChatMessage = useAdminStore((state) => state.addChatMessage);
  const clearStoreChat = useAdminStore((state) => state.clearChat);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [projects, tasks, messages, appointments, knowledgeBase, subscriptions, site_projects, site_services, contact_submissions, applications, sent_emails] = await Promise.all([
        db.get<Project>("projects").catch(() => []),
        db.get<Task>("tasks").catch(() => []),
        db.get<Message>("messages").catch(() => []),
        db.get<Appointment>("appointments").catch(() => []),
        db.get<KnowledgeEntry>("knowledge_base").catch(() => []),
        db.get<Subscription>("subscriptions").catch(() => []),
        db.get<SiteProject>("site_projects").catch(() => []),
        db.get<SiteService>("site_services").catch(() => []),
        db.get<ContactSubmission>("contact_submissions").catch(() => []),
        db.get<Application>("applications").catch(() => []),
        db.get<SentEmail>("sent_emails").catch(() => []),
      ]);
      setData({ projects, tasks, messages, appointments, knowledgeBase, subscriptions, site_projects, site_services, contact_submissions, applications, sent_emails });
    } catch (e) {
      console.warn("API non disponible, mode démo:", (e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh().catch(e => { console.error(e); flagError(); });

    // Auto-refresh every 20s
    const interval = setInterval(() => {
      refresh().catch(() => {});
    }, 20000);

    // Refresh on tab focus
    const onFocus = () => refresh().catch(() => {});
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [refresh, flagError]);

  const addProject = useCallback(async (project: Partial<Project>) => {
    const res = await db.insert<Project>("projects", { ...project, id: project.id || `p-${Date.now()}` });
    setData(d => ({ ...d, projects: [res, ...d.projects] }));
  }, []);

  const updateProject = useCallback(async (id: string, updates: Partial<Project>) => {
    await db.update<Project>("projects", id, updates);
    setData(d => ({ ...d, projects: d.projects.map(p => p.id === id ? { ...p, ...updates } : p) }));
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    await db.delete("projects", id);
    setData(d => ({ ...d, projects: d.projects.filter(p => p.id !== id) }));
  }, []);

  const addTask = useCallback(async (taskData: Partial<Task>) => {
    const task = { ...taskData, id: taskData.id || `t-${Date.now()}`, status: taskData.status || "backlog", created_at: new Date().toISOString() };
    try {
      const res = await db.insert<Task>("tasks", task);
      setData(prev => ({ ...prev, tasks: [...prev.tasks, res] }));
    } catch {
      setData(prev => ({ ...prev, tasks: [...prev.tasks, task as Task] }));
    }
  }, []);

  const moveTask = useCallback(async (id: string, kanban_column: string) => {
    await db.update<Task>("tasks", id, { kanban_column }).catch(e => { console.error(e); flagError(); });
    setData(d => ({ ...d, tasks: d.tasks.map(t => t.id === id ? { ...t, kanban_column } : t) }));
  }, [flagError]);

  const deleteTask = useCallback(async (id: string) => {
    await db.delete("tasks", id).catch(e => { console.error(e); flagError(); });
    setData(d => ({ ...d, tasks: d.tasks.filter(t => t.id !== id) }));
  }, [flagError]);

  const addMessage = useCallback(async (msg: Partial<Message>) => {
    const full = { ...msg, id: msg.id || `m-${Date.now()}`, is_read: false, created_at: new Date().toISOString() } as Message;
    try {
      const res = await db.insert<Message>("messages", full);
      setData(d => ({ ...d, messages: [res, ...d.messages] }));
    } catch {
      setData(d => ({ ...d, messages: [full, ...d.messages] }));
    }
  }, []);

  const markRead = useCallback(async (id: string) => {
    await db.update<Message>("messages", id, { is_read: true }).catch(e => { console.error(e); flagError(); });
    setData(d => ({ ...d, messages: d.messages.map(m => m.id === id ? { ...m, is_read: true } : m) }));
  }, [flagError]);

  const deleteMessage = useCallback(async (id: string) => {
    await db.delete("messages", id).catch(e => { console.error(e); flagError(); });
    setData(d => ({ ...d, messages: d.messages.filter(m => m.id !== id) }));
  }, [flagError]);

  const addAppointment = useCallback(async (appt: Partial<Appointment>) => {
    const full = { ...appt, id: appt.id || `a-${Date.now()}`, created_at: new Date().toISOString() } as Appointment;
    try {
      const res = await db.insert<Appointment>("appointments", full);
      setData(d => ({ ...d, appointments: [...d.appointments, res] }));
    } catch {
      setData(d => ({ ...d, appointments: [...d.appointments, full] }));
    }
  }, []);

  const updateAppointment = useCallback(async (id: string, updates: Partial<Appointment>) => {
    await db.update<Appointment>("appointments", id, updates).catch(e => { console.error(e); flagError(); });
    setData(d => ({ ...d, appointments: d.appointments.map(a => a.id === id ? { ...a, ...updates } : a) }));
  }, [flagError]);

  const deleteAppointment = useCallback(async (id: string) => {
    await db.delete("appointments", id).catch(e => { console.error(e); flagError(); });
    setData(d => ({ ...d, appointments: d.appointments.filter(a => a.id !== id) }));
  }, [flagError]);

  const addKnowledgeEntry = useCallback(async (entry: Partial<KnowledgeEntry>) => {
    const full = { ...entry, id: entry.id || `k-${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as KnowledgeEntry;
    try {
      const res = await db.insert<KnowledgeEntry>("knowledge_base", full);
      setData(d => ({ ...d, knowledgeBase: [res, ...d.knowledgeBase] }));
    } catch {
      setData(d => ({ ...d, knowledgeBase: [full, ...d.knowledgeBase] }));
    }
  }, []);

  const updateKnowledgeEntry = useCallback(async (id: string, updates: Partial<KnowledgeEntry>) => {
    const withTimestamp = { ...updates, updated_at: new Date().toISOString() };
    await db.update<KnowledgeEntry>("knowledge_base", id, withTimestamp).catch(e => { console.error(e); flagError(); });
    setData(d => ({ ...d, knowledgeBase: d.knowledgeBase.map(k => k.id === id ? { ...k, ...withTimestamp } : k) }));
  }, [flagError]);

  const deleteKnowledgeEntry = useCallback(async (id: string) => {
    await db.delete("knowledge_base", id).catch(e => { console.error(e); flagError(); });
    setData(d => ({ ...d, knowledgeBase: d.knowledgeBase.filter(k => k.id !== id) }));
  }, [flagError]);

  const addSubscription = useCallback(async (sub: Partial<Subscription>) => {
    const full = { ...sub, id: sub.id || `sub-${Date.now()}`, created_at: new Date().toISOString() } as Subscription;
    try {
      const res = await db.insert<Subscription>("subscriptions", full);
      setData(d => ({ ...d, subscriptions: [res, ...(d.subscriptions || [])] }));
    } catch {
      setData(d => ({ ...d, subscriptions: [full, ...(d.subscriptions || [])] }));
    }
  }, []);

  const updateSubscription = useCallback(async (id: string, updates: Partial<Subscription>) => {
    await db.update<Subscription>("subscriptions", id, updates).catch(e => { console.error(e); flagError(); });
    setData(d => ({ ...d, subscriptions: (d.subscriptions || []).map(s => s.id === id ? { ...s, ...updates } : s) }));
  }, [flagError]);

  const deleteSubscription = useCallback(async (id: string) => {
    await db.delete("subscriptions", id).catch(e => { console.error(e); flagError(); });
    setData(d => ({ ...d, subscriptions: (d.subscriptions || []).filter(s => s.id !== id) }));
  }, [flagError]);

  const deleteApplication = useCallback(async (id: string) => {
    await db.delete("applications", id).catch(e => { console.error(e); flagError(); });
    setData(d => ({ ...d, applications: d.applications.filter(a => a.id !== id) }));
  }, [flagError]);

  const deleteSentEmail = useCallback(async (id: string) => {
    await db.delete("sent_emails", id).catch(e => { console.error(e); flagError(); });
    setData(d => ({ ...d, sent_emails: d.sent_emails.filter(e => e.id !== id) }));
  }, [flagError]);

  const addSiteProject = useCallback(async (item: Partial<SiteProject>) => {
    const full = { ...item, id: item.id || `sp-${Date.now()}`, is_live: item.is_live ?? true, sort_order: item.sort_order ?? 99 } as SiteProject;
    try {
      const res = await db.insert<SiteProject>("site_projects", full);
      setData(d => ({ ...d, site_projects: [...(d.site_projects || []), res] }));
    } catch {
      setData(d => ({ ...d, site_projects: [...(d.site_projects || []), full] }));
    }
  }, []);

  const updateSiteProject = useCallback(async (id: string, updates: Partial<SiteProject>) => {
    await db.update<SiteProject>("site_projects", id, updates).catch(e => { console.error(e); flagError(); });
    setData(d => ({ ...d, site_projects: (d.site_projects || []).map(p => p.id === id ? { ...p, ...updates } : p) }));
  }, [flagError]);

  const deleteSiteProject = useCallback(async (id: string) => {
    await db.delete("site_projects", id).catch(e => { console.error(e); flagError(); });
    setData(d => ({ ...d, site_projects: (d.site_projects || []).filter(p => p.id !== id) }));
  }, [flagError]);

  const addSiteService = useCallback(async (item: Partial<SiteService>) => {
    const full = { ...item, id: item.id || `ss-${Date.now()}`, active: item.active ?? true, sort_order: item.sort_order ?? 99, tabs: item.tabs ?? [], features: item.features ?? [], metrics: item.metrics ?? [] } as SiteService;
    try {
      const res = await db.insert<SiteService>("site_services", full);
      setData(d => ({ ...d, site_services: [...(d.site_services || []), res] }));
    } catch {
      setData(d => ({ ...d, site_services: [...(d.site_services || []), full] }));
    }
  }, []);

  const updateSiteService = useCallback(async (id: string, updates: Partial<SiteService>) => {
    await db.update<SiteService>("site_services", id, updates).catch(e => { console.error(e); flagError(); });
    setData(d => ({ ...d, site_services: (d.site_services || []).map(s => s.id === id ? { ...s, ...updates } : s) }));
  }, [flagError]);

  const deleteSiteService = useCallback(async (id: string) => {
    await db.delete("site_services", id).catch(e => { console.error(e); flagError(); });
    setData(d => ({ ...d, site_services: (d.site_services || []).filter(s => s.id !== id) }));
  }, [flagError]);

  return {
    data, loading, refresh,
    chatHistory: storeChatHistory,
    setChatHistory: setStoreChatHistory,
    addChatMessage: addStoreChatMessage,
    clearChat: clearStoreChat,
    addProject, updateProject, deleteProject,
    addTask, moveTask, deleteTask,
    addMessage, markRead, deleteMessage,
    addAppointment, updateAppointment, deleteAppointment,
    addKnowledgeEntry, updateKnowledgeEntry, deleteKnowledgeEntry,
    addSubscription, updateSubscription, deleteSubscription,
    addSiteProject, updateSiteProject, deleteSiteProject,
    addSiteService, updateSiteService, deleteSiteService,
    deleteApplication, deleteSentEmail,
    syncError, clearSyncError,
  };
}

// ─────────────────────────────────────────────
// DEPLOY STATUS — IONOS Production
// ─────────────────────────────────────────────
const GH_REPO        = "Xeloriom/alhambra-web";
const GH_COMMITS_API = `https://api.github.com/repos/${GH_REPO}/commits/main`;
const DEPLOY_INFO_URL = "https://www.alhambra-web.com/deploy-info.json";

interface DeployInfo {
  commit: string;
  commit_short: string;
  message: string;
  deployed_at: string;
  status: "success" | "failed";
}

function useDeployStatus() {
  const [deployed, setDeployed]           = useState<DeployInfo | null>(null);
  const [latestSha, setLatestSha]         = useState<string | null>(null);
  const [latestMsg, setLatestMsg]         = useState<string | null>(null);
  const [latestCommitDate, setLatestCommitDate] = useState<string | null>(null);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [infoRes, ghRes] = await Promise.allSettled([
        fetch(DEPLOY_INFO_URL + "?t=" + Date.now()),
        fetch(GH_COMMITS_API, { headers: { Accept: "application/vnd.github+json" } }),
      ]);
      if (infoRes.status === "fulfilled" && infoRes.value.ok) {
        setDeployed(await infoRes.value.json());
      }
      if (ghRes.status === "fulfilled" && ghRes.value.ok) {
        const j = await ghRes.value.json();
        setLatestSha(j.sha ?? null);
        setLatestMsg(j.commit?.message?.split("\n")[0] ?? null);
        setLatestCommitDate(j.commit?.committer?.date ?? j.commit?.author?.date ?? null);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // "up to date" if SHAs match, OR if the last deploy happened after the last GitHub commit
  // (handles the case where prod is ahead of GitHub — e.g. git push hasn't been done yet)
  const isUpToDate = deployed && latestSha
    ? deployed.commit === latestSha ||
      (latestCommitDate != null && new Date(deployed.deployed_at) >= new Date(latestCommitDate))
    : null;
  return { deployed, latestSha, latestMsg, isUpToDate, loading, error, refresh: load };
}

function DeployStatus({ isMobile }: { isMobile: boolean }) {
  const { deployed, latestMsg, isUpToDate, loading, error, refresh } = useDeployStatus();

  type Cfg = { label: string; color: string; bg: string; dot: string; pulse: boolean };
  const cfgUpToDate:  Cfg = { label: "Prod à jour",         color: "#065F46", bg: "#ECFDF5", dot: "#10B981", pulse: false };
  const cfgOutdated:  Cfg = { label: "Modifs non déployées", color: "#92400E", bg: "#FEF3C7", dot: "#F59E0B", pulse: true  };
  const cfgNeverDep:  Cfg = { label: "Jamais déployé",       color: "#6B7280", bg: "#F9FAFB", dot: "#9CA3AF", pulse: false };
  const cfgUnknown:   Cfg = { label: "Inconnu",               color: "#6B7280", bg: "#F9FAFB", dot: "#9CA3AF", pulse: false };

  const cfg = loading || error ? cfgUnknown
    : !deployed ? cfgNeverDep
    : isUpToDate === true  ? cfgUpToDate
    : isUpToDate === false ? cfgOutdated
    : cfgUnknown;

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

  const shortMsg = (msg: string) => msg.slice(0, 52) + (msg.length > 52 ? "…" : "");

  return (
    <div style={{ background: cfg.bg, borderRadius: 24, padding: isMobile ? "18px 20px" : "24px 28px", border: `1px solid ${cfg.dot}22`, position: "relative", overflow: "hidden" }}>
      {cfg.pulse && (
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, transparent, ${cfg.dot}18, transparent)`, pointerEvents: "none" }}
        />
      )}

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: loading ? 0 : 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative", width: 10, height: 10 }}>
            {cfg.pulse && (
              <motion.div animate={{ scale: [1, 2], opacity: [0.6, 0] }} transition={{ duration: 1.2, repeat: Infinity }}
                style={{ position: "absolute", inset: 0, borderRadius: "50%", background: cfg.dot }} />
            )}
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: cfg.dot, position: "relative" }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.18em", color: cfg.color }}>
            IONOS Prod — {cfg.label}
          </span>
        </div>
        <button onClick={refresh} title="Actualiser"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
          <Icon d={Icons.refresh} size={14} stroke={cfg.color} />
        </button>
      </div>

      {loading && <div style={{ fontSize: 12, color: cfg.color, opacity: 0.6 }}>Chargement…</div>}
      {error   && <div style={{ fontSize: 12, color: "#991B1B" }}>Impossible de charger le statut.</div>}

      {!loading && !error && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

          {/* Deployed commit */}
          {deployed ? (
            <div style={{ background: "rgba(0,0,0,0.04)", borderRadius: 12, padding: "10px 14px" }}>
              <div style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: cfg.color, opacity: 0.6, marginBottom: 4 }}>
                Dernière mise en prod
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: cfg.color, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {shortMsg(deployed.message)}
              </div>
              <div style={{ fontSize: 10, color: cfg.color, opacity: 0.55, marginTop: 3, display: "flex", gap: 8 }}>
                <span style={{ fontFamily: "monospace", background: "rgba(0,0,0,0.08)", borderRadius: 4, padding: "1px 5px" }}>{deployed.commit_short}</span>
                <span>·</span>
                <span suppressHydrationWarning>{fmtDate(deployed.deployed_at)}</span>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 12, color: cfg.color, opacity: 0.6 }}>Aucun deploy détecté sur IONOS.</div>
          )}

          {/* Latest git commit (if different) */}
          {isUpToDate === false && latestMsg && (
            <div style={{ background: `${cfg.dot}18`, borderRadius: 12, padding: "10px 14px", borderLeft: `3px solid ${cfg.dot}` }}>
              <div style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: cfg.color, opacity: 0.6, marginBottom: 4 }}>
                Dernier commit Git (non déployé)
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: cfg.color, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {shortMsg(latestMsg)}
              </div>
              <div style={{ fontSize: 10, color: cfg.color, opacity: 0.55, marginTop: 3 }}>
                Lance <code style={{ background: "rgba(0,0,0,0.08)", borderRadius: 4, padding: "1px 5px", fontFamily: "monospace" }}>yarn ship</code> pour déployer
              </div>
            </div>
          )}

          {isUpToDate === true && (
            <div style={{ fontSize: 11, color: cfg.color, opacity: 0.6, display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={cfg.dot} strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              Prod identique au dernier commit Git
            </div>
          )}
        </div>
      )}
    </div>
  );
}







// ─────────────────────────────────────────────
// DEVIS GENERATOR
// ─────────────────────────────────────────────
const SERVICES_CATALOG = [
  { id:"vitrine",      label:"Site Vitrine",                     price:1200, details:["Jusqu'à 5 pages (Accueil, Services, À propos, Contact…)","Design responsive mobile & desktop sur-mesure","Formulaire de contact avec notifications email","Intégration Google Maps","SEO technique : balises, sitemap.xml, robots.txt","Score Lighthouse ≥ 95/100","Déploiement & mise en ligne inclus"] },
  { id:"vitrine_xl",   label:"Site Vitrine Premium",             price:2200, details:["Jusqu'à 10 pages + navigation avancée","Design UI/UX Figma inclus","Animations & micro-interactions","Blog / CMS simple intégré","SEO avancé + données structurées schema.org","Score Lighthouse ≥ 98/100","Suivi 1 mois offert"] },
  { id:"ecommerce",    label:"Site E-commerce",                  price:3500, details:["Catalogue produits illimité","Panier & tunnel de commande optimisé","Paiement Stripe / PayPal sécurisé","Gestion stocks & commandes + dashboard admin","Emails transactionnels automatiques","SEO e-commerce (rich snippets produits)"] },
  { id:"admin_panel",  label:"Espace Admin / CMS",               price:800,  details:["Interface admin sécurisée (login + tableau de bord)","Modification des textes, images, vidéos du site","Ajout / suppression de pages ou articles","Gestion produits ou événements","Accès multi-utilisateurs avec niveaux de droits","Formation prise en main incluse (1h)"] },
  { id:"webapp",       label:"Application Web / SaaS",           price:6000, details:["Architecture Next.js + API REST","Auth utilisateurs (JWT / OAuth)","Dashboard & admin sur-mesure","Base de données PostgreSQL / MongoDB","Déploiement cloud scalable","Support 3 mois post-livraison"] },
  { id:"mobile",       label:"Application Mobile (iOS & Android)",price:8000, details:["React Native cross-platform","Publication App Store & Google Play","Auth & profils utilisateurs","Notifications push","API back-end dédiée","Support 3 mois post-livraison"] },
  { id:"refonte",      label:"Refonte site existant",            price:1800, details:["Audit UX, performances & SEO complet","Nouveau design modernisé","Migration du contenu existant","Amélioration Core Web Vitals","Redirections 301 pour préserver le référencement"] },
  { id:"seo",          label:"Audit & Stratégie SEO",            price:800,  details:["Audit technique complet","Analyse mots-clés & concurrence","Plan d'action détaillé priorisé","Optimisation on-page (balises, titres, contenu)","Données structurées schema.org","Suivi de position 1 mois inclus"] },
  { id:"design",       label:"Design UI/UX Figma",               price:1200, details:["Wireframes + maquettes haute fidélité desktop & mobile","Prototype interactif Figma","Design system complet (couleurs, typo, composants)","3 itérations de révisions incluses","Livraison sources Figma + guide de style"] },
  { id:"chatbot",      label:"Chatbot IA intégré",               price:700,  details:["Widget chat sur votre site","Connexion API Claude / GPT-4","Base de connaissances personnalisée (FAQ, services, tarifs)","Capture de leads intégrée","Historique des conversations"] },
  { id:"maintenance",  label:"Maintenance mensuelle",            price:200,  details:["Mises à jour CMS & dépendances","Sauvegardes quotidiennes automatiques","Surveillance uptime 24h/7j","Corrections bugs (2h/mois incluses)","Rapport mensuel + support prioritaire"] },
  { id:"stripe",       label:"Paiement en ligne (Stripe)",       price:450,  details:["Stripe Checkout sécurisé (PCI DSS)","CB, Apple Pay, Google Pay, virement","Emails de confirmation automatiques","Dashboard Stripe configuré","Webhooks pour synchronisation commandes"] },
  { id:"hosting",      label:"Domaine + hébergement 1 an",       price:180,  details:["Nom de domaine .fr ou .com (1 an)","Hébergement haute performance","Certificat SSL/HTTPS auto-renouvelé","Emails pro (contact@votredomaine.fr)","CDN mondial"] },
];

type TaxMode = "normal" | "exempt";
type DevisItem = { id: number; description: string; qty: number; unitPrice: number; discount: number; details: string[] };
type DiscountType = { type: "percent" | "fixed"; value: number };

function DevisGenerator({ isMobile }: { isMobile: boolean }) {
  const [devisNum,    setDevisNum]    = useState(() => `DEV-${new Date().getFullYear()}-${Math.floor(Math.random()*9000)+1000}`);
  const [devisDate,   setDevisDate]   = useState(new Date().toISOString().split("T")[0]);
  const [validUntil,  setValidUntil]  = useState(new Date(Date.now()+30*86400000).toISOString().split("T")[0]);
  const [currency,    setCurrency]    = useState("€");
  const [taxMode,     setTaxMode]     = useState<TaxMode>("normal");
  const [taxRate,     setTaxRate]     = useState(20);
  const [showCatalog, setShowCatalog] = useState(false);
  const [copied,      setCopied]      = useState(false);
  const [logoB64,     setLogoB64]     = useState("");
  const [client, setClient] = useState({ name:"", company:"", email:"", phone:"", address:"" });
  const [rib, setRib] = useState<{ iban:string; bic:string; bank:string; holder:string }>(() => {
    if (typeof window === "undefined") return { iban:"", bic:"", bank:"", holder:"Alhambra Web" };
    try { const s = localStorage.getItem("alhambra_rib"); return s ? JSON.parse(s) : { iban:"", bic:"", bank:"", holder:"Alhambra Web" }; }
    catch { return { iban:"", bic:"", bank:"", holder:"Alhambra Web" }; }
  });
  const [items,          setItems]          = useState<DevisItem[]>([{ id:1, description:"", qty:1, unitPrice:0, discount:0, details:[] }]);
  const [globalDiscount, setGlobalDiscount] = useState<DiscountType>({ type:"percent", value:0 });
  const [notes,          setNotes]          = useState("Acompte 30% à la commande.\nSolde à la livraison du projet.\nDevis valable 30 jours à compter de la date d'émission.");

  useEffect(() => {
    fetch("/logo.png").then(r=>r.blob()).then(blob=>{
      const reader = new FileReader();
      reader.onload = () => setLogoB64(reader.result as string);
      reader.readAsDataURL(blob);
    }).catch(()=>{});
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try { localStorage.setItem("alhambra_rib", JSON.stringify(rib)); } catch {}
  }, [rib]);

  const fmt          = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits:2, maximumFractionDigits:2 });
  const lineTotal    = (i: DevisItem) => i.qty * i.unitPrice * (1 - i.discount / 100);
  const subtotalBefore = items.reduce((s,i) => s + lineTotal(i), 0);
  const gDisc = globalDiscount.type === "percent"
    ? subtotalBefore * globalDiscount.value / 100
    : Math.min(globalDiscount.value, subtotalBefore);
  const subtotalHT = subtotalBefore - gDisc;
  const taxAmt     = taxMode === "normal" ? subtotalHT * taxRate / 100 : 0;
  const total      = subtotalHT + taxAmt;
  const acompte    = total * 0.3;

  const addItem        = () => setItems(p => [...p, { id:Date.now(), description:"", qty:1, unitPrice:0, discount:0, details:[] }]);
  const removeItem     = (id:number) => { if (items.length > 1) setItems(p => p.filter(i => i.id !== id)); };
  const updateItem     = (id:number, field:keyof DevisItem, val:string|number|string[]) => setItems(p => p.map(i => i.id===id ? { ...i, [field]:val } : i));
  const addFromCatalog = (s:typeof SERVICES_CATALOG[0]) => { setItems(p=>[...p,{id:Date.now(),description:s.label,qty:1,unitPrice:s.price,discount:0,details:s.details}]); setShowCatalog(false); };

  const generateFullHTML = () => {
    const fmtD = (d:string) => { try { return new Date(d).toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"}); } catch { return d; } };
    const validItems = items.filter(i => i.description || i.unitPrice > 0);

    const rows = validItems.map((i, idx) => `
<tr style="background:${idx%2===0?"#ffffff":"#f7f7f7"}">
  <td style="padding:8px 10px;border-bottom:1px solid #e8e8e8;vertical-align:top;font-size:10px">
    <strong style="color:#0a0a0a;font-weight:700">${i.description || "—"}</strong>
    ${i.details.length > 0 ? `<br><span style="font-size:8px;color:#888;line-height:1.7">${i.details.slice(0,4).join("&nbsp;&nbsp;·&nbsp;&nbsp;")}${i.details.length>4?" …":""}</span>` : ""}
  </td>
  <td style="padding:8px 10px;border-bottom:1px solid #e8e8e8;text-align:center;font-size:10px;color:#555;vertical-align:top;white-space:nowrap">${i.qty}</td>
  <td style="padding:8px 10px;border-bottom:1px solid #e8e8e8;text-align:right;font-size:10px;color:#555;vertical-align:top;white-space:nowrap">${fmt(i.unitPrice)}&nbsp;${currency}</td>
  <td style="padding:8px 10px;border-bottom:1px solid #e8e8e8;text-align:center;font-size:10px;color:#999;vertical-align:top;white-space:nowrap">${i.discount > 0 ? `−${i.discount}%` : "—"}</td>
  <td style="padding:8px 10px;border-bottom:1px solid #e8e8e8;text-align:right;font-size:10px;font-weight:800;color:#0a0a0a;vertical-align:top;white-space:nowrap">${fmt(lineTotal(i))}&nbsp;${currency}</td>
</tr>`).join("");

    const taxRow = taxMode === "normal"
      ? `<tr><td style="font-size:9.5px;color:#666;padding:4px 0">TVA ${taxRate}%</td><td style="font-size:9.5px;font-weight:600;color:#444;padding:4px 0;text-align:right">${fmt(taxAmt)}&nbsp;${currency}</td></tr>`
      : `<tr><td colspan="2" style="font-size:8px;color:#999;font-style:italic;padding:4px 0;line-height:1.5">TVA non applicable, art.&nbsp;L.&nbsp;223 et&nbsp;s. du code des impositions sur les biens et services (CIBS)</td></tr>`;

    return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Devis ${devisNum} — Alhambra Web</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
  @page{size:A4;margin:0}
  html,body{width:210mm;background:#fff;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;color:#0a0a0a;font-size:10px;line-height:1.4}
  table{border-collapse:collapse}
</style>
</head>
<body>

<!-- ═══ HEADER ═══ -->
<div style="background:#0a0a0a;padding:9mm 14mm;display:table;width:100%;box-sizing:border-box">
  <!-- Gauche : logo + infos agence -->
  <div style="display:table-cell;vertical-align:middle;width:55%">
    <div style="display:inline-flex;align-items:center;gap:11px;margin-bottom:8px">
      <div style="width:40px;height:40px;background:#ffffff;border-radius:10px;overflow:hidden;display:flex;align-items:center;justify-content:center;flex-shrink:0">
        ${logoB64 ? `<img src="${logoB64}" style="width:28px;height:28px;object-fit:contain;display:block">` : `<span style="font-size:18px;font-weight:900;color:#0a0a0a">A</span>`}
      </div>
      <div>
        <div style="color:#ffffff;font-size:15px;font-weight:800;letter-spacing:-0.03em;line-height:1.1">Alhambra Web</div>
        <div style="color:rgba(255,255,255,0.4);font-size:6.5px;letter-spacing:0.22em;text-transform:uppercase;margin-top:2px">Agence Web &bull; Lyon</div>
      </div>
    </div>
    <div style="color:rgba(255,255,255,0.45);font-size:8px;line-height:2">
      contact@alhambra-web.com<br>
      06&nbsp;12&nbsp;83&nbsp;20&nbsp;10 &bull; www.alhambra-web.com<br>
      Lyon, 69000 France &bull; SIREN&nbsp;853&nbsp;189&nbsp;405
    </div>
  </div>
  <!-- Droite : DEVIS + référence + dates -->
  <div style="display:table-cell;vertical-align:middle;text-align:right;width:45%">
    <div style="color:#ffffff;font-size:42px;font-weight:900;letter-spacing:-0.06em;line-height:1;margin-bottom:6px">DEVIS</div>
    <div style="color:rgba(255,255,255,0.55);font-size:9.5px;font-weight:700;letter-spacing:0.08em;margin-bottom:5px">${devisNum}</div>
    <div style="color:rgba(255,255,255,0.4);font-size:8px;line-height:2">
      Émis le ${fmtD(devisDate)}<br>
      Valable jusqu'au ${fmtD(validUntil)}
    </div>
  </div>
</div>
<!-- Barre séparatrice -->
<div style="height:3px;background:#0a0a0a"></div>

<!-- ═══ CORPS ═══ -->
<div style="padding:7mm 14mm 0">

  ${client.name ? `
  <!-- CLIENT -->
  <div style="display:table;width:100%;margin-bottom:6mm">
    <div style="display:table-cell;vertical-align:top;width:58%">
      <div style="font-size:6.5px;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:#bbb;margin-bottom:5px">Facturé à</div>
      <div style="font-size:13px;font-weight:800;letter-spacing:-0.02em;color:#0a0a0a;margin-bottom:2px">${client.name}</div>
      ${client.company ? `<div style="font-size:10px;font-weight:600;color:#555;margin-bottom:2px">${client.company}</div>` : ""}
      <div style="font-size:8.5px;color:#777;line-height:1.9">${[client.email, client.phone, client.address].filter(Boolean).join("<br>")}</div>
    </div>
    <div style="display:table-cell;width:42%"></div>
  </div>
  <div style="height:1px;background:#e0e0e0;margin-bottom:6mm"></div>
  ` : ""}

  <!-- TABLE PRESTATIONS -->
  <table style="width:100%;margin-bottom:6mm">
    <thead>
      <tr style="background:#0a0a0a">
        <th style="color:#fff;font-size:7px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;padding:8px 10px;text-align:left;width:44%">Prestation</th>
        <th style="color:#fff;font-size:7px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;padding:8px 10px;text-align:center;width:8%">Qté</th>
        <th style="color:#fff;font-size:7px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;padding:8px 10px;text-align:right;width:18%">Prix unit.</th>
        <th style="color:#fff;font-size:7px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;padding:8px 10px;text-align:center;width:9%">Remise</th>
        <th style="color:#fff;font-size:7px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;padding:8px 10px;text-align:right;width:21%">Total HT</th>
      </tr>
    </thead>
    <tbody>
      ${rows || `<tr><td colspan="5" style="text-align:center;padding:20px;color:#ccc;font-style:italic;font-size:10px">Aucune prestation renseignée</td></tr>`}
    </tbody>
  </table>

  <!-- TOTAUX + CONDITIONS (côte à côte) -->
  <div style="display:table;width:100%;margin-bottom:6mm">

    <!-- Colonne gauche : conditions -->
    <div style="display:table-cell;vertical-align:top;width:52%;padding-right:10mm">
      ${notes ? `
        <div style="font-size:6.5px;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:#bbb;margin-bottom:5px">Conditions</div>
        <div style="font-size:8.5px;color:#777;line-height:1.8;white-space:pre-line">${notes.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br>")}</div>
      ` : ""}
    </div>

    <!-- Colonne droite : totaux -->
    <div style="display:table-cell;vertical-align:top;width:48%">
      <table style="width:100%">
        <tr>
          <td style="font-size:9.5px;color:#888;font-weight:500;padding:4px 0">Sous-total HT</td>
          <td style="font-size:9.5px;font-weight:600;color:#444;padding:4px 0;text-align:right">${fmt(subtotalBefore)}&nbsp;${currency}</td>
        </tr>
        ${gDisc > 0 ? `
        <tr>
          <td style="font-size:9.5px;color:#555;font-weight:500;padding:4px 0">Remise${globalDiscount.type==="percent" ? " " + globalDiscount.value + "%" : ""}</td>
          <td style="font-size:9.5px;font-weight:700;color:#555;padding:4px 0;text-align:right">−${fmt(gDisc)}&nbsp;${currency}</td>
        </tr>
        <tr>
          <td style="font-size:9.5px;color:#888;font-weight:500;padding:4px 0">Total HT après remise</td>
          <td style="font-size:9.5px;font-weight:600;color:#444;padding:4px 0;text-align:right">${fmt(subtotalHT)}&nbsp;${currency}</td>
        </tr>
        ` : ""}
        ${taxRow}
        <tr><td colspan="2" style="padding:3px 0"><div style="height:1.5px;background:#cacaca;margin:3px 0"></div></td></tr>
        <tr>
          <td style="font-size:13px;font-weight:900;color:#0a0a0a;padding:7px 0 2px">TOTAL&nbsp;${taxMode==="normal"?"TTC":"HT"}</td>
          <td style="font-size:19px;font-weight:900;color:#0a0a0a;padding:7px 0 2px;text-align:right;letter-spacing:-0.04em">${fmt(total)}&nbsp;${currency}</td>
        </tr>
        <tr>
          <td style="font-size:8px;color:#aaa;font-style:italic;padding:0">Acompte 30%</td>
          <td style="font-size:8px;color:#aaa;font-style:italic;padding:0;text-align:right">${fmt(acompte)}&nbsp;${currency}</td>
        </tr>
      </table>
    </div>
  </div>

  ${(rib.iban || rib.bic) ? `
  <!-- RIB -->
  <div style="background:#f5f5f5;border-radius:8px;padding:9px 12px;margin-bottom:6mm;border-left:3px solid #0a0a0a;display:table;width:100%;box-sizing:border-box">
    <div style="display:table-cell;vertical-align:top;width:50%">
      <div style="font-size:6.5px;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:#bbb;margin-bottom:5px">Règlement par virement</div>
      ${rib.holder ? `<div style="font-size:10px;font-weight:700;color:#0a0a0a;margin-bottom:2px">${rib.holder}</div>` : ""}
      ${rib.bank   ? `<div style="font-size:8.5px;color:#777">${rib.bank}</div>` : ""}
    </div>
    <div style="display:table-cell;vertical-align:top;text-align:right;width:50%">
      ${rib.iban ? `<div style="font-size:9.5px;font-weight:700;color:#0a0a0a;font-family:monospace;letter-spacing:0.07em;margin-bottom:3px">${rib.iban}</div>` : ""}
      ${rib.bic  ? `<div style="font-size:8px;color:#888;font-weight:600;letter-spacing:0.05em">BIC&nbsp;${rib.bic}</div>` : ""}
    </div>
  </div>
  ` : ""}

  <!-- SIGNATURES -->
  <div style="display:table;width:100%;margin-bottom:8mm">
    <div style="display:table-cell;width:50%;padding-right:8mm;vertical-align:top">
      <div style="font-size:6.5px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#bbb;margin-bottom:18px">Bon pour accord — Signature client</div>
      <div style="height:1px;background:#d0d0d0;margin-bottom:4px"></div>
      <div style="font-size:8px;color:#bbb">${client.name || "Nom, prénom &amp; date"}</div>
    </div>
    <div style="display:table-cell;width:50%;padding-left:8mm;vertical-align:top">
      <div style="font-size:6.5px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#bbb;margin-bottom:18px">Pour Alhambra Web</div>
      <div style="height:1px;background:#d0d0d0;margin-bottom:4px"></div>
      <div style="font-size:8px;color:#bbb">Alhambra Web — Lyon</div>
    </div>
  </div>

</div>

<!-- ═══ FOOTER ═══ -->
<div style="padding:4mm 14mm;border-top:1px solid #e0e0e0;display:table;width:100%;box-sizing:border-box">
  <div style="display:table-cell;vertical-align:middle">
    <div style="font-size:9px;font-weight:900;letter-spacing:-0.02em;color:#0a0a0a">Alhambra Web</div>
  </div>
  <div style="display:table-cell;vertical-align:middle;text-align:right">
    <div style="font-size:7.5px;color:#aaa;line-height:1.8">
      contact@alhambra-web.com &bull; 06 12 83 20 10 &bull; www.alhambra-web.com &bull; SIREN 853 189 405
    </div>
  </div>
</div>

</body></html>`;
  };

  const openPrint = () => {
    const w = window.open("", "_blank", "width=900,height=720");
    if (!w) { alert("Autorisez les popups dans votre navigateur."); return; }
    w.document.write(generateFullHTML());
    w.document.close();
    setTimeout(() => { w.focus(); w.print(); }, 500);
  };

  const handleCopy = () => {
    const lines = [
      `━━━ DEVIS ALHAMBRA WEB ━━━`,
      `N° ${devisNum} — Émis le ${new Date(devisDate).toLocaleDateString("fr-FR")}`,
      `Valable jusqu'au ${new Date(validUntil).toLocaleDateString("fr-FR")}`,
      "",
      client.name    ? `CLIENT  : ${client.name}${client.company?" · "+client.company:""}` : "",
      client.email   ? `Email   : ${client.email}` : "",
      client.phone   ? `Tél     : ${client.phone}` : "",
      client.address ? `Adresse : ${client.address}` : "",
      "",
      "PRESTATIONS",
      ...items.filter(i=>i.description).map(i=>`  • ${i.description} × ${i.qty}${i.discount>0?` (−${i.discount}%)`:""}  =  ${fmt(lineTotal(i))} ${currency}`),
      "",
      `Sous-total HT  : ${fmt(subtotalBefore)} ${currency}`,
      gDisc>0 ? `Remise         : −${fmt(gDisc)} ${currency}` : "",
      taxMode==="normal" ? `TVA ${taxRate}%       : ${fmt(taxAmt)} ${currency}` : "TVA non applicable (art. L. 223 CIBS)",
      `TOTAL ${taxMode==="normal"?"TTC":"HT"}      : ${fmt(total)} ${currency}`,
      `Acompte 30%    : ${fmt(acompte)} ${currency}`,
      "",
      notes ? `CONDITIONS\n${notes}` : "",
      rib.iban ? `\nVIREMENT : ${rib.iban}${rib.bic?" · BIC "+rib.bic:""}` : "",
      `\nAlhambra Web · SIREN 853 189 405 · contact@alhambra-web.com`,
    ].filter(l=>l!=="").join("\n");
    navigator.clipboard.writeText(lines);
    setCopied(true);
    setTimeout(()=>setCopied(false), 2500);
  };

  const card: React.CSSProperties     = { background:"white", borderRadius:20, padding:24, marginBottom:16 };
  const lbl: React.CSSProperties      = { fontSize:9, fontWeight:900, letterSpacing:"0.2em", textTransform:"uppercase" as const, color:"rgba(0,0,0,0.3)", display:"block", marginBottom:6 };
  const inp: React.CSSProperties      = { width:"100%", border:"1.5px solid rgba(0,0,0,0.08)", borderRadius:10, padding:"9px 12px", fontSize:12, fontWeight:600, background:"#FAFAFA", outline:"none", color:"#0A0A0A" };
  const smallInp: React.CSSProperties = { ...inp, padding:"7px 9px", fontSize:11 };
  const CURRENCIES = ["€","$","£","CHF","MAD","CAD"];

  return (
    <div style={{ display:"flex", gap:20, alignItems:"flex-start", flexDirection:isMobile?"column":"row" }}>

      {/* ── FORMULAIRE ─────────────────────────────── */}
      <div style={{ flex:1, minWidth:0 }}>

        {/* Infos devis */}
        <div style={card}>
          <div style={{ fontSize:13, fontWeight:900, marginBottom:18 }}>Informations du devis</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
            <div><span style={lbl}>N° Devis</span><input style={inp} value={devisNum} onChange={e=>setDevisNum(e.target.value)} /></div>
            <div><span style={lbl}>Date d'émission</span><input style={inp} type="date" value={devisDate} onChange={e=>setDevisDate(e.target.value)} /></div>
            <div><span style={lbl}>Valable jusqu'au</span><input style={inp} type="date" value={validUntil} onChange={e=>setValidUntil(e.target.value)} /></div>
            <div>
              <span style={lbl}>Devise</span>
              <div style={{ display:"flex", gap:4 }}>
                {CURRENCIES.map(c=><button key={c} onClick={()=>setCurrency(c)} style={{ flex:1, padding:"8px 2px", border:`1.5px solid ${currency===c?"#0A0A0A":"rgba(0,0,0,0.08)"}`, borderRadius:8, background:currency===c?"#0A0A0A":"white", color:currency===c?"white":"#0A0A0A", fontSize:10, fontWeight:800, cursor:"pointer" }}>{c}</button>)}
              </div>
            </div>
          </div>
        </div>

        {/* Client */}
        <div style={card}>
          <div style={{ fontSize:13, fontWeight:900, marginBottom:18 }}>Client</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {[{k:"name",l:"Nom complet",ph:"Jean Dupont"},{k:"company",l:"Société",ph:"Ma Société SARL"},{k:"email",l:"Email",ph:"jean@exemple.fr"},{k:"phone",l:"Téléphone",ph:"06 12 34 56 78"}].map(f=>(
              <div key={f.k}><span style={lbl}>{f.l}</span><input style={inp} placeholder={f.ph} value={client[f.k as keyof typeof client]} onChange={e=>setClient(c=>({...c,[f.k]:e.target.value}))} /></div>
            ))}
            <div style={{ gridColumn:"1/-1" }}><span style={lbl}>Adresse</span><input style={inp} placeholder="12 rue des Fleurs, 69000 Lyon" value={client.address} onChange={e=>setClient(c=>({...c,address:e.target.value}))} /></div>
          </div>
        </div>

        {/* Prestations */}
        <div style={card}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
            <div style={{ fontSize:13, fontWeight:900 }}>Prestations</div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>setShowCatalog(v=>!v)} style={{ padding:"7px 14px", background:showCatalog?"#0A0A0A":"rgba(0,0,0,0.05)", border:"none", borderRadius:10, fontSize:11, fontWeight:800, color:showCatalog?"white":"#0A0A0A", cursor:"pointer" }}>
                {showCatalog?"✕ Fermer":"⚡ Catalogue"}
              </button>
              <button onClick={addItem} style={{ padding:"7px 16px", background:"#0A0A0A", border:"none", borderRadius:10, fontSize:11, fontWeight:800, color:"white", cursor:"pointer" }}>+ Ligne</button>
            </div>
          </div>

          {showCatalog && (
            <div style={{ background:"#F5F5F5", borderRadius:14, padding:14, marginBottom:18, maxHeight:340, overflowY:"auto" }}>
              <div style={{ ...lbl, marginBottom:10 }}>Sélectionner une prestation</div>
              {SERVICES_CATALOG.map(s=>(
                <button key={s.id} onClick={()=>addFromCatalog(s)} style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"10px 14px", background:"white", border:"1px solid rgba(0,0,0,0.06)", borderRadius:10, marginBottom:6, cursor:"pointer", textAlign:"left", gap:8 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:700, marginBottom:3 }}>{s.label}</div>
                    <div style={{ fontSize:9, color:"#888", lineHeight:1.6 }}>{s.details.slice(0,3).join(" · ")}{s.details.length>3?" …":""}</div>
                  </div>
                  <span style={{ fontSize:13, fontWeight:900, whiteSpace:"nowrap", flexShrink:0 }}>{s.price.toLocaleString("fr-FR")} {currency}</span>
                </button>
              ))}
            </div>
          )}

          <div style={{ display:"grid", gridTemplateColumns:"1fr 52px 108px 68px 28px", gap:6, marginBottom:8 }}>
            {["Description","Qté","Prix unit.","Remise %",""].map(h=><div key={h} style={{ fontSize:8, fontWeight:900, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:"#bbb" }}>{h}</div>)}
          </div>
          {items.map((item,idx)=>(
            <div key={item.id} style={{ marginBottom:8 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 52px 108px 68px 28px", gap:6, alignItems:"center" }}>
                <input style={smallInp} placeholder={`Prestation ${idx+1}`} value={item.description} onChange={e=>updateItem(item.id,"description",e.target.value)} />
                <input style={{ ...smallInp, textAlign:"center" }} type="number" min="0.5" step="0.5" value={item.qty} onChange={e=>updateItem(item.id,"qty",Number(e.target.value))} />
                <input style={{ ...smallInp, textAlign:"right" }} type="number" min="0" step="50" value={item.unitPrice} onChange={e=>updateItem(item.id,"unitPrice",Number(e.target.value))} />
                <input style={{ ...smallInp, textAlign:"center" }} type="number" min="0" max="100" value={item.discount} onChange={e=>updateItem(item.id,"discount",Number(e.target.value))} />
                <button onClick={()=>removeItem(item.id)} style={{ width:28, height:28, background:"none", border:"1px solid rgba(0,0,0,0.08)", borderRadius:8, cursor:"pointer", color:"#EF4444", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>×</button>
              </div>
              {item.details.length>0&&(
                <div style={{ marginTop:4, display:"flex", flexWrap:"wrap", gap:4 }}>
                  {item.details.map((d,i)=><span key={i} style={{ fontSize:9, background:"#F0F0F0", color:"#666", borderRadius:6, padding:"2px 7px", fontWeight:600 }}>{d}</span>)}
                </div>
              )}
            </div>
          ))}
          {items.some(i=>i.description||i.unitPrice>0)&&(
            <div style={{ marginTop:12, padding:"12px 14px", background:"#F8F8F8", borderRadius:12, borderLeft:"3px solid #0A0A0A" }}>
              {items.filter(i=>i.description||i.unitPrice>0).map(i=>(
                <div key={i.id} style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:4 }}>
                  <span style={{ color:"#666", fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1, paddingRight:8 }}>{i.description||"—"}{i.discount>0?` (−${i.discount}%)`:""}</span>
                  <span style={{ fontWeight:900, whiteSpace:"nowrap" }}>{fmt(lineTotal(i))} {currency}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Remise & TVA */}
        <div style={card}>
          <div style={{ fontSize:13, fontWeight:900, marginBottom:18 }}>Remise &amp; TVA</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
            <div>
              <span style={lbl}>Type remise</span>
              <div style={{ display:"flex", gap:6 }}>
                {(["percent","fixed"] as const).map(t=>(
                  <button key={t} onClick={()=>setGlobalDiscount(d=>({...d,type:t}))} style={{ flex:1, padding:"9px", border:`1.5px solid ${globalDiscount.type===t?"#0A0A0A":"rgba(0,0,0,0.08)"}`, borderRadius:10, background:globalDiscount.type===t?"#0A0A0A":"white", color:globalDiscount.type===t?"white":"#0A0A0A", fontSize:11, fontWeight:800, cursor:"pointer" }}>
                    {t==="percent"?"% Pourcent":`${currency} Fixe`}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span style={lbl}>Valeur</span>
              <input style={inp} type="number" min="0" value={globalDiscount.value} onChange={e=>setGlobalDiscount(d=>({...d,value:Number(e.target.value)}))} />
            </div>
          </div>
          <div>
            <span style={lbl}>TVA</span>
            <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
              <button onClick={()=>setTaxMode("normal")} style={{ padding:"9px 16px", border:`1.5px solid ${taxMode==="normal"?"#0A0A0A":"rgba(0,0,0,0.08)"}`, borderRadius:10, background:taxMode==="normal"?"#0A0A0A":"white", color:taxMode==="normal"?"white":"#0A0A0A", fontSize:11, fontWeight:800, cursor:"pointer" }}>
                TVA {taxRate}%
              </button>
              {taxMode==="normal"&&<input style={{ ...inp, width:72, textAlign:"center" }} type="number" min="0" max="100" value={taxRate} onChange={e=>setTaxRate(Number(e.target.value))} placeholder="%" />}
              <button onClick={()=>setTaxMode("exempt")} style={{ padding:"9px 16px", border:`1.5px solid ${taxMode==="exempt"?"#059669":"rgba(0,0,0,0.08)"}`, borderRadius:10, background:taxMode==="exempt"?"#ECFDF5":"white", color:taxMode==="exempt"?"#059669":"#555", fontSize:11, fontWeight:800, cursor:"pointer" }}>
                Non applicable (CIBS)
              </button>
            </div>
            {taxMode==="exempt"&&<div style={{ marginTop:8, fontSize:9, color:"#777", fontStyle:"italic", lineHeight:1.6, padding:"8px 12px", background:"#F0FDF4", borderRadius:8, border:"1px solid #BBF7D0" }}>TVA non applicable, art. L. 223 et s. du code des impositions sur les biens et services (CIBS)</div>}
          </div>
        </div>

        {/* RIB */}
        <div style={card}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
            <div style={{ fontSize:13, fontWeight:900 }}>Coordonnées bancaires</div>
            <span style={{ fontSize:9, background:"#ECFDF5", color:"#059669", borderRadius:6, padding:"3px 8px", fontWeight:700 }}>💾 Sauvegardé auto</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div style={{ gridColumn:"1/-1" }}><span style={lbl}>Titulaire</span><input style={inp} placeholder="Alhambra Web" value={rib.holder} onChange={e=>setRib(r=>({...r,holder:e.target.value}))} /></div>
            <div><span style={lbl}>Banque</span><input style={inp} placeholder="Crédit Agricole…" value={rib.bank} onChange={e=>setRib(r=>({...r,bank:e.target.value}))} /></div>
            <div><span style={lbl}>BIC / SWIFT</span><input style={inp} placeholder="AGRIFRPP…" value={rib.bic} onChange={e=>setRib(r=>({...r,bic:e.target.value}))} /></div>
            <div style={{ gridColumn:"1/-1" }}><span style={lbl}>IBAN</span><input style={{ ...inp, fontFamily:"monospace", letterSpacing:"0.06em" }} placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX" value={rib.iban} onChange={e=>setRib(r=>({...r,iban:e.target.value}))} /></div>
          </div>
        </div>

        {/* Notes */}
        <div style={card}>
          <div style={{ fontSize:13, fontWeight:900, marginBottom:16 }}>Conditions &amp; Notes</div>
          <textarea rows={5} style={{ ...inp, resize:"vertical", lineHeight:1.7 }} value={notes} onChange={e=>setNotes(e.target.value)} />
        </div>
      </div>

      {/* ── PANNEAU DROIT ─────────────────────────────── */}
      <div style={{ width:isMobile?"100%":310, flexShrink:0, position:"sticky", top:0, display:"flex", flexDirection:"column", gap:12 }}>

        {/* Récap */}
        <div style={{ background:"#0A0A0A", borderRadius:20, padding:22, color:"white" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div style={{ fontSize:9, fontWeight:900, letterSpacing:"0.25em", textTransform:"uppercase" as const, color:"rgba(255,255,255,0.28)" }}>Récapitulatif</div>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.18)" }}>{devisNum}</div>
          </div>
          {client.name&&(
            <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:12, padding:"9px 13px", marginBottom:12 }}>
              <div style={{ fontSize:12, fontWeight:800 }}>{client.name}</div>
              {client.company&&<div style={{ fontSize:9, color:"rgba(255,255,255,0.38)", marginTop:2 }}>{client.company}</div>}
            </div>
          )}
          <div style={{ marginBottom:14, display:"flex", flexDirection:"column", gap:5 }}>
            {items.filter(i=>i.description||i.unitPrice>0).map(i=>(
              <div key={i.id} style={{ display:"flex", justifyContent:"space-between", fontSize:11 }}>
                <span style={{ color:"rgba(255,255,255,0.38)", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontWeight:600 }}>{i.description||"—"}{i.discount>0?` (−${i.discount}%)`:""}</span>
                <span style={{ color:"rgba(255,255,255,0.7)", fontWeight:800, marginLeft:8, whiteSpace:"nowrap" }}>{fmt(lineTotal(i))} {currency}</span>
              </div>
            ))}
            {!items.some(i=>i.description||i.unitPrice>0)&&<div style={{ color:"rgba(255,255,255,0.12)", fontSize:11, fontStyle:"italic", textAlign:"center", padding:"10px 0" }}>Aucune prestation…</div>}
          </div>
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:14, display:"flex", flexDirection:"column", gap:6 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:11 }}>
              <span style={{ color:"rgba(255,255,255,0.3)", fontWeight:600 }}>Sous-total HT</span>
              <span style={{ color:"rgba(255,255,255,0.45)", fontWeight:700 }}>{fmt(subtotalBefore)} {currency}</span>
            </div>
            {gDisc>0&&<div style={{ display:"flex", justifyContent:"space-between", fontSize:11 }}>
              <span style={{ color:"rgba(255,255,255,0.3)", fontWeight:600 }}>Remise</span>
              <span style={{ color:"rgba(255,255,255,0.45)", fontWeight:700 }}>−{fmt(gDisc)} {currency}</span>
            </div>}
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:11 }}>
              <span style={{ color:"rgba(255,255,255,0.3)", fontWeight:600 }}>{taxMode==="normal"?`TVA ${taxRate}%`:"TVA non appl."}</span>
              <span style={{ color:"rgba(255,255,255,0.45)", fontWeight:700 }}>{taxMode==="normal"?fmt(taxAmt)+" "+currency:"—"}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", paddingTop:10, borderTop:"1px solid rgba(255,255,255,0.08)", marginTop:2 }}>
              <span style={{ color:"white", fontSize:14, fontWeight:900 }}>TOTAL {taxMode==="normal"?"TTC":"HT"}</span>
              <span style={{ color:"white", fontSize:22, fontWeight:900, letterSpacing:"-0.04em" }}>{fmt(total)} {currency}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:"rgba(255,255,255,0.2)" }}>
              <span>Acompte 30%</span>
              <span style={{ fontWeight:700 }}>{fmt(acompte)} {currency}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <button onClick={openPrint}
          style={{ width:"100%", padding:17, background:"#0A0A0A", color:"white", border:"none", borderRadius:14, fontSize:12, fontWeight:900, letterSpacing:"0.08em", textTransform:"uppercase" as const, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10, transition:"opacity 0.2s" }}
          onMouseEnter={e=>e.currentTarget.style.opacity="0.82"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
          <Icon d={Icons.download} size={15} stroke="white" />
          Télécharger PDF
        </button>

        <button onClick={openPrint}
          style={{ width:"100%", padding:13, background:"white", color:"#0A0A0A", border:"1.5px solid rgba(0,0,0,0.1)", borderRadius:14, fontSize:12, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"background 0.2s" }}
          onMouseEnter={e=>e.currentTarget.style.background="#F5F5F5"} onMouseLeave={e=>e.currentTarget.style.background="white"}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Imprimer
        </button>

        <button onClick={handleCopy}
          style={{ width:"100%", padding:12, background:copied?"#ECFDF5":"white", color:copied?"#059669":"#0A0A0A", border:`1.5px solid ${copied?"#10B981":"rgba(0,0,0,0.1)"}`, borderRadius:14, fontSize:11, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"all 0.2s" }}>
          <Icon d={copied?Icons.check:Icons.copy} size={12} stroke="currentColor" />
          {copied?"Copié !":"Copier (texte)"}
        </button>

        <div style={{ fontSize:9, color:"rgba(0,0,0,0.22)", textAlign:"center", lineHeight:1.6 }}>
          Dans la fenêtre d'impression : choisissez<br/><strong>Enregistrer en PDF</strong> comme destination.
        </div>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function AlhambraOS() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const store = useData();
  const { data, loading, refresh, syncError, clearSyncError } = store;
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/auth/', { method: 'DELETE' });
    router.replace('/login');
  };

  useEffect(() => {
    fetch('/api/auth/')
      .then(r => r.json())
      .then(d => { if (!d.ok) router.replace('/login?from=/admin'); })
      .catch(() => router.replace('/login?from=/admin'));
  }, [router]);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  const unreadCount = data.messages.filter(m => !m.is_read).length;
  const todayAppts = (data.appointments || []).filter(a => a.date === new Date().toISOString().split("T")[0]).length;

  const subscriptions = data.subscriptions || [];
  const expiringCount = (() => {
    const today = new Date().toISOString().split("T")[0];
    const in30 = new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0];
    return subscriptions.filter(s => s.status === "active" && s.next_billing_date >= today && s.next_billing_date <= in30).length;
  })();

  const contactsCount = (data.contact_submissions || []).filter(c => !c.is_read).length + (data.applications || []).filter(a => a.status === "pending").length;

  const MENU = [
    { id: "dashboard", label: "Dashboard", icon: Icons.dashboard },
    { id: "projects", label: "Projets", icon: Icons.projects },
    { id: "site", label: "Site Web", icon: Icons.globe },
    { id: "kanban", label: "Agile Board", icon: Icons.kanban },
    { id: "appointments", label: "Rendez-vous", icon: Icons.calendar, badge: todayAppts },
    { id: "contacts", label: "Contacts", icon: Icons.mail, badge: contactsCount },
    { id: "subscriptions", label: "Abonnements", icon: Icons.creditCard, badge: expiringCount },
    { id: "ai", label: "Nexus AI", icon: Icons.ai },
    { id: "messages", label: "Messages", icon: Icons.messages, badge: unreadCount },
    { id: "devis", label: "Devis", icon: Icons.receipt },
  ];

  return (
      <div style={{ display: "flex", height: "100vh", background: "#F0EEE9", fontFamily: "'Helvetica Neue', Arial, sans-serif", overflow: "hidden" }}>
        {syncError && (
          <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 9999, background: "#EF4444", color: "white", padding: "12px 20px 12px 16px", borderRadius: 12, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 8px 32px rgba(239,68,68,0.35)", whiteSpace: "nowrap" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {syncError}
            <button onClick={clearSyncError} style={{ background: "rgba(255,255,255,0.25)", border: "none", borderRadius: 6, color: "white", cursor: "pointer", fontSize: 13, fontWeight: 900, padding: "2px 8px", marginLeft: 4 }}>×</button>
          </div>
        )}
        {/* SIDEBAR */}
        <aside style={{
          width: sidebarOpen ? 280 : 72, minWidth: sidebarOpen ? 280 : 72,
          background: "#0A0A0A", display: isMobile ? "none" : "flex", flexDirection: "column",
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
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                <button onClick={() => { refresh(); }} style={{ width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "rgba(255,255,255,0.5)", padding: "10px", cursor: "pointer", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <Icon d={Icons.refresh} size={12} stroke="rgba(255,255,255,0.5)" /> Actualiser
                </button>
                <button onClick={logout} style={{ width: "100%", background: "transparent", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, color: "rgba(239,68,68,0.5)", padding: "10px", cursor: "pointer", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.1)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(239,68,68,0.8)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(239,68,68,0.5)"; }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Déconnexion
                </button>
              </div>
          )}

          {sidebarOpen && (
              <div style={{ marginTop: 12, background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ width: 6, height: 6, background: "#10B981", borderRadius: "50%", display: "inline-block" }} />
                  <span style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.5)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                API Connectée
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
          <div style={{ padding: isMobile ? "1rem 1rem 1rem" : "2rem 3rem 1.5rem", background: "#F0EEE9", flexShrink: 0 }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(0,0,0,0.25)", letterSpacing: "0.5em", textTransform: "uppercase", marginBottom: 4 }}>
              Alhambra OS v3.0{mounted ? ` — ${new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}` : ""}
            </div>
            <h1 style={{ fontSize: isMobile ? "min(10vw, 36px)" : "min(8vw, 56px)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: 0.85, color: "#0A0A0A", margin: 0 }}>
              {activeTab === "dashboard" ? "Tableau de bord" : activeTab === "projects" ? "Projets" : activeTab === "site" ? "Site Web" : activeTab === "kanban" ? "Agile Board" : activeTab === "appointments" ? "Rendez-vous" : activeTab === "contacts" ? "Contacts" : activeTab === "subscriptions" ? "Abonnements" : activeTab === "ai" ? "Nexus AI" : activeTab === "devis" ? "Générateur de Devis" : "Messages"}.
            </h1>
          </div>

          <div data-lenis-prevent style={{ flex: 1, overflow: "auto", padding: isMobile ? "0.5rem 1rem 5rem" : "0.5rem 3rem 3rem", contentVisibility: 'auto' }}>
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}>
                {activeTab === "dashboard" && <Dashboard data={data} setActiveTab={setActiveTab} isMobile={isMobile} />}
                {activeTab === "projects" && <Projects data={data} store={store} isMobile={isMobile} />}
                {activeTab === "site" && <SiteManager data={data} store={store} isMobile={isMobile} />}
                {activeTab === "kanban" && <Kanban data={data} store={store} isMobile={isMobile} />}
                {activeTab === "appointments" && <Appointments data={data} store={store} isMobile={isMobile} />}
                {activeTab === "contacts" && <Contacts data={data} store={store} isMobile={isMobile} />}
                {activeTab === "subscriptions" && <Subscriptions data={data} store={store} isMobile={isMobile} />}
                {activeTab === "ai" && <AiNexus data={data} chatHistory={store.chatHistory} setChatHistory={store.setChatHistory} addChatMessage={store.addChatMessage} store={store} isMobile={isMobile} />}
                {activeTab === "messages" && <Messages data={data} store={store} isMobile={isMobile} />}
                {activeTab === "devis" && <DevisGenerator isMobile={isMobile} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {isMobile && (
            <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0A0A0A', display: 'flex', overflowX: 'auto', zIndex: 200, borderTop: '1px solid rgba(255,255,255,0.06)', paddingBottom: 'env(safe-area-inset-bottom)', scrollbarWidth: 'none' }}>
                {MENU.map(item => (
                    <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
                        flex: '0 0 auto', minWidth: 56, padding: '8px 4px 10px', background: 'none', border: 'none',
                        color: activeTab === item.id ? 'white' : 'rgba(255,255,255,0.28)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                        cursor: 'pointer', position: 'relative', transition: 'color 0.2s'
                    }}>
                        {item.badge !== undefined && item.badge > 0 && (
                            <span style={{ position: 'absolute', top: 6, right: '50%', transform: 'translateX(10px)', background: '#EF4444', color: 'white', borderRadius: 99, fontSize: 8, fontWeight: 900, padding: '1px 5px' }}>{item.badge}</span>
                        )}
                        <Icon d={item.icon} size={19} strokeWidth={activeTab === item.id ? 2.2 : 1.6} />
                        <span style={{ fontSize: 7, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{item.label}</span>
                    </button>
                ))}
            </nav>
        )}
        <style>{`
        @keyframes ping { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        ::-webkit-scrollbar{width:4px;height:4px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.15);border-radius:99px}
        nav::-webkit-scrollbar{display:none}
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
function Dashboard({ data, setActiveTab, isMobile }: { data: AppData; setActiveTab: (tab: string) => void; isMobile: boolean }) {
  const appointments = data.appointments || [];
  const subs = data.subscriptions || [];
  const liveCount = data.projects.filter(p => p.status === "LIVE").length;
  const avgSeo = Math.round(data.projects.reduce((a, b) => a + b.metrics.seo, 0) / (data.projects.length || 1));
  const doneTasks = data.tasks.filter(t => t.kanban_column === "done").length;
  const upcomingAppts = appointments.filter(a => a.date >= new Date().toISOString().split("T")[0] && a.status !== "cancelled").length;
  const monthlySubCost = subs.filter(s => s.status === "active").reduce((sum, s) => {
    const pm = Number(s.price_monthly) || 0;
    const py = Number(s.price_yearly) || 0;
    if (s.billing_cycle === "monthly") return sum + pm;
    if (s.billing_cycle === "yearly") return sum + py / 12;
    return sum;
  }, 0);
  const siteProjectsCount = (data.site_projects || []).filter(p => p.is_live).length;
  const newContactsCount = (data.contact_submissions || []).filter(c => !c.is_read).length + (data.applications || []).filter(a => a.status === "pending").length;

  const stats = [
    { label: "Projets Live", value: liveCount, sub: `sur ${data.projects.length} total`, color: "#10B981", tab: "projects" },
    { label: "SEO Moyen", value: `${avgSeo}%`, sub: "tous projets", color: "#3B82F6", tab: "projects" },
    { label: "Tâches Done", value: doneTasks, sub: `sur ${data.tasks.length} total`, color: "#8B5CF6", tab: "kanban" },
    { label: "Rendez-vous", value: upcomingAppts, sub: "à venir", color: "#F59E0B", tab: "appointments" },
    { label: "Projets Site", value: siteProjectsCount, sub: `sur ${(data.site_projects || []).length} au total`, color: "#06B6D4", tab: "site" },
    { label: "Contacts", value: newContactsCount, sub: "non traités", color: "#EC4899", tab: "contacts" },
    { label: "Charges / mois", value: `${Math.round(monthlySubCost)}€`, sub: `${subs.filter(s => s.status === "active").length} abonnements actifs`, color: "#EF4444", tab: "subscriptions" },
  ];

  return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <DeployStatus isMobile={isMobile} />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 16 }}>
          {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                          onClick={() => setActiveTab(s.tab)}
                          style={{ background: "white", borderRadius: 24, padding: isMobile ? "18px 16px" : "28px 24px", border: "1px solid rgba(0,0,0,0.05)", cursor: "pointer", transition: "transform 0.2s" }}
                          onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
                          onMouseLeave={e => (e.currentTarget.style.transform = "none")}
              >
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, marginBottom: 16 }} />
                <div style={{ fontSize: isMobile ? 28 : 36, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1 }}>{s.value}</div>
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
                    <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: p.metrics.seo / 100 }} transition={{ duration: 1, delay: i * 0.1 }}
                                style={{ height: "100%", background: "#0A0A0A", borderRadius: 99, transformOrigin: "left" }} />
                  </div>
                </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
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
// DOCS IFRAME MODAL
// ─────────────────────────────────────────────
function DocsIframeModal({ url, name, onClose }: { url: string; name: string; onClose: () => void }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex", flexDirection: "column", background: "#fff" }}>
      {/* Thin top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: "#0A0A0A", flexShrink: 0, height: 48 }}>
        <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
          <a href={url} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 5, background: "#1D4ED8", color: "white", borderRadius: 8, padding: "5px 12px", fontSize: 10, fontWeight: 700, textDecoration: "none" }}>
            <Icon d={Icons.externalLink} size={10} stroke="white" /> Ouvrir
          </a>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", color: "white", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>×</button>
        </div>
      </div>
      {/* Spinner while loading */}
      {!loaded && (
        <div style={{ position: "absolute", inset: 0, top: 48, display: "flex", alignItems: "center", justifyContent: "center", background: "#f9f9f9", zIndex: 1 }}>
          <div style={{ width: 36, height: 36, border: "3px solid rgba(0,0,0,0.08)", borderTopColor: "#0A0A0A", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
      <iframe
        key={url}
        src={url}
        onLoad={() => setLoaded(true)}
        style={{ flex: 1, border: "none", width: "100%", background: "white", display: "block" }}
        title={`Docs — ${name}`}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────
function Projects({ data, store, isMobile }: { data: AppData; store: ReturnType<typeof useData>; isMobile: boolean }) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", client: "", category: "", year: new Date().getFullYear().toString(), status: "BETA", description: "", liveLink: "", docsLink: "", seo: 90, performance: 90, accessibility: 90 });
  const [docsModal, setDocsModal] = useState<{ url: string; name: string } | null>(null);

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

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
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
                        {p.links?.docs && (
                            <button onClick={() => setDocsModal({ url: p.links.docs!, name: p.name })} style={{ display: "flex", alignItems: "center", gap: 6, background: "#EFF6FF", color: "#1D4ED8", borderRadius: 10, padding: "8px 14px", fontSize: 10, fontWeight: 700, border: "none", cursor: "pointer" }}>
                              <Icon d={Icons.externalLink} size={12} stroke="#1D4ED8" /> Lien Docs
                            </button>
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
                          data-lenis-prevent style={{ background: "white", borderRadius: 32, padding: 40, width: "min(640px, 95vw)", maxHeight: "90vh", overflow: "auto" }}>
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

        {/* ── Docs iframe modal ── */}
        {docsModal && <DocsIframeModal url={docsModal.url} name={docsModal.name} onClose={() => setDocsModal(null)} />}
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

function Kanban({ data, store, isMobile }: { data: AppData; store: ReturnType<typeof useData>; isMobile: boolean }) {
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

        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' as any, marginLeft: isMobile ? -16 : 0, paddingLeft: isMobile ? 16 : 0, paddingRight: isMobile ? 16 : 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(4, 240px)" : "repeat(4, 1fr)", gap: 16, alignItems: "start" }}>
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

function Appointments({ data, store, isMobile }: { data: AppData; store: ReturnType<typeof useData>; isMobile: boolean }) {
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
                          data-lenis-prevent style={{ background: "white", borderRadius: 32, padding: 40, width: "min(580px, 95vw)", maxHeight: "90vh", overflow: "auto" }}>
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
  isMobile: boolean;
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

      const response = await fetch("/api/chat/", {
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
              } else if (parsed.type === "error" && parsed.message) {
                throw new Error(parsed.message);
              }
            } catch (e) {
              if (!(e instanceof SyntaxError)) throw e;
            }
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
          <div ref={scrollRef} data-lenis-prevent style={{ flex: 1, overflowY: "auto", padding: "28px 28px 16px", display: "flex", flexDirection: "column", gap: 16, background: "#F7F6F3" }}>
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
              <div data-lenis-prevent style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>
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
// SUBSCRIPTIONS
// ─────────────────────────────────────────────
const SUB_CATEGORIES: Record<string, { label: string; color: string; bg: string }> = {
  server:     { label: "Serveur",       color: "#3B82F6", bg: "#EFF6FF" },
  developer:  { label: "Développeur",   color: "#8B5CF6", bg: "#F5F3FF" },
  enterprise: { label: "Entreprise",    color: "#6366F1", bg: "#EEF2FF" },
  support:    { label: "Support",       color: "#10B981", bg: "#ECFDF5" },
  domain:     { label: "Domaine",       color: "#F59E0B", bg: "#FFFBEB" },
  saas:       { label: "SaaS",          color: "#14B8A6", bg: "#F0FDFA" },
  ai:         { label: "Intelligence IA", color: "#A855F7", bg: "#FAF5FF" },
  design:     { label: "Design",        color: "#EC4899", bg: "#FDF2F8" },
};

const SUB_STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  active:    { bg: "#D1FAE5", text: "#065F46", border: "#A7F3D0" },
  trial:     { bg: "#FEF3C7", text: "#92400E", border: "#FDE68A" },
  paused:    { bg: "#E5E7EB", text: "#374151", border: "#D1D5DB" },
  expired:   { bg: "#FEE2E2", text: "#991B1B", border: "#FECACA" },
  cancelled: { bg: "#F3F4F6", text: "#6B7280", border: "#E5E7EB" },
};

function Subscriptions({ data, store, isMobile }: { data: AppData; store: ReturnType<typeof useData>; isMobile: boolean }) {
  const subscriptions = data.subscriptions || [];
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState<"monthly" | "yearly">("monthly");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const blankForm: Partial<Subscription> = { name: "", provider: "", category: "server", price_monthly: 0, price_yearly: 0, billing_cycle: "monthly", status: "active", next_billing_date: "", auto_renew: true, notes: "", url: "" };
  const [form, setForm] = useState<Partial<Subscription>>(blankForm);

  const today = new Date().toISOString().split("T")[0];
  const in30 = new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0];

  const activeSubs = subscriptions.filter(s => s.status === "active");
  const totalMonthly = activeSubs.reduce((sum, s) => {
    const pm = Number(s.price_monthly) || 0;
    const py = Number(s.price_yearly) || 0;
    if (s.billing_cycle === "monthly") return sum + pm;
    if (s.billing_cycle === "yearly") return sum + py / 12;
    return sum;
  }, 0);
  const totalYearly = activeSubs.reduce((sum, s) => {
    const pm = Number(s.price_monthly) || 0;
    const py = Number(s.price_yearly) || 0;
    if (s.billing_cycle === "monthly") return sum + pm * 12;
    if (s.billing_cycle === "yearly") return sum + py;
    return sum;
  }, 0);
  const expiringSoon = subscriptions.filter(s => s.status === "active" && s.next_billing_date >= today && s.next_billing_date <= in30).length;

  const filtered = filter === "all" ? subscriptions : subscriptions.filter(s => s.category === filter);

  const openAdd = () => { setEditId(null); setForm(blankForm); setShowForm(true); };
  const openEdit = (s: Subscription) => { setEditId(s.id); setForm({ ...s }); setShowForm(true); };
  const save = async () => {
    if (!form.name?.trim()) return;
    if (editId) await store.updateSubscription(editId, form);
    else await store.addSubscription(form);
    setShowForm(false);
  };

  const getDaysUntil = (dateStr: string) => {
    if (!dateStr) return null;
    return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
  };

  const inputStyle: React.CSSProperties = { width: "100%", background: "#F8F8F8", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 14, fontWeight: 600, outline: "none" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(0,0,0,0.4)", marginBottom: 8 };

  return (
    <div>
      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Coût mensuel", value: `${totalMonthly.toFixed(0)}€`, sub: "toutes plateformes actives", color: "#3B82F6" },
          { label: "Coût annuel", value: `${totalYearly.toFixed(0)}€`, sub: "projection 12 mois", color: "#8B5CF6" },
          { label: "Renouvellements", value: expiringSoon.toString(), sub: "dans les 30 jours", color: expiringSoon > 0 ? "#EF4444" : "#10B981" },
          { label: "Actifs", value: activeSubs.length.toString(), sub: `sur ${subscriptions.length} abonnements`, color: "#10B981" },
        ].map(card => (
          <div key={card.label} style={{ background: "white", borderRadius: 24, padding: "24px 20px", border: "1px solid rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(0,0,0,0.3)", marginBottom: 10 }}>{card.label}</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: card.color, letterSpacing: "-0.04em", lineHeight: 1 }}>{card.value}</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(0,0,0,0.35)", marginTop: 6 }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Actions row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[{ id: "all", label: "Tout" }, ...Object.entries(SUB_CATEGORIES).map(([id, c]) => ({ id, label: c.label }))].map(cat => (
            <button key={cat.id} onClick={() => setFilter(cat.id)}
              style={{ background: filter === cat.id ? "#0A0A0A" : "white", color: filter === cat.id ? "white" : "rgba(0,0,0,0.55)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 99, padding: "7px 16px", fontSize: 10, fontWeight: 800, textTransform: "uppercase", cursor: "pointer", letterSpacing: "0.08em", transition: "all 0.2s" }}>
              {cat.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ background: "white", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 99, display: "flex", padding: 3 }}>
            {(["monthly", "yearly"] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                style={{ background: view === v ? "#0A0A0A" : "transparent", color: view === v ? "white" : "rgba(0,0,0,0.4)", border: "none", borderRadius: 99, padding: "7px 16px", fontSize: 10, fontWeight: 800, textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.08em" }}>
                {v === "monthly" ? "/ Mois" : "/ An"}
              </button>
            ))}
          </div>
          <button onClick={openAdd}
            style={{ background: "#0A0A0A", color: "white", border: "none", borderRadius: 99, padding: "11px 22px", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon d={Icons.plus} size={14} stroke="white" /> Ajouter
          </button>
        </div>
      </div>

      {/* Cards grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
        <AnimatePresence>
          {filtered.map(sub => {
            const cat = SUB_CATEGORIES[sub.category] || SUB_CATEGORIES.server;
            const sc = SUB_STATUS_COLORS[sub.status] || SUB_STATUS_COLORS.active;
            const pm = Number(sub.price_monthly) || 0;
            const py = Number(sub.price_yearly) || 0;
            const displayCost = sub.billing_cycle === "one_time" ? null
              : view === "monthly"
                ? (sub.billing_cycle === "yearly" ? py / 12 : pm)
                : (sub.billing_cycle === "monthly" ? pm * 12 : py);
            const daysUntil = getDaysUntil(sub.next_billing_date);
            const isUrgent = daysUntil !== null && daysUntil <= 30 && daysUntil >= 0;

            return (
              <motion.div key={sub.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                style={{ background: "white", borderRadius: 28, padding: "24px", border: `1px solid ${isUrgent ? "#FDE68A" : "rgba(0,0,0,0.05)"}`, position: "relative", overflow: "hidden" }}>
                {isUrgent && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #F59E0B, #EF4444)" }} />}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
                      <span style={{ background: cat.bg, color: cat.color, borderRadius: 8, padding: "3px 10px", fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>{cat.label}</span>
                      <span style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, borderRadius: 99, padding: "2px 8px", fontSize: 9, fontWeight: 800, textTransform: "uppercase" }}>{sub.status}</span>
                    </div>
                    <h3 style={{ fontWeight: 900, fontSize: 17, margin: "0 0 2px", fontStyle: "italic", textTransform: "uppercase", letterSpacing: "-0.02em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sub.name}</h3>
                    <p style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", fontWeight: 600, margin: 0 }}>{sub.provider}</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                    <div style={{ fontSize: 26, fontWeight: 900, color: "#0A0A0A", letterSpacing: "-0.04em", lineHeight: 1 }}>
                      {displayCost === null ? "–" : `${displayCost % 1 === 0 ? displayCost.toFixed(0) : displayCost.toFixed(2)}€`}
                    </div>
                    <div style={{ fontSize: 10, color: "rgba(0,0,0,0.3)", fontWeight: 700, marginTop: 2 }}>
                      {sub.billing_cycle === "one_time" ? "Unique" : view === "monthly" ? "/mois" : "/an"}
                    </div>
                  </div>
                </div>

                {sub.next_billing_date && (
                  <div style={{ background: isUrgent ? "#FFFBEB" : "#F8F8F8", borderRadius: 12, padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Icon d={Icons.calendar} size={12} stroke={isUrgent ? "#F59E0B" : "rgba(0,0,0,0.35)"} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: isUrgent ? "#92400E" : "rgba(0,0,0,0.5)" }}>
                        {new Date(sub.next_billing_date).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    {daysUntil !== null && (
                      <span style={{ fontSize: 10, fontWeight: 800, color: isUrgent ? "#EF4444" : "rgba(0,0,0,0.3)", background: isUrgent ? "#FEE2E2" : "transparent", borderRadius: 6, padding: isUrgent ? "2px 8px" : "0" }}>
                        {daysUntil < 0 ? "Expiré" : daysUntil === 0 ? "Aujourd'hui" : `J−${daysUntil}`}
                      </span>
                    )}
                  </div>
                )}

                {sub.notes && <p style={{ fontSize: 12, color: "rgba(0,0,0,0.45)", margin: "0 0 14px", lineHeight: 1.5 }}>{sub.notes}</p>}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: sub.auto_renew ? "#10B981" : "#9CA3AF" }} />
                    <span style={{ fontSize: 10, color: "rgba(0,0,0,0.35)", fontWeight: 700 }}>Auto-renew {sub.auto_renew ? "ON" : "OFF"}</span>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {sub.url && (
                      <a href={sub.url} target="_blank" rel="noreferrer" style={{ background: "#F1F1F1", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer", display: "flex", alignItems: "center", textDecoration: "none" }}>
                        <Icon d={Icons.externalLink} size={12} />
                      </a>
                    )}
                    <button onClick={() => openEdit(sub)} style={{ background: "#F1F1F1", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer" }}>
                      <Icon d={Icons.edit} size={12} />
                    </button>
                    <button onClick={() => store.deleteSubscription(sub.id)} style={{ background: "#FEE2E2", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer" }}>
                      <Icon d={Icons.trash} size={12} stroke="#991B1B" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "rgba(0,0,0,0.2)", fontWeight: 700, fontSize: 14 }}>
            Aucun abonnement dans cette catégorie
          </div>
        )}
      </div>

      {/* Modal form */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            data-lenis-prevent style={{ background: "white", borderRadius: 32, padding: 40, width: "min(620px, 95vw)", maxHeight: "92vh", overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
              <h2 style={{ fontWeight: 900, fontSize: 20, textTransform: "uppercase", fontStyle: "italic", margin: 0 }}>
                {editId ? "Modifier l'Abonnement" : "Nouvel Abonnement"}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: "#F1F1F1", border: "none", borderRadius: 10, padding: 8, cursor: "pointer" }}>
                <Icon d={Icons.x} size={16} />
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ gridColumn: "span 2" }}>
                <label style={labelStyle}>Nom *</label>
                <input value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} placeholder="Vercel Pro, Apple Developer, Supabase..." />
              </div>
              <div>
                <label style={labelStyle}>Fournisseur</label>
                <input value={form.provider || ""} onChange={e => setForm(f => ({ ...f, provider: e.target.value }))} style={inputStyle} placeholder="Vercel, Apple, Google..." />
              </div>
              <div>
                <label style={labelStyle}>Catégorie</label>
                <select value={form.category || "server"} onChange={e => setForm(f => ({ ...f, category: e.target.value as Subscription["category"] }))} style={inputStyle}>
                  {Object.entries(SUB_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Prix mensuel (€)</label>
                <input type="number" min="0" step="0.01" value={form.price_monthly ?? 0} onChange={e => setForm(f => ({ ...f, price_monthly: parseFloat(e.target.value) || 0 }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Prix annuel (€)</label>
                <input type="number" min="0" step="0.01" value={form.price_yearly ?? 0} onChange={e => setForm(f => ({ ...f, price_yearly: parseFloat(e.target.value) || 0 }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Cycle de facturation</label>
                <select value={form.billing_cycle || "monthly"} onChange={e => setForm(f => ({ ...f, billing_cycle: e.target.value as Subscription["billing_cycle"] }))} style={inputStyle}>
                  <option value="monthly">Mensuel</option>
                  <option value="yearly">Annuel</option>
                  <option value="one_time">Paiement unique</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Statut</label>
                <select value={form.status || "active"} onChange={e => setForm(f => ({ ...f, status: e.target.value as Subscription["status"] }))} style={inputStyle}>
                  <option value="active">Actif</option>
                  <option value="trial">Essai gratuit</option>
                  <option value="paused">En pause</option>
                  <option value="expired">Expiré</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Prochain renouvellement</label>
                <input type="date" value={form.next_billing_date || ""} onChange={e => setForm(f => ({ ...f, next_billing_date: e.target.value }))} style={inputStyle} />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={labelStyle}>URL du service</label>
                <input type="url" value={form.url || ""} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} style={inputStyle} placeholder="https://..." />
              </div>
              <div style={{ gridColumn: "span 2", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "#F8F8F8", borderRadius: 12 }}>
                <input type="checkbox" id="sub_auto_renew" checked={form.auto_renew ?? true} onChange={e => setForm(f => ({ ...f, auto_renew: e.target.checked }))} style={{ width: 18, height: 18, cursor: "pointer", accentColor: "#0A0A0A" }} />
                <label htmlFor="sub_auto_renew" style={{ ...labelStyle, margin: 0, cursor: "pointer" }}>Renouvellement automatique activé</label>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={labelStyle}>Notes</label>
                <textarea value={form.notes || ""} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} style={{ ...inputStyle, resize: "vertical" }} placeholder="Usage, membres concernés, inclusions importantes..." />
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
              <button onClick={() => { save().catch(console.error); }} style={{ flex: 1, background: "#0A0A0A", color: "white", border: "none", borderRadius: 14, padding: 16, fontSize: 11, fontWeight: 800, textTransform: "uppercase", cursor: "pointer" }}>
                {editId ? "Mettre à jour" : "Créer l'abonnement"}
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
// PROSPECT COMPOSER MODAL
// ─────────────────────────────────────────────
const DEFAULT_MESSAGE = `J'espère que vous allez bien.

Je me permets de vous contacter au sujet de votre présence en ligne. Chez Alhambra Web, nous créons des sites web sur-mesure, performants et visuellement distinctifs — avec un score Lighthouse 95+ garanti.

Seriez-vous disponible pour un échange rapide de 30 minutes afin de discuter de votre projet ?

Je reste à votre disposition pour toute question.`;

function ProspectComposer({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    to: "", toName: "", fromName: "Équipe Alhambra Web",
    subject: "Votre présence en ligne — Alhambra Web",
    message: DEFAULT_MESSAGE,
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const inputSt: React.CSSProperties = {
    width: "100%", background: "#F8F8F8", border: "1px solid rgba(0,0,0,0.09)",
    borderRadius: 12, padding: "13px 16px", fontSize: 13, fontWeight: 600,
    outline: "none", boxSizing: "border-box", color: "#0A0A0A",
  };
  const labelSt: React.CSSProperties = {
    display: "block", fontSize: 9, fontWeight: 800, textTransform: "uppercase",
    letterSpacing: "0.2em", color: "rgba(0,0,0,0.35)", marginBottom: 6,
  };

  const send = async () => {
    if (!form.to || !form.subject || !form.message) return;
    setStatus("sending");
    setErrMsg("");
    try {
      const res = await fetch("/api/admin/send-prospect/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErrMsg(j.error || "Erreur d'envoi");
        setStatus("error");
      } else {
        setStatus("sent");
      }
    } catch {
      setErrMsg("Erreur réseau");
      setStatus("error");
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, backdropFilter: "blur(6px)", padding: 16 }}>
      <motion.div initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
        style={{ background: "white", borderRadius: 28, width: "100%", maxWidth: 620, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 40px 120px rgba(0,0,0,0.3)" }}>

        {/* Header */}
        <div style={{ background: "#0A0A0A", borderRadius: "28px 28px 0 0", padding: "28px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.08)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div>
              <p style={{ margin: 0, color: "white", fontWeight: 900, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>Envoyer un email prospect</p>
              <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>via Resend · alhambra-web.com</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 99, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.5)", fontSize: 18, fontWeight: 900 }}>×</button>
        </div>

        {status === "sent" ? (
          <div style={{ padding: "60px 40px", textAlign: "center" }}>
            <div style={{ width: 64, height: 64, background: "#0A0A0A", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <h3 style={{ fontWeight: 900, fontSize: 22, fontStyle: "italic", textTransform: "uppercase", margin: "0 0 8px" }}>Email envoyé !</h3>
            <p style={{ color: "rgba(0,0,0,0.45)", fontSize: 13, margin: "0 0 32px" }}>
              Votre message a bien été envoyé à <strong>{form.toName || form.to}</strong>.
            </p>
            <button onClick={onClose} style={{ background: "#0A0A0A", color: "white", border: "none", borderRadius: 99, padding: "12px 32px", fontWeight: 800, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", cursor: "pointer" }}>
              Fermer
            </button>
          </div>
        ) : (
          <div style={{ padding: "32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={labelSt}>Email destinataire *</label>
                <input type="email" value={form.to} onChange={e => setForm(f => ({ ...f, to: e.target.value }))} placeholder="prospect@exemple.com" style={inputSt} />
              </div>
              <div>
                <label style={labelSt}>Nom du prospect</label>
                <input type="text" value={form.toName} onChange={e => setForm(f => ({ ...f, toName: e.target.value }))} placeholder="Jean Dupont" style={inputSt} />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelSt}>Expéditeur affiché</label>
              <input type="text" value={form.fromName} onChange={e => setForm(f => ({ ...f, fromName: e.target.value }))} style={inputSt} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelSt}>Objet *</label>
              <input type="text" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} style={inputSt} />
            </div>

            <div style={{ marginBottom: 8 }}>
              <label style={labelSt}>Message *</label>
              <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={9}
                style={{ ...inputSt, resize: "vertical", lineHeight: 1.7, fontFamily: "inherit" }} />
            </div>

            {/* Preview aperçu */}
            <div style={{ background: "#F5F5F5", borderRadius: 14, padding: "14px 16px", marginBottom: 20, border: "1px solid rgba(0,0,0,0.06)" }}>
              <p style={{ margin: "0 0 6px", fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(0,0,0,0.3)" }}>Aperçu envoi</p>
              <p style={{ margin: 0, fontSize: 12, color: "rgba(0,0,0,0.6)" }}>
                <strong>De :</strong> {form.fromName || "Équipe Alhambra Web"} &lt;contact@alhambra-web.com&gt;<br />
                <strong>À :</strong> {form.toName ? `${form.toName} <${form.to}>` : form.to || "—"}<br />
                <strong>Objet :</strong> {form.subject || "—"}
              </p>
            </div>

            {errMsg && (
              <div style={{ background: "#FEF2F2", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
                <p style={{ margin: 0, color: "#EF4444", fontSize: 12, fontWeight: 700 }}>{errMsg}</p>
              </div>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={send} disabled={status === "sending" || !form.to || !form.subject || !form.message}
                style={{ flex: 1, background: "#0A0A0A", color: "white", border: "none", borderRadius: 14, padding: "15px", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", cursor: "pointer", opacity: !form.to || !form.subject || !form.message || status === "sending" ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {status === "sending" ? (
                  <>
                    <svg style={{ animation: "spin 1s linear infinite" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    Envoi en cours…
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    Envoyer l&apos;email
                  </>
                )}
              </button>
              <button onClick={onClose} style={{ background: "#F1F1F1", border: "none", borderRadius: 14, padding: "15px 24px", fontSize: 11, fontWeight: 800, cursor: "pointer", color: "#0A0A0A" }}>
                Annuler
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MESSAGES
// ─────────────────────────────────────────────
function Messages({ data, store, isMobile }: { data: AppData; store: ReturnType<typeof useData>; isMobile: boolean }) {
  const [selected, setSelected] = useState<Message | null>(null);
  const [compose, setCompose] = useState(false);
  const [prospectCompose, setProspectCompose] = useState(false);
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
          <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
            <button onClick={() => setProspectCompose(true)}
                    style={{ background: "#0A0A0A", color: "white", border: "none", borderRadius: 99, padding: "12px 24px", fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Prospecter
            </button>
            <button onClick={() => setCompose(true)}
                    style={{ background: "white", color: "#0A0A0A", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 99, padding: "12px 24px", fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              <Icon d={Icons.plus} size={14} stroke="#0A0A0A" /> Nouveau message
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

        <AnimatePresence>
          {prospectCompose && <ProspectComposer onClose={() => setProspectCompose(false)} />}
        </AnimatePresence>

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

// ─────────────────────────────────────────────
// SITE MANAGER — projets & services du site public
// ─────────────────────────────────────────────
function SiteManager({ data, store, isMobile }: { data: AppData; store: ReturnType<typeof useData>; isMobile: boolean }) {
  const [subTab, setSubTab] = useState<"projects" | "services">("projects");
  const [editingProject, setEditingProject] = useState<SiteProject | null>(null);
  const [editingService, setEditingService] = useState<SiteService | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [projectForm, setProjectForm] = useState({ title: "", image: "", link: "", docs_link: "", is_live: true, sort_order: 0 });
  const [serviceForm, setServiceForm] = useState({ title_main: "", title_sub: "", features: "", tabs: "", sort_order: 0, active: true });
  const [saving, setSaving] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const siteProjects = [...(data.site_projects || [])].sort((a, b) => a.sort_order - b.sort_order);
  const siteServices = data.site_services || [];

  const reorderProjects = async (fromIdx: number, toIdx: number) => {
    if (fromIdx === toIdx) return;
    const reordered = [...siteProjects];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    // Persist new sort_order for all items
    await Promise.all(
      reordered.map((p, i) => {
        if (p.sort_order !== i) return store.updateSiteProject(p.id, { sort_order: i });
      })
    );
  };

  const cardStyle: React.CSSProperties = { background: "white", borderRadius: 20, border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden" };
  const btnPrimary: React.CSSProperties = { background: "#0A0A0A", color: "white", border: "none", borderRadius: 12, padding: "10px 20px", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer" };
  const btnSecondary: React.CSSProperties = { background: "#F1F1F1", border: "none", borderRadius: 12, padding: "10px 16px", fontSize: 11, fontWeight: 700, cursor: "pointer" };
  const inputSt: React.CSSProperties = { width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.1)", fontSize: 13, fontFamily: "inherit", background: "#FAFAFA", outline: "none" };
  const labelSt: React.CSSProperties = { fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.15em", color: "rgba(0,0,0,0.4)", display: "block", marginBottom: 6 };

  const resetProjectForm = () => { setProjectForm({ title: "", image: "", link: "", docs_link: "", is_live: true, sort_order: siteProjects.length }); setEditingProject(null); setShowProjectForm(false); };
  const resetServiceForm = () => { setServiceForm({ title_main: "", title_sub: "", features: "", tabs: "", sort_order: siteServices.length, active: true }); setEditingService(null); setShowServiceForm(false); };

  const openEditProject = (p: SiteProject) => {
    setProjectForm({ title: p.title, image: p.image, link: p.link, docs_link: p.docs_link || "", is_live: p.is_live, sort_order: p.sort_order });
    setEditingProject(p); setShowProjectForm(true);
  };

  const openEditService = (s: SiteService) => {
    setServiceForm({
      title_main: s.title_main, title_sub: s.title_sub,
      features: (s.features || []).join(", "),
      tabs: (s.tabs || []).map(t => `${t.name}|${t.text}`).join("\n"),
      sort_order: s.sort_order, active: s.active,
    });
    setEditingService(s); setShowServiceForm(true);
  };

  const saveProject = async () => {
    setSaving(true);
    try {
      const payload = { ...projectForm, sort_order: Number(projectForm.sort_order) };
      if (editingProject) await store.updateSiteProject(editingProject.id, payload);
      else await store.addSiteProject(payload);
      resetProjectForm();
    } finally { setSaving(false); }
  };

  const saveService = async () => {
    setSaving(true);
    try {
      const features = serviceForm.features.split(",").map(s => s.trim()).filter(Boolean);
      const tabs = serviceForm.tabs.split("\n").map(line => {
        const [name, ...rest] = line.split("|");
        return { name: name.trim(), text: rest.join("|").trim() };
      }).filter(t => t.name);
      const payload = { title_main: serviceForm.title_main, title_sub: serviceForm.title_sub, features, tabs, sort_order: Number(serviceForm.sort_order), active: serviceForm.active };
      if (editingService) await store.updateSiteService(editingService.id, payload);
      else await store.addSiteService({ ...payload, metrics: [] });
      resetServiceForm();
    } finally { setSaving(false); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Sub-tab bar */}
      <div style={{ display: "flex", gap: 8 }}>
        {(["projects", "services"] as const).map(t => (
          <button key={t} onClick={() => setSubTab(t)} style={{
            padding: "10px 24px", borderRadius: 99, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em",
            background: subTab === t ? "#0A0A0A" : "white", color: subTab === t ? "white" : "rgba(0,0,0,0.4)",
            transition: "all 0.2s",
          }}>
            {t === "projects" ? `Projets (${siteProjects.length})` : `Services (${siteServices.length})`}
          </button>
        ))}
      </div>

      {/* ─── PROJECTS ─── */}
      {subTab === "projects" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: 12, color: "rgba(0,0,0,0.4)", margin: 0 }}>Projets affichés dans la section Work du site public</p>
            <button onClick={() => { resetProjectForm(); setShowProjectForm(true); }} style={btnPrimary}>
              + Ajouter
            </button>
          </div>

          {showProjectForm && (
            <div style={{ ...cardStyle, padding: 28 }}>
              <h3 style={{ fontSize: 13, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 24px" }}>
                {editingProject ? "Modifier le projet" : "Nouveau projet"}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                <div style={{ gridColumn: isMobile ? "span 1" : "span 2" }}>
                  <label style={labelSt}>Titre</label>
                  <input style={inputSt} value={projectForm.title} onChange={e => setProjectForm(f => ({ ...f, title: e.target.value }))} placeholder="Ex: Mon Projet" />
                </div>
                <div style={{ gridColumn: isMobile ? "span 1" : "span 2" }}>
                  <label style={labelSt}>Image (chemin ou URL)</label>
                  <input style={inputSt} value={projectForm.image} onChange={e => setProjectForm(f => ({ ...f, image: e.target.value }))} placeholder="./images/project.png" />
                </div>
                <div style={{ gridColumn: isMobile ? "span 1" : "span 2" }}>
                  <label style={labelSt}>Lien (site live)</label>
                  <input style={inputSt} value={projectForm.link} onChange={e => setProjectForm(f => ({ ...f, link: e.target.value }))} placeholder="https://..." />
                </div>
                <div style={{ gridColumn: isMobile ? "span 1" : "span 2" }}>
                  <label style={labelSt}>Lien Docs (Notion, Drive…)</label>
                  <input style={inputSt} value={projectForm.docs_link} onChange={e => setProjectForm(f => ({ ...f, docs_link: e.target.value }))} placeholder="https://notion.so/..." />
                </div>
                <div>
                  <label style={labelSt}>Ordre d&apos;affichage</label>
                  <input type="number" style={inputSt} value={projectForm.sort_order} onChange={e => setProjectForm(f => ({ ...f, sort_order: Number(e.target.value) }))} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 24 }}>
                  <label style={{ ...labelSt, marginBottom: 0 }}>En ligne</label>
                  <div onClick={() => setProjectForm(f => ({ ...f, is_live: !f.is_live }))} style={{ width: 44, height: 24, borderRadius: 99, background: projectForm.is_live ? "#10B981" : "#D1D5DB", cursor: "pointer", transition: "background 0.2s", position: "relative" }}>
                    <div style={{ position: "absolute", top: 2, left: projectForm.is_live ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "white", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <button onClick={() => { saveProject().catch(console.error); }} disabled={saving || !projectForm.title} style={{ ...btnPrimary, opacity: saving || !projectForm.title ? 0.5 : 1 }}>
                  {saving ? "Sauvegarde…" : editingProject ? "Modifier" : "Créer"}
                </button>
                <button onClick={resetProjectForm} style={btnSecondary}>Annuler</button>
              </div>
            </div>
          )}

          <div style={cardStyle}>
            {siteProjects.length === 0 ? (
              <div style={{ padding: 48, textAlign: "center", color: "rgba(0,0,0,0.3)", fontSize: 13 }}>Aucun projet — cliquez sur Ajouter</div>
            ) : (
              <div style={{ padding: "8px 0" }}>
                {/* Header */}
                <div style={{ display: "grid", gridTemplateColumns: "40px 48px 1fr 1fr 80px 88px", alignItems: "center", padding: "8px 16px 10px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  {["", "#", "Titre", "Lien", "Statut", "Actions"].map(h => (
                    <span key={h} style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase" as const, letterSpacing: "0.18em", color: "rgba(0,0,0,0.3)" }}>{h}</span>
                  ))}
                </div>
                {/* Draggable rows */}
                {siteProjects.map((p, i) => (
                  <div
                    key={p.id}
                    draggable
                    onDragStart={() => { setDragIdx(i); }}
                    onDragEnter={() => setDragOverIdx(i)}
                    onDragOver={e => e.preventDefault()}
                    onDragEnd={() => {
                      if (dragIdx !== null && dragOverIdx !== null) reorderProjects(dragIdx, dragOverIdx).catch(console.error);
                      setDragIdx(null); setDragOverIdx(null);
                    }}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "40px 48px 1fr 1fr 80px 88px",
                      alignItems: "center",
                      padding: "10px 16px",
                      borderBottom: i < siteProjects.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none",
                      background: dragOverIdx === i && dragIdx !== i
                        ? "rgba(59,130,246,0.06)"
                        : dragIdx === i ? "rgba(0,0,0,0.03)" : "transparent",
                      borderLeft: dragOverIdx === i && dragIdx !== i ? "3px solid #3B82F6" : "3px solid transparent",
                      transition: "background 0.15s, border-color 0.15s",
                      cursor: "grab",
                      userSelect: "none",
                    }}
                  >
                    {/* Drag handle */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center", opacity: 0.25, cursor: "grab" }}>
                      {[0,1,2].map(r => (
                        <div key={r} style={{ display: "flex", gap: 3 }}>
                          <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#000" }} />
                          <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#000" }} />
                        </div>
                      ))}
                    </div>
                    {/* Sort order badge */}
                    <span style={{ fontSize: 11, fontWeight: 800, color: "rgba(0,0,0,0.25)", background: "rgba(0,0,0,0.05)", borderRadius: 6, padding: "2px 7px", display: "inline-block", width: "fit-content" }}>{i + 1}</span>
                    {/* Title + thumbnail */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
                      {p.image && (
                        <div style={{ width: 32, height: 32, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#f0f0f0" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      )}
                      <span style={{ fontWeight: 800, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</span>
                    </div>
                    {/* Link */}
                    <a href={p.link} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: 11, color: "#3B82F6", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, overflow: "hidden" }}>
                      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.link.replace(/^https?:\/\//, "").slice(0, 28)}{p.link.length > 28 ? "…" : ""}</span>
                      <Icon d={Icons.externalLink} size={10} stroke="#3B82F6" />
                    </a>
                    {/* Status */}
                    <span style={{ background: p.is_live ? "#D1FAE5" : "#F3F4F6", color: p.is_live ? "#065F46" : "#6B7280", borderRadius: 99, fontSize: 9, fontWeight: 900, padding: "3px 10px", textTransform: "uppercase" as const, width: "fit-content" }}>
                      {p.is_live ? "Live" : "Bientôt"}
                    </span>
                    {/* Actions */}
                    <div style={{ display: "flex", gap: 6 }} onClick={e => e.stopPropagation()}>
                      <button onClick={() => openEditProject(p)} style={{ background: "#F1F1F1", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer" }}>
                        <Icon d={Icons.edit} size={13} />
                      </button>
                      <button onClick={() => { if (confirm(`Supprimer "${p.title}" ?`)) store.deleteSiteProject(p.id).catch(console.error); }} style={{ background: "#FEE2E2", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer" }}>
                        <Icon d={Icons.trash} size={13} stroke="#991B1B" />
                      </button>
                    </div>
                  </div>
                ))}
                <div style={{ padding: "10px 16px", borderTop: "1px solid rgba(0,0,0,0.04)" }}>
                  <p style={{ margin: 0, fontSize: 10, color: "rgba(0,0,0,0.25)", fontWeight: 600 }}>⠿ Glisse les lignes pour réorganiser l&apos;ordre d&apos;affichage</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── SERVICES ─── */}
      {subTab === "services" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: 12, color: "rgba(0,0,0,0.4)", margin: 0 }}>Services affichés dans la section Services du site public</p>
            <button onClick={() => { resetServiceForm(); setShowServiceForm(true); }} style={btnPrimary}>
              + Ajouter
            </button>
          </div>

          {showServiceForm && (
            <div style={{ ...cardStyle, padding: 28 }}>
              <h3 style={{ fontSize: 13, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 24px" }}>
                {editingService ? "Modifier le service" : "Nouveau service"}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={labelSt}>Titre principal</label>
                  <input style={inputSt} value={serviceForm.title_main} onChange={e => setServiceForm(f => ({ ...f, title_main: e.target.value }))} placeholder="Ex: Développement" />
                </div>
                <div>
                  <label style={labelSt}>Sous-titre</label>
                  <input style={inputSt} value={serviceForm.title_sub} onChange={e => setServiceForm(f => ({ ...f, title_sub: e.target.value }))} placeholder="Ex: Web" />
                </div>
                <div style={{ gridColumn: isMobile ? "span 1" : "span 2" }}>
                  <label style={labelSt}>Fonctionnalités (séparées par virgule)</label>
                  <input style={inputSt} value={serviceForm.features} onChange={e => setServiceForm(f => ({ ...f, features: e.target.value }))} placeholder="Next.js, TypeScript, API…" />
                </div>
                <div style={{ gridColumn: isMobile ? "span 1" : "span 2" }}>
                  <label style={labelSt}>Onglets — format: Nom|Description (1 par ligne)</label>
                  <textarea rows={4} style={{ ...inputSt, resize: "vertical" }} value={serviceForm.tabs} onChange={e => setServiceForm(f => ({ ...f, tabs: e.target.value }))} placeholder={"Frontend|Next.js, React, Tailwind — les meilleures stacks.\nAnimations|Framer Motion pour des expériences mémorables."} />
                </div>
                <div>
                  <label style={labelSt}>Ordre d&apos;affichage</label>
                  <input type="number" style={inputSt} value={serviceForm.sort_order} onChange={e => setServiceForm(f => ({ ...f, sort_order: Number(e.target.value) }))} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 24 }}>
                  <label style={{ ...labelSt, marginBottom: 0 }}>Actif</label>
                  <div onClick={() => setServiceForm(f => ({ ...f, active: !f.active }))} style={{ width: 44, height: 24, borderRadius: 99, background: serviceForm.active ? "#10B981" : "#D1D5DB", cursor: "pointer", transition: "background 0.2s", position: "relative" }}>
                    <div style={{ position: "absolute", top: 2, left: serviceForm.active ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "white", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <button onClick={() => { saveService().catch(console.error); }} disabled={saving || !serviceForm.title_main} style={{ ...btnPrimary, opacity: saving || !serviceForm.title_main ? 0.5 : 1 }}>
                  {saving ? "Sauvegarde…" : editingService ? "Modifier" : "Créer"}
                </button>
                <button onClick={resetServiceForm} style={btnSecondary}>Annuler</button>
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {siteServices.length === 0 ? (
              <div style={{ ...cardStyle, padding: 48, textAlign: "center", color: "rgba(0,0,0,0.3)", fontSize: 13 }}>Aucun service — cliquez sur Ajouter</div>
            ) : siteServices.map((s, i) => (
              <div key={s.id} style={{ ...cardStyle, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "#F1F1F1", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: "rgba(0,0,0,0.3)", flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 900, fontSize: 15 }}>{s.title_main} <span style={{ color: "rgba(0,0,0,0.35)" }}>{s.title_sub}</span></div>
                  <div style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", marginTop: 3 }}>
                    {(s.tabs || []).map(t => t.name).join(" · ")}
                  </div>
                </div>
                <span style={{ background: s.active ? "#D1FAE5" : "#F3F4F6", color: s.active ? "#065F46" : "#6B7280", borderRadius: 99, fontSize: 9, fontWeight: 900, padding: "3px 10px", textTransform: "uppercase" }}>
                  {s.active ? "Actif" : "Inactif"}
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => openEditService(s)} style={{ background: "#F1F1F1", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer" }}>
                    <Icon d={Icons.edit} size={13} />
                  </button>
                  <button onClick={() => { if (confirm(`Supprimer "${s.title_main} ${s.title_sub}" ?`)) store.deleteSiteService(s.id).catch(console.error); }} style={{ background: "#FEE2E2", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer" }}>
                    <Icon d={Icons.trash} size={13} stroke="#991B1B" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// CONTACTS — soumissions formulaire & candidatures
// ─────────────────────────────────────────────
function Contacts({ data, store, isMobile }: { data: AppData; store: ReturnType<typeof useData>; isMobile: boolean }) {
  const { deleteApplication, deleteSentEmail } = store;
  const [subTab, setSubTab] = useState<"submissions" | "sent" | "applications">("submissions");
  const submissions = data.contact_submissions || [];
  const applications = data.applications || [];
  const sentEmails = data.sent_emails || [];
  const cardStyle: React.CSSProperties = { background: "white", borderRadius: 20, border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden" };

  const unreadSubmissions = submissions.filter(s => !s.is_read).length;
  const pendingApps = applications.filter(a => a.status === "pending").length;

  const parsePayload = (raw: string) => {
    try { return JSON.parse(raw); } catch { return { message: raw }; }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {(["submissions", "sent", "applications"] as const).map(t => (
          <button key={t} onClick={() => setSubTab(t)} style={{
            padding: "10px 24px", borderRadius: 99, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em",
            background: subTab === t ? "#0A0A0A" : "white", color: subTab === t ? "white" : "rgba(0,0,0,0.4)", transition: "all 0.2s",
          }}>
            {t === "submissions"
              ? `Reçus${unreadSubmissions > 0 ? ` (${unreadSubmissions} nouveaux)` : ` (${submissions.length})`}`
              : t === "sent"
              ? `Envoyés (${sentEmails.length})`
              : `Candidatures${pendingApps > 0 ? ` (${pendingApps} en attente)` : ` (${applications.length})`}`}
          </button>
        ))}
      </div>

      {subTab === "submissions" && (
        submissions.length === 0 ? (
          <div style={{ ...cardStyle, padding: 48, textAlign: "center", color: "rgba(0,0,0,0.35)", fontSize: 13 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📬</div>
            Aucun message reçu pour l&apos;instant.<br />
            <span style={{ fontSize: 11, opacity: 0.7 }}>Les soumissions du formulaire de contact apparaîtront ici.</span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {submissions.map(s => {
              const payload = parsePayload(s.payload);
              return (
                <div key={s.id} style={{ ...cardStyle, padding: "20px 24px", display: "flex", gap: 16, opacity: s.is_read ? 0.65 : 1 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.is_read ? "transparent" : "#3B82F6", marginTop: 6, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                      <div>
                        <span style={{ fontWeight: 800, fontSize: 13 }}>{s.subject || "Sans sujet"}</span>
                        <span style={{ marginLeft: 10, background: "#EEF2FF", color: "#4338CA", borderRadius: 99, fontSize: 9, fontWeight: 900, padding: "2px 8px", textTransform: "uppercase" }}>{s.type}</span>
                      </div>
                      <span style={{ fontSize: 10, color: "rgba(0,0,0,0.35)", whiteSpace: "nowrap" }}>
                        {new Date(s.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    {payload.name && <div style={{ fontSize: 12, color: "rgba(0,0,0,0.5)", marginTop: 4 }}>De : {payload.name} {payload.email ? `— ${payload.email}` : ""}</div>}
                    {payload.message && <div style={{ fontSize: 12, color: "rgba(0,0,0,0.6)", marginTop: 6, lineHeight: 1.5 }}>{String(payload.message).slice(0, 200)}{String(payload.message).length > 200 ? "…" : ""}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {subTab === "sent" && (
        sentEmails.length === 0 ? (
          <div style={{ ...cardStyle, padding: 48, textAlign: "center", color: "rgba(0,0,0,0.35)", fontSize: 13 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📤</div>
            Aucun email envoyé pour l&apos;instant.<br />
            <span style={{ fontSize: 11, opacity: 0.7 }}>Les emails prospects envoyés depuis l&apos;admin apparaîtront ici.</span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {sentEmails.map(e => (
              <div key={e.id} style={{ ...cardStyle, padding: "20px 24px", display: "flex", gap: 16 }}>
                {/* Indicateur ouvert/non-ouvert */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0, paddingTop: 2 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: e.is_opened ? "#10B981" : "rgba(0,0,0,0.12)", border: e.is_opened ? "none" : "2px solid rgba(0,0,0,0.2)" }} title={e.is_opened ? "Ouvert" : "Non ouvert"} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                    <div>
                      <span style={{ fontWeight: 800, fontSize: 13 }}>{e.subject || "Sans sujet"}</span>
                      <span style={{ marginLeft: 8, fontSize: 9, fontWeight: 900, padding: "2px 8px", borderRadius: 99, textTransform: "uppercase",
                        background: e.is_opened ? "#D1FAE5" : "#F3F4F6",
                        color: e.is_opened ? "#065F46" : "rgba(0,0,0,0.4)" }}>
                        {e.is_opened ? "✓ Ouvert" : "Non ouvert"}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 10, color: "rgba(0,0,0,0.35)", whiteSpace: "nowrap" }}>
                        {new Date(e.sent_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <button onClick={() => { if (confirm("Supprimer ce message ?")) deleteSentEmail(e.id); }} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 4px", color: "#EF4444", fontSize: 14, lineHeight: 1, borderRadius: 4, opacity: 0.6 }} title="Supprimer">🗑</button>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(0,0,0,0.5)", marginTop: 4 }}>
                    À : {e.to_name ? `${e.to_name} <${e.to_email}>` : e.to_email}
                    {e.from_name && <span style={{ marginLeft: 12, color: "rgba(0,0,0,0.3)" }}>De : {e.from_name}</span>}
                  </div>
                  {e.is_opened && e.opened_at && (
                    <div style={{ fontSize: 11, color: "#10B981", marginTop: 3 }}>
                      Ouvert le {new Date(e.opened_at).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  )}
                  <div style={{ fontSize: 12, color: "rgba(0,0,0,0.5)", marginTop: 6, lineHeight: 1.5, whiteSpace: "pre-line" }}>
                    {e.message.slice(0, 160)}{e.message.length > 160 ? "…" : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {subTab === "applications" && (
        applications.length === 0 ? (
          <div style={{ ...cardStyle, padding: 48, textAlign: "center", color: "rgba(0,0,0,0.35)", fontSize: 13 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>👤</div>
            Aucune candidature reçue.<br />
            <span style={{ fontSize: 11, opacity: 0.7 }}>Les candidatures du formulaire de recrutement apparaîtront ici.</span>
          </div>
        ) : (
          <div style={cardStyle}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  {["Candidat", "Poste", "Expérience", "Contrat", "Statut", "Date", ""].map(h => (
                    <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(0,0,0,0.35)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applications.map((a, i) => {
                  const statusColors: Record<string, { bg: string; text: string }> = { pending: { bg: "#FEF3C7", text: "#92400E" }, reviewed: { bg: "#DBEAFE", text: "#1E40AF" }, hired: { bg: "#D1FAE5", text: "#065F46" }, rejected: { bg: "#FEE2E2", text: "#991B1B" } };
                  const sc = statusColors[a.status] || statusColors.pending;
                  return (
                    <tr key={a.id} style={{ borderBottom: i < applications.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ fontWeight: 800, fontSize: 13 }}>{a.candidate_name}</div>
                        <div style={{ fontSize: 10, color: "rgba(0,0,0,0.4)" }}>{a.candidate_email}</div>
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 700 }}>{a.role}</td>
                      <td style={{ padding: "14px 20px", fontSize: 12, color: "rgba(0,0,0,0.5)" }}>{a.experience}</td>
                      <td style={{ padding: "14px 20px", fontSize: 12, color: "rgba(0,0,0,0.5)" }}>{a.contract_type}</td>
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{ background: sc.bg, color: sc.text, borderRadius: 99, fontSize: 9, fontWeight: 900, padding: "3px 10px", textTransform: "uppercase" }}>{a.status}</span>
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: 11, color: "rgba(0,0,0,0.4)" }}>
                        {new Date(a.created_at).toLocaleDateString("fr-FR")}
                      </td>
                      <td style={{ padding: "14px 20px", textAlign: "right" }}>
                        <button onClick={() => { if (confirm("Supprimer cette candidature ?")) deleteApplication(a.id); }} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 6px", color: "#EF4444", fontSize: 14, lineHeight: 1, borderRadius: 4, opacity: 0.6 }} title="Supprimer">🗑</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}