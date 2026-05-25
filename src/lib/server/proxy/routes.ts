export const PROTECTED_PREFIXES = [
  '/dashboard',
  '/update-password',
  '/vault',
  '/health',
  '/profile',
  '/settings',
  '/help',
  '/pricing',
] as const
export const AUTH_PREFIXES = ['/login'] as const

// Apenas rotas com force-dynamic (SSR) podem usar nonce-based CSP.
// O Next.js só injeta nonces nos scripts do framework durante SSR.
// Páginas 'use client' estáticas (/login, /update-password) usam
// public-static (unsafe-inline) — não renderizam conteúdo do usuário.
export const STRICT_CSP_PREFIXES = [
  '/dashboard',
  '/vault',
  '/health',
  '/profile',
  '/settings',
  '/help',
  '/pricing',
] as const
const RATE_LIMIT_ONLY_PREFIXES = ['/auth'] as const

export type RateLimitBucket = 'global' | 'auth' | 'upload'

export function matchesPrefix(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some((prefix) => pathname.startsWith(prefix))
}

export function shouldRateLimit(pathname: string): boolean {
  if (pathname.startsWith('/api/')) return true
  if (matchesPrefix(pathname, PROTECTED_PREFIXES)) return true
  if (matchesPrefix(pathname, AUTH_PREFIXES)) return true
  if (matchesPrefix(pathname, RATE_LIMIT_ONLY_PREFIXES)) return true
  return false
}

export function pickBucket(pathname: string): RateLimitBucket {
  if (pathname.startsWith('/api/vault/upload')) return 'upload'
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/update-password') ||
    pathname.startsWith('/auth')
  ) {
    return 'auth'
  }
  return 'global'
}

export function getRouteFlags(pathname: string) {
  const isProtectedRoute = matchesPrefix(pathname, PROTECTED_PREFIXES)
  const isAuthRoute = matchesPrefix(pathname, AUTH_PREFIXES)
  const useStrictCSP = matchesPrefix(pathname, STRICT_CSP_PREFIXES)

  return {
    isProtectedRoute,
    isAuthRoute,
    authRelevantRoute: isProtectedRoute || isAuthRoute,
    useStrictCSP,
  }
}
