/**
 * CuidadoQuiz.tsx
 * Quiz "Qual manual é para você?" — perguntas Sim/Não, uma por vez, com score final
 * que indica a fase de cuidado e recomenda o manual certo (Prevent/Care/Immediate).
 *
 * Conecta: QUIZ_QUESTIONS, scoreQuiz (data/quiz-cuidado) | MANUAIS (data/fases-cuidado)
 * Camada: browser (use client) — renderizado dentro da MetodologiaSection
 */
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react'
import { QUIZ_QUESTIONS, scoreQuiz, START_QUIZ_EVENT } from '@/features/landing/data/quiz-cuidado'
import { MANUAIS } from '@/features/landing/data/fases-cuidado'

const TOTAL = QUIZ_QUESTIONS.length

export function CuidadoQuiz() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({})
  const [current, setCurrent] = useState(0)
  const [started, setStarted] = useState(false)
  const [showResult, setShowResult] = useState(false)

  // Permite que o botão "Descobrir o meu momento" (MetodologiaSection) saia da capa.
  useEffect(() => {
    function onStart() {
      setStarted(true)
    }
    window.addEventListener(START_QUIZ_EVENT, onStart)
    return () => window.removeEventListener(START_QUIZ_EVENT, onStart)
  }, [])

  const question = QUIZ_QUESTIONS[current]
  const answered = answers[question.id] !== undefined
  const isLast = current === TOTAL - 1
  const progress = Math.round(((current + (answered ? 1 : 0)) / TOTAL) * 100)

  function answer(value: boolean) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }))
  }

  function next() {
    if (!answered) return
    if (isLast) setShowResult(true)
    else setCurrent((c) => c + 1)
  }

  function back() {
    if (showResult) {
      setShowResult(false)
      return
    }
    if (current > 0) setCurrent((c) => c - 1)
  }

  function reset() {
    setAnswers({})
    setCurrent(0)
    setShowResult(false)
  }

  return (
    <div className="flex h-full flex-col rounded-[24px] border border-[rgba(42,37,32,0.06)] bg-[var(--color-cream)] p-[clamp(24px,3vw,40px)] shadow-[0_24px_64px_rgba(42,37,32,0.18)]">
      {!started && <Intro onStart={() => setStarted(true)} />}

      {started && (
        <>
          {/* Cabeçalho */}
          <div className="mb-6 flex items-center justify-between gap-3">
            <p className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-terracotta)]">
              Teste
            </p>
            {!showResult && (
              <span className="font-sans text-[12.5px] font-medium text-[var(--color-ink-muted)]">
                {current + 1} / {TOTAL}
              </span>
            )}
          </div>

          {/* Barra de progresso */}
          <div className="mb-7 h-[5px] overflow-hidden rounded-full bg-[rgba(42,37,32,0.08)]">
            <motion.div
              className="h-full rounded-full bg-[var(--color-green)]"
              animate={{ width: `${showResult ? 100 : progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {!showResult ? (
              <motion.div
                key={`q-${question.id}`}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex flex-1 flex-col"
              >
                <h3 className="mb-7 font-serif text-[clamp(20px,2vw,26px)] font-medium leading-[1.25] tracking-[-0.01em] text-[var(--color-ink)]">
                  {question.text}
                </h3>

                <div className="mb-auto grid grid-cols-2 gap-3">
                  {([['Sim', true], ['Não', false]] as const).map(([label, value]) => {
                    const selected = answers[question.id] === value
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => answer(value)}
                        aria-pressed={selected}
                        className={[
                          'rounded-[14px] border-[1.5px] px-4 py-4 font-sans text-[15px] font-semibold transition-all duration-200',
                          selected
                            ? 'border-[var(--color-green)] bg-[var(--color-green)] text-white shadow-[0_6px_18px_rgba(45,95,79,0.25)]'
                            : 'border-[rgba(42,37,32,0.14)] bg-white text-[var(--color-ink-sub)] hover:border-[var(--color-green)] hover:text-[var(--color-green)]',
                        ].join(' ')}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>

                <div className="mt-7 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={back}
                    disabled={current === 0}
                    className="inline-flex items-center gap-1.5 font-sans text-[13.5px] font-medium text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)] disabled:invisible"
                  >
                    <ArrowLeft size={15} strokeWidth={1.9} /> Voltar
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    disabled={!answered}
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--color-terracotta)] px-6 py-3 font-sans text-[14.5px] font-semibold text-white shadow-[0_10px_26px_rgba(138,78,46,0.22)] transition-all duration-200 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0"
                  >
                    {isLast ? 'Ver resultado' : 'Continuar'}
                    <ArrowRight size={15} strokeWidth={2} />
                  </button>
                </div>
              </motion.div>
            ) : (
              <Resultado key="resultado" answers={answers} onReset={reset} onBack={back} />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-1 flex-col"
    >
      <p className="mb-3 font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-terracotta)]">
        Teste
      </p>
      <h3 className="mb-4 font-serif text-[clamp(24px,2.6vw,32px)] font-medium leading-[1.15] tracking-[-0.02em] text-[var(--color-ink)]">
        Descubra o momento do cuidado
      </h3>
      <p className="mb-auto max-w-[420px] font-sans text-[14.5px] leading-[1.6] text-[var(--color-ink-sub)]">
        Responda com sinceridade. No fim, indicamos o momento e o manual certo para a sua família.
      </p>

      <div className="mt-7 flex items-center justify-between gap-3">
        <span className="font-sans text-[12.5px] font-medium text-[var(--color-ink-muted)]">
          {TOTAL} perguntas · cerca de 2 min
        </span>
        <button
          type="button"
          onClick={onStart}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-terracotta)] px-6 py-3 font-sans text-[14.5px] font-semibold text-white shadow-[0_10px_26px_rgba(138,78,46,0.22)] transition-all duration-200 hover:-translate-y-px"
        >
          Começar <ArrowRight size={15} strokeWidth={2} />
        </button>
      </div>
    </motion.div>
  )
}

function Resultado({
  answers,
  onReset,
  onBack,
}: {
  answers: Record<number, boolean>
  onReset: () => void
  onBack: () => void
}) {
  const { result } = scoreQuiz(answers)
  const manual = MANUAIS[result.manualIndex]

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-1 flex-col"
    >
      <p className="mb-2 font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-terracotta)]">
        {result.eyebrow}
      </p>
      <h3 className="mb-3 font-serif text-[clamp(26px,2.6vw,34px)] font-medium leading-[1.1] tracking-[-0.02em] text-[var(--color-ink)]">
        {result.title}
      </h3>
      <p className="mb-5 font-sans text-[14.5px] leading-[1.6] text-[var(--color-ink-sub)]">
        {result.situation}
      </p>

      <ul className="mb-auto flex flex-col gap-2.5">
        {result.reasons.map((reason) => (
          <li key={reason} className="flex items-start gap-2.5">
            <span className="mt-[3px] flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-green-muted)] text-[var(--color-green)]">
              <Check size={11} strokeWidth={2.6} />
            </span>
            <span className="font-sans text-[13.5px] leading-[1.5] text-[var(--color-ink-sub)]">
              {reason}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-5 rounded-[12px] bg-[rgba(45,95,79,0.05)] px-4 py-3 font-sans text-[13px] italic leading-[1.55] text-[var(--color-ink-sub)]">
        {result.nextStep}
      </p>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 font-sans text-[13.5px] font-medium text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)]"
        >
          <RotateCcw size={14} strokeWidth={1.9} /> Refazer
        </button>
        <Link
          href={`/manuais/${manual.slug}`}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-terracotta)] px-6 py-3 font-sans text-[14.5px] font-semibold text-white no-underline shadow-[0_10px_26px_rgba(138,78,46,0.22)] transition-all duration-200 hover:-translate-y-px"
        >
          Ver o manual {manual.tab} <ArrowRight size={15} strokeWidth={2} />
        </Link>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="mt-4 inline-flex items-center gap-1.5 self-start font-sans text-[12.5px] font-medium text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)]"
      >
        <ArrowLeft size={13} strokeWidth={1.9} /> Revisar respostas
      </button>

      <p className="mt-5 font-sans text-[10.5px] leading-[1.45] text-[var(--color-ink-muted)]/80">
        Triagem familiar — não substitui avaliação médica ou geriátrica.
      </p>
    </motion.div>
  )
}
