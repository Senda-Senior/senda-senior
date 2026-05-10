'use client'

import NextImage from 'next/image'

import { NAV_COLUMNS, SOCIALS } from '@/features/landing/data/footer'

/* ─── Color tokens (dark ink on gold background) ─────────────────────── */
const INK = '#2a2520'
const INK_MUTED = 'rgba(42, 37, 32, 0.58)'
const BG = '#EDCE90'

/* ─── Footer ──────────────────────────────────────────────────────────── */

export function Footer() {
  return (
    <footer
      style={{
        background: BG,
        color: INK,
        padding: 'clamp(52px, 7vw, 72px) clamp(24px, 5vw, 80px) 0',
        position: 'relative',
      }}
    >
      {/* ── Main grid: logo | explore | contato | legal | newsletter ── */}
      <div
        id="footer-grid"
        style={{
          maxWidth: 1160,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr repeat(3, auto) 1.2fr',
          gap: 'clamp(28px, 4vw, 56px)',
          alignItems: 'start',
          paddingBottom: 'clamp(40px, 5vw, 60px)',
        }}
      >
        {/* Logo + tagline */}
        <div>
          <div className="mb-[18px] h-[64px] w-[137px] overflow-hidden">
            <NextImage
              src="/brand/logo-11.png"
              alt="Senda Sênior"
              width={260}
              height={80}
              className="h-[64px] w-auto max-w-none -translate-x-[29px] object-contain object-left"
            />
          </div>
          <p className="font-sans text-[14.95px] leading-[1.65] text-[rgba(42,37,32,0.58)]">
            O cuidado que começa<br />antes da urgência.
          </p>
        </div>

        {/* Nav columns */}
        {NAV_COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="mb-[20px] font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[rgba(42,37,32,0.38)]">
              {col.title}
            </h4>
            {col.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="mb-[12px] block font-sans text-[14.95px] text-[rgba(42,37,32,0.58)] no-underline transition-[color] duration-[200ms]"
              >
                {link.label}
              </a>
            ))}
          </div>
        ))}

        {/* Newsletter + social icons */}
        <div>
          <p className="mb-[38px] font-sans text-[16.1px] font-semibold text-[#2a2520]">
            Inscreva-se no nosso Newsletter
          </p>

          {/* Input pill with integrated button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: 'min(100%, 366px)',
              height: 36,
              background: 'rgba(255, 255, 255, 0.5)',
              borderRadius: 100,
              border: '1px solid rgba(42, 37, 32, 0.12)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.35)',
              overflow: 'hidden',
              marginBottom: 20,
            }}
          >
            <input
              type="email"
              id="newsletter-email"
              name="email"
              placeholder="Enter Email address"
              aria-label="Email para newsletter"
              style={{
                flex: 1,
                minWidth: 0,
                height: '100%',
                border: 'none',
                background: 'transparent',
                padding: '0 14px',
                fontSize: 14,
                lineHeight: 1,
                color: INK,
                outline: 'none',
                fontFamily: 'var(--font-sans)',
              }}
            />
            <button
              type="submit"
              style={{
                height: 30,
                margin: 3,
                padding: '0 14px',
                border: 'none',
                borderRadius: 100,
                background: 'var(--color-terracotta)',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                whiteSpace: 'nowrap',
                fontFamily: 'var(--font-sans)',
                fontSize: 13.5,
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: '-0.01em',
              }}
            >
              Enviar →
            </button>
          </div>

          {/* Social icons */}
          <div className="flex gap-[8px]">
            {SOCIALS.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[8px] bg-[rgba(42,37,32,0.12)] text-[#2a2520] no-underline transition-[background] duration-[200ms]"
              >
                <Icon size={15} strokeWidth={1.8} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        style={{
          maxWidth: 1160,
          margin: '0 auto',
          borderTop: '1px solid rgba(42, 37, 32, 0.16)',
          padding: '18px 0 22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 13.8,
          color: INK_MUTED,
          fontFamily: 'var(--font-sans)',
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', gap: 20 }}>
          <a href="#termos" style={{ color: INK_MUTED, textDecoration: 'none' }}>
            Termos de Serviço
          </a>
          <a href="#privacidade" style={{ color: INK_MUTED, textDecoration: 'none' }}>
            Política de Privacidade
          </a>
        </div>
        <span>© 2025 Senda Sênior. Todos os direitos reservados.</span>
      </div>
    </footer>
  )
}
