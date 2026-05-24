import type { Metadata } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}
