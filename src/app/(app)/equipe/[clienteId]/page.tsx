/**
 * equipe/[clienteId]/page.tsx
 * Preview — processo de um cliente na visão da assessora. Acesso restrito.
 *
 * Conecta: assertAssessoriaAccess | getCliente | EquipeClienteView | ShellPageMeta
 * Camada: server (RSC)
 */

import { notFound } from 'next/navigation'
import { assertAssessoriaAccess } from '@/features/assessoria/access'
import { EquipeClienteView, getCliente } from '@/features/assessoria'
import { getAppShellUser } from '@/features/dashboard/shell'
import { ShellPageMeta } from '@/features/dashboard/components/shellHeader'

export const metadata = {
  title: 'Cliente | Senda Sênior',
}

type Props = {
  params: Promise<{ clienteId: string }>
  searchParams: Promise<{ como?: string }>
}

export default async function EquipeClientePage({ params, searchParams }: Props) {
  const shell = await getAppShellUser()
  await assertAssessoriaAccess(shell.user)

  const { clienteId } = await params
  const { como } = await searchParams

  const cliente = getCliente(clienteId)
  if (!cliente) notFound()

  return (
    <>
      <ShellPageMeta title={cliente.nome} subtitle="Processo do cliente." />
      <EquipeClienteView
        cliente={cliente}
        assessoraId={como === 'julianne' ? 'julianne' : 'luciana'}
        ownerUserId={shell.user.id}
      />
    </>
  )
}
