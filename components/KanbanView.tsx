'use client'

import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import Link from 'next/link'
import type { Candidature, Statut } from '@/types'
import { STATUTS, STATUT_STYLES } from '@/types'

const COLUMN_ICONS: Record<Statut, string> = {
  'Envoyé':    '📤',
  'Relance':   '🔔',
  'Entretien': '🎯',
  'Accepté':   '✅',
  'Refusé':    '❌',
}

interface KanbanViewProps {
  candidatures: Candidature[]
  isPro: boolean
  onStatusChange: (id: string, newStatus: Statut) => void
  onEdit: (c: Candidature) => void
  onDelete: (id: string) => void
  onCoverLetter: (c: Candidature) => void
  onInterviewPrep: (c: Candidature) => void
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export default function KanbanView({
  candidatures,
  isPro,
  onStatusChange,
  onEdit,
  onDelete,
  onCoverLetter,
  onInterviewPrep,
}: KanbanViewProps) {

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const newStatus = result.destination.droppableId as Statut
    const cardId = result.draggableId
    const card = candidatures.find(c => c.id === cardId)
    if (!card || card.statut === newStatus) return
    onStatusChange(cardId, newStatus)
  }

  // Vue locked pour les utilisateurs gratuits
  if (!isPro) {
    return (
      <div style={{ position: 'relative' }}>
        {/* Kanban flou en arrière-plan */}
        <div style={{ filter: 'blur(4px)', pointerEvents: 'none', userSelect: 'none', opacity: 0.5 }}>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 12 }}>
            {STATUTS.map((statut) => {
              const style = STATUT_STYLES[statut]
              const cards = candidatures.filter(c => c.statut === statut)
              return (
                <div key={statut} style={{ minWidth: 220, flex: '0 0 220px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, padding: '8px 12px', background: style.bg, borderRadius: 10 }}>
                    <span>{COLUMN_ICONS[statut]}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: style.text }}>{statut}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 600, color: style.text, background: 'rgba(255,255,255,0.6)', borderRadius: 20, padding: '1px 8px' }}>{cards.length}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 80 }}>
                    {cards.slice(0, 2).map(c => (
                      <div key={c.id} className="glass-card" style={{ padding: '12px 14px' }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)' }}>{c.entreprise}</p>
                        <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{c.poste}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Overlay upsell */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <div className="glass-card" style={{ textAlign: 'center', padding: '36px 40px', maxWidth: 380 }}>
            <div style={{ fontSize: 44, marginBottom: 16 }}>🗂️</div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text1)', marginBottom: 8 }}>Vue Kanban</h3>
            <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 24 }}>
              Glisse-dépose tes candidatures entre les colonnes. Visualise ton pipeline en un coup d&apos;œil.
            </p>
            <Link href="/pricing" className="btn-primary" style={{ justifyContent: 'center', padding: '12px 28px', fontSize: 14 }}>
              ✨ Passer à Pro — 5€/mois
            </Link>
            <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 12 }}>Essai 7 jours gratuit · Sans engagement</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16 }}>
        {STATUTS.map((statut) => {
          const style = STATUT_STYLES[statut]
          const cards = candidatures.filter(c => c.statut === statut)

          return (
            <div key={statut} style={{ minWidth: 240, flex: '0 0 240px', display: 'flex', flexDirection: 'column' }}>
              {/* En-tête colonne */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, padding: '8px 12px', background: style.bg, borderRadius: 10, border: `1px solid ${style.bg}` }}>
                <span>{COLUMN_ICONS[statut]}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: style.text }}>{statut}</span>
                <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 600, color: style.text, background: 'rgba(255,255,255,0.7)', borderRadius: 20, padding: '1px 8px' }}>
                  {cards.length}
                </span>
              </div>

              {/* Zone droppable */}
              <Droppable droppableId={statut}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      flex: 1,
                      minHeight: 80,
                      borderRadius: 12,
                      padding: '4px',
                      background: snapshot.isDraggingOver ? 'rgba(91,124,246,0.06)' : 'transparent',
                      border: snapshot.isDraggingOver ? '2px dashed rgba(91,124,246,0.3)' : '2px solid transparent',
                      transition: 'all 0.15s',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    {cards.map((c, index) => (
                      <Draggable key={c.id} draggableId={c.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="glass-card"
                            style={{
                              padding: '12px 14px',
                              cursor: 'grab',
                              boxShadow: snapshot.isDragging ? '0 12px 32px rgba(80,90,140,0.22)' : undefined,
                              transform: snapshot.isDragging ? 'rotate(1.5deg)' : undefined,
                              transition: snapshot.isDragging ? 'none' : 'box-shadow 0.15s',
                              ...provided.draggableProps.style,
                            }}
                          >
                            {/* Entreprise + poste */}
                            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {c.entreprise}
                            </p>
                            <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {c.poste}
                            </p>

                            {/* Date envoi */}
                            {c.date_envoi && (
                              <p style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 8 }}>
                                📅 {formatDate(c.date_envoi)}
                              </p>
                            )}

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                              <button
                                onClick={() => onInterviewPrep(c)}
                                title="Préparer l'entretien"
                                style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, border: '1px solid rgba(52,201,138,0.25)', background: 'rgba(52,201,138,0.08)', color: 'var(--success)', cursor: 'pointer', fontWeight: 500 }}
                              >
                                🎯
                              </button>
                              <button
                                onClick={() => onCoverLetter(c)}
                                title="Lettre de motivation"
                                style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, border: '1px solid rgba(91,124,246,0.25)', background: 'rgba(91,124,246,0.08)', color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}
                              >
                                ✨
                              </button>
                              <button
                                onClick={() => onEdit(c)}
                                title="Modifier"
                                style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.5)', color: 'var(--text2)', cursor: 'pointer' }}
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => onDelete(c.id)}
                                title="Supprimer"
                                style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, border: '1px solid rgba(242,95,92,0.2)', background: 'rgba(242,95,92,0.06)', color: 'var(--danger)', cursor: 'pointer' }}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {/* Colonne vide */}
                    {cards.length === 0 && !snapshot.isDraggingOver && (
                      <div style={{ textAlign: 'center', padding: '20px 12px', color: 'var(--text3)', fontSize: 12 }}>
                        Aucune candidature
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          )
        })}
      </div>
    </DragDropContext>
  )
}
