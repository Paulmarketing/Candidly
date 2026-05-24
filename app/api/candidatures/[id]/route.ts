import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import type { Statut } from '@/types'

// Next.js 15 : les params des routes dynamiques sont maintenant asynchrones
type RouteParams = { params: Promise<{ id: string }> }

// PATCH — modifie une candidature
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const body = await req.json()
  const { entreprise, poste, statut, date_envoi, date_rappel, lien_offre, notes } = body

  const validStatuts: Statut[] = ['Envoyé', 'Relance', 'Entretien', 'Accepté', 'Refusé']
  if (statut && !validStatuts.includes(statut)) {
    return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })
  }

  // La RLS Supabase garantit que l'utilisateur ne modifie que ses propres candidatures
  const { data, error } = await supabase
    .from('candidatures')
    .update({
      ...(entreprise !== undefined && { entreprise }),
      ...(poste !== undefined && { poste }),
      ...(statut !== undefined && { statut }),
      ...(date_envoi !== undefined && { date_envoi }),
      ...(date_rappel !== undefined && { date_rappel }),
      ...(lien_offre !== undefined && { lien_offre }),
      ...(notes !== undefined && { notes }),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', session.user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'Candidature introuvable' }, { status: 404 })

  return NextResponse.json(data)
}

// DELETE — supprime une candidature
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { error } = await supabase
    .from('candidatures')
    .delete()
    .eq('id', id)
    .eq('user_id', session.user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return new NextResponse(null, { status: 204 })
}
