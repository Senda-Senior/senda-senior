/**
 * ─── classifier ────────────────────────────────────────────────────
 *
 * Algoritmo de auto-categorização. Multi-signal scoring:
 *
 * 1. cada fonte (nome, mime, extensão, conteúdo, regra de user, user_override)
 *    emite votos ponderados para uma ou mais categorias.
 * 2. agrega votos por categoria (soma de pesos).
 * 3. normaliza pelo total emitido → confidence ∈ [0, 1].
 * 4. abaixo do threshold → 'outros'.
 *
 * Suporta:
 * - Regex + dicionário por categoria
 * - Extensão e MIME hints
 * - Fuzzy matching (levenshtein) para variations
 * - Feedback loop (user_overrides) persistente
 *
 * Função pura (exceto getUserOverrides que é IO).
 * Determinística com mesma entrada + overrides.
 *
 * Spec: docs/vault/classification.md
 * ───────────────────────────────────────────────────────────────────
 */

import type { SystemCategorySlug } from './categories'
import { FALLBACK_CATEGORY } from './categories'

// ─── config ─────────────────────────────────────────────────────────

export const CLASSIFIER_WEIGHTS = {
  filename_regex: 3,
  filename_dict: 2,
  extension_hint: 1,
  mime_hint: 1,
  size_hint: 0.5,
  content_regex: 4,
  content_dict: 3,
  user_rule: 8,
  user_override: 12,
} as const

export const CLASSIFIER_CONFIDENCE_THRESHOLD = 0.55
export const FUZZY_THRESHOLD = 0.82 // 0-1, higher = stricter

// ─── tipos ──────────────────────────────────────────────────────────

export interface ClassifierInput {
  name: string
  mime: string
  size: number
  content?: string // texto extraído (ocr) — opcional, futuro
  userId?: string
}

export interface ClassifierSignal {
  source: keyof typeof CLASSIFIER_WEIGHTS
  category: SystemCategorySlug
  weight: number
  match?: string // o termo/regex que casou (para audit)
}

export interface ClassifierOutput {
  categorySlug: SystemCategorySlug
  confidence: number
  signals: ClassifierSignal[]
}

export interface FileNameClassification {
  category: SystemCategorySlug
  confidence: number
  signals: ClassifierSignal[]
}

export interface UserOverride {
  userId?: string
  pattern: string // normalized pattern that triggered match
  category: SystemCategorySlug
  weight: number // positive = reinforce, negative = suppress
  createdAt: string
}

// ─── normalização ───────────────────────────────────────────────────

/** lowercase + remove acentos + colapsa whitespace + troca _/-. */
function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[_\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Lazy-loaded user overrides cache.
 * Call `clearOverrideCache()` to reset (useful for testing).
 */
const DEFAULT_OVERRIDE_CACHE_KEY = '__default__'
const _cachedOverridesByUser = new Map<string, UserOverride[]>()

function getOverrideCacheKey(userId?: string): string {
  return userId?.trim() || DEFAULT_OVERRIDE_CACHE_KEY
}

export function setUserOverrides(userId: string, overrides: UserOverride[]): void
export function setUserOverrides(overrides: UserOverride[]): void
export function setUserOverrides(
  userIdOrOverrides: string | UserOverride[],
  maybeOverrides?: UserOverride[],
): void {
  if (typeof userIdOrOverrides === 'string') {
    _cachedOverridesByUser.set(
      getOverrideCacheKey(userIdOrOverrides),
      maybeOverrides ?? [],
    )
    return
  }

  _cachedOverridesByUser.set(DEFAULT_OVERRIDE_CACHE_KEY, userIdOrOverrides)
}

export function clearOverrideCache(userId?: string): void {
  if (userId) {
    _cachedOverridesByUser.delete(getOverrideCacheKey(userId))
    return
  }

  _cachedOverridesByUser.clear()
}

export function getUserOverrides(userId?: string): UserOverride[] {
  return _cachedOverridesByUser.get(getOverrideCacheKey(userId)) ?? []
}

// ─── fuzzy matching (levenshtein) ───────────────────────────────────

function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length
  const matrix: number[][] = []
  for (let i = 0; i <= b.length; i++) matrix[i] = [i]
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = b[i - 1] === a[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      )
    }
  }
  return matrix[b.length][a.length]
}

