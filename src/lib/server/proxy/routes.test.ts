import { describe, expect, test } from 'vitest'
import { getRouteFlags, pickBucket, shouldRateLimit } from './routes'

describe('proxy routes', () => {
  test('rate limits auth callback routes with the auth bucket', () => {
    expect(shouldRateLimit('/auth/callback')).toBe(true)
    expect(pickBucket('/auth/callback')).toBe('auth')
  })

  test('rate limits api and login, not dashboard page navigations', () => {
    expect(shouldRateLimit('/api/csp-report')).toBe(true)
    expect(shouldRateLimit('/login')).toBe(true)
    expect(shouldRateLimit('/update-password')).toBe(true)
    expect(shouldRateLimit('/dashboard')).toBe(false)
    expect(shouldRateLimit('/vault')).toBe(false)
    expect(shouldRateLimit('/')).toBe(false)
  })

  test('does not treat auth callback routes as login-only redirect targets', () => {
    expect(getRouteFlags('/auth/callback')).toMatchObject({
      isAuthRoute: false,
      authRelevantRoute: false,
    })
  })
})
