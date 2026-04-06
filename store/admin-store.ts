import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
export interface Project {
    id: string;
    name: string;
    client: string;
    tech: { frontend?: string[]; backend?: string[]; mobile?: string[]; database?: string[] };
    year: string;
    category: string;
    status: 'BETA' | 'LIVE' | 'MAINTENANCE' | 'ARCHIVED';
    description: string;
    links: { live?: string; staging?: string; repo?: string; docs?: string; };
    metrics: { seo: number; performance: number; accessibility: number };
    notes: string[];
}

export interface Task {
    id: string;
    title: string;
    project: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    column: 'backlog' | 'inprogress' | 'review' | 'done';
    created: number;
    description?: string;
}

export interface Message {
    id: string;
    from: string;
    subject: string;
    preview: string;
    time: string;
    read: boolean;
}

export interface ChatMessage {
    role: 'ai' | 'user';
    content: string;
}

// ─────────────────────────────────────────────
// DEFAULT DATA
// ─────────────────────────────────────────────
const DEFAULT_PROJECTS: Project[] = [
    {
        id: "daftar-2026", name: "DAFTAR", client: "Daftar Global Secure Core",
        tech: { mobile: ["React Native", "Expo", "AES-256"], backend: [".NET Core 9.0", "Entity Framework"], database: ["SQLite", "PostgreSQL"] },
        year: "2026", category: "Fintech / SaaS", status: "BETA",
        description: "Digitalisation sécurisée des créances pour commerçants.",
        links: { live: "https://daftar.ma", docs: "https://docs.alhambra-web.com/projects/daftar" },
        metrics: { seo: 98, performance: 99, accessibility: 100 },
        notes: ["Sync offline résolu v1.2", "Lancement APK Android prévu Q2", "475/500 places Beta"]
    },
    {
        id: "on-coaching", name: "ON Coaching", client: "ON Professional",
        tech: { frontend: ["Next.js 15", "Framer Motion", "Tailwind"], backend: ["Node.js", "Resend API"] },
        year: "2025", category: "Coaching de Luxe", status: "LIVE",
        description: "Accompagnement d'excellence pour leaders et dirigeants.",
        links: { live: "https://oncoaching.fr" },
        metrics: { seo: 100, performance: 94, accessibility: 98 },
        notes: ["Animations mobiles CSS will-change", "SEO mensuel en cours - Backlinks"]
    },
    {
        id: "xpertive", name: "Xpertive", client: "Famille Xpertive Lyon",
        tech: { frontend: ["React", "Vite"], mobile: ["React Native"], backend: ["C# .NET Core"] },
        year: "2024", category: "Industrie / Maintenance", status: "LIVE",
        description: "Ateliers de maintenance 4.0 — Solutions clés en main Lyon/AURA.",
        links: { live: "https://xpertive.fr" },
        metrics: { seo: 92, performance: 88, accessibility: 90 },
        notes: ["Fix formulaire contact SMTP", "Refonte module stock mobile planifiée"]
    },
    {
        id: "ocea", name: "Ocea Smart Building", client: "Ocea Group",
        tech: { backend: ["C#", "Windows Forms", "SQL Server"] },
        year: "2023", category: "Logiciel Industriel", status: "MAINTENANCE",
        description: "Logiciel de migration critique de données bâtiments intelligents.",
        links: {},
        metrics: { seo: 0, performance: 99, accessibility: 85 },
        notes: ["Memory leak v2 résolu", "Migration .NET 9.0 planifiée"]
    }
];

const DEFAULT_TASKS: Task[] = [
    { id: "t1", title: "Intégration SMS rappel automatique", project: "DAFTAR", priority: "HIGH", column: "backlog", created: 1735689600000 },
    { id: "t2", title: "Audit SEO mensuel + backlinks", project: "ON Coaching", priority: "MEDIUM", column: "inprogress", created: 1735689600000 },
    { id: "t3", title: "Refonte module gestion stock mobile", project: "Xpertive", priority: "LOW", column: "review", created: 1735689600000 },
    { id: "t4", title: "Migration vers .NET 9.0", project: "Ocea", priority: "HIGH", column: "done", created: 1735689600000 }
];

