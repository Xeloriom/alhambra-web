import { streamText, convertToModelMessages, type UIMessage } from 'ai'
import { google } from '@ai-sdk/google'

export const maxDuration = 60

// ─── Types ────────────────────────────────────────────────────────────────────

interface KBEntry {
    id: string
    problem: string
    solution: string
    tags?: string[]
    project_id?: string
    client_name?: string
    severity?: string
    url?: string
    image_url?: string
    video_url?: string
    updated_at?: string
}

interface Project {
    id: string
    name: string
    client?: string
    category?: string
    year?: string
    status?: string
    description?: string
    links?: Record<string, string>
    metrics?: Record<string, number>
    notes?: string[]
}

interface Task {
    id: string
    title: string
    project_id?: string
    priority?: string
    status?: string
    kanban_column?: string
}

interface Appointment {
    id: string
    client_name: string
    client_email?: string
    date: string
    time: string
    service?: string
    status?: string
    notes?: string
}

interface Message {
    id: string
    sender: string
    subject?: string
    body?: string
    time?: string
    is_read?: boolean
}

interface WebResource {
    id: string
    title: string
    category: string
    prompt_text?: string
    video_url?: string
    css_code?: string
    tags?: string[]
}

// ─── Supabase fetcher ─────────────────────────────────────────────────────────

async function fetchTable<T>(
    supabaseUrl: string,
    supabaseKey: string,
    table: string,
    params: string
): Promise<T[]> {
    try {
        const res = await fetch(`${supabaseUrl}/rest/v1/${table}?${params}`, {
            headers: {
                apikey: supabaseKey,
                Authorization: `Bearer ${supabaseKey}`,
            },
        })
        if (!res.ok) {
            console.error(`[${table}] HTTP ${res.status}`)
            return []
        }
        const data = await res.json()
        return Array.isArray(data) ? data : []
    } catch (e) {
        console.error(`[${table}] fetch error:`, e)
        return []
    }
}

// ─── Relevance scoring ────────────────────────────────────────────────────────

function scoreRelevance(text: string, queryTokens: string[]): number {
    const lower = text.toLowerCase()
    return queryTokens.reduce((score, token) => {
        if (token.length < 3) return score
        return score + (lower.includes(token) ? 1 : 0)
    }, 0)
}

