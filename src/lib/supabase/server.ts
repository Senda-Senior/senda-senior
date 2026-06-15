/**
 * server.ts
 * Supabase client server-only para RSC/Route Handlers/Server Actions — createServerClient com cookies da request
 *
 * Conecta: importa @supabase/ssr, env, cookies (next/headers) | importado em server actions
 * Camada: server (server-only)
 */

import 'server-only'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { env } from '@/config/env'
import type { Database } from './types'

/**
 * Supabase client para o SERVIDOR (RSC, Route Handlers, Server Actions).
 *
 * Usa a anon key + os cookies da request atual, respeitando RLS como
 * qualquer usuário autenticado. Para operações que precisam burlar RLS
 * (ex.: webhooks administrativos), use `./admin`.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Em Server Components puros, `cookies().set` não é permitido.
            // O proxy.ts já sincroniza a sessão, então ignoramos aqui.
          }
        },
      },
    },
  )
}
