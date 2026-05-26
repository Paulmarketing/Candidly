import { NextRequest, NextResponse } from 'next/server'
import { geminiModel } from '@/lib/gemini'
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

  // Récupère le PDF envoyé en base64
  const { pdfBase64 } = await req.json()
  if (!pdfBase64) return NextResponse.json({ error: 'PDF manquant' }, { status: 400 })

  const prompt = `Tu es un expert RH et coach carrière français. Analyse ce CV en français et retourne une analyse structurée avec exactement ce format JSON (sans markdown, juste le JSON brut) :

{
  "score": <nombre entre 1 et 10>,
  "points_forts": ["point 1", "point 2", "point 3"],
  "points_faibles": ["point 1", "point 2", "point 3"],
  "suggestions": ["suggestion concrète 1", "suggestion concrète 2", "suggestion concrète 3"],
  "resume": "Un paragraphe de 2-3 phrases résumant l'analyse globale"
}

Sois précis, bienveillant et orienté action. Les suggestions doivent être très concrètes et applicables immédiatement.`

  try {
    const result = await geminiModel.generateContent([
      { inlineData: { mimeType: 'application/pdf', data: pdfBase64 } },
      prompt,
    ])

    const text = result.response.text().trim()
    // Nettoie la réponse si Gemini ajoute du markdown
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const analysis = JSON.parse(clean)

    return NextResponse.json(analysis)
  } catch (err) {
    console.error('[AI] Erreur analyse CV:', err)
    return NextResponse.json({ error: 'Erreur lors de l\'analyse' }, { status: 500 })
  }
}
