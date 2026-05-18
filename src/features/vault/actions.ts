'use server'

import { revalidatePath } from 'next/cache'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { assertSameOrigin, requireUser } from '@/lib/server'
import { fail, success, type ActionResult } from './errors'
import {
  extractExtension,
  fileIdSchema,
  prepareUploadSchema,
  updateMetadataSchema,
  validateUploadType,
  type PrepareUploadInput,
  type UpdateMetadataInput,
} from './validation'
import { classify } from './classifier'
import {
  buildStoragePath,
  createSignedDownloadUrl,
  createSignedUploadUrl,
  removeObject,
  statObject,
} from './storage'
import { isValidSystemCategorySlug, VAULT_FILE_SELECT } from './data'
import type { Database } from '@/lib/supabase/types'
import type { VaultFile } from './types'
import {
  mapEffectiveCategory,
  mapFile,
} from './mappers'

import type { SystemCategorySlug } from './categories'
import type { VaultErrorCode } from './errors'

type DbLikeError = {
  code?: string
  message?: string
  details?: string
  hint?: string
}

type SupabaseServerClient = Awaited<ReturnType<typeof createServerClient>>

function logDbError(scope: string, error: DbLikeError | null | undefined) {
  console.error(scope, {
    code: error?.code ?? null,
    message: error?.message ?? null,
  })
}

function mapUploadWriteError(
  error: DbLikeError | null | undefined,
): VaultErrorCode {
  const message = error?.message?.toLowerCase() ?? ''
  const details = error?.details?.toLowerCase() ?? ''

  if (
    error?.code === 'P0001'
    && (message.includes('vault_quota_exceeded') || details.includes('vault_quota_exceeded'))
  ) {
    return 'quota'
  }

  if (error?.code === '23505') {
    return 'duplicate'
  }

  return 'internal'
}

async function syncClassifierOverridesForUser(
  supabase: SupabaseServerClient,
  userId: string,
): Promise<{ ok: true; count: number } | { ok: false }> {
  const { data, error } = await supabase
    .from('vault_classifier_overrides')
    .select('pattern, category_slug, weight, created_at')
    .eq('user_id', userId)
    .order('match_count', { ascending: false })
    .limit(100)

  const { setUserOverrides } = await import('./classifier')

  if (error) {
    console.error('[vault.syncClassifierOverridesForUser]', {
      userId,
      code: error.code ?? null,
      message: error.message ?? null,
    })
    setUserOverrides(userId, [])
    return { ok: false }
  }

  setUserOverrides(
    userId,
    (data ?? []).map((row) => ({
      userId,
      pattern: row.pattern,
      category: row.category_slug as SystemCategorySlug,
      weight: row.weight,
      createdAt: row.created_at,
    })),
  )

  return { ok: true, count: data?.length ?? 0 }
}

// ─── prepareUpload ──────────────────────────────────────────────────

