/**
 * dashboard/page.tsx
 * Painel principal do usuário — RSC protegido (requireUser) + checklist de cuidados + perfil
 *
 * Conecta: requireUser, getProfile (lib/server) | getChecklist, DashboardView (features/dashboard)
 * Camada: server (RSC com force-dynamic)
 */

import { Suspense } from 'react'
import { requireUser, getProfile } from '@/lib/server'
import { getChecklist, DashboardView } from '@/features/dashboard'
import { AppShell } from '@/features/dashboard/components/AppShell'
import DashboardLoading from './loading'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const user = await requireUser()
  const [checklist, profile] = await Promise.all([
    getChecklist(user.id),
    getProfile(user),
  ])

  const displayName = profile.displayName
    ?? user.email?.split('@')[0]
    ?? 'Usuário'
  const firstName = displayName.split(' ')[0] || 'Usuário'

  return (
    <AppShell
      firstName={firstName}
      displayName={displayName}
      pageTitle="Painel de Cuidado Familiar"
      pageSubtitle="Organize documentos, cuidados e decisões importantes."
    >
      <Suspense fallback={<DashboardLoading />}>
        <DashboardView
          firstName={firstName}
          initialChecklist={checklist}
        />
      </Suspense>
    </AppShell>
  )
}
