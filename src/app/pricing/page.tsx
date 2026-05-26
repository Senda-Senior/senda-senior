import { AppPageCard, AppPageContainer, AppPageHeader, AppPageShell, Button } from '@/design'
import { requireUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export default async function PricingPage() {
  await requireUser()

  return (
    <AppPageShell>
      <AppPageContainer width="wide">
        <AppPageHeader
          title="Planos e Preços"
        />

        <AppPageCard
          title="Escolha o plano ideal para suas necessidades"
          description="Esta página está em construção. Aqui você poderá visualizar nossos planos de assinatura e comparar os recursos disponíveis."
        >
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-[16px] border border-terracotta-light/50 bg-white/70 p-6">
              <h3 className="mb-3 font-serif text-[clamp(20px,2.5vw,24px)] font-semibold text-terracotta">
                Gratuito
              </h3>
              <p className="mb-4 text-base leading-[1.6] text-terracotta-light/80">
                Ideal para quem está começando a organizar documentos essenciais
              </p>
              <ul className="mb-6 space-y-2 text-sm leading-[1.6] text-terracotta-light/80">
                <li>Até 1GB de armazenamento</li>
                <li>Classificação automática de documentos</li>
                <li>Acesso básico ao manual prevent care</li>
                <li>Suporte por email</li>
              </ul>
              <Button variant="secondary" size="sm" className="w-full">
                Começar Grátis
              </Button>
            </div>

            <div className="rounded-[16px] border border-terracotta-light/50 bg-white/70 p-6">
              <h3 className="mb-3 font-serif text-[clamp(20px,2.5vw,24px)] font-semibold text-terracotta">
                Premium
              </h3>
              <p className="mb-4 text-base leading-[1.6] text-terracotta-light/80">
                Para famílias que precisam de organização completa e avançada
              </p>
              <ul className="mb-6 space-y-2 text-sm leading-[1.6] text-terracotta-light/80">
                <li>Até 10GB de armazenamento</li>
                <li>Classificação avançada com IA</li>
                <li>Acesso completo ao manual prevent care</li>
                <li>Checklist de cuidados personalizado</li>
                <li>Suporte prioritário</li>
                <li>Compartilhamento seguro com familiares</li>
              </ul>
              <Button variant="primary" size="sm" className="w-full">
                Assinar Premium
              </Button>
            </div>

            <div className="rounded-[16px] border border-terracotta-light/50 bg-white/70 p-6">
              <h3 className="mb-3 font-serif text-[clamp(20px,2.5vw,24px)] font-semibold text-terracotta">
                Enterprise
              </h3>
              <p className="mb-4 text-base leading-[1.6] text-terracotta-light/80">
                Para profissionais e instituições que atendem múltiplas famílias
              </p>
              <ul className="mb-6 space-y-2 text-sm leading-[1.6] text-terracotta-light/80">
                <li>Armazenamento ilimitado</li>
                <li>Gestão de múltiplos usuários e famílias</li>
                <li>Relatórios e analytics avançados</li>
                <li>Integração com sistemas existentes</li>
                <li>Suporte dedicado 24/7</li>
                <li>Treinamento e implementação personalizada</li>
              </ul>
              <Button variant="secondary" size="sm" className="w-full">
                Solicitar Demonstração
              </Button>
            </div>
          </div>

          <div className="pt-4 text-center">
            <p className="text-base leading-[1.7] text-terracotta-light/80">
              Todos os planos incluem atualizações regulares e novos recursos conforme lançados.
            </p>
          </div>
        </AppPageCard>
      </AppPageContainer>
    </AppPageShell>
  )
}
