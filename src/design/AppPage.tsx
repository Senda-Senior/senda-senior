import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from './cn'

export interface AppPageShellProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  centered?: boolean
}

export function AppPageShell({
  children,
  className,
  centered = false,
  ...rest
}: AppPageShellProps) {
  return (
    <main
      className={cn(
        'min-h-screen bg-cream',
        centered && 'grid place-items-center px-6 py-10',
        className,
      )}
      {...rest}
    >
      {children}
    </main>
  )
}

export interface AppPageContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  width?: 'default' | 'wide' | 'narrow'
}

const widths = {
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
  narrow: 'max-w-3xl',
} as const

export function AppPageContainer({
  children,
  className,
  width = 'default',
  ...rest
}: AppPageContainerProps) {
  return (
    <div
      className={cn('mx-auto w-full px-4 py-12 sm:px-6 lg:px-8', widths[width], className)}
      {...rest}
    >
      {children}
    </div>
  )
}

export interface AppPageHeaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode
  description?: ReactNode
}

export function AppPageHeader({
  title,
  description,
  children,
  className,
  ...rest
}: AppPageHeaderProps) {
  return (
    <header className={cn('mb-8 space-y-3', className)} {...rest}>
      <h1 className="font-serif text-[clamp(32px,4vw,48px)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink">
        {title}
      </h1>
      {description ? (
        <p className="max-w-3xl text-base leading-[1.8] text-ink-sub">{description}</p>
      ) : null}
      {children}
    </header>
  )
}

export interface AppPageCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode
  description?: ReactNode
  actions?: ReactNode
}

export function AppPageCard({
  title,
  description,
  actions,
  children,
  className,
  ...rest
}: AppPageCardProps) {
  return (
    <section
      className={cn(
        'rounded-[20px] border border-terracotta-light bg-white/80 px-8 py-10',
        className,
      )}
      {...rest}
    >
      {title ? (
        <h2 className="mb-4 font-serif text-[clamp(24px,3vw,32px)] font-semibold text-terracotta">
          {title}
        </h2>
      ) : null}
      {description ? (
        <p className="mb-6 text-base leading-[1.7] text-terracotta-light/80">{description}</p>
      ) : null}
      <div className="space-y-4">{children}</div>
      {actions ? <div className="mt-8">{actions}</div> : null}
    </section>
  )
}
