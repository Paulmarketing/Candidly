import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createServerClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_pro, free_cv_used')
    .eq('id', session.user.id)
    .single()

  // Bloqué si : pas Pro ET crédit gratuit déjà utilisé
  if (!profile?.is_pro && profile?.free_cv_used) {
    return NextResponse.json({ error: 'UPGRADE_REQUIRED' }, { status: 403 })
  }

  const { pdfBase64 } = await req.json()
  if (!pdfBase64) return NextResponse.json({ error: 'PDF manquant' }, { status: 400 })

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `Tu es un expert RH et coach carrière français. Analyse ce CV en français et retourne une analyse structurée avec exactement ce format JSON (sans markdown, sans backticks, juste le JSON brut) :

{
  "score": <nombre entre 1 et 10>,
  "points_forts": ["point 1", "point 2", "point 3"],
  "points_faibles": ["point 1", "point 2", "point 3"],
  "suggestions": ["suggestion concrète 1", "suggestion concrète 2", "suggestion concrète 3"],
  "resume": "Un paragraphe de 2-3 phrases résumant l'analyse globale"
}

Sois précis, bienveillant et orienté action.`

    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [
          { inlineData: { mimeType: 'application/pdf', data: pdfBase64 } },
          { text: prompt },
        ],
      }],
    })

    const text = result.response.text().trim()
    const clean = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim()

    let analysis
    try {
      analysis = JSON.parse(clean)
    } catch {
      console.error('[AI] Réponse Gemini non-JSON:', clean.substring(0, 200))
      return NextResponse.json({ error: 'Réponse IA invalide, réessaie.' }, { status: 500 })
    }

    // Marquer le crédit gratuit comme utilisé si l'utilisateur n'est pas Pro
    if (!profile?.is_pro) {
      await supabase
        .from('profiles')
        .update({ free_cv_used: true })
        .eq('id', session.user.id)
    }

    return NextResponse.json({ ...analysis, usedFreeCredit: !profile?.is_pro })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    console.error('[AI] Erreur Gemini:', message)
    return NextResponse.json({ error: "L'analyse a échoué. Vérifie que ton fichier est bien un PDF lisible et réessaie." }, { status: 500 })
  }
}
