/**
 * artigos/documentos-essenciais/page.tsx
 * Artigo sobre documentos jurídicos — procuração, testamento, DAV, inventário de bens
 *
 * Conecta: ArticlePageFrame (features/legal/components)
 * Camada: server (RSC)
 */

import { ArticlePageFrame } from '@/features/legal/components/ArticlePageFrame'

export const metadata = {
  title: '4 documentos essenciais para proteger seus pais | Senda Sênior',
  description: 'Organizar-se juridicamente com antecedência é uma das formas mais seguras de proteger sua família.',
  alternates: { canonical: '/artigos/documentos-essenciais' },
  openGraph: {
    type: 'article',
    title: '4 documentos que toda família deveria ter prontos enquanto os pais possuem plena capacidade civil',
    description: 'Organizar-se juridicamente com antecedência é uma das formas mais seguras de proteger sua família.',
    url: '/artigos/documentos-essenciais',
    publishedTime: '2026-03-03T00:00:00.000Z',
    authors: ['Luciana Moura'],
  },
}

const p = 'font-sans text-[17px] leading-[1.9] text-[var(--color-ink-sub)] text-justify'
const h2 = 'font-serif text-[26px] font-semibold text-[var(--color-green-dark)] mt-16 mb-5 leading-[1.2]'
const lead = 'font-serif text-[22px] leading-[1.5] text-[var(--color-ink)] font-normal mb-6'
const label = 'font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-terracotta)] mb-1'
const answer = 'font-sans text-[17px] leading-[1.9] text-[var(--color-ink-sub)] text-justify'
const qa = 'border-l-2 border-[rgba(45,95,79,0.2)] pl-4 space-y-3'

