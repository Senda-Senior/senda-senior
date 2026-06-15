/**
 * types.ts
 * Tipos TypeScript para o domínio dashboard — ChecklistItem.
 *
 * Conecta: nenhuma importação | importado por data.ts, components (Checklist, DashboardView)
 * Camada: shared
 */

/**
 * Itens do checklist exibido no dashboard.
 *
 * O catálogo (textos, ordem) vive em código (`./checklistCatalog.ts`)
 * para que a equipe editorial não precise tocar no banco para mexer
 * no copy. O banco guarda apenas o estado por usuário (key + done).
 */
export interface ChecklistItem {
  key: string
  text: string
  done: boolean
}
