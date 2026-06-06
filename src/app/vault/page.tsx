import { requireUser, getProfile } from '@/lib/server'
import {
  getCategories,
  getQuota,
  listFiles,
  VaultView,
} from '@/features/vault'

export const dynamic = 'force-dynamic'

export default async function VaultPage() {
  const user = await requireUser()
  const profile = await getProfile(user)

  const [quota, categories, activeList, trashedList] = await Promise.all([
    getQuota(user.id),
    getCategories(user.id),
    listFiles(user.id, { pageSize: 200 }),
    listFiles(user.id, { pageSize: 200, trashed: true }),
  ])

  return (
    <VaultView
      quota={quota}
      categories={categories}
      files={activeList.items}
      trashedFiles={trashedList.items}
      userEmail={user.email ?? ''}
      displayName={profile.displayName ?? ''}
    />
  )
}
