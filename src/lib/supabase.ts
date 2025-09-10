import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

// Fonction pour créer le client Supabase avec gestion des erreurs
function createSupabaseClient(url: string, key: string) {
  if (!url || !key) {
    console.warn('Variables Supabase non définies, utilisation de valeurs par défaut')
    return createClient(
      'https://placeholder.supabase.co',
      'placeholder-key'
    )
  }
  return createClient(url, key)
}

export const supabase = createSupabaseClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Client avec service role pour les opérations côté serveur
export const supabaseAdmin = createSupabaseClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
)
