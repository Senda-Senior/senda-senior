import { z } from 'zod'

import { uuidLikeSchema } from '@/features/vault/validation'

const fileIdSchema = z.object({
  fileId: uuidLikeSchema,
})

describe('UUID Validation Test', () => {
  it('should validate standard UUID', () => {
    const result = fileIdSchema.safeParse({
      fileId: '123e4567-e89b-12d3-a456-426614174000',
    })

    expect(result.success).toBe(true)
  })

  it('should validate another UUID', () => {
    const result = fileIdSchema.safeParse({
      fileId: '987f6543-b21a-43d2-b654-321fe8765432',
    })

    expect(result.success).toBe(true)
  })

  it('should validate UUID-like IDs without enforcing RFC version bits', () => {
    const result = fileIdSchema.safeParse({
      fileId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeffff0000',
    })

    expect(result.success).toBe(true)
  })

  it('should reject invalid UUID-like IDs', () => {
    const result = fileIdSchema.safeParse({ fileId: 'not-a-uuid' })

    expect(result.success).toBe(false)
  })
})
