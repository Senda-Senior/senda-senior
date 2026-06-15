/**
 * Header.tsx
 * Navegação fixa principal da landing — menu desktop/mobile, logo, links de âncora com Lenis scroll
 *
 * Conecta: NAV_LINKS de @/features/landing/data/header | Manifesto, Hero, Footer importam
 * Camada: browser
 */
'use client'

import NextImage from 'next/image'
import { useState } from 'react'
import { Menu, X, ArrowRight, ChevronDown, User } from 'lucide-react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { NAV_LINKS } from '@/features/landing/data/header'

const DESKTOP_NAV_LINK =
  'flex items-center gap-[3px] whitespace-nowrap text-[clamp(15px,1.15vw,17px)] font-medium tracking-[0.01em] text-[var(--color-cream-80)] no-underline transition-colors duration-200 hover:text-[var(--color-cream)]'

const DESKTOP_SECONDARY_LINK =
  'flex items-center gap-[5px] whitespace-nowrap text-[clamp(15px,1.15vw,17px)] font-medium text-[var(--color-cream-80)] no-underline transition-colors duration-200 hover:text-[var(--color-cream)]'

const DESKTOP_PRIMARY_LINK =
  'inline-flex items-center gap-[6px] whitespace-nowrap rounded-full bg-[var(--color-cta-brown)] px-[clamp(16px,1.8vw,22px)] py-[10px] text-[clamp(15px,1.15vw,17px)] font-semibold text-white no-underline shadow-[0_10px_26px_rgba(138,78,46,0.22)] transition-[transform,box-shadow] duration-150 hover:-translate-y-px hover:shadow-[0_14px_30px_rgba(138,78,46,0.3)]'

const MOBILE_MENU_LINK =
  'text-[25.3px] font-semibold text-[var(--color-ink)] no-underline'

const MOBILE_SECONDARY_LINK =
  'rounded-[30px] border border-[var(--color-ink-40)] py-[14px] text-center text-[18.4px] font-semibold text-[var(--color-ink)] no-underline'

const MOBILE_PRIMARY_LINK =
  'flex items-center justify-center gap-2 rounded-[30px] bg-[var(--color-cta-brown)] py-[14px] text-center text-[18.4px] font-semibold text-white no-underline'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0

    if (latest <= 50) {
      setHidden(false)
    } else if (latest > previous && latest > 150) {
      setHidden(true)
    } else if (latest < previous) {
      setHidden(false)
    }
  })

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: '-100%', opacity: 0 },
        }}
        animate={hidden ? 'hidden' : 'visible'}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="fixed inset-x-0 top-0 z-[100] px-[clamp(4px,0.8vw,12px)] py-[10px]"
        style={{ pointerEvents: hidden ? 'none' : 'auto' }}
      >
        <div className="mx-auto flex h-[clamp(68px,6.5vw,82px)] w-[min(1480px,calc(100vw-16px))] items-center justify-between gap-[clamp(10px,1.6vw,20px)] rounded-full border border-[rgba(233,226,210,0.20)] bg-[var(--header-surface)] px-[clamp(16px,1.8vw,28px)] pl-[6px] shadow-[0_18px_40px_rgba(42,37,32,0.22)] backdrop-blur-[18px]">
          <a
            href="#hero"
            className="flex shrink-0 items-center leading-none no-underline"
          >
            <NextImage
              src="/brand/logo-white-only-hd-nobg.png"
              alt=""
              width={96}
              height={96}
              priority
              className="h-auto w-[clamp(72px,6vw,86px)] shrink-0"
            />
            <NextImage
              src="/senda-logo-corrido-w.webp"
              alt="Senda Sênior"
              width={200}
              height={52}
              priority
              className="-ml-2 h-auto w-[clamp(96px,8vw,130px)] shrink-0"
            />
          </a>

          <nav className="nav-desktop flex min-w-0 flex-1 items-center justify-center gap-[clamp(14px,1.7vw,24px)]" aria-label="Menu principal">
            {NAV_LINKS.map(({ label, href, chevron }) => (
              <a key={label} href={href} className={DESKTOP_NAV_LINK}>
                {label}
                {chevron ? <ChevronDown size={12} strokeWidth={2} aria-hidden="true" /> : null}
              </a>
            ))}
          </nav>

          <div className="nav-desktop flex shrink-0 items-center gap-3">
            <a href="/login" className={DESKTOP_SECONDARY_LINK}>
              <User size={15} strokeWidth={1.8} aria-hidden="true" />
              Login
            </a>

            <a href="/login" className={DESKTOP_PRIMARY_LINK}>
              Área do Cliente <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
            </a>
          </div>

          <button
            className="show-mobile hidden cursor-pointer border-none bg-transparent p-2 text-[var(--color-cream)]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} strokeWidth={1.5} aria-hidden="true" /> : <Menu size={24} strokeWidth={1.5} aria-hidden="true" />}
          </button>
        </div>
      </motion.header>

      {menuOpen ? (
        <div className="mobile-menu flex" role="navigation" aria-label="Menu mobile" onClick={() => setMenuOpen(false)}>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
            className="absolute top-5 right-6 cursor-pointer border-none bg-transparent text-[var(--color-ink)]"
          >
            <X size={26} strokeWidth={1.5} />
          </button>

          <nav className="flex flex-col items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={MOBILE_MENU_LINK}
              >
                {label}
              </a>
            ))}
          </nav>

            <div className="mt-4 flex w-full flex-col gap-3 px-8">
              <a href="/login" onClick={() => setMenuOpen(false)} className={MOBILE_SECONDARY_LINK}>
                Login
              </a>
              <a href="/login" onClick={() => setMenuOpen(false)} className={MOBILE_PRIMARY_LINK}>
                Área do Cliente <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
              </a>
            </div>
        </div>
      ) : null}
    </>
  )
}