function fuzzyMatch(term: string, text: string): boolean {
  const normalizedText = normalize(text)
  const normalizedTerm = normalize(term)
  // Exact match
  if (normalizedText.includes(normalizedTerm)) return true
  // Fuzzy match for terms >= 4 chars
  if (normalizedTerm.length >= 4) {
    const words = normalizedText.split(' ').filter((w) => w.length >= 4)
    for (const word of words) {
      const maxLen = Math.max(word.length, normalizedTerm.length)
      const distance = levenshtein(word, normalizedTerm)
      const similarity = 1 - distance / maxLen
      if (similarity >= FUZZY_THRESHOLD) return true
    }
  }
  return false
}

// ─── dicionários por categoria ──────────────────────────────────────

interface CategoryDict {
  regex: RegExp[]
  terms: string[]
}

// ─── dicionários por categoria ──────────────────────────────────────

const FILENAME_DICT: Record<SystemCategorySlug, CategoryDict> = {
  juridico: {
    regex: [
      /\b(contrato|procuracao|testamento|diretiva|escritura|certidao)\b/,
      /\b(rg|cpf|cnh|passaporte|titulo\s*eleitor)\b/,
      /\bdoc(umento)?\s*pessoal\b/,
    ].map(rx => rx),
    terms: ['advogado', 'cartorio', 'tabelionato', 'oab', 'notarial', 'inventario'],
  },
  saude: {
    regex: [
      /\b(exame|laudo|receita|prescricao|atestado|prontuario)\b/,
      /\b(medicamento|remedio|consulta|medico)\b/,
    ].map(rx => rx),
    terms: [
      'hemograma', 'ressonancia', 'tomografia', 'ultrassom', 'raio x', 'rx',
      'ecg', 'eletrocardiograma', 'cardiologista', 'endocrino', 'oftalmo',
    ],
  },
  financeiro: {
    regex: [
      /\b(fatura|boleto|extrato|imposto|irpf|darf|nota\s*fiscal|nfe|nfse|nfs-?e)\b/,
      /\b(recibo|comprovante|pagamento|transferencia|pix|ted|doc)\b/,
      /\bir\s*\d{2,4}\b/,
    ].map(rx => rx),
    terms: [
      'banco', 'banco do brasil', 'caixa', 'itau', 'bradesco',
      'santander', 'nubank', 'inter', 'c6', 'btg', 'sicredi',
    ],
  },
  trabalho: {
    regex: [
      /\b(holerite|contracheque|folha\s*de\s*pagamento|admissao|demissao)\b/,
      /\b(ctps|pis|fgts|inss|rescisao|asu|acordo\s*coletivo)\b/,
      /\bcontrato\s*de\s*trabalho\b/,
    ].map(rx => rx),
    terms: ['rh', 'recursos humanos', 'empregador'],
  },
  viagem: {
    regex: [
      /\b(passagem|reserva|voucher|itinerario|hotel|hospedagem|voo)\b/,
      /\b(passaporte|visto|embarque|checkin|check in)\b/,
    ].map(rx => rx),
    terms: ['latam', 'gol', 'azul', 'booking', 'airbnb', 'decolar'],
  },
  imoveis: {
    regex: [
      /\b(iptu|condominio|escritura|financiamento|imovel)\b/,
      /\b(aluguel|locacao|usufruto|matricula)\b/,
    ].map(rx => rx),
    terms: ['cartorio de imoveis', 'cri', 'sindico'],
  },
  seguros: {
    regex: [
      /\b(seguro|apolice|sinistro|capitalizacao|resseguro)\b/i,
      /\b(premio|carencia|apolice\s*de\s*vida)\b/i,
    ].map(rx => rx),
    terms: [
      'seguro de vida', 'seguro saude', 'seguro residencial',
      'seguro veiculo',
    ],
  },
  previdencia: {
    regex: [
      /\bextrato\s*inss\s*beneficio\b/i,
      /\b(previdencia|pgbl|pgbil|vbgf|reserva\s*matematica)\b/i,
      /\b(beneficio\s*previdenciario|contribuicao\s*previdenciaria)\b/i,
      /\b(extrato\s*inss|inss\s*beneficio|beneficio)\b/i,
    ].map(rx => rx),
    terms: [
      'previdencia social', 'previdencia complementar', 'fgts',
      'fundo de pensao', 'risco', 'sobrevivencia', 'inss beneficio',
    ],
  },
  familia: {
    regex: [
      /\bcertidao\s*(de\s*)?(nascimento|casamento|obito)\b/i,
      /\b(certidao|casamento|nascimento|obito)\b/i,
      /\b(registro\s*civil|power\s*of\s*attorney|familiar)\b/i,
    ].map(rx => rx),
    terms: [
      'certidao de casamento', 'certidao de nascimento', 'certidao de obito',
      'registro civil', 'autorizacao de viagem', 'visto familiar',
    ],
  },
  pessoal: { regex: [], terms: [] },
  outros: { regex: [], terms: [] },
}

