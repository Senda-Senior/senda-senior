/**
 * equipe/page.tsx
 * Preview — painel da assessoria (lista de clientes). Acesso restrito.
 *
 * Conecta: getAppShellUser | assertAssessoriaAccess | EquipePainelView | AppShell
 * Camada: server (RSC com force-dynamic)
 */

import { assertAssessoriaAccess } from '@/features/assessoria/access'
import { EquipePainelView } from '@/features/assessoria'
import { getAppShellUser } from '@/features/dashboard/shell'
import { AppShell } from '@/features/dashboard/components/AppShell'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Visão assessora | Senda Sênior',
}

export default async function EquipePage() {
  const shell = await getAppShellUser()
  await assertAssessoriaAccess(shell.user)

  return (
    <AppShell
      firstName={shell.firstName}
      displayName={shell.displayName}
      avatarUrl={shell.avatarUrl}
      showEquipeNav={shell.showEquipeNav}
      pageTitle="Visão assessora"
      pageSubtitle="Lista de clientes."
    >
      <EquipePainelView ownerUserId={shell.user.id} />
    </AppShell>
  )
}