export async function prepareUpload(
  input: PrepareUploadInput,
): Promise<ActionResult<{
  fileId: string
  uploadUrl: string
  uploadToken: string
  storagePath: string
  expiresAt: string
}>> {
  await assertSameOrigin()

  const parsed = prepareUploadSchema.safeParse(input)
  if (!parsed.success) return fail('invalid')

  const { name, size, mime, sha256 } = parsed.data
  const ext = extractExtension(name)
  const uploadTypeError = validateUploadType(name, mime)

  if (uploadTypeError) return fail(uploadTypeError)

  const user = await requireUser()
  const supabase = await createServerClient()

  const { data: quota } = await supabase
    .from('vault_quotas')
    .select('limit_bytes, used_bytes')
    .eq('user_id', user.id)
    .single()

  if (quota) {
    const newUsed = Number(quota.used_bytes) + size
    if (newUsed > Number(quota.limit_bytes)) return fail('quota')
  }

  const { data: shaBlobs } = await supabase
    .from('vault_file_blobs')
    .select('id, file_id')
    .eq('sha256', sha256)

  if (shaBlobs && shaBlobs.length > 0) {
    const fileIds = [...new Set(shaBlobs.map((b) => b.file_id))]
    const { data: fileRows } = await supabase
      .from('vault_files')
      .select('id, current_blob_id')
      .in('id', fileIds)
      .eq('user_id', user.id)
      .is('deleted_at', null)
    const hit = fileRows?.find((f) => {
      const b = shaBlobs.find(
        (x) => x.file_id === f.id && x.id === f.current_blob_id,
      )
      return Boolean(b)
    })
    if (hit) return fail('duplicate')
  }

  const fileId = crypto.randomUUID()
  const storagePath = buildStoragePath(user.id, fileId, ext)

  const { error: insertFileError } = await supabase.from('vault_files').insert({
    id: fileId,
    user_id: user.id,
    display_name: name,
    original_name: name,
    status: 'pending',
  })

  if (insertFileError) {
    logDbError('[vault.prepareUpload] insert file failed', insertFileError)
    return fail(mapUploadWriteError(insertFileError))
  }

  const { data: insertedBlob, error: blobError } = await supabase
    .from('vault_file_blobs')
    .insert({
      file_id: fileId,
      version: 1,
      storage_path: storagePath,
      mime_type: mime,
      extension: ext,
      size_bytes: size,
      sha256,
    })
    .select('id')
    .single()

  if (blobError || !insertedBlob) {
    logDbError('[vault.prepareUpload] insert blob failed', blobError)
    await supabase.from('vault_files').delete().eq('id', fileId)
    return fail(mapUploadWriteError(blobError))
  }

  const { error: linkError } = await supabase
    .from('vault_files')
    .update({ current_blob_id: insertedBlob.id })
    .eq('id', fileId)
    .eq('user_id', user.id)

  if (linkError) {
    logDbError('[vault.prepareUpload] link blob failed', linkError)
    await supabase.from('vault_file_blobs').delete().eq('id', insertedBlob.id)
    await supabase.from('vault_files').delete().eq('id', fileId)
    return fail(mapUploadWriteError(linkError))
  }

  const signed = await createSignedUploadUrl(supabase, storagePath)
  if ('error' in signed) {
    console.error('[vault.prepareUpload] signed url failed:', signed.error)
    await supabase.from('vault_file_blobs').delete().eq('id', insertedBlob.id)
    await supabase.from('vault_files').delete().eq('id', fileId)
    return fail('storage_error')
  }

  return success({
    fileId,
    uploadUrl: signed.url,
    uploadToken: signed.token,
    storagePath,
    expiresAt: signed.expiresAt,
  })
}

// ─── confirmUpload ──────────────────────────────────────────────────

type JoinedFileRow = Database['public']['Tables']['vault_files']['Row'] & {
  current_blob: Database['public']['Tables']['vault_file_blobs']['Row'] | null
  system_category: Database['public']['Tables']['vault_system_categories']['Row'] | null
  user_category: Database['public']['Tables']['vault_categories']['Row'] | null
  tags_join: Array<{ tag: Database['public']['Tables']['vault_tags']['Row'] | null }> | null
}

