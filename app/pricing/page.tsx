'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@/lib/supabase'
import Logo from '@/components/Logo'
import PricingCard from '@/components/PricingCard'

export default function PricingPage() {
  const router = useRouter()
  const supabase = createBrowserClient()

  const [isPro, setIsPro] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userLoaded, setUserLoaded] = useState(false)

  useEffect(() => {
    async function loadUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setUserLoaded(true); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_pro')
        .eq('id', session.user.id)
        .single()

      if (profile) setIsPro(profile.is_pro)
      setUserLoaded(true)
    }
    loadUser()
  }, [supabase])

  const handleUpgradePro = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/register'); return }

    setLoading(true)

    // Appelle l'API pour créer une session Stripe Checkout
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session.user.id, email: session.user.email }),
    })

    const { url, error } = await res.json()
    if (error) { setLoading(false); alert('Erreur : ' + error); return }

    window.location.href = url
  }

  return (
    <main style={{ minHeight: '100vh', padding: '0 16px 80px' }}>
      {/* Nav */}
      <nav
        style={{
          maxWidth: 900,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 0',
        }}
      >
        <Logo />
        <Link href="/dashboard" className="btn-secondary" style={{ fontSize: 13 }}>
          ← Retour au dashboard
        </Link>
      </nav>

      <div style={{ maxWidth: 760, margin: '40px auto 0', textAlign: 'center' }}>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 600,
            color: 'var(--text1)',
            marginBottom: 12,
          }}
        >
          Passe à Pro, débloque tout
        </h1>
        <p style={{ fontSize: 16, color: 'var(--text2)', marginBottom: 56 }}>
          Candidatures illimitées, rappels email automatiques, et plus encore.
        </p>

        <div
          style={{
            display: 'flex',
            gap: 24,
            justifyContent: 'center',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
          }}
        >
          <PricingCard
            plan="gratuit"
            onChoose={() => router.push('/dashboard')}
            isCurrent={userLoaded && !isPro}
          />
          <PricingCard
            plan="pro"
            onChoose={handleUpgradePro}
            loading={loading}
            isCurrent={userLoaded && isPro}
          />
        </div>

        <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 32 }}>
          Paiement sécurisé par Stripe · Annulation à tout moment · Essai 14 jours sans engagement
        </p>
      </div>
    </main>
  )
}
