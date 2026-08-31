import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createServerClient } from '@/lib/supabase-server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { text, linkedin_url } = await req.json()
  if (!text || text.trim().length < 20) {
    return NextResponse.json({ error: 'Texte trop court.' }, { status: 400 })
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
  const prompt = `Tu es un assistant qui extrait les informations d'un profil LinkedIn.

Analyse ce texte (copié depuis un profil LinkedIn) et extrais les informations. Réponds UNIQUEMENT avec un objet JSON valide, sans markdown.

{
  "prenom": "prénom de la personne",
  "nom": "nom de famille",
  "poste": "titre actuel (ex: Directeur Marketing chez Acme, Ingénieur Logiciel)",
  "entreprise": "entreprise actuelle",
  "email": "email si visible, sinon null",
  "résumé": "résumé du profil en 2-3 phrases max, ce qui est pertinent pour un recruteur / quelqu'un qui veut les contacter"
}

Texte du profil :
${text.slice(0, 8000)}`

  try {
    const result = await model.generateContent(prompt)
    const raw = result.response.text().trim()
    const clean = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim()
    const data = JSON.parse(clean)
    return NextResponse.json({ ...data, linkedin_url: linkedin_url || null })
  } catch {
    return NextResponse.json({ error: 'Extraction échouée.' }, { status: 500 })
  }
}
