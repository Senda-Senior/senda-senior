/**
 * SmoothScroll.tsx
 * Wrapper do Lenis (smooth scroll) com handler de anchor navigation — expõe useLenis hook
 *
 * Conecta: importa lenis/react | importado na landing (page.tsx)
 * Camada: browser (use client)
 *
 * Aceita `#seção` e `/#seção` (Header pós-vitrines manuais). Só intercepta
 * quando o destino é a home (`/`) — senão deixa o browser navegar.
 */

'use client'

import { ReactLenis, useLenis } from 'lenis/react'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { RevealScrollSync } from '@/design/RevealScrollSync'

const EASE_OUT = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
const EASE_IN_OUT = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2

/** Duração das âncoras — antes 2.6s (sensação de lag). */
const DURATION = 1.15
const HEADER_OFFSET = 80

// ALERTA MAPA ID→CONTEÚDO (os nomes confundem): `#por-quem-viveu` = SERVIÇOS (componente
//    FundadorasStrip, menu "Serviços"); `#sobre` = SOBRE/FUNDADORAS (componente PorQuemViveu,
//    menu "Sobre"). Os ids batem com o heading de cada seção, não com o nome do componente.
const CEILING: Record<string, string> = {
  '#por-quem-viveu': '#manifesto-verde',
  '#metodologia': '#por-quem-viveu',
  '#manuais': '#metodologia',
  '#sobre': '#manuais',
  '#conteudo': '#sobre',
  '#contato': '#conteudo',
}

/**
 * Normaliza href de âncora da home.
 * Aceita `#id`, `/#id`, `https://host/#id`. Retorna `#id` ou null.
 */
export function resolveHomeHash(
  href: string,
  origin = typeof window !== 'undefined' ? window.location.origin : 'https://sendasenior.com.br',
): string | null {
  if (!href) return null
  if (href.startsWith('#') && href.length > 1) return href

  try {
    const url = new URL(href, origin)
    if (url.origin !== origin) return null
    if (url.pathname !== '/' && url.pathname !== '') return null
    if (!url.hash || url.hash.length < 2) return null
    return url.hash
  } catch {
    return null
  }
}

function getDocumentTop(el: HTMLElement): number {
  let top = 0
  let node: HTMLElement | null = el
  while (node) {
    top += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return top
}

function getDeckFlowTop(el: HTMLElement): number {
  let wrapper: HTMLElement = el
  while (wrapper.parentElement && wrapper.parentElement.tagName !== 'MAIN') {
    wrapper = wrapper.parentElement
  }
  let top = 0
  let sib = wrapper.previousElementSibling as HTMLElement | null
  while (sib) {
    top += sib.offsetHeight
    sib = sib.previousElementSibling as HTMLElement | null
  }
  return top
}

type LenisInstance = NonNullable<ReturnType<typeof useLenis>>

function scrollToHash(lenis: LenisInstance, hash: string) {
  const el = document.getElementById(hash.slice(1))
  if (!el) return

  lenis.start()

  if (hash === '#hero') {
    lenis.scrollTo(0, { duration: DURATION, easing: EASE_OUT })
    return
  }

  if (hash === '#por-quem-viveu') {
    lenis.scrollTo(getDeckFlowTop(el) - HEADER_OFFSET, {
      duration: DURATION,
      easing: EASE_OUT,
    })
    return
  }

  const rect = el.getBoundingClientRect()

  if (rect.top >= 10 || window.scrollY <= 300) {
    lenis.scrollTo(rect.top + window.scrollY - HEADER_OFFSET, {
      duration: DURATION,
      easing: EASE_OUT,
    })
    return
  }

  const ceilingHref = CEILING[hash]
  const ceilingEl = ceilingHref ? document.getElementById(ceilingHref.slice(1)) : null
  const ceilingY = ceilingEl ? Math.max(0, getDocumentTop(ceilingEl) - HEADER_OFFSET) : 0

  lenis.scrollTo(ceilingY, {
    duration: 0.7,
    easing: EASE_IN_OUT,
    onComplete: () => {
      const freshRect = el.getBoundingClientRect()
      lenis.scrollTo(freshRect.top + window.scrollY - HEADER_OFFSET, {
        duration: 0.65,
        easing: EASE_IN_OUT,
      })
    },
  })
}

function AnchorHandler() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

    function handleClick(e: MouseEvent) {
      if (!lenis) return
      const anchor = (e.target as HTMLElement).closest('a')
      const href = anchor?.getAttribute('href')
      if (!href) return

      const hash = resolveHomeHash(href)
      if (!hash) return

      // Já estamos na home: intercepta. Fora dela, deixa navegar para `/#…`.
      if (window.location.pathname !== '/') return

      const el = document.getElementById(hash.slice(1))
      if (!el) return

      e.preventDefault()
      if (window.location.hash !== hash) {
        history.pushState(null, '', hash)
      }
      scrollToHash(lenis, hash)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [lenis])

  // Chegada via `/manuais` → `/#sobre` (ou refresh com hash)
  useEffect(() => {
    if (!lenis) return
    const hash = window.location.hash
    if (!hash || hash.length < 2) return

    let timeoutId = 0
    const rafId = requestAnimationFrame(() => {
      scrollToHash(lenis, hash)
      timeoutId = window.setTimeout(() => scrollToHash(lenis, hash), 120)
    })

    return () => {
      cancelAnimationFrame(rafId)
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [lenis])

  return null
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.12, duration: 1.15, wheelMultiplier: 0.9 }}>
      <AnchorHandler />
      <RevealScrollSync />
      {children}
    </ReactLenis>
  )
}
