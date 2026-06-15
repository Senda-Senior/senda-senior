/**
 * auth.ts (middleware)
 * Resolve do user via Supabase no middleware — sincroniza cookies de sessão para request/response
 *
 * Conecta: importa @supabase/ssr, env, headers.ts | importado em middleware.ts
 * Camada: edge (middleware)
 */

import { createServerClient } from '@supabase/ssr'
import type { User } from '@supabase/supabase-js'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { env } from '@/config/env'
import { IS_PROD } from './headers'

type ResolveAuthUserParams = {
  request: NextRequest
  response: NextResponse
  forwardedHeaders: Headers
  csp: string
  createSecuredResponse: (forwardedHeaders: Headers, csp: string) => NextResponse
}

export async function resolveAuthUser({
  request,
  response,
  forwardedHeaders,
  csp,
  createSecuredResponse,
}: ResolveAuthUserParams): Promise<{ user: User | null; response: NextResponse }> {
  let nextResponse = response

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))

          nextResponse = createSecuredResponse(forwardedHeaders, csp)

          cookiesToSet.forEach(({ name, value, options }) =>
            nextResponse.cookies.set(name, value, {
              ...options,
              httpOnly: true,
              secure: IS_PROD,
              sameSite: 'lax',
              path: '/',
            }),
          )
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { user, response: nextResponse }
}
