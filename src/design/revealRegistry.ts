/**
 * revealRegistry.ts
 * Registro compartilhado de checks de Reveal — um único listener Lenis notifica todos.
 *
 * Conecta: Reveal.tsx | RevealScrollSync (SmoothScroll)
 * Camada: browser
 */

type RevealCheck = () => void

const checks = new Set<RevealCheck>()

export function registerRevealCheck(check: RevealCheck): () => void {
  checks.add(check)
  return () => {
    checks.delete(check)
  }
}

export function runRevealChecks(): void {
  for (const check of checks) check()
}
