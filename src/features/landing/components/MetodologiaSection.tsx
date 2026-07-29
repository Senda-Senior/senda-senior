/**
 * MetodologiaSection.tsx
 * Seção "Metodologia Senda Sênior — Os 3 momentos do cuidado". Coluna editorial à
 * esquerda (intacta) + quiz de diagnóstico à direita, que indica a fase e o manual certo.
 *
 * Conecta: CuidadoQuiz | renderizada por page.tsx (deck card sticky, #metodologia)
 * Camada: browser
 *
 * Substitui o antigo carrossel scroll-jack (FasesCuidado). O avanço por scroll dos
 * 3 cards migrou para a ManuaisSection.
 */
'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { START_QUIZ_EVENT } from '@/features/landing/data/quiz-cuidado'

const CuidadoQuiz = dynamic(
  () => import('./CuidadoQuiz').then((m) => m.CuidadoQuiz),
)

export function MetodologiaSection() {
  return (
    <section className="flex min-h-screen items-center bg-[var(--color-green-dark)] px-[clamp(20px,4vw,60px)] py-[clamp(56px,7vw,88px)]">
      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-[clamp(36px,5vw,80px)] lg:grid-cols-2">
        {/* Coluna editorial (mantida do design original) */}
        <div className="flex flex-col justify-center">
          <p className="mb-6 font-sans text-[12.5px] font-bold uppercase tracking-[0.15em] text-[var(--color-gold-light)] opacity-85">
            Metodologia Senda Sênior
          </p>

          <h2 className="mb-7 font-serif text-[clamp(36px,5.2vw,64px)] font-normal leading-[1.05] tracking-[-0.025em] text-[var(--color-cream)] [text-wrap:balance]">
            Os 3 momentos
            <br />
            do cuidado.
          </h2>

          <p className="mb-7 max-w-[440px] font-sans text-[clamp(16px,1.38vw,18.4px)] leading-[1.65] text-[var(--color-cream-75)]">
            Estruturamos o envelhecimento em três estágios para ajudar você a entender o
            presente e proteger o futuro. Esta classificação não rotula; ela orienta.
          </p>

          <p className="mb-7 max-w-[440px] font-sans text-[clamp(16px,1.38vw,18.4px)] leading-[1.65] text-[var(--color-cream-75)]">
            Faça agora seu teste rápido para entender em qual momento você e sua família se encontram.
          </p>
          <Link
            href="#CuidadoQuiz"
            onClick={() => window.dispatchEvent(new Event(START_QUIZ_EVENT))}
            className="btn-terracotta-hover inline-flex w-fit items-center gap-2.5 rounded-[30px] bg-[var(--color-terracotta)] px-7 py-3.5 font-sans text-[16px] font-semibold text-white no-underline transition-all duration-300"
          >
            Descobrir o meu momento <ArrowRight size={16} strokeWidth={2} />
          </Link>
        </div>

        {/* Quiz de diagnóstico */}
        <div id="CuidadoQuiz" className="min-h-[clamp(460px,62vh,580px)] scroll-mt-[clamp(56px,7vw,88px)]">
          <CuidadoQuiz />
        </div>
      </div>
    </section>
  )
}
