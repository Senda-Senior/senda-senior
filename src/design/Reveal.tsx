'use client'

import type { ReactNode } from 'react'

/**
 * Pass-through wrapper para conteúdo que eventualmente terá scroll-reveal.
 *
 * Status atual: NO-OP — apenas renderiza children num div.
 *
 * Histórico:
 *   - 2026-05-10: tentativa de implementação com Framer Motion + IntersectionObserver
 *     (commits 819555e + 408b3c1) foi revertida porque interação com Lenis (`root` mode
 *     em src/lib/utils/SmoothScroll.tsx) + padrão sticky-deck (src/app/page.tsx) +
 *     useState/useEffect causou IO não disparar confiavelmente em elementos abaixo da
 *     dobra. Resultado: conteúdo dentro de <Reveal> ficava em `opacity:0` permanente
 *     em scroll real no browser.
 *
 * Reattempt requer: investigar Lenis ↔ IntersectionObserver, possivelmente migrar
 * para `lenis.on('scroll')` direto ou usar uma alternativa scroll-driven que respeite
 * smooth scroll com transform.
 *
 * Aceita as mesmas props da implementação animada para que componentes existentes
 * continuem compilando sem mudança.
 */

export interface RevealProps {
  children: ReactNode
  /** No-op nesta versão. Manteremos pra quando reativarmos animação. */
  delay?: number
  className?: string
  /** No-op nesta versão. */
  distance?: number
  /** No-op nesta versão. */
  variant?: 'inview' | 'mount'
}

export function Reveal({ children, className }: RevealProps) {
  return <div className={className}>{children}</div>
}
