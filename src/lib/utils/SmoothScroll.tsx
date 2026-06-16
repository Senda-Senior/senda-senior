/**
 * SmoothScroll.tsx
 * Wrapper do Lenis (smooth scroll) com handler de anchor navigation — expõe useLenis hook
 *
 * Conecta: importa lenis/react | importado em root layout
 * Camada: browser (use client)
 */

'use client'

import { ReactLenis, useLenis } from 'lenis/react'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

// Ease-out exponencial: começa rápido, desacelera (subida ao teto)
const EASE_OUT = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
// Ease-in-out senoidal: começa devagar, acelera no meio, pousa suave (descida)
const EASE_IN_OUT = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2

const DURATION = 2.6
const HEADER_OFFSET = 80

// ALERTA MAPA ID→CONTEÚDO (os nomes confundem): `#por-quem-viveu` = SERVIÇOS (componente
//    FundadorasStrip, menu "Serviços"); `#sobre` = SOBRE/FUNDADORAS (componente PorQuemViveu,
//    menu "Sobre"). Os ids batem com o heading de cada seção, não com o nome do componente.
//
// Âncora de teto para cada seção: a seção imediatamente acima na ordem da página.
// Quando uma seção está grudada (stuck) e não conseguimos calcular sua posição
// via getBoundingClientRect, subimos primeiro até o teto — que está acima e tem
// posição calculável via offsetTop — depois pousamos graciosamente no destino.
const CEILING: Record<string, string> = {
  '#por-quem-viveu': '#manifesto-verde',
  '#metodologia':    '#por-quem-viveu',
  '#manuais':        '#metodologia',
  '#sobre':          '#manuais',
  '#conteudo':       '#sobre',
  '#contato':        '#conteudo',
}

// Retorna a posição natural do elemento no documento, ignorando sticky/transform
function getDocumentTop(el: HTMLElement): number {
  let top = 0
  let node: HTMLElement | null = el
  while (node) {
    top += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return top
}

// Posição de flow de uma seção do deck, IMUNE à corrupção do sticky.
// `offsetTop`/`getBoundingClientRect` de uma seção `position: sticky` grudada
// reportam a posição PRESA (≈ scroll atual), não a posição real. Como o <main>
// é o bloco-contêiner, seções sticky ficam grudadas por quase a página inteira.
// Somar o `offsetHeight` das seções ANTERIORES (alturas são estáveis, sticky só
// translada, não muda altura) dá a posição de flow correta e estável.
function getDeckFlowTop(el: HTMLElement): number {
  // Sobe até o wrapper que é filho direto de <main>
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
      lenis?.start()

      // #hero sempre vai para o topo absoluto
      if (href === '#hero') {
        lenis?.scrollTo(0, { duration: DURATION, easing: EASE_OUT })
        return
      }

      // #por-quem-viveu (FundadorasStrip) é `position: sticky` e, como o <main> é o
      // bloco-contêiner, fica grudado no topo por quase a página toda (atrás das seções
      // de z maior). Quando grudado, `offsetTop` e `getBoundingClientRect` reportam a
      // posição PRESA (≈ scroll atual), não a de flow — então o teto/destino vinham
      // ≈ "onde você já está" e o scroll "empurrava fraquinho e não subia". getDeckFlowTop
      // soma a altura das seções anteriores (estável, imune ao sticky) e dá a posição real.
      if (href === '#por-quem-viveu') {
        lenis?.scrollTo(getDeckFlowTop(el) - HEADER_OFFSET, {
          duration: DURATION,
          easing: EASE_OUT,
        })
        return
      }

      const rect = el.getBoundingClientRect()

      // Elemento em posição natural (não grudado): scroll direto
      if (rect.top >= 10 || window.scrollY <= 300) {
        lenis?.scrollTo(rect.top + window.scrollY - HEADER_OFFSET, {
          duration: DURATION,
          easing: EASE_OUT,
        })
        return
      }

      // Elemento grudado (sticky) ou acima do viewport.
      // Sobe até o teto da seção (posição calculável via offsetTop, ignorando
      // sticky/transform) e pousa graciosamente no destino com o rect já fresco.
      const ceilingHref = CEILING[href]
      const ceilingEl = ceilingHref
        ? document.getElementById(ceilingHref.slice(1))
        : null
      const ceilingY = ceilingEl
        ? Math.max(0, getDocumentTop(ceilingEl) - HEADER_OFFSET)
        : 0

      lenis?.scrollTo(ceilingY, {
        duration: 0.85,
        easing: EASE_IN_OUT,
        onComplete: () => {
          // Do teto, o destino está abaixo e visível: getBoundingClientRect é preciso
          const freshRect = el.getBoundingClientRect()
          lenis?.scrollTo(freshRect.top + window.scrollY - HEADER_OFFSET, {
            duration: 0.8,
            easing: EASE_IN_OUT,
          })
        },
      })
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
