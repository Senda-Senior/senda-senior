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
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[8%] -top-[5%] h-[min(55vw,320px)] w-[min(55vw,320px)] bg-[url('/brand/star-scatter-decoration.jpg')] bg-contain bg-no-repeat bg-right-top opacity-[0.16]"
      />
      <div className={cn('relative z-10 w-full max-w-[400px]', className)}>
        {children}
      </div>
    </div>
  )
}
