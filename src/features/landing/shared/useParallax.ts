/**
 * useParallax.ts
 * Hook de parallax vinculado ao scroll — aplica translateY proporcional, respeitando prefers-reduced-motion
 *
 * Conecta: nenhum | usado em componentes de landing (Hero, etc.)
 * Camada: shared
 */
'use client'

import { useEffect, useRef } from 'react'

export function useParallax<T extends HTMLElement = HTMLDivElement>(speed = 0.08) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    let isVisible = true
    let frame = 0

    const handle = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        if (!isVisible) {
          frame = 0
          return
        }

        const rect = el.getBoundingClientRect()
        const center = rect.top + rect.height / 2 - window.innerHeight / 2
        const offset = Math.round(center * speed * 100) / 100
        el.style.transform = `translate3d(0, ${offset}px, 0)`
        frame = 0
      })
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible) handle()
      },
      { threshold: 0.01 },
    )

    observer.observe(el)
    el.style.willChange = 'transform'
    handle()
    window.addEventListener('scroll', handle, { passive: true })
    window.addEventListener('resize', handle)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', handle)
      window.removeEventListener('resize', handle)
      el.style.willChange = ''
    }
  }, [speed])

  return ref
}
