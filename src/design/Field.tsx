'use client'

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from './cn'

/**
 * ─── Field ─────────────────────────────────────────────────────────
 *
 * Input com rótulo + dica + erro. Fechado, sem dependências externas.
 *
 *   <Field label="Email" type="email" required />
 *   <Field label="Senha" type="password" error={errors.password} />
 * ───────────────────────────────────────────────────────────────────
 */

export interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode
  hint?: ReactNode
  error?: ReactNode
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, hint, error, className, id, ...rest },
  ref,
) {
  const reactId = useId()
  const inputId = id ?? rest.name ?? `field-${reactId}`
  const hintId = hint ? `${inputId}-hint` : undefined
  const errorId = error ? `${inputId}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label
        htmlFor={inputId}
        className="text-[15px] font-semibold tracking-[0.02em] text-ink-sub"
      >
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        aria-required={rest.required ? true : undefined}
        className={cn(
          'w-full rounded-[10px] border-[1.5px] border-cream-mid bg-cream',
          'px-4 py-[14px] font-sans text-[15px] text-ink outline-none',
          'transition-colors duration-300',
          'focus:border-green focus:shadow-[0_0_0_3px_rgba(74,94,74,0.1)]',
          error && 'border-[#FECACA] focus:border-[#B91C1C]',
        )}
        {...rest}
      />
      {hint && !error && (
        <p id={hintId} className="text-[13px] text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-[13px] font-medium text-[#B91C1C]">
          {error}
        </p>
      )}
    </div>
  )
})
