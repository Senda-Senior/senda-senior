/**
 * Reveal.tsx
 * Scroll-reveal com fade + slide (24px de baixo para cima) — detecta viewport via Lenis + getBoundingClientRect
 *
 * Conecta: framer-motion | revealRegistry (via RevealScrollSync no SmoothScroll)
 * Camada: browser (use client)
 */

'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { registerRevealCheck } from './revealRegistry'

/**
 * Scroll-reveal padrão da marca: fade + 24px de baixo para cima, 800ms,
 * ease editorial (guia §6). `delay` empilha para criar cascata em listas.
 *
 *   <Reveal>...</Reveal>                    ← reveal ao entrar no viewport
 *   <Reveal delay={0.12}>...</Reveal>       ← cascata
 *   <Reveal variant="mount">...</Reveal>    ← anima imediatamente no mount (above-the-fold)
 *
 * Implementação Lenis-aware:
 *   - Project wraps landing in <ReactLenis root> (SmoothScroll).
 *     Lenis usa CSS transform na body, o que QUEBRA IntersectionObserver.
 *   - RevealScrollSync (um por página) chama runRevealChecks no scroll do Lenis;
 *     cada Reveal registra um check com getBoundingClientRect (transform-aware).
 *
 * Acessibilidade + screenshot determinismo:
 *   - prefers-reduced-motion: reduce → retorna div estático sem animação.
 *   - Playwright config (landing-* projects) usa reducedMotion: 'reduce'.
 */

export interface RevealProps {
  children: ReactNode
  /** Delay em segundos antes da animação. Stack delays = cascata. */
  delay?: number
  className?: string
  /** Distância em pixels que o conteúdo sobe ao entrar. Default 24. */
  distance?: number
  /**
   * `inview` (padrão): anima quando elemento entra no viewport (90% bottom).
   * `mount`: anima imediatamente no mount — above-the-fold (hero/header).
   */
  variant?: 'inview' | 'mount'
}

const SENDA_EASE = [0.25, 0.46, 0.45, 0.94] as const // ↔ --ease-senda

/** Trigger animation when element top crosses this fraction of viewport from top. */
const TRIGGER_THRESHOLD = 0.9

function isInViewport(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect()
  return rect.top < window.innerHeight * TRIGGER_THRESHOLD && rect.bottom > 0
}

export function Reveal({
  children,
  delay = 0,
  className,
  distance = 24,
  variant = 'inview',
}: RevealProps) {
  const reduce = useReducedMotion() ?? false
  const ref = useRef<HTMLDivElement>(null)
  const [canAnimate, setCanAnimate] = useState(false)
  // 'mount' starts visible immediately. 'inview' waits for scroll to fire.
  const [inView, setInView] = useState(variant === 'mount')

  useEffect(() => {
    const supportsEnhancedMotion =
      'requestAnimationFrame' in window &&
      'getComputedStyle' in window &&
      (!window.matchMedia('(prefers-reduced-motion: reduce)').matches)

    if (supportsEnhancedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCanAnimate(true)
      if (variant !== 'mount' && !inView && ref.current && isInViewport(ref.current)) {
        setInView(true)
      }
    }
  }, [variant, inView])

  // Initial visibility check on mount: handles above-the-fold inview elements
  // (Hero etc). Without this, they'd wait for first scroll event before animating.
  useEffect(() => {
    if (variant === 'mount' || inView || !ref.current) return
    if (isInViewport(ref.current)) {
      setInView(true)
    }
  }, [variant, inView])

  // Shared Lenis scroll bus (RevealScrollSync) — same trigger math as before.
  useEffect(() => {
    if (inView || variant === 'mount') return
    return registerRevealCheck(() => {
      if (!ref.current) return
      if (isInViewport(ref.current)) setInView(true)
    })
  }, [inView, variant])

  if (reduce || !canAnimate) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      className={['ios-slide-reveal', className].filter(Boolean).join(' ')}
      initial={false}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: distance }}
      transition={{ duration: 0.8, delay, ease: SENDA_EASE }}
    >
      {children}
    </motion.div>
  )
}