export default function ArtigoDocumentosEssenciais() {
  return (
    <ArticlePageFrame
      eyebrow="Organização"
      title="4 documentos que toda família deveria ter prontos enquanto os pais possuem plena capacidade civil"
      author="Luciana Moura"
      date="Mar 03, 2026 · 7 min de leitura"
      slug="documentos-essenciais"
      description="Organizar-se juridicamente com antecedência é uma das formas mais seguras de proteger sua família."
      datePublished="2026-03-03"
    >
      <div className="space-y-6">
        <p className={lead}>
          Organizar-se juridicamente pode parecer uma tarefa distante ou até incômoda, especialmente quando se trata de planejar o futuro dos pais. No entanto, preparar-se com antecedência é uma das formas mais seguras de evitar conflitos, garantir a tranquilidade da família e assegurar que as vontades do idoso sejam respeitadas.
        </p>
        <p className={p}>
          Aqui, apresentamos quatro documentos essenciais que toda família deveria ter em mãos enquanto os pais possuem plena capacidade civil. Eles não apenas protegem a família juridicamente, mas também ajudam a evitar situações de angústia e incerteza em momentos críticos.
        </p>


        {/* 1 */}
        <h2 className={h2}>1. Procuração (Procuração Específica)</h2>
        <div className={`${qa} space-y-5`}>
          <div>
            <p className={label}>O que é?</p>
            <p className={answer}>A procuração é um documento que permite que outra pessoa (o procurador) tome decisões legais em nome do idoso. Procuração pública com poderes específicos, elaborada enquanto a pessoa possui plena capacidade civil.</p>
          </div>
          <div>
            <p className={label}>Por que é importante?</p>
            <p className={answer}>Sem uma procuração, a família pode enfrentar dificuldades para gerenciar bens, assinar contratos ou tomar decisões financeiras em nome do idoso.</p>
          </div>
          <div>
            <p className={label}>Quando providenciar?</p>
            <p className={answer}>O ideal é que a procuração seja feita enquanto o idoso ainda tem capacidade mental plena. Isso garante que a escolha do procurador seja consciente e legítima.</p>
          </div>
          <div>
            <p className={label}>Quais problemas evita?</p>
            <p className={answer}>Pode reduzir a necessidade de medidas judiciais e facilitar a gestão dos interesses do idoso, embora em determinadas situações a curatela ainda possa ser necessária.</p>
          </div>
          <div>
            <p className={label}>Exemplo prático</p>
            <p className={answer}>Se o idoso precisar vender um imóvel e não puder comparecer à assinatura do contrato, a procuração permite que um filho ou outro representante faça isso por ele.</p>
          </div>
        </div>


        {/* 2 */}
        <h2 className={h2}>2. Testamento ou Planejamento Sucessório</h2>
        <div className={`${qa} space-y-5`}>
          <div>
            <p className={label}>O que é?</p>
            <p className={answer}>O testamento é o documento que define como o patrimônio do idoso será distribuído após sua morte. O planejamento sucessório pode incluir outros instrumentos, como doações, holding familiar, seguro de vida, previdência privada ou acordos societários.</p>
          </div>
          <div>
            <p className={label}>Por que é importante?</p>
            <p className={answer}>Sem um testamento, a herança será distribuída conforme a lei, o que pode não refletir as vontades do idoso. Isso pode gerar conflitos entre filhos, especialmente em famílias com filhos de diferentes mães ou com filhos que não moram juntos.</p>
          </div>
          <div>
            <p className={label}>Quando providenciar?</p>
            <p className={answer}>O ideal é que o testamento seja feito enquanto o idoso ainda tem capacidade mental e pode expressar suas vontades com clareza.</p>
          </div>
          <div>
            <p className={label}>Quais problemas evita?</p>
            <p className={answer}>Evita disputas judiciais, demoras na partilha de bens e a sensação de injustiça entre os herdeiros.</p>
          </div>
          <div>
            <p className={label}>Exemplo prático</p>
            <p className={answer}>Um idoso pode deixar claro que deseja doar parte de sua herança a uma instituição de caridade, ou que um imóvel seja dividido entre dois filhos, mesmo que um tenha morado com ele por mais tempo. A existência de herdeiros necessários limita a liberdade testamentária à parte disponível do patrimônio.</p>
          </div>
        </div>


        {/* 3 */}
        <h2 className={h2}>3. Diretivas Antecipadas de Vontade (DAV) / Testamento Vital</h2>
        <div className={`${qa} space-y-5`}>
          <div>
            <p className={label}>O que é?</p>
            <p className={answer}>As Diretivas Antecipadas de Vontade (DAV), também conhecidas como testamento vital, são documentos que registram as vontades do idoso sobre tratamentos médicos em situações de incapacidade irreversível. As Diretivas Antecipadas de Vontade são reconhecidas pela prática médica e pelas normas do Conselho Federal de Medicina.</p>
          </div>
          <div>
            <p className={label}>Por que é importante?</p>
            <p className={answer}>Eles permitem que o idoso decida, por exemplo, se deseja ou não receber reanimação cardiopulmonar, nutrição artificial ou ventilação mecânica em casos de doença terminal.</p>
          </div>
          <div>
            <p className={label}>Quando providenciar?</p>
            <p className={answer}>Deve ser feito enquanto o idoso ainda tem capacidade mental plena. A DAV pode ser revista a qualquer momento.</p>
          </div>
          <div>
            <p className={label}>Quais problemas evita?</p>
            <p className={answer}>Evita que familiares tomem decisões difíceis sob pressão emocional. Também protege o idoso de sofrer tratamentos invasivos que ele não deseja.</p>
          </div>
          <div>
            <p className={label}>Exemplo prático</p>
            <p className={answer}>Um idoso pode declarar que, em caso de doença degenerativa irreversível, não deseja ser mantido em vida artificialmente. Isso evita que filhos discutam sobre o que fazer em uma situação de crise.</p>
          </div>
        </div>


        {/* 4 */}
        <h2 className={h2}>4. Inventário de Bens e Documentos Importantes</h2>
        <div className={`${qa} space-y-5`}>
          <div>
            <p className={label}>O que é?</p>
            <p className={answer}>Diferente do inventário judicial que ocorre após o falecimento, o Inventário Preventivo (embora não seja um documento jurídico formal previsto em lei, trata-se de uma ferramenta de organização patrimonial) é um mapeamento detalhado e organizado de toda a vida patrimonial, financeira e burocrática dos pais. É, na prática, um “mapa do tesouro” que consolida em um único lugar a localização de bens tangíveis (imóveis, veículos, joias, obras de arte), ativos financeiros (contas bancárias, investimentos em ações, previdência privada, criptoativos) e documentos essenciais (escrituras, certidões de nascimento/casamento, apólices de seguro, contratos de aluguel e títulos de propriedade). Além disso, na era digital, este inventário deve incluir a vida digital: informações sobre a existência das contas digitais e orientações para seu gerenciamento.</p>
          </div>
          <div>
            <p className={label}>Por que é importante?</p>
            <p className={answer}>A importância deste documento reside na continuidade da gestão e na paz de espírito familiar. Em momentos de crise, como uma hospitalização repentina, a família não pode perder tempo procurando uma apólice de seguro saúde ou tentando descobrir em qual banco o idoso recebe sua aposentadoria. O inventário garante que o patrimônio seja gerido com eficiência, evita que bens sejam esquecidos ou perdidos para o Estado (como contas inativas) e facilita imensamente um futuro processo de partilha, podendo reduzir custos e tempo na futura administração do patrimônio, já que toda a informação estará mastigada e pronta para uso.</p>
          </div>
          <div>
            <p className={label}>Quando providenciar?</p>
            <p className={answer}>O momento ideal é agora, preferencialmente antes que os pais atinjam os 70 anos ou apresentem qualquer sinal de declínio cognitivo. É fundamental que este processo seja colaborativo: os pais devem ser os protagonistas, orientando os filhos sobre onde guardam cada item e quais são suas particularidades. Uma vez criado, o inventário não é estático; ele deve ser revisado anualmente ou sempre que houver uma mudança significativa no patrimônio, como a venda de um carro ou a abertura de uma nova conta de investimentos.</p>
          </div>
          <div>
            <p className={label}>Exemplo prático</p>
            <p className={answer}>Imagine o caso de Sr. Arnaldo, que sofreu um AVC aos 74 anos. Seus filhos sabiam que ele era organizado, mas não tinham acesso às suas contas. Graças ao Inventário Senda que haviam feito um ano antes, os filhos localizaram rapidamente uma previdência privada que cobria despesas hospitalares de alto custo e encontraram a escritura de um terreno que o Sr. Arnaldo pretendia vender. Sem o inventário, a família teria que arcar com as despesas do próprio bolso e possivelmente nunca saberia da existência daquele investimento, que acabaria esquecido no banco.</p>
          </div>
        </div>
      </div>
    </ArticlePageFrame>
  )
}
