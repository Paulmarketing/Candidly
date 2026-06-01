'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Candidature } from '@/types'

interface CoverLetterModalProps {
  isOpen: boolean
  onClose: () => void
  candidature: Candidature | null
  isPro: boolean
}

export default function CoverLetterModal({ isOpen, onClose, candidature, isPro }: CoverLetterModalProps) {
  const [description, setDescription] = useState('')
  const [profil, setProfil] = useState('')
  const [letter, setLetter] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [upgradeRequired, setUpgradeRequired] = useState(false)
  const [usedFreeCredit, setUsedFreeCredit] = useState(false)

  if (!isOpen || !candidature) return null

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    setLetter('')
    setUpgradeRequired(false)

    const res = await fetch('/api/ai/cover-letter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entreprise: candidature.entreprise, poste: candidature.poste, description, profil }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      if (data.error === 'UPGRADE_REQUIRED') { setUpgradeRequired(true); return }
      setError(data.error || 'Erreur')
      return
    }

    setLetter(data.letter)
    if (data.usedFreeCredit) setUsedFreeCredit(true)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(letter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClose = () => {
    setLetter('')
    setDescription('')
    setProfil('')
    setError('')
    setUpgradeRequired(false)
    setUsedFreeCredit(false)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="glass-card animate-slide-up" style={{ width: '100%', maxWidth: 580, maxHeight: '90vh', overflow: 'auto', padding: '28px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)' }}>✨ Lettre de motivation</h2>
              {!isPro && !upgradeRequired && !letter && (
                <span style={{ fontSize: 11, fontWeight: 600, background: 'rgba(52,201,138,0.12)', color: 'var(--success)', border: '1px solid rgba(52,201,138,0.25)', borderRadius: 40, padding: '2px 10px' }}>
                  1 essai gratuit
                </span>
              )}
            </div>
            <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>
              {candidature.entreprise} — {candidature.poste}
            </p>
          </div>
          <button onClick={handleClose} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'rgba(136,144,176,0.15)', cursor: 'pointer', fontSize: 16, color: 'var(--text3)' }}>×</button>
        </div>

        {/* Écran d'upsell — essai épuisé */}
        {upgradeRequired && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text1)', marginBottom: 8 }}>
              Ton essai gratuit est utilisé !
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 28, maxWidth: 360, margin: '0 auto 28px' }}>
              Tu as découvert la puissance de l&apos;IA Candidly. Passe au plan Pro pour générer autant de lettres que tu veux — sans limite.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 280, margin: '0 auto' }}>
              <Link href="/pricing" className="btn-primary" style={{ justifyContent: 'center', padding: '13px', fontSize: 15 }}>
                ✨ Passer à Pro — 5€/mois
              </Link>
              <button onClick={handleClose} className="btn-secondary" style={{ justifyContent: 'center' }}>
                Pas maintenant
              </button>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 16 }}>Essai 7 jours gratuit · Sans engagement</p>
          </div>
        )}

        {/* Formulaire */}
        {!letter && !upgradeRequired && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="glass-input-label">Ton profil <span style={{ color: 'var(--text3)', fontWeight: 400 }}>(optionnel mais recommandé)</span></label>
              <textarea className="glass-input" rows={3} placeholder="Ex: Étudiant en Master Marketing à Paris, 2 stages en startup…" value={profil} onChange={(e) => setProfil(e.target.value)} style={{ resize: 'vertical', fontFamily: 'inherit' }} />
            </div>
            <div>
              <label className="glass-input-label">Description du poste <span style={{ color: 'var(--text3)', fontWeight: 400 }}>(optionnel)</span></label>
              <textarea className="glass-input" rows={4} placeholder="Colle ici la description de l'offre pour une lettre plus personnalisée…" value={description} onChange={(e) => setDescription(e.target.value)} style={{ resize: 'vertical', fontFamily: 'inherit' }} />
            </div>

            {error && (
              <div style={{ background: 'rgba(242,95,92,0.1)', border: '1px solid rgba(242,95,92,0.25)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#791F1F' }}>
                {error}
              </div>
            )}

            <button className="btn-primary" onClick={handleGenerate} disabled={loading} style={{ justifyContent: 'center', padding: '13px' }}>
              {loading ? '✨ Génération en cours…' : '✨ Générer la lettre'}
            </button>
          </div>
        )}

        {/* Lettre générée */}
        {letter && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: 14, padding: '20px', fontSize: 14, color: 'var(--text1)', lineHeight: 1.8, whiteSpace: 'pre-wrap', border: '1px solid var(--glass-border)' }}>
              {letter}
            </div>

            {/* Bannière upsell après essai gratuit utilisé */}
            {usedFreeCredit && (
              <div style={{ background: 'linear-gradient(135deg,rgba(91,124,246,0.1),rgba(155,142,248,0.1))', border: '1px solid rgba(91,124,246,0.2)', borderRadius: 14, padding: '16px 20px', textAlign: 'center' }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text1)', marginBottom: 4 }}>🎉 Tu as utilisé ton essai gratuit !</p>
                <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 12 }}>Passe Pro pour générer autant de lettres que tu veux.</p>
                <Link href="/pricing" className="btn-primary" style={{ justifyContent: 'center', fontSize: 13, padding: '9px 24px' }}>
                  ✨ Passer à Pro — 5€/mois
                </Link>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              {isPro && (
                <button className="btn-secondary" onClick={() => { setLetter(''); setError('') }} style={{ flex: 1, justifyContent: 'center' }}>
                  Régénérer
                </button>
              )}
              <button className="btn-primary" onClick={handleCopy} style={{ flex: 1, justifyContent: 'center' }}>
                {copied ? '✓ Copié !' : '📋 Copier'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
