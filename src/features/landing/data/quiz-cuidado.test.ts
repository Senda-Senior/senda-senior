/**
 * quiz-cuidado.test.ts
 * Faixas absolutas + overrides de segurança do questionário clínico.
 */

import { describe, expect, it } from 'vitest'
import {
  QUIZ_MAX_POINTS,
  QUIZ_QUESTIONS,
  QUIZ_URGENT_DECISION_ID,
  scoreQuiz,
} from './quiz-cuidado'

function yes(...ids: number[]): Record<number, boolean> {
  const answers: Record<number, boolean> = {}
  for (const q of QUIZ_QUESTIONS) answers[q.id] = false
  for (const id of ids) answers[id] = true
  return answers
}

describe('quiz-cuidado', () => {
  it('tem 15 perguntas e máximo 32', () => {
    expect(QUIZ_QUESTIONS).toHaveLength(15)
    expect(QUIZ_MAX_POINTS).toBe(32)
  })

  it('0–4 → Prevent', () => {
    expect(scoreQuiz(yes()).result.phase).toBe('prevent')
    expect(scoreQuiz(yes(1, 2, 3, 4)).result.phase).toBe('prevent') // 4 pts
    expect(scoreQuiz(yes(1, 2, 3, 4)).meta.overridden).toBe(false)
  })

  it('5–12 → Care (sem override)', () => {
    // Q5 (2) + Q6 (2) + Q1 (1) = 5
    const r = scoreQuiz(yes(5, 6, 1))
    expect(r.total).toBe(5)
    expect(r.result.phase).toBe('care')
    expect(r.meta.overridden).toBe(false)
  })

  it('≥13 → Immediate pela faixa', () => {
    // Q10–Q13 = 12; + Q5 = 14
    const r = scoreQuiz(yes(10, 11, 12, 13, 5))
    expect(r.total).toBe(14)
    expect(r.result.phase).toBe('immediate')
  })

  it('override: ≥2 peso 3 eleva Care → Immediate', () => {
    // Q12+Q14 = 6 → Care por faixa; 2× peso 3 → Immediate
    const low = scoreQuiz(yes(12, 14))
    expect(low.total).toBe(6)
    expect(low.meta.phaseFromScore).toBe('care')
    expect(low.meta.overridden).toBe(true)
    expect(low.result.phase).toBe('immediate')
  })

  it('override: Q15 + outro peso 3 → Immediate', () => {
    // Q15 (3) + Q10 (3) = 6 → Care por faixa, Immediate por override
    const r = scoreQuiz(yes(QUIZ_URGENT_DECISION_ID, 10))
    expect(r.total).toBe(6)
    expect(r.meta.phaseFromScore).toBe('care')
    expect(r.meta.overridden).toBe(true)
    expect(r.result.phase).toBe('immediate')
  })

  it('Q15 sozinho não força Immediate', () => {
    const r = scoreQuiz(yes(QUIZ_URGENT_DECISION_ID))
    expect(r.total).toBe(3)
    expect(r.meta.overridden).toBe(false)
    expect(r.result.phase).toBe('prevent')
  })

  it('um único peso 3 sem Q15 não força Immediate', () => {
    const r = scoreQuiz(yes(12))
    expect(r.total).toBe(3)
    expect(r.meta.overridden).toBe(false)
    expect(r.result.phase).toBe('prevent')
  })
})
