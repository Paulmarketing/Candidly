'use client'

interface LogoProps {
  size?: number
  showText?: boolean
  textColor?: string
}

export default function Logo({ size = 36, showText = true, textColor = 'var(--text1)' }: LogoProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {/* Icône : 3 cartes empilées en cascade avec coche */}
      <svg
        width={size * 1.4}
        height={size}
        viewBox="0 0 78 56"
        fill="none"
        style={{ flexShrink: 0 }}
      >
        {/* Carte arrière — bleu très clair */}
        <rect x="2" y="2" width="55" height="20" rx="6" fill="#B8C1FB" />
        {/* Carte du milieu — bleu moyen */}
        <rect x="11" y="18" width="55" height="20" rx="6" fill="#8A97F5" />
        {/* Carte avant — bleu accent avec coche */}
        <rect x="20" y="34" width="55" height="20" rx="6" fill="#5B7CF6" />
        {/* Coche blanche sur la carte avant */}
        <path
          d="M34 44 L42 52 L62 36"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

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
