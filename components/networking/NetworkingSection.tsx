'use client'

import { useState, useEffect, useCallback } from 'react'
import { createBrowserClient } from '@/lib/supabase'
import type { Contact } from '@/types'
import AddContactModal from './AddContactModal'
import ConfirmDialog from '@/components/ConfirmDialog'

type ContactInsert = Omit<Contact, 'id' | 'user_id' | 'created_at'>

interface NetworkingSectionProps {
  userId: string
  isPro: boolean
}

function initials(c: Contact) {
  return `${c.prenom.charAt(0)}${c.nom.charAt(0)}`.toUpperCase()
}

const AVATAR_COLORS = [
  'linear-gradient(135deg,#5b7cf6,#9b8ef8)',
  'linear-gradient(135deg,#34c98a,#2eb5a0)',
  'linear-gradient(135deg,#f5a623,#f7cc4e)',
  'linear-gradient(135deg,#f25f5c,#f7a1a0)',
  'linear-gradient(135deg,#9b8ef8,#c77df0)',
]

function avatarColor(id: string) {
  const n = id.charCodeAt(0) + id.charCodeAt(id.length - 1)
  return AVATAR_COLORS[n % AVATAR_COLORS.length]
}

export default function NetworkingSection({ userId, isPro }: NetworkingSectionProps) {
  const supabase = createBrowserClient()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      setContacts(data || [])
      setLoading(false)
    }
    load()
  }, [supabase, userId])

  const handleSave = useCallback(async (data: ContactInsert) => {
    if (editingContact) {
      const { data: updated, error } = await supabase
        .from('contacts').update(data).eq('id', editingContact.id).select().single()
      if (error) throw error
      setContacts(prev => prev.map(c => c.id === editingContact.id ? updated : c))
    } else {
      const { data: created, error } = await supabase
        .from('contacts').insert({ ...data, user_id: userId }).select().single()
      if (error) throw error
      setContacts(prev => [created, ...prev])
    }
    setEditingContact(null)
  }, [editingContact, supabase, userId])

  const handleDelete = useCallback(async () => {
    if (!deleteId) return
    setDeleteLoading(true)
    await supabase.from('contacts').delete().eq('id', deleteId)
    setContacts(prev => prev.filter(c => c.id !== deleteId))
    setDeleteId(null)
    setDeleteLoading(false)
  }, [deleteId, supabase])

  const filtered = contacts.filter(c => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return `${c.prenom} ${c.nom} ${c.entreprise || ''} ${c.poste || ''}`.toLowerCase().includes(q)
  })

  const stats = {
    total: contacts.length,
    avecEmail: contacts.filter(c => c.email).length,
    avecLinkedin: contacts.filter(c => c.linkedin_url).length,
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <div style={{ width: 36, height: 36, border: '3px solid rgba(91,124,246,0.2)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: 'var(--text3)', fontSize: 14 }}>Chargement…</p>
      </div>
    )
  }

  return (
    <>
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: 'var(--text1)' }}>Networking</h1>
          <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>
            {stats.total} contact{stats.total !== 1 ? 's' : ''} · {stats.avecEmail} avec email · {stats.avecLinkedin} avec LinkedIn
          </p>
        </div>
        <button className="btn-primary" style={{ fontSize: 13 }} onClick={() => { setEditingContact(null); setAddModalOpen(true) }}>
          + Ajouter un contact
        </button>
      </div>

      {/* Stats cards */}
      {contacts.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Contacts', value: stats.total, icon: '🤝', color: 'var(--accent)' },
            { label: 'Avec email', value: stats.avecEmail, icon: '✉️', color: 'var(--success)' },
            { label: 'Sur LinkedIn', value: stats.avecLinkedin, icon: '🔗', color: 'var(--purple)' },
          ].map(s => (
            <div key={s.label} className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 24 }}>{s.icon}</span>
              <div>
                <p style={{ fontSize: 22, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recherche */}
      {contacts.length > 0 && (
        <div className="glass-card-secondary" style={{ padding: '12px 16px', marginBottom: 16 }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--text3)' }}>🔍</span>
            <input
              className="glass-input"
              type="text"
              placeholder="Rechercher un contact…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 34 }}
            />
          </div>
        </div>
      )}

      {/* Grille de contacts */}
      {contacts.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🤝</div>
          <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 8 }}>Commence ton réseau</p>
          <p style={{ fontSize: 14, color: 'var(--text3)', lineHeight: 1.6, marginBottom: 24, maxWidth: 380, margin: '0 auto 24px' }}>
            Ajoute tes contacts LinkedIn pour suivre tes démarches réseau, et bientôt composer des emails personnalisés avec l&apos;IA.
          </p>
          <button className="btn-primary" onClick={() => setAddModalOpen(true)}>
            + Ajouter mon premier contact
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card" style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text3)' }}>
          <p style={{ fontSize: 15 }}>Aucun contact ne correspond à ta recherche.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {filtered.map(c => (
            <ContactCard
              key={c.id}
              contact={c}
              onEdit={() => { setEditingContact(c); setAddModalOpen(true) }}
              onDelete={() => setDeleteId(c.id)}
            />
          ))}
        </div>
      )}

      {/* Prochainement : Email composer */}
      {contacts.length > 0 && (
        <div className="glass-card" style={{ marginTop: 20, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20, opacity: 0.7 }}>
          <span style={{ fontSize: 36 }}>✉️</span>
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text1)' }}>Compositeur d&apos;emails IA — bientôt disponible</p>
            <p style={{ fontSize: 13, color: 'var(--text3)' }}>Génère des emails de candidature, demande de meeting ou relance avec plusieurs tons au choix.</p>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: 11, background: 'rgba(91,124,246,0.12)', color: 'var(--accent)', padding: '4px 10px', borderRadius: 20, fontWeight: 600, whiteSpace: 'nowrap' }}>Étape 2</span>
        </div>
      )}

      <AddContactModal
        isOpen={addModalOpen}
        onClose={() => { setAddModalOpen(false); setEditingContact(null) }}
        onSave={handleSave}
        editingContact={editingContact}
      />
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Supprimer ce contact ?"
        message="Cette action est irréversible."
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleteLoading}
      />
    </>
  )
}

