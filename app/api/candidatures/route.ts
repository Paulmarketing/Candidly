import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import type { Statut } from '@/types'

// GET — liste les candidatures de l'utilisateur connecté
export async function GET() {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('candidatures')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

// POST — crée une nouvelle candidature
export async function POST(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  // Vérifie la limite du plan gratuit
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_pro')
    .eq('id', session.user.id)
    .single()

  if (!profile?.is_pro) {
    const { count } = await supabase
      .from('candidatures')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id)

    if ((count ?? 0) >= 10) {
      return NextResponse.json(
        { error: 'Limite du plan gratuit atteinte (10 candidatures).' },
        { status: 403 }
      )
    }
  }

  const body = await req.json()
  const { entreprise, poste, statut, date_envoi, date_rappel, lien_offre, notes } = body

  if (!entreprise || !poste) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
  }

  const validStatuts: Statut[] = ['Envoyé', 'Relance', 'Entretien', 'Accepté', 'Refusé']
  if (statut && !validStatuts.includes(statut)) {
    return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('candidatures')
    .insert({
      user_id: session.user.id,
      entreprise,
      poste,
      statut: statut || 'Envoyé',
      date_envoi: date_envoi || null,
      date_rappel: date_rappel || null,
      lien_offre: lien_offre || null,
      notes: notes || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data, { status: 201 })
}
