import { Suspense } from 'react'
import { requireUser } from '@/lib/server'
import {
  getCategories,
  getQuota,
  listFiles,
  VaultView,
} from '@/features/vault'
import VaultLoading from './loading'

export const dynamic = 'force-dynamic'

export default async function VaultPage() {
  const user = await requireUser()

  const [quota, categories, activeList, trashedList] = await Promise.all([
    getQuota(user.id),
    getCategories(user.id),
    listFiles(user.id, { pageSize: 200 }),
    listFiles(user.id, { pageSize: 200, trashed: true }),
  ])

  return (
    <Suspense fallback={<VaultLoading />}>
      <VaultView
        quota={quota}
        categories={categories}
        files={activeList.items}
        trashedFiles={trashedList.items}
        userEmail={user.email ?? ''}
      />
    </Suspense>
  )
}
