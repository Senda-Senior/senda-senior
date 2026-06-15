/**
 * Divider.tsx
 * Linha curta terracota do guia §5 (48×3px, radius 2px) — separador visual para títulos/subtítulos
 *
 * Conecta: importa cn | importado em design/index.ts
 * Camada: shared (browser + server)
 */

import { cn } from './cn'

/**
 * Linha curta terracota do guia §5.
 *   48×3px · radius 2px · margin 16/24
 *
 * Use sempre que precisar separar um eyebrow/label do título,
 * ou o título do subtítulo, em seções institucionais.
 */

export interface DividerProps {
  className?: string
  align?: 'left' | 'center' | 'right'
}

export function Divider({ className, align = 'left' }: DividerProps) {
  const alignment =
    align === 'center'
      ? 'mx-auto'
      : align === 'right'
        ? 'ml-auto'
        : ''
  return (
    <div
      aria-hidden
      className={cn(
        'h-[3px] w-12 rounded-[2px] bg-terracotta mt-4 mb-6',
        alignment,
        className,
      )}
    />
  )
}
