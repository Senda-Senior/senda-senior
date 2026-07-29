/**
 * ManuaisMomentosNav.tsx
 * Tabs dos 3 momentos na vitrine /manuais/[slug] — mesmo visual da barra da landing
 * (pill dourado com layoutId), mas como Links entre rotas.
 *
 * Conecta: MANUAIS | page manuais/[slug]
 * Camada: browser ('use client')
 */

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MANUAIS } from '@/features/landing/data/fases-cuidado'

export function ManuaisMomentosNav({ currentSlug }: { currentSlug: string }) {
  return (
    <nav
      aria-label="Momentos do cuidado"
      className="flex flex-wrap items-center justify-center gap-0.5 rounded-full border border-[rgba(42,37,32,0.08)] bg-[rgba(254,252,249,0.72)] p-1.5 shadow-[0_10px_28px_rgba(42,37,32,0.08)] backdrop-blur-[12px]"
    >
      {MANUAIS.map((m) => {
        const active = m.slug === currentSlug
        return (
          <Link
            key={m.slug}
            href={`/manuais/${m.slug}`}
            aria-current={active ? 'page' : undefined}
            className="relative flex items-center gap-[7px] rounded-full px-[18px] py-[9px] font-sans text-[16.1px] tracking-[-0.01em] no-underline transition-colors duration-200"
            style={{
              fontWeight: active ? 600 : 500,
              color: active ? 'var(--color-brown-deep)' : 'var(--color-ink-50)',
            }}
          >
            {active ? (
              <motion.span
                layoutId="manuais-vitrine-tab-pill"
                className="absolute inset-0 rounded-full bg-[var(--color-gold-warm)]"
                transition={{ type: 'spring', stiffness: 400, damping: 32, mass: 0.9 }}
              />
            ) : null}

            <span
              className="relative z-[1] flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full border-[1.5px] text-[8px] font-bold leading-none"
              style={{
                borderColor: active ? 'var(--color-brown-deep)' : 'var(--color-ink-30)',
                color: active ? 'var(--color-brown-deep)' : 'var(--color-ink-40)',
              }}
              aria-hidden
            >
              {m.id + 1}
            </span>
            <span className="relative z-[1]">{m.tab}</span>
          </Link>
        )
      })}
    </nav>
  )
}
