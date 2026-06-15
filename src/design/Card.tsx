/**
 * Card.tsx
 * Contêiner sóbrio com variantes (surface, outline, muted, onGreen) e cantos suaves — padding default p-8
 *
 * Conecta: importa cn | importado em design/index.ts
 * Camada: shared (browser + server)
 */

import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from './cn'

/**
 * ─── Card ──────────────────────────────────────────────────────────
 *
 * Contêiner sóbrio com cantos suaves (guia §5: raio 8–16px).
 *   padding default = p-8
 *   elevation default = subtle
 *
 * Variantes:
 *   surface   → branco/creme com sombra suave
 *   outline   → só linha fina
 *   muted     → fundo creme-mid sem sombra
 *   onGreen   → card sobre fundo verde (inverte cores)
 * ───────────────────────────────────────────────────────────────────
 */

type Variant = 'surface' | 'outline' | 'muted' | 'onGreen'

const variants: Record<Variant, string> = {
  surface:
    'bg-white border border-black/5 shadow-[var(--shadow-card-sm)]',
  outline: 'bg-transparent border border-black/10',
  muted: 'bg-cream-mid border border-black/[0.04]',
  onGreen:
    'bg-white/8 border border-white/10 text-white backdrop-blur-sm',
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant
  children?: ReactNode
}

export function Card({
  variant = 'surface',
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-lg)] p-8',
        variants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
