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
import CVAnalysisModal from '@/components/CVAnalysisModal'
import CoverLetterModal from '@/components/CoverLetterModal'
import InterviewPrepModal from '@/components/InterviewPrepModal'
import KanbanView from '@/components/KanbanView'
import CalendarView from '@/components/CalendarView'
import ThemeToggle from '@/components/ThemeToggle'
import SectionNav, { type AppSection } from '@/components/SectionNav'
import NetworkingSection from '@/components/networking/NetworkingSection'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createBrowserClient()

  const [candidatures, setCandidatures] = useState<Candidature[]>([])
  const [isPro, setIsPro] = useState(false)
  const [userName, setUserName] = useState('')
  const [userId, setUserId] = useState('')
  const [scrolled, setScrolled] = useState(false)

  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCandidature, setEditingCandidature] = useState<Candidature | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [cvModalOpen, setCvModalOpen] = useState(false)
  const [coverLetterModalOpen, setCoverLetterModalOpen] = useState(false)
  const [coverLetterCandidature, setCoverLetterCandidature] = useState<Candidature | null>(null)
  const [interviewModalOpen, setInterviewModalOpen] = useState(false)
  const [interviewCandidature, setInterviewCandidature] = useState<Candidature | null>(null)
  const [view, setView] = useState<'liste' | 'kanban' | 'calendrier'>('liste')
  const [section, setSection] = useState<AppSection>('candidatures')

  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatut, setFilterStatut] = useState<Statut | 'Tous'>('Tous')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      setUserId(session.user.id)

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, is_pro')
        .eq('id', session.user.id)
        .single()

      if (profile) {
        setIsPro(profile.is_pro)
        setUserName(profile.full_name || session.user.email?.split('@')[0] || 'toi')
      }

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

  const stats: Stats = useMemo(() => {
    const total = candidatures.length
    const en_cours = candidatures.filter(c => c.statut === 'Envoyé' || c.statut === 'Relance').length
    const entretiens = candidatures.filter(c => c.statut === 'Entretien').length
    const acceptes = candidatures.filter(c => c.statut === 'Accepté').length
    const taux_succes = total > 0 ? Math.round((acceptes / total) * 100) : 0
    return { total, en_cours, entretiens, acceptes, taux_succes }
  }, [candidatures])

  const filtered = useMemo(() => {
    let result = candidatures
    if (filterStatut !== 'Tous') result = result.filter(c => c.statut === filterStatut)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(c =>
        c.entreprise.toLowerCase().includes(q) || c.poste.toLowerCase().includes(q)
      )
    }
    return result
  }, [candidatures, filterStatut, searchQuery])

  const handleSave = useCallback(async (data: CandidatureInsert) => {
    if (editingCandidature) {
      const { data: updated, error } = await supabase
        .from('candidatures')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', editingCandidature.id)
        .select()
        .single()
      if (error) throw error
      setCandidatures(prev => prev.map(c => c.id === editingCandidature.id ? updated : c))
    } else {
      const { data: created, error } = await supabase
        .from('candidatures')
        .insert({ ...data, user_id: userId })
        .select()
        .single()
      if (error) throw error
      setCandidatures(prev => [created, ...prev])
    }
    setEditingCandidature(null)
  }, [editingCandidature, supabase, userId])

  const handleDelete = useCallback(async () => {
    if (!deleteId) return
    setDeleteLoading(true)
    await supabase.from('candidatures').delete().eq('id', deleteId)
    setCandidatures(prev => prev.filter(c => c.id !== deleteId))
    setDeleteId(null)
    setDeleteLoading(false)
  }, [deleteId, supabase])

  const handleStatusChange = useCallback(async (id: string, newStatus: Statut) => {
    setCandidatures(prev => prev.map(c => c.id === id ? { ...c, statut: newStatus } : c))
    await supabase.from('candidatures').update({ statut: newStatus, updated_at: new Date().toISOString() }).eq('id', id)
  }, [supabase])

  const handleExportCSV = useCallback(() => {
    const headers = ['Entreprise', 'Poste', 'Statut', 'Date envoi', 'Date rappel', 'Date entretien', 'Lien', 'Notes']
    const rows = candidatures.map(c => [
      c.entreprise, c.poste, c.statut,
      c.date_envoi || '', c.date_rappel || '', c.date_entretien || '',
      c.lien_offre || '', (c.notes || '').replace(/\n/g, ' '),
    ])
    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `candidatures_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [candidatures])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        `}</style>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40,
            border: '3px solid rgba(91,124,246,0.2)',
            borderTopColor: '#5b7cf6',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{ color: 'var(--text3)', fontSize: 14, animation: 'pulse 2s ease infinite' }}>Chargement…</p>
        </div>
      </main>
    )
  }

  const firstName = userName.split(' ')[0]

  return (
    <>
      <style>{`
        @keyframes db-fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes db-fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .db-anim       { animation: db-fadeUp 0.5s cubic-bezier(.22,.68,0,1.2) both; }
        .db-anim-fade  { animation: db-fadeIn 0.4s ease both; }
        .db-d1  { animation-delay: 0.05s; }
        .db-d2  { animation-delay: 0.12s; }
        .db-d3  { animation-delay: 0.20s; }
        .db-d4  { animation-delay: 0.28s; }
        .db-d5  { animation-delay: 0.36s; }
        .db-d6  { animation-delay: 0.44s; }

        .db-header {
          position: sticky;
          top: 0;
          z-index: 100;
          transition: background 0.25s, box-shadow 0.25s, border-color 0.25s;
        }
        .db-header-scrolled {
          background: var(--glass) !important;
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          box-shadow: 0 1px 0 var(--glass-border), 0 4px 24px rgba(80,90,140,0.08);
        }

        .db-welcome-stat {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 40px;
          background: var(--glass);
          border: 1px solid var(--glass-border);
          font-size: 13px;
          color: var(--text2);
          font-weight: 500;
        }

        .db-view-btn {
          padding: 6px 13px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-size: 14px;
          color: var(--text1);
          transition: all 0.15s ease;
        }
        .db-view-btn:hover { background: var(--glass) !important; }

        .db-pill {
          padding: 5px 14px;
          border-radius: 40px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }
        .db-pill:hover { transform: translateY(-1px); }
      `}</style>

      <main style={{ minHeight: '100vh', padding: '0 16px 80px' }}>

        {/* ── TOPBAR STICKY ── */}
        <header
          className={`db-header db-anim-fade ${scrolled ? 'db-header-scrolled' : ''}`}
          style={{ margin: '0 -16px', padding: '0 16px' }}
        >
          <div style={{
            maxWidth: 1100,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 0',
            flexWrap: 'wrap',
            gap: 10,
          }}>
            <Logo />

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={() => setCvModalOpen(true)}
                className="btn-secondary"
                style={{ fontSize: 12, padding: '7px 14px' }}
              >
                ✨ Analyser mon CV
              </button>

              {!isPro && (
                <Link
                  href="/pricing"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'linear-gradient(135deg,rgba(91,124,246,0.12),rgba(155,142,248,0.12))',
                    border: '1px solid rgba(91,124,246,0.25)',
                    borderRadius: 40,
                    padding: '6px 14px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--accent)',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  ✨ Passer à Pro
                </Link>
              )}
              {isPro && (
                <span style={{
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
                }}>
                  ✨ Pro
                </span>
              )}

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                background: 'var(--toggle-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: 40,
                padding: '6px 14px',
                fontSize: 13,
                color: 'var(--text2)',
              }}>
                <span>👤</span>
                <span>{userName}</span>
              </div>

              <ThemeToggle />

              <button
                onClick={handleLogout}
                className="btn-secondary"
                style={{ fontSize: 12, padding: '7px 14px' }}
              >
                Déconnexion
              </button>
            </div>
          </div>
        </header>

        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* ── SECTION WELCOME ── */}
          <div className="db-anim db-d1" style={{ padding: '36px 0 28px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 4, fontWeight: 500 }}>
                  {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <h1 style={{
                  fontSize: 32,
                  fontWeight: 800,
                  lineHeight: 1.15,
                  background: 'linear-gradient(135deg, var(--text1) 0%, var(--accent) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: 12,
                }}>
                  Bonjour, {firstName} 👋
                </h1>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span className="db-welcome-stat">💼 {stats.total} candidature{stats.total !== 1 ? 's' : ''}</span>
                  {stats.entretiens > 0 && <span className="db-welcome-stat">🎯 {stats.entretiens} entretien{stats.entretiens !== 1 ? 's' : ''}</span>}
                  {stats.acceptes > 0 && <span className="db-welcome-stat" style={{ color: 'var(--success)', background: 'rgba(52,201,138,0.08)', borderColor: 'rgba(52,201,138,0.2)' }}>✅ {stats.acceptes} acceptée{stats.acceptes !== 1 ? 's' : ''}</span>}
                  {stats.total === 0 && <span className="db-welcome-stat">🚀 Prêt à postuler !</span>}
                </div>
              </div>
              <button
                onClick={() => { setEditingCandidature(null); setModalOpen(true) }}
                className="btn-primary"
                style={{ fontSize: 14, padding: '11px 22px', flexShrink: 0 }}
              >
                + Nouvelle candidature
              </button>
            </div>
          </div>

          {/* ── NAV SECTIONS ── */}
          <div className="db-anim db-d2">
            <SectionNav current={section} onChange={setSection} />
          </div>

          {/* ── NETWORKING ── */}
          {section === 'networking' && (
            <div className="db-anim db-d3">
              <NetworkingSection userId={userId} isPro={isPro} />
            </div>
          )}

          {/* ── CANDIDATURES ── */}
          {section === 'candidatures' && (
            <>
              {/* Rappels Pro */}
              {isPro && candidatures.length > 0 && (
                <div className="db-anim db-d3" style={{ marginBottom: 16 }}>
                  <ReminderBanner candidatures={candidatures} />
                </div>
              )}

              {/* Stats */}
              <div className="db-anim db-d3" style={{ marginBottom: 24 }}>
                <StatsGrid stats={stats} />
              </div>

              {/* Barre d'actions */}
              <div className="db-anim db-d4" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 14,
                flexWrap: 'wrap',
                gap: 10,
              }}>
                <div>
                  <p style={{ fontSize: 13, color: 'var(--text3)' }}>
                    {filtered.length !== candidatures.length
                      ? `${filtered.length} / ${candidatures.length} candidature${candidatures.length !== 1 ? 's' : ''}`
                      : `${candidatures.length} candidature${candidatures.length !== 1 ? 's' : ''}`}
                    {!isPro && stats.total >= 7 && (
                      <span style={{ color: 'var(--warn)', marginLeft: 8 }}>
                        · {10 - stats.total} restante{10 - stats.total !== 1 ? 's' : ''} (plan gratuit)
                      </span>
                    )}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {/* Toggle vue */}
                  <div style={{
                    display: 'flex',
                    background: 'var(--toggle-bg)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 10,
                    padding: 3,
                    gap: 2,
                  }}>
                    {([
                      { v: 'liste', icon: '☰', label: 'Vue liste' },
                      { v: 'kanban', icon: '⊞', label: 'Vue Kanban' },
                      { v: 'calendrier', icon: '📅', label: 'Calendrier' },
                    ] as const).map(({ v, icon, label }) => (
                      <button
                        key={v}
                        onClick={() => setView(v)}
                        title={label}
                        className="db-view-btn"
                        style={{
                          background: view === v ? 'var(--toggle-active-bg)' : 'transparent',
                          boxShadow: view === v ? 'var(--toggle-active-shadow)' : 'none',
                        }}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleExportCSV}
                    className="btn-secondary"
                    style={{ fontSize: 13 }}
                    disabled={candidatures.length === 0}
                  >
                    ↓ Export CSV
                  </button>
                  <button
                    onClick={() => { setEditingCandidature(null); setModalOpen(true) }}
                    className="btn-primary"
                    style={{ fontSize: 13 }}
                  >
                    + Ajouter
                  </button>
                </div>
              </div>

              {/* Filtres (masqués en vue calendrier) */}
              {view !== 'calendrier' && (
                <div className="db-anim db-d5 glass-card-secondary" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 18px',
                  marginBottom: 16,
                  flexWrap: 'wrap',
                }}>
                  <div style={{ flex: '1 1 200px', position: 'relative' }}>
                    <span style={{
                      position: 'absolute',
                      left: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: 14,
                      color: 'var(--text3)',
                    }}>🔍</span>
                    <input
                      className="glass-input"
                      type="text"
                      placeholder="Rechercher entreprise ou poste…"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      style={{ paddingLeft: 34 }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {(['Tous', ...STATUTS] as (Statut | 'Tous')[]).map(s => {
                      const isActive = filterStatut === s
                      const styleInfo = s !== 'Tous' ? STATUT_STYLES[s] : null
                      return (
                        <button
                          key={s}
                          onClick={() => setFilterStatut(s)}
                          className="db-pill"
                          style={{
                            border: isActive
                              ? `1px solid ${styleInfo ? styleInfo.text : 'var(--accent)'}`
                              : '1px solid var(--border-subtle)',
                            background: isActive
                              ? styleInfo ? styleInfo.bg : 'rgba(91,124,246,0.12)'
                              : 'var(--pill-inactive-bg)',
                            color: isActive
                              ? styleInfo ? styleInfo.text : 'var(--accent)'
                              : 'var(--pill-inactive-text)',
                            fontWeight: isActive ? 600 : 400,
                          }}
                        >
                          {s}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Vue Calendrier */}
              {view === 'calendrier' && (
                <div className="db-anim db-d6" style={{ marginBottom: 24 }}>
                  <CalendarView
                    candidatures={candidatures}
                    onEdit={cand => { setEditingCandidature(cand); setModalOpen(true) }}
                    onInterviewPrep={cand => { setInterviewCandidature(cand); setInterviewModalOpen(true) }}
                  />
                </div>
              )}

              {/* Vue Kanban */}
              {view === 'kanban' && (
                <div className="db-anim db-d6" style={{ marginBottom: 24 }}>
                  <KanbanView
                    candidatures={candidatures}
                    isPro={isPro}
                    onStatusChange={handleStatusChange}
                    onEdit={cand => { setEditingCandidature(cand); setModalOpen(true) }}
                    onDelete={id => setDeleteId(id)}
                    onCoverLetter={cand => { setCoverLetterCandidature(cand); setCoverLetterModalOpen(true) }}
                    onInterviewPrep={cand => { setInterviewCandidature(cand); setInterviewModalOpen(true) }}
                  />
                </div>
              )}

              {/* Vue liste */}
              {view === 'liste' && (
                <div className="db-anim db-d6">
                  {filtered.length === 0 ? (
                    <div className="glass-card" style={{ padding: '64px 24px', textAlign: 'center', color: 'var(--text3)' }}>
                      {candidatures.length === 0 ? (
                        <>
                          <div style={{ fontSize: 52, marginBottom: 16 }}>💼</div>
                          <p style={{ fontSize: 18, color: 'var(--text2)', fontWeight: 600, marginBottom: 8 }}>
                            Ajoute ta première candidature
                          </p>
                          <p style={{ fontSize: 14, marginBottom: 24, lineHeight: 1.6, maxWidth: 400, margin: '0 auto 24px' }}>
                            Clique sur &laquo; Ajouter &raquo; pour commencer à suivre tes candidatures.
                          </p>
                          <button onClick={() => setModalOpen(true)} className="btn-primary">
                            + Ajouter une candidature
                          </button>
                        </>
                      ) : (
                        <>
                          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                          <p style={{ fontSize: 15, color: 'var(--text2)' }}>
                            Aucune candidature ne correspond à ta recherche.
                          </p>
                        </>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {filtered.map((c, i) => (
                        <div
                          key={c.id}
                          className="db-anim"
                          style={{ animationDelay: `${0.44 + i * 0.05}s` }}
                        >
                          <CandidatureCard
                            candidature={c}
                            onEdit={cand => { setEditingCandidature(cand); setModalOpen(true) }}
                            onDelete={id => setDeleteId(id)}
                            onCoverLetter={cand => { setCoverLetterCandidature(cand); setCoverLetterModalOpen(true) }}
                            onInterviewPrep={cand => { setInterviewCandidature(cand); setInterviewModalOpen(true) }}
                            isPro={isPro}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* ── MODALS ── */}
        <AddModal
          isOpen={modalOpen}
          onClose={() => { setModalOpen(false); setEditingCandidature(null) }}
          onSave={handleSave}
          editingCandidature={editingCandidature}
          isPro={isPro}
          currentCount={candidatures.length}
        />

        <CVAnalysisModal
          isOpen={cvModalOpen}
          onClose={() => setCvModalOpen(false)}
          isPro={isPro}
        />

        <CoverLetterModal
          isOpen={coverLetterModalOpen}
          onClose={() => { setCoverLetterModalOpen(false); setCoverLetterCandidature(null) }}
          candidature={coverLetterCandidature}
          isPro={isPro}
        />

        <InterviewPrepModal
          isOpen={interviewModalOpen}
          onClose={() => { setInterviewModalOpen(false); setInterviewCandidature(null) }}
          candidature={interviewCandidature}
          isPro={isPro}
        />

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
    </>
  )
}
