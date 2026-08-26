'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') {
      setIsDark(true)
    } else if (saved === 'light') {
      setIsDark(false)
    } else {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  }, [])

  const toggle = () => {
    const next = !isDark
    setIsDark(next)
    const html = document.documentElement
    html.setAttribute('data-theme', next ? 'dark' : 'light')
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  if (!mounted) return null

  return (
    <button
      onClick={toggle}
      title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        border: '1px solid var(--glass-border)',
        background: 'var(--btn-secondary-bg)',
        cursor: 'pointer',
        fontSize: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
        backdropFilter: 'blur(8px)',
        flexShrink: 0,
      }}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
