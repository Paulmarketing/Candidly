'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Candidature } from '@/types'

interface Question {
  question: string
  type: string
  reponse_ideale: string
  a_eviter: string
}

interface InterviewPrep {
  questions: Question[]
  points_cles: string[]
  conseils: string[]
  usedFreeCredit?: boolean
}

interface InterviewPrepModalProps {
  isOpen: boolean
  onClose: () => void
  candidature: Candidature | null
  isPro: boolean
}

const TYPE_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  motivation:      { label: 'Motivation',     color: '#185FA5', bg: 'rgba(91,124,246,0.12)' },
  competence:      { label: 'Compétence',     color: '#1A6B45', bg: 'rgba(52,201,138,0.12)' },
  comportemental:  { label: 'Comportemental', color: '#854F0B', bg: 'rgba(245,166,35,0.12)' },
  technique:       { label: 'Technique',      color: '#3C3489', bg: 'rgba(155,142,248,0.15)' },
  piege:           { label: '⚠️ Piège',        color: '#791F1F', bg: 'rgba(242,95,92,0.12)' },
}

export default function InterviewPrepModal({ isOpen, onClose, candidature, isPro }: InterviewPrepModalProps) {
  const [description, setDescription] = useState('')
  const [prep, setPrep] = useState<InterviewPrep | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [upgradeRequired, setUpgradeRequired] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (!isOpen || !candidature) return null

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    setPrep(null)
    setUpgradeRequired(false)

    const res = await fetch('/api/ai/interview-prep', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entreprise: candidature.entreprise,
        poste: candidature.poste,
        description,
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      if (data.error === 'UPGRADE_REQUIRED') { setUpgradeRequired(true); return }
      setError(data.error || 'Erreur')
      return
    }

    setPrep(data)
    setOpenIndex(0) // Ouvre la première question par défaut
  }

  const handleClose = () => {
    setPrep(null)
    setDescription('')
    setError('')
    setUpgradeRequired(false)
    setOpenIndex(null)
    onClose()
  }

  const typeStyle = (type: string) => TYPE_STYLES[type] ?? { label: type, color: 'var(--text2)', bg: 'rgba(136,144,176,0.12)' }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div
        className="glass-card animate-slide-up"
        style={{ width: '100%', maxWidth: 640, maxHeight: '90vh', overflow: 'auto', padding: '28px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)' }}>🎯 Préparer l&apos;entretien</h2>
              {!isPro && !upgradeRequired && !prep && (
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

        {/* Écran upsell */}
        {upgradeRequired && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text1)', marginBottom: 8 }}>
              Ton essai gratuit est utilisé !
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 28, maxWidth: 360, margin: '0 auto 28px' }}>
              Passe au plan Pro pour préparer autant d&apos;entretiens que tu veux — sans limite.
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
        {!prep && !upgradeRequired && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: 'rgba(91,124,246,0.06)', border: '1px solid rgba(91,124,246,0.15)', borderRadius: 12, padding: '14px 16px', fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
              💡 L&apos;IA va générer <strong>8 questions probables</strong> pour cet entretien avec les réponses idéales et les pièges à éviter.
            </div>

            <div>
              <label className="glass-input-label">
                Description du poste <span style={{ color: 'var(--text3)', fontWeight: 400 }}>(optionnel mais recommandé)</span>
              </label>
              <textarea
                className="glass-input"
                rows={4}
                placeholder="Colle ici la description de l'offre pour des questions encore plus ciblées…"
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
              {loading ? '🎯 Génération en cours…' : '🎯 Générer les questions'}
            </button>
          </div>
        )}

        {/* Résultats */}
        {prep && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Points clés */}
            <div className="glass-card-secondary" style={{ padding: '16px 18px' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                🎯 Points clés à mentionner
              </p>
              {prep.points_cles.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 600, flexShrink: 0 }}>→</span>
                  <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.5 }}>{p}</p>
                </div>
              ))}
            </div>

            {/* Questions accordéon */}
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                💬 Questions probables ({prep.questions.length})
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {prep.questions.map((q, i) => {
                  const ts = typeStyle(q.type)
                  const isOpen = openIndex === i
                  return (
                    <div
                      key={i}
                      className="glass-card"
                      style={{ overflow: 'hidden', transition: 'all 0.2s' }}
                    >
                      {/* Question header */}
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : i)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '14px 16px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text3)', flexShrink: 0, width: 20 }}>
                          {i + 1}.
                        </span>
                        <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: 'var(--text1)', lineHeight: 1.4 }}>
                          {q.question}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: ts.color, background: ts.bg, padding: '3px 10px', borderRadius: 40, flexShrink: 0, whiteSpace: 'nowrap' }}>
                          {ts.label}
                        </span>
                        <span style={{ fontSize: 16, color: 'var(--text3)', flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                          ▾
                        </span>
                      </button>

                      {/* Réponse dépliée */}
                      {isOpen && (
                        <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <div style={{ background: 'rgba(52,201,138,0.06)', border: '1px solid rgba(52,201,138,0.2)', borderRadius: 10, padding: '12px 14px' }}>
                            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>✅ Réponse idéale</p>
                            <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{q.reponse_ideale}</p>
                          </div>
                          <div style={{ background: 'rgba(242,95,92,0.06)', border: '1px solid rgba(242,95,92,0.2)', borderRadius: 10, padding: '12px 14px' }}>
                            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>❌ À éviter</p>
                            <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{q.a_eviter}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Conseils */}
            <div className="glass-card-secondary" style={{ padding: '16px 18px' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--warn)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                💡 Conseils pour cet entretien
              </p>
              {prep.conseils.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                  <span style={{ color: 'var(--warn)', fontWeight: 600, flexShrink: 0 }}>·</span>
                  <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.5 }}>{c}</p>
                </div>
              ))}
            </div>

            {/* Bannière upsell après essai gratuit */}
            {prep.usedFreeCredit && (
              <div style={{ background: 'linear-gradient(135deg,rgba(91,124,246,0.1),rgba(155,142,248,0.1))', border: '1px solid rgba(91,124,246,0.2)', borderRadius: 14, padding: '16px 20px', textAlign: 'center' }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text1)', marginBottom: 4 }}>🎉 Tu as utilisé ton essai gratuit !</p>
                <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 12 }}>Passe Pro pour préparer autant d&apos;entretiens que tu veux.</p>
                <Link href="/pricing" className="btn-primary" style={{ justifyContent: 'center', fontSize: 13, padding: '9px 24px' }}>
                  ✨ Passer à Pro — 5€/mois
                </Link>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              {isPro && (
                <button className="btn-secondary" onClick={() => { setPrep(null); setDescription('') }} style={{ flex: 1, justifyContent: 'center' }}>
                  Nouvelle préparation
                </button>
              )}
              <button className="btn-primary" onClick={handleClose} style={{ flex: 1, justifyContent: 'center' }}>
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
