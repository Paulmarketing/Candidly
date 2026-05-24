// ─────────────────────────────────────────────────────────────
// supabase.ts — fonctions BROWSER-SAFE (utilisables partout)
// Importer ce fichier dans les composants 'use client' et les pages client.
// ─────────────────────────────────────────────────────────────

import { createBrowserClient as createSSRBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client navigateur — pour les composants React 'use client'
export function createBrowserClient() {
  return createSSRBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

// Client admin — pour les webhooks et cron jobs côté serveur uniquement
// ⚠️  Ne jamais appeler depuis un composant client — le service role key serait exposé !
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  if (!serviceRoleKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY manquant')

  return createClient(SUPABASE_URL, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
