'use client'

import { useState } from 'react'
import type { Contact } from '@/types'

interface EmailComposerModalProps {
  isOpen: boolean
  onClose: () => void
  contacts: Contact[]
  defaultContact?: Contact | null
}

type Template = 'candidature_spontanee' | 'candidature_offre' | 'demande_meeting' | 'relance' | 'remerciement'
type Tone = 'formel' | 'professionnel' | 'chaleureux' | 'direct'

const TEMPLATES: { id: Template; icon: string; label: string; desc: string }[] = [
  { id: 'candidature_spontanee', icon: '🚀', label: 'Candidature spontanée', desc: 'Tu postules sans offre précise' },
  { id: 'candidature_offre', icon: '🎯', label: 'Candidature pour une offre', desc: 'Tu réponds à une offre identifiée' },
  { id: 'demande_meeting', icon: '☕', label: 'Demande de rencontre', desc: 'Un café ou un call pour échanger' },
  { id: 'relance', icon: '🔔', label: 'Relance', desc: 'Pas de réponse depuis ton premier email' },
  { id: 'remerciement', icon: '🙏', label: 'Remerciement', desc: 'Après un entretien ou une rencontre' },
]

const TONES: { id: Tone; icon: string; label: string; desc: string }[] = [
  { id: 'formel', icon: '🎩', label: 'Formel', desc: 'Style corporate strict' },
  { id: 'professionnel', icon: '💼', label: 'Professionnel', desc: 'Standard entreprise' },
  { id: 'chaleureux', icon: '😊', label: 'Chaleureux', desc: 'Humain et enthousiaste' },
  { id: 'direct', icon: '⚡', label: 'Direct', desc: 'Court et percutant' },
]

