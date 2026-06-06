import { AppPageCard, AppPageContainer, AppPageHeader, AppPageShell, Button } from '@/design'
import { requireUser, getProfile } from '@/lib/server'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const user = await requireUser()
  const profile = await getProfile(user)

  const displayName = profile.displayName ?? user.email?.split('@')[0] ?? 'Usuário'
  const firstName = displayName.split(' ')[0] || 'Usuário'

  return (
    <AppPageShell>
      <AppPageContainer width="narrow">
        <AppPageHeader
          title="Perfil"
        />

        <AppPageCard
          title={`Olá, ${firstName}!`}
          description="Esta página está em construção. Aqui você poderá visualizar e editar suas informações de perfil."
          actions={
            <Button variant="secondary" size="md" className="w-full sm:w-auto">
              Editar Perfil
            </Button>
          }
        >
          <p>
            <strong>Nome:</strong> {displayName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </AppPageCard>
      </AppPageContainer>
    </AppPageShell>
  )
}
