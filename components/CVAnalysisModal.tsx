'use client'

import { useState, useRef } from 'react'

interface CVAnalysisModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Analysis {
  score: number
  points_forts: string[]
  points_faibles: string[]
  suggestions: string[]
  resume: string
}

export default function CVAnalysisModal({ isOpen, onClose }: CVAnalysisModalProps) {
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      setError('Seuls les fichiers PDF sont acceptés.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Le fichier ne doit pas dépasser 5 Mo.')
      return
    }

    setFileName(file.name)
    setError('')
    setAnalysis(null)
    setLoading(true)

    // Convertit le PDF en base64
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const base64 = (ev.target?.result as string).split(',')[1]

      const res = await fetch('/api/ai/analyze-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfBase64: base64 }),
      })

      const data = await res.json()
      setLoading(false)

      if (!res.ok) { setError(data.error || 'Erreur'); return }
      setAnalysis(data)
    }
    reader.readAsDataURL(file)
  }

  const scoreColor = (score: number) =>
    score >= 7 ? 'var(--success)' : score >= 5 ? 'var(--warn)' : 'var(--danger)'

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="glass-card animate-slide-up"
        style={{ width: '100%', maxWidth: 580, maxHeight: '90vh', overflow: 'auto', padding: '28px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)' }}>✨ Analyse de CV</h2>
            <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>Optimise ton CV avant de postuler</p>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'rgba(136,144,176,0.15)', cursor: 'pointer', fontSize: 16, color: 'var(--text3)' }}>×</button>
        </div>

        {/* Upload zone */}
        {!analysis && (
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              border: '2px dashed rgba(91,124,246,0.3)',
              borderRadius: 14,
              padding: '40px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              background: 'rgba(91,124,246,0.04)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(91,124,246,0.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(91,124,246,0.04)')}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
            {loading ? (
              <>
                <p style={{ fontWeight: 500, color: 'var(--text1)' }}>Analyse en cours…</p>
                <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 4 }}>Gemini IA lit ton CV, patiente 5-10 secondes</p>
              </>
            ) : (
              <>
                <p style={{ fontWeight: 500, color: 'var(--text1)' }}>
                  {fileName || 'Clique pour uploader ton CV'}
                </p>
                <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 4 }}>PDF uniquement · 5 Mo max</p>
              </>
            )}
            <input ref={fileRef} type="file" accept=".pdf" onChange={handleFileChange} style={{ display: 'none' }} />
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(242,95,92,0.1)', border: '1px solid rgba(242,95,92,0.25)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#791F1F', marginTop: 12 }}>
            {error}
          </div>
        )}

        {/* Résultats */}
        {analysis && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Score */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.5)', borderRadius: 14, padding: '16px 20px' }}>
              <div style={{ fontSize: 48, fontWeight: 600, color: scoreColor(analysis.score), lineHeight: 1 }}>
                {analysis.score}<span style={{ fontSize: 20, color: 'var(--text3)' }}>/10</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.5 }}>{analysis.resume}</p>
            </div>

            {/* Points forts */}
            <div className="glass-card-secondary" style={{ padding: '16px 18px' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>✅ Points forts</p>
              {analysis.points_forts.map((p, i) => (
                <p key={i} style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 6, paddingLeft: 12, borderLeft: '2px solid var(--success)' }}>
                  {p}
                </p>
              ))}
            </div>

            {/* Points faibles */}
            <div className="glass-card-secondary" style={{ padding: '16px 18px' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>❌ Points à améliorer</p>
              {analysis.points_faibles.map((p, i) => (
                <p key={i} style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 6, paddingLeft: 12, borderLeft: '2px solid var(--danger)' }}>
                  {p}
                </p>
              ))}
            </div>

            {/* Suggestions */}
            <div className="glass-card-secondary" style={{ padding: '16px 18px' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>💡 Suggestions concrètes</p>
              {analysis.suggestions.map((s, i) => (
                <p key={i} style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 6, paddingLeft: 12, borderLeft: '2px solid var(--accent)' }}>
                  {s}
                </p>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-secondary" onClick={() => { setAnalysis(null); setFileName('') }} style={{ flex: 1, justifyContent: 'center' }}>
                Analyser un autre CV
              </button>
              <button className="btn-primary" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
