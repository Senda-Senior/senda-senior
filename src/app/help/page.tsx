import { AppPageCard, AppPageContainer, AppPageHeader, AppPageShell } from '@/design'
import { requireUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export default async function HelpPage() {
  await requireUser()

  return (
    <AppPageShell>
      <AppPageContainer>
        <AppPageHeader
          title="Ajuda e Suporte"
        />

        <div className="grid gap-8 md:grid-cols-2">
          <AppPageCard
            title="Perguntas Frequentes"
            description="Esta página está em construção. Aqui você encontrará respostas para as dúvidas mais comuns sobre o uso da Senda Sênior."
          >
            <div className="border-b pb-3">
              <h3 className="mb-2 font-semibold text-terracotta">
                Como faço para começar a usar a plataforma?
              </h3>
              <p className="text-terracotta-light/80">Resposta em construção...</p>
            </div>

            <div className="border-b pb-3">
              <h3 className="mb-2 font-semibold text-terracotta">
                Quais tipos de documentos posso armazenar?
              </h3>
              <p className="text-terracotta-light/80">Resposta em construção...</p>
            </div>

            <div className="border-b pb-3">
              <h3 className="mb-2 font-semibold text-terracotta">Meus dados estão seguros?</h3>
              <p className="text-terracotta-light/80">Resposta em construção...</p>
            </div>
          </AppPageCard>

          <AppPageCard
            title="Fale Conosco"
            description="Esta página está em construção. Aqui você encontrará nossos canais de suporte para ajudar com qualquer dúvida ou problema."
          >
            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[10px] bg-terracotta-light text-xs font-semibold text-white">
                📧
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-terracotta">Email de Suporte</h3>
                <p className="text-terracotta-light/80">suporte@sendasenior.com.br</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[10px] bg-terracotta-light text-xs font-semibold text-white">
                📞
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-terracotta">Telefone</h3>
                <p className="text-terracotta-light/80">+55 (11) 99999-9999</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[10px] bg-terracotta-light text-xs font-semibold text-white">
                💬
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-terracotta">Chat Online</h3>
                <p className="text-terracotta-light/80">Disponível em horário comercial</p>
              </div>
            </div>
          </AppPageCard>
        </div>
      </AppPageContainer>
    </AppPageShell>
  )
}
