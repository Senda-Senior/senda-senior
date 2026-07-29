/**
 * RevealScrollSync.tsx
 * Um useLenis para todos os Reveal — evita N callbacks por frame de scroll.
 *
 * Conecta: SmoothScroll | revealRegistry
 * Camada: browser
 */

'use client'

import { useLenis } from 'lenis/react'
import { runRevealChecks } from './revealRegistry'

export function RevealScrollSync() {
  useLenis(() => {
    runRevealChecks()
  })
  return null
}
