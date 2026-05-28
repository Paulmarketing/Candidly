'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Affiche la bannière uniquement si l'utilisateur n'a pas encore choisi
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setVisible(false)
  }

  const handleRefuse = () => {
    localStorage.setItem('cookie_consent', 'refused')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: 680,
        zIndex: 9999,
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.8)',
        borderRadius: 18,
        boxShadow: '0 8px 32px rgba(80,90,140,0.18)',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
      }}
    >
      {/* Texte */}
      <div style={{ flex: 1, minWidth: 200 }}>
        <p style={{ fontSize: 13, color: 'var(--text1)', fontWeight: 500, marginBottom: 4 }}>
          🍪 Cookies
        </p>
        <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
          Candidly utilise uniquement des cookies techniques nécessaires à l&apos;authentification.
          Aucun cookie publicitaire.{' '}
          <Link href="/confidentialite" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
            En savoir plus
          </Link>
        </p>
      </div>

      {/* Boutons */}
      <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
        <button
          onClick={handleRefuse}
          style={{
            fontSize: 13,
            padding: '8px 18px',
            borderRadius: 40,
            border: '1px solid rgba(80,90,140,0.2)',
            background: 'transparent',
            color: 'var(--text2)',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          Refuser
        </button>
        <button
          onClick={handleAccept}
          style={{
            fontSize: 13,
            padding: '8px 18px',
            borderRadius: 40,
            background: 'linear-gradient(135deg, #5b7cf6, #9b8ef8)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 500,
            boxShadow: '0 4px 12px rgba(91,124,246,0.3)',
          }}
        >
          Accepter
        </button>
      </div>
    </div>
  )
}
