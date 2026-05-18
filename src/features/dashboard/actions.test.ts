import { beforeEach, describe, expect, test, vi } from 'vitest'

const {
  redirectMock,
  signOutMock,
  createClientMock,
  assertSameOriginMock,
} = vi.hoisted(() => {
  const redirectMock = vi.fn()
  const signOutMock = vi.fn().mockResolvedValue({ error: null })
  const createClientMock = vi.fn(() => ({
    auth: {
      signOut: signOutMock,
    },
  }))
  const assertSameOriginMock = vi.fn().mockResolvedValue(undefined)

  return {
    redirectMock,
    signOutMock,
    createClientMock,
    assertSameOriginMock,
  }
})

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: redirectMock,
}))

vi.mock('@/lib/server', () => ({
  assertSameOrigin: assertSameOriginMock,
  requireUser: vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: createClientMock,
}))

import { signOutAction } from './actions'

describe('Dashboard Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    signOutMock.mockResolvedValue({ error: null })
  })

  test('signOutAction validates origin, signs out, and redirects home', async () => {
    await signOutAction()

    expect(assertSameOriginMock).toHaveBeenCalledTimes(1)
    expect(createClientMock).toHaveBeenCalledTimes(1)
    expect(signOutMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith('/')
  })
})
