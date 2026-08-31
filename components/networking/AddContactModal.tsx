'use client'

import { useState } from 'react'
import type { Contact } from '@/types'

type ContactInsert = Omit<Contact, 'id' | 'user_id' | 'created_at'>

interface AddContactModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: ContactInsert) => Promise<void>
  editingContact?: Contact | null
}

const EMPTY: ContactInsert = {
  prenom: '', nom: '', poste: null, entreprise: null,
  linkedin_url: null, email: null, notes: null,
}

type Tab = 'linkedin' | 'manuel'

export default function AddContactModal({ isOpen, onClose, onSave, editingContact }: AddContactModalProps) {
  const [tab, setTab] = useState<Tab>('linkedin')
  const [form, setForm] = useState<ContactInsert>(EMPTY)
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [profileText, setProfileText] = useState('')
  const [extracting, setExtracting] = useState(false)
  const [extracted, setExtracted] = useState(false)
  const [extractError, setExtractError] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const isEditing = !!editingContact

  const set = <K extends keyof ContactInsert>(k: K, v: ContactInsert[K]) =>
    setForm(p => ({ ...p, [k]: v }))

  const handleExtract = async () => {
    if (!profileText.trim() && profileText.trim().length < 20) {
      setExtractError('Colle le texte du profil LinkedIn ci-dessus.')
      return
    }
    setExtracting(true)
    setExtractError('')
    try {
      const res = await fetch('/api/ai/extract-linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: profileText, linkedin_url: linkedinUrl || null }),
      })
      const data = await res.json()
      if (!res.ok) { setExtractError(data.error || 'Erreur extraction'); return }
      setForm({
        prenom: data.prenom || '',
        nom: data.nom || '',
        poste: data.poste || null,
        entreprise: data.entreprise || null,
        linkedin_url: data.linkedin_url || linkedinUrl || null,
        email: data.email || null,
        notes: data.résumé || null,
      })
      setExtracted(true)
      setTab('manuel')
    } catch {
      setExtractError('Erreur réseau.')
    } finally {
      setExtracting(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.prenom.trim() && !form.nom.trim()) {
      setError('Le prénom ou le nom est requis.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSave({
        ...form,
        prenom: form.prenom.trim(),
        nom: form.nom.trim(),
        email: form.email?.trim() || null,
        linkedin_url: form.linkedin_url?.trim() || null,
        notes: form.notes?.trim() || null,
      })
      setForm(EMPTY)
      setLinkedinUrl('')
      setProfileText('')
      setExtracted(false)
      onClose()
    } catch {
      setError('Erreur lors de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="glass-card animate-slide-up" style={{ width: '100%', maxWidth: 540, maxHeight: '92vh', overflow: 'auto', padding: '28px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)' }}>
            {isEditing ? 'Modifier le contact' : 'Ajouter un contact'}
          </h2>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'rgba(136,144,176,0.15)', cursor: 'pointer', fontSize: 16, color: 'var(--text3)' }}>×</button>
        </div>

        {/* Tabs (seulement à l'ajout) */}
        {!isEditing && (
          <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--input-bg)', border: '1px solid var(--glass-border)', borderRadius: 12, padding: 4 }}>
            {([
              { id: 'linkedin' as Tab, label: '🔗 Via LinkedIn', desc: 'Colle le profil' },
              { id: 'manuel' as Tab, label: '✏️ Saisie manuelle', desc: 'Remplis toi-même' },
            ]).map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  flex: 1, padding: '10px 16px', borderRadius: 8, border: 'none',
                  background: tab === t.id ? 'linear-gradient(135deg, var(--accent), var(--purple))' : 'transparent',
                  color: tab === t.id ? '#fff' : 'var(--text2)',
                  cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
                  boxShadow: tab === t.id ? '0 4px 12px rgba(91,124,246,0.3)' : 'none',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {/* Tab LinkedIn */}
        {tab === 'linkedin' && !isEditing && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'rgba(91,124,246,0.06)', border: '1px solid rgba(91,124,246,0.15)', borderRadius: 12, padding: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)', marginBottom: 6 }}>Comment ça marche</p>
              <ol style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                  'Ouvre le profil LinkedIn du contact dans ton navigateur',
                  'Sélectionne tout le texte de la page (Cmd+A) et copie (Cmd+C)',
                  'Colle le texte dans le champ ci-dessous',
                ].map((s, i) => (
                  <li key={i} style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{s}</li>
                ))}
              </ol>
            </div>

            <div>
              <label className="glass-input-label">URL du profil LinkedIn (optionnel)</label>
              <input
                className="glass-input"
                type="url"
                placeholder="https://linkedin.com/in/..."
                value={linkedinUrl}
                onChange={e => setLinkedinUrl(e.target.value)}
              />
            </div>

            <div>
              <label className="glass-input-label">Texte du profil *</label>
              <textarea
                className="glass-input"
                rows={7}
                placeholder="Colle ici le texte copié depuis la page LinkedIn du contact…"
                value={profileText}
                onChange={e => setProfileText(e.target.value)}
                style={{ resize: 'vertical', fontFamily: 'inherit', fontSize: 13 }}
              />
            </div>

            {extractError && (
              <p style={{ fontSize: 13, color: 'var(--danger)', background: 'rgba(242,95,92,0.08)', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(242,95,92,0.2)' }}>
                {extractError}
              </p>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn-secondary" onClick={onClose}>Annuler</button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleExtract}
                disabled={extracting || profileText.trim().length < 20}
              >
                {extracting ? '✨ Analyse en cours…' : '✨ Analyser avec l\'IA'}
              </button>
            </div>
          </div>
        )}

        {/* Tab manuel / formulaire */}
        {(tab === 'manuel' || isEditing) && (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {extracted && (
              <div style={{ background: 'rgba(52,201,138,0.08)', border: '1px solid rgba(52,201,138,0.2)', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: 'var(--success)' }}>
                ✅ Profil extrait automatiquement — vérifie et complète si besoin.
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="glass-input-label">Prénom *</label>
                <input className="glass-input" type="text" placeholder="Emma" value={form.prenom} onChange={e => set('prenom', e.target.value)} autoFocus={!isEditing} />
              </div>
              <div>
                <label className="glass-input-label">Nom *</label>
                <input className="glass-input" type="text" placeholder="Dupont" value={form.nom} onChange={e => set('nom', e.target.value)} />
              </div>
            </div>

            <div>
              <label className="glass-input-label">Poste actuel</label>
              <input className="glass-input" type="text" placeholder="Directrice RH chez Acme" value={form.poste || ''} onChange={e => set('poste', e.target.value || null)} />
            </div>

            <div>
              <label className="glass-input-label">Entreprise</label>
              <input className="glass-input" type="text" placeholder="Acme Corp" value={form.entreprise || ''} onChange={e => set('entreprise', e.target.value || null)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="glass-input-label">Email</label>
                <input className="glass-input" type="email" placeholder="emma@acme.com" value={form.email || ''} onChange={e => set('email', e.target.value || null)} />
              </div>
              <div>
                <label className="glass-input-label">LinkedIn</label>
                <input className="glass-input" type="url" placeholder="linkedin.com/in/..." value={form.linkedin_url || ''} onChange={e => set('linkedin_url', e.target.value || null)} />
              </div>
            </div>

            <div>
              <label className="glass-input-label">Notes</label>
              <textarea className="glass-input" rows={3} placeholder="Contexte, points communs, comment tu l'as trouvé…" value={form.notes || ''} onChange={e => set('notes', e.target.value || null)} style={{ resize: 'vertical', fontFamily: 'inherit' }} />
            </div>

            {error && (
              <p style={{ fontSize: 13, color: 'var(--danger)', background: 'rgba(242,95,92,0.08)', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(242,95,92,0.2)' }}>{error}</p>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
              <button type="button" className="btn-secondary" onClick={onClose}>Annuler</button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? '…' : isEditing ? 'Enregistrer' : 'Ajouter le contact'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
