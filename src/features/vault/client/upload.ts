/**
 * upload.ts
 * Pipeline cliente de upload — orquestra hashing, prepareUpload, upload e confirmUpload
 *
 * Conecta: importado por VaultUploader.tsx; chama sha256OfFile, server actions, Supabase Storage
 * Camada: browser
 */

import { createClient as createBrowserClient } from '@/lib/supabase/client'
import { sha256OfFile } from './hash'
import type { ActionResult } from '../errors'

/**
 * Pipeline cliente de upload. Pensado para ser plugado em qualquer ui
 * (botão único, drag-drop, área grande). Não conhece a ui — só toca
 * server actions e supabase storage.
 */

interface UploadCallbacks {
  prepareUpload: (input: {
    name: string
    size: number
    mime: string
    sha256: string
  }) => Promise<
    ActionResult<{
      fileId: string
      uploadUrl: string
      uploadToken: string
      storagePath: string
      expiresAt: string
    }>
  >
  confirmUpload: (fileId: string) => Promise<ActionResult<unknown>>
  onProgress?: (phase: 'hashing' | 'uploading' | 'confirming', percent: number) => void
}

export interface UploadResult {
  ok: boolean
  fileId?: string
  error?: string
}

export async function uploadFile(
  file: File,
  cb: UploadCallbacks,
): Promise<UploadResult> {
  cb.onProgress?.('hashing', 0)
  const sha256 = await sha256OfFile(file)
  cb.onProgress?.('hashing', 100)

  const prepared = await cb.prepareUpload({
    name: file.name,
    size: file.size,
    mime: file.type || 'application/octet-stream',
    sha256,
  })

  if (!prepared.ok) {
    return { ok: false, error: prepared.error }
  }

  cb.onProgress?.('uploading', 0)

  // Usar o cliente oficial (headers apikey/auth + multipart iguais ao SDK).
  // `fetch` manual ao signedUrl costuma falhar (403/400) por headers incompletos.
  const supabase = createBrowserClient()
  const { error: uploadErr } = await supabase.storage
    .from('vault')
    .uploadToSignedUrl(prepared.data.storagePath, prepared.data.uploadToken, file)

  if (uploadErr) {
    console.error('[vault upload] uploadToSignedUrl:', uploadErr.message)
    return { ok: false, error: 'storage_error' }
  }

  cb.onProgress?.('uploading', 100)
  cb.onProgress?.('confirming', 0)

  const confirmed = await cb.confirmUpload(prepared.data.fileId)
  cb.onProgress?.('confirming', 100)

  if (!confirmed.ok) {
    return { ok: false, error: confirmed.error }
  }

  return { ok: true, fileId: prepared.data.fileId }
}

