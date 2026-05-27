'use client'

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { SERVICOS } from '@/features/landing/data/consultoria'
import { listenMediaQuery } from '@/lib/utils/mediaQuery'

const LANDSCAPE_MOBILE_QUERY = '(orientation: landscape) and (max-height: 500px)'

function getInitialLandscapeMobile() {
  return typeof window !== 'undefined' && window.matchMedia(LANDSCAPE_MOBILE_QUERY).matches
}

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

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
  const [isLandscapeMobile, setIsLandscapeMobile] = useState(getInitialLandscapeMobile)

  useEffect(() => {
    const mq = window.matchMedia(LANDSCAPE_MOBILE_QUERY)
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsLandscapeMobile(e.matches)
    return listenMediaQuery(mq, handler)
  }, [])

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
            Senda SÊNIOR ajuda a entender a fase atual, organizar prioridades e
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
