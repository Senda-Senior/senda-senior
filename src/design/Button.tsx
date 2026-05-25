import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from './cn'

/**
 * ─── Button ────────────────────────────────────────────────────────
 *
 * Variantes alinhadas ao guia visual:
 *   primary   → CTA principal (terracota).
 *   secondary → ação de suporte (verde-musgo, outline).
 *   ghost     → link/ação discreta (sem fundo).
 *   danger    → ações destrutivas (vermelho sóbrio).
 *
 * Tamanhos respeitam respiro (§5 do guia):
 *   md (default) → 17/36
 *   sm           → 12/24
 *   lg           → 20/44
 * ───────────────────────────────────────────────────────────────────
 */

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] ' +
  'font-semibold tracking-[0.01em] transition-all duration-300 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'focus-visible:ring-offset-cream disabled:opacity-60 disabled:cursor-not-allowed'

const variants: Record<Variant, string> = {
  primary:
    'bg-terracotta text-white shadow-[var(--shadow-terracotta-button)] ' +
    'hover:bg-terracotta-dark hover:-translate-y-0.5 focus-visible:ring-terracotta',
  secondary:
    'border-[1.5px] border-green bg-white/65 text-green backdrop-blur-sm ' +
    'hover:bg-white/90 focus-visible:ring-green',
  ghost:
    'bg-transparent text-green hover:bg-green/5 focus-visible:ring-green',
  danger:
    'border-[1.5px] border-[var(--color-danger-border)] bg-[var(--color-danger-soft)] ' +
    'text-[var(--color-danger)] hover:border-[var(--color-danger)] hover:bg-[rgba(185,28,28,0.15)] ' +
    'focus-visible:ring-[var(--color-danger)]',
}

const sizes: Record<Size, string> = {
  sm: 'text-[13px] px-5 py-2.5',
  md: 'text-[15px] px-9 py-[17px]',
  lg: 'text-[16px] px-11 py-5',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = 'primary',
    size = 'md',
    leadingIcon,
    trailingIcon,
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      aria-disabled={rest.disabled ? true : undefined}
      {...rest}
    >
      {leadingIcon}
      <span>{children}</span>
      {trailingIcon}
    </button>
  )
})
