'use client'

import NextImage from 'next/image'
import { useState } from 'react'
import { Menu, X, ArrowRight, ChevronDown, User } from 'lucide-react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { NAV_LINKS } from '@/features/landing/data/header'

/* ─── Color tokens (cream on olive pill) ──────────────────────────────── */
const C   = 'var(--color-cream)' // cream full
const CM  = 'var(--color-cream-80)' // cream readable muted
const PIL = 'var(--color-olive-80)'    // var(--color-olive) @ 80%

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    if (latest <= 50) {
      // Sempre mostrar no topo
      setHidden(false)
    } else if (latest > previous && latest > 150) {
      // Rolando para baixo e já passou do topo -> esconder
      setHidden(true)
    } else if (latest < previous) {
      // Rolando para cima -> mostrar
      setHidden(false)
    }
  })

  return (
    <>
      {/* ── Floating pill header — no spacer, pill overlays hero photo ── */}
      <motion.header
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: '-100%', opacity: 0 },
        }}
        animate={hidden ? 'hidden' : 'visible'}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 100,
          padding: '12px clamp(12px, 2vw, 24px)',
          pointerEvents: hidden ? 'none' : 'auto',
        }}
      >
        {/* ── Pill ──────────────────────────────────────────────────────── */}
        <div
          style={{
            background: PIL,
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            borderRadius: 100,
            height: 82,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            maxWidth: 1280,
            margin: '0 auto',
            gap: 20,
          }}
        >
          {/* Logo: circular icon-only */}
          <a
            href="#hero"
            style={{ textDecoration: 'none', flexShrink: 0 }}
          >
            <div
              style={{
                width: 65, height: 65,
                borderRadius: '50%',
                border: '1.5px solid var(--color-cream-25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <NextImage
                src="/brand/logo-white-only-hd-nobg.png"
                alt="Senda Sênior"
                width={65}
                height={65}
                priority
                style={{ width: '100%', height: 'auto', transform: 'scale(1.35)' }}
              />
            </div>
          </a>

          {/* Desktop nav */}
          <nav
            className="nav-desktop"
            style={{ display: 'flex', alignItems: 'center', gap: 24, flex: 1, justifyContent: 'center' }}
          >
            {NAV_LINKS.map(({ label, href, chevron }) => (
            <a
              key={label}
              href={href}
              style={{
                fontSize: 17.25,
                fontWeight: 500,
                color: CM,
                textDecoration: 'none',
                letterSpacing: '0.01em',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = C }}
              onMouseLeave={e => { e.currentTarget.style.color = CM }}
            >
              {label}
              {chevron && <ChevronDown size={12} strokeWidth={2} />}
            </a>
          ))}
          </nav>

          {/* Desktop CTA group */}
          <div
            className="nav-desktop"
            style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}
          >
            {/* Login — text + user icon */}
            <a
              href="/login"
              style={{
                fontSize: 17.25, fontWeight: 500, color: CM,
                textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: 5,
                transition: 'color 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = C }}
              onMouseLeave={e => { e.currentTarget.style.color = CM }}
            >
              <User size={15} strokeWidth={1.8} />
              Login
            </a>

            {/* Área do Cliente — terracotta pill */}
            <a
              href="#area-cliente"
              style={{
                fontSize: 17.25, fontWeight: 600, color: 'white',
                background: 'var(--color-terracotta)',
                padding: '10px 20px',
                borderRadius: 100,
                textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: 6,
                transition: 'opacity 0.2s, transform 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Área do Cliente <ArrowRight size={14} strokeWidth={2} />
            </a>
          </div>

          {/* Mobile burger */}
          <button
            className="show-mobile"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: C, padding: 8 }}
          >
            {menuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>
        </div>
      </motion.header>

      {/* ── Mobile overlay menu ─────────────────────────────────────────── */}
      {menuOpen && (
        <div
          className="mobile-menu"
          style={{ display: 'flex' }}
          onClick={() => setMenuOpen(false)}
        >
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
            style={{ position: 'absolute', top: 20, right: 24, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-ink)' }}
          >
            <X size={26} strokeWidth={1.5} />
          </button>

          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{ fontSize: 25.3, fontWeight: 600, color: 'var(--color-ink)', textDecoration: 'none' }}
            >
              {label}
            </a>
          ))}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16, width: '100%', padding: '0 32px' }}>
            <a
              href="/login"
              onClick={() => setMenuOpen(false)}
              style={{ fontSize: 18.4, fontWeight: 600, color: 'var(--color-ink)', border: '1px solid var(--color-ink-40)', padding: '14px 0', borderRadius: 30, textDecoration: 'none', textAlign: 'center' }}
            >
              Login
            </a>
            <a
              href="#area-cliente"
              onClick={() => setMenuOpen(false)}
              style={{ fontSize: 18.4, fontWeight: 600, color: 'white', background: 'var(--color-terracotta)', padding: '14px 0', borderRadius: 30, textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              Área do Cliente <ArrowRight size={18} strokeWidth={2} />
            </a>
          </div>
        </div>
      )}
    </>
  )
}
