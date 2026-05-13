'use client'

import NextImage from 'next/image'

import { NAV_COLUMNS, SOCIALS } from '@/features/landing/data/footer'

const FOOTER_LINK =
  'footer-link-hover mb-[12px] block font-sans text-[14.95px] text-[var(--color-ink-58)] no-underline transition-[color] duration-[200ms]'

const LEGAL_LINK =
  'text-[13.8px] text-[var(--color-ink-58)] no-underline transition-colors duration-200 hover:text-[var(--color-ink)]'

export function Footer() {
  return (
    <footer className="relative bg-[var(--color-gold-beige)] px-[clamp(24px,5vw,80px)] pt-[clamp(52px,7vw,72px)] text-[var(--color-ink)]">
      <div
        id="footer-grid"
        className="landing-max grid items-start gap-[clamp(28px,4vw,56px)] pb-[clamp(40px,5vw,60px)]"
      >
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
          <p className="font-sans text-[14.95px] leading-[1.65] text-[var(--color-ink-58)]">
            O cuidado que começa
            <br />
            antes da urgência.
          </p>
        </div>

        {NAV_COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="mb-[20px] font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-38)]">
              {col.title}
            </h4>
            {col.links.map((link) => (
              <a key={link.label} href={link.href} className={FOOTER_LINK}>
                {link.label}
              </a>
            ))}
          </div>
        ))}

        <div>
          <p className="mb-[16px] font-sans text-[16.1px] font-semibold text-[var(--color-ink)]">
            Inscreva-se no nosso Newsletter
          </p>

          <div className="mb-5 flex h-9 w-[min(100%,366px)] items-center overflow-hidden rounded-full border border-[rgba(42,37,32,0.14)] bg-[rgba(255,255,255,0.42)] shadow-[inset_0_1px_0_var(--color-white-35)]">
            <input
              type="email"
              id="newsletter-email"
              name="email"
              placeholder="Seu e-mail"
              aria-label="Email para newsletter"
              className="h-full min-w-0 flex-1 border-none bg-transparent px-[14px] font-sans text-[14px] leading-none text-[var(--color-ink)] outline-none"
            />
            <button
              type="submit"
              className="m-[3px] flex h-[30px] items-center gap-1 whitespace-nowrap rounded-full border-none bg-[var(--color-cta-brown)] px-[14px] font-sans text-[13.5px] leading-none font-bold tracking-[-0.01em] text-white"
            >
              Enviar →
            </button>
          </div>

          <div className="flex gap-2">
            {SOCIALS.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[rgba(42,37,32,0.08)] text-[var(--color-ink)] no-underline transition-[background] duration-[200ms]"
              >
                <Icon size={15} strokeWidth={1.8} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="landing-max flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-ink-16)] py-[18px] pb-[22px] font-sans text-[13.8px] text-[var(--color-ink-58)]">
        <div className="flex flex-wrap gap-5">
          <a href="/termos-de-servico" className={LEGAL_LINK}>
            Termos de Serviço
          </a>
          <a href="/politica-de-privacidade" className={LEGAL_LINK}>
            Política de Privacidade
          </a>
        </div>
        <span>© 2026 Senda Sênior. Todos os direitos reservados.</span>
      </div>
    </footer>
  )
}
