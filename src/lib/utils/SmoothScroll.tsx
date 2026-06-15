'use client'

import { ReactLenis, useLenis } from 'lenis/react'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

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

      const absoluteY = el.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top: absoluteY, behavior: 'smooth' })
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [lenis])

  return null
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 2.2, wheelMultiplier: 0.85 }}>
      <AnchorHandler />
      {children}
    </ReactLenis>
  )
}
