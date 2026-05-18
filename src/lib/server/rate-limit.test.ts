import { afterEach, describe, expect, test, vi } from 'vitest'

const originalNodeEnv = process.env.NODE_ENV

function mockServerEnv(e2eDisableRateLimit?: 'true') {
  vi.doMock('@/config/env.server', () => ({
    serverEnv: {
      NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key',
      NEXT_PUBLIC_SITE_URL: 'https://app.example.com',
      SUPABASE_SERVICE_ROLE_KEY: undefined,
      UPSTASH_REDIS_REST_URL: undefined,
      UPSTASH_REDIS_REST_TOKEN: undefined,
      E2E_DISABLE_RATE_LIMIT: e2eDisableRateLimit,
    },
  }))
}

afterEach(() => {
  process.env.NODE_ENV = originalNodeEnv
  vi.resetModules()
  vi.clearAllMocks()
  vi.doUnmock('@/config/env.server')
})

describe('rate-limit', () => {
  test('fails fast when E2E_DISABLE_RATE_LIMIT is set in production', async () => {
    process.env.NODE_ENV = 'production'
    mockServerEnv('true')

    await expect(import('./rate-limit')).rejects.toThrow(
      'E2E_DISABLE_RATE_LIMIT must not be set in production',
    )
  })

  test('allows E2E rate-limit bypass outside production', async () => {
    process.env.NODE_ENV = 'test'
    mockServerEnv('true')

    const { checkRateLimit, RATE_LIMIT_CONFIG } = await import('./rate-limit')
    const result = await checkRateLimit('198.51.100.10', 'auth')

    expect(result).toMatchObject({
      success: true,
      remaining: RATE_LIMIT_CONFIG.auth.max,
      mode: 'memory',
    })
  })
})
