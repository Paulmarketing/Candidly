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

  const isEditing = !!editingCandidature

  useEffect(() => {
    if (editingCandidature) {
      setForm({
        entreprise: editingCandidature.entreprise,
        poste: editingCandidature.poste,
        statut: editingCandidature.statut,
        date_envoi: editingCandidature.date_envoi,
        date_rappel: editingCandidature.date_rappel,
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
