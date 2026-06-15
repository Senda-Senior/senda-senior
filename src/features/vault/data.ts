/**
 * data.ts
 * Queries ao Postgres — getFile, listFiles, getCategories, getTags, getQuota, etc
 *
 * Conecta: importado por actions.ts (prepareUpload, confirmUpload), RSC pages
 * Camada: server (RSC + server actions)
 */

import 'server-only'

import { createClient as createServerClient } from '@/lib/supabase/server'
import type { ListFilesInput } from './validation'
import type {
  VaultCategory,
  VaultFile,
  VaultListResult,
  VaultQuota,
  VaultTag,
} from './types'
import {
  mapEffectiveCategory,
  mapFile,
  mapQuota,
  mapSystemCategory,
  mapTag,
  mapUserCategory,
} from './mappers'
import type { Database } from '@/lib/supabase/types'

type SystemCategoryRow = Database['public']['Tables']['vault_system_categories']['Row']
type UserCategoryRow = Database['public']['Tables']['vault_categories']['Row']

/** Select PostgREST compartilhado entre RSC e actions. */
export const VAULT_FILE_SELECT = `
  id, user_id, current_blob_id, display_name, original_name,
  system_category_slug, user_category_id, manual_override, confidence,
  description, favorite, is_private, status,
  text_content, version_count,
  created_at, updated_at, deleted_at,
  current_blob:vault_file_blobs!current_blob_id(*),
  system_category:vault_system_categories(*),
  user_category:vault_categories(*),
  tags_join:vault_file_tags(tag:vault_tags(*))
`

export async function getQuota(userId: string): Promise<VaultQuota> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('vault_quotas')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error || !data) {
    return {
      tier: 'free',
      limitBytes: 524288000,
      usedBytes: 0,
      fileCount: 0,
      usedPercentage: 0,
    }
  }
  return mapQuota(data)
}

export async function getCategories(userId: string): Promise<VaultCategory[]> {
  const supabase = await createServerClient()
  const [{ data: system, error: e1 }, { data: userRows, error: e2 }] = await Promise.all([
    supabase
      .from('vault_system_categories')
      .select('*')
      .order('sort_order', { ascending: true }),
    supabase
      .from('vault_categories')
      .select('*')
      .eq('user_id', userId)
      .order('sort_order', { ascending: true }),
  ])

  if (e1 || e2) return []
  const sys = (system ?? []).map(mapSystemCategory)
  const usr = (userRows ?? []).map(mapUserCategory)
  return [...sys, ...usr]
}

export async function getTags(userId: string): Promise<VaultTag[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('vault_tags')
    .select('*')
    .eq('user_id', userId)
    .order('label', { ascending: true })

  if (error || !data) return []
  return data.map(mapTag)
}

function mapJoinedFile(
  data: unknown,
): VaultFile | null {
  type TagJoin = { tag: Database['public']['Tables']['vault_tags']['Row'] | null }
  type Joined = Database['public']['Tables']['vault_files']['Row'] & {
    current_blob: Database['public']['Tables']['vault_file_blobs']['Row'] | null
    system_category: SystemCategoryRow | null
    user_category: UserCategoryRow | null
    tags_join: TagJoin[] | null
  }
  const row = data as Joined
  const blob = row.current_blob
  const effective = mapEffectiveCategory(row.system_category, row.user_category)
  const tags = (row.tags_join ?? [])
    .map((j) => j.tag)
    .filter((t): t is Database['public']['Tables']['vault_tags']['Row'] => Boolean(t))
  return mapFile(row, blob, effective, tags)
}

export async function getFile(
  userId: string,
  fileId: string,
): Promise<VaultFile | null> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('vault_files')
    .select(VAULT_FILE_SELECT)
    .eq('user_id', userId)
    .eq('id', fileId)
    .single()

  if (error || !data) return null
  return mapJoinedFile(data)
}

export async function listFiles(
  userId: string,
  filters: ListFilesInput = {},
): Promise<VaultListResult> {
  const supabase = await createServerClient()
  const page = filters.page ?? 1
  const pageSize = filters.pageSize ?? 50
  const sort = filters.sort ?? 'created_at'
  const order = filters.order ?? 'desc'

  let query = supabase
    .from('vault_files')
    .select(VAULT_FILE_SELECT, { count: 'exact' })
    .eq('user_id', userId)

  if (filters.trashed) {
    query = query.not('deleted_at', 'is', null)
  } else {
    query = query.is('deleted_at', null)
  }

  if (filters.favorite !== undefined) {
    query = query.eq('favorite', filters.favorite)
  }

  if (filters.query && filters.query.trim().length > 0) {
    query = query.ilike('display_name', `%${filters.query.trim()}%`)
  }

  if (filters.categorySlug) {
    query = query
      .eq('system_category_slug', filters.categorySlug)
      .is('user_category_id', null)
  }

  query = query
    .order(sort, { ascending: order === 'asc' })
    .range((page - 1) * pageSize, page * pageSize - 1)

  const { data, error, count } = await query
  if (error || !data) {
    return { items: [], total: 0, page, pageSize }
  }

  const items = (data as unknown[]).map((row) => mapJoinedFile(row)!).filter(Boolean) as VaultFile[]

  return { items, total: count ?? 0, page, pageSize }
}

/**
 * Retorna `true` se o slug existir em `vault_system_categories`.
 */
export async function isValidSystemCategorySlug(
  slug: string,
): Promise<boolean> {
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('vault_system_categories')
    .select('slug')
    .eq('slug', slug)
    .maybeSingle()
  return Boolean(data)
}

export async function getTrashedCount(userId: string): Promise<number> {
  const supabase = await createServerClient()
  const { count } = await supabase
    .from('vault_files')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .not('deleted_at', 'is', null)
  return count ?? 0
}

