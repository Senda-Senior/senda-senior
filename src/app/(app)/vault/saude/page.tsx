/**
 * vault/saude/page.tsx
 * Cofre filtrado na categoria saúde.
 *
 * Conecta: getAppShellUser | VaultView | (app)/layout
 * Camada: server (RSC)
 */

import { Suspense } from 'react'
import { getAppShellUser } from '@/features/dashboard/shell'
import { getCategories, getQuota, listFiles, VaultView } from '@/features/vault'
import VaultLoading from '../loading'

export const metadata = {
  title: 'Histórico de Saúde | Senda Sênior',
}

export default async function VaultSaudePage() {
  const shell = await getAppShellUser()
  const user = shell.user

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
        displayName={shell.displayName}
        initialCategorySlug="saude"
      />
    </Suspense>
  )
}
