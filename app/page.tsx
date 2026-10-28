'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import PricingCard from '@/components/PricingCard'
import Logo from '@/components/Logo'

const FAQ = [
  { q: 'Candidly est-il vraiment gratuit ?', a: 'Oui. Le plan gratuit est illimité dans le temps et te permet de suivre jusqu\'à 10 candidatures avec le tableau de bord complet, le calendrier des entretiens et 10 contacts networking.' },
  { q: 'Comment fonctionne l\'import d\'offre par URL ?', a: 'Tu colles le lien d\'une offre (LinkedIn, Indeed, Welcome to the Jungle, etc.) et l\'IA extrait automatiquement l\'entreprise, le poste, le lieu et le type de contrat pour pré-remplir le formulaire. Plus besoin de ressaisir à la main.' },
  { q: 'À quoi sert la section Networking ?', a: 'Elle te permet de centraliser les contacts que tu démarches : RH, managers, anciens élèves. Tu peux importer un profil LinkedIn par copier-coller, puis composer un email de candidature, de demande de meeting ou de relance grâce à l\'IA — avec 5 templates et 4 tons différents.' },
  { q: 'Mes données sont-elles sécurisées ?', a: 'Chaque utilisateur accède uniquement à ses propres données. L\'app est hébergée en Europe via Supabase, et aucune donnée personnelle n\'est partagée ou utilisée pour entraîner des modèles IA.' },
  { q: 'Puis-je annuler le plan Pro à tout moment ?', a: 'Oui, sans engagement. Tu peux annuler depuis ton tableau de bord à tout moment. Ton accès Pro reste actif jusqu\'à la fin de la période payée.' },
]

const BEFORE = [
  'Candidatures éparpillées dans des tableaux Excel',
  'Oubli des dates de relance',
  'Rédaction manuelle de chaque lettre de motivation',
  'Aucune visibilité sur le taux de succès',
  'Réseau pas suivi, contacts oubliés',
]
const AFTER = [
  'Tout centralisé dans un tableau de bord épuré',
  'Rappels email automatiques avant chaque relance',
  'Lettre de motivation générée par l\'IA en 10 secondes',
  'Stats en temps réel : taux de succès, entretiens, acceptées',
  'Contacts networking organisés + emails IA personnalisés',
]

const HERO_STATS = [
  { val: 24, lbl: 'Total' },
  { val: 12, lbl: 'En cours' },
  { val: 5, lbl: 'Entretiens' },
  { val: 8, lbl: 'Succès', suffix: '%' },
]

