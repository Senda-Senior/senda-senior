import { afterEach, describe, expect, test, vi } from 'vitest'
import type { NextRequest } from 'next/server'
import { extractIp } from './headers'

function makeRequest(headers: Record<string, string>): NextRequest {
  return { headers: new Headers(headers) } as NextRequest
}

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('proxy headers', () => {
  test('ignores forwarded IP headers outside trusted environments', () => {
    expect(
      extractIp(
        makeRequest({
          'x-vercel-forwarded-for': '198.51.100.10',
          'cf-connecting-ip': '203.0.113.5',
        }),
      ),
    ).toBe('unknown')
  })

  test('reads the Vercel IP header when Vercel is explicitly trusted', () => {
    vi.stubEnv('VERCEL', '1')

    expect(
      extractIp(
        makeRequest({
          'x-vercel-forwarded-for': '198.51.100.10, 203.0.113.9',
        }),
      ),
    ).toBe('198.51.100.10')
  })

  test('reads the Cloudflare IP header when Cloudflare Pages is explicitly trusted', () => {
    vi.stubEnv('CF_PAGES', '1')

    expect(
      extractIp(
        makeRequest({
          'cf-connecting-ip': '203.0.113.5',
        }),
      ),
    ).toBe('203.0.113.5')
  })
})
