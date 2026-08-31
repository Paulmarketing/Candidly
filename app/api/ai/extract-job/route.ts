import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createServerClient } from '@/lib/supabase-server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { url } = await req.json()
  if (!url) return NextResponse.json({ error: 'URL manquante' }, { status: 400 })

  let pageText = ''
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
      },
      signal: AbortSignal.timeout(8000),
    })
    const html = await res.text()
    // Nettoyage HTML → texte brut
    pageText = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s{2,}/g, ' ')
      .trim()
      .slice(0, 12000)
  } catch {
    return NextResponse.json({ error: 'Impossible de charger cette URL. Vérifie qu\'elle est accessible.' }, { status: 422 })
  }

  if (pageText.length < 100) {
    return NextResponse.json({ error: 'Page vide ou inaccessible.' }, { status: 422 })
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
  const prompt = `Tu es un assistant qui extrait les informations d'une offre d'emploi.

Analyse ce texte et extrais les informations suivantes. Réponds UNIQUEMENT avec un objet JSON valide, sans markdown.

{
  "entreprise": "nom de l'entreprise qui recrute",
  "poste": "intitulé exact du poste (stage/alternance/CDI/CDD + domaine)",
  "contrat": "type de contrat (Stage, Alternance, CDI, CDD, Freelance)",
  "lieu": "ville ou remote",
  "notes": "résumé des missions principales en 3-5 lignes max",
  "salaire": "rémunération si mentionnée, sinon null"
}

Si une information est absente, mets null. N'invente rien.

Texte de l'offre :
${pageText}`

  try {
    const result = await model.generateContent(prompt)
    const raw = result.response.text().trim()
    const clean = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim()
    const data = JSON.parse(clean)
    return NextResponse.json({ ...data, lien_offre: url })
  } catch {
    return NextResponse.json({ error: 'Extraction échouée. Essaie avec une autre URL.' }, { status: 500 })
  }
}
