import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createServerClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { text } = await req.json()
  if (!text || text.trim().length < 50) {
    return NextResponse.json({ error: 'Texte trop court. Colle bien le contenu complet de ton profil LinkedIn.' }, { status: 400 })
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `Tu es un expert en personal branding et recrutement en France. Analyse ce profil LinkedIn (texte copié-collé par l'utilisateur) et retourne une analyse structurée en français avec exactement ce format JSON (sans markdown, sans backticks, juste le JSON brut) :

{
  "score": <nombre entier entre 1 et 10>,
  "points_forts": ["point fort 1", "point fort 2", "point fort 3"],
  "points_faibles": ["point faible 1", "point faible 2", "point faible 3"],
  "suggestions": ["suggestion concrète et actionnable 1", "suggestion 2", "suggestion 3", "suggestion 4"],
  "resume": "Un paragraphe de 2-3 phrases résumant l'analyse globale du profil"
}

Évalue ces aspects : titre/headline, résumé (section À propos), expériences (clarté, métriques, impact), compétences, formation, présence globale. Sois bienveillant, précis et orienté action. Si certaines sections semblent absentes du texte, signale-le dans les points faibles.

Texte du profil LinkedIn :
${text.substring(0, 8000)}`

    const result = await model.generateContent(prompt)
    const raw = result.response.text().trim()
    const clean = raw.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim()

    let analysis
    try {
      analysis = JSON.parse(clean)
    } catch {
      console.error('[AI] Réponse Gemini non-JSON:', clean.substring(0, 200))
      return NextResponse.json({ error: 'Réponse IA invalide. Réessaie.' }, { status: 500 })
    }

    return NextResponse.json(analysis)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    console.error('[AI] Erreur analyse LinkedIn:', message)
    return NextResponse.json({ error: "L'analyse a échoué. Réessaie." }, { status: 500 })
  }
}
