'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [checking, setChecking] = useState(true)
    const router = useRouter()
    const params = useSearchParams()
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        fetch('/api/auth/')
            .then(r => r.json())
            .then(d => {
                if (d.ok) router.replace(params.get('from') || '/admin')
                else setChecking(false)
            })
            .catch(() => setChecking(false))
    }, [router, params])

    useEffect(() => {
        if (!checking) inputRef.current?.focus()
    }, [checking])

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!password.trim()) return
        setLoading(true)
        setError('')
        try {
            const res = await fetch('/api/auth/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            })
            const data = await res.json()
            if (data.ok) {
                router.replace(params.get('from') || '/admin')
            } else {
                setError(data.error || 'Mot de passe incorrect')
                setPassword('')
                inputRef.current?.focus()
            }
        } catch {
            setError('Erreur réseau')
        } finally {
            setLoading(false)
        }
    }

    if (checking) {
        return (
            <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #333', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} />
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-haas), -apple-system, sans-serif' }}>
            <div style={{ width: '100%', maxWidth: 360, padding: '0 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <span style={{ fontFamily: 'var(--font-nordique), serif', fontSize: 22, letterSpacing: '0.18em', color: '#fff', textTransform: 'uppercase' }}>
                        Alhambra
                    </span>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: 6 }}>
                        Administration
                    </p>
                </div>

                <form onSubmit={submit}>
                    <div style={{ marginBottom: 16 }}>
                        <input
                            ref={inputRef}
                            type="password"
                            value={password}
                            onChange={e => { setPassword(e.target.value); setError('') }}
                            placeholder="Mot de passe"
                            autoComplete="current-password"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '14px 18px',
                                background: 'rgba(255,255,255,0.05)',
                                border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}`,
                                borderRadius: 12,
                                color: '#fff',
                                fontSize: 14,
                                outline: 'none',
                                boxSizing: 'border-box',
                                transition: 'border-color 0.2s',
                            }}
                        />
                        {error && (
                            <p style={{ fontSize: 12, color: '#EF4444', marginTop: 8, textAlign: 'center' }}>{error}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !password.trim()}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: loading || !password.trim() ? 'rgba(255,255,255,0.08)' : '#fff',
                            color: loading || !password.trim() ? 'rgba(255,255,255,0.3)' : '#000',
                            border: 'none',
                            borderRadius: 12,
                            fontSize: 12,
                            fontWeight: 700,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            cursor: loading || !password.trim() ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                        }}
                    >
                        {loading ? 'Connexion…' : 'Accéder'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #333', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} />
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
        }>
            <LoginForm />
        </Suspense>
    )
}
