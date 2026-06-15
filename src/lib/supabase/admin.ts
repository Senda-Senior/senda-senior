/**
 * admin.ts
 * Supabase client service-role (BYPASSA RLS) — para webhooks/cron/scripts administrativos
 *
 * Conecta: importa @supabase/supabase-js, env.server | ainda não configurado
 * Camada: server (server-only, admin-only)
 */

import 'server-only'

/**
 * Supabase client com service-role (BYPASSA RLS).
 *
 * ⚠️  Usar apenas em contextos estritamente server-side e auditados:
 *     webhooks, cron jobs, scripts administrativos.
 *
 * Hoje ainda não temos a chave service-role configurada. Para habilitar:
 *   1. Adicione `SUPABASE_SERVICE_ROLE_KEY` em `.env.local`.
 *   2. Descomente a entrada em `src/config/env.server.ts`.
 *   3. Descomente a implementação abaixo.
 */
export function createAdminClient(): never {
  throw new Error(
    '[supabase/admin] SUPABASE_SERVICE_ROLE_KEY ainda não configurada. ' +
      'Consulte src/config/env.server.ts e src/lib/supabase/admin.ts.',
  )
}

// ── Implementação quando a chave estiver disponível ──
//
// import { createClient as createSupabaseClient } from '@supabase/supabase-js'
// import { serverEnv } from '@/config/env.server'
// import type { Database } from './types'
//
// export function createAdminClient() {
//   return createSupabaseClient<Database>(
//     serverEnv.NEXT_PUBLIC_SUPABASE_URL,
//     serverEnv.SUPABASE_SERVICE_ROLE_KEY,
//     { auth: { persistSession: false, autoRefreshToken: false } },
//   )
// }
