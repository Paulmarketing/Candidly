import type { Metadata } from 'next'
import './globals.css'
import CookieBanner from '@/components/CookieBanner'

export const metadata: Metadata = {
  title: 'Candidly — Suivi de candidatures',
  description: 'Suis tes candidatures stages et emploi facilement. Interface intuitive, rappels automatiques, statistiques en temps réel.',
  keywords: ['candidature', 'stage', 'emploi', 'suivi', 'recherche emploi', 'France'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        {/* Script inline pour appliquer le thème avant le rendu — évite le flash */}
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            var t = localStorage.getItem('theme');
            if (t === 'dark' || t === 'light') {
              document.documentElement.setAttribute('data-theme', t);
            }
          } catch(e) {}
        ` }} />
      </head>
      <body>
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}
