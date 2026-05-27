import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'
import Logo from '@/components/Logo'

export default async function AdminPage() {
  // 1. Vérifier que l'utilisateur est connecté
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  // 2. Vérifier que c'est bien l'admin (via variable d'environnement)
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || session.user.email !== adminEmail) redirect('/dashboard')

  // 3. Récupérer toutes les données avec le client admin (contourne les RLS)
  const admin = createAdminClient()

  // Tous les utilisateurs Supabase Auth (pour les emails)
  const { data: { users: authUsers } } = await admin.auth.admin.listUsers({ perPage: 1000 })

  // Tous les profils (is_pro, date création)
  const { data: profiles } = await admin
    .from('profiles')
    .select('id, is_pro, created_at')
    .order('created_at', { ascending: false })

  // Nombre de candidatures par utilisateur
  const { data: candidatures } = await admin
    .from('candidatures')
    .select('user_id')

  // Construire une map email par id
  const emailMap = new Map(authUsers.map(u => [u.id, u.email ?? 'Inconnu']))

  // Construire une map nombre de candidatures par user_id
  const countMap = new Map<string, number>()
  candidatures?.forEach(c => {
    countMap.set(c.user_id, (countMap.get(c.user_id) ?? 0) + 1)
  })

  // Fusionner les données
  const users = (profiles ?? []).map(p => ({
    id: p.id,
    email: emailMap.get(p.id) ?? 'Inconnu',
    is_pro: p.is_pro ?? false,
    created_at: p.created_at,
    candidatures: countMap.get(p.id) ?? 0,
  }))

  // Stats globales
  const totalUsers = users.length
  const proUsers = users.filter(u => u.is_pro).length
  const freeUsers = totalUsers - proUsers
  const estimatedRevenue = proUsers * 5

  return (
    <main style={{ minHeight: '100vh', padding: '0 16px' }}>

      {/* Navigation */}
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
        <Link href="/dashboard" className="btn-secondary" style={{ fontSize: 13 }}>
          ← Dashboard
        </Link>
      </nav>

      {/* En-tête */}
      <section style={{ maxWidth: 1100, margin: '0 auto 36px' }}>
        <span
          style={{
            display: 'inline-block',
            background: 'rgba(91,124,246,0.1)',
            border: '1px solid rgba(91,124,246,0.2)',
            borderRadius: 40,
            padding: '4px 14px',
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--accent)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          🔒 Accès restreint
        </span>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: 'var(--text1)',
            letterSpacing: '-0.02em',
            marginBottom: 6,
          }}
        >
          Page Admin
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text3)' }}>
          Vue d&apos;ensemble de Candidly · Données en temps réel
        </p>
      </section>

      {/* Cartes de stats */}
      <section style={{ maxWidth: 1100, margin: '0 auto 32px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
          }}
        >
          {[
            { label: 'Inscrits total', value: totalUsers, icon: '👥', color: 'var(--text1)' },
            { label: 'Abonnés Pro', value: proUsers, icon: '⭐', color: 'var(--accent)' },
            { label: 'Plan Gratuit', value: freeUsers, icon: '🆓', color: 'var(--text2)' },
            { label: 'Revenus estimés/mois', value: `${estimatedRevenue} €`, icon: '💶', color: 'var(--success)' },
          ].map(stat => (
            <div
              key={stat.label}
              className="glass-card"
              style={{ padding: '24px 20px' }}
            >
              <p style={{ fontSize: 28, marginBottom: 10 }}>{stat.icon}</p>
              <p style={{ fontSize: 34, fontWeight: 600, color: stat.color, lineHeight: 1 }}>
                {stat.value}
              </p>
              <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 6 }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tableau utilisateurs */}
      <section style={{ maxWidth: 1100, margin: '0 auto 80px' }}>
        <div className="glass-card" style={{ padding: '28px', overflow: 'hidden' }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: 'var(--text1)',
              marginBottom: 20,
            }}
          >
            Utilisateurs ({totalUsers})
          </h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Email', 'Plan', 'Candidatures', 'Inscrit le'].map(header => (
                    <th
                      key={header}
                      style={{
                        textAlign: 'left',
                        padding: '10px 14px',
                        fontSize: 11,
                        fontWeight: 600,
                        color: 'var(--text3)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.07em',
                        borderBottom: '1px solid rgba(255,255,255,0.5)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr
                    key={user.id}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.3)',
                      transition: 'background 0.15s',
                    }}
                  >
                    {/* Email */}
                    <td style={{ padding: '13px 14px', fontSize: 14, color: 'var(--text1)' }}>
                      {user.email}
                    </td>

                    {/* Plan */}
                    <td style={{ padding: '13px 14px' }}>
                      <span
                        style={{
                          background: user.is_pro
                            ? 'rgba(91,124,246,0.12)'
                            : 'rgba(136,144,176,0.12)',
                          color: user.is_pro ? 'var(--accent)' : 'var(--text3)',
                          padding: '4px 12px',
                          borderRadius: 40,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {user.is_pro ? '⭐ Pro' : 'Gratuit'}
                      </span>
                    </td>

                    {/* Candidatures */}
                    <td
                      style={{
                        padding: '13px 14px',
                        fontSize: 14,
                        color: 'var(--text2)',
                        textAlign: 'center',
                      }}
                    >
                      {user.candidatures}
                    </td>

                    {/* Date inscription */}
                    <td style={{ padding: '13px 14px', fontSize: 13, color: 'var(--text3)' }}>
                      {new Date(user.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      style={{
                        padding: '40px',
                        textAlign: 'center',
                        fontSize: 14,
                        color: 'var(--text3)',
                      }}
                    >
                      Aucun utilisateur pour l&apos;instant
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  )
}
