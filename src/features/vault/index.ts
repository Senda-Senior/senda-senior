/**
 * index.ts
 * Barrel export — public API do vault para features e pages
 *
 * Conecta: importado por pages, componentes externos, outras features
 * Camada: shared
 */

export type {
  VaultCategory,
  VaultFile,
  VaultListFilters,
  VaultListResult,
  VaultQuota,
  VaultQuotaTier,
  VaultStatus,
  VaultTag,
} from './types'

export {
  SYSTEM_CATEGORIES_META,
  SYSTEM_CATEGORY_SLUGS,
  FALLBACK_CATEGORY,
  isSystemCategory,
  type SystemCategorySlug,
} from './categories'

export {
  VAULT_ERROR_CODES,
  VAULT_ERROR_MESSAGES,
  type VaultErrorCode,
  type ActionResult,
} from './errors'

export {
  VAULT_LIMITS,
  BLOCKED_EXTENSIONS,
  BLOCKED_MIMES,
  isBlockedExtension,
  isBlockedMime,
  extractExtension,
} from './validation'

export {
  getCategories,
  getFile,
  getQuota,
  getTags,
  getTrashedCount,
  listFiles,
  isValidSystemCategorySlug,
  VAULT_FILE_SELECT,
} from './data'

export {
  confirmUpload,
  getDownloadUrl,
  prepareUpload,
  restore,
  softDelete,
  updateMetadata,
} from './actions'

export { VaultView } from './components/VaultView'
export { VaultUploader } from './components/VaultUploader'
export { VaultFileCard } from './components/VaultFileCard'
export { VaultFileEditModal } from './components/VaultFileEditModal'
