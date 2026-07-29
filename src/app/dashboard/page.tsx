/**
 * dashboard/page.tsx
 * Painel principal do usuário — RSC protegido + checklist + shell.
 *
 * Conecta: getAppShellUser | getChecklist | DashboardView | AppShell
 * Camada: server (RSC com force-dynamic)
 */

import { Suspense } from 'react'
import { getChecklist, DashboardView } from '@/features/dashboard'
import { getAppShellUser } from '@/features/dashboard/shell'
import { AppShell } from '@/features/dashboard/components/AppShell'
import DashboardLoading from './loading'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const shell = await getAppShellUser()
  const checklist = await getChecklist(shell.user.id)

  return (
    <AppShell
      firstName={shell.firstName}
      displayName={shell.displayName}
      avatarUrl={shell.avatarUrl}
      showEquipeNav={shell.showEquipeNav}
      pageTitle="Painel"
      pageSubtitle="Colabore com sua assessoria para concluir seu processo."
    >
      <Suspense fallback={<DashboardLoading />}>
        <DashboardView
          firstName={shell.firstName}
          ownerUserId={shell.user.id}
          initialChecklist={checklist}
        />
      </Suspense>
    </AppShell>
  )
}
