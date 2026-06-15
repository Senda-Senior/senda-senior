/**
 * Section.tsx
 * Contêiner de seção com padding vertical generoso (respiro guia §5) e variantes de tone (cream, terracotta, green, etc)
 *
 * Conecta: importa cn | importado em design/index.ts
 * Camada: shared (browser + server)
 */

import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from './cn'

/**
 * ─── Section ───────────────────────────────────────────────────────
 *
 * Padroniza o "respiro" de cada seção (guia §5) com padding vertical
 * generoso e largura máxima consistente para conteúdo textual.
 *
 *   <Section tone="cream" id="sobre">...</Section>
 *
 * Variantes de tone mapeiam os fundos documentados no guia.
 * ───────────────────────────────────────────────────────────────────
 */

type Tone =
  | 'cream'
  | 'creamMid'
  | 'terracottaPale'
  | 'green'
  | 'dark'
  | 'white'
  | 'transparent'

const tones: Record<Tone, string> = {
  cream: 'bg-cream text-ink',
  creamMid: 'bg-cream-mid text-ink',
  terracottaPale: 'bg-terracotta-pale text-ink',
  green: 'bg-green text-white',
  dark: 'bg-ink text-white',
  white: 'bg-white text-ink',
  transparent: 'text-ink',
}

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  tone?: Tone
  maxWidth?: 'prose' | 'content' | 'wide' | 'full'
  children?: ReactNode
}

const maxWidths = {
  prose: 'max-w-[740px]',
  content: 'max-w-[1100px]',
  wide: 'max-w-[1200px]',
  full: 'max-w-none',
}

export function Section({
  className,
  tone = 'transparent',
  maxWidth = 'content',
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      className={cn(
        'px-[clamp(20px,4vw,60px)] py-[clamp(80px,10vw,140px)]',
        tones[tone],
        className,
      )}
      {...rest}
    >
      <div className={cn('mx-auto w-full', maxWidths[maxWidth])}>
        {children}
      </div>
    </section>
  )
}
