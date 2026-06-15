/**
 * artigos/como-conversar-com-seus-pais/page.tsx
 * Artigo sobre diálogo familiar — guia prático para abordar temas delicados com pais idosos
 *
 * Conecta: ArticlePageFrame (features/legal/components)
 * Camada: server (RSC)
 */

import { ArticlePageFrame } from '@/features/legal/components/ArticlePageFrame'

export const metadata = {
  title: 'Como conversar com seus pais sobre o futuro | Senda Sênior',
  description: 'Um guia prático e humano para abordar temas delicados com leveza e respeito.',
}

const p = 'font-sans text-[17px] leading-[1.9] text-[var(--color-ink-sub)]'
const h2 = 'font-serif text-[26px] font-semibold text-[var(--color-green-dark)] mt-16 mb-4 leading-[1.2]'
const lead = 'font-sans text-[18.5px] leading-[1.8] text-[var(--color-ink)] font-[450] italic'
const cta = 'rounded-[18px] bg-[rgba(63,66,44,0.07)] px-6 py-5 mt-8'

export default function ArtigoComoConversar() {
  return (
    <ArticlePageFrame
      eyebrow="Família"
      title="Como conversar com seus pais sobre o futuro sem que ninguém fuja da mesa"
      author="Julianne Pimentel"
      date="Mar 12, 2026 · 5 min de leitura"
    >
      <div className="space-y-6">
        <p className={lead}>
          Um guia prático e humano para abordar temas delicados com leveza e respeito.
        </p>

        <p className={p}>
          Sabemos que abordar o envelhecimento e o futuro com nossos pais é um dos desafios mais delicados da vida adulta. Muitas vezes, o medo de parecer invasivo ou de causar tristeza faz com que adiemos conversas essenciais. O resultado, infelizmente, costuma ser a tomada de decisões apressadas em momentos de crise, quando o estresse está no limite.
        </p>

        <p className={p}>
          No entanto, falar sobre o amanhã não precisa ser um peso. Quando feita com a abordagem correta, essa conversa deixa de ser um tabu e se transforma em um ato de amor e proteção. É a oportunidade de garantir que os desejos deles sejam respeitados e que a família esteja unida e preparada para o que vier.
        </p>

        <p className={p}>
          Este artigo foi pensado para ajudar você, filho ou filha, a construir essa ponte de diálogo com segurança, empatia e, acima de tudo, muito respeito pela autonomia de quem sempre cuidou de você.
        </p>

        <p className={p}>
          Planejar o futuro enquanto o cenário ainda é de estabilidade permite que todos tenham voz. Quando antecipamos questões sobre saúde, finanças e moradia, evitamos o &ldquo;gerenciamento de crises&rdquo;. Ter um plano estruturado traz paz de espírito para os pais, que se sentem ouvidos, e para os filhos, que ganham clareza sobre como agir sem o peso da dúvida ou da culpa.
        </p>

        <h2 className={h2}>Escolha o momento e o lugar certo.</h2>
        <p className={p}>
          Evite abordar temas complexos em grandes reuniões de família ou almoços festivos. O ideal é um ambiente tranquilo, privado e sem interrupções. Escolha um dia em que todos estejam descansados e bem-humorados. O contexto faz toda a diferença para que a conversa flua como um bate-papo natural, e não como uma intervenção.
        </p>

        <h2 className={h2}>Prepare-se emocionalmente.</h2>
        <p className={p}>
          Antes de começar, lembre-se: você não está indo dar ordens. Seus pais são adultos com história e autonomia. Vá para a conversa com o coração aberto, desarmado de julgamentos. O objetivo é ser um aliado, não um inspetor. Se você estiver ansioso, eles perceberão e poderão se fechar defensivamente.
        </p>

        <h2 className={h2}>Inicie com leveza e curiosidade.</h2>
        <p className={p}>
          Em vez de começar com &ldquo;precisamos falar sobre quando você não puder mais dirigir&rdquo;, tente usar ganchos do cotidiano ou histórias de conhecidos. Falar sobre os próprios planos para o futuro também ajuda a normalizar o tema. A ideia é plantar uma semente e deixar que eles se sintam confortáveis para regá-la com você.
        </p>

        <h2 className={h2}>Use a empatia e a escuta ativa.</h2>
        <p className={p}>
          Ouvir é mais importante do que falar. Pergunte como eles se sentem, o que os preocupa e como imaginam os próximos anos. Quando eles falarem, ouça sem interromper. Valide os sentimentos deles com frases como &ldquo;eu entendo por que você se sente assim&rdquo;. Muitas vezes, o que parece teimosia é apenas o medo de perder a independência.
        </p>

        <h2 className={h2}>Evite confrontos e o tom de &ldquo;bronca&rdquo;.</h2>
        <p className={p}>
          Se a conversa começar a esquentar ou se você perceber que eles estão ficando desconfortáveis, pare. Não force a barra. É melhor ter dez conversas curtas e produtivas do que uma única discussão exaustiva que feche as portas para o diálogo futuro.
        </p>

        <h2 className={h2}>Respeite o tempo de processamento deles.</h2>
        <p className={p}>
          Conversar sobre o futuro é um processo contínuo, não um evento único. Cada pequena conversa fortalece o vínculo e constrói uma rede de segurança emocional para toda a família.
        </p>

        <p className={p}>
          Ao abordar esses temas com paciência e carinho, você transforma o medo do desconhecido na segurança de um caminho planejado a quatro mãos. Lembre-se: o objetivo final não é apenas organizar papéis ou rotinas, mas garantir que a dignidade e a vontade de seus pais sejam o norte de todas as decisões futuras.
        </p>

        <div className={cta}>
          <p className="font-sans text-[15px] leading-[1.75] text-[var(--color-ink-sub)]">
            A Senda Sênior nasceu para apoiar famílias nessa jornada. Nossa assessoria ajuda a estruturar todas as dimensões do cuidado — da rotina à proteção jurídica — para que você possa focar no que mais importa: o tempo de qualidade com quem você ama.
          </p>
        </div>
      </div>
    </ArticlePageFrame>
  )
}
