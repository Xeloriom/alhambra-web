export const dynamic = 'force-static'

import { NextRequest } from 'next/server'
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server'
import { isoBase64URL } from '@simplewebauthn/server/helpers'
import { db } from '@/lib/db'
import { isValidToken } from '@/app/api/auth/route'
import { createHmac, timingSafeEqual } from 'crypto'

const RP_ID = process.env.NEXT_PUBLIC_RP_ID || 'localhost'
const RP_NAME = 'Alhambra Administration'
const ORIGIN = process.env.NEXT_PUBLIC_ORIGIN || `http://localhost:3000`
const SECRET = process.env.ADMIN_JWT_SECRET || 'fallback-secret-change-me'
const COOKIE = 'alhambra_admin'
const MAX_AGE = 60 * 60 * 24 * 7

const challenges = new Map<string, { challenge: string; expires: number }>()
const CHALLENGE_KEY = 'admin'

function pruneExpired() {
  const now = Date.now()
  for (const [k, v] of challenges) {
    if (v.expires < now) challenges.delete(k)
  }
}

function sign(payload: string): string {
  const b64 = Buffer.from(payload).toString('base64url')
  const mac = createHmac('sha256', SECRET).update(b64).digest('hex')
  return `${b64}.${mac}`
}

function authCookie(token: string) {
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${MAX_AGE}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
}

function issueSession() {
  const payload = JSON.stringify({ exp: Date.now() + MAX_AGE * 1000, role: 'admin' })
  return sign(payload)
}

interface WebAuthnCredentialRow {
  id: string
  public_key: string
  counter: number
  device_name: string
  created_at: string
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const action = url.searchParams.get('action')

  pruneExpired()

  if (action === 'register-start') {
    const token = req.cookies.get(COOKIE)?.value || ''
    if (!isValidToken(token)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const opts = await generateRegistrationOptions({
      rpName: RP_NAME,
      rpID: RP_ID,
      userName: 'admin',
      userDisplayName: 'Administrateur',
      attestationType: 'none',
      authenticatorSelection: {
        userVerification: 'required',
        residentKey: 'preferred',
      },
    })

    challenges.set(CHALLENGE_KEY + '_reg', { challenge: opts.challenge, expires: Date.now() + 5 * 60 * 1000 })
    return Response.json(opts)
  }

  if (action === 'login-start') {
    const rows = await db.get<WebAuthnCredentialRow>('webauthn_credentials')

    if (!rows.length) {
      return Response.json({ error: 'Aucun appareil enregistré' }, { status: 404 })
    }

    const allowCredentials = rows.map(r => ({
      id: r.id,
      type: 'public-key' as const,
    }))

    const opts = await generateAuthenticationOptions({
      rpID: RP_ID,
      allowCredentials,
      userVerification: 'required',
    })

    challenges.set(CHALLENGE_KEY + '_auth', { challenge: opts.challenge, expires: Date.now() + 5 * 60 * 1000 })
    return Response.json(opts)
  }

  return Response.json({ error: 'action requis' }, { status: 400 })
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url)
  const action = url.searchParams.get('action')
  const body = await req.json()

  pruneExpired()

  if (action === 'register-finish') {
    const token = req.cookies.get(COOKIE)?.value || ''
    if (!isValidToken(token)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stored = challenges.get(CHALLENGE_KEY + '_reg')
    if (!stored) return Response.json({ error: 'Challenge expiré' }, { status: 400 })
    challenges.delete(CHALLENGE_KEY + '_reg')

    try {
      const verification = await verifyRegistrationResponse({
        response: body,
        expectedChallenge: stored.challenge,
        expectedOrigin: ORIGIN,
        expectedRPID: RP_ID,
      })

      if (!verification.verified || !verification.registrationInfo) {
        return Response.json({ error: 'Vérification échouée' }, { status: 400 })
      }

      const { credential } = verification.registrationInfo
      const credId = typeof credential.id === 'string' ? credential.id : isoBase64URL.fromBuffer(credential.id as Uint8Array<ArrayBuffer>)
      const pubKey = isoBase64URL.fromBuffer(credential.publicKey as Uint8Array<ArrayBuffer>)

      await db.insert('webauthn_credentials', {
        id: credId,
        public_key: pubKey,
        counter: credential.counter,
        device_name: body.deviceName || 'Mon appareil',
      })

      return Response.json({ ok: true })
    } catch (e) {
      console.error('[webauthn register]', e)
      return Response.json({ error: 'Erreur lors de l\'enregistrement' }, { status: 500 })
    }
  }

  if (action === 'login-finish') {
    const stored = challenges.get(CHALLENGE_KEY + '_auth')
    if (!stored) return Response.json({ error: 'Challenge expiré' }, { status: 400 })
    challenges.delete(CHALLENGE_KEY + '_auth')

    try {
      const rows = await db.get<WebAuthnCredentialRow>('webauthn_credentials')
      const credentialIdFromBody = body.id
      const cred = rows.find(r => r.id === credentialIdFromBody)

      if (!cred) return Response.json({ error: 'Appareil inconnu' }, { status: 401 })

      const verification = await verifyAuthenticationResponse({
        response: body,
        expectedChallenge: stored.challenge,
        expectedOrigin: ORIGIN,
        expectedRPID: RP_ID,
        credential: {
          id: cred.id,
          publicKey: isoBase64URL.toBuffer(cred.public_key),
          counter: cred.counter,
        },
      })

      if (!verification.verified) {
        return Response.json({ error: 'Authentification échouée' }, { status: 401 })
      }

      await db.update('webauthn_credentials', cred.id, {
        counter: verification.authenticationInfo.newCounter,
      })

      const sessionToken = issueSession()
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': authCookie(sessionToken),
        },
      })
    } catch (e) {
      console.error('[webauthn login]', e)
      return Response.json({ error: 'Erreur d\'authentification' }, { status: 500 })
    }
  }

  if (action === 'delete') {
    const token = req.cookies.get(COOKIE)?.value || ''
    if (!isValidToken(token)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = body
    if (!id) return Response.json({ error: 'id requis' }, { status: 400 })
    await db.delete('webauthn_credentials', id)
    return Response.json({ ok: true })
  }

  // check if any credentials are registered (for login page)
  if (action === 'has-credentials') {
    const rows = await db.get<WebAuthnCredentialRow>('webauthn_credentials')
    return Response.json({ hasCredentials: rows.length > 0, count: rows.length })
  }

  // timing-safe compare for the rate limiting check
  void timingSafeEqual

  return Response.json({ error: 'action requis' }, { status: 400 })
}
