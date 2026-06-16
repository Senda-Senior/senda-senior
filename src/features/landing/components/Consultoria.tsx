/**
 * Consultoria.tsx
 * Seção consultoria individual — grid 42/58, editorial text esquerda + timeline serviços direita
 *
 * Conecta: SERVICOS de @/features/landing/data/consultoria | useMediaQuery de @/lib/utils/mediaQuery
 * Camada: browser
 */
'use client'

/* eslint-disable @next/next/no-img-element */

import Link from 'next/link'

import { SERVICOS } from '@/features/landing/data/consultoria'
import { useMediaQuery } from '@/lib/utils/mediaQuery'
import { WhatsAppIcon } from '../shared/WhatsAppIcon'

const LANDSCAPE_MOBILE_QUERY = '(orientation: landscape) and (max-height: 500px)'

/* ─── Brand lineart icon — dark ink SVG inverted to white on terracotta bg ── */

function ServiceIcon({ src }: { src: string }) {
  return (
    <div
      style={{
        width: 42,
        height: 42,
        borderRadius: 8,
        background: 'var(--color-olive)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* filter inverts dark ink stroke to white — renders cleanly on terracotta */}
      <img
        src={src}
        width={20}
        height={20}
        alt=""
        aria-hidden
        style={{ filter: 'brightness(0) invert(1)' }}
      />
    </div>
  )
}

/* ─── Component ─────────────────────────────────────────────────────── */

export function Consultoria() {
  const isLandscapeMobile = useMediaQuery(LANDSCAPE_MOBILE_QUERY)

  return (
    <section
      id="consultoria"
      style={{
        background: 'var(--color-warm-beige)',
        height: isLandscapeMobile ? 'auto' : '100svh',
        display: 'flex',
        alignItems: 'center',
        padding: isLandscapeMobile
          ? 'clamp(60px, 8vw, 100px) clamp(24px, 5vw, 80px)'
          : '0 clamp(24px, 5vw, 80px)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: 1160,
          margin: '0 auto',
          display: 'grid',
          // Reference: left ~42%, right ~58%
          gridTemplateColumns: '42fr 58fr',
          gap: 'clamp(60px, 8vw, 120px)',
          alignItems: 'center',
        }}
      >
        {/* ── Left: Editorial text + CTA ── */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 12.65,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--color-olive)',
              marginBottom: 24,
            }}
          >
            Consultoria Individual
          </p>

          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              // Large and dramatic — dominates the left column in reference
              fontSize: 'clamp(42px, 5.5vw, 68px)',
              fontWeight: 400,
              lineHeight: 1.08,
              letterSpacing: '-0.025em',
              color: 'var(--color-olive)',
              marginBottom: 32,
              textWrap: 'balance',
            }}
          >
            Orientação personalizada para a realidade da sua família.
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(14.95px, 1.265vw, 17.25px)',
              lineHeight: 1.7,
              color: 'var(--color-olive-72)',
              marginBottom: 44,
              maxWidth: 380,
            }}
          >
            Cada família vive o envelhecimento de um jeito. A consultoria da
            Senda Sênior ajuda a entender a fase atual, organizar prioridades e
            construir um plano possível.
          </p>

          <Link
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: 'var(--color-olive)',
              color: 'white',
              padding: '13px 26px',
              borderRadius: 100,
              fontSize: 16.1,
              fontWeight: 600,
              fontFamily: 'var(--font-sans)',
              textDecoration: 'none',
              letterSpacing: '0.01em',
              transition: 'opacity 0.2s, transform 0.2s',
            }}
          >
            Agendar uma conversa <WhatsAppIcon size={17} />
          </Link>
        </div>

        {/* ── Right: Feature list with vertical timeline ── */}
        <div style={{ position: 'relative' }}>
          {/* Vertical connecting line — runs between all 4 icons */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              // Centered on the icon (icon is 42px wide, so left = 21px - 1px = 20px)
              left: 20,
              top: 21,
              bottom: 21,
              width: 1,
              background: 'var(--color-olive-30)',
              zIndex: 0,
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(28px, 3.5vw, 40px)' }}>
            {SERVICOS.map((s, i) => (
              <div
                key={i}
                className="consultoria-step"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 20,
                }}
              >
                <ServiceIcon src={s.icon} />

                <div style={{ paddingTop: 4 }}>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'clamp(17.25px, 1.495vw, 20.7px)',
                      fontWeight: 700,
                      color: 'var(--color-olive)',
                      marginBottom: 5,
                      lineHeight: 1.25,
                    }}
                  >
                    {s.title}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'clamp(13.8px, 1.0925vw, 16.1px)',
                      color: 'var(--color-olive-65)',
                      lineHeight: 1.5,
                    }}
                  >
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
