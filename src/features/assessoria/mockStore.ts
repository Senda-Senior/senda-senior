/**
 * mockStore.ts
 * Store local do preview — sincroniza solicitações entre visão assessora e cliente.
 *
 * Persistência: localStorage keyed por userId (evita herança entre contas no mesmo browser).
 * Conecta: useMockSolicitacoes | views de assessoria/dashboard | logout
 * Camada: browser
 */

import { CLIENTES, type Solicitacao, type SolicitacaoStatus } from './mock'

const STORAGE_PREFIX = 'senda:mock-solicitacoes:v2:'

/** No preview, a conta logada “é” o cliente Daniel. */
export const PREVIEW_CLIENTE_ID = 'daniel'

type StoreMap = Record<string, Solicitacao[]>

type Listener = () => void

const listeners = new Set<Listener>()

function storageKey(ownerUserId: string): string {
  return `${STORAGE_PREFIX}${ownerUserId}`
}

function seed(): StoreMap {
  return Object.fromEntries(CLIENTES.map((c) => [c.id, structuredClone(c.solicitacoes)]))
}

function readStore(ownerUserId: string): StoreMap {
  if (typeof window === 'undefined' || !ownerUserId) return seed()
  try {
    const raw = window.localStorage.getItem(storageKey(ownerUserId))
    if (!raw) {
      const initial = seed()
      writeStore(ownerUserId, initial)
      return initial
    }
    const parsed = JSON.parse(raw) as StoreMap
    const base = seed()
    for (const id of Object.keys(base)) {
      if (!parsed[id]) parsed[id] = base[id]
    }
    return parsed
  } catch {
    return seed()
  }
}

function writeStore(ownerUserId: string, store: StoreMap) {
  if (typeof window === 'undefined' || !ownerUserId) return
  try {
    window.localStorage.setItem(storageKey(ownerUserId), JSON.stringify(store))
  } catch {
    const slim: StoreMap = {}
    for (const [id, list] of Object.entries(store)) {
      slim[id] = list.map(({ arquivoDataUrl: _drop, ...rest }) => rest)
    }
    try {
      window.localStorage.setItem(storageKey(ownerUserId), JSON.stringify(slim))
    } catch {
      // ignore quota
    }
  }
  listeners.forEach((l) => l())
}

export function subscribeMockStore(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getMockSolicitacoes(ownerUserId: string, clienteId: string): Solicitacao[] {
  return readStore(ownerUserId)[clienteId] ?? []
}

export function addMockSolicitacao(
  ownerUserId: string,
  clienteId: string,
  item: Solicitacao,
): void {
  const store = readStore(ownerUserId)
  store[clienteId] = [item, ...(store[clienteId] ?? [])]
  writeStore(ownerUserId, store)
}

export function updateMockSolicitacaoStatus(
  ownerUserId: string,
  clienteId: string,
  id: string,
  status: SolicitacaoStatus,
): void {
  const store = readStore(ownerUserId)
  const list = store[clienteId] ?? []
  store[clienteId] = list.map((s) => (s.id === id ? { ...s, status } : s))
  writeStore(ownerUserId, store)
}

export function enviarMockArquivo(
  ownerUserId: string,
  clienteId: string,
  id: string,
  arquivoNome: string,
  arquivoDataUrl?: string | null,
): void {
  const store = readStore(ownerUserId)
  const list = store[clienteId] ?? []
  store[clienteId] = list.map((s) =>
    s.id === id
      ? {
          ...s,
          status: 'enviado' as const,
          arquivo: arquivoNome,
          arquivoDataUrl: arquivoDataUrl ?? null,
        }
      : s,
  )
  writeStore(ownerUserId, store)
}

export function patchMockSolicitacao(
  ownerUserId: string,
  clienteId: string,
  id: string,
  patch: Partial<Solicitacao>,
): void {
  const store = readStore(ownerUserId)
  const list = store[clienteId] ?? []
  store[clienteId] = list.map((s) => (s.id === id ? { ...s, ...patch } : s))
  writeStore(ownerUserId, store)
}

/** Remove todos os stores de preview (chamar no logout no client). */
export function clearAllMockStores(): void {
  if (typeof window === 'undefined') return
  const toRemove: string[] = []
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i)
    if (
      key &&
      (key.startsWith(STORAGE_PREFIX) || key.startsWith('senda:mock-solicitacoes:v1'))
    ) {
      toRemove.push(key)
    }
  }
  toRemove.forEach((key) => window.localStorage.removeItem(key))
  listeners.forEach((l) => l())
}