export async function confirmUpload(
  fileId: string,
): Promise<ActionResult<{ file: VaultFile }>> {
  await assertSameOrigin()

  const parsed = fileIdSchema.safeParse({ fileId })
  if (!parsed.success) return fail('invalid')

  const user = await requireUser()
  const supabase = await createServerClient()

  const { data: row, error } = await supabase
    .from('vault_files')
    .select(VAULT_FILE_SELECT)
    .eq('user_id', user.id)
    .eq('id', fileId)
    .single()

  if (error || !row) return fail('not_found')
  const f = row as unknown as JoinedFileRow
  if (f.status !== 'pending') return fail('not_pending')
  const blob = f.current_blob
  if (!blob) return fail('not_found')

  let stat: { size: number } | null = null
  for (let attempt = 0; attempt < 8; attempt++) {
    stat = await statObject(supabase, blob.storage_path)
    if (stat) break
    await new Promise((r) => setTimeout(r, 250 * (attempt + 1)))
  }
  if (!stat) {
    await supabase
      .from('vault_files')
      .update({ status: 'failed' })
      .eq('id', fileId)
    return fail('not_uploaded')
  }
  if (Number(stat.size) !== Number(blob.size_bytes)) {
    await supabase
      .from('vault_files')
      .update({ status: 'failed' })
      .eq('id', fileId)
    await removeObject(supabase, blob.storage_path)
    return fail('size_mismatch')
  }

  await syncClassifierOverridesForUser(supabase, user.id)

  const classification = classify({
    name: f.original_name,
    mime: blob.mime_type,
    size: Number(blob.size_bytes),
    userId: user.id,
  })

  const okSlug = await isValidSystemCategorySlug(classification.categorySlug)
  const systemSlug = okSlug
    ? classification.categorySlug
    : 'outros'

  const { error: updateError } = await supabase
    .from('vault_files')
    .update({
      status: 'ready',
      system_category_slug: systemSlug,
      user_category_id: null,
      confidence: classification.confidence,
      manual_override: false,
    })
    .eq('id', fileId)

  if (updateError) {
    logDbError('[vault.confirmUpload] update failed', updateError)
    return fail('internal')
  }

  const { data: refreshed } = await supabase
    .from('vault_files')
    .select(VAULT_FILE_SELECT)
    .eq('id', fileId)
    .single()

  if (!refreshed) return fail('internal')

  const r = refreshed as unknown as JoinedFileRow
  const eff = mapEffectiveCategory(r.system_category, r.user_category)
  const tags = (r.tags_join ?? [])
    .map((j) => j.tag)
    .filter(
      (t): t is Database['public']['Tables']['vault_tags']['Row'] => Boolean(t),
    )
  const file = mapFile(r, r.current_blob, eff, tags)

  revalidatePath('/vault')
  return success({ file })
}

// ─── getDownloadUrl ─────────────────────────────────────────────────

export async function getDownloadUrl(
  fileId: string,
): Promise<ActionResult<{ url: string; expiresAt: string }>> {
  await assertSameOrigin()

  const parsed = fileIdSchema.safeParse({ fileId })
  if (!parsed.success) return fail('invalid')

  const user = await requireUser()
  const supabase = await createServerClient()

  const { data: frow, error: ferr } = await supabase
    .from('vault_files')
    .select('status, deleted_at, current_blob_id')
    .eq('user_id', user.id)
    .eq('id', fileId)
    .single()

  if (ferr || !frow) return fail('not_found')
  if (frow.status !== 'ready') return fail('not_uploaded')
  if (frow.deleted_at) return fail('not_found')
  if (!frow.current_blob_id) return fail('not_found')

  const { data: blob, error: berr } = await supabase
    .from('vault_file_blobs')
    .select('storage_path')
    .eq('id', frow.current_blob_id)
    .single()

  if (berr || !blob) return fail('not_found')
  const path = blob.storage_path

  const signed = await createSignedDownloadUrl(supabase, path)
  if ('error' in signed) return fail('storage_error')

  return success(signed)
}

// ─── updateMetadata ─────────────────────────────────────────────────

