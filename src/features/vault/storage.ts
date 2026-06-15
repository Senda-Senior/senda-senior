/**
 * storage.ts
 * Operações em Supabase Storage — signed URLs (upload/download), stat object, remove
 *
 * Conecta: importado por actions.ts (prepareUpload, confirmUpload, getDownloadUrl), storage.ts
 * Camada: server (requer server client)
 */

import 'server-only'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'
import { VAULT_LIMITS } from './validation'

type SB = SupabaseClient<Database>

const BUCKET = 'vault'

export function buildStoragePath(userId: string, fileId: string, ext: string): string {
  const cleanExt = ext.replace(/^\.+/, '').toLowerCase().slice(0, 16)
  return cleanExt
    ? `${userId}/${fileId}.${cleanExt}`
    : `${userId}/${fileId}`
}

export async function createSignedUploadUrl(
  supabase: SB,
  path: string,
): Promise<{ url: string; token: string; expiresAt: string } | { error: string }> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUploadUrl(path)

  if (error || !data) return { error: error?.message ?? 'unknown' }

  const expiresAt = new Date(
    Date.now() + VAULT_LIMITS.signedUploadTtlSeconds * 1000,
  ).toISOString()

  return { url: data.signedUrl, token: data.token, expiresAt }
}

export async function createSignedDownloadUrl(
  supabase: SB,
  path: string,
): Promise<{ url: string; expiresAt: string } | { error: string }> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, VAULT_LIMITS.signedDownloadTtlSeconds, { download: true })

  if (error || !data) return { error: error?.message ?? 'unknown' }

  const expiresAt = new Date(
    Date.now() + VAULT_LIMITS.signedDownloadTtlSeconds * 1000,
  ).toISOString()

  return { url: data.signedUrl, expiresAt }
}

export async function statObject(
  supabase: SB,
  path: string,
): Promise<{ size: number } | null> {
  const segments = path.split('/').filter(Boolean)
  const filename = segments.pop()
  if (!filename) return null
  const folder = segments.join('/')

  const { data, error } = await supabase.storage.from(BUCKET).list(folder, {
    limit: 100,
    offset: 0,
    sortBy: { column: 'name', order: 'asc' },
  })

  if (error || !data?.length) return null

  const obj = data.find((o) => o.name === filename)
  if (!obj) return null

  const meta = obj.metadata as Record<string, unknown> | null | undefined
  const raw =
    meta?.size ?? meta?.contentLength ?? meta?.content_length ?? null
  const size = typeof raw === 'number' ? raw : Number(raw)
  if (!Number.isFinite(size) || size < 0) return null

  return { size }
}

export async function removeObject(
  supabase: SB,
  path: string,
): Promise<boolean> {
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  return !error
}

