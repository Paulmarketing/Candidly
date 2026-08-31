import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createServerClient } from '@/lib/supabase-server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const TEMPLATES: Record<string, { label: string; desc: string }> = {
  candidature_spontanee: {
    label: 'Candidature spontanée',
    desc: 'candidature spontanée sans offre précise, présentation du profil et motivation',
  },
  candidature_offre: {
    label: 'Candidature pour une offre',
    desc: 'candidature en réponse à une offre d\'emploi identifiée, référencer l\'offre et matcher le profil',
  },
  demande_meeting: {
    label: 'Demande de rencontre',
    desc: 'demande d\'un échange (café, call) pour discuter du secteur, d\'opportunités ou d\'un projet',
  },
  relance: {
    label: 'Relance',
    desc: 'relance après un premier email ou entretien sans réponse, rappel courtois et sans pression',
  },
  remerciement: {
    label: 'Remerciement',
    desc: 'remerciement après un entretien ou une rencontre, synthèse de l\'échange et réaffirmation de la motivation',
  },
}

const TONES: Record<string, string> = {
  formel: 'très formel, style corporate, vouvoiement strict, formules de politesse élaborées',
  professionnel: 'professionnel et courant, vouvoiement, direct sans être sec, ton habituel en entreprise',
  chaleureux: 'chaleureux et humain, vouvoiement mais détendu, crée une vraie connexion personnelle, montre de l\'enthousiasme',
  direct: 'direct et concis, va droit au but, peu de formules superflues, chaque phrase a un rôle, max 120 mots de corps',
}

export async function POST(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  // Récupère le prénom de l'utilisateur
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', session.user.id)
    .single()

  const userFirstName = profile?.full_name?.split(' ')[0] || session.user.email?.split('@')[0] || 'moi'

  const { template, tone, contact, poste, contexte } = await req.json()

  if (!TEMPLATES[template] || !TONES[tone]) {
    return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 })
  }

  const contactLine = contact
    ? `${contact.prenom} ${contact.nom}${contact.poste ? `, ${contact.poste}` : ''}${contact.entreprise ? ` chez ${contact.entreprise}` : ''}`
    : 'un recruteur (prénom/entreprise non spécifiés)'

  const prompt = `Tu es un expert en communication professionnelle et en recherche d'emploi en France.
Rédige un email professionnel en français pour ${userFirstName}.

TYPE D'EMAIL : ${TEMPLATES[template].desc}
TON : ${TONES[tone]}
DESTINATAIRE : ${contactLine}
${poste ? `POSTE VISÉ : ${poste}` : ''}
${contexte ? `CONTEXTE : ${contexte}` : ''}

RÈGLES ABSOLUES :
- Écris en français uniquement
- Adapte strictement le ton demandé
- Objet : accrocheur, précis, max 65 caractères
- Corps : salutation adaptée → accroche personnalisée → développement → call-to-action clair → formule de politesse → signe avec "${userFirstName}" uniquement
- Personnalise avec les infos du destinataire (prénom, poste, entreprise)
- Longueur du corps : 80-150 mots pour relance/meeting, 150-250 mots pour candidature
- Ne mets pas de placeholders comme [Votre nom] — utilise "${userFirstName}"
- Formule de politesse adaptée au ton (formel = "Dans l'attente de votre retour, veuillez agréer…", chaleureux = "Au plaisir d'échanger avec vous,")

Réponds UNIQUEMENT avec ce JSON valide, sans markdown :
{
  "objet": "Objet de l'email",
  "corps": "Corps complet de l'email avec sauts de ligne \\n"
}`

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const result = await model.generateContent(prompt)
    const raw = result.response.text().trim()
    const clean = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim()
    const data = JSON.parse(clean)
    return NextResponse.json({ objet: data.objet, corps: data.corps })
  } catch {
    return NextResponse.json({ error: 'Génération échouée. Réessaie.' }, { status: 500 })
  }
}
