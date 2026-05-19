import { AppPageCard, AppPageContainer, AppPageHeader, AppPageShell, Button } from '@/design'
import { requireUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  await requireUser()

  return (
    <AppPageShell>
      <AppPageContainer>
        <AppPageHeader
          title="Configurações"
        />

        <div className="grid gap-8 md:grid-cols-2">
          <AppPageCard
            title="Conta"
            description="Esta página está em construção. Aqui você poderá gerenciar suas preferências de conta."
          >
            <p>
              <strong>Preferências de notificação:</strong> Em construção
            </p>
            <p>
              <strong>Idioma:</strong> Português (Brasil)
            </p>
            <p>
              <strong>Fuso horário:</strong> Horário de Brasília
            </p>
          </AppPageCard>

          <AppPageCard
            title="Segurança"
            description="Esta página está em construção. Aqui você poderá gerenciar sua senha e segurança da conta."
            actions={
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button variant="secondary" size="md" className="w-full sm:w-auto">
                  Alterar Senha
                </Button>
                <Button variant="secondary" size="md" className="w-full sm:w-auto">
                  Configurar Verificação em Duas Etapas
                </Button>
              </div>
            }
          />
        </div>

        <div className="mt-8">
          <Button variant="danger" size="md" className="w-full max-w-xs">
            Excluir Conta
          </Button>
        </div>
      </AppPageContainer>
    </AppPageShell>
  )
}
