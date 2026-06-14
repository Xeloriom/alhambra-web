export const dynamic = 'force-static';

import { NextRequest } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'

const SECRET = process.env.ADMIN_JWT_SECRET || 'fallback-secret-change-me'
const EMAIL = process.env.ADMIN_EMAIL || ''
const PASSWORD = process.env.ADMIN_PASSWORD || ''
const COOKIE = 'alhambra_admin'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function sign(payload: string): string {
    const b64 = Buffer.from(payload).toString('base64url')
    const mac = createHmac('sha256', SECRET).update(b64).digest('hex')
    return `${b64}.${mac}`
}

function verify(token: string): boolean {
    const dot = token.lastIndexOf('.')
    if (dot === -1) return false
    const payload = token.slice(0, dot)
    const mac = token.slice(dot + 1)
    const expected = createHmac('sha256', SECRET).update(payload).digest('hex')
    try {
        return timingSafeEqual(Buffer.from(mac, 'hex'), Buffer.from(expected, 'hex'))
    } catch {
        return false
    }
}

export function isValidToken(token: string): boolean {
    if (!verify(token)) return false
    try {
        const payload = JSON.parse(Buffer.from(token.split('.')[0], 'base64url').toString())
        return typeof payload.exp === 'number' && payload.exp > Date.now()
    } catch {
        return false
    }
}

// POST /api/auth/ — login
export async function POST(req: NextRequest) {
    const { email, password } = await req.json().catch(() => ({ email: '', password: '' }))

    if (!email || !password || !EMAIL || !PASSWORD) {
        return Response.json({ ok: false, error: 'Non configuré' }, { status: 500 })
    }

    const emailMatch = email.trim().toLowerCase() === EMAIL.trim().toLowerCase()

    let passwordMatch = false
    try {
        passwordMatch = timingSafeEqual(
            Buffer.from(password.padEnd(72)),
            Buffer.from(PASSWORD.padEnd(72))
        )
    } catch {
        passwordMatch = false
    }

    if (!emailMatch || !passwordMatch) {
        return Response.json({ ok: false, error: 'Identifiants incorrects' }, { status: 401 })
    }

    const payload = JSON.stringify({ exp: Date.now() + MAX_AGE * 1000, role: 'admin' })
    const token = sign(payload)

    return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${MAX_AGE}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
        },
    })
}

// DELETE /api/auth/ — logout
export async function DELETE() {
    return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`,
        },
    })
}

// GET /api/auth/ — check session
export async function GET(req: NextRequest) {
    const token = req.cookies.get(COOKIE)?.value || ''
    return Response.json({ ok: isValidToken(token) })
}
