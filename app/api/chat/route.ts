import { streamText, convertToModelMessages, type UIMessage } from 'ai'
import { google } from '@ai-sdk/google'

export const maxDuration = 60

export async function POST(req: Request) {
    try {
        const { messages } = await req.json() as { messages: UIMessage[] }

        // KB loading
        let knowledgeBase: any[] = []
        try {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
            const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!

            console.log('Supabase URL:', supabaseUrl ? '✅ définie' : '❌ MANQUANTE')
            console.log('Supabase KEY:', supabaseKey ? '✅ définie' : '❌ MANQUANTE')

            const fetchUrl = `${supabaseUrl}/rest/v1/knowledge_base?select=*&order=severity.desc,updated_at.desc&limit=50`
            console.log('Fetch URL:', fetchUrl)

            const res = await fetch(fetchUrl, {
                headers: {
                    apikey: supabaseKey,
                    Authorization: `Bearer ${supabaseKey}`,
                },
            })

            console.log('HTTP status:', res.status, res.statusText)

            const rawData = await res.json()

            console.log('Type rawData:', typeof rawData, Array.isArray(rawData) ? `tableau[${rawData.length}]` : 'objet')
            console.log('rawData brut:', JSON.stringify(rawData).slice(0, 500))

            const rows: any[] = Array.isArray(rawData) ? rawData : (rawData?.data || [])

            console.log('Nombre de lignes:', rows.length)
            if (rows.length > 0) {
                console.log('Clés première entrée:', Object.keys(rows[0]))
                console.log('Première entrée:', JSON.stringify(rows[0], null, 2))
            }

            knowledgeBase = rows
                .filter(k => {
                    const sol = k.solution || k.solution_preview || ''
                    return sol.trim().length > 10
                })
                .slice(0, 25)

            console.log(`KB finale: ${knowledgeBase.length} entrées utilisables`)
        } catch (e) {
            console.error('KB error détaillé:', e)
        }

        const systemPrompt = `Tu es NEXUS, assistant technique Alhambra OS.

**RÈGLES STRICTES:**
1. Consulte TOUJOURS la KB ci-dessous avant de répondre
2. Si une entrée KB correspond, cite [#N°] et donne la SOLUTION exacte
3. Donne le lien URL en markdown: [nom](url)
4. Réponds en français technique
5. Ne jamais inventer une URL — utilise uniquement celles de la KB

**BASE DE CONNAISSANCES (${knowledgeBase.length} entrées):**
${knowledgeBase.map((k, i) => {
            const solution = k.solution || k.solution_preview || 'Voir URL'
            const tags = k.tags ? `[${k.tags.join(', ')}]` : ''
            return `[#${i + 1}] (${k.severity}) ${k.problem} ${tags}
SOLUTION: ${solution}
URL: [${k.url}](${k.url})
---`
        }).join('\n')}`

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