// Délai de transition pour les éléments révélés au scroll
const d = (ms: number) => ({ '--d': `${ms}ms` }) as React.CSSProperties

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [navScrolled, setNavScrolled] = useState(false)
  const [statP, setStatP] = useState(1)

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Révélation au scroll : chaque élément apparaît quand il entre dans l'écran
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<Element>('.rv'))
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('in'))
      return
    }
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target) }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  // Compteurs de l'aperçu : montent une seule fois, synchronisés avec l'entrée du dashboard
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const start = performance.now() + 950
    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - start) / 1100))
      setStatP(1 - Math.pow(1 - p, 3))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    setStatP(0)
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      <style>{`
        html, body { background:#fff !important; }
        html { scroll-behavior:smooth; }
        .landing {
          --ease: cubic-bezier(.16,1,.3,1);
          --ink: #0a0f2e;
          background:#fff; color:var(--ink); min-height:100vh; overflow-x:clip;
          font-family:-apple-system,BlinkMacSystemFont,'Inter','Helvetica Neue',Arial,sans-serif;
        }
        .landing * { box-sizing:border-box; margin:0; padding:0; }
        #how, #pricing { scroll-margin-top:72px; }

        /* ── Révélation au scroll : courte, douce, décalée ── */
        .rv { opacity:0; transform:translate3d(0,18px,0); transition:opacity .9s var(--ease), transform .9s var(--ease); transition-delay:var(--d,0ms); }
        .rv.in { opacity:1; transform:none; }

        /* ── Entrée de l'accroche (CSS pur, dès le chargement) ── */
        @keyframes rise   { from { opacity:0; transform:translate3d(0,16px,0) } to { opacity:1; transform:none } }
        @keyframes lineUp { from { transform:translate3d(0,105%,0) } to { transform:none } }
        @keyframes previewIn {
          from { opacity:0; transform:perspective(1600px) rotateX(9deg) translate3d(0,44px,0) scale(.97) }
          to   { opacity:1; transform:perspective(1600px) rotateX(0) translate3d(0,0,0) scale(1) }
        }
        @keyframes rowIn  { from { opacity:0; transform:translate3d(0,10px,0) } to { opacity:1; transform:none } }
        @keyframes popIn  { from { opacity:0; transform:translate3d(0,10px,0) scale(.94) } to { opacity:1; transform:none } }
        @keyframes drift  { 0%,100% { transform:translate3d(0,0,0) } 50% { transform:translate3d(0,-6px,0) } }
        @keyframes fadeOut{ to { opacity:0 } }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes ring   { 0% { box-shadow:0 0 0 0 rgba(52,201,138,.45) } 100% { box-shadow:0 0 0 10px rgba(52,201,138,0) } }
        .hi { animation:rise .9s var(--ease) both; animation-delay:var(--d,0ms); }

        /* ── Nav ── */
        .l-nav { position:fixed; top:0; left:0; right:0; z-index:100; background:rgba(255,255,255,.86); backdrop-filter:saturate(180%) blur(14px); -webkit-backdrop-filter:saturate(180%) blur(14px); border-bottom:1px solid transparent; transition:border-color .4s, box-shadow .4s; }
        .l-nav.scrolled { border-color:#eceef4; box-shadow:0 2px 20px rgba(10,15,46,.05); }
        .l-nav-inner { max-width:1140px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; padding:14px 24px; gap:12px; transition:padding .4s var(--ease); }
        .l-nav.scrolled .l-nav-inner { padding:10px 24px; }
        .l-nav-logo { text-decoration:none; flex-shrink:0; }
        .l-nav-links { display:flex; align-items:center; gap:28px; }
        .l-nav-link { font-size:14px; color:#4a4f72; text-decoration:none; font-weight:500; transition:color .2s; white-space:nowrap; }
        .l-nav-link:hover { color:var(--ink); }
        .l-btn-ghost { font-size:14px; font-weight:500; color:#4a4f72; text-decoration:none; padding:8px 14px; border-radius:8px; transition:background .2s; white-space:nowrap; }
        .l-btn-ghost:hover { background:#f4f5f8; }
        .l-btn-dark { font-size:14px; font-weight:600; color:#fff; text-decoration:none; padding:9px 18px; border-radius:9px; background:var(--ink); transition:background .2s, transform .3s var(--ease); white-space:nowrap; }
        .l-btn-dark:hover { background:#1a2040; transform:translateY(-1px); }

        /* ── Hero ── */
        .l-hero { min-height:100vh; display:flex; align-items:center; max-width:1140px; margin:0 auto; padding:120px 24px 80px; gap:64px; }
        .l-hero-left { flex:1; min-width:0; }
        .l-hero-right { flex:1; min-width:0; }
        .l-badge { display:inline-flex; align-items:center; gap:6px; font-size:12px; font-weight:600; color:#5b7cf6; background:rgba(91,124,246,.08); border:1px solid rgba(91,124,246,.18); border-radius:40px; padding:5px 14px; margin-bottom:26px; }
        .l-h1 { font-size:clamp(40px,5.5vw,76px); font-weight:700; line-height:1.06; letter-spacing:-.035em; color:var(--ink); }
        .l-line { display:block; overflow:hidden; padding-bottom:.06em; margin-bottom:-.06em; }
        .l-line > span { display:block; animation:lineUp 1s var(--ease) both; animation-delay:var(--d,0ms); }
        .l-h1 em { font-style:normal; background:linear-gradient(135deg,#5b7cf6,#9b8ef8); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
        .l-hero-sub { font-size:18px; color:#4a4f72; line-height:1.65; max-width:480px; margin:22px 0 34px; }
        .l-hero-cta { display:flex; gap:12px; flex-wrap:wrap; }
        .l-cta-primary { display:inline-flex; align-items:center; justify-content:center; gap:8px; font-size:15px; font-weight:600; color:#fff; background:var(--ink); border-radius:11px; padding:14px 26px; text-decoration:none; transition:background .2s, transform .35s var(--ease), box-shadow .35s var(--ease); }
        .l-cta-primary:hover { background:#1a2040; transform:translateY(-2px); box-shadow:0 10px 24px rgba(10,15,46,.18); }
        .l-cta-secondary { display:inline-flex; align-items:center; justify-content:center; gap:6px; font-size:15px; font-weight:500; color:#4a4f72; border:1px solid #e0e3ef; border-radius:11px; padding:14px 22px; text-decoration:none; background:#fff; transition:border-color .2s, transform .35s var(--ease); }
        .l-cta-secondary:hover { border-color:#c0c6e0; transform:translateY(-1px); }
        .l-hero-note { font-size:12px; color:#8890b0; margin-top:16px; text-wrap:balance; }

        /* ── Aperçu du dashboard ── */
        .l-preview-wrap { position:relative; animation:previewIn 1.2s var(--ease) both; animation-delay:.35s; transform-origin:50% 100%; }
        .l-browser { background:#f0f2f8; border-radius:16px; overflow:hidden; box-shadow:0 30px 80px rgba(10,15,46,.14), 0 4px 16px rgba(10,15,46,.07); border:1px solid #e4e8f0; }
        .l-browser-bar { background:#e9ebf4; padding:10px 16px; display:flex; align-items:center; gap:8px; }
        .l-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
        .l-browser-url { flex:1; min-width:0; background:#fff; border-radius:6px; padding:4px 12px; font-size:11px; color:#8890b0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .l-browser-body { background:#f4f6fb; padding:16px; }
        .l-app-nav { display:flex; align-items:center; justify-content:space-between; gap:8px; background:#fff; border-radius:10px; padding:10px 12px; margin-bottom:12px; border:1px solid #e8eaf0; }
        .l-app-tabs { display:flex; gap:6px; min-width:0; overflow:hidden; }
        .l-tab { font-size:11px; padding:5px 12px; border-radius:40px; font-weight:500; white-space:nowrap; }
        .l-tab.active { background:linear-gradient(135deg,#5b7cf6,#9b8ef8); color:#fff; }
        .l-tab.inactive { background:#f0f2f8; color:#8890b0; }
        .l-app-actions { display:flex; gap:6px; flex-shrink:0; }
        .l-app-btn { font-size:10px; padding:4px 10px; border-radius:6px; font-weight:600; white-space:nowrap; }
        .l-app-btn.primary { background:#5b7cf6; color:#fff; }
        .l-app-btn.ghost { background:#f0f2f8; color:#8890b0; }
        .l-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-bottom:12px; }
        .l-stat-card { background:#fff; border-radius:8px; padding:10px 12px; border:1px solid #e8eaf0; animation:rowIn .8s var(--ease) both; animation-delay:var(--d,0ms); }
        .l-stat-val { font-size:20px; font-weight:700; color:var(--ink); font-variant-numeric:tabular-nums; }
        .l-stat-lbl { font-size:9px; color:#8890b0; text-transform:uppercase; letter-spacing:.06em; margin-top:2px; }
        .l-cand { display:flex; flex-direction:column; gap:7px; }
        .l-cand-row { background:#fff; border-radius:8px; padding:10px 12px; border:1px solid #e8eaf0; display:flex; align-items:center; gap:10px; animation:rowIn .8s var(--ease) both; animation-delay:var(--d,0ms); }
        .l-cand-row.hero-row { animation:rowIn .8s var(--ease) both, ring 1.1s ease-out 2.75s 1; animation-delay:var(--d,0ms), 2.75s; }
        .l-cand-logo { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:12px; color:#fff; flex-shrink:0; }
        .l-cand-info { flex:1; min-width:0; }
        .l-cand-name { font-size:12px; font-weight:600; color:var(--ink); }
        .l-cand-role { font-size:10px; color:#8890b0; margin-top:1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .l-pill { font-size:10px; font-weight:600; padding:3px 10px; border-radius:40px; white-space:nowrap; }
        .l-pill.sent      { background:rgba(91,124,246,.1);  color:#185fa5; }
        .l-pill.interview { background:rgba(155,142,248,.15); color:#3c3489; }
        .l-pill.followup  { background:rgba(245,166,35,.12); color:#854f0b; }
        .l-pill.accepted  { background:rgba(52,201,138,.14); color:#3b6d11; }
        /* Changement de statut Entretien → Accepté, une seule fois */
        .l-pill-swap { position:relative; display:inline-grid; }
        .l-pill-swap > * { grid-area:1/1; }
        .l-pill-swap .from { animation:fadeOut .35s ease 2.7s both; }
        .l-pill-swap .to   { animation:fadeIn .45s var(--ease) 2.75s both; }
        .l-ai-btn { font-size:9px; padding:3px 8px; border-radius:5px; font-weight:600; background:rgba(91,124,246,.08); color:#5b7cf6; border:1px solid rgba(91,124,246,.2); white-space:nowrap; }

        .l-float-card { position:absolute; z-index:2; background:#fff; border-radius:12px; padding:10px 14px; box-shadow:0 12px 32px rgba(10,15,46,.12); border:1px solid #e8eaf0; animation:popIn .7s var(--ease) both, drift 7s ease-in-out infinite; }
        .l-float-card.f1 { bottom:-20px; left:-28px; animation-delay:3.3s, 4s; }
        .l-float-card.f2 { top:-16px; right:-22px; animation-delay:2.85s, 3.6s; }

        /* ── Sections ── */
        .l-section { max-width:1140px; margin:0 auto; padding:110px 24px; }
        .l-section-sm { max-width:1140px; margin:0 auto; padding:90px 24px; }
        .l-section-bg { background:#f8f9fc; }
        .l-eyebrow { font-size:12px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:#5b7cf6; margin-bottom:14px; }
        .l-h2 { font-size:clamp(30px,4vw,52px); font-weight:700; letter-spacing:-.03em; color:var(--ink); line-height:1.1; }
        .l-sub { font-size:17px; color:#4a4f72; line-height:1.65; margin-top:16px; max-width:560px; }

        .l-proof { border-top:1px solid #eceef4; border-bottom:1px solid #eceef4; padding:24px; }
        .l-proof-inner { max-width:1140px; margin:0 auto; display:flex; align-items:center; gap:14px 40px; flex-wrap:wrap; justify-content:center; }

        .l-steps { display:grid; grid-template-columns:repeat(3,1fr); gap:32px; margin-top:60px; }
        .l-step { position:relative; }
        .l-step-num { width:44px; height:44px; border-radius:12px; background:linear-gradient(135deg,#5b7cf6,#9b8ef8); display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:700; color:#fff; margin-bottom:20px; }
        .l-step-connector { position:absolute; top:22px; left:56px; right:-12px; height:1px; background:linear-gradient(90deg,rgba(91,124,246,.45),transparent); transform:scaleX(0); transform-origin:left; transition:transform 1.1s var(--ease); transition-delay:calc(var(--d,0ms) + 350ms); }
        .l-step.in .l-step-connector { transform:scaleX(1); }
        .l-step h3 { font-size:18px; font-weight:600; color:var(--ink); margin-bottom:10px; }
        .l-step p { font-size:14px; color:#4a4f72; line-height:1.6; }
        .l-step-icon { font-size:32px; margin-bottom:14px; }

        .l-ba { display:grid; grid-template-columns:1fr 1fr; gap:2px; margin-top:56px; border-radius:16px; overflow:hidden; border:1px solid #e0e3ef; background:#e0e3ef; }
        .l-ba-col { background:#fff; }
        .l-ba-header { padding:18px 24px; font-size:13px; font-weight:700; letter-spacing:.05em; text-transform:uppercase; }
        .l-ba-header.before { background:#fef2f2; color:#991b1b; }
        .l-ba-header.after { background:#f0fdf4; color:#166534; }
        .l-ba-item { display:flex; align-items:flex-start; gap:10px; padding:14px 24px; border-top:1px solid #f0f2f8; font-size:14px; line-height:1.5; }
        .l-ba-item.before { color:#4a4f72; }
        .l-ba-item.after { color:#166534; font-weight:500; background:rgba(240,253,244,.5); }
        .l-ba-icon { flex-shrink:0; font-size:14px; margin-top:1px; }

        .l-features { display:grid; grid-template-columns:repeat(2,1fr); gap:20px; margin-top:56px; }
        .l-feat { background:#fff; border:1px solid #e8eaf0; border-radius:16px; padding:28px; transition:opacity .9s var(--ease), transform .9s var(--ease), border-color .3s, box-shadow .4s var(--ease); transition-delay:var(--d,0ms), var(--d,0ms), 0s, 0s; }
        .l-feat.in:hover { border-color:#c5cefc; box-shadow:0 12px 36px rgba(91,124,246,.1); transform:translateY(-3px); transition-delay:0s; }
        .l-feat-icon { font-size:36px; margin-bottom:16px; }
        .l-feat h3 { font-size:18px; font-weight:600; color:var(--ink); margin-bottom:8px; }
        .l-feat p { font-size:14px; color:#4a4f72; line-height:1.6; margin-bottom:16px; }
        .l-feat-items { display:flex; flex-direction:column; gap:6px; }
        .l-feat-item { display:flex; align-items:center; gap:8px; font-size:13px; color:#4a4f72; }
        .l-check { color:#34c98a; font-size:13px; }

        .l-pricing { display:flex; gap:24px; justify-content:center; flex-wrap:wrap; align-items:flex-start; margin-top:56px; }
        .l-pricing > * { flex:0 1 340px; display:flex; justify-content:center; }

        /* FAQ : ouverture fluide (grid-template-rows) */
        .l-faq { display:flex; flex-direction:column; margin-top:56px; border:1px solid #e8eaf0; border-radius:16px; overflow:hidden; }
        .l-faq-item { border-top:1px solid #e8eaf0; }
        .l-faq-item:first-child { border-top:none; }
        .l-faq-q { width:100%; display:flex; align-items:center; justify-content:space-between; gap:16px; padding:22px 28px; background:#fff; border:none; cursor:pointer; font-size:16px; font-weight:600; color:var(--ink); text-align:left; font-family:inherit; transition:background .2s; }
        .l-faq-q:hover { background:#f8f9fc; }
        .l-faq-icon { font-size:22px; line-height:1; color:#5b7cf6; transition:transform .45s var(--ease); flex-shrink:0; }
        .l-faq-icon.open { transform:rotate(45deg); }
        .l-faq-a { display:grid; grid-template-rows:0fr; transition:grid-template-rows .5s var(--ease); }
        .l-faq-a.open { grid-template-rows:1fr; }
        .l-faq-a > div { overflow:hidden; }
        .l-faq-a p { padding:0 28px 22px; font-size:15px; color:#4a4f72; line-height:1.7; opacity:0; transform:translateY(-4px); transition:opacity .4s ease, transform .5s var(--ease); }
        .l-faq-a.open p { opacity:1; transform:none; transition-delay:.08s; }

        .l-cta-section { position:relative; overflow:hidden; background:linear-gradient(135deg,#0a0f2e 0%,#1a1f50 50%,#0f1435 100%); padding:110px 24px; text-align:center; }
        .l-cta-section::before { content:''; position:absolute; width:700px; height:700px; left:50%; top:50%; transform:translate(-50%,-50%); background:radial-gradient(circle, rgba(124,140,255,.22), transparent 62%); pointer-events:none; }
        .l-cta-section > * { position:relative; }
        .l-cta-section h2 { font-size:clamp(34px,5vw,60px); font-weight:700; color:#fff; letter-spacing:-.03em; line-height:1.1; }
        .l-cta-section p { font-size:17px; color:rgba(255,255,255,.65); margin:18px auto 40px; max-width:480px; line-height:1.6; }
        .l-cta-white { display:inline-flex; align-items:center; justify-content:center; gap:8px; font-size:16px; font-weight:600; color:var(--ink); background:#fff; border-radius:11px; padding:15px 32px; text-decoration:none; transition:transform .35s var(--ease), box-shadow .35s var(--ease); }
        .l-cta-white:hover { transform:translateY(-2px); box-shadow:0 10px 32px rgba(255,255,255,.22); }
        .l-cta-note { font-size:12px; color:rgba(255,255,255,.42); margin-top:20px; text-wrap:balance; }

        .l-footer { background:#f8f9fc; border-top:1px solid #e8eaf0; padding:60px 24px 40px; }
        .l-footer-inner { max-width:1140px; margin:0 auto; display:flex; flex-wrap:wrap; gap:40px; justify-content:space-between; align-items:flex-start; }
        .l-footer-desc { font-size:13px; color:#8890b0; max-width:260px; margin-top:12px; line-height:1.6; }
        .l-footer-links { display:flex; gap:40px; flex-wrap:wrap; }
        .l-footer-col h4 { font-size:12px; font-weight:700; color:var(--ink); text-transform:uppercase; letter-spacing:.08em; margin-bottom:14px; }
        .l-footer-col a { display:block; font-size:13px; color:#4a4f72; text-decoration:none; margin-bottom:10px; transition:color .2s; }
        .l-footer-col a:hover { color:#5b7cf6; }
        .l-footer-bottom { max-width:1140px; margin:40px auto 0; padding-top:24px; border-top:1px solid #e8eaf0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; }
        .l-footer-copy { font-size:12px; color:#8890b0; }

        /* ── Tablette ── */
        @media (max-width:860px) {
          .l-hero { flex-direction:column; align-items:stretch; min-height:auto; padding:108px 20px 64px; gap:44px; }
          .l-steps { grid-template-columns:1fr; gap:36px; margin-top:44px; }
          .l-step-connector { display:none; }
          .l-ba { grid-template-columns:1fr; }
          .l-features { grid-template-columns:1fr; margin-top:40px; }
          .l-nav-links { gap:6px; }
          .l-nav-links .l-nav-link { display:none; }
          .l-float-card.f1 { display:none; }
          .l-float-card.f2 { top:-14px; right:10px; }
          .l-section { padding:76px 20px; }
          .l-section-sm { padding:68px 20px; }
          .l-ba, .l-pricing, .l-faq { margin-top:40px; }
          .l-cta-section { padding:80px 20px; }
          .l-footer { padding:48px 20px 32px; }
        }

        /* ── Téléphone ── */
        @media (max-width:480px) {
          .l-nav-inner, .l-nav.scrolled .l-nav-inner { padding:10px 16px; }
          .l-btn-ghost { padding:8px 10px; font-size:13px; }
          .l-btn-dark { padding:8px 14px; font-size:13px; }
          .l-btn-dark .arrow { display:none; }
          .l-hero { padding:96px 16px 56px; gap:40px; }
          .l-badge { margin-bottom:20px; }
          .l-h1 { font-size:clamp(36px,10.6vw,48px); }
          .l-hero-sub { font-size:16px; margin:18px 0 28px; }
          .l-hero-cta { flex-direction:column; }
          .l-cta-primary, .l-cta-secondary { width:100%; }
          .l-hero-note { text-align:center; }
          .l-browser-body { padding:12px; }
          .l-app-actions .ghost { display:none; }
          .l-tab { padding:5px 10px; }
          .l-stats { grid-template-columns:repeat(2,1fr); }
          .l-ai-btn { display:none; }
          .l-float-card.f2 { top:-18px; right:8px; padding:8px 12px; }
          .l-proof { padding:20px 16px; }
          .l-proof-inner { gap:10px 22px; }
          .l-section { padding:64px 16px; }
          .l-section-sm { padding:56px 16px; }
          .l-ba-header, .l-ba-item { padding-left:18px; padding-right:18px; }
          .l-feat { padding:22px; }
          .l-faq-q { padding:18px 18px; font-size:15px; }
          .l-faq-a p { padding:0 18px 18px; font-size:14px; }
          .l-cta-section { padding:72px 16px; }
          .l-cta-white { width:100%; max-width:340px; }
          .l-footer-links { gap:28px; }
          .l-footer-bottom { flex-direction:column; align-items:flex-start; }
        }

        /* ── Très petits écrans (iPhone SE, anciens Android) ── */
        @media (max-width:380px) {
          .l-nav-logo span { display:none; }
          .l-btn-ghost { padding:8px 8px; }
          .l-tab.inactive { display:none; }
        }

        /* ── Accessibilité : animations réduites ── */
        @media (prefers-reduced-motion: reduce) {
          .landing *, .landing *::before { animation:none !important; transition:none !important; }
          .rv { opacity:1; transform:none; }
          .l-step-connector { transform:none; }
          .l-pill-swap .from { opacity:0; }
        }
      `}</style>
      {/* Sans JavaScript, tout reste visible */}
      <noscript><style>{`.rv{opacity:1!important;transform:none!important}.l-step-connector{transform:none!important}`}</style></noscript>

      <div className="landing">

        {/* ── NAV ── */}
        <nav className={`l-nav ${navScrolled ? 'scrolled' : ''}`}>
          <div className="l-nav-inner">
            <a href="/" className="l-nav-logo" aria-label="Candidly — accueil">
              <Logo size={28} textColor="#0a0f2e" />
            </a>
            <div className="l-nav-links">
              <a href="#how" className="l-nav-link">Fonctionnalités</a>
              <a href="#pricing" className="l-nav-link">Tarifs</a>
              <Link href="/login" className="l-btn-ghost">Se connecter</Link>
              <Link href="/register" className="l-btn-dark">Essai gratuit <span className="arrow">→</span></Link>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <div className="l-hero">
          <div className="l-hero-left">
            <div className="l-badge hi" style={d(0)}>🇫🇷 Conçu pour les étudiants français</div>
            <h1 className="l-h1">
              <span className="l-line"><span style={d(80)}>Finis de perdre</span></span>
              <span className="l-line"><span style={d(170)}>le fil de tes</span></span>
              <span className="l-line"><span style={d(260)}><em>candidatures</em></span></span>
            </h1>
            <p className="l-hero-sub hi" style={d(420)}>
              Candidly centralise toutes tes candidatures, ton réseau et tes entretiens.
              Import d&apos;offres par URL, emails IA, calendrier — tout en un.
            </p>
            <div className="l-hero-cta hi" style={d(520)}>
              <Link href="/register" className="l-cta-primary">Commencer gratuitement →</Link>
              <a href="#how" className="l-cta-secondary">Comment ça marche</a>
            </div>
            <p className="l-hero-note hi" style={d(620)}>Gratuit jusqu&apos;à 10 candidatures · Aucune carte de crédit requise</p>
          </div>

          <div className="l-hero-right">
            <div className="l-preview-wrap">
              <div className="l-float-card f2" style={{ minWidth: 168 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#3b6d11', marginBottom: 3 }}>🎉 Acceptée !</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#0a0f2e' }}>Airbus — Stage IA</div>
                <div style={{ fontSize: 11, color: '#8890b0' }}>Décision reçue aujourd&apos;hui</div>
              </div>
              <div className="l-float-card f1" style={{ minWidth: 196 }}>
                <div style={{ fontSize: 11, color: '#5b7cf6', fontWeight: 700, marginBottom: 3 }}>🔔 Rappel dans 2j</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#0a0f2e' }}>Relancer BNP Paribas</div>
                <div style={{ fontSize: 11, color: '#8890b0' }}>Alternance Finance · 5 juin</div>
              </div>

              <div className="l-browser">
                <div className="l-browser-bar">
                  <div className="l-dot" style={{ background: '#f25f5c' }} />
                  <div className="l-dot" style={{ background: '#f5a623' }} />
                  <div className="l-dot" style={{ background: '#34c98a' }} />
                  <div className="l-browser-url">candidlyapp.fr/dashboard</div>
                </div>
                <div className="l-browser-body">
                  <div className="l-app-nav">
                    <div className="l-app-tabs">
                      <div className="l-tab active">💼 Candidatures</div>
                      <div className="l-tab inactive">🤝 Networking</div>
                    </div>
                    <div className="l-app-actions">
                      <div className="l-app-btn ghost">🔗 Import URL</div>
                      <div className="l-app-btn ghost">📅</div>
                      <div className="l-app-btn primary">+ Ajouter</div>
                    </div>
                  </div>

                  <div className="l-stats">
                    {HERO_STATS.map((s, i) => (
                      <div key={s.lbl} className="l-stat-card" style={d(800 + i * 70)}>
                        <div className="l-stat-val">{Math.round(s.val * statP)}{s.suffix || ''}</div>
                        <div className="l-stat-lbl">{s.lbl}</div>
                      </div>
                    ))}
                  </div>

                  <div className="l-cand">
                    {[
                      { logo: '#5b7cf6', initials: 'AB', name: 'Airbus', role: 'Stage Ingénieur IA', pill: 'interview', label: 'Entretien', hero: true },
                      { logo: '#f5a623', initials: 'DC', name: 'Decathlon', role: 'Stage Marketing Digital', pill: 'followup', label: 'Relance' },
                      { logo: '#0a0f2e', initials: 'BN', name: 'BNP Paribas', role: 'Alternance Finance', pill: 'sent', label: 'Envoyé' },
                    ].map((c, i) => (
                      <div key={c.name} className={`l-cand-row ${c.hero ? 'hero-row' : ''}`} style={d(1050 + i * 110)}>
                        <div className="l-cand-logo" style={{ background: c.logo }}>{c.initials}</div>
                        <div className="l-cand-info">
                          <div className="l-cand-name">{c.name}</div>
                          <div className="l-cand-role">{c.role}</div>
                        </div>
                        {c.hero ? (
                          <span className="l-pill-swap">
                            <span className={`l-pill ${c.pill} from`}>{c.label}</span>
                            <span className="l-pill accepted to">Accepté</span>
                          </span>
                        ) : (
                          <div className={`l-pill ${c.pill}`}>{c.label}</div>
                        )}
                        <div className="l-ai-btn">✨ IA</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SOCIAL PROOF ── */}
        <div className="l-proof">
          <div className="l-proof-inner">
            <span className="rv" style={{ fontSize: 13, color: '#8890b0', fontWeight: 500 }}>Utilisé par des étudiants de</span>
            {['HEC Paris', 'Sciences Po', 'ESCP', 'Dauphine', 'CentraleSupélec', 'ESSEC'].map((s, i) => (
              <span key={s} className="rv" style={{ fontSize: 13, fontWeight: 600, color: '#80859f', ...d(60 + i * 50) }}>{s}</span>
            ))}
          </div>
        </div>

        {/* ── HOW IT WORKS ── */}
        <div id="how" className="l-section">
          <div className="l-eyebrow rv">Comment ça marche</div>
          <h2 className="l-h2 rv" style={d(80)}>De l&apos;offre à l&apos;acceptation<br />en un seul endroit</h2>
          <p className="l-sub rv" style={d(160)}>Candidly s&apos;adapte à ton workflow — pas l&apos;inverse.</p>

          <div className="l-steps">
            {[
              { num: '1', icon: '🔗', title: 'Importe ou ajoute une offre', desc: 'Colle le lien d\'une offre LinkedIn, Indeed ou autre. L\'IA extrait automatiquement l\'entreprise, le poste et le lieu. Ou ajoute manuellement en 30 secondes.' },
              { num: '2', icon: '📊', title: 'Suis l\'avancement en temps réel', desc: 'Envoyé, Relance, Entretien, Accepté — déplace tes candidatures au fil de l\'eau. Rappels automatiques par email avant chaque date clé.' },
              { num: '3', icon: '🤝', title: 'Développe ton réseau avec l\'IA', desc: 'Centralise tes contacts LinkedIn, analyse ton profil, compose des emails personnalisés avec 5 templates IA. Networking sans effort.' },
            ].map((s, i) => (
              <div key={s.num} className="l-step rv" style={d(i * 120)}>
                {i < 2 && <div className="l-step-connector" />}
                <div className="l-step-num">{s.num}</div>
                <div className="l-step-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── BEFORE / AFTER ── */}
        <div className="l-section-bg">
          <div className="l-section-sm">
            <div className="l-eyebrow rv">Avant vs Après</div>
            <h2 className="l-h2 rv" style={d(80)}>La différence Candidly</h2>

            <div className="l-ba rv" style={d(160)}>
              <div className="l-ba-col">
                <div className="l-ba-header before">❌ Avant Candidly</div>
                {BEFORE.map((item, i) => (
                  <div key={i} className="l-ba-item before"><span className="l-ba-icon">✗</span>{item}</div>
                ))}
              </div>
              <div className="l-ba-col">
                <div className="l-ba-header after">✅ Avec Candidly</div>
                {AFTER.map((item, i) => (
                  <div key={i} className="l-ba-item after"><span className="l-ba-icon">✓</span>{item}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── AI FEATURES ── */}
        <div className="l-section">
          <div className="l-eyebrow rv">Intelligence artificielle</div>
          <h2 className="l-h2 rv" style={d(80)}>L&apos;IA qui booste<br />chaque candidature</h2>
          <p className="l-sub rv" style={d(160)}>1 essai gratuit pour chaque outil. Illimité avec Pro.</p>

          <div className="l-features">
            {[
              { icon: '📄', title: 'Analyse de CV', desc: 'Uploade ton CV en PDF. Score sur 10, points forts, faiblesses et suggestions concrètes en 5 secondes.', items: ['Score global sur 10', 'Points forts identifiés', 'Suggestions d\'amélioration'] },
              { icon: '✍️', title: 'Lettre de motivation', desc: 'Sélectionne une candidature, colle l\'offre. L\'IA génère une lettre personnalisée et professionnelle instantanément.', items: ['Personnalisée pour chaque offre', 'Ton professionnel', 'Prête à envoyer'] },
              { icon: '🔗', title: 'Import d\'offre par URL', desc: 'Colle le lien d\'une offre et le formulaire se remplit tout seul. Compatible tous les job boards.', items: ['LinkedIn, Indeed, WTTJ...', 'Entreprise & poste extraits', 'Gain de temps immédiat'] },
              { icon: '✉️', title: 'Email networking IA', desc: '5 templates × 4 tons. Candidature, demande de meeting, relance — personnalisés pour ton contact.', items: ['5 types d\'emails', '4 niveaux de ton', 'Envoi depuis Candidly'] },
            ].map((f, i) => (
              <div key={f.title} className="l-feat rv" style={d((i % 2) * 120 + Math.floor(i / 2) * 60)}>
                <div className="l-feat-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <div className="l-feat-items">
                  {f.items.map(item => (
                    <div key={item} className="l-feat-item"><span className="l-check">✓</span> {item}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PRICING ── */}
        <div id="pricing" className="l-section-bg">
          <div className="l-section-sm" style={{ textAlign: 'center' }}>
            <div className="l-eyebrow rv">Tarifs</div>
            <h2 className="l-h2 rv" style={d(80)}>Simple et transparent</h2>
            <p className="l-sub rv" style={{ margin: '16px auto 0', ...d(160) }}>Commence gratuitement, passe Pro quand tu es prêt.</p>
            <div className="l-pricing">
              <div className="rv" style={d(120)}><PricingCard plan="gratuit" onChoose={() => {}} /></div>
              <div className="rv" style={d(240)}><PricingCard plan="pro" onChoose={() => {}} /></div>
            </div>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="l-section">
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div className="l-eyebrow rv" style={{ textAlign: 'center' }}>FAQ</div>
            <h2 className="l-h2 rv" style={{ textAlign: 'center', ...d(80) }}>Questions fréquentes</h2>
            <div className="l-faq rv" style={d(160)}>
              {FAQ.map((item, i) => (
                <div key={i} className="l-faq-item">
                  <button className="l-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                    {item.q}
                    <span className={`l-faq-icon ${openFaq === i ? 'open' : ''}`}>+</span>
                  </button>
                  <div className={`l-faq-a ${openFaq === i ? 'open' : ''}`}>
                    <div><p>{item.a}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA SECTION ── */}
        <div className="l-cta-section">
          <h2 className="rv">Prêt à postuler<br />avec méthode ?</h2>
          <p className="rv" style={d(100)}>Rejoins les étudiants qui suivent leurs candidatures avec Candidly. Gratuit, sans engagement.</p>
          <div className="rv" style={d(200)}>
            <Link href="/register" className="l-cta-white">Commencer gratuitement →</Link>
          </div>
          <p className="l-cta-note rv" style={d(300)}>Gratuit jusqu&apos;à 10 candidatures · Essai Pro 7 jours</p>
        </div>

        {/* ── FOOTER ── */}
        <footer className="l-footer">
          <div className="l-footer-inner">
            <div>
              <Logo size={28} textColor="#0a0f2e" />
              <p className="l-footer-desc">La plateforme de suivi de candidatures conçue pour les étudiants français.</p>
            </div>
            <div className="l-footer-links">
              <div className="l-footer-col">
                <h4>Produit</h4>
                <a href="#how">Fonctionnalités</a>
                <a href="#pricing">Tarifs</a>
                <Link href="/login">Se connecter</Link>
                <Link href="/register">Essai gratuit</Link>
              </div>
              <div className="l-footer-col">
                <h4>Légal</h4>
                <Link href="/mentions-legales">Mentions légales</Link>
                <Link href="/confidentialite">Confidentialité</Link>
                <Link href="/cgu">CGU</Link>
                <Link href="/cgv">CGV</Link>
              </div>
              <div className="l-footer-col">
                <h4>Contact</h4>
                <a href="mailto:contact@candidlyapp.fr">contact@candidlyapp.fr</a>
              </div>
            </div>
          </div>
          <div className="l-footer-bottom">
            <span className="l-footer-copy">© {new Date().getFullYear()} Candidly — Fait avec ❤️ pour les étudiants français</span>
            <span className="l-footer-copy">🇫🇷 100% en français</span>
          </div>
        </footer>

      </div>
    </>
  )
}