function ContactCard({ contact: c, onEdit, onDelete }: { contact: Contact; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="glass-card hover-card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
        {/* Avatar */}
        <div style={{
          width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
          background: avatarColor(c.id),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 700, color: '#fff',
          boxShadow: '0 4px 12px rgba(91,124,246,0.25)',
        }}>
          {initials(c)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {c.prenom} {c.nom}
          </p>
          {c.poste && (
            <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {c.poste}
            </p>
          )}
          {c.entreprise && (
            <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              🏢 {c.entreprise}
            </p>
          )}
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        {c.linkedin_url && (
          <a href={c.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: 11, fontWeight: 500, background: 'rgba(10,102,194,0.1)', color: '#0a66c2', border: '1px solid rgba(10,102,194,0.2)', borderRadius: 20, padding: '3px 10px' }}>
              🔗 LinkedIn
            </span>
          </a>
        )}
        {c.email && (
          <span style={{ fontSize: 11, fontWeight: 500, background: 'rgba(52,201,138,0.1)', color: 'var(--success)', border: '1px solid rgba(52,201,138,0.2)', borderRadius: 20, padding: '3px 10px' }}>
            ✉️ Email
          </span>
        )}
      </div>

      {c.notes && (
        <p style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.5, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {c.notes}
        </p>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          onClick={onEdit}
          style={{ flex: 1, fontSize: 12, padding: '7px 12px', borderRadius: 8, border: '1px solid var(--glass-border)', background: 'var(--btn-secondary-bg)', color: 'var(--text2)', cursor: 'pointer', fontWeight: 500 }}
        >
          ✏️ Modifier
        </button>
        <button
          onClick={onDelete}
          style={{ fontSize: 12, padding: '7px 12px', borderRadius: 8, border: '1px solid rgba(242,95,92,0.2)', background: 'rgba(242,95,92,0.06)', color: 'var(--danger)', cursor: 'pointer' }}
        >
          🗑️
        </button>
      </div>
    </div>
  )
}
