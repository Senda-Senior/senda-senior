import { describe, expect, test, vi } from 'vitest'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('@/lib/server', () => ({
  assertSameOrigin: vi.fn().mockResolvedValue(undefined),
  requireUser: vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

import {
  confirmUpload,
  getDownloadUrl,
  prepareUpload,
  restore,
  softDelete,
  updateMetadata,
} from './actions'

describe('Vault Actions', () => {
  test('prepareUpload returns invalid for malformed upload input', async () => {
    const result = await prepareUpload({
      name: '',
      size: 0,
      mime: '',
      sha256: 'invalid',
    })

    expect(result).toMatchObject({ ok: false, error: 'invalid' })
  })

  test('file-id based actions reject invalid IDs before data access', async () => {
    await expect(confirmUpload('not-a-uuid')).resolves.toMatchObject({
      ok: false,
      error: 'invalid',
    })
    await expect(getDownloadUrl('not-a-uuid')).resolves.toMatchObject({
      ok: false,
      error: 'invalid',
    })
    await expect(softDelete('not-a-uuid')).resolves.toMatchObject({
      ok: false,
      error: 'invalid',
    })
    await expect(restore('not-a-uuid')).resolves.toMatchObject({
      ok: false,
      error: 'invalid',
    })
  })

  test('updateMetadata returns invalid for malformed patches', async () => {
    const result = await updateMetadata({
      fileId: '123e4567-e89b-12d3-a456-426614174000',
      patch: {
        displayName: '',
      },
    })

    expect(result).toMatchObject({ ok: false, error: 'invalid' })
  })
})
