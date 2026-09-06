'use client'

import { useState } from 'react'
import Link from 'next/link'

interface LinkedInAnalysisModalProps {
  isOpen: boolean
  onClose: () => void
  isPro: boolean
}

interface Analysis {
  score: number
  points_forts: string[]
  points_faibles: string[]
  suggestions: string[]
  resume: string
}

const FREE_KEY = 'candidly_free_linkedin_used'
const scoreColor = (s: number) => s >= 7 ? 'var(--success)' : s >= 5 ? 'var(--warn)' : 'var(--danger)'

export default function LinkedInAnalysisModal({ isOpen, onClose, isPro }: LinkedInAnalysisModalProps) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [error, setError] = useState('')
  const [upgradeRequired, setUpgradeRequired] = useState(false)

  if (!isOpen) return null

  const handleClose = () => {
    setText('')
    setAnalysis(null)
    setError('')
    setUpgradeRequired(false)
    onClose()
  }

  const handleAnalyze = async () => {
    if (!text.trim() || text.trim().length < 50) {
      setError('Colle davantage de contenu de ton profil LinkedIn (au moins quelques sections).')
      return
    }

    if (!isPro) {
      try {
        if (localStorage.getItem(FREE_KEY)) {
          setUpgradeRequired(true)
          return
        }
      } catch { /* ignore */ }
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/ai/analyze-linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erreur'); return }

      if (!isPro) {
        try { localStorage.setItem(FREE_KEY, '1') } catch { /* ignore */ }
      }
      setAnalysis(data)
    } catch {
      setError('Erreur réseau. Réessaie.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="glass-card animate-slide-up" style={{ width: '100%', maxWidth: 600, maxHeight: '92vh', overflow: 'auto', padding: '28px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)' }}>🔗 Analyse de profil LinkedIn</h2>
              {!isPro && (
                <span style={{ fontSize: 11, fontWeight: 600, background: 'rgba(52,201,138,0.12)', color: 'var(--success)', border: '1px solid rgba(52,201,138,0.25)', borderRadius: 40, padding: '2px 10px' }}>
                  1 essai gratuit
                </span>
              )}
            </div>
            <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>Score, forces, faiblesses et conseils concrets</p>
          </div>
          <button onClick={handleClose} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'rgba(136,144,176,0.15)', cursor: 'pointer', fontSize: 16, color: 'var(--text3)', flexShrink: 0 }}>×</button>
        </div>

        {/* Écran upsell */}
        {upgradeRequired && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text1)', marginBottom: 8 }}>
              Ton essai gratuit est utilisé !
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 28, maxWidth: 360, margin: '0 auto 28px' }}>
              Passe au plan Pro pour analyser ton profil LinkedIn autant de fois que tu veux, et accéder à tous les outils IA sans limite.
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

        {/* Formulaire de saisie */}
        {!analysis && !upgradeRequired && (
          <>
            {/* Instructions */}
            <div style={{ background: 'rgba(91,124,246,0.06)', border: '1px solid rgba(91,124,246,0.15)', borderRadius: 12, padding: '14px 16px', marginBottom: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', marginBottom: 8 }}>Comment faire ?</p>
              <ol style={{ paddingLeft: 18, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li style={{ fontSize: 13, color: 'var(--text2)' }}>Ouvre ton profil LinkedIn dans ton navigateur</li>
                <li style={{ fontSize: 13, color: 'var(--text2)' }}>Sélectionne tout le texte de la page (<strong>Ctrl+A</strong> puis <strong>Ctrl+C</strong>)</li>
                <li style={{ fontSize: 13, color: 'var(--text2)' }}>Colle-le ci-dessous (<strong>Ctrl+V</strong>)</li>
              </ol>
            </div>

            <textarea
              className="glass-input"
              placeholder="Colle ici le contenu de ton profil LinkedIn…&#10;&#10;(titre, résumé, expériences, compétences, formation...)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ minHeight: 200, resize: 'vertical', lineHeight: 1.6, marginBottom: 12 }}
            />

            {text.trim().length > 0 && (
              <p style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 12 }}>
                {text.trim().length} caractères collés
              </p>
            )}

            {error && (
              <div style={{ background: 'rgba(242,95,92,0.1)', border: '1px solid rgba(242,95,92,0.25)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--danger)', marginBottom: 12 }}>
                {error}
              </div>
            )}

            <button
              className="btn-primary"
              onClick={handleAnalyze}
              disabled={loading || text.trim().length < 50}
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                  Analyse en cours…
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </span>
              ) : '✨ Analyser mon profil'}
            </button>
          </>
        )}

        {/* Résultats */}
        {analysis && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Score */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--glass-secondary)', borderRadius: 14, padding: '18px 22px', border: '1px solid var(--glass-border)' }}>
              <div style={{ flexShrink: 0, textAlign: 'center' }}>
                <div style={{ fontSize: 52, fontWeight: 700, color: scoreColor(analysis.score), lineHeight: 1 }}>
                  {analysis.score}
                </div>
                <div style={{ fontSize: 14, color: 'var(--text3)', marginTop: 2 }}>/10</div>
              </div>
              <div style={{ width: 1, height: 60, background: 'var(--glass-border)', flexShrink: 0 }} />
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>{analysis.resume}</p>
            </div>

            {/* Points forts */}
            <div className="glass-card-secondary" style={{ padding: '16px 18px' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>✅ Points forts</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {analysis.points_forts.map((p, i) => (
                  <p key={i} style={{ fontSize: 14, color: 'var(--text2)', paddingLeft: 12, borderLeft: '2px solid var(--success)', lineHeight: 1.5 }}>{p}</p>
                ))}
              </div>
            </div>

            {/* Points faibles */}
            <div className="glass-card-secondary" style={{ padding: '16px 18px' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>⚠️ Points à améliorer</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {analysis.points_faibles.map((p, i) => (
                  <p key={i} style={{ fontSize: 14, color: 'var(--text2)', paddingLeft: 12, borderLeft: '2px solid var(--danger)', lineHeight: 1.5 }}>{p}</p>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div className="glass-card-secondary" style={{ padding: '16px 18px' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>💡 Suggestions concrètes</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {analysis.suggestions.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', flexShrink: 0, marginTop: 2 }}>{i + 1}.</span>
                    <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.5 }}>{s}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upsell après essai gratuit */}
            {!isPro && (
              <div style={{ background: 'linear-gradient(135deg,rgba(91,124,246,0.08),rgba(155,142,248,0.08))', border: '1px solid rgba(91,124,246,0.2)', borderRadius: 14, padding: '16px 20px', textAlign: 'center' }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text1)', marginBottom: 4 }}>🎉 Analyse utilisée !</p>
                <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 12 }}>Passe Pro pour analyser ton profil autant de fois que tu veux après chaque mise à jour.</p>
                <Link href="/pricing" className="btn-primary" style={{ justifyContent: 'center', fontSize: 13, padding: '9px 24px' }}>
                  ✨ Passer à Pro — 5€/mois
                </Link>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              {isPro && (
                <button className="btn-secondary" onClick={() => { setAnalysis(null); setText('') }} style={{ flex: 1, justifyContent: 'center' }}>
                  Nouvelle analyse
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
