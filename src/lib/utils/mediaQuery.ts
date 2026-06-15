/**
 * mediaQuery.ts
 * Hook useMediaQuery e utility listenMediaQuery — compatível com legacy addListener/removeListener
 *
 * Conecta: importa useSyncExternalStore (react) | importado em components responsive
 * Camada: browser (use client)
 */

'use client'

import { useSyncExternalStore } from 'react'

type MediaQueryChangeHandler = (event: MediaQueryListEvent | MediaQueryList) => void
type LegacyMediaQueryList = MediaQueryList & {
  addListener: (handler: MediaQueryChangeHandler) => void
  removeListener: (handler: MediaQueryChangeHandler) => void
}

export function listenMediaQuery(
  mediaQuery: MediaQueryList,
  handler: MediaQueryChangeHandler,
) {
  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }

  const legacyMediaQuery = mediaQuery as LegacyMediaQueryList
  legacyMediaQuery.addListener(handler)
  return () => legacyMediaQuery.removeListener(handler)
}

export function useMediaQuery(query: string, serverSnapshot = false) {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mediaQuery = window.matchMedia(query)
      return listenMediaQuery(mediaQuery, onStoreChange)
    },
    () => window.matchMedia(query).matches,
    () => serverSnapshot,
  )
}
