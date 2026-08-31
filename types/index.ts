export type Statut = 'Envoyé' | 'Relance' | 'Entretien' | 'Accepté' | 'Refusé'

export interface Candidature {
  id: string
  user_id: string
  entreprise: string
  poste: string
  statut: Statut
  date_envoi: string | null
  date_rappel: string | null
  date_entretien: string | null
  lien_offre: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type CandidatureInsert = Omit<Candidature, 'id' | 'user_id' | 'created_at' | 'updated_at'>

export interface Contact {
  id: string
  user_id: string
  prenom: string
  nom: string
  poste: string | null
  entreprise: string | null
  linkedin_url: string | null
  email: string | null
  notes: string | null
  created_at: string
}

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

// Badge couleurs par statut — utilisent des CSS variables pour le support dark mode
export const STATUT_STYLES: Record<Statut, { bg: string; text: string; label: string }> = {
  'Envoyé': {
    bg: 'var(--statut-envoye-bg)',
    text: 'var(--statut-envoye-text)',
    label: 'Envoyé',
  },
  'Relance': {
    bg: 'var(--statut-relance-bg)',
    text: 'var(--statut-relance-text)',
    label: 'Relance',
  },
  'Entretien': {
    bg: 'var(--statut-entretien-bg)',
    text: 'var(--statut-entretien-text)',
    label: 'Entretien',
  },
  'Accepté': {
    bg: 'var(--statut-accepte-bg)',
    text: 'var(--statut-accepte-text)',
    label: 'Accepté',
  },
  'Refusé': {
    bg: 'var(--statut-refuse-bg)',
    text: 'var(--statut-refuse-text)',
    label: 'Refusé',
  },
}

export const STATUTS: Statut[] = ['Envoyé', 'Relance', 'Entretien', 'Accepté', 'Refusé']
