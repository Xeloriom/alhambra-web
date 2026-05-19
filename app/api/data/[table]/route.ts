import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { isValidToken } from '@/app/api/auth/route'
import { db } from '@/lib/db'

export const dynamic = 'force-static'

export function generateStaticParams() {
    return [
        'site_projects', 'site_services',
        'projects', 'tasks', 'appointments', 'messages',
        'knowledge_base', 'subscriptions', 'contact_submissions', 'applications',
    ].map(table => ({ table }))
}

type Params = Promise<{ table: string }>

const PUBLIC_TABLES = new Set(['site_projects', 'site_services'])

const ALLOWED_TABLES = new Set([
  'site_projects', 'site_services',
  'projects', 'tasks', 'appointments', 'messages',
  'knowledge_base', 'subscriptions', 'contact_submissions', 'applications',
])

async function requireAuth(): Promise<boolean> {
  const jar = await cookies()
  const token = jar.get('alhambra_admin')?.value || ''
  return isValidToken(token)
}

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  const { table } = await params
  if (!ALLOWED_TABLES.has(table)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (!PUBLIC_TABLES.has(table) && !(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    return NextResponse.json(await db.get(table))
  } catch (e) {
    console.error(`[GET /${table}]`, e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const { table } = await params
  if (!ALLOWED_TABLES.has(table)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await req.json()
    const row = await db.insert(table, body)
    return NextResponse.json([row])
  } catch (e) {
    console.error(`[POST /${table}]`, e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const { table } = await params
  if (!ALLOWED_TABLES.has(table)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const id = req.nextUrl.searchParams.get('id')?.replace(/^eq\./, '')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    const body = await req.json()
    const row = await db.update(table, id, body)
    return NextResponse.json(row)
  } catch (e) {
    console.error(`[PATCH /${table}]`, e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  const { table } = await params
  if (!ALLOWED_TABLES.has(table)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const id = req.nextUrl.searchParams.get('id')?.replace(/^eq\./, '')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    await db.delete(table, id)
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(`[DELETE /${table}]`, e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
