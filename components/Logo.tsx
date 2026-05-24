'use client'

interface LogoProps {
  size?: number
  showText?: boolean
  textColor?: string
}

export default function Logo({ size = 36, showText = true, textColor = 'var(--text1)' }: LogoProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {/* Icône carrée arrondie avec gradient */}
      <div
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg, #5b7cf6 0%, #9b8ef8 100%)',
          borderRadius: size * 0.28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(91,124,246,0.35)',
          flexShrink: 0,
        }}
      >
        <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill="none">
          <rect x="2" y="7" width="20" height="15" rx="3" fill="white" fillOpacity="0.25" />
          <rect x="2" y="7" width="20" height="15" rx="3" stroke="white" strokeWidth="1.8" />
          <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="12" y1="11" x2="12" y2="18" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="8.5" y1="14.5" x2="15.5" y2="14.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>

      {showText && (
        <span
          style={{
            fontSize: size * 0.58,
            fontWeight: 600,
            color: textColor,
            letterSpacing: '-0.02em',
          }}
        >
          Candidly
        </span>
      )}
    </div>
  )
}
