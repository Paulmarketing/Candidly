'use client'

import { useState } from 'react'
import type { Candidature } from '@/types'

interface CoverLetterModalProps {
  isOpen: boolean
  onClose: () => void
  candidature: Candidature | null
}

export default function CoverLetterModal({ isOpen, onClose, candidature }: CoverLetterModalProps) {
  const [description, setDescription] = useState('')
  const [profil, setProfil] = useState('')
  const [letter, setLetter] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  if (!isOpen || !candidature) return null

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    setLetter('')

    const res = await fetch('/api/ai/cover-letter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entreprise: candidature.entreprise,
        poste: candidature.poste,
        description,
        profil,
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) { setError(data.error || 'Erreur'); return }
    setLetter(data.letter)
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
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div
        className="glass-card animate-slide-up"
        style={{ width: '100%', maxWidth: 580, maxHeight: '90vh', overflow: 'auto', padding: '28px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)' }}>✨ Lettre de motivation</h2>
            <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>
              {candidature.entreprise} — {candidature.poste}
            </p>
          </div>
          <button onClick={handleClose} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'rgba(136,144,176,0.15)', cursor: 'pointer', fontSize: 16, color: 'var(--text3)' }}>×</button>
        </div>

        {!letter ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="glass-input-label">Ton profil <span style={{ color: 'var(--text3)', fontWeight: 400 }}>(optionnel mais recommandé)</span></label>
              <textarea
                className="glass-input"
                rows={3}
                placeholder="Ex: Étudiant en Master Marketing à Paris, 2 stages en startup, passionné de growth hacking…"
                value={profil}
                onChange={(e) => setProfil(e.target.value)}
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>

            <div>
              <label className="glass-input-label">Description du poste <span style={{ color: 'var(--text3)', fontWeight: 400 }}>(optionnel)</span></label>
              <textarea
                className="glass-input"
                rows={4}
                placeholder="Colle ici la description de l'offre d'emploi pour une lettre plus personnalisée…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>

            {error && (
              <div style={{ background: 'rgba(242,95,92,0.1)', border: '1px solid rgba(242,95,92,0.25)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#791F1F' }}>
                {error}
              </div>
            )}

            <button
              className="btn-primary"
              onClick={handleGenerate}
              disabled={loading}
              style={{ justifyContent: 'center', padding: '13px' }}
            >
              {loading ? '✨ Génération en cours…' : '✨ Générer la lettre'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Lettre générée */}
            <div
              style={{
                background: 'rgba(255,255,255,0.6)',
                borderRadius: 14,
                padding: '20px',
                fontSize: 14,
                color: 'var(--text1)',
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap',
                border: '1px solid var(--glass-border)',
              }}
            >
              {letter}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="btn-secondary"
                onClick={() => { setLetter(''); setError('') }}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Régénérer
              </button>
              <button
                className="btn-primary"
                onClick={handleCopy}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {copied ? '✓ Copié !' : '📋 Copier'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
