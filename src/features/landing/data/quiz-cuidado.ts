/**
 * quiz-cuidado.ts
 * Quiz "Descubra em que momento do cuidado sua família está" —
 * 15 perguntas Sim/Não (pesos 1/2/3), faixas absolutas + overrides de segurança.
 * Base: PPS / SPICT-BR (versão otimizada 23 jul 2026).
 *
 * Conecta: CuidadoQuiz.tsx | mapeia para MANUAIS (fases-cuidado.ts)
 * Camada: shared
 *
 * Mapa clínico completo (dimensão PPS / critério SPICT) é referência INTERNA —
 * não exibir na UI. Ver comentários em QUIZ_QUESTIONS e docs se necessário.
 */

/**
 * Evento de janela para iniciar o quiz a partir de outra seção (ex.: o botão
 * "Descobrir o meu momento" na coluna editorial da MetodologiaSection).
 */
export const START_QUIZ_EVENT = 'senda:start-quiz'

export type CarePhase = 'prevent' | 'care' | 'immediate'

/** Peso clínico: 1 precoce · 2 dependência · 3 alta complexidade. */
export type QuizWeight = 1 | 2 | 3

export interface QuizQuestion {
  id: number
  text: string
  /** Pontos somados quando a resposta é "Sim". */
  points: QuizWeight
}

export interface QuizResult {
  phase: CarePhase
  /** Índice em MANUAIS: 0 = Prevent, 1 = Care, 2 = Immediate. */
  manualIndex: number
  eyebrow: string
  title: string
  /** Texto principal do resultado. */
  situation: string
  /** "O que recomendamos". */
  reasons: string[]
  /** Frase do manual ideal / próximo passo. */
  nextStep: string
}

/**
 * 15 perguntas — pesos alinhados à especificação clínica.
 * ids estáveis para respostas e testes (não renumerar sem migrar analytics).
 */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Peso 1 — sinais precoces
  {
    id: 1,
    text: 'Seu pai/mãe já caiu ou tropeçou nos últimos 6 meses?',
    points: 1,
  },
  {
    id: 2,
    text: 'Ele(a) esquece nomes, compromissos ou eventos recentes com frequência?',
    points: 1,
  },
  {
    id: 3,
    text: 'Seu pai/mãe tem mais de 80 anos?',
    points: 1,
  },
  {
    id: 4,
    text: 'O ambiente da casa onde ele(a) mora oferece risco de queda ou acidente (escadas, tapetes soltos, banheiro sem adaptação)?',
    points: 1,
  },
  // Peso 2 — dependência estabelecida
  {
    id: 5,
    text: 'Seu pai/mãe precisa de ajuda para tomar banho, se vestir ou preparar refeições?',
    points: 2,
  },
  {
    id: 6,
    text: 'Ele(a) tem dificuldade para caminhar ou levantar de uma cadeira sem ajuda?',
    points: 2,
  },
  {
    id: 7,
    text: 'Precisa de auxílio para tomar os medicamentos corretamente?',
    points: 2,
  },
  {
    id: 8,
    text: 'Possui doenças crônicas (diabetes, hipertensão, cardiopatia) que não estão bem controladas?',
    points: 2,
  },
  {
    id: 9,
    text: 'Você, como cuidador(a), está sobrecarregado(a) — mal dorme, não tem tempo para si ou não tem com quem dividir?',
    points: 2,
  },
  // Peso 3 — alta complexidade
  {
    id: 10,
    text: 'Seu pai/mãe apresenta confusão mental, desorientação ou agitação à noite (sundowning)?',
    points: 3,
  },
  {
    id: 11,
    text: 'Ele(a) tem dificuldade para se alimentar sozinho(a) ou come significativamente menos que o habitual?',
    points: 3,
  },
  {
    id: 12,
    text: 'Nos últimos 6 meses, seu pai/mãe foi internado no hospital?',
    points: 3,
  },
  {
    id: 13,
    text: 'Você sente que a saúde dele(a) está piorando mês a mês?',
    points: 3,
  },
  {
    id: 14,
    text: 'Ele(a) precisa de supervisão ou de alguém presente durante a noite?',
    points: 3,
  },
  {
    id: 15,
    text: 'Você precisa tomar decisões urgentes sobre o cuidado agora (cuidador 24h, ILPI, questões jurídicas)?',
    points: 3,
  },
]

/** Soma máxima possível (todas as respostas "Sim") = 32 (4×1 + 5×2 + 6×3). */
export const QUIZ_MAX_POINTS = QUIZ_QUESTIONS.reduce((acc, q) => acc + q.points, 0)

/** IDs das perguntas de peso 3 (overrides de segurança). */
export const QUIZ_WEIGHT3_IDS = QUIZ_QUESTIONS.filter((q) => q.points === 3).map((q) => q.id)

