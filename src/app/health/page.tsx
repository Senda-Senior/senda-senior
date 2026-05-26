import { AppPageCard, AppPageContainer, AppPageHeader, AppPageShell, Button } from '@/design'
import { requireUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export default async function HealthPage() {
  await requireUser()

  return (
    <AppPageShell>
      <AppPageContainer>
        <AppPageHeader
          title="Saúde"
        />

        <AppPageCard
          title="Organize seus documentos de saúde"
          description="Esta página está em construção. Aqui você poderá armazenar e organizar documentos como:"
        >
          <div className="space-y-3 pl-5">
            <p>• Laudos e exames médicos</p>
            <p>• Receitas e comprovantes de medicamentos</p>
            <p>• Histórico de internações e cirurgias</p>
            <p>• Planos de saúde e cartões de convênio</p>
            <p>• Documentos de plano de cuidados e directives antecipadas</p>
          </div>
          <Button variant="primary" size="md" className="w-full max-w-xs">
            Adicionar Documento de Saúde
          </Button>
        </AppPageCard>
      </AppPageContainer>
    </AppPageShell>
  )
}
