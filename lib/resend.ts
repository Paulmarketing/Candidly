import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

// Template HTML pour l'email de rappel de relance
export function buildReminderEmailHtml(params: {
  userName: string
  candidatures: { entreprise: string; poste: string; date_rappel: string }[]
}): string {
  const { userName, candidatures } = params

  const rows = candidatures
    .map(
      (c) => `
      <tr>
        <td style="padding:10px 16px;border-bottom:1px solid #f0f0f0;font-weight:500;color:#1a1a2e;">${c.entreprise}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #f0f0f0;color:#4a4f72;">${c.poste}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #f0f0f0;color:#f5a623;font-weight:500;">${new Date(c.date_rappel).toLocaleDateString('fr-FR')}</td>
      </tr>`
    )
    .join('')

  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f6fa;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f6fa;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:18px;box-shadow:0 4px 24px rgba(80,90,140,0.10);overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#5b7cf6,#9b8ef8);padding:32px 40px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:40px;height:40px;background:rgba(255,255,255,0.2);border-radius:10px;text-align:center;vertical-align:middle;margin-right:12px;">
                    <span style="font-size:20px;">💼</span>
                  </td>
                  <td style="padding-left:12px;">
                    <div style="color:rgba(255,255,255,0.85);font-size:12px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;">Candidly</div>
                    <div style="color:#ffffff;font-size:20px;font-weight:600;margin-top:2px;">Rappels de relance</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 8px;color:#4a4f72;font-size:15px;">Bonjour ${userName || 'là'} 👋</p>
              <p style="margin:0 0 24px;color:#1a1a2e;font-size:17px;font-weight:500;">
                Tu as ${candidatures.length} candidature${candidatures.length > 1 ? 's' : ''} à relancer bientôt.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0f0f0;border-radius:12px;overflow:hidden;">
                <tr style="background:#f8f9ff;">
                  <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:600;color:#8890b0;text-transform:uppercase;letter-spacing:0.06em;">Entreprise</th>
                  <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:600;color:#8890b0;text-transform:uppercase;letter-spacing:0.06em;">Poste</th>
                  <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:600;color:#8890b0;text-transform:uppercase;letter-spacing:0.06em;">Date rappel</th>
                </tr>
                ${rows}
              </table>
              <div style="margin-top:28px;text-align:center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#5b7cf6,#9b8ef8);color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:40px;font-size:15px;font-weight:500;box-shadow:0 4px 16px rgba(91,124,246,0.35);">
                  Ouvrir Candidly →
                </a>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #f0f0f0;text-align:center;">
              <p style="margin:0;color:#8890b0;font-size:12px;">
                Tu reçois cet email car tu as activé les rappels sur Candidly.<br>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="color:#5b7cf6;">Gérer mes préférences</a>
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
