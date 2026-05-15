import { LegalPageFrame } from '@/features/legal/components/LegalPageFrame'

export const metadata = {
  title: 'Termos de Serviço | Senda Sênior',
}

export default function TermsOfServicePage() {
  return (
    <LegalPageFrame
      eyebrow="Jurídico"
      title="Termos de Serviço"
      updatedAt="8 de maio de 2026"
    >
      <div className="space-y-8">
        <p className="font-sans text-[16px] leading-[1.8] text-[var(--color-ink-sub)]">
          Estes Termos de Serviço regulam a utilização da plataforma digital e a aquisição dos produtos e serviços oferecidos pela Senda Sênior Planejamento e Assessoria. Ao acessar o site ou adquirir qualquer produto, o usuário declara plena ciência e concordância com as cláusulas aqui dispostas, em conformidade com o Código de Defesa do Consumidor e o Marco Civil da Internet.
        </p>

        <section className="space-y-4">
          <h2 className="font-serif text-[24px] font-semibold text-[var(--color-terracotta-dark)]">
            1.1 Natureza do serviço e escopo de atuação
          </h2>
          <p className="font-sans text-[15px] leading-[1.8] text-[var(--color-ink-sub)]">
            A atividade desenvolvida pela plataforma consiste estritamente em planejamento organizacional, logística familiar e consultoria administrativa para suporte ao envelhecimento. Os serviços não possuem natureza médica, hospitalar, terapêutica ou de diagnóstico e não substituem, em hipótese alguma, o acompanhamento por profissionais de saúde regularmente habilitados.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-[24px] font-semibold text-[var(--color-terracotta-dark)]">
            1.2 Isenção e responsabilidade civil
          </h2>
          <p className="font-sans text-[15px] leading-[1.8] text-[var(--color-ink-sub)]">
            Os manuais digitais possuem caráter educativo e orientativo. A contratada não se responsabiliza por danos diretos ou indiretos decorrentes de decisões familiares ou escolhas de gestão tomadas com base nesse conteúdo. A implementação das sugestões depende da avaliação e da responsabilidade exclusiva do usuário.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-[24px] font-semibold text-[var(--color-terracotta-dark)]">
            1.3 Repositório digital e custódia de documentos
          </h2>
          <p className="font-sans text-[15px] leading-[1.8] text-[var(--color-ink-sub)]">
            O serviço de aluguel de espaço em repositório digital destina-se ao armazenamento de documentos para fins de organização. Embora a segurança do acesso seja protegida por criptografia, é dever do usuário guardar e manter em sigilo suas credenciais de acesso. A contratada não se responsabiliza por acessos indevidos decorrentes de negligência do próprio usuário.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-[24px] font-semibold text-[var(--color-terracotta-dark)]">
            1.4 Portfólio de terceiros e inexistência de solidariedade
          </h2>
          <p className="font-sans text-[15px] leading-[1.8] text-[var(--color-ink-sub)]">
            A listagem de parceiros, como clínicas, ILPIs, cuidadores e médicos, possui caráter meramente informativo. Os negócios firmados entre o usuário e esses terceiros são independentes e autônomos, inexistindo responsabilidade solidária ou subsidiária da Senda Sênior por falhas, danos ou prejuízos decorrentes da atuação desses profissionais ou instituições.
          </p>
        </section>

        <section className="rounded-[22px] bg-[rgba(138,78,46,0.08)] px-5 py-5">
          <h2 className="mb-3 font-serif text-[22px] font-semibold text-[var(--color-ink)]">
            1.5 Licença e propriedade intelectual
          </h2>
          <p className="font-sans text-[15px] leading-[1.75] text-[var(--color-ink-sub)]">
            Todo o conteúdo dos manuais digitais, textos, logotipos e metodologias é protegido pela legislação autoral aplicável. A aquisição de produtos confere ao usuário apenas licença de uso pessoal e intransferível, sendo vedadas reprodução, distribuição, revenda ou compartilhamento público sem autorização prévia e expressa por escrito das titulares dos direitos.
          </p>
        </section>
      </div>
    </LegalPageFrame>
  )
}
