/**
 * dashboard/page.tsx
 * Painel principal do usuário — RSC protegido + checklist.
 *
 * Conecta: getAppShellUser | getChecklist | DashboardView | (app)/layout
 * Camada: server (RSC com force-dynamic)
 */

import { Suspense } from 'react'
import { getChecklist, DashboardView } from '@/features/dashboard'
import { getAppShellUser } from '@/features/dashboard/shell'
import DashboardLoading from './loading'

export default async function DashboardPage() {
  const shell = await getAppShellUser()
  const checklist = await getChecklist(shell.user.id)

  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardView
        firstName={shell.firstName}
        ownerUserId={shell.user.id}
        initialChecklist={checklist}
      />
    </Suspense>
  )
}
