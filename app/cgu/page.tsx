import Link from 'next/link'
import Logo from '@/components/Logo'

export default function CGU() {
  return (
    <main style={{ minHeight: '100vh', padding: '0 16px' }}>
      <nav style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0' }}>
        <Link href="/"><Logo /></Link>
        <Link href="/" className="btn-secondary" style={{ fontSize: 13 }}>← Accueil</Link>
      </nav>

      <section style={{ maxWidth: 800, margin: '0 auto 80px' }}>
        <div className="glass-card" style={{ padding: '48px 40px' }}>
          <h1 style={{ fontSize: 32, fontWeight: 600, color: 'var(--text1)', marginBottom: 8 }}>Conditions Générales d&apos;Utilisation</h1>
          <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 40 }}>Dernière mise à jour : mai 2026</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>1. Présentation du service</h2>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8 }}>
                Candidly est une application web de suivi de candidatures (stages et emplois) éditée par Paul Assat,
                micro-entrepreneur basé à Paris, France. L&apos;accès au service est disponible sur <a href="https://candidlyapp.fr" style={{ color: 'var(--accent)' }}>candidlyapp.fr</a>.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>2. Acceptation des CGU</h2>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8 }}>
                En créant un compte sur Candidly, vous acceptez sans réserve les présentes CGU.
                Si vous n&apos;acceptez pas ces conditions, vous ne devez pas utiliser le service.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>3. Inscription et compte</h2>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8 }}>
                L&apos;inscription est ouverte à toute personne physique. Vous êtes responsable de la confidentialité
                de vos identifiants. Candidly ne peut être tenu responsable en cas d&apos;utilisation non autorisée
                de votre compte.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>4. Plans et fonctionnalités</h2>
              <ul style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 2, paddingLeft: 20 }}>
                <li><strong>Plan Gratuit :</strong> jusqu&apos;à 5 candidatures, fonctionnalités de base</li>
                <li><strong>Plan Pro :</strong> candidatures illimitées, rappels email, export CSV, analyse CV par IA, lettre de motivation IA</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>5. Utilisation acceptable</h2>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8, marginBottom: 8 }}>Il est interdit de :</p>
              <ul style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 2, paddingLeft: 20 }}>
                <li>Utiliser le service à des fins illégales ou frauduleuses</li>
                <li>Tenter de contourner les limitations du plan gratuit</li>
                <li>Revendre ou redistribuer l&apos;accès au service</li>
                <li>Surcharger intentionnellement les serveurs</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>6. Disponibilité du service</h2>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8 }}>
                Candidly s&apos;efforce de maintenir le service disponible 24h/24. Cependant, des interruptions pour
                maintenance ou pour des raisons techniques peuvent survenir. Candidly ne saurait être tenu responsable
                des conséquences d&apos;une indisponibilité temporaire.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>7. Données utilisateur</h2>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8 }}>
                Vous restez propriétaire de vos données. Candidly ne vend pas vos données à des tiers.
                Consultez notre <Link href="/confidentialite" style={{ color: 'var(--accent)' }}>politique de confidentialité</Link> pour plus d&apos;informations.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>8. Modification et résiliation</h2>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8 }}>
                Candidly se réserve le droit de modifier les CGU à tout moment. Vous serez informé par email
                en cas de modification substantielle. Vous pouvez supprimer votre compte à tout moment
                en nous contactant à <a href="mailto:contact@candidlyapp.fr" style={{ color: 'var(--accent)' }}>contact@candidlyapp.fr</a>.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>9. Droit applicable</h2>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8 }}>
                Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux français seront compétents.
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
