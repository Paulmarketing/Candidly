'use client'

import type { Candidature } from '@/types'

interface ReminderBannerProps {
  candidatures: Candidature[]
}

export default function ReminderBanner({ candidatures }: ReminderBannerProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcoming = candidatures.filter((c) => {
    if (!c.date_rappel) return false
    const rappel = new Date(c.date_rappel)
    rappel.setHours(0, 0, 0, 0)
    const diff = Math.ceil((rappel.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff <= 3
  })

  if (upcoming.length === 0) return null

  return (
    <div
      style={{
        background: 'rgba(245,166,35,0.12)',
        border: '1px solid rgba(245,166,35,0.3)',
        borderRadius: 12,
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
      }}
    >
      {/* Point lumineux animé */}
      <span
        className="pulse-dot"
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: 'var(--warn)',
          display: 'inline-block',
          flexShrink: 0,
          marginTop: 3,
        }}
      />
      <div>
        <p style={{ fontWeight: 500, color: '#854F0B', fontSize: 14 }}>
          {upcoming.length} relance{upcoming.length > 1 ? 's' : ''} à faire bientôt
        </p>
        <p style={{ fontSize: 12, color: '#a06010', marginTop: 4 }}>
          {upcoming.map((c) => c.entreprise).join(', ')}
        </p>
      </div>
    </div>
  )
}
