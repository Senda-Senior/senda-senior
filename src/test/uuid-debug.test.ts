import { z } from 'zod'

import { uuidLikeSchema } from '@/features/vault/validation'

const fileIdSchema = z.object({
  fileId: uuidLikeSchema,
})

describe('UUID Validation Debug', () => {
  const testIds = [
    '123e4567-e89b-12d3-a456-426614174000',
    '987f6543-b21a-43d2-b654-321fe8765432',
    'aaaaaaaa-bbbb-cccc-dddd-eeeeffff0000',
  ]

  testIds.forEach((id) => {
    test(`should validate UUID-like ID: ${id}`, () => {
      const result = fileIdSchema.safeParse({ fileId: id })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.fileId).toBe(id)
      }
    })
  })
})
