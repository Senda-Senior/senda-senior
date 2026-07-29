/**
 * index.ts
 * Barril de exportação — expõe componentes e funções do dashboard para o resto da aplicação.
 *
 * Conecta: importado por pages (dashboard page)
 * Camada: shared
 */

export { DashboardView } from './components/DashboardView'
export { Checklist } from './components/Checklist'
export { LogoutButton } from './components/LogoutButton'
export { ShellPageMeta } from './components/shellHeader'
export { getChecklist } from './data'
export { toggleChecklistItem } from './actions'
export { CHECKLIST_CATALOG, isValidChecklistKey } from './checklistCatalog'
export type { ChecklistItem } from './types'
