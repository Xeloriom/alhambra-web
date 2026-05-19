export const dynamic = 'force-static';

import { streamText } from 'ai'
import { google } from '@ai-sdk/google'

export const maxDuration = 60

// ─── Types ────────────────────────────────────────────────────────────────────

type ClientMsg = {
    id?: string
    role: 'user' | 'assistant' | 'ai'
    content?: string
    parts?: Array<{ type: string; text?: string }>
}

// ─── DB fetcher ───────────────────────────────────────────────────────────────

async function fetchTable<T>(table: string): Promise<T[]> {
    try {
        const { db } = await import('@/lib/db')
        return db.get<T>(table)
    } catch (e) {
        console.error(`[${table}] fetch error:`, e)
        return []
    }
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const clientMessages: ClientMsg[] = body.messages || []

        // Extract user query — supports both AI SDK v5 (content) and v6 (parts)
        const lastMsg = clientMessages[clientMessages.length - 1]
        const userQuery = lastMsg?.content
            || lastMsg?.parts?.find(p => p.type === 'text')?.text
            || ''

        console.log('🧠 NEXUS:', userQuery.slice(0, 80))

        // ── Fetch ALL tables in parallel ────────────────────────────────────────
        const [
            projects, tasks, appointments, messages_db,
            knowledgeBase, subscriptions,
            site_projects, site_services,
            contact_submissions, applications,
        ] = await Promise.all([
            fetchTable<Record<string, unknown>>('projects'),
            fetchTable<Record<string, unknown>>('tasks'),
            fetchTable<Record<string, unknown>>('appointments'),
            fetchTable<Record<string, unknown>>('messages'),
            fetchTable<Record<string, unknown>>('knowledge_base'),
            fetchTable<Record<string, unknown>>('subscriptions'),
            fetchTable<Record<string, unknown>>('site_projects'),
            fetchTable<Record<string, unknown>>('site_services'),
            fetchTable<Record<string, unknown>>('contact_submissions'),
            fetchTable<Record<string, unknown>>('applications'),
        ])

        console.log(`📦 DB — projets:${projects.length} | tâches:${tasks.length} | rdv:${appointments.length} | msgs:${messages_db.length} | subs:${subscriptions.length} | contacts:${contact_submissions.length} | candidatures:${applications.length}`)

        // ── Build system prompt with full DB context ────────────────────────────
        const today = new Date().toISOString().split('T')[0]

        const fmt = (arr: Record<string, unknown>[], fields: string[]) =>
            arr.length === 0 ? '  (vide)' :
            arr.map(row => '  • ' + fields.map(f => `${f}:${row[f] ?? '—'}`).join(' | ')).join('\n')

        const systemPrompt = `Tu es NEXUS, l'IA interne d'Alhambra OS — agence web digitale premium à Lyon.
Tu as accès en temps réel à toute la base de données de l'agence. Réponds toujours en français, sois précis et professionnel.
Utilise du Markdown dans tes réponses (gras, listes, code, titres).
Date du jour : ${today}

══════════════════════════════════════
📁 PROJETS CLIENTS (${projects.length})
══════════════════════════════════════
${fmt(projects, ['name','client','status','year','description'])}

══════════════════════════════════════
✅ TÂCHES KANBAN (${tasks.length})
══════════════════════════════════════
${fmt(tasks.filter(t => t.kanban_column !== 'done'), ['title','priority','kanban_column','project_id'])}
Terminées : ${tasks.filter(t => t.kanban_column === 'done').length}

══════════════════════════════════════
📅 RENDEZ-VOUS (${appointments.length})
══════════════════════════════════════
${fmt(appointments.filter(a => String(a.date) >= today), ['client_name','date','time','service','status'])}

══════════════════════════════════════
✉️ MESSAGES (${messages_db.length} dont ${messages_db.filter(m => !m.is_read).length} non lus)
══════════════════════════════════════
${fmt(messages_db.slice(0, 10), ['sender','subject','is_read','time'])}

══════════════════════════════════════
💰 ABONNEMENTS (${subscriptions.length})
══════════════════════════════════════
${fmt(subscriptions.filter(s => s.status === 'active').slice(0, 15), ['name','provider','price_monthly','billing_cycle','next_billing_date'])}
Coût mensuel estimé : ${Math.round(subscriptions.filter(s => s.status === 'active').reduce((sum, s) => {
    if (s.billing_cycle === 'monthly') return sum + Number(s.price_monthly || 0)
    if (s.billing_cycle === 'yearly') return sum + Number(s.price_yearly || 0) / 12
    return sum
}, 0))}€

══════════════════════════════════════
🌐 PROJETS SITE PUBLIC (${site_projects.length})
══════════════════════════════════════
${fmt(site_projects, ['title','link','is_live','sort_order'])}

══════════════════════════════════════
🎨 SERVICES SITE PUBLIC (${site_services.length})
══════════════════════════════════════
${fmt(site_services, ['title_main','title_sub','active','sort_order'])}

══════════════════════════════════════
📬 CONTACTS REÇUS (${contact_submissions.length} formulaires)
══════════════════════════════════════
${fmt(contact_submissions.slice(0, 10), ['subject','type','is_read','created_at'])}

══════════════════════════════════════
👤 CANDIDATURES (${applications.length})
══════════════════════════════════════
${fmt(applications, ['candidate_name','role','experience','status','created_at'])}

══════════════════════════════════════
🔧 BASE DE CONNAISSANCES (${knowledgeBase.length} entrées)
══════════════════════════════════════
${fmt(knowledgeBase.slice(0, 20), ['problem','solution','severity'])}
`

        // ── Convert messages to CoreMessage[] ──────────────────────────────────
        const coreMessages = clientMessages
            .filter(m => m.role === 'user' || m.role === 'assistant' || m.role === 'ai')
            .map(m => ({
                role: (m.role === 'ai' ? 'assistant' : m.role) as 'user' | 'assistant',
                content: m.content || m.parts?.find(p => p.type === 'text')?.text || '',
            }))
            .filter(m => m.content.trim().length > 0)

        // ── Stream with Gemini 2.5 Flash ───────────────────────────────────────
        const result = streamText({
            model: google('gemini-2.5-flash'),
            system: systemPrompt,
            messages: coreMessages,
        })

        // Produce SSE stream in the format the client expects
        const stream = new ReadableStream({
            async start(controller) {
                const enc = new TextEncoder()
                try {
                    for await (const part of result.fullStream) {
                        if (part.type === 'text-delta') {
                            // ai@6.x uses .text, older versions used .textDelta or .delta
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const chunk = (part as any).text ?? (part as any).delta ?? (part as any).textDelta ?? ''
                            if (chunk) {
                                const ev = JSON.stringify({ type: 'text-delta', delta: chunk })
                                controller.enqueue(enc.encode(`data: ${ev}\n\n`))
                            }
                        }
                    }
                } catch (e) {
                    const errEv = JSON.stringify({ type: 'error', message: String(e) })
                    controller.enqueue(enc.encode(`data: ${errEv}\n\n`))
                } finally {
                    controller.enqueue(enc.encode('data: [DONE]\n\n'))
                    controller.close()
                }
            },
        })

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'X-Accel-Buffering': 'no',
            },
        })
    } catch (error) {
        console.error('Route error:', error)
        return Response.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}
