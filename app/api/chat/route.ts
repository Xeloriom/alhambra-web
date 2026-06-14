export const dynamic = 'force-static';

import { streamText, tool, stepCountIs } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import { randomUUID } from 'crypto'

export const maxDuration = 120

// ─── Types ────────────────────────────────────────────────────────────────────

type ClientMsg = {
    id?: string
    role: 'user' | 'assistant' | 'ai'
    content?: string
    parts?: Array<{ type: string; text?: string }>
}

const TOOL_TABLES = [
    'projects', 'tasks', 'appointments', 'messages',
    'knowledge_base', 'subscriptions', 'site_projects', 'site_services',
    'contact_submissions', 'applications', 'sent_emails',
] as const

const TOOL_LABELS: Record<string, string> = {
    db_create: 'Création en base de données',
    db_update: 'Mise à jour en base de données',
    db_delete: 'Suppression en base de données',
    send_email: 'Envoi email',
    generate_devis: 'Génération document',
    upload_file: 'Upload fichier sur le serveur',
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

// ─── Devis HTML generator ─────────────────────────────────────────────────────

function generateDevisHtml(params: {
    type: 'devis' | 'facture'
    docNum: string
    date: string
    client: { name: string; company?: string; email: string; phone?: string; address?: string }
    items: Array<{ description: string; qty: number; unitPrice: number; discount?: number; details?: string }>
    taxMode: 'normal' | 'vat_exempt'
    taxRate: number
    notes?: string
    iban?: string
    bic?: string
}): string {
    const { type, docNum, date, client, items, taxMode, taxRate, notes, iban, bic } = params

    const totalHT = items.reduce((sum, item) => {
        return sum + item.qty * item.unitPrice * (1 - (item.discount || 0) / 100)
    }, 0)
    const taxAmount = taxMode === 'normal' ? totalHT * taxRate / 100 : 0
    const totalTTC = totalHT + taxAmount
    const label = type === 'devis' ? 'DEVIS' : 'FACTURE'
    const validityNote = type === 'devis' ? '<p style="margin:0;font-size:11px;color:rgba(255,255,255,0.4);">Valable 30 jours</p>' : ''

    const rowsHtml = items.map((item, idx) => {
        const ht = item.qty * item.unitPrice * (1 - (item.discount || 0) / 100)
        return `
        <tr style="border-bottom:1px solid rgba(0,0,0,0.05);">
          <td style="padding:14px 12px;font-size:12px;font-weight:700;color:rgba(0,0,0,0.5);">${idx + 1}</td>
          <td style="padding:14px 12px;">
            <div style="font-size:13px;font-weight:700;color:#0A0A0A;">${item.description}</div>
            ${item.details ? `<div style="font-size:11px;color:rgba(0,0,0,0.45);margin-top:3px;">${item.details}</div>` : ''}
          </td>
          <td style="padding:14px 12px;text-align:center;font-size:13px;font-weight:600;">${item.qty}</td>
          <td style="padding:14px 12px;text-align:right;font-size:13px;font-weight:600;">${item.unitPrice.toFixed(2)} €</td>
          <td style="padding:14px 12px;text-align:center;font-size:12px;color:rgba(0,0,0,0.45);">${item.discount || 0}%</td>
          <td style="padding:14px 12px;text-align:right;font-size:13px;font-weight:800;color:#0A0A0A;">${ht.toFixed(2)} €</td>
        </tr>`
    }).join('')

    const taxLine = taxMode === 'normal'
        ? `<tr><td colspan="5" style="padding:8px 12px;text-align:right;font-size:12px;color:rgba(0,0,0,0.5);">TVA ${taxRate}%</td><td style="padding:8px 12px;text-align:right;font-size:13px;font-weight:600;">${taxAmount.toFixed(2)} €</td></tr>`
        : `<tr><td colspan="6" style="padding:8px 12px;font-size:11px;color:rgba(0,0,0,0.4);font-style:italic;">TVA non applicable — Article 293 B du CGI</td></tr>`

    const ribSection = (iban || bic) ? `
    <div style="margin-top:32px;padding:20px 24px;background:#F8F8F8;border-radius:16px;border-left:4px solid #0A0A0A;">
      <p style="margin:0 0 8px;font-size:10px;font-weight:800;letter-spacing:0.15em;text-transform:uppercase;color:rgba(0,0,0,0.4);">Coordonnées bancaires</p>
      ${iban ? `<p style="margin:0 0 4px;font-size:13px;font-weight:700;">IBAN : <span style="font-family:monospace;">${iban}</span></p>` : ''}
      ${bic ? `<p style="margin:0;font-size:13px;font-weight:700;">BIC : <span style="font-family:monospace;">${bic}</span></p>` : ''}
    </div>` : ''

    const notesSection = notes ? `
    <div style="margin-top:24px;padding:16px 20px;background:#FFFBEB;border-radius:12px;border:1px solid rgba(251,191,36,0.3);">
      <p style="margin:0;font-size:12px;color:rgba(0,0,0,0.6);line-height:1.6;">${notes.replace(/\n/g, '<br>')}</p>
    </div>` : ''

    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${label} ${docNum}</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background: #F5F5F5; }
    @media print {
      body { background: white; }
      .page { box-shadow: none !important; margin: 0 !important; }
    }
  </style>
</head>
<body>
  <div class="page" style="max-width:800px;margin:40px auto;background:white;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.12);">

    <!-- Header -->
    <div style="background:#0A0A0A;padding:40px 48px;display:flex;justify-content:space-between;align-items:flex-start;">
      <div>
        <div style="font-size:28px;font-weight:900;color:white;letter-spacing:-0.04em;font-style:italic;">Alhambra</div>
        <div style="font-size:9px;font-weight:800;color:rgba(255,255,255,0.35);letter-spacing:0.35em;text-transform:uppercase;margin-top:4px;">Studio Créatif · Lyon</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:32px;font-weight:900;color:white;letter-spacing:0.1em;text-transform:uppercase;">${label}</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.5);font-weight:600;margin-top:4px;">${docNum}</div>
        <div style="font-size:11px;color:rgba(255,255,255,0.3);margin-top:4px;">Émis le ${new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
        ${validityNote}
      </div>
    </div>

    <div style="padding:40px 48px;">
      <!-- Client info -->
      <div style="display:flex;gap:48px;margin-bottom:40px;">
        <div style="flex:1;">
          <p style="margin:0 0 8px;font-size:9px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;color:rgba(0,0,0,0.35);">De</p>
          <p style="margin:0 0 2px;font-size:14px;font-weight:800;color:#0A0A0A;">Alhambra Web</p>
          <p style="margin:0;font-size:12px;color:rgba(0,0,0,0.5);line-height:1.6;">Lyon, France<br>contact@alhambra-web.com</p>
        </div>
        <div style="flex:1;">
          <p style="margin:0 0 8px;font-size:9px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;color:rgba(0,0,0,0.35);">Pour</p>
          <p style="margin:0 0 2px;font-size:14px;font-weight:800;color:#0A0A0A;">${client.name}</p>
          ${client.company ? `<p style="margin:0 0 2px;font-size:12px;font-weight:700;color:rgba(0,0,0,0.7);">${client.company}</p>` : ''}
          <p style="margin:0;font-size:12px;color:rgba(0,0,0,0.5);line-height:1.6;">
            ${client.email}
            ${client.phone ? `<br>${client.phone}` : ''}
            ${client.address ? `<br>${client.address}` : ''}
          </p>
        </div>
      </div>

      <!-- Items table -->
      <table style="width:100%;border-collapse:collapse;border-radius:16px;overflow:hidden;border:1px solid rgba(0,0,0,0.08);">
        <thead>
          <tr style="background:#0A0A0A;">
            <th style="padding:14px 12px;text-align:left;font-size:9px;font-weight:800;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.5);">#</th>
            <th style="padding:14px 12px;text-align:left;font-size:9px;font-weight:800;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.5);">Description</th>
            <th style="padding:14px 12px;text-align:center;font-size:9px;font-weight:800;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.5);">Qté</th>
            <th style="padding:14px 12px;text-align:right;font-size:9px;font-weight:800;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.5);">P.U. HT</th>
            <th style="padding:14px 12px;text-align:center;font-size:9px;font-weight:800;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.5);">Remise</th>
            <th style="padding:14px 12px;text-align:right;font-size:9px;font-weight:800;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.5);">Total HT</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
          <tr style="background:#F8F8F8;border-top:2px solid rgba(0,0,0,0.1);">
            <td colspan="5" style="padding:12px;text-align:right;font-size:12px;font-weight:700;color:rgba(0,0,0,0.5);">Total HT</td>
            <td style="padding:12px;text-align:right;font-size:14px;font-weight:800;">${totalHT.toFixed(2)} €</td>
          </tr>
          ${taxLine}
          <tr style="background:#0A0A0A;">
            <td colspan="5" style="padding:16px 12px;text-align:right;font-size:12px;font-weight:800;color:white;text-transform:uppercase;letter-spacing:0.1em;">Total TTC</td>
            <td style="padding:16px 12px;text-align:right;font-size:20px;font-weight:900;color:white;">${totalTTC.toFixed(2)} €</td>
          </tr>
        </tbody>
      </table>

      ${ribSection}
      ${notesSection}

      <!-- Signature -->
      <div style="margin-top:48px;display:flex;gap:48px;">
        <div style="flex:1;border-top:2px solid #0A0A0A;padding-top:12px;">
          <p style="margin:0;font-size:10px;font-weight:700;color:rgba(0,0,0,0.4);text-transform:uppercase;letter-spacing:0.1em;">Signature client</p>
          <p style="margin:4px 0 0;font-size:11px;color:rgba(0,0,0,0.3);">Bon pour accord</p>
        </div>
        <div style="flex:1;border-top:2px solid #0A0A0A;padding-top:12px;">
          <p style="margin:0;font-size:10px;font-weight:700;color:rgba(0,0,0,0.4);text-transform:uppercase;letter-spacing:0.1em;">Alhambra Web</p>
          <p style="margin:4px 0 0;font-size:11px;color:rgba(0,0,0,0.3);">Cachet et signature</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#F5F5F5;padding:20px 48px;border-top:1px solid rgba(0,0,0,0.06);text-align:center;">
      <p style="margin:0;font-size:10px;color:rgba(0,0,0,0.3);line-height:1.8;">
        Alhambra Web · Lyon, France · contact@alhambra-web.com · alhambra-web.com
      </p>
    </div>
  </div>
</body>
</html>`
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function POST(req: Request) {
    try {
        const { db } = await import('@/lib/db')
        const body = await req.json()
        const clientMessages: ClientMsg[] = body.messages || []

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

        // ── Build system prompt ─────────────────────────────────────────────────
        const today = new Date().toISOString().split('T')[0]
        const fmt = (arr: Record<string, unknown>[], fields: string[]) =>
            arr.length === 0 ? '  (vide)' :
            arr.map(row => '  • ' + fields.map(f => `${f}:${row[f] ?? '—'}`).join(' | ')).join('\n')

        const systemPrompt = `Tu es NEXUS, l'IA interne d'Alhambra OS — agence web digitale premium à Lyon.
Tu as accès TOTAL à la base de données et tu peux effectuer des actions réelles.
Réponds toujours en français, sois précis et professionnel.
Utilise du Markdown dans tes réponses (gras, listes, code, titres).
Date du jour : ${today}

══════════════════════════════════════
🔧 TES CAPACITÉS (OUTILS DISPONIBLES)
══════════════════════════════════════
Tu peux AGIR directement — pas seulement lire :
- db_create : Créer un projet, tâche, RDV, message, contact, abonnement, etc.
- db_update : Modifier n'importe quel enregistrement existant
- db_delete : Supprimer un enregistrement
- send_email : Envoyer un email à un client (avec pièce jointe HTML optionnelle)
- generate_devis : Générer et envoyer un devis ou facture professionnel au client
- upload_file : Créer et uploader un fichier HTML/CSS/JS/texte sur le serveur

QUAND utiliser les outils :
- L'utilisateur dit "crée", "ajoute", "supprime", "modifie", "envoie", "génère" → utilise l'outil
- L'utilisateur dit "liste", "montre", "analyse", "résume" → réponds avec le contexte DB ci-dessous
- Pour les IDs : génère un UUID court (ex: p-2026-xxx) ou laisse vide (auto-généré)
- Après chaque action, confirme ce que tu as fait et montre les données créées/modifiées

Tables disponibles : ${TOOL_TABLES.join(', ')}

Structure des tables :
- projects: id, name, client, year, category, status (BETA/LIVE/MAINTENANCE/ARCHIVED), description, price, links (JSON: {live, docs, git, github_page}), metrics (JSON: {seo, performance, accessibility}), notes (JSON: [])
- tasks: id, title, description, project_id, priority (LOW/MEDIUM/HIGH), status, kanban_column (backlog/inprogress/review/done)
- appointments: id, client_name, client_email, client_phone, date (YYYY-MM-DD), time (HH:MM), service, status (pending/confirmed/cancelled), notes
- messages: id, sender, subject, body, time, is_read
- knowledge_base: id, problem, solution, tags (JSON: []), severity (low/medium/high/critical), project_id, client_name
- subscriptions: id, name, provider, category, price_monthly, price_yearly, billing_cycle, status, next_billing_date, notes, url
- site_projects: id, title, image, link, docs_link, is_live, sort_order
- contact_submissions: id, type, payload, subject, is_read
- applications: id, candidate_name, candidate_email, role, experience, contract_type, status
- sent_emails: id, to_email, to_name, from_name, subject, message

══════════════════════════════════════
📁 PROJETS CLIENTS (${projects.length})
══════════════════════════════════════
${fmt(projects, ['name','client','status','year','description','price'])}

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

        const tableDesc = `Tables disponibles: ${TOOL_TABLES.join(', ')}`

        // ── Define tools ────────────────────────────────────────────────────────
        const tools = {
            db_create: tool({
                description: `Créer un nouvel enregistrement dans la base de données. ${tableDesc}. Inclure un id si possible.`,
                inputSchema: z.object({
                    table: z.string().describe(`Nom de la table. ${tableDesc}`),
                    data: z.record(z.string(), z.unknown()).describe('Données à insérer (objet JSON avec les champs de la table)'),
                }),
                execute: async (input: { table: string; data: Record<string, unknown> }) => {
                    const { table, data } = input
                    const id = (data.id as string) || randomUUID()
                    const record = await db.insert(table, { ...data, id })
                    return { success: true, id, record }
                },
            }),

            db_update: tool({
                description: 'Modifier un enregistrement existant dans la base de données.',
                inputSchema: z.object({
                    table: z.string().describe('Nom de la table'),
                    id: z.string().describe("ID de l'enregistrement à modifier"),
                    data: z.record(z.string(), z.unknown()).describe('Champs à mettre à jour'),
                }),
                execute: async (input: { table: string; id: string; data: Record<string, unknown> }) => {
                    const record = await db.update(input.table, input.id, input.data)
                    return { success: true, record }
                },
            }),

            db_delete: tool({
                description: 'Supprimer un enregistrement de la base de données.',
                inputSchema: z.object({
                    table: z.string().describe('Nom de la table'),
                    id: z.string().describe("ID de l'enregistrement à supprimer"),
                }),
                execute: async (input: { table: string; id: string }) => {
                    await db.delete(input.table, input.id)
                    return { success: true, deleted_id: input.id }
                },
            }),

            send_email: tool({
                description: "Envoyer un email professionnel à un client ou contact. Peut inclure une pièce jointe HTML (devis, facture, document).",
                inputSchema: z.object({
                    to: z.string().describe('Adresse email du destinataire'),
                    toName: z.string().describe('Nom complet du destinataire'),
                    subject: z.string().describe("Objet de l'email"),
                    message: z.string().describe("Corps du message (texte multiligne, une ligne par paragraphe)"),
                    fromName: z.string().optional().describe("Nom de l'expéditeur (défaut: Équipe Alhambra Web)"),
                    attachmentHtml: z.string().optional().describe('Contenu HTML à joindre en pièce jointe'),
                    attachmentName: z.string().optional().describe('Nom du fichier joint (ex: devis-client.html)'),
                }),
                execute: async (input: { to: string; toName: string; subject: string; message: string; fromName?: string; attachmentHtml?: string; attachmentName?: string }) => {
                    const { to, toName, subject, message, fromName, attachmentHtml, attachmentName } = input
                    try {
                        const nodemailer = (await import('nodemailer')).default
                        const emailId = randomUUID()
                        const BASE = 'https://www.alhambra-web.com'
                        const senderName = fromName || 'Équipe Alhambra Web'
                        const lines = message.split('\n').map((l: string) =>
                            `<p style="margin:0 0 14px 0;color:rgba(0,0,0,0.75);font-size:15px;line-height:1.8;">${l || '&nbsp;'}</p>`
                        ).join('')

                        const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Alhambra Web</title></head>
<body style="margin:0;padding:0;background:#EFEFEF;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#EFEFEF;padding:48px 16px;"><tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 8px 60px rgba(0,0,0,0.10);">
<tr><td style="background:#0A0A0A;padding:40px 48px 36px;"><img src="${BASE}/logo-white.png" height="30" alt="Alhambra" style="display:block;"></td></tr>
<tr><td style="padding:48px 48px 36px;">
<p style="margin:0 0 28px;font-size:22px;font-weight:900;color:#0A0A0A;">Bonjour ${toName.split(' ')[0]} 👋</p>
${lines}
</td></tr>
<tr><td style="background:#F5F5F5;padding:20px 48px;text-align:center;"><p style="margin:0;font-size:10px;color:rgba(0,0,0,0.3);">© ${new Date().getFullYear()} Alhambra Web · Lyon, France</p></td></tr>
</table></td></tr></table>
<img src="${BASE}/api/track.php?id=${emailId}" width="1" height="1" style="display:none;" alt="" />
</body></html>`

                        const transporter = nodemailer.createTransport({ sendmail: true })
                        const mailOptions: Parameters<typeof transporter.sendMail>[0] = {
                            from: 'Alhambra Web <contact@alhambra-web.com>',
                            to, subject, html, replyTo: 'contact@alhambra-web.com',
                        }
                        if (attachmentHtml) {
                            mailOptions.attachments = [{
                                filename: attachmentName || 'document.html',
                                content: Buffer.from(attachmentHtml, 'utf-8'),
                                contentType: 'text/html',
                            }]
                        }
                        await transporter.sendMail(mailOptions)

                        await db.insert('sent_emails', {
                            id: emailId, to_email: to, to_name: toName,
                            from_name: senderName, subject, message,
                            is_opened: false, sent_at: new Date().toISOString(),
                        }).catch(() => {})

                        return { success: true, emailId, to, subject }
                    } catch (err) {
                        return { success: false, error: String(err) }
                    }
                },
            }),

            generate_devis: tool({
                description: "Générer un devis ou une facture professionnel au format HTML, avec option d'envoi par email au client.",
                inputSchema: z.object({
                    type: z.enum(['devis', 'facture']).describe('Type de document'),
                    client: z.object({
                        name: z.string().describe('Nom complet du client'),
                        company: z.string().optional().describe('Nom de la société'),
                        email: z.string().describe('Email du client'),
                        phone: z.string().optional().describe('Téléphone'),
                        address: z.string().optional().describe('Adresse'),
                    }),
                    items: z.array(z.object({
                        description: z.string().describe('Description de la prestation'),
                        qty: z.number().describe('Quantité'),
                        unitPrice: z.number().describe('Prix unitaire HT en euros'),
                        discount: z.number().optional().describe('Remise en %'),
                        details: z.string().optional().describe('Détails supplémentaires'),
                    })).describe('Liste des prestations'),
                    taxMode: z.enum(['normal', 'vat_exempt']).default('normal').describe('Mode TVA'),
                    taxRate: z.number().default(20).describe('Taux de TVA en %'),
                    notes: z.string().optional().describe('Notes, conditions de paiement'),
                    iban: z.string().optional().describe('IBAN pour le virement'),
                    bic: z.string().optional().describe('BIC/SWIFT'),
                    sendByEmail: z.boolean().default(false).describe('Envoyer le document par email au client'),
                }),
                execute: async (params: { type: 'devis' | 'facture'; client: { name: string; company?: string; email: string; phone?: string; address?: string }; items: Array<{ description: string; qty: number; unitPrice: number; discount?: number; details?: string }>; taxMode?: string; taxRate?: number; notes?: string; iban?: string; bic?: string; sendByEmail?: boolean }) => {
                    const { type, client, sendByEmail, ...rest } = params
                    const year = new Date().getFullYear()
                    const num = Math.floor(Math.random() * 9000) + 1000
                    const docNum = `${type === 'devis' ? 'DEV' : 'FAC'}-${year}-${num}`
                    const date = new Date().toISOString().split('T')[0]

                    const html = generateDevisHtml({
                        type, docNum, date, client,
                        items: rest.items,
                        taxMode: (rest.taxMode as 'normal' | 'vat_exempt') ?? 'normal',
                        taxRate: rest.taxRate ?? 20,
                        notes: rest.notes,
                        iban: rest.iban,
                        bic: rest.bic,
                    })

                    let emailSent = false
                    if (sendByEmail && client.email) {
                        try {
                            const nodemailer = (await import('nodemailer')).default
                            const transporter = nodemailer.createTransport({ sendmail: true })
                            await transporter.sendMail({
                                from: 'Alhambra Web <contact@alhambra-web.com>',
                                to: client.email,
                                subject: `${type === 'devis' ? 'Votre devis' : 'Votre facture'} ${docNum} — Alhambra Web`,
                                html: `<p>Bonjour ${client.name},</p><p>Veuillez trouver ci-joint votre ${type} ${docNum}.</p><p>Cordialement,<br>Équipe Alhambra Web</p>`,
                                attachments: [{
                                    filename: `${docNum}.html`,
                                    content: Buffer.from(html, 'utf-8'),
                                    contentType: 'text/html',
                                }],
                            })
                            emailSent = true
                        } catch { emailSent = false }
                    }

                    const totalHT = params.items.reduce((s: number, i: { qty: number; unitPrice: number; discount?: number }) => s + i.qty * i.unitPrice * (1 - (i.discount || 0) / 100), 0)
                    const taxAmount = params.taxMode === 'normal' ? totalHT * (params.taxRate ?? 20) / 100 : 0

                    return {
                        success: true,
                        docNum,
                        type,
                        totalHT: totalHT.toFixed(2),
                        totalTTC: (totalHT + taxAmount).toFixed(2),
                        emailSent,
                        htmlPreview: html.slice(0, 200) + '...',
                    }
                },
            }),

            upload_file: tool({
                description: "Créer et uploader un fichier texte/HTML/CSS/JS sur le serveur web. Le fichier sera accessible via son URL.",
                inputSchema: z.object({
                    filename: z.string().describe('Nom du fichier avec extension (ex: landing.html, styles.css, data.json)'),
                    content: z.string().describe('Contenu texte du fichier'),
                    mimeType: z.string().optional().default('text/html').describe('Type MIME (text/html, text/css, application/json...)'),
                }),
                execute: async (input: { filename: string; content: string; mimeType?: string }) => {
                    const { filename, content } = input
                    try {
                        const path = await import('path')
                        const fs = await import('fs/promises')
                        const ext = path.default.extname(filename).toLowerCase()
                        const allowed = new Set(['.html', '.css', '.js', '.txt', '.json', '.md', '.xml', '.svg'])
                        if (!allowed.has(ext)) {
                            return { success: false, error: `Extension non autorisée: ${ext}` }
                        }
                        const safe = path.default.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '_')
                        const dir = path.default.join(process.cwd(), 'public', 'files')
                        await fs.default.mkdir(dir, { recursive: true })
                        await fs.default.writeFile(path.default.join(dir, safe), content, 'utf-8')
                        return { success: true, url: `/files/${safe}`, filename: safe, size: content.length }
                    } catch (err) {
                        return { success: false, error: String(err) }
                    }
                },
            }),
        }

        // ── Convert messages ────────────────────────────────────────────────────
        const coreMessages = clientMessages
            .filter(m => m.role === 'user' || m.role === 'assistant' || m.role === 'ai')
            .map(m => ({
                role: (m.role === 'ai' ? 'assistant' : m.role) as 'user' | 'assistant',
                content: m.content || m.parts?.find(p => p.type === 'text')?.text || '',
            }))
            .filter(m => m.content.trim().length > 0)

        // ── Stream with tools ───────────────────────────────────────────────────
        const result = streamText({
            model: google('gemini-2.5-flash'),
            system: systemPrompt,
            messages: coreMessages,
            stopWhen: stepCountIs(8),
            tools,
        })

        const stream = new ReadableStream({
            async start(controller) {
                const enc = new TextEncoder()
                const emit = (data: unknown) =>
                    controller.enqueue(enc.encode(`data: ${JSON.stringify(data)}\n\n`))

                try {
                    for await (const part of result.fullStream) {
                        if (part.type === 'tool-call') {
                            emit({
                                type: 'tool-call',
                                toolName: part.toolName,
                                status: 'running',
                                label: TOOL_LABELS[part.toolName] || part.toolName,
                            })
                        } else if (part.type === 'tool-result') {
                            emit({
                                type: 'tool-call',
                                toolName: part.toolName,
                                status: 'done',
                            })
                        } else if (part.type === 'text-delta') {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const chunk = (part as any).text ?? (part as any).delta ?? (part as any).textDelta ?? ''
                            if (chunk) emit({ type: 'text-delta', delta: chunk })
                        }
                    }
                } catch (e) {
                    emit({ type: 'error', message: String(e) })
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
