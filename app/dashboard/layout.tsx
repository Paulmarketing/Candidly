import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // createServerClient est async en Next.js 15 (cookies() est async)
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  // Si l'utilisateur n'est pas connecté, rediriger vers la connexion
  if (!session) {
    redirect('/login')
  }

  return <>{children}</>
}
