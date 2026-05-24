export type Statut = 'Envoyé' | 'Relance' | 'Entretien' | 'Accepté' | 'Refusé'

export interface Candidature {
  id: string
  user_id: string
  entreprise: string
  poste: string
  statut: Statut
  date_envoi: string | null
  date_rappel: string | null
  lien_offre: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type CandidatureInsert = Omit<Candidature, 'id' | 'user_id' | 'created_at' | 'updated_at'>

export interface Profile {
  id: string
  full_name: string | null
  is_pro: boolean
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
}

export interface Stats {
  total: number
  en_cours: number
  entretiens: number
  acceptes: number
  taux_succes: number
}

// Badge couleurs par statut
export const STATUT_STYLES: Record<Statut, { bg: string; text: string; label: string }> = {
  'Envoyé': {
    bg: 'rgba(91,124,246,0.12)',
    text: '#185FA5',
    label: 'Envoyé',
  },
  'Relance': {
    bg: 'rgba(245,166,35,0.12)',
    text: '#854F0B',
    label: 'Relance',
  },
  'Entretien': {
    bg: 'rgba(155,142,248,0.15)',
    text: '#3C3489',
    label: 'Entretien',
  },
  'Accepté': {
    bg: 'rgba(52,201,138,0.12)',
    text: '#3B6D11',
    label: 'Accepté',
  },
  'Refusé': {
    bg: 'rgba(242,95,92,0.12)',
    text: '#791F1F',
    label: 'Refusé',
  },
}

export const STATUTS: Statut[] = ['Envoyé', 'Relance', 'Entretien', 'Accepté', 'Refusé']
