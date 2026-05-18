import { beforeEach, describe, expect, test, vi } from 'vitest'

const { headersMock, serverEnvMock } = vi.hoisted(() => ({
  headersMock: vi.fn(),
  serverEnvMock: {
    NEXT_PUBLIC_SITE_URL: 'https://app.example.com' as string | undefined,
  },
}))

vi.mock('next/headers', () => ({
  headers: headersMock,
}))

vi.mock('@/config/env.server', () => ({
  serverEnv: serverEnvMock,
}))

import { assertSameOrigin } from './csrf'

describe('assertSameOrigin', () => {
  beforeEach(() => {
    headersMock.mockReset()
    serverEnvMock.NEXT_PUBLIC_SITE_URL = 'https://app.example.com'
  })

  test('accepts the configured site origin', async () => {
    headersMock.mockResolvedValue(
      new Headers({
        origin: 'https://app.example.com',
        host: 'preview.example.com',
      }),
    )

    await expect(assertSameOrigin()).resolves.toBeUndefined()
  })

  test('prefers NEXT_PUBLIC_SITE_URL over the request host', async () => {
    headersMock.mockResolvedValue(
      new Headers({
        origin: 'https://preview.example.com',
        host: 'preview.example.com',
      }),
    )

    await expect(assertSameOrigin()).rejects.toThrow('origem inválida')
  })

  test('falls back to localhost host matching in non-production test runs', async () => {
    serverEnvMock.NEXT_PUBLIC_SITE_URL = undefined
    headersMock.mockResolvedValue(
      new Headers({
        origin: 'http://localhost:3000',
        host: 'localhost:3000',
      }),
    )

    await expect(assertSameOrigin()).resolves.toBeUndefined()
  })
})
