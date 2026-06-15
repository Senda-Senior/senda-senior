/**
 * auth/callback/route.ts
 * Route handler PKCE do Supabase — troca code por sessão e popula display_name do profile
 *
 * Conecta: createServerClient (supabase/ssr) | persiste nome de user_metadata no profile (auth.users)
 * Camada: server (route handler GET)
 */

import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/config/env'
import { IS_PROD } from '@/lib/server/proxy/headers'
function safeNextParam(next: string | null, fallback: string): string {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.includes('\\')) {
    return fallback
  }
  return next
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = safeNextParam(searchParams.get('next'), '/dashboard')
  const err = searchParams.get('error')

  const redirectToLoginWithError = (message: string) => {
    const to = new URL('/login', origin)
    to.searchParams.set('error', message)
    if (next !== '/dashboard') {
      to.searchParams.set('next', next)
    }
    return NextResponse.redirect(to)
  }

  if (err) {
    return redirectToLoginWithError('auth_error')
  }

  if (!code) {
    return redirectToLoginWithError('missing_code')
  }

  const redirectUrl = new URL(next, origin).toString()
  const response = NextResponse.redirect(redirectUrl)

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, {
              ...options,
              httpOnly: options?.httpOnly ?? true,
              path: options?.path ?? '/',
              sameSite: options?.sameSite ?? 'lax',
              secure: options?.secure ?? IS_PROD,
            }),
          )
        },
      },
    },
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    return redirectToLoginWithError('session_exchange_failed')
  }

  // Persiste o nome vindo de user_metadata no profile (sign-up com Google/Facebook
  // ou confirmação de e-mail após cadastro tradicional). Só escreve se o
  // profile ainda não tem `display_name` — evita sobrescrever edições
  // posteriores feitas em /profile.
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) {
    const meta = (user.user_metadata ?? {}) as {
      full_name?: string
      first_name?: string
      last_name?: string
      name?: string
    }
    const fromMeta =
      meta.full_name?.trim() ||
      [meta.first_name, meta.last_name].filter(Boolean).join(' ').trim() ||
      meta.name?.trim() ||
      ''

    if (fromMeta) {
      const { data: existing } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!existing?.display_name) {
        await supabase
          .from('profiles')
          .update({ display_name: fromMeta })
          .eq('user_id', user.id)
      }
    }
  }

  return response
}
