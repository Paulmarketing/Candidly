'use client'

import type { Stats } from '@/types'

interface StatCardProps {
  label: string
  value: string | number
  icon: string
  gradient: string
  iconBg: string
}

function StatCard({ label, value, icon, gradient, iconBg }: StatCardProps) {
  return (
    <div
      className="glass-card-secondary hover-card"
      style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--text3)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          {label}
        </span>
        <span style={{
          width: 32,
          height: 32,
          background: iconBg,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
        }}>
          {icon}
        </span>
      </div>
      <span style={{
        fontSize: 32,
        fontWeight: 800,
        lineHeight: 1,
        background: gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        {value}
      </span>
    </div>
  )
}

export default function StatsGrid({ stats }: { stats: import('@/types').Stats }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: 14,
    }}>
      <StatCard label="Total"          value={stats.total}          icon="📋" gradient="linear-gradient(135deg,#5b7cf6,#9b8ef8)" iconBg="rgba(91,124,246,0.12)" />
      <StatCard label="En cours"       value={stats.en_cours}       icon="⏳" gradient="linear-gradient(135deg,#f5a623,#f7cc4e)" iconBg="rgba(245,166,35,0.12)" />
      <StatCard label="Entretiens"     value={stats.entretiens}     icon="🎯" gradient="linear-gradient(135deg,#9b8ef8,#c77df0)" iconBg="rgba(155,142,248,0.12)" />
      <StatCard label="Acceptées"      value={stats.acceptes}       icon="✅" gradient="linear-gradient(135deg,#34c98a,#2eb5a0)" iconBg="rgba(52,201,138,0.12)" />
      <StatCard label="Taux de succès" value={`${stats.taux_succes}%`} icon="📈" gradient="linear-gradient(135deg,#5b7cf6,#34c98a)" iconBg="rgba(91,124,246,0.10)" />
    </div>
  )
}
