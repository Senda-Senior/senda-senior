/**
 * useMockSolicitacoes.ts
 * Hook do preview — lê/escreve solicitações do mockStore (por userId).
 *
 * Usa useSyncExternalStore (SSR snapshot = []) para evitar hydration mismatch
 * e o lint react-hooks/set-state-in-effect.
 *
 * Conecta: mockStore | SolicitacoesView, EquipeClienteView, AssessoriaView
 * Camada: browser (use client)
 */

'use client'

import { useCallback, useSyncExternalStore } from 'react'
import type { Solicitacao, SolicitacaoStatus } from './mock'
import {
  addMockSolicitacao,
  enviarMockArquivo,
  getMockSolicitacoes,
  getMockSolicitacoesServerSnapshot,
  patchMockSolicitacao,
  subscribeMockStore,
  updateMockSolicitacaoStatus,
} from './mockStore'

export function useMockSolicitacoes(ownerUserId: string, clienteId: string) {
  const itens = useSyncExternalStore(
    subscribeMockStore,
    () => getMockSolicitacoes(ownerUserId, clienteId),
    getMockSolicitacoesServerSnapshot,
  )

  const adicionar = useCallback(
    (item: Solicitacao) => {
      if (!ownerUserId) return
      addMockSolicitacao(ownerUserId, clienteId, item)
    },
    [ownerUserId, clienteId],
  )

  const setStatus = useCallback(
    (id: string, status: SolicitacaoStatus) => {
      if (!ownerUserId) return
      updateMockSolicitacaoStatus(ownerUserId, clienteId, id, status)
    },
    [ownerUserId, clienteId],
  )

  const enviarArquivo = useCallback(
    (id: string, arquivoNome: string, arquivoDataUrl?: string | null) => {
      if (!ownerUserId) return
      enviarMockArquivo(ownerUserId, clienteId, id, arquivoNome, arquivoDataUrl)
    },
    [ownerUserId, clienteId],
  )

  const atualizar = useCallback(
    (id: string, patch: Partial<Solicitacao>) => {
      if (!ownerUserId) return
      patchMockSolicitacao(ownerUserId, clienteId, id, patch)
    },
    [ownerUserId, clienteId],
  )

  return { itens, adicionar, setStatus, enviarArquivo, atualizar }
}
