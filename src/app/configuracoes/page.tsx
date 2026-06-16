/**
 * configuracoes/page.tsx
 * Configurações da conta — RSC protegido (requireUser) + Conta & Segurança.
 *
 * Conecta: requireUser, getProfile (lib/server) | ConfiguracoesView (features/configuracoes) | AppShell
 * Camada: server (RSC com force-dynamic)
 */

import { requireUser, getProfile } from '@/lib/server'
import { ConfiguracoesView } from '@/features/configuracoes'
import { AppShell } from '@/features/dashboard/components/AppShell'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Configurações | Senda Sênior',
}

export default async function ConfiguracoesPage() {
  const user = await requireUser()
  const profile = await getProfile(user)

  const displayName = profile.displayName ?? user.email?.split('@')[0] ?? 'Usuário'
  const firstName = displayName.split(' ')[0] || 'Usuário'

  return (
    <AppShell
      firstName={firstName}
      displayName={displayName}
      pageTitle="Configurações"
      pageSubtitle="Gerencie sua conta e segurança."
    >
      <ConfiguracoesView
        initialDisplayName={displayName}
        email={user.email ?? ''}
      />
    </AppShell>
  )
}
