/**
 * quiz-cuidado.ts
 * Dados e lógica do quiz "Qual manual é para você?" — perguntas Sim/Não com pontos
 * ponderados por gravidade e faixas que mapeiam para os 3 manuais (Prevent/Care/Immediate).
 *
 * Conecta: CuidadoQuiz.tsx | mapeia para MANUAIS de fases-cuidado.ts (manualIndex)
 * Camada: shared
 *
 * Lógica baseada em SendaSeniorQuiz.js (soma de pontos → faixa). Copy das perguntas e
 * resultados adaptada de senna-senior-quiz-copy-ref.md. "Sim" sempre indica MAIOR
 * necessidade de cuidado, então mais "Sim" → fase mais avançada.
 */

export type CarePhase = 'prevent' | 'care' | 'immediate'

export interface QuizQuestion {
  id: number
  /** Pergunta fechada (Sim/Não). */
  text: string
  /** Pontos somados quando a resposta é "Sim" — ponderados por gravidade clínica/social. */
  points: number
}

export interface QuizResult {
  phase: CarePhase
  /** Índice em MANUAIS (fases-cuidado.ts): 0 = Prevent, 1 = Care, 2 = Immediate. */
  manualIndex: number
  eyebrow: string
  title: string
  /** "Situação típica" — descreve em uma frase quem cai nessa faixa. */
  situation: string
  /** "Por que este manual é para você" — bullets. */
  reasons: string[]
  /** Próximo passo recomendado. */
  nextStep: string
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 1, text: 'Seu pai/mãe tem dificuldade para realizar atividades do dia a dia sem ajuda?', points: 10 },
  { id: 2, text: 'Houve quedas nos últimos 6 meses?', points: 15 },
  { id: 3, text: 'Esquece nomes ou eventos recentes com frequência?', points: 10 },
  { id: 4, text: 'Tem dificuldade de locomoção ou equilíbrio?', points: 12 },
  { id: 5, text: 'Precisa de auxílio para tomar os medicamentos corretamente?', points: 10 },
  { id: 6, text: 'Tem dificuldade para manter a própria higiene pessoal?', points: 15 },
  { id: 7, text: 'Apresenta confusão mental ou agitação à noite?', points: 18 },
  { id: 8, text: 'Possui doenças crônicas que não estão bem controladas?', points: 12 },
  { id: 9, text: 'Precisa de supervisão ou de alguém presente durante a noite?', points: 18 },
  { id: 10, text: 'Você, como cuidador(a), está sobrecarregado(a) — mal dorme ou não tem com quem dividir?', points: 12 },
  { id: 11, text: 'O ambiente da casa oferece risco de queda ou acidente (não está adaptado)?', points: 8 },
  { id: 12, text: 'Você precisa tomar decisões urgentes sobre o cuidado agora?', points: 20 },
]

/** Soma máxima possível (todas as respostas "Sim"). */
export const QUIZ_MAX_POINTS = QUIZ_QUESTIONS.reduce((acc, q) => acc + q.points, 0)

export const QUIZ_RESULTS: Record<CarePhase, QuizResult> = {
  prevent: {
    phase: 'prevent',
    manualIndex: 0,
    eyebrow: 'Fase 1 · Prevenção',
    title: 'Prevent Care',
    situation:
      'Seu pai/mãe ainda é autônomo(a), mas você já percebe sinais de envelhecimento. É hora de agir antes da crise.',
    reasons: [
      'Conversar sobre saúde, dinheiro e futuro sem confronto',
      'Organizar documentos, medicações e contatos de forma estruturada',
      'Adaptar a casa para a segurança preservando a autonomia',
      'Montar um plano legal (procurações, diretivas) com calma',
    ],
    nextStep: 'Você tem tempo — use-o a seu favor e comece a estruturar agora.',
  },
  care: {
    phase: 'care',
    manualIndex: 1,
    eyebrow: 'Fase 2 · Cuidado assistido',
    title: 'Care',
    situation:
      'Seu pai/mãe já precisa de ajuda em atividades diárias e você está sentindo o peso. É hora de estruturar agora.',
    reasons: [
      'Criar uma rotina diária que funciona, sem improviso',
      'Dividir tarefas com irmãos sem gerar conflito',
      'Mapear custos reais e montar um plano financeiro claro',
      'Proteger sua saúde mental como cuidador(a) principal',
    ],
    nextStep: 'Comece a implementar a rotina e a divisão de responsabilidades ainda esta semana.',
  },
  immediate: {
    phase: 'immediate',
    manualIndex: 2,
    eyebrow: 'Fase 3 · Cuidado imediato',
    title: 'Immediate Care',
    situation:
      'Seu pai/mãe precisa de vigilância constante, ou você está em crise. É hora de suporte imediato.',
    reasons: [
      'Avaliar se o cuidado domiciliar ainda é seguro ou se a ILPI é a melhor opção',
      'Estruturar vigilância 24h com protocolo profissional',
      'Tomar decisões difíceis com critério, não com culpa',
      'Proteger legalmente tudo (DAV, procurações, sucessório)',
    ],
    nextStep: 'Não espere — comece pelo manual hoje e considere a assessoria personalizada.',
  },
}

/**
 * Calcula a fase de cuidado a partir das respostas (id → boolean).
 * Soma os pontos das respostas "Sim" e divide em 3 faixas por percentual do máximo:
 *   ≤ 33% → prevent · ≤ 66% → care · > 66% → immediate.
 */
export function scoreQuiz(answers: Record<number, boolean>): {
  total: number
  percent: number
  result: QuizResult
} {
  const total = QUIZ_QUESTIONS.reduce(
    (acc, q) => (answers[q.id] ? acc + q.points : acc),
    0,
  )
  const percent = QUIZ_MAX_POINTS > 0 ? total / QUIZ_MAX_POINTS : 0

  const phase: CarePhase = percent <= 0.33 ? 'prevent' : percent <= 0.66 ? 'care' : 'immediate'

  return { total, percent, result: QUIZ_RESULTS[phase] }
}