const DEFAULT_MESSAGES: Message[] = [
    { id: "m1", from: "Karim B.", subject: "Question Daftar APK", preview: "Bonjour, comment je peux installer l'APK sur Android directement sans passer par le Play Store ?", time: "14:02", read: false },
    { id: "m2", from: "ON Coaching", subject: "Nouveau contrat 2025", preview: "Le contrat de maintenance pour 2025 est prêt pour signature. Pouvez-vous confirmer les modalités ?", time: "Hier", read: false }
];

const DEFAULT_CHAT: ChatMessage[] = [
    { role: 'ai', content: "Nexus v3 activé 🔥 Je suis connecté à vos 4 projets et 4 tâches actives. Je peux analyser vos métriques SEO, débugger du code, ou vous aider à planifier votre sprint. Que puis-je faire pour vous ?" }
];

// ─────────────────────────────────────────────
// STORE — persisté en localStorage (compatible GitHub Pages)
// ─────────────────────────────────────────────
interface AdminState {
    activeTab: string;
    setActiveTab: (tab: string) => void;

    projects: Project[];
    addProject: (p: Project) => void;
    updateProject: (id: string, p: Partial<Project>) => void;
    deleteProject: (id: string) => void;

    tasks: Task[];
    addTask: (t: Task) => void;
    updateTask: (id: string, t: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    moveTask: (id: string, column: Task['column']) => void;

    messages: Message[];
    addMessage: (m: Message) => void;
    markRead: (id: string) => void;
    deleteMessage: (id: string) => void;

    chatHistory: ChatMessage[];
    addChatMessage: (m: ChatMessage) => void;
    clearChat: () => void;

    exportData: () => string;
    importData: (json: string) => void;
}

export const useAdminStore = create<AdminState>()(
    persist(
        (set, get) => ({
            activeTab: 'tableau-de-bord',
            setActiveTab: (tab) => set({ activeTab: tab }),

            projects: DEFAULT_PROJECTS,
            addProject: (p) => set((s) => ({ projects: [p, ...s.projects] })),
            updateProject: (id, p) => set((s) => ({ projects: s.projects.map(pr => pr.id === id ? { ...pr, ...p } : pr) })),
            deleteProject: (id) => set((s) => ({ projects: s.projects.filter(p => p.id !== id) })),

            tasks: DEFAULT_TASKS,
            addTask: (t) => set((s) => ({ tasks: [...s.tasks, t] })),
            updateTask: (id, t) => set((s) => ({ tasks: s.tasks.map(tk => tk.id === id ? { ...tk, ...t } : tk) })),
            deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter(t => t.id !== id) })),
            moveTask: (id, column) => set((s) => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, column } : t) })),

            messages: DEFAULT_MESSAGES,
            addMessage: (m) => set((s) => ({ messages: [m, ...s.messages] })),
            markRead: (id) => set((s) => ({ messages: s.messages.map(m => m.id === id ? { ...m, read: true } : m) })),
            deleteMessage: (id) => set((s) => ({ messages: s.messages.filter(m => m.id !== id) })),

            chatHistory: DEFAULT_CHAT,
            addChatMessage: (m) => set((s) => ({ chatHistory: [...s.chatHistory, m] })),
            clearChat: () => set({ chatHistory: DEFAULT_CHAT }),

            exportData: () => {
                const { projects, tasks, messages, chatHistory } = get();
                return JSON.stringify({ projects, tasks, messages, chatHistory }, null, 2);
            },
            importData: (json) => {
                try {
                    const d = JSON.parse(json);
                    set({ projects: d.projects || DEFAULT_PROJECTS, tasks: d.tasks || DEFAULT_TASKS, messages: d.messages || DEFAULT_MESSAGES });
                } catch (e) { console.error("Import failed:", e); }
            }
        }),
        {
            name: 'alhambra-os-v3',          // clé localStorage
            partialize: (s) => ({            // exclure les fonctions
                projects: s.projects,
                tasks: s.tasks,
                messages: s.messages,
                chatHistory: s.chatHistory,
            })
        }
    )
);