/**
 * assessoria/page.tsx
 * Acompanhamento com a assessoria — RSC protegido.
 *
 * Conecta: getAppShellUser | AssessoriaView | (app)/layout
 * Camada: server (RSC)
 */

import { AssessoriaView } from '@/features/assessoria'
import { getAppShellUser } from '@/features/dashboard/shell'

export const metadata = {
  title: 'Assessoria | Senda Sênior',
}

export default async function AssessoriaPage() {
  const shell = await getAppShellUser()

  return <AssessoriaView showEquipeLink={shell.showEquipeNav} ownerUserId={shell.user.id} />
}
