import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createServerClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_pro, free_interview_used')
    .eq('id', session.user.id)
    .single()

  // Bloqué si : pas Pro ET crédit gratuit déjà utilisé
  if (!profile?.is_pro && profile?.free_interview_used) {
    return NextResponse.json({ error: 'UPGRADE_REQUIRED' }, { status: 403 })
  }

  const { entreprise, poste, description } = await req.json()
  if (!entreprise || !poste) {
    return NextResponse.json({ error: 'Entreprise et poste requis' }, { status: 400 })
  }

  const prompt = `Tu es un expert en recrutement français et coach en entretien d'embauche. Prépare une session d'entraînement personnalisée pour cet entretien.

Entreprise : ${entreprise}
Poste : ${poste}
Description du poste : ${description || 'Non fournie'}

Retourne exactement ce format JSON (sans markdown, sans backticks, juste le JSON brut) :

{
  "questions": [
    {
      "question": "La question posée par le recruteur",
      "type": "motivation",
      "reponse_ideale": "Structure de réponse idéale en 3-4 phrases concrètes",
      "a_eviter": "Ce qu'il ne faut surtout pas dire ou faire"
    }
  ],
  "points_cles": ["Point important sur l'entreprise ou le poste à mentionner impérativement", "..."],
  "conseils": ["Conseil pratique et spécifique pour réussir cet entretien", "..."]
}

Règles :
- Génère exactement 8 questions variées et réalistes pour ce poste spécifique
- Les types possibles : "motivation", "competence", "comportemental", "technique", "piege"
- Les questions doivent être adaptées à l'entreprise et au poste, pas génériques
- 3 points clés et 3 conseils pratiques
- Tout en français`

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()
    const clean = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim()

    let prep
    try {
      prep = JSON.parse(clean)
    } catch {
      console.error('[AI] Réponse Gemini non-JSON:', clean.substring(0, 200))
      return NextResponse.json({ error: 'Réponse IA invalide, réessaie.' }, { status: 500 })
    }

    // Marquer le crédit gratuit comme utilisé si pas Pro
    if (!profile?.is_pro) {
      await supabase
        .from('profiles')
        .update({ free_interview_used: true })
        .eq('id', session.user.id)
    }

    return NextResponse.json({ ...prep, usedFreeCredit: !profile?.is_pro })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    console.error('[AI] Erreur préparation entretien:', message)
    return NextResponse.json({ error: "La préparation a échoué. Réessaie dans quelques instants." }, { status: 500 })
  }
}
