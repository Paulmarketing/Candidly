'use client'

import { STATUT_STYLES } from '@/types'
import type { Candidature } from '@/types'

interface CandidatureCardProps {
  candidature: Candidature
  onEdit: (candidature: Candidature) => void
  onDelete: (id: string) => void
  onCoverLetter?: (candidature: Candidature) => void
  isPro?: boolean
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getRappelUrgency(dateRappel: string | null): 'urgent' | 'proche' | null {
  if (!dateRappel) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const rappel = new Date(dateRappel)
  rappel.setHours(0, 0, 0, 0)
  const diff = Math.ceil((rappel.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diff <= 0) return 'urgent'
  if (diff <= 3) return 'proche'
  return null
}

export default function CandidatureCard({ candidature, onEdit, onDelete, onCoverLetter, isPro }: CandidatureCardProps) {
  const statut = STATUT_STYLES[candidature.statut]
  const urgency = getRappelUrgency(candidature.date_rappel)

  return (
    <div
      className="glass-card hover-card"
      style={{
        padding: '18px 20px',
        display: 'grid',
        gridTemplateColumns: '1fr auto auto auto',
        gap: 12,
        alignItems: 'center',
      }}
    >
      {/* Infos principales */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: 'var(--text1)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 220,
            }}
          >
            {candidature.entreprise}
          </span>
          {candidature.lien_offre && (
            <a
              href={candidature.lien_offre}
              target="_blank"
              rel="noopener noreferrer"
              title="Voir l'offre"
              style={{
                display: 'inline-flex',
                color: 'var(--accent)',
                fontSize: 13,
                textDecoration: 'none',
                opacity: 0.8,
              }}
            >
              ↗
            </a>
          )}
        </div>
        <p
          style={{
            fontSize: 13,
            color: 'var(--text2)',
            marginTop: 2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {candidature.poste}
        </p>
        {candidature.date_envoi && (
          <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>
            Envoyé le {formatDate(candidature.date_envoi)}
          </p>
        )}
        {candidature.notes && (
          <p
            style={{
              fontSize: 12,
              color: 'var(--text3)',
              marginTop: 4,
              fontStyle: 'italic',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 300,
            }}
          >
            {candidature.notes}
          </p>
        )}
      </div>

      {/* Pill rappel */}
      {candidature.date_rappel && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            background: urgency
              ? 'rgba(245,166,35,0.12)'
              : 'rgba(136,144,176,0.1)',
            borderRadius: 40,
            padding: '5px 10px',
            whiteSpace: 'nowrap',
          }}
        >
          {urgency && (
            <span
              className="pulse-dot"
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--warn)',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
          )}
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: urgency ? '#854F0B' : 'var(--text3)',
            }}
          >
            📅 {formatDate(candidature.date_rappel)}
          </span>
        </div>
      )}

      {/* Badge statut */}
      <span
        style={{
          background: statut.bg,
          color: statut.text,
          padding: '5px 12px',
          borderRadius: 40,
          fontSize: 12,
          fontWeight: 500,
          whiteSpace: 'nowrap',
        }}
      >
        {statut.label}
      </span>

      {/* Bouton lettre de motivation (Pro) */}
      {isPro && onCoverLetter && (
        <button
          onClick={() => onCoverLetter(candidature)}
          title="Générer une lettre de motivation"
          style={{
            height: 32,
            borderRadius: 8,
            border: '1px solid rgba(91,124,246,0.25)',
            background: 'rgba(91,124,246,0.08)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '0 10px',
            fontSize: 11,
            fontWeight: 500,
            color: 'var(--accent)',
            gap: 4,
            transition: 'all 0.15s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(91,124,246,0.15)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(91,124,246,0.08)' }}
        >
          ✨ Lettre
        </button>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          onClick={() => onEdit(candidature)}
          title="Modifier"
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            border: '1px solid var(--glass-border)',
            background: 'rgba(255,255,255,0.5)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(91,124,246,0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.5)'
          }}
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(candidature.id)}
          title="Supprimer"
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            border: '1px solid rgba(242,95,92,0.2)',
            background: 'rgba(242,95,92,0.06)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(242,95,92,0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(242,95,92,0.06)'
          }}
        >
          🗑️
        </button>
      </div>
    </div>
  )
}
