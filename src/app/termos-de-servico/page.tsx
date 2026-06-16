import { LegalPageFrame } from '@/features/legal/components/LegalPageFrame'

export const metadata = {
  title: 'Termos de Serviço | Senda Sênior',
  description:
    'Termos de uso da plataforma Senda Sênior — planejamento e assessoria para o cuidado de pais idosos.',
  alternates: { canonical: '/termos-de-servico' },
}

export default function TermsOfServicePage() {
  return (
    <LegalPageFrame
      title="Termos de Serviço"
      updatedAt="8 de maio de 2026"
    >
      <div className="space-y-8">
        <p className="font-sans text-[16px] leading-[1.8] text-[var(--color-ink-sub)]">
          Os presentes Termos de Serviço regulam a utilização da plataforma digital e a aquisição dos produtos e serviços oferecidos pela Senda Sênior — Planejamento e Assessoria. Ao acessar o site ou adquirir qualquer produto, o usuário declara plena ciência e concordância com as cláusulas aqui dispostas, em conformidade com o Código de Defesa do Consumidor (Lei nº 8.078/90) e o Marco Civil da Internet (Lei nº 12.965/14).
        </p>

        <section className="space-y-4">
          <h2 className="font-serif text-[24px] font-semibold text-[var(--color-terracotta-dark)]">
            1.1 Natureza do Serviço e Escopo de Atuação
          </h2>
          <p className="font-sans text-[15px] leading-[1.8] text-[var(--color-ink-sub)]">
            A atividade desenvolvida pela plataforma consiste estritamente em planejamento organizacional, logística familiar e consultoria administrativa para o suporte ao envelhecimento. Fica expressamente estabelecido que os serviços prestados não possuem natureza médica, hospitalar, terapêutica ou de diagnóstico. A assessoria visa a otimização da rotina e a organização documental, não substituindo, em hipótese alguma, o acompanhamento por profissionais de saúde devidamente registrados em seus respectivos conselhos de classe.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-[24px] font-semibold text-[var(--color-terracotta-dark)]">
            1.2 Cláusula de Isenção e Responsabilidade Civil
          </h2>
          <p className="font-sans text-[15px] leading-[1.8] text-[var(--color-ink-sub)]">
            Os manuais digitais de planejamento são materiais de caráter educativo e orientativo. A CONTRATADA não se responsabiliza por danos diretos ou indiretos decorrentes de decisões familiares ou escolhas de gestão tomadas com base no conteúdo dos manuais. A implementação das sugestões contidas nos materiais é de inteira discricionariedade e responsabilidade do usuário, que deve avaliar a adequação das orientações à realidade específica do idoso sob seus cuidados.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-[24px] font-semibold text-[var(--color-terracotta-dark)]">
            1.3 Repositório Digital e Custódia de Documentos
          </h2>
          <p className="font-sans text-[15px] leading-[1.8] text-[var(--color-ink-sub)]">
            O serviço de aluguel de espaço em repositório digital destina-se ao armazenamento de documentos para fins de organização. A segurança do acesso é garantida por criptografia, contudo, é dever exclusivo do usuário a guarda e o sigilo de suas credenciais de acesso (login e senha). A CONTRATADA não se responsabiliza por acessos indevidos decorrentes de negligência do usuário. O serviço de backup é limitado à infraestrutura da plataforma, sendo recomendada a manutenção de cópias físicas ou em outros meios digitais pelo usuário.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-[24px] font-semibold text-[var(--color-terracotta-dark)]">
            1.4 Portfólio de Terceiros e Inexistência de Solidariedade
          </h2>
          <p className="font-sans text-[15px] leading-[1.8] text-[var(--color-ink-sub)]">
            A listagem de parceiros (clínicas, ILPIs, cuidadores, médicos, etc.) no portfólio da plataforma constitui mera facilitação informativa. Sob o princípio jurídico <em>res inter alios acta</em>, os negócios jurídicos firmados entre o usuário e os parceiros listados são independentes e autônomos. A CONTRATADA não integra a cadeia de fornecimento desses serviços terceiros, inexistindo responsabilidade solidária ou subsidiária por eventuais falhas na prestação de serviço, danos morais ou materiais causados por tais profissionais ou instituições.
          </p>
        </section>

        <section className="rounded-[22px] bg-[rgba(138,78,46,0.08)] px-5 py-5">
          <h2 className="mb-3 font-serif text-[22px] font-semibold text-[var(--color-ink)]">
            1.5 Licença de Propriedade Intelectual
          </h2>
          <p className="font-sans text-[15px] leading-[1.75] text-[var(--color-ink-sub)]">
            Todo o conteúdo dos manuais digitais, textos, logotipos e metodologias são protegidos pela Lei de Direitos Autorais (Lei nº 9.610/98). A aquisição de produtos confere ao usuário uma licença de uso pessoal e intransferível. É terminantemente proibida a reprodução, distribuição, revenda ou compartilhamento público do conteúdo sem autorização prévia e expressa por escrito das detentoras dos direitos.
          </p>
        </section>
      </div>
    </LegalPageFrame>
  )
}
