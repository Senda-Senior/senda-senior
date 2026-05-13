import { LegalPageFrame } from '@/features/legal/components/LegalPageFrame'

export const metadata = {
  title: 'Política de Privacidade | Senda Sênior',
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPageFrame
      eyebrow="Privacidade"
      title="Política de Privacidade e Proteção de Dados"
      updatedAt="8 de maio de 2026"
    >
      <div className="space-y-8">
        <p className="font-sans text-[16px] leading-[1.8] text-[var(--color-ink-sub)]">
          Esta Política de Privacidade estabelece as diretrizes e normas para o tratamento de dados pessoais realizado pela plataforma, abrangendo a comercialização de manuais digitais, a prestação de serviços de assessoria personalizada e a disponibilização de repositório digital para custódia de documentos.
        </p>

        <p className="font-sans text-[16px] leading-[1.8] text-[var(--color-ink-sub)]">
          O presente documento visa garantir transparência e segurança jurídica no relacionamento com usuários, familiares e responsáveis, em estrita observância à Lei nº 13.709/2018 (LGPD) e ao Marco Civil da Internet (Lei nº 12.965/2014). Ao utilizar os serviços, o titular reconhece a Senda Sênior como controladora dos dados pessoais tratados dentro do escopo contratado.
        </p>

        <section className="space-y-4">
          <h2 className="font-serif text-[24px] font-semibold text-[var(--color-terracotta-dark)]">
            1. Finalidade e âmbito de aplicação
          </h2>
          <p className="font-sans text-[15px] leading-[1.8] text-[var(--color-ink-sub)]">
            A coleta e o tratamento de dados pessoais ocorrem para viabilizar a entrega dos serviços da plataforma, com fundamento nos princípios da finalidade, adequação e necessidade, sempre limitando-se ao mínimo indispensável para execução do objeto contratual.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-[24px] font-semibold text-[var(--color-terracotta-dark)]">
            2. Informações coletadas e natureza dos dados
          </h2>

          <div className="space-y-3">
            <h3 className="font-sans text-[16px] font-semibold text-[var(--color-ink)]">
              2.1 Dados pessoais cadastrais
            </h3>
            <p className="font-sans text-[15px] leading-[1.8] text-[var(--color-ink-sub)]">
              Para aquisição de manuais e contratação de assessoria, podem ser coletados nome completo, CPF, endereço de e-mail, telefone e dados de cobrança. Essas informações são tratadas com fundamento no art. 7º, inciso V, da LGPD, para execução de contrato.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-sans text-[16px] font-semibold text-[var(--color-ink)]">
              2.2 Dados pessoais sensíveis de saúde
            </h3>
            <p className="font-sans text-[15px] leading-[1.8] text-[var(--color-ink-sub)]">
              Dada a natureza da assessoria e do repositório digital, a plataforma poderá tratar dados sensíveis de saúde do idoso, como diagnósticos, prescrições, históricos clínicos, relatórios de cuidadores e informações sobre mobilidade. Esse tratamento se fundamenta no consentimento específico e destacado do responsável legal e, quando aplicável, na tutela da saúde.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-sans text-[16px] font-semibold text-[var(--color-ink)]">
              2.3 Dados de navegação e logs
            </h3>
            <p className="font-sans text-[15px] leading-[1.8] text-[var(--color-ink-sub)]">
              Em cumprimento ao art. 15 do Marco Civil da Internet, a plataforma pode armazenar registros de acesso, incluindo endereço IP, data, hora e duração da conexão, além de dados técnicos de navegação voltados à segurança e à prevenção de fraudes.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-[24px] font-semibold text-[var(--color-terracotta-dark)]">
            3. Finalidades do tratamento
          </h2>
          <ul className="space-y-2 font-sans text-[15px] leading-[1.8] text-[var(--color-ink-sub)]">
            <li>Execução da assessoria e elaboração de planos de cuidado personalizados.</li>
            <li>Gestão do repositório digital e custódia de documentos sensíveis.</li>
            <li>Entrega de produtos digitais e processamento de pedidos.</li>
            <li>Comunicação institucional, administrativa e de segurança.</li>
            <li>Auditoria, rastreabilidade e prevenção de acessos indevidos.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-[24px] font-semibold text-[var(--color-terracotta-dark)]">
            4. Compartilhamento de dados com terceiros
          </h2>
          <p className="font-sans text-[15px] leading-[1.8] text-[var(--color-ink-sub)]">
            A Senda Sênior não comercializa dados pessoais. O compartilhamento pode ocorrer apenas com parceiros do portfólio, mediante solicitação ou autorização expressa do titular ou responsável legal; com operadores de tecnologia vinculados a obrigações contratuais de confidencialidade e segurança; ou por dever legal, em cumprimento de ordem judicial ou administrativa.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-[24px] font-semibold text-[var(--color-terracotta-dark)]">
            5. Armazenamento, segurança e retenção
          </h2>
          <p className="font-sans text-[15px] leading-[1.8] text-[var(--color-ink-sub)]">
            São adotadas medidas técnicas e administrativas adequadas à natureza dos dados tratados, incluindo criptografia SSL/TLS em trânsito e proteção reforçada do acesso ao repositório. Os dados permanecem armazenados apenas pelo período necessário ao cumprimento das finalidades descritas nesta política, podendo ser preservados em ambiente isolado quando houver obrigação legal ou necessidade de defesa em juízo.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-[24px] font-semibold text-[var(--color-terracotta-dark)]">
            6. Direitos dos titulares
          </h2>
          <p className="font-sans text-[15px] leading-[1.8] text-[var(--color-ink-sub)]">
            Nos termos do art. 18 da LGPD, o titular ou seu representante legal poderá solicitar confirmação da existência de tratamento, acesso aos dados, correção de informações incompletas, inexatas ou desatualizadas, anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade, portabilidade e revogação do consentimento, quando aplicável.
          </p>
        </section>

        <section className="rounded-[22px] bg-[rgba(63,66,44,0.07)] px-5 py-5">
          <h2 className="mb-3 font-serif text-[22px] font-semibold text-[var(--color-ink)]">
            7. Encarregado de dados
          </h2>
          <div className="space-y-2 font-sans text-[15px] leading-[1.75] text-[var(--color-ink-sub)]">
            <p>Nome: Luciana Moura</p>
            <p>E-mail: privacidade@sendasenior.com.br</p>
            <p>Prazo de resposta: até 15 dias úteis, conforme regulamentação da ANPD.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-[24px] font-semibold text-[var(--color-terracotta-dark)]">
            8. Alterações desta política
          </h2>
          <p className="font-sans text-[15px] leading-[1.8] text-[var(--color-ink-sub)]">
            Esta Política de Privacidade poderá ser atualizada periodicamente para refletir melhorias técnicas ou mudanças legislativas. Toda alteração substancial será comunicada por e-mail ou por aviso em destaque na plataforma. A continuidade do uso dos serviços após a atualização implica aceitação dos novos termos.
          </p>
        </section>
      </div>
    </LegalPageFrame>
  )
}
