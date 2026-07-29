/**
 * access.ts
 * Controle de acesso à visão assessora (/equipe).
 *
 * Ordem:
 *  1) membership ativa em `advisory_advisors` (migration 0016)
 *  2) email em ASSESSORIA_PREVIEW_EMAILS (fallback / preview)
 *  3) ASSESSORIA_PREVIEW_OPEN=true e NÃO production (só local)
 *
 * Nunca libera “todo autenticado” só porque NODE_ENV=development.
 *
 * Conecta: env.server | shell | pages /equipe
 * Camada: server (server-only)
 */

import 'server-only'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { serverEnv } from '@/config/env.server'
import { createClient as createServerClient } from '@/lib/supabase/server'

function previewAllowlist(): string[] {
  const raw = serverEnv.ASSESSORIA_PREVIEW_EMAILS ?? ''
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.length > 0)
}

/** Fallback sync (env) — preferir `canAccessAssessoria` após 0016. */
export function canAccessAssessoriaPreview(email: string | null | undefined): boolean {
  const list = previewAllowlist()
  if (email && list.includes(email.trim().toLowerCase())) return true

  if (
    serverEnv.ASSESSORIA_PREVIEW_OPEN === 'true' &&
    process.env.NODE_ENV !== 'production'
  ) {
    return true
  }

  return false
}

/** True se o user está na allowlist `advisory_advisors` (active). Dedup por request. */
export const isAdvisoryAdvisor = cache(async (userId: string): Promise<boolean> => {
  try {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('advisory_advisors')
      .select('user_id')
      .eq('user_id', userId)
      .eq('active', true)
      .maybeSingle()

    if (error) return false
    return Boolean(data?.user_id)
  } catch {
    return false
  }
})

const canAccessAssessoriaById = cache(
  async (userId: string, email: string | null | undefined): Promise<boolean> => {
    if (await isAdvisoryAdvisor(userId)) return true
    return canAccessAssessoriaPreview(email)
  },
)

/** Acesso à UI assessora: DB allowlist ou fallback de preview. */
export async function canAccessAssessoria(user: User): Promise<boolean> {
  return canAccessAssessoriaById(user.id, user.email)
}

/** Bloqueia /equipe se o usuário não pode ver a visão assessora. */
export async function assertAssessoriaAccess(user: User): Promise<void> {
  if (await canAccessAssessoria(user)) return
  redirect('/dashboard')
}

/** @deprecated use assertAssessoriaAccess */
export function assertAssessoriaPreview(user: User): void {
  if (canAccessAssessoriaPreview(user.email)) return
  redirect('/dashboard')
}
