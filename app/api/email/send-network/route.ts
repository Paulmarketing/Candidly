import { NextRequest, NextResponse } from 'next/server'
import { resend } from '@/lib/resend'
import { createServerClient } from '@/lib/supabase-server'

function buildNetworkEmailHtml(params: {
  corps: string
  senderName: string
  senderEmail: string
}): string {
  const { corps, senderName, senderEmail } = params

  // Corps en HTML : on convertit les sauts de ligne en <br> et on protège les URLs
  const htmlBody = corps
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .split('\n')
    .map(line => line.trim() === '' ? '<br>' : `<span>${line}</span><br>`)
    .join('\n')

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f5f6fa;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f6fa;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;box-shadow:0 4px 24px rgba(80,90,140,0.08);overflow:hidden;">
          <!-- Corps -->
          <tr>
            <td style="padding:40px 48px 32px;">
              <div style="font-size:15px;line-height:1.75;color:#1a1a2e;">
                ${htmlBody}
              </div>
            </td>
          </tr>
          <!-- Footer discret -->
          <tr>
            <td style="padding:16px 48px 28px;border-top:1px solid #f0f2f8;">
              <p style="margin:0;font-size:11px;color:#aab0c8;line-height:1.6;">
                Envoyé par <strong style="color:#8890b0;">${senderName}</strong> ·
                Pour répondre : <a href="mailto:${senderEmail}" style="color:#5b7cf6;text-decoration:none;">${senderEmail}</a><br>
                <span style="font-size:10px;color:#c8cde8;">Message généré avec l'aide de Candidly</span>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const userEmail = session.user.email!

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', session.user.id)
    .single()

  const senderName = profile?.full_name || userEmail.split('@')[0]
  const senderFirstName = senderName.split(' ')[0]

  const { to, objet, corps } = await req.json()

  if (!to || !objet || !corps) {
    return NextResponse.json({ error: 'Paramètres manquants (to, objet, corps)' }, { status: 400 })
  }

  // Validation email basique
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return NextResponse.json({ error: 'Adresse email invalide' }, { status: 400 })
  }

  try {
    await resend.emails.send({
      from: `${senderFirstName} via Candidly <${process.env.FROM_EMAIL || 'networking@candidlyapp.fr'}>`,
      to,
      reply_to: userEmail,
      subject: objet,
      html: buildNetworkEmailHtml({ corps, senderName, senderEmail: userEmail }),
      text: corps,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur Resend'
    console.error('[EMAIL SEND]', message)
    return NextResponse.json({ error: 'Envoi échoué. Vérifie que le domaine est vérifié dans Resend.' }, { status: 500 })
  }
}