const EXT_HINTS: Partial<Record<SystemCategorySlug, string[]>> = {
  saude: ['dcm', 'dicom'],
  financeiro: ['ofx', 'qif'],
}

const MIME_HINTS: Partial<Record<SystemCategorySlug, string[]>> = {
  saude: ['application/dicom', 'image/dicom'],
  financeiro: ['application/vnd.ms-excel', 'application/x-ofx'],
}

// ─── funções de signal ──────────────────────────────────────────────

function scanText(
  text: string,
  source: 'filename_regex' | 'filename_dict' | 'content_regex' | 'content_dict',
): ClassifierSignal[] {
  const out: ClassifierSignal[] = []
  const norm = normalize(text)

  for (const [slug, dict] of Object.entries(FILENAME_DICT) as Array<
    [SystemCategorySlug, CategoryDict]
  >) {
    if (slug === 'pessoal' || slug === 'outros') continue

    if (source === 'filename_regex' || source === 'content_regex') {
      for (const rx of dict.regex) {
        const match = norm.match(rx)
        if (match) {
          out.push({
            source,
            category: slug,
            weight: CLASSIFIER_WEIGHTS[source],
            match: match[0],
          })
        }
      }
    } else {
      for (const term of dict.terms) {
        if (fuzzyMatch(term, norm)) {
          out.push({
            source,
            category: slug,
            weight: CLASSIFIER_WEIGHTS[source],
            match: term,
          })
        }
      }
    }
  }

  return out
}

function scanExtension(ext: string): ClassifierSignal[] {
  const out: ClassifierSignal[] = []
  const e = ext.toLowerCase().replace(/^\./, '')
  for (const [slug, exts] of Object.entries(EXT_HINTS) as Array<
    [SystemCategorySlug, string[]]
  >) {
    if (exts.includes(e)) {
      out.push({
        source: 'extension_hint',
        category: slug,
        weight: CLASSIFIER_WEIGHTS.extension_hint,
        match: e,
      })
    }
  }
  return out
}

function scanMime(mime: string): ClassifierSignal[] {
  const out: ClassifierSignal[] = []
  const m = mime.toLowerCase().trim()
  for (const [slug, mimes] of Object.entries(MIME_HINTS) as Array<
    [SystemCategorySlug, string[]]
  >) {
    if (mimes.includes(m)) {
      out.push({
        source: 'mime_hint',
        category: slug,
        weight: CLASSIFIER_WEIGHTS.mime_hint,
        match: m,
      })
    }
  }
  return out
}

function scanUserOverrides(text: string, userId?: string): ClassifierSignal[] {
  const out: ClassifierSignal[] = []
  const overrides = getUserOverrides(userId)

  for (const override of overrides) {
    const normText = normalize(text)
    if (fuzzyMatch(override.pattern, normText)) {
      out.push({
        source: 'user_override',
        category: override.category,
        weight: override.weight,
        match: override.pattern,
      })
    }
  }

  return out
}

// ─── api pública ────────────────────────────────────────────────────

/**
 * Classifica um arquivo. Retorna sempre um resultado — em pior caso,
 * `categorySlug = 'outros'` com `confidence = 0`.
 */
