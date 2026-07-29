/**
 * index.ts
 * Barril da feature assessoria — views de preview e mock compartilhado.
 *
 * Conecta: pages /solicitacoes e /assessoria
 * Camada: shared
 */

export { SolicitacoesView } from './components/SolicitacoesView'
export { AssessoriaView } from './components/AssessoriaView'
export { EquipePainelView } from './components/EquipePainelView'
export { EquipeClienteView } from './components/EquipeClienteView'
export {
  ASSESSORAS,
  SOLICITACOES,
  CLIENTES,
  ETAPAS,
  countPendencias,
  statusLabel,
  getCliente,
  clienteStatusLabel,
} from './mock'
export { PREVIEW_CLIENTE_ID } from './mockStore'
export type { Solicitacao, SolicitacaoStatus, Assessora, ClienteMock } from './mock'
export {
  canAccessAssessoria,
  canAccessAssessoriaPreview,
  assertAssessoriaAccess,
  isAdvisoryAdvisor,
} from './access'
export { createSignedDownloadForRequest } from './actions'
