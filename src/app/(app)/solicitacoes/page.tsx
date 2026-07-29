/**
 * solicitacoes/page.tsx
 * Solicitações da assessoria — RSC protegido.
 *
 * Conecta: getAppShellUser | SolicitacoesView | (app)/layout
 * Camada: server (RSC)
 */

import { SolicitacoesView } from '@/features/assessoria'
import { getAppShellUser } from '@/features/dashboard/shell'

export const metadata = {
  title: 'Solicitações | Senda Sênior',
}

export default async function SolicitacoesPage() {
  const shell = await getAppShellUser()

  return <SolicitacoesView ownerUserId={shell.user.id} />
}
