/**
 * download.ts
 * Download de arquivo da solicitação no preview (data URL ou PDF mínimo).
 *
 * Conecta: EquipeClienteView
 * Camada: browser
 */

import type { Solicitacao } from './mock'

/** PDF mínimo válido — fallback quando o envio antigo só tinha o nome. */
const FALLBACK_PDF_BASE64 =
  'JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PmVuZG9iagoyIDAgb2JqCjw8L1R5cGUvUGFnZXMvQ291bnQgMS9LaWRzWzMgMCBSXT4+ZW5kb2JqCjMgMCBvYmoKPDwvVHlwZS9QYWdlL1BhcmVudCAyIDAgUi9NZWRpYUJveFswIDAgNjEyIDc5Ml0+PmVuZG9iagp4cmVmCjAgNAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDA2OCAwMDAwMCBuIAowMDAwMDAwMTI1IDAwMDAwIG4gCnRyYWlsZXIKPDwvU2l6ZSA0L1Jvb3QgMSAwIFI+PgpzdGFydHhyZWYKMjA0CiUlRU9G'

export function downloadSolicitacaoArquivo(item: Solicitacao): void {
  if (!item.arquivo || typeof document === 'undefined') return

  let url = item.arquivoDataUrl ?? null
  let revoke = false

  if (!url) {
    const bytes = Uint8Array.from(atob(FALLBACK_PDF_BASE64), (c) => c.charCodeAt(0))
    url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }))
    revoke = true
  }

  const a = document.createElement('a')
  a.href = url
  a.download = item.arquivo
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  if (revoke) URL.revokeObjectURL(url)
}

/** Limite para guardar data URL no localStorage do preview. */
export const MOCK_UPLOAD_MAX_BYTES = 5 * 1024 * 1024

export function readFileAsDataUrl(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    if (file.size > MOCK_UPLOAD_MAX_BYTES) {
      resolve(null)
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      resolve(typeof reader.result === 'string' ? reader.result : null)
    }
    reader.onerror = () => resolve(null)
    reader.readAsDataURL(file)
  })
}
