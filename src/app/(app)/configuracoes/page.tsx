/**
 * configuracoes/page.tsx
 * Configurações da conta — RSC protegido + Conta & Segurança.
 *
 * Conecta: getAppShellUser | ConfiguracoesView | (app)/layout
 * Camada: server (RSC)
 */

import { ConfiguracoesView } from '@/features/configuracoes'
import { getAppShellUser } from '@/features/dashboard/shell'

export const metadata = {
  title: 'Configurações | Senda Sênior',
}

export default async function ConfiguracoesPage() {
  const shell = await getAppShellUser()

  return (
    <ConfiguracoesView
      initialDisplayName={shell.displayName}
      initialAvatarUrl={shell.avatarUrl}
      email={shell.email}
    />
  )
}
