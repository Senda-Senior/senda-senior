/**
 * BackToLandingButton.tsx
 * Botão inteligente que volta para a landing page — se houver histórico de navegação, usa history.back(); senão redireciona com fallback.
 *
 * Conecta: importado por LegalPageFrame e ArticlePageFrame
 * Camada: browser ('use client')
 */

'use client'

import { useRouter } from 'next/navigation'

export function BackToLandingButton({
  fallbackHref = '/#hero',
}: {
  fallbackHref?: string
}) {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => {
        if (
          typeof window !== 'undefined' &&
          window.history.length > 1 &&
          document.referrer.startsWith(window.location.origin)
        ) {
          window.history.back()
          return
        }

        router.push(fallbackHref)
      }}
      className="inline-flex items-center rounded-full border border-[rgba(233,226,210,0.22)] px-4 py-2 font-sans text-[14px] font-medium text-[var(--color-cream)] transition-colors duration-200 hover:bg-[rgba(233,226,210,0.1)]"
    >
      Voltar para a landing
    </button>
  )
}
