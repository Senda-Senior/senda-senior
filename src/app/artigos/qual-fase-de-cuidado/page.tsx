/**
 * artigos/qual-fase-de-cuidado/page.tsx
 * Artigo-convite ao quiz de cuidado — apresenta as 3 fases (Prevent/Care/Immediate) e leva ao teste
 *
 * Conecta: ArticlePageFrame (features/legal/components) | CTA aponta para o quiz (#CuidadoQuiz)
 * Camada: server (RSC)
 */

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ArticlePageFrame } from '@/features/legal/components/ArticlePageFrame'

export const metadata = {
  title: 'Em qual fase de cuidado sua família está? | Senda Sênior',
  description:
    'Responda a um questionário rápido e descubra qual manual Senda Sênior é mais adequado para a sua situação.',
  alternates: { canonical: '/artigos/qual-fase-de-cuidado' },
  openGraph: {
    type: 'article',
    title: 'Em qual fase de cuidado sua família está?',
    description:
      'Responda a um questionário rápido e descubra qual manual Senda Sênior é mais adequado para a sua situação.',
    url: '/artigos/qual-fase-de-cuidado',
    publishedTime: '2026-03-19T00:00:00.000Z',
    authors: ['Luciana Moura'],
  },
}

const p = 'font-sans text-[17px] leading-[1.9] text-[var(--color-ink-sub)] text-justify'
const lead = 'font-serif text-[22px] leading-[1.5] text-[var(--color-ink)] font-normal mb-6'
const cta = 'rounded-[22px] bg-[var(--color-green-dark)] px-8 py-9 mt-12 text-center sm:px-10 sm:py-10'

export default function ArtigoQualFaseDeCuidado() {
  return (
    <ArticlePageFrame
      eyebrow="Método"
      title="Em qual fase de cuidado sua família está?"
      author="Luciana Moura"
      date="Mar 19, 2026 · 4 min de leitura"
      slug="qual-fase-de-cuidado"
      description="Responda a um questionário rápido e descubra qual manual Senda Sênior é mais adequado para a sua situação."
      datePublished="2026-03-19"
    >
      <div className="space-y-6">
        <p className={lead}>
          Vamos entender juntos qual é o melhor caminho para você.
        </p>

        <p className={p}>
          Cuidar de um idoso é uma tarefa complexa, mas pode ser muito mais tranquila com a orientação certa. Cada família está em um momento diferente — e isso importa.
        </p>

        <p className={p}>
          Responda a um questionário rápido para descobrir em qual fase você está: Prevent Care, Care ou Immediate Care. Isso não é uma avaliação — é um guia para agir com segurança.
        </p>

        <p className={p}>
          Ao final, você saberá qual manual Senda Sênior é mais adequado para sua situação — e como começar a organizar tudo com suporte e clareza.
        </p>

        <div className={cta}>
          <h2 className="mb-3 font-serif text-[clamp(22px,2.4vw,28px)] font-semibold leading-[1.2] text-[var(--color-cream)]">
            Pronto para descobrir?
          </h2>
          <p className="mx-auto mb-6 max-w-[440px] font-sans text-[15px] leading-[1.7] text-[var(--color-cream-75)]">
            Responda ao questionário e descubra o seu próximo passo.
          </p>
          <Link
            href="/#CuidadoQuiz"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-terracotta)] px-7 py-3.5 font-sans text-[15px] font-semibold text-white no-underline shadow-[0_10px_26px_rgba(138,78,46,0.22)] transition-all duration-200 hover:-translate-y-px"
          >
            Fazer o teste <ArrowRight size={16} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </ArticlePageFrame>
  )
}
