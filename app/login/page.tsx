'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function Spinner() {
  return (
    <>
      <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.15)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  )
}

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(true)
  const router = useRouter()
  const params = useSearchParams()
  const emailRef = useRef<HTMLInputElement>(null)
  const destination = params.get('from') || '/admin'

  useEffect(() => {
    fetch('/api/auth/')
      .then(r => r.json())
      .then(d => {
        if (d.ok) router.replace(destination)
        else setChecking(false)
      })
      .catch(() => setChecking(false))
  }, [router, destination])

  useEffect(() => {
    if (!checking) emailRef.current?.focus()
  }, [checking])

  const submit = async (e: React.FormEvent) => {
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
      <div style={{ display: 'none', flex: '1 1 0', position: 'relative', overflow: 'hidden' }} className="login-left-panel">
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/images/work-2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.35)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(8,8,8,0.85) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', padding: '48px', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-nordique), serif', fontSize: 20, letterSpacing: '0.2em', color: '#fff', textTransform: 'uppercase' }}>Alhambra</span>
          <div>
            <p style={{ fontSize: 24, fontWeight: 300, color: 'rgba(255,255,255,0.9)', lineHeight: 1.4, marginBottom: 20, letterSpacing: '-0.01em' }}>
              Votre espace de<br /><strong style={{ fontWeight: 700 }}>travail privé.</strong>
            </p>
            <div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.3)' }} />
            <p style={{ marginTop: 16, fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Alhambra — Administration</p>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div style={{ width: '100%', maxWidth: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }} className="login-right-panel">
        <div style={{ width: '100%', maxWidth: 360 }}>

          <div style={{ marginBottom: 40 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-white.png" alt="Logo" style={{ height: 24, opacity: 0.9, marginBottom: 8 }} />
            <h1 style={{ fontSize: 22, fontWeight: 600, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>Connexion</h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Accédez à votre espace administration</p>
          </div>

          <form onSubmit={submit}>
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
              <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loading}
                style={inputStyle(!!error)}
              />
              {error && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 8 }}>{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim() || !password.trim()}
              style={{
                width: '100%', padding: '13px',
                background: loading || !email.trim() || !password.trim() ? 'rgba(255,255,255,0.07)' : '#fff',
                color: loading || !email.trim() || !password.trim() ? 'rgba(255,255,255,0.25)' : '#000',
                border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                cursor: loading || !email.trim() || !password.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit',
              }}
            >
              {loading ? <><Spinner /><span style={{ marginLeft: 8 }}>Connexion…</span></> : 'Accéder'}
            </button>
          </form>

          <p style={{ marginTop: 32, fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'center', letterSpacing: '0.05em' }}>
            Alhambra © {new Date().getFullYear()} — Accès privé
          </p>
        </div>
      </div>

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
