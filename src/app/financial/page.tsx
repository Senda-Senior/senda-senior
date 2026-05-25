import { AppPageCard, AppPageContainer, AppPageHeader, AppPageShell, Button } from '@/design'
import { requireUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export default async function FinancialPage() {
  await requireUser()

  return (
    <AppPageShell>
      <AppPageContainer>
        <AppPageHeader
          title="Financeiro"
          description="Organize documentos e informações financeiras importantes. Esta página ainda está em construção."
        />

        <AppPageCard
          title="Organize seus documentos financeiros"
          description="Aqui você poderá armazenar e organizar documentos como:"
          actions={
            <Button variant="primary" size="md" className="w-full max-w-xs">
              Adicionar Documento Financeiro
            </Button>
          }
        >
          <ul className="list-disc space-y-2 pl-5 text-terracotta-light/80">
            <li>Comprovantes de pagamento e recibos</li>
            <li>Extratos bancários e faturas</li>
            <li>Documentos de impostos (IR, guias e declarações)</li>
            <li>Contratos e garantias</li>
            <li>Benefícios, aposentadoria e previdência</li>
          </ul>
        </AppPageCard>
      </AppPageContainer>
    </AppPageShell>
  )
}
