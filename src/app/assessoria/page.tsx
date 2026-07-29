/**
 * assessoria/page.tsx
 * Acompanhamento com a assessoria — RSC protegido.
 *
 * Conecta: getAppShellUser | AssessoriaView | AppShell
 * Camada: server (RSC com force-dynamic)
 */

import { AssessoriaView } from '@/features/assessoria'
import { getAppShellUser } from '@/features/dashboard/shell'
import { AppShell } from '@/features/dashboard/components/AppShell'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Assessoria | Senda Sênior',
}

export default async function AssessoriaPage() {
  const shell = await getAppShellUser()

  return (
    <AppShell
      firstName={shell.firstName}
      displayName={shell.displayName}
      avatarUrl={shell.avatarUrl}
      showEquipeNav={shell.showEquipeNav}
      pageTitle="Assessoria"
      pageSubtitle="Quem acompanha o seu processo."
    >
      <AssessoriaView showEquipeLink={shell.showEquipeNav} />
    </AppShell>
  )
}
