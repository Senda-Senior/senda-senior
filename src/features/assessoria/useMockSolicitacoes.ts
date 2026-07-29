/**
 * useMockSolicitacoes.ts
 * Hook do preview — lê/escreve solicitações do mockStore (por userId).
 *
 * Estado inicial sempre [] (SSR = 1º paint do client) para evitar hydration mismatch.
 * O localStorage só entra depois do mount via useEffect.
 *
 * Conecta: mockStore | SolicitacoesView, DashboardView, EquipeClienteView
 * Camada: browser (use client)
 */

'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Solicitacao, SolicitacaoStatus } from './mock'
import {
  addMockSolicitacao,
  enviarMockArquivo,
  getMockSolicitacoes,
  patchMockSolicitacao,
  subscribeMockStore,
  updateMockSolicitacaoStatus,
} from './mockStore'

export function useMockSolicitacoes(ownerUserId: string, clienteId: string) {
  // Nunca ler localStorage no initializer — divergiria do HTML do servidor.
  const [itens, setItens] = useState<Solicitacao[]>([])

  useEffect(() => {
    if (!ownerUserId) {
      setItens([])
      return
    }
    function sync() {
      setItens(getMockSolicitacoes(ownerUserId, clienteId))
    }
    sync()
    return subscribeMockStore(sync)
  }, [ownerUserId, clienteId])

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
