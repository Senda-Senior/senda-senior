import { LegalPageFrame } from '@/features/legal/components/LegalPageFrame'

export const metadata = {
  title: 'Página em construção | Senda Sênior',
}

export default function UnderConstructionPage() {
  return (
    <LegalPageFrame
      eyebrow="Conteúdo"
      title="Página em construção"
      updatedAt="13 de maio de 2026"
      fallbackHref="/#conteudo"
    >
      <div className="space-y-6">
        <p className="font-sans text-[16px] leading-[1.8] text-[var(--color-ink-sub)]">
          Este conteúdo ainda está em preparação. A estrutura da página já foi reservada para publicar materiais futuros da Senda Sênior com o mesmo cuidado editorial da landing.
        </p>

        <div className="rounded-[22px] bg-[rgba(63,66,44,0.07)] px-5 py-5">
          <p className="font-sans text-[15px] leading-[1.75] text-[var(--color-ink-sub)]">
            Você pode voltar para a landing a qualquer momento pelo botão no topo e continuar exatamente do ponto em que estava, quando houver histórico de navegação disponível.
          </p>
        </div>
      </div>
    </LegalPageFrame>
  )
}
