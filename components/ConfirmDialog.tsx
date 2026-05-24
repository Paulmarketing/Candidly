'use client'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Supprimer',
  onConfirm,
  onCancel,
  loading,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div
        className="glass-card animate-slide-up"
        style={{ width: '100%', maxWidth: 380, padding: '28px 28px' }}
      >
        <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text1)', marginBottom: 10 }}>
          {title}
        </h3>
        <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.5, marginBottom: 24 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn-secondary" onClick={onCancel} disabled={loading}>
            Annuler
          </button>
          <button className="btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? '…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
