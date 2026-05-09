import { z } from 'zod'

/**
 * Validação de input + blocklists.
 *
 * Espelho dos limites em docs/vault/decisions.md.
 */

export const VAULT_LIMITS = {
  maxFileSizeBytes: 50 * 1024 * 1024,        // 50 mb
  maxDisplayNameLength: 255,
  maxDescriptionLength: 2000,
  maxTagsPerFile: 20,
  maxVersionsPerFile: 10,
  signedDownloadTtlSeconds: 5 * 60,          // 5 min
  signedUploadTtlSeconds: 30 * 60,           // 30 min
  trashRetentionDays: 30,
  pendingTimeoutMinutes: 60,
} as const

export const BLOCKED_EXTENSIONS = new Set([
  'exe', 'bat', 'cmd', 'sh', 'ps1', 'scr', 'msi', 'dll',
  'com', 'vbs', 'vbe', 'wsf', 'wsh', 'hta', 'jar', 'app',
  'dmg', 'iso', 'reg', 'inf', 'lnk', 'so',
])

export const BLOCKED_MIMES = new Set([
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-sh',
  'application/x-bsh',
])

export function isBlockedExtension(ext: string): boolean {
  return BLOCKED_EXTENSIONS.has(ext.toLowerCase().replace(/^\./, ''))
}

export function isBlockedMime(mime: string): boolean {
  return BLOCKED_MIMES.has(mime.toLowerCase().trim())
}

/** extrai extensão (sem ponto, lowercase). retorna '' se não houver. */
export function extractExtension(filename: string): string {
  const dot = filename.lastIndexOf('.')
  if (dot <= 0 || dot === filename.length - 1) return ''
  return filename.slice(dot + 1).toLowerCase()
}

// ─── schemas zod ────────────────────────────────────────────────────

export const sha256Schema = z
  .string()
  .regex(/^[a-f0-9]{64}$/, 'SHA-256 inválido (esperado hex de 64 chars).')

export const prepareUploadSchema = z.object({
  name: z.string().min(1).max(VAULT_LIMITS.maxDisplayNameLength),
  size: z.number().int().positive().max(VAULT_LIMITS.maxFileSizeBytes),
  mime: z.string().min(1).max(255),
  sha256: sha256Schema,
})

export const uuidLikeSchema = z
  .string()
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    'UUID invalido.',
  )

export const updateMetadataSchema = z.object({
  fileId: uuidLikeSchema,
  patch: z
    .object({
      displayName: z.string().min(1).max(VAULT_LIMITS.maxDisplayNameLength).optional(),
      description: z.string().max(VAULT_LIMITS.maxDescriptionLength).nullable().optional(),
      categorySlug: z.string().min(1).max(64).nullable().optional(),
      tagSlugs: z.array(z.string().min(1).max(64)).max(VAULT_LIMITS.maxTagsPerFile).optional(),
      favorite: z.boolean().optional(),
    })
    .strict(),
})

export const fileIdSchema = z.object({
  fileId: uuidLikeSchema,
})

export const listFilesSchema = z.object({
  page: z.number().int().min(1).default(1).optional(),
  pageSize: z.number().int().min(1).max(200).default(50).optional(),
  categorySlug: z.string().min(1).max(64).optional(),
  tagIds: z.array(uuidLikeSchema).max(20).optional(),
  query: z.string().max(255).optional(),
  favorite: z.boolean().optional(),
  trashed: z.boolean().default(false).optional(),
  sort: z.enum(['created_at', 'updated_at', 'display_name', 'size_bytes']).default('created_at').optional(),
  order: z.enum(['asc', 'desc']).default('desc').optional(),
})

export type PrepareUploadInput = z.infer<typeof prepareUploadSchema>
export type UpdateMetadataInput = z.infer<typeof updateMetadataSchema>
export type ListFilesInput = z.infer<typeof listFilesSchema>
