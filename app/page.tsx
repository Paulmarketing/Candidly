'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import PricingCard from '@/components/PricingCard'

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

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [navScrolled, setNavScrolled] = useState(false)
  const [cardStep, setCardStep] = useState(0)

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<Element>('.l-up,.l-left,.l-right,.l-fade'))
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('l-in'); obs.unobserve(e.target) } }),
      { threshold: 0, rootMargin: '0px 0px 80px 0px' }
    )
    els.forEach(el => obs.observe(el))
    // Fallback : révèle tout après 2s si l'observer ne se déclenche pas
    const t = setTimeout(() => els.forEach(el => el.classList.add('l-in')), 2000)
    return () => { obs.disconnect(); clearTimeout(t) }
  }, [])

  useEffect(() => {
    const t = setInterval(() => setCardStep(s => (s + 1) % 4), 1800)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      <style>{`
        /* ── Reset landing ── */
        html, body { background:#fff !important; }
        .landing { background:#fff; color:#0a0f2e; font-family:-apple-system,BlinkMacSystemFont,'Inter','Helvetica Neue',Arial,sans-serif; min-height:100vh; }
        .landing * { box-sizing:border-box; margin:0; padding:0; }

        /* ── Scroll animations ── */
        .l-up   { opacity:0; transform:translateY(32px); transition:opacity .65s ease,transform .65s ease; }
        .l-left { opacity:0; transform:translateX(-32px);transition:opacity .65s ease,transform .65s ease; }
        .l-right{ opacity:0; transform:translateX(32px); transition:opacity .65s ease,transform .65s ease; }
        .l-fade { opacity:0;                              transition:opacity .65s ease; }
        .l-in   { opacity:1 !important; transform:none !important; }
        .l-delay-1 { transition-delay:.1s; }
        .l-delay-2 { transition-delay:.2s; }
        .l-delay-3 { transition-delay:.3s; }
        .l-delay-4 { transition-delay:.45s; }
        .l-delay-5 { transition-delay:.6s; }

        /* ── Nav ── */
        .l-nav {
          position:fixed; top:0; left:0; right:0; z-index:100;
          background:rgba(255,255,255,0.92);
          backdrop-filter:blur(12px);
          border-bottom:1px solid transparent;
          transition:border-color .3s,box-shadow .3s;
        }
        .l-nav.scrolled { border-color:#e8eaf0; box-shadow:0 2px 16px rgba(10,15,46,0.06); }
        .l-nav-inner {
          max-width:1140px; margin:0 auto;
          display:flex; align-items:center; justify-content:space-between;
          padding:16px 24px;
        }
        .l-nav-logo { font-size:20px; font-weight:700; color:#0a0f2e; text-decoration:none; display:flex; align-items:center; gap:8px; }
        .l-nav-logo span { background:linear-gradient(135deg,#5b7cf6,#9b8ef8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
        .l-nav-links { display:flex; align-items:center; gap:28px; }
        .l-nav-link { font-size:14px; color:#4a4f72; text-decoration:none; font-weight:500; transition:color .2s; }
        .l-nav-link:hover { color:#0a0f2e; }
        .l-btn-ghost { font-size:14px; font-weight:500; color:#4a4f72; text-decoration:none; padding:8px 16px; border-radius:8px; transition:background .2s; }
        .l-btn-ghost:hover { background:#f4f5f8; }
        .l-btn-dark { font-size:14px; font-weight:600; color:#fff; text-decoration:none; padding:9px 20px; border-radius:8px; background:#0a0f2e; transition:background .2s,transform .15s; }
        .l-btn-dark:hover { background:#1a2040; transform:translateY(-1px); }

        /* ── Hero ── */
        .l-hero {
          min-height:100vh; display:flex; align-items:center;
          max-width:1140px; margin:0 auto; padding:120px 24px 80px;
          gap:60px;
        }
        .l-hero-left { flex:1; min-width:0; }
        .l-hero-right { flex:1; min-width:0; }
        .l-badge {
          display:inline-flex; align-items:center; gap:6px;
          font-size:12px; font-weight:600; color:#5b7cf6;
          background:rgba(91,124,246,.08); border:1px solid rgba(91,124,246,.18);
          border-radius:40px; padding:5px 14px; margin-bottom:28px;
          animation:fadeUp .6s ease forwards;
        }
        .l-h1 {
          font-size:clamp(44px,5.5vw,76px); font-weight:700;
          line-height:1.08; letter-spacing:-.03em;
          color:#0a0f2e;
          animation:fadeUp .7s .1s ease both;
        }
        .l-h1 em { font-style:normal; color:#5b7cf6; }
        .l-hero-sub {
          font-size:18px; color:#4a4f72; line-height:1.65;
          max-width:480px; margin:20px 0 36px;
          animation:fadeUp .7s .2s ease both;
        }
        .l-hero-cta { display:flex; gap:12px; flex-wrap:wrap; animation:fadeUp .7s .3s ease both; }
        .l-cta-primary {
          display:inline-flex; align-items:center; gap:8px;
          font-size:15px; font-weight:600; color:#fff;
          background:#0a0f2e; border-radius:10px; padding:13px 26px;
          text-decoration:none; transition:background .2s,transform .15s;
        }
        .l-cta-primary:hover { background:#1a2040; transform:translateY(-2px); }
        .l-cta-secondary {
          display:inline-flex; align-items:center; gap:6px;
          font-size:15px; font-weight:500; color:#4a4f72;
          border:1px solid #e0e3ef; border-radius:10px; padding:13px 22px;
          text-decoration:none; background:#fff; transition:border-color .2s,transform .15s;
        }
        .l-cta-secondary:hover { border-color:#c0c6e0; transform:translateY(-1px); }
        .l-hero-note { font-size:12px; color:#8890b0; margin-top:16px; animation:fadeUp .7s .4s ease both; }

        /* ── Dashboard preview ── */
        .l-preview-wrap {
          animation:fadeRight .8s .25s ease both;
          position:relative;
        }
        .l-browser {
          background:#f0f2f8; border-radius:16px; overflow:hidden;
          box-shadow:0 24px 80px rgba(10,15,46,.15),0 4px 16px rgba(10,15,46,.08);
          border:1px solid #e4e8f0;
        }
        .l-browser-bar {
          background:#e8eaf4; padding:10px 16px;
          display:flex; align-items:center; gap:10px;
        }
        .l-dot { width:10px; height:10px; border-radius:50%; }
        .l-browser-url {
          flex:1; background:#fff; border-radius:6px; padding:4px 12px;
          font-size:11px; color:#8890b0;
        }
        .l-browser-body { background:#f4f6fb; padding:16px; }

        /* ── App chrome inside browser ── */
        .l-app-nav {
          display:flex; align-items:center; justify-content:space-between;
          background:#fff; border-radius:10px; padding:10px 14px;
          margin-bottom:12px; border:1px solid #e8eaf0;
        }
        .l-app-tabs { display:flex; gap:6px; }
        .l-tab { font-size:11px; padding:5px 14px; border-radius:40px; font-weight:500; cursor:default; }
        .l-tab.active { background:linear-gradient(135deg,#5b7cf6,#9b8ef8); color:#fff; }
        .l-tab.inactive { background:#f0f2f8; color:#8890b0; }
        .l-app-actions { display:flex; gap:6px; }
        .l-app-btn { font-size:10px; padding:4px 10px; border-radius:6px; font-weight:600; }
        .l-app-btn.primary { background:#5b7cf6; color:#fff; }
        .l-app-btn.ghost { background:#f0f2f8; color:#8890b0; }

        .l-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-bottom:12px; }
        .l-stat-card { background:#fff; border-radius:8px; padding:10px 12px; border:1px solid #e8eaf0; }
        .l-stat-val { font-size:20px; font-weight:700; color:#0a0f2e; }
        .l-stat-lbl { font-size:9px; color:#8890b0; text-transform:uppercase; letter-spacing:.06em; margin-top:2px; }

        .l-cand { display:flex; flex-direction:column; gap:7px; }
        .l-cand-row {
          background:#fff; border-radius:8px; padding:10px 12px;
          border:1px solid #e8eaf0; display:flex; align-items:center; gap:10px;
          transition:all .4s ease;
        }
        .l-cand-row.appear { animation:slideCardIn .5s ease forwards; }
        .l-cand-logo {
          width:32px; height:32px; border-radius:8px;
          display:flex; align-items:center; justify-content:center;
          font-weight:700; font-size:12px; color:#fff; flex-shrink:0;
        }
        .l-cand-info { flex:1; min-width:0; }
        .l-cand-name { font-size:12px; font-weight:600; color:#0a0f2e; }
        .l-cand-role { font-size:10px; color:#8890b0; margin-top:1px; }
        .l-pill { font-size:10px; font-weight:600; padding:3px 10px; border-radius:40px; white-space:nowrap; }
        .l-pill.sent     { background:rgba(91,124,246,.1);  color:#185fa5; }
        .l-pill.interview{ background:rgba(155,142,248,.15);color:#3c3489; }
        .l-pill.followup { background:rgba(245,166,35,.12); color:#854f0b; }
        .l-pill.accepted { background:rgba(52,201,138,.12); color:#3b6d11; }

        .l-ai-btn { font-size:9px; padding:3px 8px; border-radius:5px; font-weight:600; background:rgba(91,124,246,.08); color:#5b7cf6; border:1px solid rgba(91,124,246,.2); white-space:nowrap; }

        /* ── Floating accent cards ── */
        .l-float-card {
          position:absolute; background:#fff;
          border-radius:12px; padding:10px 14px;
          box-shadow:0 8px 32px rgba(10,15,46,.12);
          border:1px solid #e8eaf0;
          animation:floatY 5s ease-in-out infinite;
        }
        .l-float-card.f1 { bottom:-20px; left:-30px; animation-delay:0s; }
        .l-float-card.f2 { top:-16px; right:-24px; animation-delay:-2.5s; }

        /* ── Section shared ── */
        .l-section { max-width:1140px; margin:0 auto; padding:100px 24px; }
        .l-section-sm { max-width:1140px; margin:0 auto; padding:80px 24px; }
        .l-section-bg { background:#f8f9fc; }
        .l-eyebrow {
          font-size:12px; font-weight:700; letter-spacing:.1em; text-transform:uppercase;
          color:#5b7cf6; margin-bottom:14px;
        }
        .l-h2 { font-size:clamp(32px,4vw,52px); font-weight:700; letter-spacing:-.025em; color:#0a0f2e; line-height:1.1; }
        .l-sub { font-size:17px; color:#4a4f72; line-height:1.65; margin-top:16px; max-width:560px; }

        /* ── Steps ── */
        .l-steps { display:grid; grid-template-columns:repeat(3,1fr); gap:32px; margin-top:60px; }
        .l-step { position:relative; }
        .l-step-num {
          width:44px; height:44px; border-radius:12px;
          background:linear-gradient(135deg,#5b7cf6,#9b8ef8);
          display:flex; align-items:center; justify-content:center;
          font-size:18px; font-weight:700; color:#fff; margin-bottom:20px;
        }
        .l-step-connector {
          position:absolute; top:22px; left:52px; right:-16px; height:1px;
          background:linear-gradient(90deg,rgba(91,124,246,.4),transparent);
        }
        .l-step h3 { font-size:18px; font-weight:600; color:#0a0f2e; margin-bottom:10px; }
        .l-step p  { font-size:14px; color:#4a4f72; line-height:1.6; }
        .l-step-icon { font-size:32px; margin-bottom:14px; }

        /* ── Before/After ── */
        .l-ba { display:grid; grid-template-columns:1fr 1fr; gap:2px; margin-top:56px; border-radius:16px; overflow:hidden; border:1px solid #e0e3ef; }
        .l-ba-col { padding:0; }
        .l-ba-header { padding:18px 24px; font-size:13px; font-weight:700; letter-spacing:.05em; text-transform:uppercase; }
        .l-ba-header.before { background:#fef2f2; color:#991b1b; }
        .l-ba-header.after  { background:#f0fdf4; color:#166534; }
        .l-ba-item { display:flex; align-items:flex-start; gap:10px; padding:14px 24px; border-top:1px solid #f0f2f8; font-size:14px; line-height:1.5; }
        .l-ba-item.before { color:#4a4f72; }
        .l-ba-item.after  { color:#166534; font-weight:500; background:rgba(240,253,244,.5); }
        .l-ba-icon { flex-shrink:0; font-size:14px; margin-top:1px; }

        /* ── Feature cards ── */
        .l-features { display:grid; grid-template-columns:repeat(2,1fr); gap:20px; margin-top:56px; }
        .l-feat {
          background:#fff; border:1px solid #e8eaf0; border-radius:16px;
          padding:28px; transition:border-color .2s,box-shadow .2s,transform .2s;
        }
        .l-feat:hover { border-color:#c5cefc; box-shadow:0 8px 32px rgba(91,124,246,.1); transform:translateY(-3px); }
        .l-feat-icon { font-size:36px; margin-bottom:16px; }
        .l-feat h3 { font-size:18px; font-weight:600; color:#0a0f2e; margin-bottom:8px; }
        .l-feat p  { font-size:14px; color:#4a4f72; line-height:1.6; margin-bottom:16px; }
        .l-feat-items { display:flex; flex-direction:column; gap:6px; }
        .l-feat-item { display:flex; align-items:center; gap:8px; font-size:13px; color:#4a4f72; }
        .l-check { color:#34c98a; font-size:13px; }

        /* ── Pricing ── */
        .l-pricing { display:flex; gap:24px; justify-content:center; flex-wrap:wrap; align-items:flex-start; margin-top:56px; }

        /* ── FAQ ── */
        .l-faq { display:flex; flex-direction:column; gap:0; margin-top:56px; border:1px solid #e8eaf0; border-radius:16px; overflow:hidden; }
        .l-faq-item { border-top:1px solid #e8eaf0; }
        .l-faq-item:first-child { border-top:none; }
        .l-faq-q {
          width:100%; display:flex; align-items:center; justify-content:space-between;
          padding:22px 28px; background:#fff; border:none; cursor:pointer;
          font-size:16px; font-weight:600; color:#0a0f2e; text-align:left;
          transition:background .2s;
        }
        .l-faq-q:hover { background:#f8f9fc; }
        .l-faq-icon { font-size:20px; color:#5b7cf6; transition:transform .3s; flex-shrink:0; }
        .l-faq-icon.open { transform:rotate(45deg); }
        .l-faq-a {
          overflow:hidden; transition:max-height .35s ease, padding .35s ease;
          max-height:0; padding:0 28px;
          font-size:15px; color:#4a4f72; line-height:1.7;
        }
        .l-faq-a.open { max-height:300px; padding:0 28px 22px; }

        /* ── CTA section ── */
        .l-cta-section {
          background:linear-gradient(135deg,#0a0f2e 0%,#1a1f50 50%,#0f1435 100%);
          padding:100px 24px; text-align:center;
        }
        .l-cta-section h2 { font-size:clamp(36px,5vw,60px); font-weight:700; color:#fff; letter-spacing:-.025em; line-height:1.1; }
        .l-cta-section p { font-size:17px; color:rgba(255,255,255,.65); margin:18px auto 40px; max-width:480px; line-height:1.6; }
        .l-cta-white {
          display:inline-flex; align-items:center; gap:8px;
          font-size:16px; font-weight:600; color:#0a0f2e;
          background:#fff; border-radius:10px; padding:15px 32px;
          text-decoration:none; transition:transform .2s,box-shadow .2s;
        }
        .l-cta-white:hover { transform:translateY(-2px); box-shadow:0 8px 32px rgba(255,255,255,.25); }
        .l-cta-note { font-size:12px; color:rgba(255,255,255,.4); margin-top:20px; }

        /* ── Footer ── */
        .l-footer { background:#f8f9fc; border-top:1px solid #e8eaf0; padding:60px 24px 40px; }
        .l-footer-inner { max-width:1140px; margin:0 auto; display:flex; flex-wrap:wrap; gap:40px; justify-content:space-between; align-items:flex-start; }
        .l-footer-logo { font-size:20px; font-weight:700; color:#0a0f2e; display:flex; align-items:center; gap:8px; }
        .l-footer-logo span { background:linear-gradient(135deg,#5b7cf6,#9b8ef8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
        .l-footer-desc { font-size:13px; color:#8890b0; max-width:260px; margin-top:10px; line-height:1.6; }
        .l-footer-links { display:flex; gap:32px; flex-wrap:wrap; }
        .l-footer-col h4 { font-size:12px; font-weight:700; color:#0a0f2e; text-transform:uppercase; letter-spacing:.08em; margin-bottom:14px; }
        .l-footer-col a { display:block; font-size:13px; color:#4a4f72; text-decoration:none; margin-bottom:10px; transition:color .2s; }
        .l-footer-col a:hover { color:#5b7cf6; }
        .l-footer-bottom { max-width:1140px; margin:40px auto 0; padding-top:24px; border-top:1px solid #e8eaf0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; }
        .l-footer-copy { font-size:12px; color:#8890b0; }

        /* ── Keyframes ── */
        @keyframes fadeUp    { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
        @keyframes fadeRight { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:none} }
        @keyframes floatY    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes slideCardIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        @keyframes shimmer { 0%{opacity:.6} 50%{opacity:1} 100%{opacity:.6} }
        @keyframes pulseDot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.3);opacity:.7} }

        /* ── Responsive ── */
        @media(max-width:860px){
          .l-hero { flex-direction:column; padding:100px 20px 60px; gap:40px; }
          .l-hero-right { width:100%; }
          .l-steps { grid-template-columns:1fr; }
          .l-step-connector { display:none; }
          .l-ba { grid-template-columns:1fr; }
          .l-ba-col.before { display:none; }
          .l-features { grid-template-columns:1fr; }
          .l-nav-links .l-nav-link { display:none; }
          .l-float-card { display:none; }
          .l-stats { grid-template-columns:repeat(2,1fr); }
        }
      `}</style>

      <div className="landing">

        {/* ── NAV ── */}
        <nav className={`l-nav ${navScrolled ? 'scrolled' : ''}`}>
          <div className="l-nav-inner">
            <a href="/" className="l-nav-logo">
              ✦ <span>Candidly</span>
            </a>
            <div className="l-nav-links">
              <a href="#how" className="l-nav-link">Fonctionnalités</a>
              <a href="#pricing" className="l-nav-link">Tarifs</a>
              <Link href="/login" className="l-btn-ghost">Se connecter</Link>
              <Link href="/register" className="l-btn-dark">Essai gratuit →</Link>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <div className="l-hero">
          {/* Left */}
          <div className="l-hero-left">
            <div className="l-badge">🇫🇷 Conçu pour les étudiants français</div>
            <h1 className="l-h1">
              Finis de perdre<br />le fil de tes<br /><em>candidatures</em>
            </h1>
            <p className="l-hero-sub">
              Candidly centralise toutes tes candidatures, ton réseau et tes entretiens.
              Import d&apos;offres par URL, emails IA, calendrier — tout en un.
            </p>
            <div className="l-hero-cta">
              <Link href="/register" className="l-cta-primary">
                Commencer gratuitement →
              </Link>
              <a href="#how" className="l-cta-secondary">
                Comment ça marche
              </a>
            </div>
            <p className="l-hero-note">Gratuit jusqu&apos;à 10 candidatures · Aucune carte de crédit requise</p>
          </div>

          {/* Right — Dashboard preview */}
          <div className="l-hero-right">
            <div className="l-preview-wrap">
              {/* Floating accent cards */}
              <div className="l-float-card f2" style={{ minWidth: 180 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#3b6d11', marginBottom: 4 }}>🎉 Acceptée !</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#0a0f2e' }}>Airbus — Stage IA</div>
                <div style={{ fontSize: 11, color: '#8890b0' }}>Décision reçue aujourd&apos;hui</div>
              </div>
              <div className="l-float-card f1" style={{ minWidth: 200 }}>
                <div style={{ fontSize: 11, color: '#5b7cf6', fontWeight: 700, marginBottom: 4 }}>🔔 Rappel dans 2j</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#0a0f2e' }}>Relancer BNP Paribas</div>
                <div style={{ fontSize: 11, color: '#8890b0' }}>Alternance Finance · 5 juin</div>
              </div>

              {/* Browser window */}
              <div className="l-browser">
                <div className="l-browser-bar">
                  <div className="l-dot" style={{ background: '#f25f5c' }} />
                  <div className="l-dot" style={{ background: '#f5a623' }} />
                  <div className="l-dot" style={{ background: '#34c98a' }} />
                  <div className="l-browser-url">candidlyapp.fr/dashboard</div>
                </div>
                <div className="l-browser-body">
                  {/* App nav */}
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

                  {/* Stats */}
                  <div className="l-stats">
                    {[
                      { val: '24', lbl: 'Total' },
                      { val: '12', lbl: 'En cours' },
                      { val: '5', lbl: 'Entretiens' },
                      { val: '8%', lbl: 'Succès' },
                    ].map(s => (
                      <div key={s.lbl} className="l-stat-card">
                        <div className="l-stat-val">{s.val}</div>
                        <div className="l-stat-lbl">{s.lbl}</div>
                      </div>
                    ))}
                  </div>

                  {/* Candidatures */}
                  <div className="l-cand">
                    {[
                      { logo: '#5b7cf6', initials: 'AB', name: 'Airbus', role: 'Stage Ingénieur IA', pill: 'interview', label: 'Entretien', delay: 0 },
                      { logo: '#f5a623', initials: 'DC', name: 'Decathlon', role: 'Stage Marketing Digital', pill: 'followup', label: 'Relance', delay: 1 },
                      { logo: '#0a0f2e', initials: 'BN', name: 'BNP Paribas', role: 'Alternance Finance', pill: 'sent', label: 'Envoyé', delay: 2 },
                    ].map((c, i) => (
                      <div
                        key={c.name}
                        className={`l-cand-row ${cardStep > c.delay ? 'appear' : ''}`}
                        style={{ animationDelay: `${c.delay * 0.15}s`, opacity: cardStep > c.delay ? 1 : 0.3 }}
                      >
                        <div className="l-cand-logo" style={{ background: c.logo }}>{c.initials}</div>
                        <div className="l-cand-info">
                          <div className="l-cand-name">{c.name}</div>
                          <div className="l-cand-role">{c.role}</div>
                        </div>
                        <div className={`l-pill ${c.pill}`}>{c.label}</div>
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
        <div style={{ borderTop: '1px solid #e8eaf0', borderBottom: '1px solid #e8eaf0', padding: '24px 24px' }}>
          <div style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontSize: 13, color: '#8890b0', fontWeight: 500 }}>Utilisé par des étudiants de</span>
            {['HEC Paris', 'Sciences Po', 'ESCP', 'Dauphine', 'CentraleSupélec', 'ESSEC'].map(s => (
              <span key={s} style={{ fontSize: 13, fontWeight: 600, color: '#4a4f72', opacity: .7 }}>{s}</span>
            ))}
          </div>
        </div>

        {/* ── HOW IT WORKS ── */}
        <div id="how" className="l-section">
          <div className="l-eyebrow l-up">Comment ça marche</div>
          <h2 className="l-h2 l-up l-delay-1">De l&apos;offre à l&apos;acceptation<br />en un seul endroit</h2>
          <p className="l-sub l-up l-delay-2">Candidly s&apos;adapte à ton workflow — pas l&apos;inverse.</p>

          <div className="l-steps">
            {[
              { num: '1', icon: '🔗', title: 'Importe ou ajoute une offre', desc: 'Colle le lien d\'une offre LinkedIn, Indeed ou autre. L\'IA extrait automatiquement l\'entreprise, le poste et le lieu. Ou ajoute manuellement en 30 secondes.' },
              { num: '2', icon: '📊', title: 'Suis l\'avancement en temps réel', desc: 'Envoyé, Relance, Entretien, Accepté — déplace tes candidatures au fil de l\'eau. Rappels automatiques par email avant chaque date clé.' },
              { num: '3', icon: '🤝', title: 'Développe ton réseau avec l\'IA', desc: 'Centralise tes contacts LinkedIn, analyse ton profil, compose des emails personnalisés avec 5 templates IA. Networking sans effort.' },
            ].map((s, i) => (
              <div key={s.num} className={`l-step l-up l-delay-${i + 2}`}>
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
            <div className="l-eyebrow l-up">Avant vs Après</div>
            <h2 className="l-h2 l-up l-delay-1">La différence Candidly</h2>

            <div className="l-ba l-fade l-delay-2">
              <div className="l-ba-col">
                <div className="l-ba-header before">❌ Avant Candidly</div>
                {BEFORE.map((item, i) => (
                  <div key={i} className="l-ba-item before">
                    <span className="l-ba-icon">✗</span>
                    {item}
                  </div>
                ))}
              </div>
              <div className="l-ba-col">
                <div className="l-ba-header after">✅ Avec Candidly</div>
                {AFTER.map((item, i) => (
                  <div key={i} className="l-ba-item after">
                    <span className="l-ba-icon">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── AI FEATURES ── */}
        <div className="l-section">
          <div className="l-eyebrow l-up">Intelligence artificielle</div>
          <h2 className="l-h2 l-up l-delay-1">L&apos;IA qui bouste<br />chaque candidature</h2>
          <p className="l-sub l-up l-delay-2">1 essai gratuit pour chaque outil. Illimité avec Pro.</p>

          <div className="l-features">
            {[
              {
                icon: '📄', title: 'Analyse de CV',
                desc: 'Uploade ton CV en PDF. Score sur 10, points forts, faiblesses et suggestions concrètes en 5 secondes.',
                items: ['Score global sur 10', 'Points forts identifiés', 'Suggestions d\'amélioration'],
                delay: 2,
              },
              {
                icon: '✍️', title: 'Lettre de motivation',
                desc: 'Sélectionne une candidature, colle l\'offre. L\'IA génère une lettre personnalisée et professionnelle instantanément.',
                items: ['Personnalisée pour chaque offre', 'Ton professionnel', 'Prête à envoyer'],
                delay: 3,
              },
              {
                icon: '🔗', title: 'Import d\'offre par URL',
                desc: 'Colle le lien d\'une offre et le formulaire se remplit tout seul. Compatible tous les job boards.',
                items: ['LinkedIn, Indeed, WTTJ...', 'Entreprise & poste extraits', 'Gain de temps immédiat'],
                delay: 2,
              },
              {
                icon: '✉️', title: 'Email networking IA',
                desc: '5 templates × 4 tons. Candidature, demande de meeting, relance — personnalisés pour ton contact.',
                items: ['5 types d\'emails', '4 niveaux de ton', 'Envoi depuis Candidly'],
                delay: 3,
              },
            ].map((f, i) => (
              <div key={f.title} className={`l-feat l-up l-delay-${f.delay}`}>
                <div className="l-feat-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <div className="l-feat-items">
                  {f.items.map(item => (
                    <div key={item} className="l-feat-item">
                      <span className="l-check">✓</span> {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PRICING ── */}
        <div id="pricing" className="l-section-bg">
          <div className="l-section-sm" style={{ textAlign: 'center' }}>
            <div className="l-eyebrow l-up" style={{ justifyContent: 'center', display: 'flex' }}>Tarifs</div>
            <h2 className="l-h2 l-up l-delay-1">Simple et transparent</h2>
            <p className="l-sub l-up l-delay-2" style={{ margin: '16px auto 0', textAlign: 'center' }}>
              Commence gratuitement, passe Pro quand tu es prêt.
            </p>
            <div className="l-pricing l-fade l-delay-3">
              <PricingCard plan="gratuit" onChoose={() => {}} />
              <PricingCard plan="pro" onChoose={() => {}} />
            </div>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="l-section">
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div className="l-eyebrow l-up" style={{ textAlign: 'center' }}>FAQ</div>
            <h2 className="l-h2 l-up l-delay-1" style={{ textAlign: 'center' }}>Questions fréquentes</h2>

            <div className="l-faq l-fade l-delay-2">
              {FAQ.map((item, i) => (
                <div key={i} className="l-faq-item">
                  <button className="l-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    {item.q}
                    <span className={`l-faq-icon ${openFaq === i ? 'open' : ''}`}>+</span>
                  </button>
                  <div className={`l-faq-a ${openFaq === i ? 'open' : ''}`}>
                    {item.a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA SECTION ── */}
        <div className="l-cta-section">
          <h2 className="l-up">Prêt à postuler<br />avec méthode ?</h2>
          <p className="l-up l-delay-1">Rejoins les étudiants qui suivent leurs candidatures avec Candidly. Gratuit, sans engagement.</p>
          <div className="l-up l-delay-2">
            <Link href="/register" className="l-cta-white">
              Commencer gratuitement →
            </Link>
          </div>
          <p className="l-cta-note l-up l-delay-3">Gratuit jusqu&apos;à 10 candidatures · Essai Pro 7 jours</p>
        </div>

        {/* ── FOOTER ── */}
        <footer className="l-footer">
          <div className="l-footer-inner">
            <div>
              <div className="l-footer-logo">✦ <span>Candidly</span></div>
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
