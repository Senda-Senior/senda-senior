/**
 * LegalPageFrame.tsx
 * Layout padrão para páginas de legal (privacidade, termos) com header sticky, logo, navigation links, e conteúdo principal aninhado.
 *
 * Conecta: importa BackToLandingButton | importado por páginas de legal (politica-de-privacidade, termos-de-servico)
 * Camada: server (RSC)
 */

import type { ReactNode } from 'react'
import Link from 'next/link'
import NextImage from 'next/image'

import { BackToLandingButton } from './BackToLandingButton'

export function LegalPageFrame({
  eyebrow,
  title,
  updatedAt,
  fallbackHref = '/#hero',
  children,
}: {
  eyebrow?: string
  title: string
  updatedAt: string
  fallbackHref?: string
  children: ReactNode
}) {
  return (
    <main className="min-h-screen bg-[#c8d2b7] text-[var(--color-ink)]">
      <header className="sticky top-0 z-30 border-b border-[rgba(42,37,32,0.08)] bg-[rgba(63,66,44,0.96)] px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-center justify-between gap-3">
          <Link href="/#hero" className="flex items-center no-underline">
            <NextImage
              src="/brand/logo-white-only-hd-nobg.png"
              alt=""
              width={72}
              height={72}
              className="h-auto w-[56px]"
            />
            <NextImage
              src="/senda-logo-corrido-w.webp"
              alt="Senda Sênior"
              width={170}
              height={44}
              className="-ml-2 h-auto w-[112px] sm:w-[126px]"
            />
          </Link>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              href="/politica-de-privacidade"
              className="rounded-full px-4 py-2 font-sans text-[14px] font-medium text-[var(--color-cream-85)] no-underline transition-colors duration-200 hover:bg-[rgba(233,226,210,0.1)] hover:text-[var(--color-cream)]"
            >
              Privacidade
            </Link>
            <Link
              href="/termos-de-servico"
              className="rounded-full px-4 py-2 font-sans text-[14px] font-medium text-[var(--color-cream-85)] no-underline transition-colors duration-200 hover:bg-[rgba(233,226,210,0.1)] hover:text-[var(--color-cream)]"
            >
              Termos
            </Link>
            <BackToLandingButton fallbackHref={fallbackHref} />
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[980px] px-5 py-10 sm:px-8 sm:py-14">
        <section className="overflow-hidden rounded-[30px] border border-[rgba(42,37,32,0.08)] bg-[var(--color-cream)] shadow-[0_28px_70px_rgba(42,37,32,0.12)]">
          <div className="bg-[var(--color-green-dark)] px-6 py-9 text-center text-[var(--color-cream)] sm:px-10 sm:py-12">
            <p className="mb-3 font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-cream-70)]">
              {eyebrow}
            </p>
            <h1 className="font-serif text-[clamp(30px,5vw,48px)] font-semibold leading-[1.08] tracking-[-0.02em]">
              {title}
            </h1>
            <p className="mt-3 font-sans text-[13px] text-[var(--color-cream-70)]">
              Atualizado em {updatedAt}
            </p>
          </div>

          <div className="px-6 py-8 sm:px-10 sm:py-10">{children}</div>
        </section>
      </div>
    </main>
  )
}
