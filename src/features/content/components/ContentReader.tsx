/**
 * ContentReader.tsx
 * Shell de leitura interativa (sidebar/índice, modo foco, progress bar) —
 * reaproveitado do leitor de manual para conteúdos públicos (artigos).
 *
 * Conecta: artigos via ArticlePageFrame | ReaderBodyLock no layout
 * Camada: browser ('use client')
 */

'use client'

import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import { Menu, X, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import NextImage from 'next/image'

export type ContentTocItem = {
  href: string
  title: string
  label?: string
}

export interface ContentReaderProps {
  eyebrow?: string
  title: string
  meta?: string
  currentHref: string
  items: ContentTocItem[]
  children: ReactNode
  homeHref?: string
  indexLabel?: string
  prevNavLabel?: string
  nextNavLabel?: string
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export function ContentReader({
  eyebrow,
  title,
  meta,
  currentHref,
  items,
  children,
  homeHref = '/#conteudo',
  indexLabel = 'Conteúdos',
  prevNavLabel = 'Anterior',
  nextNavLabel = 'Próximo',
}: ContentReaderProps) {
  const currentIndex = items.findIndex((item) => item.href === currentHref)
  const prev = currentIndex > 0 ? items[currentIndex - 1] : null
  const next =
    currentIndex >= 0 && currentIndex < items.length - 1 ? items[currentIndex + 1] : null

  const [focusMode, setFocusMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isNarrow, setIsNarrow] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 999px)')
    const sync = () => setIsNarrow(mql.matches)
    sync()

    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', sync)
      return () => mql.removeEventListener('change', sync)
    }

    mql.addListener(sync)
    return () => mql.removeListener(sync)
  }, [])

  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ container: containerRef })
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--color-cream)]">
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 340 : 0, opacity: sidebarOpen ? 1 : 0 }}
        className="z-50 overflow-hidden border-r border-r-[rgba(0,0,0,0.04)] bg-[rgba(254,252,249,0.7)] backdrop-blur-[30px]"
      >
        <div className="flex h-full w-[340px] flex-col p-8">
          <Link
            href={homeHref}
            className="mb-10 flex shrink-0 items-center rounded-full bg-[var(--header-surface)] py-1.5 pl-1 pr-4 no-underline shadow-[0_10px_24px_rgba(42,37,32,0.18)]"
          >
            <NextImage
              src="/brand/logo-white-only.webp"
              alt=""
              width={56}
              height={56}
              className="h-auto w-[48px] shrink-0"
            />
            <NextImage
              src="/senda-logo-corrido-w.webp"
              alt="Senda Sênior"
              width={140}
              height={36}
              className="-ml-1 h-auto w-[100px] shrink-0"
            />
          </Link>

          <p className="label-premium mb-6 shrink-0 text-[var(--color-ink-muted)]">{indexLabel}</p>

          <div className="flex flex-col gap-2 overflow-y-auto pb-16">
            {items.map((item) => {
              const active = item.href === currentHref
              return (
                <Link key={item.href} href={item.href} className="no-underline">
                  <motion.div
                    className="rounded-xl p-4 text-[16px] leading-[1.35] transition-all duration-200"
                    style={{
                      background: active ? 'var(--color-green)' : 'transparent',
                      color: active ? 'white' : 'var(--color-ink-sub)',
                      fontWeight: active ? 600 : 500,
                      border: active ? 'none' : '1px solid transparent',
                    }}
                    whileHover={{
                      background: active ? 'var(--color-green)' : 'rgba(45,95,79,0.03)',
                      borderColor: active ? 'transparent' : 'rgba(0,0,0,0.05)',
                    }}
                  >
                    {item.label ? (
                      <span
                        className={cx(
                          'mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em]',
                          active ? 'text-white/70' : 'text-[var(--color-ink-muted)]',
                        )}
                      >
                        {item.label}
                      </span>
                    ) : null}
                    {item.title}
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      </motion.aside>

      <div
        className="relative flex h-screen flex-1 flex-col"
        style={{ opacity: focusMode && sidebarOpen ? 0.3 : 1, transition: 'opacity 0.4s' }}
      >
        <motion.header
          animate={{ y: focusMode ? -100 : 0, opacity: focusMode ? 0 : 1 }}
          className="absolute left-0 right-0 top-0 z-40 flex items-center justify-between bg-gradient-to-b from-[var(--color-cream)] to-transparent py-5"
          style={{
            paddingLeft: 'clamp(16px, 4vw, 40px)',
            paddingRight: 'clamp(16px, 4vw, 40px)',
            pointerEvents: focusMode ? 'none' : 'auto',
          }}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href={homeHref}
              className="mr-1 flex shrink-0 items-center rounded-full bg-[var(--header-surface)] py-1 pl-0.5 pr-3 no-underline shadow-[0_8px_20px_rgba(42,37,32,0.16)] sm:mr-2 sm:pr-3.5"
            >
              <NextImage
                src="/brand/logo-white-only.webp"
                alt=""
                width={44}
                height={44}
                className="h-auto w-[40px] shrink-0"
              />
              <NextImage
                src="/senda-logo-corrido-w.webp"
                alt="Senda Sênior"
                width={120}
                height={32}
                className="-ml-1 hidden h-auto w-[88px] shrink-0 sm:block"
              />
            </Link>

            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex cursor-pointer items-center gap-2.5 rounded-[30px] border border-[rgba(0,0,0,0.04)] bg-white px-4 py-2.5 font-sans text-[14px] font-semibold text-[var(--color-ink)] transition-all duration-200 sm:gap-3 sm:px-6 sm:py-3 sm:text-[15px]"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
              <span className="hidden sm:inline">{sidebarOpen ? 'Fechar índice' : 'Sumário'}</span>
            </button>

            <Link
              href={homeHref}
              className="hidden items-center rounded-[30px] border border-[rgba(0,0,0,0.04)] bg-white px-5 py-2.5 font-sans text-[14px] font-semibold text-[var(--color-ink)] no-underline transition-all duration-200 md:inline-flex"
            >
              Voltar
            </Link>
          </div>

          <button
            type="button"
            onClick={() => {
              setFocusMode(true)
              setSidebarOpen(false)
            }}
            className="flex cursor-pointer items-center gap-2.5 rounded-[30px] border-0 bg-[var(--color-green)] px-4 py-2.5 font-sans text-[14px] font-semibold text-white transition-all duration-200 sm:gap-3 sm:px-6 sm:py-3 sm:text-[15px]"
          >
            <EyeOff size={18} />
            <span className="hidden sm:inline">Modo Foco</span>
          </button>
        </motion.header>

        <motion.div
          className="fixed top-0 right-0 z-[100] h-1 bg-[var(--color-terracotta)]"
          style={{ left: sidebarOpen ? 340 : 0, scaleX, originX: 0, transition: 'left 0.3s' }}
        />

        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto"
          style={{ padding: '140px clamp(16px, 4vw, 40px) 100px', scrollBehavior: 'smooth' }}
        >
          <AnimatePresence>
            {focusMode && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setFocusMode(false)}
                className="fixed bottom-10 right-10 z-[60] cursor-pointer rounded-full border border-[rgba(0,0,0,0.08)] bg-white p-4 text-[var(--color-green)]"
                aria-label="Sair do modo foco"
              >
                <Eye size={24} />
              </motion.button>
            )}
          </AnimatePresence>

          <article
            className="mx-auto max-w-[740px]"
            style={{ opacity: sidebarOpen && isNarrow ? 0.3 : 1, transition: 'opacity 0.3s' }}
            onClick={() => sidebarOpen && isNarrow && setSidebarOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {eyebrow ? <p className="label-premium mb-5">{eyebrow}</p> : null}
              <h1
                className="mb-0 font-medium leading-[1.05] tracking-[-0.02em] text-[var(--color-ink)]"
                style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 4.6vw, 56px)' }}
              >
                {title}
              </h1>
              {meta ? (
                <p className="mt-5 font-sans text-[14px] text-[var(--color-ink-muted)]">{meta}</p>
              ) : null}
              <div className="line-terracota mb-14 mt-6" />

              <div className="content-reader-body">{children}</div>
            </motion.div>

            <div className="mt-[100px] flex flex-col justify-between gap-4 border-t border-t-[rgba(0,0,0,0.08)] pt-12 sm:flex-row sm:gap-6">
              {prev ? (
                <Link
                  href={prev.href}
                  className="flex flex-1 flex-col gap-2 rounded-xl bg-[rgba(0,0,0,0.02)] p-6 no-underline sm:gap-3 sm:p-8"
                >
                  <span className="label-premium text-[var(--color-ink-muted)]">{prevNavLabel}</span>
                  <span
                    className="text-[20px] font-medium leading-[1.25] text-[var(--color-ink)] sm:text-[24px]"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <div className="hidden flex-1 sm:block" />
              )}

              {next ? (
                <Link
                  href={next.href}
                  className="flex flex-1 flex-col gap-2 rounded-xl bg-[var(--color-green)] p-6 text-left no-underline sm:gap-3 sm:p-8 sm:text-right"
                >
                  <span className="label-premium text-white/60">{nextNavLabel}</span>
                  <span
                    className="text-[20px] font-medium leading-[1.25] text-white sm:text-[24px]"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {next.title}
                  </span>
                </Link>
              ) : (
                <div className="hidden flex-1 sm:block" />
              )}
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}
