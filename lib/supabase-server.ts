// ─────────────────────────────────────────────────────────────
// supabase-server.ts — fonctions SERVER ONLY (Server Components + API Routes)
// NE PAS importer ce fichier dans des composants 'use client' !
// ─────────────────────────────────────────────────────────────

import { createServerClient as createSSRServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'   // ← server-only

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client serveur — pour les Server Components, les layout.tsx et les API routes.
// Next.js 15 : cookies() est une Promise, donc la fonction est async.
export async function createServerClient() {
  const cookieStore = await cookies()

  return createSSRServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Appelé depuis un Server Component (lecture seule) — on ignore
        }
      },
    },
  })
}
