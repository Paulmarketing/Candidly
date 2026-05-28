import Link from 'next/link'
import Logo from '@/components/Logo'

export default function Confidentialite() {
  return (
    <main style={{ minHeight: '100vh', padding: '0 16px' }}>
      <nav style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0' }}>
        <Link href="/"><Logo /></Link>
        <Link href="/" className="btn-secondary" style={{ fontSize: 13 }}>← Accueil</Link>
      </nav>

      <section style={{ maxWidth: 800, margin: '0 auto 80px' }}>
        <div className="glass-card" style={{ padding: '48px 40px' }}>
          <h1 style={{ fontSize: 32, fontWeight: 600, color: 'var(--text1)', marginBottom: 8 }}>Politique de confidentialité</h1>
          <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 40 }}>Dernière mise à jour : mai 2026</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>1. Responsable du traitement</h2>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8 }}>
                Paul Assat, micro-entrepreneur basé à Paris (France).<br />
                Contact : <a href="mailto:contact@candidlyapp.fr" style={{ color: 'var(--accent)' }}>contact@candidlyapp.fr</a>
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>2. Données collectées</h2>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8, marginBottom: 12 }}>
                Lors de l&apos;utilisation de Candidly, nous collectons les données suivantes :
              </p>
              <ul style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 2, paddingLeft: 20 }}>
                <li><strong>Compte :</strong> adresse email, méthode d&apos;authentification (email ou Google)</li>
                <li><strong>Candidatures :</strong> entreprise, poste, statut, dates, notes personnelles</li>
                <li><strong>CV (optionnel) :</strong> fichier PDF transmis temporairement à l&apos;IA pour analyse — non stocké</li>
                <li><strong>Paiement :</strong> géré exclusivement par Stripe — nous ne stockons aucune donnée bancaire</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>3. Finalités du traitement</h2>
              <ul style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 2, paddingLeft: 20 }}>
                <li>Fournir le service de suivi de candidatures</li>
                <li>Envoyer des rappels email que vous avez configurés</li>
                <li>Gérer votre abonnement et les paiements</li>
                <li>Améliorer le service</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>4. Base légale</h2>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8 }}>
                Le traitement est fondé sur l&apos;exécution du contrat (CGU) que vous avez accepté lors de votre inscription,
                ainsi que sur votre consentement pour les communications optionnelles.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>5. Sous-traitants</h2>
              <ul style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 2, paddingLeft: 20 }}>
                <li><strong>Supabase</strong> — stockage des données (Singapour / UE)</li>
                <li><strong>Vercel</strong> — hébergement (États-Unis, certifié)</li>
                <li><strong>Stripe</strong> — paiements (États-Unis, certifié PCI-DSS)</li>
                <li><strong>Resend</strong> — envoi d&apos;emails transactionnels</li>
                <li><strong>Google Gemini</strong> — analyse IA (données transmises temporairement, non stockées)</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>6. Durée de conservation</h2>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8 }}>
                Vos données sont conservées tant que votre compte est actif.
                En cas de suppression de compte, vos données sont effacées sous 30 jours.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>7. Vos droits (RGPD)</h2>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8, marginBottom: 8 }}>
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 2, paddingLeft: 20 }}>
                <li><strong>Accès</strong> à vos données personnelles</li>
                <li><strong>Rectification</strong> des données inexactes</li>
                <li><strong>Suppression</strong> de votre compte et de vos données</li>
                <li><strong>Portabilité</strong> via l&apos;export CSV disponible dans l&apos;app</li>
                <li><strong>Opposition</strong> au traitement</li>
              </ul>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8, marginTop: 12 }}>
                Pour exercer ces droits : <a href="mailto:contact@candidlyapp.fr" style={{ color: 'var(--accent)' }}>contact@candidlyapp.fr</a>
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>8. Cookies</h2>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8 }}>
                Candidly utilise uniquement des cookies techniques nécessaires au fonctionnement de l&apos;authentification.
                Aucun cookie publicitaire ou de tracking n&apos;est utilisé.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>9. Contact & réclamation</h2>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8 }}>
                Pour toute question : <a href="mailto:contact@candidlyapp.fr" style={{ color: 'var(--accent)' }}>contact@candidlyapp.fr</a><br />
                Vous pouvez également introduire une réclamation auprès de la <strong>CNIL</strong> : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>cnil.fr</a>
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
