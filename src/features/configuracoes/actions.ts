/**
 * actions.ts
 * Server actions de Configurações — atualizar nome de exibição do usuário.
 *
 * Conecta: assertSameOrigin, requireUser, updateDisplayName (lib/server) | chamado por ConfiguracoesView (client)
 * Camada: server
 */

'use server'

import { revalidatePath } from 'next/cache'
import { assertSameOrigin, requireUser, updateDisplayName } from '@/lib/server'

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
