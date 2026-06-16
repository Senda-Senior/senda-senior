/**
 * actions.ts
 * Server actions de Configurações — atualizar nome de exibição do usuário.
 *
 * Conecta: assertSameOrigin, requireUser, updateDisplayName (lib/server) | chamado por ConfiguracoesView (client)
 * Camada: server
 */

'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { assertSameOrigin, requireUser, updateDisplayName } from '@/lib/server'
import { DELETE_ACCOUNT_CONFIRMATION } from './constants'

export type UpdateNameResult = { ok: true } | { ok: false; error: string }

/**
 * Atualiza o `display_name` do usuário autenticado. Revalida as rotas
 * que exibem o nome (configurações, dashboard, header).
 */
export async function updateProfileNameAction(displayName: string): Promise<UpdateNameResult> {
  await assertSameOrigin()

  const user = await requireUser()
  const result = await updateDisplayName(user, displayName)

  if (result.ok) {
    revalidatePath('/configuracoes')
    revalidatePath('/dashboard')
  }
  return result
}

/**
 * Exclui permanentemente a conta do usuário autenticado (LGPD art. 18 — eliminação).
 * Em sucesso, encerra a sessão e redireciona para a home (não retorna). Só retorna em erro.
 *
 * Ordem: 1) remove blobs do Storage do usuário (não cascateiam); 2) apaga `auth.users`
 * via RPC SECURITY DEFINER restrita ao próprio `auth.uid()` (cascade limpa public.*);
 * 3) limpa a sessão local. Ver migration 0014_delete_current_user.sql.
 */
export async function deleteAccountAction(
  confirmation: string,
): Promise<{ ok: false; error: string }> {
  await assertSameOrigin()
  const user = await requireUser()

  if (confirmation.trim().toUpperCase() !== DELETE_ACCOUNT_CONFIRMATION) {
    return { ok: false, error: `Digite ${DELETE_ACCOUNT_CONFIRMATION} para confirmar.` }
  }

  const supabase = await createServerClient()

  // 1) Remove os arquivos do cofre (storage não cascateia). Best-effort: uma falha
  //    de limpeza não deve impedir a exclusão da conta. Arquivos ficam sob a "pasta"
  //    com o id do usuário (ver buildStoragePath em features/vault/storage.ts).
  try {
    for (let page = 0; page < 50; page++) {
      const { data, error } = await supabase.storage
        .from('vault')
        .list(user.id, { limit: 100 })
      if (error || !data || data.length === 0) break
      await supabase.storage.from('vault').remove(data.map((o) => `${user.id}/${o.name}`))
      if (data.length < 100) break
    }
  } catch {
    // segue para a exclusão da conta mesmo assim
  }

  // 2) Apaga o usuário em auth.users (cascade limpa profiles, vault_*, checklist...).
  //    `Functions` ainda não está nos tipos gerados; cast localizado.
  const { error: rpcError } = await (
    supabase.rpc as unknown as (
      fn: 'delete_current_user',
    ) => Promise<{ error: { message: string } | null }>
  )('delete_current_user')

  if (rpcError) {
    return { ok: false, error: 'Não foi possível excluir a conta agora. Tente novamente.' }
  }

  // 3) Limpa a sessão local (o usuário já não existe no servidor).
  await supabase.auth.signOut({ scope: 'global' }).catch(() => {})

  redirect('/')
}