export async function updateMetadata(
  input: UpdateMetadataInput,
): Promise<ActionResult<null>> {
  await assertSameOrigin()

  const parsed = updateMetadataSchema.safeParse(input)
  if (!parsed.success) return fail('invalid')
  const { fileId, patch } = parsed.data
  const user = await requireUser()
  const supabase = await createServerClient()
  // Fetch current file for override pattern extraction
  const { data: currentFile } = await supabase
    .from('vault_files')
    .select('original_name, system_category_slug')
    .eq('user_id', user.id)
    .eq('id', fileId)
    .single()
  const update: Record<string, unknown> = {}
  if (patch.displayName !== undefined) update.display_name = patch.displayName
  if (patch.description !== undefined) update.description = patch.description
  if (patch.favorite !== undefined) update.favorite = patch.favorite
  if (patch.categorySlug !== undefined) {
    if (patch.categorySlug) {
      const valid = await isValidSystemCategorySlug(patch.categorySlug)
      if (!valid) return fail('invalid')
      update.system_category_slug = patch.categorySlug
      update.user_category_id = null
    } else {
      update.system_category_slug = 'outros'
      update.user_category_id = null
    }
    update.manual_override = true
    update.confidence = null
    // ── feedback loop: persist user override ────────────────────────
    // Only create override if user explicitly changed category
    const previousSlug = currentFile?.system_category_slug
    if (previousSlug && previousSlug !== patch.categorySlug && currentFile) {
      const { createOverride, extractOverridePattern } = await import('./classifier')
      // Use original_name to extract meaningful pattern for future classification
      const pattern = extractOverridePattern(currentFile.original_name)
      if (pattern) {
        const override = createOverride(
          user.id,
          pattern,
          patch.categorySlug as SystemCategorySlug,
        )
        // Persist to DB for cross-session learning
        await supabase.from('vault_classifier_overrides').upsert({
          user_id: user.id,
          pattern: override.pattern,
          category_slug: override.category,
          weight: override.weight,
          match_count: 1,
          created_at: override.createdAt,
          updated_at: override.createdAt,
        }, {
          onConflict: 'user_id,pattern',
        }).eq('user_id', user.id)
      }
    }
  }
  if (Object.keys(update).length > 0) {
    const { error } = await supabase
      .from('vault_files')
      .update(update)
      .eq('user_id', user.id)
      .eq('id', fileId)
    if (error) return fail('internal')
  }
  if (patch.tagSlugs !== undefined) {
    await supabase.from('vault_file_tags').delete().eq('file_id', fileId)
    if (patch.tagSlugs.length > 0) {
      const tagIds: string[] = []
      for (const slug of patch.tagSlugs) {
        const { data: existing } = await supabase
          .from('vault_tags')
          .select('id')
          .eq('user_id', user.id)
          .eq('slug', slug)
          .maybeSingle()
        if (existing) {
          tagIds.push(existing.id)
        } else {
          const { data: created } = await supabase
            .from('vault_tags')
            .insert({ user_id: user.id, slug, label: slug })
            .select('id')
            .single()
          if (created) tagIds.push(created.id)
        }
      }
      if (tagIds.length > 0) {
        await supabase
          .from('vault_file_tags')
          .insert(tagIds.map((tagId) => ({ file_id: fileId, tag_id: tagId })))
      }
    }
  }
  revalidatePath('/vault')
  return success(null)
}

// ─── softDelete / restore ───────────────────────────────────────────

export async function softDelete(fileId: string): Promise<ActionResult<null>> {
  await assertSameOrigin()

  const parsed = fileIdSchema.safeParse({ fileId })
  if (!parsed.success) return fail('invalid')

  const user = await requireUser()
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('vault_files')
    .update({ deleted_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .eq('id', fileId)
    .is('deleted_at', null)

  if (error) return fail('internal')

  revalidatePath('/vault')
  return success(null)
}

export async function restore(fileId: string): Promise<ActionResult<null>> {
  await assertSameOrigin()

  const parsed = fileIdSchema.safeParse({ fileId })
  if (!parsed.success) return fail('invalid')

  const user = await requireUser()
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('vault_files')
    .update({ deleted_at: null })
    .eq('user_id', user.id)
    .eq('id', fileId)
    .not('deleted_at', 'is', null)

  if (error) return fail('internal')

  revalidatePath('/vault')
  return success(null)
}

// ─── loadUserOverrides ──────────────────────────────────────────────

export async function loadUserOverrides(): Promise<ActionResult<{ count: number }>> {
  const user = await requireUser()
  const supabase = await createServerClient()
  const synced = await syncClassifierOverridesForUser(supabase, user.id)

  if (!synced.ok) return fail('internal')

  return success({ count: synced.count })
}

