/**
 * mappers.ts
 * Converte rows do Postgres para tipos públicos do vault — VaultFile, VaultCategory, etc
 *
 * Conecta: importado por data.ts (mapJoinedFile), actions.ts (confirmUpload), VAULT_FILE_SELECT usado globalmente
 * Camada: shared
 */

import type { Database } from '@/lib/supabase/types'
import type {
  VaultCategory,
  VaultFile,
  VaultQuota,
  VaultTag,
} from './types'

type SystemCategoryRow = Database['public']['Tables']['vault_system_categories']['Row']
type UserCategoryRow = Database['public']['Tables']['vault_categories']['Row']
type TagRow = Database['public']['Tables']['vault_tags']['Row']
type FileRow = Database['public']['Tables']['vault_files']['Row']
type BlobRow = Database['public']['Tables']['vault_file_blobs']['Row']
type QuotaRow = Database['public']['Tables']['vault_quotas']['Row']

/** Categorias seed (tabela `vault_system_categories`, pk = slug). */
export function mapSystemCategory(row: SystemCategoryRow): VaultCategory {
  return {
    id: row.slug,
    slug: row.slug,
    label: row.label,
    icon: row.icon,
    color: row.color,
    type: 'system',
    sortOrder: row.sort_order,
  }
}

export function mapUserCategory(row: UserCategoryRow): VaultCategory {
  return {
    id: row.id,
    slug: row.slug,
    label: row.label,
    icon: row.icon,
    color: row.color,
    type: 'user',
    sortOrder: row.sort_order,
  }
}

/**
 * Categoria efetiva para a UI: pasta do usuário tem precedência
 * sobre a do sistema.
 */
export function mapEffectiveCategory(
  system: SystemCategoryRow | null,
  user: UserCategoryRow | null,
): VaultCategory | null {
  if (user) return mapUserCategory(user)
  if (system) return mapSystemCategory(system)
  return null
}

export function mapTag(row: TagRow): VaultTag {
  return { id: row.id, slug: row.slug, label: row.label }
}

export function mapQuota(row: QuotaRow): VaultQuota {
  const used = Number(row.used_bytes)
  const limit = Number(row.limit_bytes)
  return {
    tier: row.tier,
    limitBytes: limit,
    usedBytes: used,
    fileCount: row.file_count,
    usedPercentage: limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0,
  }
}

export function mapFile(
  row: FileRow,
  currentBlob: BlobRow | null,
  effectiveCategory: VaultCategory | null,
  tags: TagRow[],
): VaultFile {
  if (!currentBlob) {
    return {
      id: row.id,
      displayName: row.display_name,
      originalName: row.original_name,
      extension: '',
      mimeType: 'application/octet-stream',
      sizeBytes: 0,
      sha256: '',
      status: row.status,
      category: effectiveCategory,
      tags: tags.map(mapTag),
      confidence: row.confidence,
      manualOverride: row.manual_override,
      description: row.description,
      favorite: row.favorite,
      isPrivate: row.is_private,
      versionCount: row.version_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
    }
  }
  return {
    id: row.id,
    displayName: row.display_name,
    originalName: row.original_name,
    extension: currentBlob.extension,
    mimeType: currentBlob.mime_type,
    sizeBytes: Number(currentBlob.size_bytes),
    sha256: currentBlob.sha256,
    status: row.status,
    category: effectiveCategory,
    tags: tags.map(mapTag),
    confidence: row.confidence,
    manualOverride: row.manual_override,
    description: row.description,
    favorite: row.favorite,
    isPrivate: row.is_private,
    versionCount: row.version_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  }
}

