/**
 * rate-limit.ts
 * Rate limiting com dois modos: distribuído (Upstash Redis) ou in-memory (fallback dev) — checkRateLimit(identifier, bucket)
 *
 * Conecta: importa @upstash/ratelimit, env.server | importado em edge middleware/server
 * Camada: server (server-only)
 */

import 'server-only'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { serverEnv } from '@/config/env.server'

/**
 * ─── rate-limit ────────────────────────────────────────────────────
 *
 * Dois modos:
 *
 *   1. distribuído (produção): Upstash Redis via REST. Funciona em
 *      edge e serverless, sobrevive a múltiplas instâncias.
 *
 *   2. in-memory (dev/preview): mapa simples por processo. Cada
 *      instância tem seu próprio contador — aceitável para dev.
 *
 * Exponha apenas `checkRateLimit(identifier, bucket)`. O chamador
 * não precisa saber qual modo está ativo.
 * ───────────────────────────────────────────────────────────────────
 */

export type RateLimitBucket = 'global' | 'auth' | 'upload'

const WINDOW_MS = 60_000

const BUCKETS: Record<RateLimitBucket, { max: number; window: `${number} s` }> = {
  global: { max: 100, window: '60 s' },
  auth: { max: 10, window: '60 s' },
  upload: { max: 30, window: '60 s' },
}

const RATE_LIMIT_DISABLED_FOR_E2E = serverEnv.E2E_DISABLE_RATE_LIMIT === 'true'

if (RATE_LIMIT_DISABLED_FOR_E2E && !['development', 'test'].includes(process.env.NODE_ENV ?? '')) {
  throw new Error('E2E_DISABLE_RATE_LIMIT is only allowed in development or test environments')
}

// ─── modo distribuído (se env estiver presente) ─────────────────────

const redis =
  serverEnv.UPSTASH_REDIS_REST_URL && serverEnv.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: serverEnv.UPSTASH_REDIS_REST_URL,
        token: serverEnv.UPSTASH_REDIS_REST_TOKEN,
      })
    : null

const distributedLimiters: Record<RateLimitBucket, Ratelimit> | null = redis
  ? (Object.fromEntries(
      (Object.keys(BUCKETS) as RateLimitBucket[]).map((bucket) => [
        bucket,
        new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(
            BUCKETS[bucket].max,
            BUCKETS[bucket].window,
          ),
          prefix: `rl:${bucket}`,
          analytics: false,
        }),
      ]),
    ) as Record<RateLimitBucket, Ratelimit>)
  : null

// ─── fallback in-memory ─────────────────────────────────────────────

const memoryStore = new Map<string, { count: number; resetAt: number }>()

function checkInMemory(
  identifier: string,
  bucket: RateLimitBucket,
): { success: boolean; remaining: number; reset: number } {
  const key = `${bucket}:${identifier}`
  const limit = BUCKETS[bucket].max
  const now = Date.now()
  const entry = memoryStore.get(key)

  if (!entry || now > entry.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return { success: true, remaining: limit - 1, reset: now + WINDOW_MS }
  }

  entry.count++
  return {
    success: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    reset: entry.resetAt,
  }
}

// ─── api pública ────────────────────────────────────────────────────

export interface RateLimitResult {
  success: boolean
  remaining: number
  reset: number
  mode: 'distributed' | 'memory'
}

export async function checkRateLimit(
  identifier: string,
  bucket: RateLimitBucket = 'global',
): Promise<RateLimitResult> {
  if (RATE_LIMIT_DISABLED_FOR_E2E) {
    return {
      success: true,
      remaining: BUCKETS[bucket].max,
      reset: Date.now() + WINDOW_MS,
      mode: 'memory',
    }
  }

  if (distributedLimiters) {
    try {
      const limiter = distributedLimiters[bucket]
      const { success, remaining, reset } = await limiter.limit(identifier)
      return { success, remaining, reset, mode: 'distributed' }
    } catch (err) {
      console.error('[rate-limit] Redis error, falling back to in-memory', err)
    }
  }
  return { ...checkInMemory(identifier, bucket), mode: 'memory' }
}

export const RATE_LIMIT_CONFIG = BUCKETS
