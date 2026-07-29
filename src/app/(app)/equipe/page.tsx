/**
 * equipe/page.tsx
 * Preview — painel da assessoria (lista de clientes). Acesso restrito.
 *
 * Conecta: getAppShellUser | assertAssessoriaAccess | EquipePainelView | (app)/layout
 * Camada: server (RSC)
 */

import { assertAssessoriaAccess } from '@/features/assessoria/access'
import { EquipePainelView } from '@/features/assessoria'
import { getAppShellUser } from '@/features/dashboard/shell'

export const metadata = {
  title: 'Visão assessora | Senda Sênior',
}

export default async function EquipePage() {
  const shell = await getAppShellUser()
  await assertAssessoriaAccess(shell.user)

  return <EquipePainelView ownerUserId={shell.user.id} />
}
