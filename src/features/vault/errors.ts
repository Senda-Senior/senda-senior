/**
 * errors.ts
 * Códigos de erro padronizados e mensagens de UI para operações do vault
 *
 * Conecta: importado por actions.ts (fail/success), validation.ts, componentes (VAULT_ERROR_MESSAGES)
 * Camada: shared
 */

/**
 * códigos de erro padronizados. retornados em `{ ok: false, error }` por
 * server actions. mensagens humanas ficam aqui para a ui pegar.
 */

export const VAULT_ERROR_CODES = {
  // input / validação
  invalid: 'invalid',
  too_large: 'too_large',
  blocked_ext: 'blocked_ext',
  blocked_mime: 'blocked_mime',

  // estado
  duplicate: 'duplicate',
  not_found: 'not_found',
  not_uploaded: 'not_uploaded',
  not_pending: 'not_pending',
  forbidden: 'forbidden',

  // storage
  storage_error: 'storage_error',
  mime_mismatch: 'mime_mismatch',
  size_mismatch: 'size_mismatch',

  // quota
  quota: 'quota',

  // genérico
  internal: 'internal',
} as const

export type VaultErrorCode =
  (typeof VAULT_ERROR_CODES)[keyof typeof VAULT_ERROR_CODES]

export const VAULT_ERROR_MESSAGES: Record<VaultErrorCode, string> = {
  invalid: 'Dados inválidos.',
  too_large: 'Arquivo maior que o limite de 50 MB.',
  blocked_ext: 'Tipo de arquivo não permitido.',
  blocked_mime: 'Tipo de conteúdo não permitido.',
  duplicate: 'Este arquivo já está no seu cofre.',
  not_found: 'Arquivo não encontrado.',
  not_uploaded: 'Arquivo ainda não foi enviado.',
  not_pending: 'Arquivo não está aguardando confirmação.',
  forbidden: 'Sem permissão para acessar este arquivo.',
  storage_error: 'Erro ao acessar o armazenamento.',
  mime_mismatch: 'Conteúdo do arquivo não corresponde ao tipo declarado.',
  size_mismatch: 'Tamanho do arquivo não confere.',
  quota: 'Limite de armazenamento atingido.',
  internal: 'Erro interno. Tente novamente.',
}

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: VaultErrorCode; message: string }

export function fail(error: VaultErrorCode): { ok: false; error: VaultErrorCode; message: string } {
  return { ok: false, error, message: VAULT_ERROR_MESSAGES[error] }
}

export function success<T>(data: T): { ok: true; data: T } {
  return { ok: true, data }
}
