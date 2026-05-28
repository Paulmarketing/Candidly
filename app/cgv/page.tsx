import Link from 'next/link'
import Logo from '@/components/Logo'

export default function CGV() {
  return (
    <main style={{ minHeight: '100vh', padding: '0 16px' }}>
      <nav style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0' }}>
        <Link href="/"><Logo /></Link>
        <Link href="/" className="btn-secondary" style={{ fontSize: 13 }}>← Accueil</Link>
      </nav>

      <section style={{ maxWidth: 800, margin: '0 auto 80px' }}>
        <div className="glass-card" style={{ padding: '48px 40px' }}>
          <h1 style={{ fontSize: 32, fontWeight: 600, color: 'var(--text1)', marginBottom: 8 }}>Conditions Générales de Vente</h1>
          <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 40 }}>Dernière mise à jour : mai 2026</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>1. Vendeur</h2>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8 }}>
                <strong>Candidly</strong><br />
                Micro-entrepreneur — Paris, France<br />
                SIRET : <em>en cours d&apos;obtention</em><br />
                Email : <a href="mailto:contact@candidlyapp.fr" style={{ color: 'var(--accent)' }}>contact@candidlyapp.fr</a>
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>2. Offre et tarifs</h2>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8, marginBottom: 12 }}>
                Candidly propose un abonnement mensuel :
              </p>
              <div className="glass-card" style={{ padding: '20px 24px', background: 'rgba(91,124,246,0.06)' }}>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 2 }}>
                  <strong>Plan Pro</strong> : 5,00 € TTC / mois<br />
                  Essai gratuit de 7 jours (carte bancaire requise — aucun débit pendant l&apos;essai)<br />
                  Sans engagement — résiliable à tout moment
                </p>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 12, lineHeight: 1.6 }}>
                En tant que micro-entrepreneur, Candidly bénéficie de la franchise en base de TVA
                (article 293 B du CGI). La TVA n&apos;est pas applicable.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>3. Paiement</h2>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8 }}>
                Le paiement est sécurisé et géré par <strong>Stripe</strong>. Les moyens de paiement acceptés sont :
                carte bancaire (Visa, Mastercard, American Express). Le prélèvement est effectué mensuellement,
                à la date anniversaire de votre souscription.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>4. Période d&apos;essai</h2>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8 }}>
                L&apos;abonnement Pro inclut une période d&apos;essai gratuite de <strong>7 jours</strong>.
                Aucun débit n&apos;est effectué durant cette période. Si vous ne résiliez pas avant la fin de l&apos;essai,
                l&apos;abonnement devient payant automatiquement.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>5. Résiliation</h2>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8 }}>
                Vous pouvez résilier votre abonnement à tout moment depuis votre espace client ou en contactant
                <a href="mailto:contact@candidlyapp.fr" style={{ color: 'var(--accent)' }}> contact@candidlyapp.fr</a>.
                L&apos;accès Pro reste actif jusqu&apos;à la fin de la période déjà payée.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>6. Rétractation</h2>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8 }}>
                Conformément à l&apos;article L221-28 du Code de la consommation, le droit de rétractation ne s&apos;applique pas
                aux contenus numériques dont l&apos;exécution a commencé avec votre accord. Toutefois, si vous rencontrez
                un problème, contactez-nous — nous étudierons chaque demande de remboursement au cas par cas.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>7. Droit applicable</h2>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8 }}>
                Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera
                recherchée en priorité. À défaut, les tribunaux français seront compétents.
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
