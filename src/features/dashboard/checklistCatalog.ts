/**
 * checklistCatalog.ts
 * Define o catálogo estático de itens do Checklist Prevent Care — textos, ordem e chaves.
 *
 * Conecta: nenhuma importação | importado por data.ts (getChecklist), actions.ts (validação)
 * Camada: shared
 */

/**
 * Catálogo dos itens do "Checklist Prevent Care".
 *
 * `key` é o contrato com o banco (`care_checklist_items.item_key`).
 * NUNCA reutilize uma `key` removida — escolha um novo slug. Isso
 * preserva o histórico do usuário se decidirmos reabrir um item.
 */
export const CHECKLIST_CATALOG = [
  { key: 'documentos-pasta', text: 'Reunir documentos em uma pasta' },
  { key: 'medicamentos-horarios', text: 'Lista de medicamentos e horários' },
  { key: 'contatos-emergencia', text: 'Contatos de emergência no celular' },
  { key: 'checkup-anual', text: 'Agendar check-up preventivo anualmente' },
  { key: 'casa-segura', text: 'Revisar segurança da casa e remover tapetes' },
  { key: 'procuracao-diretivas', text: 'Iniciar diálogos de procuração e diretivas' },
] as const

export type ChecklistKey = (typeof CHECKLIST_CATALOG)[number]['key']

export const CHECKLIST_KEYS: ReadonlyArray<ChecklistKey> = CHECKLIST_CATALOG.map(
  (item) => item.key,
)

export function isValidChecklistKey(key: string): key is ChecklistKey {
  return (CHECKLIST_KEYS as ReadonlyArray<string>).includes(key)
}
