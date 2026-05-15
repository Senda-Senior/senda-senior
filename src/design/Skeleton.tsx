'use client'

import type { HTMLAttributes } from 'react'
import { cn } from './cn'

type Variant = 'line' | 'block' | 'circle'

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
        'animate-pulse bg-black/10',
        variant === 'block' && 'rounded h-12 w-full',
        variant === 'line' && 'rounded h-4 w-full',
        variant === 'circle' && 'rounded-full',
        className,
      )}
      aria-busy="true"
      aria-label="Carregando..."
      {...rest}
    />
  )
}
