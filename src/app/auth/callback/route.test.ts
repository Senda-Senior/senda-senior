import { beforeEach, describe, expect, test, vi } from 'vitest'
import { NextRequest } from 'next/server'

const { createServerClientMock, exchangeCodeForSessionMock } = vi.hoisted(() => {
  const exchangeCodeForSessionMock = vi.fn()
  const createServerClientMock = vi.fn((_url, _key, options) => ({
    auth: {
      exchangeCodeForSession: async (code: string) => {
        options.cookies.setAll([
          {
            name: 'sb-session',
            value: `token:${code}`,
            options: {},
          },
        ])

        return exchangeCodeForSessionMock(code)
      },
    },
  }))

  return {
    createServerClientMock,
    exchangeCodeForSessionMock,
  }
})

vi.mock('@supabase/ssr', () => ({
  createServerClient: createServerClientMock,
}))

vi.mock('@/config/env', () => ({
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key',
  },
}))

vi.mock('@/lib/server/proxy/headers', () => ({
  IS_PROD: true,
}))

import { GET } from './route'

describe('auth callback route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    exchangeCodeForSessionMock.mockResolvedValue({ error: null })
  })

  test('sets hardened cookie defaults when exchanging the session code', async () => {
    const response = await GET(
      new NextRequest('https://app.example.com/auth/callback?code=abc&next=/dashboard'),
    )

    const setCookie = response.headers.get('set-cookie') ?? ''

    expect(createServerClientMock).toHaveBeenCalledTimes(1)
    expect(exchangeCodeForSessionMock).toHaveBeenCalledWith('abc')
    expect(setCookie).toContain('sb-session=token%3Aabc')
    expect(setCookie).toContain('HttpOnly')
    expect(setCookie).toContain('Secure')
    expect(setCookie.toLowerCase()).toContain('samesite=lax')
    expect(setCookie).toContain('Path=/')
  })
})
