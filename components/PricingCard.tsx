'use client'

interface PricingCardProps {
  plan: 'gratuit' | 'pro'
  onChoose: () => void
  loading?: boolean
  isCurrent?: boolean
}

export default function PricingCard({ plan, onChoose, loading, isCurrent }: PricingCardProps) {
  const isPro = plan === 'pro'

  const proFeatures = [
    '✅ Candidatures illimitées',
    '✅ Calendrier des entretiens',
    '✅ Import d\'offre par URL (IA)',
    '✅ Rappels email automatiques',
    '✅ Export CSV',
    '✅ Section Networking illimitée',
    '✅ Email IA illimité (5 templates)',
    '✨ Analyse de CV par IA illimitée',
    '✨ Lettre de motivation IA illimitée',
    '✨ Préparation aux entretiens IA',
  ]

  const freeFeatures = [
    '✅ Jusqu\'à 10 candidatures',
    '✅ Calendrier des entretiens',
    '✅ Tableau de bord & stats',
    '✅ Export CSV',
    '🎁 10 imports d\'offre par URL',
    '🎁 10 contacts Networking',
    '🎁 5 emails IA gratuits',
    '🎁 1 analyse CV gratuite',
    '🎁 1 lettre de motivation gratuite',
    '🎁 1 préparation entretien gratuite',
    '⬜ Rappels email (Pro)',
    '⬜ Networking illimité (Pro)',
  ]

  return (
    <div
      className="glass-card hover-card"
      style={{
        padding: '32px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        position: 'relative',
        outline: isPro ? '2px solid rgba(91,124,246,0.4)' : 'none',
        maxWidth: 340,
        width: '100%',
      }}
    >
      {isPro && (
        <div
          style={{
            position: 'absolute',
            top: -12,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg,#5b7cf6,#9b8ef8)',
            color: 'white',
            fontSize: 11,
            fontWeight: 600,
            padding: '4px 14px',
            borderRadius: 40,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(91,124,246,0.35)',
          }}
        >
          ✨ Le plus populaire
        </div>
      )}

      {/* Header */}
      <div>
        <p
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: 'var(--text3)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 8,
          }}
        >
          {isPro ? 'Plan Pro' : 'Plan Gratuit'}
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontSize: 40, fontWeight: 600, color: 'var(--text1)', lineHeight: 1 }}>
            {isPro ? '5€' : '0€'}
          </span>
          <span style={{ fontSize: 13, color: 'var(--text3)' }}>{isPro ? '/mois' : 'pour toujours'}</span>
        </div>
        {isPro && (
          <p style={{ fontSize: 12, color: 'var(--accent)', marginTop: 6, fontWeight: 500 }}>
            Essai gratuit 7 jours — CB requise
          </p>
        )}
      </div>

      {/* Features */}
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(isPro ? proFeatures : freeFeatures).map((feature, i) => (
          <li
            key={i}
            style={{
              fontSize: 13,
              color: feature.startsWith('⬜') ? 'var(--text3)' : 'var(--text2)',
            }}
          >
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA */}
      {isCurrent ? (
        <div
          style={{
            textAlign: 'center',
            padding: '12px',
            borderRadius: 40,
            background: 'rgba(52,201,138,0.1)',
            color: 'var(--success)',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          ✓ Plan actuel
        </div>
      ) : (
        <button
          className={isPro ? 'btn-primary' : 'btn-secondary'}
          onClick={onChoose}
          disabled={loading}
          style={{ justifyContent: 'center', padding: '13px' }}
        >
          {loading ? 'Chargement…' : isPro ? 'Passer à Pro' : 'Rester sur Gratuit'}
        </button>
      )}
    </div>
  )
}
