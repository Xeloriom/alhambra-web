import { NextRequest, NextResponse } from 'next/server'

const COOKIE = 'alhambra_admin'
const SECRET = process.env.ADMIN_JWT_SECRET || 'fallback-secret-change-me'

function hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2)
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16)
    }
    return bytes
}

function base64urlToObj(b64: string): Record<string, unknown> {
    const padded = b64.replace(/-/g, '+').replace(/_/g, '/').padEnd(
        b64.length + (4 - (b64.length % 4)) % 4, '='
    )
    return JSON.parse(atob(padded))
}

async function isValidToken(token: string): Promise<boolean> {
    try {
        const dot = token.lastIndexOf('.')
        if (dot === -1) return false
        const b64payload = token.slice(0, dot)
        const mac = token.slice(dot + 1)

        const key = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(SECRET),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['verify']
        )
        const valid = await crypto.subtle.verify(
            'HMAC',
            key,
            hexToBytes(mac),
            new TextEncoder().encode(b64payload)
        )
        if (!valid) return false

        const data = base64urlToObj(b64payload)
        return typeof data.exp === 'number' && (data.exp as number) > Date.now()
    } catch {
        return false
    }
}

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl
    if (!pathname.startsWith('/admin')) return NextResponse.next()

    const token = req.cookies.get(COOKIE)?.value || ''
    if (await isValidToken(token)) return NextResponse.next()

    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
}

export const config = {
    matcher: ['/admin/:path*'],
}
