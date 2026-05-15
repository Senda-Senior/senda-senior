import { Suspense } from 'react'
import { requireUser } from '@/lib/server'
import { getChecklist, DashboardView } from '@/features/dashboard'
import DashboardLoading from './loading'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const user = await requireUser()
  const checklist = await getChecklist(user.id)

  const email = user.email ?? ''
  const firstName = email.split('@')[0] || 'Usuário'

  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardView
        userEmail={email}
        firstName={firstName}
        initialChecklist={checklist}
      />
    </Suspense>
  )
}
