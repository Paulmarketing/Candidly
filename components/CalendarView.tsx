'use client'

import { useState } from 'react'
import type { Candidature } from '@/types'
import { STATUT_STYLES } from '@/types'

interface CalendarViewProps {
  candidatures: Candidature[]
  onEdit: (c: Candidature) => void
  onInterviewPrep: (c: Candidature) => void
}

const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const MOIS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']

function isoToLocal(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export default function CalendarView({ candidatures, onEdit, onInterviewPrep }: CalendarViewProps) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  // Candidatures avec date_entretien
  const withInterview = candidatures.filter(c => c.date_entretien)

  // Map jour → candidatures pour le mois affiché
  const byDay: Record<number, Candidature[]> = {}
  for (const c of withInterview) {
    if (!c.date_entretien) continue
    const d = isoToLocal(c.date_entretien)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      if (!byDay[day]) byDay[day] = []
      byDay[day].push(c)
    }
  }

  // Prochains entretiens (tous mois confondus, à partir d'aujourd'hui)
  const upcoming = withInterview
    .filter(c => {
      if (!c.date_entretien) return false
      return isoToLocal(c.date_entretien) >= new Date(today.getFullYear(), today.getMonth(), today.getDate())
    })
    .sort((a, b) => a.date_entretien!.localeCompare(b.date_entretien!))
    .slice(0, 5)

  // Grille du mois
  const firstDay = new Date(year, month, 1)
  // Lundi = 0
  const startOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
    setSelectedDay(null)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
    setSelectedDay(null)
  }

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  const selectedCands = selectedDay ? (byDay[selectedDay] || []) : []

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // Compléter jusqu'à multiple de 7
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      {/* Calendrier */}
      <div className="glass-card" style={{ flex: '1 1 340px', padding: '24px 20px' }}>
        {/* Navigation mois */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <button
            onClick={prevMonth}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text2)', padding: '4px 8px', borderRadius: 8 }}
          >
            ‹
          </button>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text1)' }}>
            {MOIS[month]} {year}
          </h3>
          <button
            onClick={nextMonth}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text2)', padding: '4px 8px', borderRadius: 8 }}
          >
            ›
          </button>
        </div>

        {/* En-têtes jours */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
          {JOURS.map(j => (
            <div key={j} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--text3)', padding: '4px 0' }}>
              {j}
            </div>
          ))}
        </div>

        {/* Grille */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />
            const hasInterview = !!byDay[day]
            const isSelected = selectedDay === day
            const isTodayDay = isToday(day)
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(isSelected ? null : day)}
                style={{
                  position: 'relative',
                  aspectRatio: '1',
                  borderRadius: 8,
                  border: isSelected
                    ? '2px solid var(--accent)'
                    : isTodayDay
                    ? '2px solid rgba(91,124,246,0.4)'
                    : '2px solid transparent',
                  background: isSelected
                    ? 'rgba(91,124,246,0.12)'
                    : hasInterview
                    ? 'rgba(155,142,248,0.1)'
                    : 'transparent',
                  cursor: hasInterview || isTodayDay ? 'pointer' : 'default',
                  fontSize: 13,
                  fontWeight: isTodayDay || hasInterview ? 600 : 400,
                  color: isTodayDay ? 'var(--accent)' : 'var(--text1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  padding: 4,
                  transition: 'all 0.12s',
                }}
              >
                {day}
                {hasInterview && (
                  <span style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: 'var(--accent)',
                    display: 'block',
                    flexShrink: 0,
                  }} />
                )}
              </button>
            )
          })}
        </div>

        {/* Détail du jour sélectionné */}
        {selectedDay && (
          <div style={{ marginTop: 20, borderTop: '1px solid var(--glass-border)', paddingTop: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)', marginBottom: 10 }}>
              📅 {selectedDay} {MOIS[month]}
            </p>
            {selectedCands.length === 0 ? (
              <p style={{ fontSize: 12, color: 'var(--text3)' }}>Aucun entretien ce jour</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {selectedCands.map(c => (
                  <div key={c.id} className="glass-card-secondary" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)' }}>{c.entreprise}</p>
                      <p style={{ fontSize: 12, color: 'var(--text2)' }}>{c.poste}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => onInterviewPrep(c)}
                        title="Préparer l'entretien"
                        style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(52,201,138,0.25)', background: 'rgba(52,201,138,0.08)', color: 'var(--success)', cursor: 'pointer', fontWeight: 500 }}
                      >
                        🎯 Préparer
                      </button>
                      <button
                        onClick={() => onEdit(c)}
                        title="Modifier"
                        style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.5)', color: 'var(--text2)', cursor: 'pointer' }}
                      >
                        ✏️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sidebar : prochains entretiens */}
      <div style={{ flex: '0 0 280px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="glass-card" style={{ padding: '20px 18px' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text1)', marginBottom: 14 }}>
            🗓️ Prochains entretiens
          </h3>
          {upcoming.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p style={{ fontSize: 28, marginBottom: 8 }}>🎯</p>
              <p style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.5 }}>
                Aucun entretien planifié.<br />
                Ajoute une date lors de la création ou modification d&apos;une candidature.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {upcoming.map(c => {
                const d = isoToLocal(c.date_entretien!)
                const isUpcomingToday =
                  d.getDate() === today.getDate() &&
                  d.getMonth() === today.getMonth() &&
                  d.getFullYear() === today.getFullYear()
                const diffDays = Math.round((d.getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) / 86400000)
                const statStyle = STATUT_STYLES[c.statut]
                return (
                  <div
                    key={c.id}
                    className="glass-card-secondary"
                    style={{ padding: '12px 14px', borderLeft: `3px solid ${statStyle.text}` }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.entreprise}
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--text2)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.poste}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: isUpcomingToday ? 'var(--accent)' : 'var(--text2)' }}>
                          {isUpcomingToday ? "Aujourd'hui" : diffDays === 1 ? 'Demain' : `Dans ${diffDays}j`}
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--text3)' }}>
                          {d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onInterviewPrep(c)}
                      style={{ marginTop: 8, width: '100%', fontSize: 11, padding: '5px 10px', borderRadius: 6, border: '1px solid rgba(52,201,138,0.25)', background: 'rgba(52,201,138,0.08)', color: 'var(--success)', cursor: 'pointer', fontWeight: 500 }}
                    >
                      🎯 Préparer l&apos;entretien
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Légende */}
        <div className="glass-card-secondary" style={{ padding: '14px 16px' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Légende</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', display: 'block' }} />
              <span style={{ fontSize: 12, color: 'var(--text2)' }}>Entretien planifié</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 16, height: 16, borderRadius: 4, border: '2px solid rgba(91,124,246,0.4)', display: 'block' }} />
              <span style={{ fontSize: 12, color: 'var(--text2)' }}>Aujourd&apos;hui</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
