/**
 * Turnstile.tsx
 * Widget do Cloudflare Turnstile (CAPTCHA anti-bot) para os fluxos de auth.
 *
 * Render explícito via API global (carrega o script uma vez). O token é de uso único:
 * o pai incrementa `resetSignal` após cada tentativa para emitir um token novo.
 *
 * Conecta: usado por app/login (signUp/signIn/reset) | site key em config/env
 * Camada: browser (use client)
 */
'use client'

import { useEffect, useRef } from 'react'

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js'

type TurnstileApi = {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string
      callback: (token: string) => void
      'error-callback'?: () => void
      'expired-callback'?: () => void
      theme?: 'light' | 'dark' | 'auto'
      size?: 'normal' | 'flexible' | 'compact'
    },
  ) => string
  reset: (id?: string) => void
  remove: (id?: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

let scriptPromise: Promise<void> | null = null

function loadScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.turnstile) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src^="${SCRIPT_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('turnstile script failed')))
      if (window.turnstile) resolve()
      return
    }
    const s = document.createElement('script')
    s.src = SCRIPT_SRC
    s.async = true
    s.defer = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('turnstile script failed'))
    document.head.appendChild(s)
  })
  return scriptPromise
}

export function Turnstile({
  siteKey,
  onToken,
  resetSignal,
}: {
  siteKey: string
  /** Recebe o token (string) ou null quando expira/erra/reseta. */
  onToken: (token: string | null) => void
  /** Incremente para forçar um novo desafio (token é de uso único). */
  resetSignal: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  // `onToken` é o setter de estado do pai (estável), então usá-lo direto não re-renderiza.
  useEffect(() => {
    let cancelled = false

    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return
        if (widgetIdRef.current) return
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token) => onToken(token),
          'error-callback': () => onToken(null),
          'expired-callback': () => onToken(null),
          theme: 'light',
          size: 'flexible',
        })
      })
      .catch(() => {
        // Falha ao carregar o script: não bloqueia a UI; o submit valida ausência de token.
      })

    return () => {
      cancelled = true
      const api = window.turnstile
      if (widgetIdRef.current && api) {
        api.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [siteKey, onToken])

  // Reset a cada nova tentativa (token de uso único).
  useEffect(() => {
    if (resetSignal > 0 && widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current)
      onToken(null)
    }
  }, [resetSignal, onToken])

  return <div ref={containerRef} className="mt-1 min-h-[65px]" />
}
