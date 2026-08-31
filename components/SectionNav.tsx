'use client'

export type AppSection = 'candidatures' | 'networking'

interface SectionNavProps {
  current: AppSection
  onChange: (s: AppSection) => void
}

const SECTIONS: { id: AppSection; icon: string; label: string; sublabel: string }[] = [
  { id: 'candidatures', icon: '💼', label: 'Candidatures', sublabel: 'Suivi & IA' },
  { id: 'networking', icon: '🤝', label: 'Networking', sublabel: 'Contacts & Emails' },
]

export default function SectionNav({ current, onChange }: SectionNavProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        marginBottom: 28,
        padding: '6px',
        background: 'var(--glass)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--glass-border)',
        borderRadius: 18,
        boxShadow: 'var(--glass-shadow)',
        width: 'fit-content',
      }}
    >
      {SECTIONS.map(({ id, icon, label, sublabel }) => {
        const isActive = current === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 20px',
              borderRadius: 12,
              border: 'none',
              background: isActive
                ? 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)'
                : 'transparent',
              color: isActive ? '#fff' : 'var(--text2)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: isActive ? '0 4px 16px rgba(91,124,246,0.35)' : 'none',
            }}
          >
            <span style={{ fontSize: 18 }}>{icon}</span>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>{label}</p>
              <p style={{ fontSize: 11, opacity: isActive ? 0.8 : 0.6, lineHeight: 1.2 }}>{sublabel}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
