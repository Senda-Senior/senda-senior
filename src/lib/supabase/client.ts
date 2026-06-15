/**
 * client.ts
 * Supabase client para browser — createBrowserClient com env vars públicas, RLS respeitado
 *
 * Conecta: importa @supabase/ssr, env | importado em client components
 * Camada: browser (use client)
 */

import { createBrowserClient } from '@supabase/ssr'
import { env } from '@/config/env'
import type { Database } from './types'

/**
 * Supabase client para o BROWSER.
 *
 * Use apenas em Client Components ('use client'). Para Server Components,
 * Route Handlers ou Server Actions, importe de `./server`.
 */
export function createClient() {
  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
}
