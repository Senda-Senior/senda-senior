export const metadata = {
  title: 'Jurídico | Senda Sênior',
}

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
      <div className="mx-auto w-full max-w-[860px] px-6 py-16 sm:px-8 sm:py-20">
        <p className="mb-4 font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--color-terracotta-dark)]">
          Jurídico
        </p>
        <h1 className="mb-6 font-serif text-[clamp(32px,4vw,52px)] font-semibold leading-[1.08] tracking-[-0.02em]">
          Esta página está em construção.
        </h1>

        <div className="rounded-[24px] border border-[var(--color-ink-14)] bg-white/70 px-6 py-8 shadow-[0_18px_40px_rgba(42,37,32,0.08)] sm:px-8 sm:py-10">
          <h2 className="mb-4 font-serif text-[clamp(24px,3vw,34px)] font-semibold text-[var(--color-terracotta-dark)]">
            Termos, privacidade e tratamento de dados
          </h2>

          <p className="mb-5 font-sans text-[16px] leading-[1.75] text-[var(--color-ink-sub)]">
            Estamos preparando esta área para reunir, em um só lugar, os Termos de Serviço, a Política de Privacidade, a Política de Cookies e as informações de Tratamento de Dados da Senda Sênior.
          </p>

          <p className="mb-6 font-sans text-[16px] leading-[1.75] text-[var(--color-ink-sub)]">
            Enquanto isso, se você precisar de informações jurídicas, de privacidade ou de tratamento de dados, entre em contato conosco pelos canais oficiais do site.
          </p>

          <div className="rounded-[18px] bg-[var(--color-cream-60)] px-5 py-5">
            <p className="font-sans text-[14px] font-medium leading-[1.7] text-[var(--color-ink-muted)]">
              Conteúdo em preparação:
            </p>
            <ul className="mt-3 space-y-2 font-sans text-[15px] leading-[1.7] text-[var(--color-ink-sub)]">
              <li>Termos de Serviço</li>
              <li>Política de Privacidade</li>
              <li>Política de Cookies</li>
              <li>Tratamento de Dados (LGPD)</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
