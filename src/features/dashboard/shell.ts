/**
 * shell.ts
 * Props comuns do AppShell a partir da sessão — evita repetir profile + flags em cada page.
 *
 * Conecta: requireUser, getProfile | canAccessAssessoria | pages autenticadas
 * Camada: server (server-only)
 */

import 'server-only'
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

export async function getAppShellUser(existing?: User): Promise<AppShellUser> {
  const user = existing ?? (await requireUser())
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
}
