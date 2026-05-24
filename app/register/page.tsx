'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@/lib/supabase'
import Logo from '@/components/Logo'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createBrowserClient()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      setError('Le mot de passe doit faire au moins 8 caractères.')
      return
    }

    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
    if (error) setError(error.message)
    setLoading(false)
  }

  if (success) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}
      >
        <div
          className="glass-card animate-slide-up"
          style={{ width: '100%', maxWidth: 420, padding: '40px 36px', textAlign: 'center' }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text1)', marginBottom: 10 }}>
            Vérifie ta boîte mail
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>
            On t&apos;a envoyé un lien de confirmation à{' '}
            <strong>{email}</strong>.<br />
            Clique dessus pour activer ton compte.
          </p>
          <Link
            href="/login"
            className="btn-secondary"
            style={{ display: 'inline-flex', marginTop: 24 }}
          >
            Retour à la connexion
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div className="glass-card animate-slide-up" style={{ width: '100%', maxWidth: 420, padding: '36px 36px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Logo size={40} />
          <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 8 }}>
            Créer ton compte gratuitement
          </p>
        </div>

        {/* Google OAuth */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="btn-secondary"
          style={{ width: '100%', justifyContent: 'center', marginBottom: 20, padding: '12px' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuer avec Google
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 20,
            color: 'var(--text3)',
            fontSize: 12,
          }}
        >
          <div style={{ flex: 1, height: 1, background: 'rgba(136,144,176,0.2)' }} />
          ou avec ton email
          <div style={{ flex: 1, height: 1, background: 'rgba(136,144,176,0.2)' }} />
        </div>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="glass-input-label">Ton prénom</label>
            <input
              className="glass-input"
              type="text"
              placeholder="Marie, Thomas…"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="given-name"
            />
          </div>

          <div>
            <label className="glass-input-label">Email</label>
            <input
              className="glass-input"
              type="email"
              placeholder="toi@exemple.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="glass-input-label">Mot de passe</label>
            <input
              className="glass-input"
              type="password"
              placeholder="8 caractères minimum"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              minLength={8}
            />
          </div>

          {error && (
            <div
              style={{
                background: 'rgba(242,95,92,0.1)',
                border: '1px solid rgba(242,95,92,0.25)',
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: 13,
                color: '#791F1F',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ justifyContent: 'center', padding: '13px', marginTop: 4 }}
          >
            {loading ? 'Création…' : 'Créer mon compte gratuit'}
          </button>

          <p style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center' }}>
            En créant un compte, tu acceptes nos conditions d&apos;utilisation.
          </p>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text3)', marginTop: 16 }}>
          Déjà un compte ?{' '}
          <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 500 }}>
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  )
}
