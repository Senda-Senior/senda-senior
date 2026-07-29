/**
 * actions.ts
 * Server actions da assessoria — download assinado de arquivo entregue na solicitação.
 *
 * Não abre storage ao assessor de forma ampla: entitlement via RLS em
 * document_requests + vault_files + policy estreita de storage no path entregue.
 *
 * Conecta: requireUser | vault storage signed URL | document_requests
 * Camada: server ('use server')
 */

'use server'

import { z } from 'zod'
import { assertSameOrigin, requireUser } from '@/lib/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createSignedDownloadUrl } from '@/features/vault/storage'

export type AssessoriaActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }

const requestIdSchema = z.object({
  requestId: z.string().uuid(),
})

/**
 * Signed URL curta para o arquivo anexado a uma solicitação.
 * Assessora (ou cliente do vínculo) com SELECT RLS válido.
 */
export async function createSignedDownloadForRequest(
  requestId: string,
): Promise<AssessoriaActionResult<{ url: string; expiresAt: string }>> {
  await assertSameOrigin()

  const parsed = requestIdSchema.safeParse({ requestId })
  if (!parsed.success) return { ok: false, error: 'invalid' }

  await requireUser()
  const supabase = await createServerClient()

  const { data: req, error: reqErr } = await supabase
    .from('document_requests')
    .select('id, status, vault_file_id, link_id')
    .eq('id', parsed.data.requestId)
    .maybeSingle()

  if (reqErr || !req) return { ok: false, error: 'not_found' }
  if (!req.vault_file_id) return { ok: false, error: 'not_uploaded' }
  if (
    !['enviado', 'em_revisao', 'aprovado', 'precisa_atualizacao'].includes(req.status)
  ) {
    return { ok: false, error: 'forbidden' }
  }

  const { data: file, error: fileErr } = await supabase
    .from('vault_files')
    .select('id, status, deleted_at, current_blob_id')
    .eq('id', req.vault_file_id)
    .maybeSingle()

  if (fileErr || !file) return { ok: false, error: 'not_found' }
  if (file.status !== 'ready' || file.deleted_at || !file.current_blob_id) {
    return { ok: false, error: 'not_found' }
  }

  const { data: blob, error: blobErr } = await supabase
    .from('vault_file_blobs')
    .select('storage_path')
    .eq('id', file.current_blob_id)
    .maybeSingle()

  if (blobErr || !blob?.storage_path) return { ok: false, error: 'not_found' }

  const signed = await createSignedDownloadUrl(supabase, blob.storage_path)
  if ('error' in signed) return { ok: false, error: 'storage_error' }

  return { ok: true, data: signed }
}
