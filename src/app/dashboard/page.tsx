import { Suspense } from 'react'
import { requireUser, getProfile } from '@/lib/server'
import { getChecklist, DashboardView } from '@/features/dashboard'
import DashboardLoading from './loading'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const user = await requireUser()
  const [checklist, profile] = await Promise.all([
    getChecklist(user.id),
    getProfile(user),
  ])

  // nome real do profile; fallback para parte do email só se profile vazio
  const displayName = profile.displayName
    ?? user.email?.split('@')[0]
    ?? 'Usuário'
  const firstName = displayName.split(' ')[0] || 'Usuário'

  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardView
        userEmail={user.email ?? ''}
        displayName={displayName}
        firstName={firstName}
        initialChecklist={checklist}
      />
    </Suspense>
  )
}
