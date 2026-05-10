'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

/**
 * Scroll-reveal padrão da marca: fade + 24px de baixo para cima, 800ms,
 * ease editorial (guia §6). `delay` empilha para criar cascata em listas.
 *
 *   <Reveal>...</Reveal>
 *   <Reveal delay={0.12}>...</Reveal>
 *
 * Acessibilidade + determinismo:
 *   - Respeita `prefers-reduced-motion: reduce` retornando o conteúdo
 *     imediatamente, sem wrapper de animação.
 *   - O Playwright config (landing-* projects) usa `reducedMotion: 'reduce'`,
 *     então screenshot tests capturam o rest state determinístico — sem
 *     mid-animation flicker.
 */

export interface RevealProps {
  children: ReactNode
  /** Delay em segundos antes da animação começar. */
  delay?: number
  className?: string
  /** Distância em pixels que o conteúdo sobe ao entrar. Default 24. */
  distance?: number
  /**
   * `inview` (padrão): anima quando o elemento entra na viewport — ideal para
   * conteúdo abaixo da dobra. Use IntersectionObserver via Framer Motion.
   *
   * `mount`: anima imediatamente no mount — adequado a hero/header acima da
   * dobra (não depende do observer disparar).
   */
  variant?: 'inview' | 'mount'
}

const SENDA_EASE = [0.25, 0.46, 0.45, 0.94] as const // ↔ --ease-senda

export function Reveal({
  children,
  delay = 0,
  className,
  distance = 24,
  variant = 'inview',
}: RevealProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, {
    once: true,
    margin: '0px 0px -10% 0px',
  })

  // Reduced motion ou usuário sem JS: sem animação, sem wrapper transformante.
  if (reduce) {
    return <div className={className}>{children}</div>
  }

  const shouldAnimate = variant === 'mount' || inView

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: distance }}
      animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: distance }}
      transition={{ duration: 0.8, delay, ease: SENDA_EASE }}
    >
      {children}
    </motion.div>
  )
}
