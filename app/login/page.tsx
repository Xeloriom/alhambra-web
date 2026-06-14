'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  startRegistration,
  startAuthentication,
  browserSupportsWebAuthn,
} from '@simplewebauthn/browser'

function Spinner() {
  return (
    <>
      <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.15)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  )
}

function FingerprintIcon({ size = 32, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.3s' }}>
      <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
      <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
      <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
      <path d="M2 12a10 10 0 0 1 18-6" />
      <path d="M2 17c1 .5 2.12.84 3 1" />
      <path d="M20 12c0 2.29-.78 4.4-2.09 6.06" />
      <path d="M5 15.5A15.1 15.1 0 0 0 6 17" />
      <path d="M8 13.86A19.95 19.95 0 0 0 8.94 20" />
      <path d="M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2" />
    </svg>
  )
}

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [biometricLoading, setBiometricLoading] = useState(false)
  const [error, setError] = useState('')
  const [biometricError, setBiometricError] = useState('')
  const [checking, setChecking] = useState(true)
  const [hasBiometric, setHasBiometric] = useState(false)
  const [supportsWebAuthn, setSupportsWebAuthn] = useState(false)
  const router = useRouter()
  const params = useSearchParams()
  const emailRef = useRef<HTMLInputElement>(null)
  const destination = params.get('from') || '/admin'

  useEffect(() => {
    setSupportsWebAuthn(browserSupportsWebAuthn())

    fetch('/api/auth/')
      .then(r => r.json())
      .then(d => {
        if (d.ok) {
          router.replace(destination)
        } else {
          setChecking(false)
          checkBiometric()
        }
      })
      .catch(() => setChecking(false))
  }, [router, destination])

  async function checkBiometric() {
    try {
      const r = await fetch('/api/auth/webauthn?action=has-credentials')
      const d = await r.json()
      setHasBiometric(d.hasCredentials === true)
    } catch { /* ignore */ }
  }

  useEffect(() => {
    if (!checking) emailRef.current?.focus()
  }, [checking])

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (data.ok) {
        router.replace(destination)
      } else {
        setError(data.error || 'Identifiants incorrects')
        setPassword('')
        emailRef.current?.focus()
      }
    } catch {
      setError('Erreur réseau')
    } finally {
      setLoading(false)
    }
  }

  const loginWithBiometric = async () => {
    setBiometricLoading(true)
    setBiometricError('')
    try {
      const optRes = await fetch('/api/auth/webauthn?action=login-start')
      if (!optRes.ok) {
        const d = await optRes.json()
        setBiometricError(d.error || 'Impossible de démarrer')
        return
      }
      const options = await optRes.json()
      const assertion = await startAuthentication({ optionsJSON: options })

      const verRes = await fetch('/api/auth/webauthn?action=login-finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assertion),
      })
      const verData = await verRes.json()
      if (verData.ok) {
        router.replace(destination)
      } else {
        setBiometricError(verData.error || 'Authentification échouée')
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') setBiometricError('Annulé ou timeout')
        else setBiometricError(`${err.name}: ${err.message}`)
      } else {
        setBiometricError('Erreur biométrique inconnue')
      }
    } finally {
      setBiometricLoading(false)
    }
  }

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner />
      </div>
    )
  }

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '13px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${hasError ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: 10,
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, background 0.2s',
    fontFamily: 'inherit',
  })

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#080808', fontFamily: 'var(--font-haas), -apple-system, sans-serif' }}>

      {/* ── Left panel — image ── */}
      <div style={{
        display: 'none',
        flex: '1 1 0',
        position: 'relative',
        overflow: 'hidden',
      }}
        className="login-left-panel"
      >
        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/images/work-2.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.35)',
        }} />

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(8,8,8,0.85) 100%)',
        }} />

        {/* Content */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column',
          height: '100%', padding: '48px',
          justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <div>
            <span style={{ fontFamily: 'var(--font-nordique), serif', fontSize: 20, letterSpacing: '0.2em', color: '#fff', textTransform: 'uppercase' }}>
              Alhambra
            </span>
          </div>

          {/* Bottom quote */}
          <div>
            <p style={{ fontSize: 24, fontWeight: 300, color: 'rgba(255,255,255,0.9)', lineHeight: 1.4, marginBottom: 20, letterSpacing: '-0.01em' }}>
              Votre espace de<br />
              <strong style={{ fontWeight: 700 }}>travail privé.</strong>
            </p>
            <div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.3)' }} />
            <p style={{ marginTop: 16, fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Alhambra — Administration
            </p>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div style={{
        width: '100%',
        maxWidth: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
      }}
        className="login-right-panel"
      >
        <div style={{ width: '100%', maxWidth: 360 }}>

          {/* Header */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-white.png" alt="Logo" style={{ height: 24, opacity: 0.9 }} />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 600, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
              Connexion
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
              Accédez à votre espace administration
            </p>
          </div>

          {/* Biometric button — shown if registered */}
          {supportsWebAuthn && hasBiometric && (
            <div style={{ marginBottom: 24 }}>
              <button
                onClick={loginWithBiometric}
                disabled={biometricLoading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: biometricLoading ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 10,
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: biometricLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  transition: 'background 0.2s, border-color 0.2s',
                  fontFamily: 'inherit',
                }}
              >
                {biometricLoading ? (
                  <>
                    <Spinner />
                    <span style={{ marginLeft: 8 }}>Vérification…</span>
                  </>
                ) : (
                  <>
                    <FingerprintIcon size={20} active />
                    Connexion avec empreinte / Face ID
                  </>
                )}
              </button>
              {biometricError && (
                <p style={{ fontSize: 12, color: '#EF4444', marginTop: 6, textAlign: 'center' }}>{biometricError}</p>
              )}

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20, marginBottom: 20 }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>ou</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
              </div>
            </div>
          )}

          {/* Email / Password form */}
          <form onSubmit={submitPassword}>
            <div style={{ marginBottom: 10 }}>
              <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                Adresse e-mail
              </label>
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                placeholder="votre@email.com"
                autoComplete="email"
                disabled={loading}
                style={inputStyle(!!error)}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Mot de passe
                </label>
              </div>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loading}
                style={inputStyle(!!error)}
              />
              {error && (
                <p style={{ fontSize: 12, color: '#EF4444', marginTop: 8 }}>{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim() || !password.trim()}
              style={{
                width: '100%',
                padding: '13px',
                background: loading || !email.trim() || !password.trim() ? 'rgba(255,255,255,0.07)' : '#fff',
                color: loading || !email.trim() || !password.trim() ? 'rgba(255,255,255,0.25)' : '#000',
                border: 'none',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: loading || !email.trim() || !password.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontFamily: 'inherit',
              }}
            >
              {loading ? <><Spinner /><span style={{ marginLeft: 8 }}>Connexion…</span></> : 'Accéder'}
            </button>
          </form>

          {/* Footer */}
          <p style={{ marginTop: 32, fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'center', letterSpacing: '0.05em' }}>
            Alhambra © {new Date().getFullYear()} — Accès privé
          </p>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (min-width: 768px) {
          .login-left-panel { display: flex !important; }
          .login-right-panel { max-width: 480px !important; }
        }
        input::placeholder { color: rgba(255,255,255,0.2) !important; }
        input:focus { border-color: rgba(255,255,255,0.3) !important; background: rgba(255,255,255,0.06) !important; }
      `}</style>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.15)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
