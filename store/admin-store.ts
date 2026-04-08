import { create } from 'zustand';

// Types complets
export interface Project {
    id: string;
    name: string;
    client: string;
    year: string;
    category: string;
    status: string;
    description: string;
    links: {
        live?: string;
        docs?: string;
    };
    metrics: {
        seo: number;
        performance: number;
        accessibility: number;
    };
    notes: string[];
}

export interface Task {
    id: string;
    title: string;
    project_id: string;  // ✅ Changé de 'project' à 'project_id'
    priority: string;
    status: string;       // ✅ Ajout du champ status
    kanban_column: string;
    created_at: string;
}

export interface Message {
    id: string;
    sender: string;      // DB column name
    subject: string;
    body: string;
    time: string;
    is_read: boolean;    // DB column name
    created_at: string;
}

export interface ChatMessage {
    role: 'user' | 'ai';
    content: string;
}

export interface KnowledgeEntry {
    id: string;
    problem: string;
    solution: string;
    tags: string[];
    project_id?: string;
    client_name?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    created_at: string;
    updated_at: string;
}

interface AdminState {
    activeTab: string;
    setActiveTab: (tab: string) => void;

    projects: Project[];
    setProjects: (p: Project[]) => void;
    addProject: (p: Project) => void;
    updateProject: (id: string, p: Partial<Project>) => void;
    deleteProject: (id: string) => void;

    tasks: Task[];
    setTasks: (t: Task[]) => void;
    addTask: (t: Task) => void;
    updateTask: (id: string, t: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    moveTask: (id: string, column: Task['kanban_column']) => void;

    messages: Message[];
    setMessages: (m: Message[]) => void;
    addMessage: (m: Message) => void;
    markRead: (id: string) => void;
    deleteMessage: (id: string) => void;

    chatHistory: ChatMessage[];
    setChatHistory: (c: ChatMessage[]) => void;
    addChatMessage: (m: ChatMessage) => void;
    clearChat: () => void;

    knowledgeBase: KnowledgeEntry[];
    setKnowledgeBase: (k: KnowledgeEntry[]) => void;
    addKnowledgeEntry: (k: KnowledgeEntry) => void;
    updateKnowledgeEntry: (id: string, k: Partial<KnowledgeEntry>) => void;
    deleteKnowledgeEntry: (id: string) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
    activeTab: 'tableau-de-bord',
    setActiveTab: (tab) => set({ activeTab: tab }),

    projects: [],
    setProjects: (projects) => set({ projects }),
    addProject: (p) => set((s) => ({ projects: [p, ...s.projects] })),
    updateProject: (id, p) => set((s) => ({
        projects: s.projects.map(pr => pr.id === id ? { ...pr, ...p } : pr)
    })),
    deleteProject: (id) => set((s) => ({
        projects: s.projects.filter(p => p.id !== id)
    })),

    tasks: [],
    setTasks: (tasks) => set({ tasks }),
    addTask: (t) => set((s) => ({ tasks: [...s.tasks, t] })),
    updateTask: (id, t) => set((s) => ({
        tasks: s.tasks.map(tk => tk.id === id ? { ...tk, ...t } : tk)
    })),
    deleteTask: (id) => set((s) => ({
        tasks: s.tasks.filter(t => t.id !== id)
    })),
    moveTask: (id, kanban_column) => set((s) => ({
        tasks: s.tasks.map(t => t.id === id ? { ...t, kanban_column } : t)
    })),

    messages: [],
    setMessages: (messages) => set({ messages }),
    addMessage: (m) => set((s) => ({ messages: [m, ...s.messages] })),
    markRead: (id) => set((s) => ({
        messages: s.messages.map(m => m.id === id ? { ...m, is_read: true } : m)
    })),
    deleteMessage: (id) => set((s) => ({
        messages: s.messages.filter(m => m.id !== id)
    })),

    chatHistory: [],
    setChatHistory: (chatHistory) => set({ chatHistory }),
    addChatMessage: (m) => set((s) => ({
        chatHistory: [...s.chatHistory, m]
    })),
    clearChat: () => set({ chatHistory: [] }),

    knowledgeBase: [],
    setKnowledgeBase: (knowledgeBase) => set({ knowledgeBase }),
    addKnowledgeEntry: (k) => set((s) => ({ knowledgeBase: [k, ...s.knowledgeBase] })),
    updateKnowledgeEntry: (id, k) => set((s) => ({
        knowledgeBase: s.knowledgeBase.map(kb => kb.id === id ? { ...kb, ...k } : kb)
    })),
    deleteKnowledgeEntry: (id) => set((s) => ({
        knowledgeBase: s.knowledgeBase.filter(k => k.id !== id)
    })),
}));
