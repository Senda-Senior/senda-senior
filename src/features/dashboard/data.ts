/**
 * data.ts
 * Carrega dados do dashboard (checklist) da camada Supabase — merge catálogo + estado persistido.
 *
 * Conecta: importa createServerClient (supabase), CHECKLIST_CATALOG, ChecklistItem | importado por DashboardPage (RSC)
 * Camada: server
 */

import 'server-only'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { CHECKLIST_CATALOG } from './checklistCatalog'
import type { ChecklistItem } from './types'

/**
 * Carrega o checklist do usuário informado.
 *
 * Retorna SEMPRE o catálogo completo, mesclando o estado persistido
 * (a tabela só contém os items que o usuário marcou alguma vez).
 * Itens nunca tocados começam com `done: false`.
 *
 * O chamador é responsável por garantir que `userId` veio de uma
 * sessão autenticada — tipicamente `requireUser()`.
 */
export async function getChecklist(userId: string): Promise<ChecklistItem[]> {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('care_checklist_items')
    .select('item_key, done')
    .eq('user_id', userId)

  if (error) {
    throw new Error(`[dashboard.getChecklist] ${error.message}`)
  }

  const stateByKey = new Map<string, boolean>(
    (data ?? []).map((row) => [row.item_key, row.done]),
  )

  return CHECKLIST_CATALOG.map((item) => ({
    key: item.key,
    text: item.text,
    done: stateByKey.get(item.key) ?? false,
  }))
}

