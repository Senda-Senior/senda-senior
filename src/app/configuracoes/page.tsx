/**
 * configuracoes/page.tsx
 * Configurações da conta — RSC protegido + Conta & Segurança.
 *
 * Conecta: getAppShellUser | ConfiguracoesView | AppShell
 * Camada: server (RSC com force-dynamic)
 */

import { ConfiguracoesView } from '@/features/configuracoes'
import { getAppShellUser } from '@/features/dashboard/shell'
import { AppShell } from '@/features/dashboard/components/AppShell'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Configurações | Senda Sênior',
}

export default async function ConfiguracoesPage() {
  const shell = await getAppShellUser()

  return (
    <AppShell
      firstName={shell.firstName}
      displayName={shell.displayName}
      avatarUrl={shell.avatarUrl}
      showEquipeNav={shell.showEquipeNav}
      pageTitle="Configurações"
      pageSubtitle="Gerencie sua conta e segurança."
    >
      <ConfiguracoesView
        initialDisplayName={shell.displayName}
        initialAvatarUrl={shell.avatarUrl}
        email={shell.email}
      />
    </AppShell>
  )
}
