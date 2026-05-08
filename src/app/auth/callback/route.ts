import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/config/env'

/**
 * Troca o `code` devolvido pelos links de email (confirmação, magic link,
 * recuperação) por uma sessão com cookies. Sem esta rota, o fluxo PKCE
 * do Supabase nunca assina a sessão no browser/servidor.
 */
function safeNextParam(next: string | null, fallback: string): string {
  if (!next || !next.startsWith('/') || next.startsWith('//')) {
    return fallback
  }
  return next
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = safeNextParam(searchParams.get('next'), '/dashboard')
  const err = searchParams.get('error')
  const errDescription = searchParams.get('error_description')

  const redirectToLoginWithError = (message: string) => {
    const to = new URL('/login', origin)
    to.searchParams.set('error', message)
    if (next !== '/dashboard') {
      to.searchParams.set('next', next)
    }
    return NextResponse.redirect(to)
  }

  if (err) {
    return redirectToLoginWithError(errDescription ?? err)
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
              path: '/',
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
            }),
          )
        },
      },
    },
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    return redirectToLoginWithError(error.message)
  }

  return response
}
