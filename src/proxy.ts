/**
 * proxy.ts
 * Edge middleware para Next.js 16 — aplica rate-limit, CSP, security headers e redireciona rotas protegidas.
 *
 * Conecta: checkRateLimit, buildCSP, createForwardedHeaders, createSecuredNextResponse (lib/server/proxy)
 * Camada: edge
 */

import { NextResponse, type NextRequest } from 'next/server'
import type { User } from '@supabase/supabase-js'
import { checkRateLimit } from '@/lib/server'
import {
  resolveAuthUser,
  buildCSP,
  createForwardedHeaders,
  createSecuredNextResponse,
  extractIp,
  generateNonce,
  getRouteFlags,
  pickBucket,
  shouldRateLimit,
} from '@/lib/server/proxy'

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const nonce = generateNonce()
  const routeFlags = getRouteFlags(pathname)
  const cspMode = routeFlags.useStrictCSP ? 'strict-nonce' : 'public-static'
  const csp = buildCSP(nonce, cspMode)

  if (shouldRateLimit(pathname)) {
    const rl = await checkRateLimit(extractIp(request), pickBucket(pathname))
    if (!rl.success) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((rl.reset - Date.now()) / 1000).toString(),
          'X-RateLimit-Remaining': rl.remaining.toString(),
          'X-RateLimit-Mode': rl.mode,
        },
      })
    }
  }

  const forwardedHeaders = createForwardedHeaders(
    request,
    pathname,
    nonce,
    csp,
    cspMode,
  )

  let response = createSecuredNextResponse(forwardedHeaders, csp, cspMode)

  let user: User | null = null

  if (routeFlags.authRelevantRoute) {
    const authState = await resolveAuthUser({
      request,
      response,
      forwardedHeaders,
      csp,
      createSecuredResponse: (headers, nextCsp) =>
        createSecuredNextResponse(headers, nextCsp, cspMode),
    })
    user = authState.user
    response = authState.response
  }

  if (!user && routeFlags.isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  if (user && routeFlags.isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
