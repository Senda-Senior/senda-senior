/**
 * (app)/layout.tsx
 * Shell autenticado compartilhado — um AppShell por sessão de navegação.
 *
 * Conecta: getAppShellUser | AppShell | pages protegidas do grupo (app)
 * Camada: server (RSC)
 */

import type { ReactNode } from 'react'
import { getAppShellUser } from '@/features/dashboard/shell'
import { AppShell } from '@/features/dashboard/components/AppShell'

export const dynamic = 'force-dynamic'

export default async function AppGroupLayout({ children }: { children: ReactNode }) {
  const shell = await getAppShellUser()

  return (
    <AppShell
      firstName={shell.firstName}
      displayName={shell.displayName}
      avatarUrl={shell.avatarUrl}
      showEquipeNav={shell.showEquipeNav}
    >
      {children}
    </AppShell>
  )
}
