import { describe, expect, test } from 'vitest'
import { getRouteFlags, pickBucket, shouldRateLimit } from './routes'

describe('proxy routes', () => {
  test('rate limits auth callback routes with the auth bucket', () => {
    expect(shouldRateLimit('/auth/callback')).toBe(true)
    expect(pickBucket('/auth/callback')).toBe('auth')
  })

  test('does not treat auth callback routes as login-only redirect targets', () => {
    expect(getRouteFlags('/auth/callback')).toMatchObject({
      isAuthRoute: false,
      authRelevantRoute: false,
    })
  })
})