export default function EmailComposerModal({ isOpen, onClose, contacts, defaultContact }: EmailComposerModalProps) {
  const [step, setStep] = useState<'form' | 'result'>('form')
  const [selectedContactId, setSelectedContactId] = useState<string>(defaultContact?.id || '')
  const [template, setTemplate] = useState<Template>('candidature_spontanee')
  const [tone, setTone] = useState<Tone>('professionnel')
  const [poste, setPoste] = useState('')
  const [contexte, setContexte] = useState('')
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ objet: string; corps: string } | null>(null)
  const [copiedObjet, setCopiedObjet] = useState(false)
  const [copiedCorps, setCopiedCorps] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [sent, setSent] = useState(false)

  const selectedContact = contacts.find(c => c.id === selectedContactId) || null

  const reset = () => {
    setStep('form')
    setResult(null)
    setError('')
    setCopiedObjet(false)
    setCopiedCorps(false)
    setSendError('')
    setSent(false)
  }

  const handleSend = async () => {
    if (!result || !selectedContact?.email) return
    setSending(true)
    setSendError('')
    try {
      const res = await fetch('/api/email/send-network', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: selectedContact.email, objet: result.objet, corps: result.corps }),
      })
      const data = await res.json()
      if (!res.ok) { setSendError(data.error || 'Erreur d\'envoi'); return }
      setSent(true)
    } catch {
      setSendError('Erreur réseau.')
    } finally {
      setSending(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleGenerate = async () => {
    setGenerating(true)
    setError('')
    try {
      const res = await fetch('/api/ai/compose-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template,
          tone,
          contact: selectedContact ? {
            prenom: selectedContact.prenom,
            nom: selectedContact.nom,
            poste: selectedContact.poste,
            entreprise: selectedContact.entreprise,
          } : null,
          poste: poste.trim() || null,
          contexte: contexte.trim() || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erreur de génération'); return }
      setResult(data)
      setStep('result')
    } catch {
      setError('Erreur réseau. Réessaie.')
    } finally {
      setGenerating(false)
    }
  }

  const copy = async (text: string, which: 'objet' | 'corps') => {
    await navigator.clipboard.writeText(text)
    if (which === 'objet') { setCopiedObjet(true); setTimeout(() => setCopiedObjet(false), 2000) }
    else { setCopiedCorps(true); setTimeout(() => setCopiedCorps(false), 2000) }
  }

  const copyAll = async () => {
    if (!result) return
    const full = `Objet : ${result.objet}\n\n${result.corps}`
    await copy(full, 'corps')
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && handleClose()}>
      <div
        className="glass-card animate-slide-up"
        style={{ width: '100%', maxWidth: 600, maxHeight: '94vh', overflow: 'auto', padding: '28px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)' }}>✉️ Compositeur d&apos;emails</h2>
            <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
              {step === 'form' ? 'Configure ton email, l\'IA s\'occupe du reste' : 'Ton email est prêt — copie et envoie'}
            </p>
          </div>
          <button onClick={handleClose} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'rgba(136,144,176,0.15)', cursor: 'pointer', fontSize: 16, color: 'var(--text3)' }}>×</button>
        </div>

        {/* ── ÉTAPE 1 : Formulaire ── */}
        {step === 'form' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

            {/* Contact */}
            <div>
              <label className="glass-input-label">Destinataire</label>
              <select
                className="glass-input"
                value={selectedContactId}
                onChange={e => setSelectedContactId(e.target.value)}
              >
                <option value="">— Sans contact spécifique —</option>
                {contacts.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.prenom} {c.nom}{c.entreprise ? ` — ${c.entreprise}` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Template */}
            <div>
              <label className="glass-input-label" style={{ marginBottom: 10 }}>Type d&apos;email</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {TEMPLATES.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTemplate(t.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '12px 16px', borderRadius: 12, cursor: 'pointer',
                      border: template === t.id
                        ? '2px solid var(--accent)'
                        : '2px solid var(--glass-border)',
                      background: template === t.id
                        ? 'rgba(91,124,246,0.08)'
                        : 'var(--input-bg)',
                      transition: 'all 0.15s', textAlign: 'left',
                    }}
                  >
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{t.icon}</span>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: template === t.id ? 'var(--accent)' : 'var(--text1)', lineHeight: 1.2 }}>{t.label}</p>
                      <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{t.desc}</p>
                    </div>
                    {template === t.id && (
                      <span style={{ marginLeft: 'auto', fontSize: 14, color: 'var(--accent)' }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone */}
            <div>
              <label className="glass-input-label" style={{ marginBottom: 10 }}>Ton</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {TONES.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTone(t.id)}
                    style={{
                      padding: '12px 16px', borderRadius: 12, cursor: 'pointer',
                      border: tone === t.id ? '2px solid var(--accent)' : '2px solid var(--glass-border)',
                      background: tone === t.id ? 'rgba(91,124,246,0.08)' : 'var(--input-bg)',
                      transition: 'all 0.15s', textAlign: 'left',
                    }}
                  >
                    <p style={{ fontSize: 18, marginBottom: 4 }}>{t.icon}</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: tone === t.id ? 'var(--accent)' : 'var(--text1)' }}>{t.label}</p>
                    <p style={{ fontSize: 11, color: 'var(--text3)' }}>{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Poste visé (si candidature) */}
            {(template === 'candidature_spontanee' || template === 'candidature_offre') && (
              <div>
                <label className="glass-input-label">Poste visé <span style={{ fontWeight: 400, textTransform: 'none' }}>(optionnel)</span></label>
                <input
                  className="glass-input"
                  type="text"
                  placeholder="ex. Stage Développeur Front-End, Alternance Marketing Digital…"
                  value={poste}
                  onChange={e => setPoste(e.target.value)}
                />
              </div>
            )}

            {/* Contexte libre */}
            <div>
              <label className="glass-input-label">Contexte <span style={{ fontWeight: 400, textTransform: 'none' }}>(optionnel)</span></label>
              <textarea
                className="glass-input"
                rows={3}
                placeholder={
                  template === 'demande_meeting' ? 'Pourquoi tu veux rencontrer cette personne, comment tu l\'as trouvée…' :
                  template === 'relance' ? 'Date du premier email, contexte de votre échange…' :
                  template === 'remerciement' ? 'Ce dont vous avez discuté, tes impressions, points clés…' :
                  'Quelques mots sur ton profil, ta formation, ce qui t\'attire dans cette entreprise…'
                }
                value={contexte}
                onChange={e => setContexte(e.target.value)}
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>

            {error && (
              <p style={{ fontSize: 13, color: 'var(--danger)', background: 'rgba(242,95,92,0.08)', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(242,95,92,0.2)' }}>{error}</p>
            )}

            <button
              type="button"
              className="btn-primary"
              onClick={handleGenerate}
              disabled={generating}
              style={{ justifyContent: 'center', padding: '14px', fontSize: 15 }}
            >
              {generating ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'block' }} />
                  Génération en cours…
                </span>
              ) : '✨ Générer l\'email'}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* ── ÉTAPE 2 : Résultat ── */}
        {step === 'result' && result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Badge récap */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, background: 'rgba(91,124,246,0.1)', color: 'var(--accent)', border: '1px solid rgba(91,124,246,0.2)', borderRadius: 20, padding: '3px 10px', fontWeight: 500 }}>
                {TEMPLATES.find(t => t.id === template)?.icon} {TEMPLATES.find(t => t.id === template)?.label}
              </span>
              <span style={{ fontSize: 11, background: 'rgba(155,142,248,0.1)', color: 'var(--purple)', border: '1px solid rgba(155,142,248,0.2)', borderRadius: 20, padding: '3px 10px', fontWeight: 500 }}>
                {TONES.find(t => t.id === tone)?.icon} {TONES.find(t => t.id === tone)?.label}
              </span>
              {selectedContact && (
                <span style={{ fontSize: 11, background: 'rgba(52,201,138,0.1)', color: 'var(--success)', border: '1px solid rgba(52,201,138,0.2)', borderRadius: 20, padding: '3px 10px', fontWeight: 500 }}>
                  👤 {selectedContact.prenom} {selectedContact.nom}
                </span>
              )}
            </div>

            {/* Objet */}
            <div className="glass-card-secondary" style={{ padding: '16px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Objet</p>
                <button
                  onClick={() => copy(result.objet, 'objet')}
                  style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '1px solid var(--glass-border)', background: copiedObjet ? 'rgba(52,201,138,0.1)' : 'var(--btn-secondary-bg)', color: copiedObjet ? 'var(--success)' : 'var(--text2)', cursor: 'pointer', fontWeight: 500, transition: 'all 0.15s' }}
                >
                  {copiedObjet ? '✓ Copié' : '📋 Copier'}
                </button>
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text1)' }}>{result.objet}</p>
            </div>

            {/* Corps */}
            <div className="glass-card-secondary" style={{ padding: '16px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Corps du mail</p>
                <button
                  onClick={() => copy(result.corps, 'corps')}
                  style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '1px solid var(--glass-border)', background: copiedCorps ? 'rgba(52,201,138,0.1)' : 'var(--btn-secondary-bg)', color: copiedCorps ? 'var(--success)' : 'var(--text2)', cursor: 'pointer', fontWeight: 500, transition: 'all 0.15s' }}
                >
                  {copiedCorps ? '✓ Copié' : '📋 Copier'}
                </button>
              </div>
              <div style={{ fontSize: 14, color: 'var(--text1)', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                {result.corps}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}
                onClick={reset}
              >
                ↩ Modifier les paramètres
              </button>
              <button
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? '…' : '🔄 Régénérer'}
              </button>
            </div>

            <button
              onClick={copyAll}
              style={{ width: '100%', padding: '12px', borderRadius: 12, border: '2px dashed rgba(91,124,246,0.25)', background: 'rgba(91,124,246,0.04)', color: 'var(--accent)', cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'all 0.15s' }}
            >
              {copiedCorps ? '✅ Tout copié !' : '📋 Tout copier (objet + corps)'}
            </button>

            {/* Envoi direct */}
            {sent ? (
              <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(52,201,138,0.08)', border: '1px solid rgba(52,201,138,0.2)', borderRadius: 14 }}>
                <p style={{ fontSize: 28, marginBottom: 8 }}>✅</p>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--success)' }}>Email envoyé !</p>
                <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>
                  Reçu par {selectedContact?.email} · Réponses vers ton adresse Candidly
                </p>
              </div>
            ) : selectedContact?.email ? (
              <div style={{ border: '1px solid var(--glass-border)', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', background: 'rgba(91,124,246,0.05)', borderBottom: '1px solid var(--glass-border)' }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)', marginBottom: 4 }}>📤 Envoyer directement</p>
                  <p style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.5 }}>
                    L&apos;email sera envoyé depuis <strong>ton prénom via Candidly</strong> avec ton adresse en reply-to — le destinataire peut te répondre directement.
                  </p>
                </div>
                <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, color: 'var(--text2)', flex: 1 }}>→ {selectedContact.email}</span>
                  {sendError && <p style={{ fontSize: 12, color: 'var(--danger)', width: '100%' }}>{sendError}</p>}
                  <button
                    onClick={handleSend}
                    disabled={sending}
                    style={{ padding: '9px 20px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, var(--accent), var(--purple))', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px rgba(91,124,246,0.35)', whiteSpace: 'nowrap' }}
                  >
                    {sending ? '…' : '📤 Envoyer'}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ padding: '14px 18px', background: 'rgba(136,144,176,0.06)', border: '1px solid var(--glass-border)', borderRadius: 12, fontSize: 12, color: 'var(--text3)', lineHeight: 1.5 }}>
                💡 Pour envoyer directement, ajoute l&apos;email du contact dans sa fiche.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
