import type { ReactNode } from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import { BackToLandingButton } from './BackToLandingButton'

export function ArticlePageFrame({
  eyebrow,
  title,
  author,
  date,
  children,
}: {
  eyebrow?: string
  title: string
  author: string
  date: string
  children: ReactNode
}) {
  return (
    <main className="min-h-screen bg-[var(--color-warm-tan)] text-[var(--color-ink)]">
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
              href="/#conteudo"
              className="rounded-full px-4 py-2 font-sans text-[14px] font-medium text-[var(--color-cream-85)] no-underline transition-colors duration-200 hover:bg-[rgba(233,226,210,0.1)] hover:text-[var(--color-cream)]"
            >
              Conteúdos
            </Link>
            <BackToLandingButton fallbackHref="/#conteudo" />
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1060px] px-5 py-10 sm:px-8 sm:py-14">
        <section className="overflow-hidden rounded-[30px] border border-[rgba(42,37,32,0.08)] bg-[var(--color-cream)] shadow-[0_28px_70px_rgba(42,37,32,0.12)]">
          <div className="bg-[var(--color-green-dark)] px-8 py-9 text-[var(--color-cream)] sm:px-14 sm:py-12">
            {eyebrow && (
              <p className="mb-4 font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-cream-70)]">
                {eyebrow}
              </p>
            )}
            <h1 className="max-w-[760px] font-serif text-[clamp(26px,3.8vw,46px)] font-semibold leading-[1.1] tracking-[-0.02em]">
              {title}
            </h1>
            <p className="mt-4 font-sans text-[13px] text-[var(--color-cream-70)]">
              Por {author} · {date}
            </p>
          </div>

          <div className="px-8 py-12 sm:px-14 sm:py-16">
            <div className="mx-auto max-w-[860px]">
              {children}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
