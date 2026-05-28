import Link from 'next/link'
import Logo from '@/components/Logo'

export default function MentionsLegales() {
  return (
    <main style={{ minHeight: '100vh', padding: '0 16px' }}>
      <nav style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0' }}>
        <Link href="/"><Logo /></Link>
        <Link href="/" className="btn-secondary" style={{ fontSize: 13 }}>← Accueil</Link>
      </nav>

      <section style={{ maxWidth: 800, margin: '0 auto 80px' }}>
        <div className="glass-card" style={{ padding: '48px 40px' }}>
          <h1 style={{ fontSize: 32, fontWeight: 600, color: 'var(--text1)', marginBottom: 8 }}>Mentions légales</h1>
          <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 40 }}>Dernière mise à jour : mai 2026</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>Éditeur du site</h2>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8 }}>
                <strong>Paul Assat</strong><br />
                Micro-entrepreneur<br />
                Paris, France<br />
                SIRET : <em>en cours d&apos;obtention</em><br />
                Email : <a href="mailto:contact@candidlyapp.fr" style={{ color: 'var(--accent)' }}>contact@candidlyapp.fr</a>
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>Hébergement</h2>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8 }}>
                <strong>Vercel Inc.</strong><br />
                340 Pine Street, Suite 701<br />
                San Francisco, California 94104, États-Unis<br />
                <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>vercel.com</a>
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>Base de données</h2>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8 }}>
                <strong>Supabase Inc.</strong><br />
                970 Toa Payoh North, Singapour<br />
                <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>supabase.com</a>
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>Propriété intellectuelle</h2>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8 }}>
                L&apos;ensemble du contenu de ce site (textes, images, logo, interface) est la propriété exclusive de Paul Assat.
                Toute reproduction, même partielle, est interdite sans autorisation préalable.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>Contact</h2>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8 }}>
                Pour toute question : <a href="mailto:contact@candidlyapp.fr" style={{ color: 'var(--accent)' }}>contact@candidlyapp.fr</a>
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
