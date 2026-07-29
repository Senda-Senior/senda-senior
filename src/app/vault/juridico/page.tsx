import { Suspense } from 'react'
import { requireUser, getProfile } from '@/lib/server'
import { canAccessAssessoria } from '@/features/assessoria/access'
import { getCategories, getQuota, listFiles, VaultView } from '@/features/vault'
import { AppShell } from '@/features/dashboard/components/AppShell'
import VaultLoading from '../loading'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Documentos Jurídicos | Senda Sênior',
}

export default async function VaultJuridicoPage() {
  const user = await requireUser()

  // profile junto das demais queries — sem round-trip em série.
  const [profile, quota, categories, activeList, trashedList] = await Promise.all([
    getProfile(user),
    getQuota(user.id),
    getCategories(user.id),
    listFiles(user.id, { pageSize: 200 }),
    listFiles(user.id, { pageSize: 200, trashed: true }),
  ])

  const displayName = profile.displayName ?? user.email?.split('@')[0] ?? 'Usuário'
  const firstName = displayName.split(' ')[0] || 'Usuário'

  return (
    <AppShell
      firstName={firstName}
      displayName={displayName}
      avatarUrl={profile.avatarUrl}
      showEquipeNav={await canAccessAssessoria(user)}
      pageTitle="Documentos e Procurações"
      pageSubtitle="Testamentos, diretrizes antecipadas e procurações organizadas."
    >
      <Suspense fallback={<VaultLoading />}>
        <VaultView
          quota={quota}
          categories={categories}
          files={activeList.items}
          trashedFiles={trashedList.items}
          userEmail={user.email ?? ''}
          displayName={displayName}
          initialCategorySlug="juridico"
        />
      </Suspense>
    </AppShell>
  )
}
