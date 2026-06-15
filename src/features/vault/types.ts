/**
 * types.ts
 * Tipos públicos do vault — espelho dos rows do banco (camelCase) + agregações de leitura
 *
 * Conecta: importado por mappers.ts, data.ts, actions.ts, index.ts e componentes
 * Camada: shared
 */

/**
 * tipos públicos do vault.
 * espelho dos rows do banco (camelCase) + agregações de leitura.
 */

export type VaultStatus = 'pending' | 'ready' | 'failed'
export type VaultQuotaTier = 'free' | 'premium' | 'enterprise'

export interface VaultCategory {
  id: string
  slug: string
  label: string
  icon: string | null
  color: string | null
  type: 'system' | 'user'
  sortOrder: number
}

export interface VaultTag {
  id: string
  slug: string
  label: string
}

export interface VaultFile {
  id: string
  displayName: string
  originalName: string
  extension: string
  mimeType: string
  sizeBytes: number
  sha256: string
  status: VaultStatus
  category: VaultCategory | null
  tags: VaultTag[]
  confidence: number | null
  manualOverride: boolean
  description: string | null
  favorite: boolean
  isPrivate: boolean
  versionCount: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface VaultQuota {
  tier: VaultQuotaTier
  limitBytes: number
  usedBytes: number
  fileCount: number
  usedPercentage: number
}

export interface VaultListFilters {
  page?: number
  pageSize?: number
  categorySlug?: string
  tagIds?: string[]
  query?: string
  favorite?: boolean
  trashed?: boolean
  sort?: 'created_at' | 'updated_at' | 'display_name' | 'size_bytes'
  order?: 'asc' | 'desc'
}

export interface VaultListResult {
  items: VaultFile[]
  total: number
  page: number
  pageSize: number
}
