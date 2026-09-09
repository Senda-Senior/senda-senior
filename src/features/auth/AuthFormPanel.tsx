/**
 * AuthFormPanel.tsx
 * Painel direito das páginas de auth para exibir formulários com layout responsivo.
 *
 * Conecta: importa cn (utilitário de classNames) | importado por AuthPage
 * Camada: browser
 */

'use client'

import type { ReactNode } from 'react'
import { cn } from '@/design'

type AuthFormPanelProps = {
  children: ReactNode
  className?: string
}

export function AuthFormPanel({ children, className }: AuthFormPanelProps) {
  return (
    <div className="auth-panel-right relative flex flex-1 flex-col items-center justify-center overflow-hidden px-[clamp(24px,5vw,80px)] py-[clamp(32px,5vw,80px)]">
      <div className={cn('relative z-10 w-full max-w-[400px]', className)}>
        {children}
      </div>
    </div>
  )
}
