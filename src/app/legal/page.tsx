import Link from 'next/link'

import { LegalPageFrame } from '@/features/legal/components/LegalPageFrame'

export const metadata = {
  title: 'Política de Cookies | Senda Sênior',
}

export default function LegalPage() {
  return (
    <LegalPageFrame
      title="Política de Cookies"
      updatedAt="8 de maio de 2026"
    >
      <div className="space-y-8">
        <p className="font-sans text-[16px] leading-[1.8] text-[var(--color-ink-sub)]">
          Utilizamos cookies para aprimorar a experiência de navegação e garantir a segurança das transações realizadas no site e no repositório digital. Esta política explica quais categorias podem ser utilizadas e como você pode gerenciar suas preferências.
        </p>

        <section className="space-y-4">
          <h2 className="font-serif text-[24px] font-semibold text-[var(--color-terracotta-dark)]">
            2.1 Categorias de cookies utilizados
          </h2>

          <div className="overflow-hidden rounded-[22px] border border-[rgba(42,37,32,0.08)]">
            <div className="grid grid-cols-1 bg-[rgba(63,66,44,0.08)] px-5 py-4 font-sans text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-58)] sm:grid-cols-[1.15fr_1.8fr_1fr] sm:gap-4">
              <span>Categoria</span>
              <span>Finalidade</span>
              <span>Base legal</span>
            </div>
            <div className="grid gap-0 divide-y divide-[rgba(42,37,32,0.08)]">
              <div className="grid grid-cols-1 gap-2 px-5 py-4 sm:grid-cols-[1.15fr_1.8fr_1fr] sm:gap-4">
                <p className="font-sans text-[15px] font-semibold text-[var(--color-ink)]">Estritamente necessários</p>
                <p className="font-sans text-[15px] leading-[1.7] text-[var(--color-ink-sub)]">Autenticação no repositório e segurança da sessão.</p>
                <p className="font-sans text-[15px] text-[var(--color-ink-sub)]">Legítimo interesse</p>
              </div>
              <div className="grid grid-cols-1 gap-2 px-5 py-4 sm:grid-cols-[1.15fr_1.8fr_1fr] sm:gap-4">
                <p className="font-sans text-[15px] font-semibold text-[var(--color-ink)]">Analíticos</p>
                <p className="font-sans text-[15px] leading-[1.7] text-[var(--color-ink-sub)]">Monitoramento de tráfego e usabilidade do site.</p>
                <p className="font-sans text-[15px] text-[var(--color-ink-sub)]">Consentimento</p>
              </div>
              <div className="grid grid-cols-1 gap-2 px-5 py-4 sm:grid-cols-[1.15fr_1.8fr_1fr] sm:gap-4">
                <p className="font-sans text-[15px] font-semibold text-[var(--color-ink)]">Funcionais</p>
                <p className="font-sans text-[15px] leading-[1.7] text-[var(--color-ink-sub)]">Lembrar preferências de idioma e configurações.</p>
                <p className="font-sans text-[15px] text-[var(--color-ink-sub)]">Consentimento</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[22px] bg-[rgba(63,66,44,0.07)] px-5 py-5">
          <h2 className="mb-3 font-serif text-[22px] font-semibold text-[var(--color-ink)]">
            2.2 Gestão de consentimento
          </h2>
          <p className="font-sans text-[15px] leading-[1.75] text-[var(--color-ink-sub)]">
            Você pode, a qualquer momento, configurar seu navegador para bloquear ou alertar sobre cookies. No entanto, a desativação de cookies estritamente necessários pode inviabilizar o acesso ao repositório digital e a áreas restritas do site.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-[24px] font-semibold text-[var(--color-terracotta-dark)]">
            Outras páginas legais
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/politica-de-privacidade"
              className="rounded-[22px] border border-[rgba(42,37,32,0.08)] bg-[rgba(63,66,44,0.06)] px-5 py-5 no-underline transition-transform duration-200 hover:-translate-y-px"
            >
              <p className="mb-2 font-serif text-[24px] font-semibold text-[var(--color-ink)]">
                Política de Privacidade
              </p>
              <p className="font-sans text-[15px] leading-[1.7] text-[var(--color-ink-sub)]">
                Tratamento de dados pessoais, dados sensíveis, compartilhamento e direitos dos titulares.
              </p>
            </Link>

            <Link
              href="/termos-de-servico"
              className="rounded-[22px] border border-[rgba(42,37,32,0.08)] bg-[rgba(138,78,46,0.07)] px-5 py-5 no-underline transition-transform duration-200 hover:-translate-y-px"
            >
              <p className="mb-2 font-serif text-[24px] font-semibold text-[var(--color-ink)]">
                Termos de Serviço
              </p>
              <p className="font-sans text-[15px] leading-[1.7] text-[var(--color-ink-sub)]">
                Escopo dos serviços, limitações de responsabilidade, repositório digital e propriedade intelectual.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </LegalPageFrame>
  )
}
