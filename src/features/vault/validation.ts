import { z } from 'zod'
import type { VaultErrorCode } from './errors'

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

export const ALLOWED_UPLOAD_TYPES: Record<string, readonly string[]> = {
  pdf: ['application/pdf'],
  jpg: ['image/jpeg'],
  jpeg: ['image/jpeg'],
  png: ['image/png'],
  gif: ['image/gif'],
  webp: ['image/webp'],
  heic: ['image/heic', 'image/heif'],
  heif: ['image/heif', 'image/heic'],
  doc: ['application/msword'],
  docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  xls: ['application/vnd.ms-excel'],
  xlsx: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  ppt: ['application/vnd.ms-powerpoint'],
  pptx: ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  txt: ['text/plain'],
  csv: ['text/csv'],
  rtf: ['application/rtf'],
  zip: ['application/zip', 'application/x-zip-compressed'],
} as const

export const ALLOWED_EXTENSIONS = new Set(Object.keys(ALLOWED_UPLOAD_TYPES))

export const ALLOWED_MIMES = new Set(
  Object.values(ALLOWED_UPLOAD_TYPES).flatMap((mimes) => mimes),
)

const ALLOWED_MIMES_TUPLE = [...ALLOWED_MIMES] as [string, ...string[]]

// Compatibilidade com imports legados do barrel público.
export const BLOCKED_EXTENSIONS = new Set([
  'exe', 'bat', 'cmd', 'com', 'msi', 'dll', 'scr', 'jar',
  'sh', 'bash', 'zsh', 'ps1', 'psm1',
  'vbs', 'vbe', 'wsf', 'wsh', 'hta', 'reg', 'lnk',
])

export const BLOCKED_MIMES = new Set([
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/java-archive',
  'application/x-sh',
  'application/x-bsh',
  'text/x-shellscript',
  'application/x-powershell',
  'application/vnd.microsoft.portable-executable',
])

export function isBlockedExtension(ext: string): boolean {
  return !ALLOWED_EXTENSIONS.has(ext.toLowerCase().replace(/^\./, ''))
}

export function isBlockedMime(mime: string): boolean {
  return !ALLOWED_MIMES.has(mime.toLowerCase().trim())
}

export function isMimeAllowedForExtension(ext: string, mime: string): boolean {
  const normalizedExt = ext.toLowerCase().replace(/^\./, '')
  const normalizedMime = mime.toLowerCase().trim()
  const allowedMimes = ALLOWED_UPLOAD_TYPES[
    normalizedExt as keyof typeof ALLOWED_UPLOAD_TYPES
  ]

  if (!allowedMimes) return false

  return allowedMimes.includes(normalizedMime)
}

export function validateUploadType(
  filename: string,
  mime: string,
): VaultErrorCode | null {
  const ext = extractExtension(filename)

  if (isBlockedExtension(ext)) return 'blocked_ext'
  if (isBlockedMime(mime)) return 'blocked_mime'
  if (!isMimeAllowedForExtension(ext, mime)) return 'mime_mismatch'

  return null
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
  mime: z.enum(ALLOWED_MIMES_TUPLE),
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
