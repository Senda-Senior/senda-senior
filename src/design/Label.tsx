/**
 * Label.tsx
 * Rótulo/metadata com estilos capitalizados do guia §3 — 11px uppercase, letter-spacing 0.15em
 *
 * Conecta: importa cn | importado em design/index.ts
 * Camada: shared (browser + server)
 */

import type { HTMLAttributes } from 'react'
import { cn } from './cn'

/**
 * Rótulo/metadata do guia §3.
 *
 *   UPPERCASE · 11px · letter-spacing 0.15em · terracota
 *
 * Uso:
 *   <Label>Planejamento & Assessoria</Label>
 *   <Label tone="muted">Capítulo 01</Label>
 */

type Tone = 'terracotta' | 'muted' | 'green' | 'onDark'

const tones: Record<Tone, string> = {
  terracotta: 'text-terracotta',
  muted: 'text-ink-muted',
  green: 'text-green',
  onDark: 'text-white/45',
}

export interface LabelProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

export function Label({ className, tone = 'terracotta', ...rest }: LabelProps) {
  return (
    <span
      className={cn(
        'font-sans text-[11px] font-semibold uppercase tracking-[0.15em]',
        tones[tone],
        className,
      )}
      {...rest}
    />
  )
}
