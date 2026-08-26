'use client'

import Link from 'next/link'
import Logo from '@/components/Logo'
import PricingCard from '@/components/PricingCard'
import ThemeToggle from '@/components/ThemeToggle'

export default function LandingPage() {
  return (
    <main style={{ minHeight: '100vh', padding: '0 16px' }}>
      {/* Nav */}
      <nav
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 0',
        }}
      >
        <Logo />
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <ThemeToggle />
          <Link href="/login" className="btn-secondary" style={{ fontSize: 13 }}>
            Se connecter
          </Link>
          <Link href="/register" className="btn-primary" style={{ fontSize: 13 }}>
            Essai gratuit
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          maxWidth: 800,
          margin: '60px auto 80px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            background: 'rgba(91,124,246,0.1)',
            border: '1px solid rgba(91,124,246,0.2)',
            borderRadius: 40,
            padding: '6px 16px',
            fontSize: 12,
            fontWeight: 500,
            color: 'var(--accent)',
            marginBottom: 24,
          }}
        >
          🇫🇷 100% en français · Conçu pour les étudiants
        </div>

        <h1
          style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 600,
            color: 'var(--text1)',
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            marginBottom: 20,
          }}
        >
          Finis de perdre le fil<br />de tes candidatures
        </h1>

        <p
          style={{
            fontSize: 18,
            fontWeight: 300,
            color: 'var(--text2)',
            lineHeight: 1.6,
            maxWidth: 560,
            margin: '0 auto 36px',
          }}
        >
          Candidly centralise tous tes stages et emplois en un coup d&apos;œil.
          Rappels automatiques, statistiques en temps réel, interface épurée.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" className="btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>
            Commencer gratuitement →
          </Link>
          <Link href="#pricing" className="btn-secondary" style={{ fontSize: 16, padding: '13px 28px' }}>
            Voir les tarifs
          </Link>
        </div>

        <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 16 }}>
          Gratuit jusqu&apos;à 10 candidatures · Essai Pro 7 jours avec CB
        </p>
      </section>

      {/* Screenshot / Preview */}
      <section style={{ maxWidth: 960, margin: '0 auto 100px' }}>
        <div className="glass-card" style={{ padding: '20px', background: 'rgba(255,255,255,0.45)' }}>

          {/* Barre titre fenêtre */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f25f5c' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f5a623' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#34c98a' }} />
            <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--text3)' }}>candidlyapp.fr — Dashboard</span>
          </div>

          {/* Topbar simulée */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)' }}>Mes candidatures</span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10, padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(91,124,246,0.2)', background: 'rgba(91,124,246,0.06)', color: 'var(--accent)', fontWeight: 500 }}>✨ Analyser mon CV</span>
              <span style={{ fontSize: 10, padding: '4px 10px', borderRadius: 8, border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.5)', color: 'var(--text2)' }}>☰ ⊞</span>
              <span style={{ fontSize: 10, padding: '4px 10px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#5b7cf6,#9b8ef8)', color: 'white', fontWeight: 500 }}>+ Ajouter</span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: 16 }}>
            {[
              { label: 'Total', value: '24' },
              { label: 'En cours', value: '12' },
              { label: 'Entretiens', value: '5' },
              { label: 'Acceptées', value: '2' },
              { label: 'Taux succès', value: '8%' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card-secondary" style={{ padding: '12px 14px' }}>
                <p style={{ fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>{stat.label}</p>
                <p style={{ fontSize: 20, fontWeight: 600, color: 'var(--text1)', marginTop: 2 }}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Candidatures avec boutons IA */}
          {[
            { entreprise: 'Airbus', poste: 'Stage Ingénieur Aéro', statut: 'Entretien', color: 'rgba(155,142,248,0.15)', textColor: '#3C3489', date: '12 juin' },
            { entreprise: 'Decathlon', poste: 'Stage Marketing Digital', statut: 'Relance', color: 'rgba(245,166,35,0.12)', textColor: '#854F0B', date: '8 juin' },
            { entreprise: 'BNP Paribas', poste: 'Alternance Finance', statut: 'Envoyé', color: 'rgba(91,124,246,0.12)', textColor: '#185FA5', date: '3 juin' },
          ].map((c) => (
            <div key={c.entreprise} className="glass-card" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 120 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)' }}>{c.entreprise}</p>
                <p style={{ fontSize: 11, color: 'var(--text2)' }}>{c.poste}</p>
              </div>
              <span style={{ fontSize: 10, color: 'var(--text3)' }}>📅 {c.date}</span>
              <span style={{ background: c.color, color: c.textColor, padding: '3px 10px', borderRadius: 40, fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap' }}>{c.statut}</span>
              {/* Boutons IA */}
              <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, border: '1px solid rgba(52,201,138,0.25)', background: 'rgba(52,201,138,0.08)', color: 'var(--success)', fontWeight: 500, whiteSpace: 'nowrap' }}>🎯 Entretien</span>
              <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, border: '1px solid rgba(91,124,246,0.25)', background: 'rgba(91,124,246,0.08)', color: 'var(--accent)', fontWeight: 500, whiteSpace: 'nowrap' }}>✨ Lettre</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <span style={{ fontSize: 11, width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.5)' }}>✏️</span>
                <span style={{ fontSize: 11, width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: '1px solid rgba(242,95,92,0.2)', background: 'rgba(242,95,92,0.06)' }}>🗑️</span>
              </div>
            </div>
          ))}

          {/* Mini Kanban preview */}
          <div style={{ marginTop: 16, padding: '14px', background: 'rgba(255,255,255,0.3)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.5)' }}>
            <p style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 500, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>⊞ Vue Kanban</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
              {[
                { statut: 'Envoyé', color: 'rgba(91,124,246,0.12)', textColor: '#185FA5', count: 8 },
                { statut: 'Relance', color: 'rgba(245,166,35,0.12)', textColor: '#854F0B', count: 5 },
                { statut: 'Entretien', color: 'rgba(155,142,248,0.15)', textColor: '#3C3489', count: 5 },
                { statut: 'Accepté', color: 'rgba(52,201,138,0.12)', textColor: '#3B6D11', count: 2 },
                { statut: 'Refusé', color: 'rgba(242,95,92,0.12)', textColor: '#791F1F', count: 4 },
              ].map((col) => (
                <div key={col.statut}>
                  <div style={{ background: col.color, borderRadius: 8, padding: '5px 8px', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 9, fontWeight: 600, color: col.textColor }}>{col.statut}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: col.textColor, background: 'rgba(255,255,255,0.6)', borderRadius: 10, padding: '1px 5px' }}>{col.count}</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.5)', borderRadius: 6, padding: '6px 8px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ height: 6, background: col.color, borderRadius: 4, marginBottom: 4 }} />
                    <div style={{ height: 4, background: 'rgba(136,144,176,0.15)', borderRadius: 4, width: '70%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* IA Section */}
      <section style={{ maxWidth: 960, margin: '0 auto 100px' }}>
        <div
          className="glass-card"
          style={{
            padding: '48px 40px',
            background: 'linear-gradient(135deg, rgba(91,124,246,0.08) 0%, rgba(155,142,248,0.08) 100%)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg,#5b7cf6,#9b8ef8)',
              borderRadius: 40,
              padding: '6px 18px',
              fontSize: 12,
              fontWeight: 600,
              color: 'white',
              marginBottom: 20,
              letterSpacing: '0.04em',
            }}
          >
            ✨ NOUVEAU — Propulsé par l&apos;IA
          </div>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: 'var(--text1)',
              marginBottom: 12,
            }}
          >
            L&apos;IA qui booste tes candidatures
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text2)', marginBottom: 40, maxWidth: 520, margin: '0 auto 40px' }}>
            1 essai gratuit inclus pour chaque outil. Passe Pro pour un accès illimité.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, textAlign: 'left' }}>
            {/* Analyse CV */}
            <div
              className="glass-card"
              style={{ padding: '28px 24px', background: 'rgba(255,255,255,0.6)' }}
            >
              <div style={{ fontSize: 36, marginBottom: 14 }}>📄</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 8 }}>
                Analyse de CV
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 16 }}>
                Uploade ton CV en PDF. L&apos;IA l&apos;analyse en 5 secondes et te donne un score, tes points forts, tes faiblesses et des suggestions concrètes pour l&apos;améliorer.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Score global sur 10', 'Points forts identifiés', 'Suggestions d\'amélioration'].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: 'var(--success)', fontSize: 14 }}>✓</span>
                    <span style={{ fontSize: 13, color: 'var(--text2)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lettre de motivation */}
            <div
              className="glass-card"
              style={{ padding: '28px 24px', background: 'rgba(255,255,255,0.6)' }}
            >
              <div style={{ fontSize: 36, marginBottom: 14 }}>✍️</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 8 }}>
                Lettre de motivation IA
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 16 }}>
                Sélectionne une candidature, décris ton profil en 2 lignes et colle l&apos;offre d&apos;emploi. L&apos;IA génère une lettre personnalisée et professionnelle en quelques secondes.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Personnalisée pour chaque offre', 'Ton professionnel et authentique', 'Prête à copier-coller'].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: 'var(--success)', fontSize: 14 }}>✓</span>
                    <span style={{ fontSize: 13, color: 'var(--text2)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 32 }}>
            <Link href="/register" className="btn-primary" style={{ fontSize: 15, padding: '13px 32px' }}>
              Essayer gratuitement 7 jours →
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 960, margin: '0 auto 100px' }}>
        <h2
          style={{
            textAlign: 'center',
            fontSize: 32,
            fontWeight: 600,
            color: 'var(--text1)',
            marginBottom: 48,
          }}
        >
          Tout ce qu&apos;il te faut, rien de superflu
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20,
          }}
        >
          {[
            {
              icon: '📊',
              title: 'Suivi en temps réel',
              desc: 'Tableau de bord clair avec stats : taux de succès, entretiens obtenus, candidatures en cours.',
            },
            {
              icon: '🔔',
              title: 'Rappels automatiques',
              desc: 'Reçois un email la veille de chaque date de relance que tu as définie. Plus jamais d\'oubli.',
            },
            {
              icon: '📤',
              title: 'Export CSV',
              desc: 'Exporte toutes tes candidatures en un clic pour les partager ou les analyser dans Excel.',
            },
            {
              icon: '🔒',
              title: 'Données sécurisées',
              desc: 'Chaque utilisateur accède uniquement à ses données. Hébergement européen via Supabase.',
            },
            {
              icon: '📱',
              title: 'Responsive mobile',
              desc: 'Ajoute une candidature depuis ton téléphone, en sortant d\'un entretien.',
            },
            {
              icon: '🇫🇷',
              title: '100% français',
              desc: 'Interface, emails, support — tout est en français. Pour les étudiants francophones.',
            },
          ].map((f) => (
            <div key={f.title} className="glass-card hover-card" style={{ padding: '24px' }}>
              <span style={{ fontSize: 28, display: 'block', marginBottom: 12 }}>{f.icon}</span>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text1)', marginBottom: 8 }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ maxWidth: 760, margin: '0 auto 100px' }}>
        <h2
          style={{
            textAlign: 'center',
            fontSize: 32,
            fontWeight: 600,
            color: 'var(--text1)',
            marginBottom: 12,
          }}
        >
          Tarifs simples et transparents
        </h2>
        <p
          style={{
            textAlign: 'center',
            fontSize: 15,
            color: 'var(--text2)',
            marginBottom: 48,
          }}
        >
          Commence gratuitement, passe Pro quand tu es prêt.
        </p>
        <div
          style={{
            display: 'flex',
            gap: 24,
            justifyContent: 'center',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
          }}
        >
          <PricingCard plan="gratuit" onChoose={() => {}} />
          <PricingCard plan="pro" onChoose={() => {}} />
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          textAlign: 'center',
          padding: '40px 16px',
          borderTop: '1px solid rgba(255,255,255,0.4)',
        }}
      >
        <Logo size={28} />
        <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 12 }}>
          © {new Date().getFullYear()} Candidly — Fait avec ❤️ pour les étudiants français
        </p>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', marginTop: 16 }}>
          {[
            { label: 'Mentions légales', href: '/mentions-legales' },
            { label: 'Confidentialité', href: '/confidentialite' },
            { label: 'CGU', href: '/cgu' },
            { label: 'CGV', href: '/cgv' },
            { label: 'Contact', href: 'mailto:contact@candidlyapp.fr' },
          ].map(link => (
            <Link
              key={link.label}
              href={link.href}
              style={{ fontSize: 12, color: 'var(--text3)', textDecoration: 'none' }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </footer>
    </main>
  )
}
