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
      <section style={{ maxWidth: 800, margin: '60px auto 80px', textAlign: 'center' }}>
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
          🇫🇷 100% en français · IA intégrée · Networking
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
            maxWidth: 580,
            margin: '0 auto 36px',
          }}
        >
          Candidly centralise tes candidatures, ton réseau et tes entretiens.
          Import d&apos;offres par URL, emails IA personnalisés, calendrier des entretiens.
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

      {/* Dashboard Preview */}
      <section style={{ maxWidth: 980, margin: '0 auto 100px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>

          {/* Barre titre fenêtre */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f25f5c' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f5a623' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#34c98a' }} />
            <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--text3)' }}>candidlyapp.fr — Dashboard</span>
          </div>

          {/* Section tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <div style={{ padding: '6px 16px', borderRadius: 40, background: 'linear-gradient(135deg,rgba(91,124,246,0.15),rgba(155,142,248,0.15))', border: '1px solid rgba(91,124,246,0.3)', fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>
              💼 Candidatures
            </div>
            <div style={{ padding: '6px 16px', borderRadius: 40, background: 'var(--toggle-bg)', border: '1px solid var(--glass-border)', fontSize: 12, color: 'var(--text3)' }}>
              🤝 Networking
            </div>
          </div>

          {/* Topbar simulée */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['Tous', 'Envoyé', 'Relance', 'Entretien'].map((f, i) => (
                <span key={f} style={{ fontSize: 11, padding: '4px 12px', borderRadius: 40, border: '1px solid var(--border-subtle)', background: i === 0 ? 'linear-gradient(135deg,#5b7cf6,#9b8ef8)' : 'var(--pill-inactive-bg)', color: i === 0 ? 'white' : 'var(--pill-inactive-text)', fontWeight: i === 0 ? 600 : 400 }}>{f}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10, padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(91,124,246,0.2)', background: 'rgba(91,124,246,0.06)', color: 'var(--accent)', fontWeight: 500 }}>🔗 Import URL</span>
              <span style={{ fontSize: 10, padding: '4px 10px', borderRadius: 8, border: '1px solid var(--glass-border)', background: 'var(--toggle-bg)', color: 'var(--text2)' }}>☰ ⊞ 📅</span>
              <span style={{ fontSize: 10, padding: '4px 10px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#5b7cf6,#9b8ef8)', color: 'white', fontWeight: 500 }}>+ Ajouter</span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 10, marginBottom: 16 }}>
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

          {/* Candidatures liste */}
          {[
            { entreprise: 'Airbus', poste: 'Stage Ingénieur Aéro', statut: 'Entretien', statBg: 'var(--statut-entretien-bg)', statText: 'var(--statut-entretien-text)', date: '📅 12 juin' },
            { entreprise: 'Decathlon', poste: 'Stage Marketing Digital', statut: 'Relance', statBg: 'var(--statut-relance-bg)', statText: 'var(--statut-relance-text)', date: '📅 8 juin' },
            { entreprise: 'BNP Paribas', poste: 'Alternance Finance', statut: 'Envoyé', statBg: 'var(--statut-envoye-bg)', statText: 'var(--statut-envoye-text)', date: '📅 3 juin' },
          ].map((c) => (
            <div key={c.entreprise} className="glass-card" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 120 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)' }}>{c.entreprise}</p>
                <p style={{ fontSize: 11, color: 'var(--text2)' }}>{c.poste}</p>
              </div>
              <span style={{ fontSize: 10, color: 'var(--text3)' }}>{c.date}</span>
              <span style={{ background: c.statBg, color: c.statText, padding: '3px 10px', borderRadius: 40, fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap' }}>{c.statut}</span>
              <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, border: '1px solid rgba(52,201,138,0.25)', background: 'rgba(52,201,138,0.08)', color: 'var(--success)', fontWeight: 500, whiteSpace: 'nowrap' }}>🎯 Entretien</span>
              <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, border: '1px solid rgba(91,124,246,0.25)', background: 'rgba(91,124,246,0.08)', color: 'var(--accent)', fontWeight: 500, whiteSpace: 'nowrap' }}>✨ Lettre</span>
            </div>
          ))}

          {/* Ligne du bas : aperçu Networking + Calendrier */}
          <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {/* Networking preview */}
            <div style={{ padding: '14px', background: 'var(--toggle-bg)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
              <p style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 500, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>🤝 Networking</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { initials: 'ML', name: 'Marie Lambert', role: 'RH — Airbus', color: 'linear-gradient(135deg,#5b7cf6,#9b8ef8)' },
                  { initials: 'TM', name: 'Thomas Martin', role: 'Manager — BNP', color: 'linear-gradient(135deg,#34c98a,#2eb5a0)' },
                ].map(p => (
                  <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{p.initials}</div>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text1)' }}>{p.name}</p>
                      <p style={{ fontSize: 10, color: 'var(--text3)' }}>{p.role}</p>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: 10, padding: '2px 8px', borderRadius: 6, border: '1px solid rgba(91,124,246,0.25)', background: 'rgba(91,124,246,0.08)', color: 'var(--accent)' }}>✉️ IA</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calendrier preview */}
            <div style={{ padding: '14px', background: 'var(--toggle-bg)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
              <p style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 500, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>📅 Calendrier des entretiens</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 8 }}>
                {['L','M','M','J','V','S','D'].map((d, i) => (
                  <div key={i} style={{ textAlign: 'center', fontSize: 8, color: 'var(--text3)', fontWeight: 600 }}>{d}</div>
                ))}
                {Array.from({ length: 21 }, (_, i) => i + 1).map(d => (
                  <div key={d} style={{ textAlign: 'center', fontSize: 9, padding: '3px 2px', borderRadius: 4, background: [12, 18].includes(d) ? 'linear-gradient(135deg,#5b7cf6,#9b8ef8)' : 'transparent', color: [12, 18].includes(d) ? 'white' : 'var(--text2)', fontWeight: [12, 18].includes(d) ? 700 : 400, position: 'relative' }}>
                    {d}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 500 }}>● Entretien Airbus · 12 juin</p>
            </div>
          </div>

        </div>
      </section>

      {/* IA Section */}
      <section style={{ maxWidth: 980, margin: '0 auto 100px' }}>
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
            ✨ Propulsé par l&apos;IA Gemini
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>
            L&apos;IA qui booste tes candidatures
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text2)', marginBottom: 40, maxWidth: 540, margin: '0 auto 40px' }}>
            1 essai gratuit pour chaque outil. Passe Pro pour un accès illimité.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, textAlign: 'left' }}>
            {[
              {
                icon: '📄', title: 'Analyse de CV',
                desc: 'Uploade ton CV en PDF. Score, points forts, faiblesses et suggestions concrètes en 5 secondes.',
                items: ['Score global sur 10', 'Points forts identifiés', 'Suggestions d\'amélioration'],
              },
              {
                icon: '✍️', title: 'Lettre de motivation IA',
                desc: 'Sélectionne une candidature et colle l\'offre. L\'IA génère une lettre personnalisée instantanément.',
                items: ['Personnalisée pour chaque offre', 'Ton professionnel et authentique', 'Prête à copier-coller'],
              },
              {
                icon: '🔗', title: 'Import d\'offre par URL',
                desc: 'Colle le lien d\'une offre LinkedIn, Indeed ou autre. Le formulaire se remplit automatiquement.',
                items: ['Compatible tous les job boards', 'Entreprise, poste, lieu extraits', 'Gain de temps immédiat'],
              },
              {
                icon: '✉️', title: 'Email networking IA',
                desc: '5 templates (candidature, meeting, relance…) × 4 tons. L\'IA personnalise pour ton contact.',
                items: ['5 types d\'emails', '4 niveaux de ton', 'Envoi depuis Candidly'],
              },
            ].map((card) => (
              <div key={card.title} className="glass-card" style={{ padding: '24px 22px' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{card.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text1)', marginBottom: 8 }}>{card.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 14 }}>{card.desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {card.items.map((item) => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: 'var(--success)', fontSize: 13 }}>✓</span>
                      <span style={{ fontSize: 12, color: 'var(--text2)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 36 }}>
            <Link href="/register" className="btn-primary" style={{ fontSize: 15, padding: '13px 32px' }}>
              Essayer gratuitement 7 jours →
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 980, margin: '0 auto 100px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 600, color: 'var(--text1)', marginBottom: 48 }}>
          Tout ce qu&apos;il te faut, rien de superflu
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {[
            { icon: '📊', title: 'Suivi en temps réel', desc: 'Tableau de bord avec stats : taux de succès, entretiens obtenus, candidatures en cours.' },
            { icon: '📅', title: 'Calendrier des entretiens', desc: 'Vue calendrier mensuelle avec tous tes entretiens à venir. Compte à rebours intégré.' },
            { icon: '🤝', title: 'Section Networking', desc: 'Centralise tes contacts LinkedIn. Importe un profil et compose des emails IA personnalisés.' },
            { icon: '🔔', title: 'Rappels automatiques', desc: 'Reçois un email la veille de chaque date de relance que tu as définie. Plus jamais d\'oubli.' },
            { icon: '📤', title: 'Export CSV', desc: 'Exporte toutes tes candidatures en un clic pour les partager ou les analyser dans Excel.' },
            { icon: '🌙', title: 'Mode sombre', desc: 'Interface disponible en mode clair ou sombre selon ta préférence. Mémorisée entre les sessions.' },
            { icon: '🔒', title: 'Données sécurisées', desc: 'Chaque utilisateur accède uniquement à ses données. Hébergement européen via Supabase.' },
            { icon: '📱', title: 'Responsive mobile', desc: 'Ajoute une candidature depuis ton téléphone, en sortant d\'un entretien.' },
          ].map((f) => (
            <div key={f.title} className="glass-card hover-card" style={{ padding: '24px' }}>
              <span style={{ fontSize: 28, display: 'block', marginBottom: 12 }}>{f.icon}</span>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text1)', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ maxWidth: 780, margin: '0 auto 100px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>
          Tarifs simples et transparents
        </h2>
        <p style={{ textAlign: 'center', fontSize: 15, color: 'var(--text2)', marginBottom: 48 }}>
          Commence gratuitement, passe Pro quand tu es prêt.
        </p>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <PricingCard plan="gratuit" onChoose={() => {}} />
          <PricingCard plan="pro" onChoose={() => {}} />
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '40px 16px', borderTop: '1px solid var(--glass-border)' }}>
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
            <Link key={link.label} href={link.href} style={{ fontSize: 12, color: 'var(--text3)', textDecoration: 'none' }}>
              {link.label}
            </Link>
          ))}
        </div>
      </footer>
    </main>
  )
}
