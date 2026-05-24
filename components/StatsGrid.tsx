'use client'

import type { Stats } from '@/types'

interface StatCardProps {
  label: string
  value: string | number
  icon: string
  color: string
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div
      className="glass-card-secondary hover-card"
      style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: 'var(--text3)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {label}
        </span>
        <span
          style={{
            width: 32,
            height: 32,
            background: `${color}18`,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
          }}
        >
          {icon}
        </span>
      </div>
      <span
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: 'var(--text1)',
          lineHeight: 1,
        }}
      >
        {value}
      </span>
    </div>
  )
}

interface StatsGridProps {
  stats: Stats
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 14,
      }}
    >
      <StatCard label="Total" value={stats.total} icon="📋" color="#5b7cf6" />
      <StatCard label="En cours" value={stats.en_cours} icon="⏳" color="#f5a623" />
      <StatCard label="Entretiens" value={stats.entretiens} icon="🎯" color="#9b8ef8" />
      <StatCard label="Acceptées" value={stats.acceptes} icon="✅" color="#34c98a" />
      <StatCard
        label="Taux de succès"
        value={`${stats.taux_succes}%`}
        icon="📈"
        color="#5b7cf6"
      />
    </div>
  )
}
