import type { HTMLAttributes } from 'react'
import { cn } from './cn'

/**
 * ─── Skeleton ──────────────────────────────────────────────────────────
 *
 * Carregador sóbrio com animação pulse para placeholders de conteúdo.
 *
 * Variantes:
 *   line   → linha única (altura reduzida)
 *   block  → bloco (altura completa)
 *   circle → círculo (use className para definir h/w)
 * ───────────────────────────────────────────────────────────────────
 */

type Variant = 'line' | 'block' | 'circle'

const variants: Record<Variant, string> = {
  line: 'h-4 rounded-full',
  block: 'h-24 rounded-[var(--radius-lg)]',
  circle: 'rounded-full',
}

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant
}

export function Skeleton({
  variant = 'block',
  className,
  ...rest
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        variants[variant],
        className,
      )}
      {...rest}
    />
  )
}
