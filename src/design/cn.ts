/**
 * cn.ts
 * Utility para merge condicional de classes Tailwind — resolve conflitos corretamente via twMerge
 *
 * Conecta: importa clsx, tailwind-merge | importado em todos os design primitivos
 * Camada: shared (browser + server)
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge condicional de classes Tailwind.
 *
 *   cn('px-4', cond && 'bg-green', props.className)
 *
 * Resolve conflitos corretamente (ex.: `px-2` + `px-4` mantém apenas
 * o último) graças ao `tailwind-merge`.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