function tokenize(query: string): string[] {
    return query
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(t => t.length >= 3)
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function POST(req: Request) {
    try {
        const { messages } = (await req.json()) as { messages: UIMessage[] }
        const userQuery = messages[messages.length - 1]?.content || ''

        console.log('🧠 NEXUS requête:', userQuery)

        const queryTokens = tokenize(String(userQuery))
        console.log('🔍 Tokens:', queryTokens)

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!

        if (!supabaseUrl || !supabaseKey) {
            console.error('❌ Variables Supabase manquantes')
        }

        // ── Fetch toutes les tables en parallèle ──────────────────────────────────
        const [knowledgeBaseRaw, projects, tasks, appointments, messages_db] =
            await Promise.all([
                fetchTable<KBEntry>(
                    supabaseUrl,
                    supabaseKey,
                    'knowledge_base',
                    'select=*&order=severity.desc,updated_at.desc&limit=150'
                ),
                fetchTable<Project>(
                    supabaseUrl,
                    supabaseKey,
                    'projects',
                    'select=*&order=created_at.desc&limit=50'
                ),
                fetchTable<Task>(
                    supabaseUrl,
                    supabaseKey,
                    'tasks',
                    'select=*&order=created_at.desc&limit=100'
                ),
                fetchTable<Appointment>(
                    supabaseUrl,
                    supabaseKey,
                    'appointments',
                    'select=*&order=date.asc&limit=50'
                ),
                fetchTable<Message>(
                    supabaseUrl,
                    supabaseKey,
                    'messages',
                    'select=*&order=created_at.desc&limit=30'
                ),
            ])

        console.log(
            `📦 Données chargées — KB:${knowledgeBaseRaw.length} | Projets:${projects.length} | Tâches:${tasks.length} | RDV:${appointments.length} | Messages:${messages_db.length}`
        )

        // ── Filtrage KB ───────────────────────────────────────────────────────────
        const knowledgeBase = knowledgeBaseRaw.filter(k => {
            const sol = k.solution || ''
            return sol.trim().length > 10
        })

        // Score chaque entrée KB
        const scoredKB = knowledgeBase
            .map(k => ({
                entry: k,
                score: scoreRelevance(
                    `${k.problem} ${k.solution} ${(k.tags || []).join(' ')} ${k.client_name || ''}`,
                    queryTokens
                ),
            }))
            .filter(x => x.score > 0 || queryTokens.length === 0)
            .sort((a, b) => {
                // Priorise: score puis sévérité
                const sevMap: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 }
                const sevA = sevMap[a.entry.severity || 'medium'] || 2
                const sevB = sevMap[b.entry.severity || 'medium'] || 2
                return b.score - a.score || sevB - sevA
            })
            .slice(0, 15)
            .map(x => x.entry)

        // Score projets
        const relevantProjects = projects
            .map(p => ({
                entry: p,
                score: scoreRelevance(
                    `${p.name} ${p.client || ''} ${p.description || ''} ${p.category || ''} ${(p.notes || []).join(' ')}`,
                    queryTokens
                ),
            }))
            .filter(x => x.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 8)
            .map(x => x.entry)

        // Score tâches
        const relevantTasks = tasks
            .map(t => ({
                entry: t,
                score: scoreRelevance(`${t.title} ${t.status || ''} ${t.priority || ''}`, queryTokens),
            }))
            .filter(x => x.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
            .map(x => x.entry)

        // RDV récents/pertinents
        const relevantAppointments = appointments
            .map(a => ({
                entry: a,
                score: scoreRelevance(
                    `${a.client_name} ${a.service || ''} ${a.notes || ''} ${a.status || ''}`,
                    queryTokens
                ),
            }))
            .filter(x => x.score > 0 || String(userQuery).toLowerCase().includes('rdv') || String(userQuery).toLowerCase().includes('rendez'))
            .sort((a, b) => b.score - a.score)
            .slice(0, 6)
            .map(x => x.entry)

        // Messages non lus ou pertinents
        const relevantMessages = messages_db
            .map(m => ({
                entry: m,
                score: scoreRelevance(
                    `${m.sender} ${m.subject || ''} ${m.body || ''}`,
                    queryTokens
                ),
            }))
            .filter(x => x.score > 0 || (!x.entry.is_read && String(userQuery).toLowerCase().includes('message')))
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map(x => x.entry)

        console.log(
            `🎯 Pertinent — KB:${scoredKB.length} | Projets:${relevantProjects.length} | Tâches:${relevantTasks.length} | RDV:${relevantAppointments.length} | Messages:${relevantMessages.length}`
        )

        // ── Statistiques globales ─────────────────────────────────────────────────
        const stats = {
            totalProjects: projects.length,
            activeProjects: projects.filter(p => p.status === 'ACTIVE' || p.status === 'IN_PROGRESS').length,
            totalTasks: tasks.length,
            pendingTasks: tasks.filter(t => t.status === 'backlog' || t.status === 'in_progress').length,
            upcomingAppointments: appointments.filter(a => new Date(a.date) >= new Date()).length,
            unreadMessages: messages_db.filter(m => !m.is_read).length,
            criticalIssues: knowledgeBase.filter(k => k.severity === 'critical').length,
        }

        // ── Construction du prompt système ───────────────────────────────────────
        const buildSection = (title: string, content: string, count: number) =>
            count > 0 ? `\n**${title} (${count} résultats)**\n${content}` : ''

        const kbSection = buildSection(
            '🔧 BASE DE CONNAISSANCES PERTINENTE',
            scoredKB
                .map(
                    (k, i) =>
                        `[KB#${i + 1}] [${k.severity?.toUpperCase()}] ${k.problem}` +
                        (k.client_name ? ` — Client: ${k.client_name}` : '') +
                        (k.tags?.length ? ` — Tags: ${k.tags.join(', ')}` : '') +
                        `\nSOLUTION: ${k.solution}` +
                        (k.url ? `\nRéf: [${k.url}](${k.url})` : '') +
                        '\n---'
                )
                .join('\n'),
            scoredKB.length
        )

        const projectsSection = buildSection(
            '📁 PROJETS CONCERNÉS',
            relevantProjects
                .map(
                    p =>
                        `[PROJ] ${p.name} (${p.status || '?'})` +
                        (p.client ? ` — Client: ${p.client}` : '') +
                        (p.description ? `\nDesc: ${p.description}` : '') +
                        (p.notes?.length ? `\nNotes: ${p.notes.join(' | ')}` : '') +
                        (p.links && Object.keys(p.links).length
                            ? `\nLiens: ${Object.entries(p.links)
                                .map(([k, v]) => `[${k}](${v})`)
                                .join(' ')}`
                            : '')
                )
                .join('\n---\n'),
            relevantProjects.length
        )

        const tasksSection = buildSection(
            '✅ TÂCHES ASSOCIÉES',
            relevantTasks
                .map(
                    t =>
                        `[TASK] ${t.title} — Priorité: ${t.priority || '?'} | Statut: ${t.status || '?'}` +
                        (t.kanban_column ? ` | Colonne: ${t.kanban_column}` : '')
                )
                .join('\n'),
            relevantTasks.length
        )

        const appointmentsSection = buildSection(
            '📅 RENDEZ-VOUS',
            relevantAppointments
                .map(
                    a =>
                        `[RDV] ${a.client_name} — ${a.date} à ${a.time}` +
                        (a.service ? ` | Service: ${a.service}` : '') +
                        ` | Statut: ${a.status || '?'}` +
                        (a.notes ? `\nNotes: ${a.notes}` : '')
                )
                .join('\n'),
            relevantAppointments.length
        )

        const messagesSection = buildSection(
            '✉️ MESSAGES',
            relevantMessages
                .map(
                    m =>
                        `[MSG] De: ${m.sender}` +
                        (m.subject ? ` | Objet: ${m.subject}` : '') +
                        ` | ${m.is_read ? 'Lu' : '**NON LU**'}` +
                        (m.body ? `\nExtrait: ${m.body.slice(0, 200)}${m.body.length > 200 ? '…' : ''}` : '')
                )
                .join('\n---\n'),
            relevantMessages.length
        )

        const hasAnyContext =
            scoredKB.length + relevantProjects.length + relevantTasks.length +
            relevantAppointments.length + relevantMessages.length > 0

        const systemPrompt = `Tu es NEXUS, l'assistant IA d'Alhambra OS. Tu as accès à l'ensemble du système de gestion.

**RÈGLES DE RÉPONSE:**
1. Cite les sources avec leur référence [KB#N], [PROJ], [TASK], [RDV], [MSG]
2. Réponds toujours en français technique, clair et structuré
3. Si plusieurs tables sont concernées, synthétise les informations
4. Propose des actions concrètes quand c'est possible
5. N'invente jamais d'URL ni de données

**VUE D'ENSEMBLE DU SYSTÈME:**
- 📁 ${stats.totalProjects} projets (${stats.activeProjects} actifs)
- ✅ ${stats.totalTasks} tâches (${stats.pendingTasks} en cours/backlog)
- 📅 ${stats.upcomingAppointments} rendez-vous à venir
- ✉️ ${stats.unreadMessages} messages non lus
- 🔴 ${stats.criticalIssues} problèmes critiques en KB

${hasAnyContext
            ? `**📊 CONTEXTE PERTINENT TROUVÉ:**
${kbSection}${projectsSection}${tasksSection}${appointmentsSection}${messagesSection}`
            : `**ℹ️ Aucun résultat directement lié à la requête dans les bases.**
Tu peux néanmoins répondre avec les statistiques globales ou demander plus de précisions.`
        }`

        console.log('✅ Prompt système construit —', systemPrompt.length, 'chars')

        const result = streamText({
            model: google('gemini-2.5-flash'),
            system: systemPrompt,
            messages: await convertToModelMessages(messages),
        })

        return result.toUIMessageStreamResponse({
            headers: { 'Cache-Control': 'no-cache' },
        })
    } catch (error) {
        console.error('Route error:', error)
        return Response.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}