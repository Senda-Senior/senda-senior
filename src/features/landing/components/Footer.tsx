'use client'

import NextImage from 'next/image'
import { Linkedin, Facebook, Instagram } from 'lucide-react'

function WhatsAppIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

/* ─── Data ────────────────────────────────────────────────────────────── */

const NAV_COLUMNS = [
  {
    title: 'EXPLORE',
    links: [
      { label: 'Sobre nós', href: '#sobre' },
      { label: 'Manuais', href: '#manuais' },
      { label: 'Serviços', href: '#servicos' },
      { label: 'Conteúdo', href: '#conteudo' },
    ],
  },
  {
    title: 'CONTATO',
    links: [
      { label: 'E-mail', href: 'mailto:contato@sendasenior.com.br' },
      { label: 'WhatsApp', href: 'https://wa.me/' }, // TODO: add real number
      { label: 'Agendar Conversa', href: '#contato' },
      { label: 'Instagram', href: '#' },
    ],
  },
  {
    title: 'LEGAL',
    links: [
      { label: 'Termos de Serviço', href: '#termos' },
      { label: 'Política de Privacidade', href: '#privacidade' },
      { label: 'Política de Cookies', href: '#cookies' },
      { label: 'Tratamento de Dados (LGPD)', href: '#lgpd' },
    ],
  },
]

const SOCIALS = [
  { Icon: Instagram, href: '#', label: 'Instagram' },
  { Icon: Linkedin, href: '#', label: 'LinkedIn' },
  { Icon: WhatsAppIcon, href: 'https://wa.me/', label: 'WhatsApp' },
  { Icon: Facebook, href: '#', label: 'Facebook' },
]

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
