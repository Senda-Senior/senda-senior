/**
 * shell.ts
 * Props comuns do AppShell a partir da sessão — evita repetir profile + flags em cada page.
 *
 * Conecta: requireUser, getProfile | canAccessAssessoria | pages autenticadas
 * Camada: server (server-only)
 */

import 'server-only'
import { cache } from 'react'
import type { User } from '@supabase/supabase-js'
import { requireUser, getProfile } from '@/lib/server'
import { canAccessAssessoria } from '@/features/assessoria/access'

export type AppShellUser = {
  firstName: string
  displayName: string
  avatarUrl: string | null
  showEquipeNav: boolean
  email: string
  user: User
}

/** Dedup por request — layout + page compartilham o mesmo resultado. */
export const getAppShellUser = cache(async (): Promise<AppShellUser> => {
  const user = await requireUser()
  const profile = await getProfile(user)

  const displayName = profile.displayName ?? user.email?.split('@')[0] ?? 'Usuário'
  const firstName = displayName.split(' ')[0] || 'Usuário'

  return {
    firstName,
    displayName,
    avatarUrl: profile.avatarUrl,
    showEquipeNav: await canAccessAssessoria(user),
    email: user.email ?? '',
    user,
  }
})
