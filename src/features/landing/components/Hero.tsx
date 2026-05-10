'use client'

import NextImage from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/design'

export function Hero() {
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      {/* ── Top part — Full width photo ── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(400px, 45vw, 850px)', // scales with width (vw) to prevent widescreen crop, up to 850px
          maxHeight: '85vh', // but never taller than the viewport
          background: 'var(--color-green-dark)',
        }}
      >
        <NextImage
          src="/brand/photos/hero-mockup.png"
          alt="Família conversando sobre cuidados"
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center 15%',
          }}
        />
      </div>

      {/* ── Bottom part — Cream content ── */}
      <div
        style={{
          background: 'var(--color-cream)',
          padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 56px)',
          position: 'relative',
          marginTop: 'clamp(-80px, -10vw, -140px)', // Puxa a faixa para cima, invadindo a foto
          zIndex: 10, // Garante que a faixa fique por cima da foto
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(40px, 6vw, 80px)',
            alignItems: 'center',
          }}
          className="grid-pillar"
        >
          {/* Left Column */}
          <div>
            <Reveal>
              <p
                className="label-premium"
                style={{ marginBottom: 24, display: 'block' }}
              >
                PLANEJAMENTO E ASSESSORIA PARA FAMÍLIAS
              </p>
            </Reveal>
            <Reveal delay={0.1}>
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

          {/* Right Column */}
          <div>
            <Reveal delay={0.2}>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(20.7px, 2.07vw, 25.3px)',
                  lineHeight: 1.6,
                  color: 'var(--color-ink-sub)',
                  marginBottom: 40,
                  maxWidth: 520,
                }}
              >
                A Senda Sênior orienta famílias no planejamento do envelhecimento dos pais — com método, presença e dignidade.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <Link
                  href="#manual"
                  className="btn-terracotta-hover"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    background: 'var(--color-terracotta)',
                    color: 'white',
                    padding: '16px 32px',
                    borderRadius: 30, // pill
                    fontSize: 18.4,
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.3s',
                  }}
                >
                  Conhecer os 3 momentos
                  <ArrowRight size={18} strokeWidth={2} />
                </Link>

                <Link
                  href="https://wa.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: 'transparent',
                    border: '1px solid var(--color-ink-40)',
                    color: 'var(--color-ink)',
                    padding: '15px 32px',
                    borderRadius: 30, // pill
                    fontSize: 18.4,
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={e => { 
                    e.currentTarget.style.background = 'var(--color-ink-05)'
                    e.currentTarget.style.borderColor = 'var(--color-ink)'
                  }}
                  onMouseLeave={e => { 
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderColor = 'var(--color-ink-40)'
                  }}
                >
                  Falar no Whatsapp
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
