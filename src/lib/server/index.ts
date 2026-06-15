/**
 * index.ts
 * Barrel export de utilitários server — auth, profile, rate-limit, csrf
 *
 * Conecta: re-exporta auth.ts, profile.ts, rate-limit.ts, csrf.ts | importado em server actions
 * Camada: server (server-only)
 */

export { getUser, requireUser } from './auth'
export { getProfile, updateDisplayName } from './profile'
export { checkRateLimit } from './rate-limit'
export { assertSameOrigin } from './csrf'
