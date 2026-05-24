import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { resend, buildReminderEmailHtml } from '@/lib/resend'

// Cette route est appelée chaque matin à 8h par Vercel Cron
// Configuration dans vercel.json :
// { "crons": [{ "path": "/api/cron/reminders", "schedule": "0 8 * * *" }] }

export async function GET(req: NextRequest) {
  // Sécurité : vérifie le header Vercel Cron ou un secret custom
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const supabase = createAdminClient()

  // Fenêtre : aujourd'hui et les 3 prochains jours
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const in3Days = new Date(today)
  in3Days.setDate(in3Days.getDate() + 3)

  const todayStr = today.toISOString().split('T')[0]
  const in3DaysStr = in3Days.toISOString().split('T')[0]

  // Récupère toutes les candidatures avec rappel dans la fenêtre, pour des utilisateurs Pro
  const { data: candidatures, error } = await supabase
    .from('candidatures')
    .select(`
      id,
      entreprise,
      poste,
      date_rappel,
      user_id,
      profiles!inner (
        full_name,
        is_pro
      )
    `)
    .gte('date_rappel', todayStr)
    .lte('date_rappel', in3DaysStr)
    .eq('profiles.is_pro', true)

  if (error) {
    console.error('[CRON] Erreur récupération candidatures:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!candidatures || candidatures.length === 0) {
    return NextResponse.json({ sent: 0, message: 'Aucun rappel à envoyer' })
  }

  // Groupe par utilisateur
  const byUser = new Map<
    string,
    { email: string; name: string; items: { entreprise: string; poste: string; date_rappel: string }[] }
  >()

  for (const c of candidatures) {
    const profile = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles
    if (!profile?.is_pro) continue

    if (!byUser.has(c.user_id)) {
      // Récupère l'email de l'utilisateur via auth.users (nécessite le client admin)
      const { data: authUser } = await supabase.auth.admin.getUserById(c.user_id)
      if (!authUser?.user?.email) continue

      byUser.set(c.user_id, {
        email: authUser.user.email,
        name: profile.full_name || authUser.user.email.split('@')[0],
        items: [],
      })
    }

    byUser.get(c.user_id)!.items.push({
      entreprise: c.entreprise,
      poste: c.poste,
      date_rappel: c.date_rappel!,
    })
  }

  // Envoie un email par utilisateur
  let sent = 0
  const errors: string[] = []

  for (const [, userData] of byUser) {
    try {
      await resend.emails.send({
        from: `Candidly <${process.env.FROM_EMAIL || 'onboarding@resend.dev'}>`,
        to: userData.email,
        subject: `📅 ${userData.items.length} relance${userData.items.length > 1 ? 's' : ''} à faire cette semaine`,
        html: buildReminderEmailHtml({
          userName: userData.name,
          candidatures: userData.items,
        }),
      })
      sent++
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur inconnue'
      errors.push(`${userData.email}: ${msg}`)
      console.error('[CRON] Erreur envoi email:', msg)
    }
  }

  return NextResponse.json({
    sent,
    errors: errors.length > 0 ? errors : undefined,
    message: `${sent} email(s) envoyé(s)`,
  })
}
