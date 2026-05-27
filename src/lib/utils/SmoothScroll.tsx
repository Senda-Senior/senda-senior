'use client'

import { ReactLenis, useLenis } from 'lenis/react'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

/**
 * Intercepta cliques em links #âncora e delega ao Lenis.
 * Precisa estar dentro do contexto ReactLenis para acessar useLenis().
 */
function AnchorHandler() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest('a')
      const href = anchor?.getAttribute('href')
      if (!href?.startsWith('#')) return

      const el = document.getElementById(href.slice(1))
      if (!el) return

      e.preventDefault()
      lenis?.scrollTo(el, { duration: 1.8, offset: -20 })
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [lenis])

  return null
}

/**
 * Wrapper Lenis com configuração padrão da marca:
 *   - lerp suave (0.1)
 *   - duração editorial (1.5s)
 *   - sensibilidade do scroll levemente acima do default
 *
 * Mantido em `lib/utils/` por ser cross-cutting (não pertence a
 * nenhuma feature específica).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 2.2, wheelMultiplier: 0.85 }}>
      <AnchorHandler />
      {children}
    </ReactLenis>
  )
}