export function classify(input: ClassifierInput): ClassifierOutput {
  const signals: ClassifierSignal[] = []

  // separa nome de extensão se vier junto
  const lastDot = input.name.lastIndexOf('.')
  const baseName = lastDot > 0 ? input.name.slice(0, lastDot) : input.name
  const ext = lastDot > 0 ? input.name.slice(lastDot + 1) : ''

  signals.push(...scanText(baseName, 'filename_regex'))
  signals.push(...scanText(baseName, 'filename_dict'))
  signals.push(...scanExtension(ext))
  signals.push(...scanMime(input.mime))
  signals.push(...scanUserOverrides(baseName, input.userId))

  if (input.content && input.content.length > 0) {
    signals.push(...scanText(input.content, 'content_regex'))
    signals.push(...scanText(input.content, 'content_dict'))
  }

  return aggregate(signals)
}

export function classifyFileName(
  filename: string,
  userId?: string,
): FileNameClassification {
  const result = classify({
    name: filename,
    mime: '',
    size: 0,
    userId,
  })

  return {
    category: result.categorySlug,
    confidence: result.confidence,
    signals: result.signals,
  }
}

function aggregate(signals: ClassifierSignal[]): ClassifierOutput {
  if (signals.length === 0) {
    return { categorySlug: FALLBACK_CATEGORY, confidence: 0, signals: [] }
  }

  const scores = new Map<SystemCategorySlug, number>()
  let total = 0

  for (const s of signals) {
    scores.set(s.category, (scores.get(s.category) ?? 0) + s.weight)
    total += s.weight
  }

  let winner: SystemCategorySlug = FALLBACK_CATEGORY
  let winnerScore = 0
  for (const [cat, score] of scores) {
    if (score > winnerScore) {
      winnerScore = score
      winner = cat
    }
  }

  const confidence = total > 0 ? winnerScore / total : 0

  if (confidence < CLASSIFIER_CONFIDENCE_THRESHOLD) {
    return { categorySlug: FALLBACK_CATEGORY, confidence, signals }
  }

  return { categorySlug: winner, confidence, signals }
}

/**
 * Registra novo override do usuário (chamado pelo action após manual override).
 * Retorna o override criado para persistência no banco.
 */
export function createOverride(
  userId: string,
  matchedPattern: string,
  category: SystemCategorySlug,
): UserOverride
export function createOverride(
  matchedPattern: string,
  category: SystemCategorySlug,
): UserOverride
export function createOverride(
  userIdOrPattern: string,
  matchedPatternOrCategory: string | SystemCategorySlug,
  maybeCategory?: SystemCategorySlug,
): UserOverride {
  const hasExplicitUserId = maybeCategory !== undefined
  const userId = hasExplicitUserId ? userIdOrPattern : undefined
  const matchedPattern = hasExplicitUserId
    ? (matchedPatternOrCategory as string)
    : userIdOrPattern
  const category = hasExplicitUserId
    ? maybeCategory
    : (matchedPatternOrCategory as SystemCategorySlug)
  const override: UserOverride = {
    userId,
    pattern: normalize(matchedPattern),
    category: category as SystemCategorySlug,
    weight: CLASSIFIER_WEIGHTS.user_override,
    createdAt: new Date().toISOString(),
  }

  // Append to cache (in production, this would also persist to DB)
  const existing = getUserOverrides(userId)
  const updated = existing.filter((o) => o.pattern !== override.pattern)
  updated.push(override)
  if (userId) {
    setUserOverrides(userId, updated)
  } else {
    setUserOverrides(updated)
  }

  return override
}

/**
 * Extrai o padrão relevante de um nome de arquivo para criar override.
 * Usa o termo mais específico que casou.
 */
export function extractOverridePattern(filename: string): string {
  const lastDot = filename.lastIndexOf('.')
  const baseName = lastDot > 0 ? filename.slice(0, lastDot) : filename
  const norm = normalize(baseName)

  // Find the longest matching term from any dictionary
  let longestMatch = ''
  for (const [, dict] of Object.entries(FILENAME_DICT) as Array<
    [SystemCategorySlug, CategoryDict]
  >) {
    for (const term of dict.terms) {
      if (fuzzyMatch(term, norm) && term.length > longestMatch.length) {
        longestMatch = term
      }
    }
    for (const rx of dict.regex) {
      const match = norm.match(rx)
      if (match && match[0].length > longestMatch.length) {
        longestMatch = match[0]
      }
    }
  }

  return longestMatch || norm.slice(0, 32)
}
