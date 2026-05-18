'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { assertSameOrigin, requireUser } from '@/lib/server'
import { isValidChecklistKey } from './checklistCatalog'

const toggleSchema = z.object({
  key: z
    .string()
    .min(1)
    .refine(isValidChecklistKey, { message: 'Item de checklist desconhecido.' }),
  done: z.boolean(),
})

export type ToggleResult =
  | { ok: true }
  | { ok: false; error: string }

/**
 * Persiste o estado de um item do checklist para o usuário atual.
 * Retorna `{ ok: true }` em sucesso ou `{ ok: false, error }` em
 * falha — o componente cliente decide como apresentar.
 */
export async function toggleChecklistItem(
  input: { key: string; done: boolean },
): Promise<ToggleResult> {
  await assertSameOrigin()

  const parsed = toggleSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Entrada inválida.' }
  }

  const user = await requireUser()
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('care_checklist_items')
    .upsert(
      {
        user_id: user.id,
        item_key: parsed.data.key,
        done: parsed.data.done,
      },
      { onConflict: 'user_id,item_key' },
    )

  if (error) {
    return { ok: false, error: 'Não foi possível salvar. Tente novamente.' }
  }

  revalidatePath('/dashboard')
  return { ok: true }
}

export async function signOutAction() {
  await assertSameOrigin()
  const supabase = await createServerClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw new Error('Não foi possível encerrar a sessão agora.')
  }
  redirect('/')
}

