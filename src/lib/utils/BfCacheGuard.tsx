/**
 * BfCacheGuard.tsx
 * Previne problemas de bfcache (back-forward cache) — reseta DOM mutations ao restaurar página
 *
 * Conecta: nenhuma | importado em root layout
 * Camada: browser (use client)
 */

'use client'

import { useEffect } from 'react'

// When the browser restores a page from bfcache (back-forward cache), React
// does not re-run effects. Any DOM mutations made before navigation (e.g.
// body.overflow = 'hidden' from the splash screen) are preserved verbatim.
// This component listens for pageshow with persisted=true and resets them.
export function BfCacheGuard() {
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        document.body.style.overflow = ''
      }
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [])
  return null
}
