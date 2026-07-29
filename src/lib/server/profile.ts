/**
 * profile.ts
 * Helpers de profile do usuário — getProfile(), updateDisplayName(), updateAvatarUrl()
 *
 * Conecta: importa createServerClient, User | importado em server actions
 * Camada: server (server-only)
 */

import 'server-only'
import type { User } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'

/**
 * ─── Profile do usuário (servidor) ────────────────────────────────
 *
 * Lê `display_name`, `care_role` e `avatar_url` do profile associado ao `user.id`.
 * RLS garante que o próprio usuário só vê seu próprio profile.
 *
 * Nunca invente um nome a partir do email — se o profile não tem
 * `display_name`, devolva `null` e deixe a UI decidir o fallback.
 * ───────────────────────────────────────────────────────────────────
 */

export interface UserProfile {
  displayName: string | null
  careRole: 'self' | 'caregiver' | null
  avatarUrl: string | null
}

export async function getProfile(user: User): Promise<UserProfile> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('display_name, care_role, avatar_url')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error || !data) {
    return { displayName: null, careRole: null, avatarUrl: null }
  }

  return {
    displayName: typeof data.display_name === 'string' && data.display_name.trim().length > 0
      ? data.display_name.trim()
      : null,
    careRole: data.care_role ?? null,
    avatarUrl: typeof data.avatar_url === 'string' && data.avatar_url.trim().length > 0
      ? data.avatar_url.trim()
      : null,
  }
}

/**
 * Atualiza a URL pública da foto de perfil. Server-only.
 */
export async function updateAvatarUrl(
  user: User,
  avatarUrl: string | null,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: avatarUrl })
    .eq('user_id', user.id)

  if (error) {
    return { ok: false, error: error.message }
  }
  return { ok: true }
}

/**
 * Atualiza o `display_name` do usuário atual. Server-only.
 * Útil para fluxos de "definir nome" pós-cadastro.
 */
export async function updateDisplayName(
  user: User,
  displayName: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const trimmed = displayName.trim()
  if (trimmed.length === 0 || trimmed.length > 255) {
    return { ok: false, error: 'Nome inválido.' }
  }
  const supabase = await createServerClient()
  const { error } = await supabase
    .from('profiles')
    .update({ display_name: trimmed })
    .eq('user_id', user.id)

  if (error) {
    return { ok: false, error: error.message }
  }
  return { ok: true }
}
