/**
 * index.ts (middleware)
 * Barrel export de middleware utilities — auth, headers, routes
 *
 * Conecta: re-exporta auth.ts, headers.ts, routes.ts | importado em middleware.ts
 * Camada: edge (middleware)
 */

export { resolveAuthUser } from './auth'
export {
  IS_PROD,
  applySecurityHeaders,
  buildCSP,
  createForwardedHeaders,
  createSecuredNextResponse,
  extractIp,
  generateNonce,
} from './headers'
export {
  AUTH_PREFIXES,
  PROTECTED_PREFIXES,
  STRICT_CSP_PREFIXES,
  getRouteFlags,
  matchesPrefix,
  pickBucket,
  shouldRateLimit,
} from './routes'
export type { RateLimitBucket } from './routes'
