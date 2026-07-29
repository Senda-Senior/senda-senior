/**
 * env.server.ts
 * Variáveis de ambiente server-only (service role, rate-limit, webhooks) — importa server-only para bloquear vazamento
 *
 * Conecta: importa env.ts | importado apenas em server actions/route handlers
 * Camada: server (server-only, build falha se usado no client)
 */

import 'server-only'
import { z } from 'zod'
import { env as clientEnv } from './env'

/**
 * ─── Variáveis server-only ─────────────────────────────────────────
 *
 * Este módulo importa `server-only`, então qualquer tentativa de
 * consumi-lo a partir de um Client Component quebra o build.
 *
 * Use-o para chaves sensíveis (service role, rate-limit, webhooks).
 * ───────────────────────────────────────────────────────────────────
 */

const serverSchema = z.object({
  // ─── Supabase ───
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  // ─── Rate limit (Upstash Redis) ───
  // Se ambas estiverem presentes, proxy usa rate-limit distribuído.
  // Se ausentes, cai no fallback in-memory (não sobrevive a múltiplas
  // instâncias serverless; ok para dev e preview).
  UPSTASH_REDIS_REST_URL: z
    .string()
    .url('UPSTASH_REDIS_REST_URL deve ser URL válida.')
    .optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
  E2E_DISABLE_RATE_LIMIT: z.enum(['true']).optional(),

  // Preview da visão assessora (/equipe). Lista CSV de emails.
  // Vazio + sem OPEN → ninguém acessa (nem em development).
  ASSESSORIA_PREVIEW_EMAILS: z.string().optional(),
  // Só fora de production. Preferir allowlist em qualquer ambiente compartilhado.
  ASSESSORIA_PREVIEW_OPEN: z.enum(['true']).optional(),
})

const serverProcessEnv = {
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  E2E_DISABLE_RATE_LIMIT: process.env.E2E_DISABLE_RATE_LIMIT,
  ASSESSORIA_PREVIEW_EMAILS: process.env.ASSESSORIA_PREVIEW_EMAILS,
  ASSESSORIA_PREVIEW_OPEN: process.env.ASSESSORIA_PREVIEW_OPEN,
}

const parsed = serverSchema.safeParse(serverProcessEnv)

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `  • ${issue.path.join('.')}: ${issue.message}`)
    .join('\n')
  throw new Error(
    `[env.server] Variáveis server-only inválidas:\n${details}`,
  )
}

export const serverEnv = {
  ...clientEnv,
  ...parsed.data,
}
export type ServerEnv = typeof serverEnv
