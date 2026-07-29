/**
 * solicitacoes/page.tsx
 * Solicitações da assessoria — RSC protegido.
 *
 * Conecta: getAppShellUser | SolicitacoesView | AppShell
 * Camada: server (RSC com force-dynamic)
 */

import { SolicitacoesView } from '@/features/assessoria'
import { getAppShellUser } from '@/features/dashboard/shell'
import { AppShell } from '@/features/dashboard/components/AppShell'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Solicitações | Senda Sênior',
}

export default async function SolicitacoesPage() {
  const shell = await getAppShellUser()

  return (
    <AppShell
      firstName={shell.firstName}
      displayName={shell.displayName}
      avatarUrl={shell.avatarUrl}
      showEquipeNav={shell.showEquipeNav}
      pageTitle="Solicitações"
      pageSubtitle="O que sua assessoria pediu para esta etapa."
    >
      <SolicitacoesView ownerUserId={shell.user.id} />
    </AppShell>
  )
}
