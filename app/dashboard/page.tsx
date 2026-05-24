'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@/lib/supabase'
import type { Candidature, CandidatureInsert, Statut, Stats } from '@/types'
import { STATUTS, STATUT_STYLES } from '@/types'
import Logo from '@/components/Logo'
import StatsGrid from '@/components/StatsGrid'
import CandidatureCard from '@/components/CandidatureCard'
import AddModal from '@/components/AddModal'
import ReminderBanner from '@/components/ReminderBanner'
import ConfirmDialog from '@/components/ConfirmDialog'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createBrowserClient()

  const [candidatures, setCandidatures] = useState<Candidature[]>([])
  const [isPro, setIsPro] = useState(false)
  const [userName, setUserName] = useState('')
  const [userId, setUserId] = useState('')

  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCandidature, setEditingCandidature] = useState<Candidature | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Filtres
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatut, setFilterStatut] = useState<Statut | 'Tous'>('Tous')

  // Chargement initial : récupère session + profil + candidatures
  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      setUserId(session.user.id)

      // Récupère le profil
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, is_pro')
        .eq('id', session.user.id)
        .single()

      if (profile) {
        setIsPro(profile.is_pro)
        setUserName(profile.full_name || session.user.email?.split('@')[0] || 'toi')
      }

      // Récupère les candidatures
      const { data } = await supabase
        .from('candidatures')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      setCandidatures(data || [])
      setLoading(false)
    }

    init()
  }, [supabase, router])

  // Stats calculées
  const stats: Stats = useMemo(() => {
    const total = candidatures.length
    const en_cours = candidatures.filter(
      (c) => c.statut === 'Envoyé' || c.statut === 'Relance'
    ).length
    const entretiens = candidatures.filter((c) => c.statut === 'Entretien').length
    const acceptes = candidatures.filter((c) => c.statut === 'Accepté').length
    const taux_succes = total > 0 ? Math.round((acceptes / total) * 100) : 0
    return { total, en_cours, entretiens, acceptes, taux_succes }
  }, [candidatures])

  // Candidatures filtrées
  const filtered = useMemo(() => {
    let result = candidatures
    if (filterStatut !== 'Tous') {
      result = result.filter((c) => c.statut === filterStatut)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (c) =>
          c.entreprise.toLowerCase().includes(q) ||
          c.poste.toLowerCase().includes(q)
      )
    }
    return result
  }, [candidatures, filterStatut, searchQuery])

  // Sauvegarde (ajout ou modification)
  const handleSave = useCallback(
    async (data: CandidatureInsert) => {
      if (editingCandidature) {
        // Modification
        const { data: updated, error } = await supabase
          .from('candidatures')
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', editingCandidature.id)
          .select()
          .single()

        if (error) throw error
        setCandidatures((prev) =>
          prev.map((c) => (c.id === editingCandidature.id ? updated : c))
        )
      } else {
        // Ajout
        const { data: created, error } = await supabase
          .from('candidatures')
          .insert({ ...data, user_id: userId })
          .select()
          .single()

        if (error) throw error
        setCandidatures((prev) => [created, ...prev])
      }
      setEditingCandidature(null)
    },
    [editingCandidature, supabase, userId]
  )

  // Suppression
  const handleDelete = useCallback(async () => {
    if (!deleteId) return
    setDeleteLoading(true)
    await supabase.from('candidatures').delete().eq('id', deleteId)
    setCandidatures((prev) => prev.filter((c) => c.id !== deleteId))
    setDeleteId(null)
    setDeleteLoading(false)
  }, [deleteId, supabase])

  // Export CSV
  const handleExportCSV = useCallback(() => {
    const headers = ['Entreprise', 'Poste', 'Statut', 'Date envoi', 'Date rappel', 'Lien', 'Notes']
    const rows = candidatures.map((c) => [
      c.entreprise,
      c.poste,
      c.statut,
      c.date_envoi || '',
      c.date_rappel || '',
      c.lien_offre || '',
      (c.notes || '').replace(/\n/g, ' '),
    ])

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `candidatures_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [candidatures])

  // Déconnexion
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: '3px solid rgba(91,124,246,0.2)',
              borderTopColor: 'var(--accent)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 12px',
            }}
          />
          <p style={{ color: 'var(--text3)', fontSize: 14 }}>Chargement…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', padding: '0 16px 60px' }}>
      {/* Topbar */}
      <header
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 0',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <Logo />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {!isPro && (
            <Link
              href="/pricing"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(91,124,246,0.1)',
                border: '1px solid rgba(91,124,246,0.2)',
                borderRadius: 40,
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--accent)',
                textDecoration: 'none',
              }}
            >
              ✨ Passer à Pro
            </Link>
          )}
          {isPro && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: 'linear-gradient(135deg,rgba(91,124,246,0.15),rgba(155,142,248,0.15))',
                border: '1px solid rgba(91,124,246,0.25)',
                borderRadius: 40,
                padding: '5px 12px',
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--accent)',
              }}
            >
              ✨ Pro
            </span>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255,255,255,0.5)',
              border: '1px solid var(--glass-border)',
              borderRadius: 40,
              padding: '6px 14px',
              fontSize: 13,
              color: 'var(--text2)',
            }}
          >
            <span>👤</span>
            <span>{userName}</span>
          </div>

          <button
            onClick={handleLogout}
            className="btn-secondary"
            style={{ fontSize: 12, padding: '7px 14px' }}
          >
            Déconnexion
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Titre + actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 600, color: 'var(--text1)' }}>
              Mes candidatures
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>
              {stats.total} candidature{stats.total !== 1 ? 's' : ''}
              {!isPro && stats.total >= 8 && (
                <span style={{ color: 'var(--warn)', marginLeft: 8 }}>
                  · {10 - stats.total} restante{10 - stats.total !== 1 ? 's' : ''} (plan gratuit)
                </span>
              )}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handleExportCSV}
              className="btn-secondary"
              style={{ fontSize: 13 }}
              disabled={candidatures.length === 0}
            >
              ↓ Export CSV
            </button>
            <button
              onClick={() => {
                setEditingCandidature(null)
                setModalOpen(true)
              }}
              className="btn-primary"
              style={{ fontSize: 13 }}
            >
              + Ajouter
            </button>
          </div>
        </div>

        {/* Rappels */}
        {isPro && candidatures.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <ReminderBanner candidatures={candidatures} />
          </div>
        )}

        {/* Stats */}
        <div style={{ marginBottom: 24 }}>
          <StatsGrid stats={stats} />
        </div>

        {/* Filtres */}
        <div
          className="glass-card-secondary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 18px',
            marginBottom: 16,
            flexWrap: 'wrap',
          }}
        >
          {/* Recherche */}
          <div style={{ flex: '1 1 200px', position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 14,
                color: 'var(--text3)',
              }}
            >
              🔍
            </span>
            <input
              className="glass-input"
              type="text"
              placeholder="Rechercher entreprise ou poste…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 34 }}
            />
          </div>

          {/* Filtre statut */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(['Tous', ...STATUTS] as (Statut | 'Tous')[]).map((s) => {
              const isActive = filterStatut === s
              const style_info = s !== 'Tous' ? STATUT_STYLES[s] : null
              return (
                <button
                  key={s}
                  onClick={() => setFilterStatut(s)}
                  style={{
                    padding: '5px 14px',
                    borderRadius: 40,
                    border: isActive
                      ? `1px solid ${style_info ? style_info.text : 'var(--accent)'}`
                      : '1px solid rgba(136,144,176,0.2)',
                    background: isActive
                      ? style_info
                        ? style_info.bg
                        : 'rgba(91,124,246,0.12)'
                      : 'rgba(255,255,255,0.4)',
                    color: isActive
                      ? style_info
                        ? style_info.text
                        : 'var(--accent)'
                      : 'var(--text3)',
                    fontSize: 12,
                    fontWeight: isActive ? 500 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {s}
                </button>
              )
            })}
          </div>
        </div>

        {/* Liste des candidatures */}
        {filtered.length === 0 ? (
          <div
            className="glass-card"
            style={{
              padding: '60px 24px',
              textAlign: 'center',
              color: 'var(--text3)',
            }}
          >
            {candidatures.length === 0 ? (
              <>
                <div style={{ fontSize: 48, marginBottom: 12 }}>💼</div>
                <p style={{ fontSize: 16, color: 'var(--text2)', fontWeight: 500 }}>
                  Ajoute ta première candidature
                </p>
                <p style={{ fontSize: 13, marginTop: 6, marginBottom: 20 }}>
                  Clique sur &laquo; Ajouter &raquo; pour commencer à suivre tes candidatures.
                </p>
                <button
                  onClick={() => setModalOpen(true)}
                  className="btn-primary"
                >
                  + Ajouter une candidature
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
                <p style={{ fontSize: 15, color: 'var(--text2)' }}>
                  Aucune candidature ne correspond à ta recherche.
                </p>
              </>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map((c) => (
              <CandidatureCard
                key={c.id}
                candidature={c}
                onEdit={(cand) => {
                  setEditingCandidature(cand)
                  setModalOpen(true)
                }}
                onDelete={(id) => setDeleteId(id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modale ajout/modification */}
      <AddModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingCandidature(null)
        }}
        onSave={handleSave}
        editingCandidature={editingCandidature}
        isPro={isPro}
        currentCount={candidatures.length}
      />

      {/* Dialog suppression */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Supprimer cette candidature ?"
        message="Cette action est irréversible. La candidature sera définitivement supprimée."
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleteLoading}
      />
    </main>
  )
}
