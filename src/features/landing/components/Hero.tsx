/**
 * Hero.tsx
 * Seção principal acima da dobra — mockup de família, headline com Reveal, CTAs
 *
 * Conecta: Reveal de @/design | ScrollIndicator renderiza inline
 * Camada: browser
 */
'use client'

import NextImage from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/design'
import { ScrollIndicator } from './ScrollIndicator'

const HERO_PRIMARY_CTA =
  'btn-terracotta-hover inline-flex items-center gap-[10px] rounded-[30px] bg-[var(--color-cta-primary)] px-8 py-4 text-[18.4px] font-semibold text-white no-underline shadow-[var(--shadow-terracotta-button)] transition-all duration-300'

const HERO_SECONDARY_CTA =
  'btn-terracotta-hover inline-flex items-center rounded-[30px] bg-[var(--color-cta-primary)] px-8 py-[15px] text-[18.4px] font-semibold text-white no-underline transition-all duration-300'

export function Hero() {
  return (
    <section className="flex w-full flex-col">
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(420px, 42vw, 760px)',
          maxHeight: '84vh',
          background: 'var(--color-green-dark)',
        }}
      >
        <NextImage
          src="/brand/photos/hero-mockup.webp"
          alt="Família conversando sobre cuidados"
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center 8%',
          }}
        />
      </div>

      <div
        style={{
          background: 'var(--color-cream)',
          padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 56px)',
          position: 'relative',
          marginTop: 'clamp(-72px, -8vw, -128px)',
          zIndex: 10,
        }}
      >
        <div
          className="landing-max grid-pillar"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.08fr) minmax(320px, 0.92fr)',
            gap: 'clamp(40px, 6vw, 80px)',
            alignItems: 'center',
          }}
        >
          <div>
            <Reveal>
              <h1
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(44px, 5.5vw, 76px)',
                  fontWeight: 500,
                  lineHeight: 1.05,
                  letterSpacing: '-0.025em',
                  color: 'var(--color-ink)',
                  margin: 0,
                  maxWidth: '12em',
                  textWrap: 'balance',
                }}
              >
                Cuidado que começa antes da urgência.
              </h1>
            </Reveal>
          </div>

          <div>
            <Reveal delay={0.1}>
              <p
                className="landing-copy-justify"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(16px, 1.45vw, 19px)',
                  lineHeight: 1.7,
                  color: 'var(--color-ink-sub)',
                  marginBottom: 40,
                  maxWidth: 520,
                }}
              >
                A Senda Sênior orienta famílias no planejamento do envelhecimento dos pais, com método, presença e dignidade.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div
                className="hero-buttons"
                style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}
              >
                <Link href="#metodologia" className={HERO_PRIMARY_CTA}>
                  Conhecer os 3 momentos
                  <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
                </Link>

                <Link href="#por-quem-viveu" className={HERO_SECONDARY_CTA}>
                  Entenda como funciona
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
      <ScrollIndicator />
    </section>
  )
}
