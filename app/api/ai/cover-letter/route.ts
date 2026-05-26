import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createServerClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  // Vérifie que l'utilisateur est connecté et Pro
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('is_pro').eq('id', session.user.id).single()
  if (!profile?.is_pro) {
    return NextResponse.json({ error: 'Fonctionnalité réservée au plan Pro' }, { status: 403 })
  }

  const { entreprise, poste, description, profil } = await req.json()
  if (!entreprise || !poste) {
    return NextResponse.json({ error: 'Entreprise et poste requis' }, { status: 400 })
  }

  const prompt = `Tu es un expert en recrutement français. Rédige une lettre de motivation professionnelle et personnalisée en français pour ce candidat.

Informations :
- Entreprise : ${entreprise}
- Poste : ${poste}
- Description du poste : ${description || 'Non fournie'}
- Profil du candidat : ${profil || 'Étudiant en recherche de stage/emploi'}

Consignes :
- Ton professionnel mais authentique, pas trop formel
- 3 paragraphes : accroche + valeur ajoutée + conclusion avec call-to-action
- Maximum 250 mots
- Commence directement par "Madame, Monsieur," sans objet ni coordonnées
- Termine par "Dans l'attente de votre retour, je reste disponible pour un entretien.\\n\\nCordialement,"
- Ne mets pas de nom à la fin (le candidat l'ajoutera lui-même)
- Adapte le contenu à l'entreprise et au poste spécifiquement`

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const result = await model.generateContent(prompt)
    const letter = result.response.text().trim()
    return NextResponse.json({ letter })
  } catch (err) {
    console.error('[AI] Erreur génération lettre:', err)
    return NextResponse.json({ error: "La génération a échoué. Réessaie dans quelques instants." }, { status: 500 })
  }
}