/** Q15 — decisão urgente (override especial). */
export const QUIZ_URGENT_DECISION_ID = 15

export const QUIZ_RESULTS: Record<CarePhase, QuizResult> = {
  prevent: {
    phase: 'prevent',
    manualIndex: 0,
    eyebrow: 'Momento de prevenção',
    title: 'Prevent Care',
    situation:
      'Você está no momento de Prevenção. Seu pai/mãe ainda preserva boa parte da autonomia, mas já existem sinais de que o envelhecimento exige atenção. Este é o momento ideal para se organizar — antes que a urgência chegue.',
    reasons: [
      'Estruturar a casa para evitar quedas',
      'Organizar documentação básica',
      'Iniciar conversas sobre o futuro com a família',
      'Adotar hábitos preventivos de saúde',
    ],
    nextStep:
      'Seu manual ideal: Manual Prevent Care — o guia que ajuda você a construir uma base sólida antes que os desafios cresçam.',
  },
  care: {
    phase: 'care',
    manualIndex: 1,
    eyebrow: 'Momento de cuidado estruturado',
    title: 'Care',
    situation:
      'Você está no momento de Cuidado Estruturado. Seu pai/mãe já precisa de ajuda para atividades do dia a dia. A rotina de cuidado já faz parte da vida da sua família, e o desafio agora é organizar essa rotina para que ela seja sustentável — para ele(a) e para você.',
    reasons: [
      'Estruturar uma rotina de cuidado clara',
      'Dividir responsabilidades entre irmãos e familiares',
      'Organizar documentação e aspectos jurídicos',
      'Adaptar o ambiente doméstico para segurança',
      'Cuidar de quem cuida (você)',
    ],
    nextStep:
      'Seu manual ideal: Manual Care — o sistema que transforma o caos do cuidado diário em uma rotina com dignidade e equilíbrio.',
  },
  immediate: {
    phase: 'immediate',
    manualIndex: 2,
    eyebrow: 'Momento de cuidado intensivo',
    title: 'Immediate Care',
    situation:
      'Você está no momento de Cuidado Intensivo. Seu pai/mãe precisa de suporte contínuo e a situação exige decisões importantes — sobre saúde, jurídico e qualidade de vida. Este é o momento de profissionalizar a gestão do cuidado e proteger o que mais importa.',
    reasons: [
      'Avaliar necessidade de cuidador 24h ou ILPI',
      'Garantir proteção jurídica completa (DAV, procuração, testamento)',
      'Estruturar gestão financeira do cuidado intensivo',
      'Conversar com o geriatra sobre cuidados paliativos',
      'Proteger a saúde mental do cuidador principal',
    ],
    nextStep:
      'Seu manual ideal: Manual Immediate Care — o guia que orienta decisões críticas com segurança técnica, jurídica e humana.',
  },
}

export type QuizScoreMeta = {
  total: number
  /** Fase pela faixa de pontos, antes dos overrides. */
  phaseFromScore: CarePhase
  /** True se alguma regra de sobrescrita elevou para Immediate. */
  overridden: boolean
  weight3YesCount: number
}

function phaseFromTotal(total: number): CarePhase {
  if (total <= 4) return 'prevent'
  if (total <= 12) return 'care'
  return 'immediate'
}

/**
 * Classifica a fase a partir das respostas (id → boolean).
 *
 * Faixas: 0–4 Prevent · 5–12 Care · ≥13 Immediate.
 * Overrides (independente da soma):
 *  1) ≥2 respostas "Sim" em perguntas de peso 3 → Immediate
 *  2) Q15 "Sim" + qualquer outra peso 3 "Sim" → Immediate
 */
export function scoreQuiz(answers: Record<number, boolean>): {
  total: number
  percent: number
  result: QuizResult
  meta: QuizScoreMeta
} {
  const total = QUIZ_QUESTIONS.reduce(
    (acc, q) => (answers[q.id] ? acc + q.points : acc),
    0,
  )
  const percent = QUIZ_MAX_POINTS > 0 ? total / QUIZ_MAX_POINTS : 0

  const weight3Yes = QUIZ_WEIGHT3_IDS.filter((id) => answers[id] === true)
  const weight3YesCount = weight3Yes.length
  const urgentYes = answers[QUIZ_URGENT_DECISION_ID] === true
  const otherWeight3Yes = weight3Yes.some((id) => id !== QUIZ_URGENT_DECISION_ID)

  const phaseFromScore = phaseFromTotal(total)
  const overrideByCount = weight3YesCount >= 2
  const overrideByUrgent = urgentYes && otherWeight3Yes
  const overridden = overrideByCount || overrideByUrgent

  const phase: CarePhase = overridden ? 'immediate' : phaseFromScore

  return {
    total,
    percent,
    result: QUIZ_RESULTS[phase],
    meta: {
      total,
      phaseFromScore,
      overridden,
      weight3YesCount,
    },
  }
}
