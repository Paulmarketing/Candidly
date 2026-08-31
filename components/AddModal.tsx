'use client'

import { useState, useEffect } from 'react'
import type { Candidature, CandidatureInsert, Statut } from '@/types'
import { STATUTS } from '@/types'

interface AddModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CandidatureInsert) => Promise<void>
  editingCandidature?: Candidature | null
  isPro: boolean
  currentCount: number
}

const EMPTY_FORM: CandidatureInsert = {
  entreprise: '',
  poste: '',
  statut: 'Envoyé',
  date_envoi: new Date().toISOString().split('T')[0],
  date_rappel: null,
  date_entretien: null,
  lien_offre: null,
  notes: null,
}

export default function AddModal({
  isOpen,
  onClose,
  onSave,
  editingCandidature,
  isPro,
  currentCount,
}: AddModalProps) {
  const [form, setForm] = useState<CandidatureInsert>(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // Import depuis URL
  const [importUrl, setImportUrl] = useState('')
  const [showImport, setShowImport] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState('')
  const [importedJob, setImportedJob] = useState<{ contrat?: string; lieu?: string } | null>(null)

  const handleImportUrl = async () => {
    if (!importUrl.trim()) return
    setImporting(true)
    setImportError('')
    try {
      const res = await fetch('/api/ai/extract-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: importUrl.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { setImportError(data.error || 'Erreur'); return }
      setForm(prev => ({
        ...prev,
        entreprise: data.entreprise || prev.entreprise,
        poste: data.poste || prev.poste,
        notes: data.notes || prev.notes,
        lien_offre: data.lien_offre || prev.lien_offre,
      }))
      setImportedJob({ contrat: data.contrat, lieu: data.lieu })
      setShowImport(false)
    } catch {
      setImportError('Erreur réseau.')
    } finally {
      setImporting(false)
    }
  }

  const isEditing = !!editingCandidature

  useEffect(() => {
    if (editingCandidature) {
      setForm({
        entreprise: editingCandidature.entreprise,
        poste: editingCandidature.poste,
        statut: editingCandidature.statut,
        date_envoi: editingCandidature.date_envoi,
        date_rappel: editingCandidature.date_rappel,
        date_entretien: editingCandidature.date_entretien,
        lien_offre: editingCandidature.lien_offre,
        notes: editingCandidature.notes,
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setError('')
  }, [editingCandidature, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.entreprise.trim() || !form.poste.trim()) {
      setError("L'entreprise et le poste sont requis.")
      return
    }

    if (!isPro && !isEditing && currentCount >= 10) {
      setError('Limite du plan gratuit atteinte (10 candidatures). Passe à Pro pour continuer.')
      return
    }

    setLoading(true)
    setError('')
    try {
      await onSave({
        ...form,
        lien_offre: form.lien_offre?.trim() || null,
        notes: form.notes?.trim() || null,
        date_rappel: form.date_rappel || null,
        date_entretien: form.date_entretien || null,
      })
      onClose()
    } catch {
      setError('Une erreur est survenue. Réessaie.')
    } finally {
      setLoading(false)
    }
  }

  const updateField = <K extends keyof CandidatureInsert>(key: K, value: CandidatureInsert[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="glass-card animate-slide-up"
        style={{
          width: '100%',
          maxWidth: 520,
          maxHeight: '90vh',
          overflow: 'auto',
          padding: '28px 28px',
        }}
      >
        {/* Header modale */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)' }}>
            {isEditing ? 'Modifier la candidature' : 'Nouvelle candidature'}
          </h2>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(136,144,176,0.15)',
              cursor: 'pointer',
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text3)',
            }}
          >
            ×
          </button>
        </div>

        {/* Import depuis URL */}
        {!isEditing && (
          <div style={{ marginBottom: 20 }}>
            {!showImport ? (
              <button
                type="button"
                onClick={() => setShowImport(true)}
                style={{ fontSize: 13, color: 'var(--accent)', background: 'rgba(91,124,246,0.08)', border: '1px solid rgba(91,124,246,0.18)', borderRadius: 10, padding: '9px 16px', cursor: 'pointer', fontWeight: 500, width: '100%', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}
              >
                📋 Importer depuis une offre d&apos;emploi
              </button>
            ) : (
              <div style={{ background: 'rgba(91,124,246,0.06)', border: '1px solid rgba(91,124,246,0.15)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)' }}>📋 Importer une offre</p>
                <p style={{ fontSize: 12, color: 'var(--text3)' }}>Colle l&apos;URL d&apos;une offre (Welcome to the Jungle, LinkedIn, Indeed…) et l&apos;IA remplira le formulaire.</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    className="glass-input"
                    type="url"
                    placeholder="https://www.welcometothejungle.com/..."
                    value={importUrl}
                    onChange={e => setImportUrl(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleImportUrl()}
                    autoFocus
                  />
                  <button type="button" className="btn-primary" style={{ fontSize: 13, padding: '8px 16px', whiteSpace: 'nowrap' }} onClick={handleImportUrl} disabled={importing || !importUrl.trim()}>
                    {importing ? '…' : 'Importer'}
                  </button>
                  <button type="button" onClick={() => { setShowImport(false); setImportError('') }} style={{ fontSize: 13, padding: '8px 12px', borderRadius: 10, border: '1px solid var(--glass-border)', background: 'var(--btn-secondary-bg)', color: 'var(--text2)', cursor: 'pointer' }}>✕</button>
                </div>
                {importError && <p style={{ fontSize: 12, color: 'var(--danger)' }}>{importError}</p>}
              </div>
            )}
            {importedJob && (
              <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, background: 'rgba(52,201,138,0.1)', color: 'var(--success)', border: '1px solid rgba(52,201,138,0.2)', borderRadius: 20, padding: '3px 10px', fontWeight: 500 }}>
                  ✅ Offre importée
                </span>
                {importedJob.contrat && <span style={{ fontSize: 11, background: 'rgba(91,124,246,0.1)', color: 'var(--accent)', border: '1px solid rgba(91,124,246,0.2)', borderRadius: 20, padding: '3px 10px' }}>{importedJob.contrat}</span>}
                {importedJob.lieu && <span style={{ fontSize: 11, background: 'rgba(136,144,176,0.1)', color: 'var(--text2)', border: '1px solid var(--glass-border)', borderRadius: 20, padding: '3px 10px' }}>📍 {importedJob.lieu}</span>}
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Entreprise */}
          <div>
            <label className="glass-input-label">Entreprise *</label>
            <input
              className="glass-input"
              type="text"
              placeholder="ex. Google, Airbus, LVMH…"
              value={form.entreprise}
              onChange={(e) => updateField('entreprise', e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Poste */}
          <div>
            <label className="glass-input-label">Poste *</label>
            <input
              className="glass-input"
              type="text"
              placeholder="ex. Stage Développeur, Alternance Marketing…"
              value={form.poste}
              onChange={(e) => updateField('poste', e.target.value)}
              required
            />
          </div>

          {/* Statut */}
          <div>
            <label className="glass-input-label">Statut</label>
            <select
              className="glass-input"
              value={form.statut}
              onChange={(e) => updateField('statut', e.target.value as Statut)}
            >
              {STATUTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="glass-input-label">Date d&apos;envoi</label>
              <input
                className="glass-input"
                type="date"
                value={form.date_envoi || ''}
                onChange={(e) => updateField('date_envoi', e.target.value || null)}
              />
            </div>
            <div>
              <label className="glass-input-label">
                Date de rappel
                {!isPro && (
                  <span
                    style={{
                      marginLeft: 4,
                      fontSize: 9,
                      background: 'linear-gradient(135deg,#5b7cf6,#9b8ef8)',
                      color: 'white',
                      padding: '1px 5px',
                      borderRadius: 4,
                    }}
                  >
                    PRO
                  </span>
                )}
              </label>
              <input
                className="glass-input"
                type="date"
                value={form.date_rappel || ''}
                onChange={(e) => updateField('date_rappel', e.target.value || null)}
                disabled={!isPro}
                title={!isPro ? 'Fonctionnalité Pro — Passe à Pro pour les rappels' : ''}
              />
            </div>
          </div>

          {/* Date entretien (visible quand statut Entretien) */}
          {form.statut === 'Entretien' && (
            <div style={{ background: 'rgba(155,142,248,0.08)', border: '1px solid rgba(155,142,248,0.2)', borderRadius: 12, padding: '14px 16px' }}>
              <label className="glass-input-label" style={{ color: '#3C3489', marginBottom: 6 }}>
                🎯 Date de l&apos;entretien
              </label>
              <input
                className="glass-input"
                type="date"
                value={form.date_entretien || ''}
                onChange={(e) => updateField('date_entretien', e.target.value || null)}
              />
              <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 6 }}>
                Visible dans le calendrier d&apos;entretiens
              </p>
            </div>
          )}

          {/* Lien offre */}
          <div>
            <label className="glass-input-label">Lien vers l&apos;offre</label>
            <input
              className="glass-input"
              type="url"
              placeholder="https://..."
              value={form.lien_offre || ''}
              onChange={(e) => updateField('lien_offre', e.target.value || null)}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="glass-input-label">Notes libres</label>
            <textarea
              className="glass-input"
              rows={3}
              placeholder="Contacts, impressions, questions à poser…"
              value={form.notes || ''}
              onChange={(e) => updateField('notes', e.target.value || null)}
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
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

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? '…' : isEditing ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
