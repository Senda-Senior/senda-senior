'use client'

import type { ReactNode } from 'react'
import NextImage from 'next/image'
import { Reveal } from '@/design'
import { BrandStar } from '@/features/landing/shared/BrandStar'
import { pilaresData, PATTERNS, BG } from '@/features/landing/data/pilares'

interface PilarProps {
  label: string
  title: string
  text: string
  index: number
  image: string
  imageAlt: string
  icon: ReactNode
  accentStar: string
}

function PilarSection({ label, title, text, index, image, imageAlt, icon, accentStar }: PilarProps) {
  const isEven = index % 2 === 0

  return (
    <div
      style={{
        padding: 'clamp(80px, 10vw, 140px) clamp(20px, 4vw, 60px)',
        background: BG[index],
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle brand pattern — very low opacity */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('${PATTERNS[index]}')`,
          backgroundSize: '800px auto',
          backgroundRepeat: 'repeat',
          opacity: 0.028,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(40px, 6vw, 100px)',
          alignItems: 'center',
          direction: isEven ? 'ltr' : 'rtl',
          position: 'relative',
          zIndex: 1,
        }}
        className="grid-pillar"
      >
        {/* Text column */}
        <div style={{ direction: 'ltr' }}>
          <Reveal>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <span style={{ color: 'var(--color-green)', opacity: 0.7 }}>{icon}</span>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 12.65,
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--color-green)',
                  opacity: 0.7,
                }}
              >
                {label}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(30px, 3.6vw, 48px)',
                fontWeight: 500,
                lineHeight: 1.12,
                letterSpacing: '-0.02em',
                color: 'var(--color-ink)',
                marginBottom: 24,
                maxWidth: 480,
              }}
            >
              {title}
            </h2>
          </Reveal>

          <Reveal delay={0.16}>
            <div
              style={{
                width: 40,
                height: 3,
                background: 'var(--color-terracotta)',
                borderRadius: 2,
                marginBottom: 24,
              }}
            />
          </Reveal>

          <Reveal delay={0.22}>
            <p
              style={{
                fontSize: 'clamp(19.55px, 2.07vw, 23px)',
                lineHeight: 1.75,
                color: 'var(--color-ink-sub)',
                maxWidth: 460,
                fontWeight: 400,
              }}
            >
              {text}
            </p>
          </Reveal>

          {/* Accent star — colored, not ghost */}
          <Reveal delay={0.32}>
            <div style={{ marginTop: 36, display: 'flex', gap: 6, alignItems: 'center' }}>
              <BrandStar size={22} color={accentStar} />
              <BrandStar size={16} color="var(--color-gold-light)" />
            </div>
          </Reveal>
        </div>

        {/* Photo column — editorial composition */}
        <Reveal delay={0.12}>
          <div style={{ direction: 'ltr' }}>
            <div
              style={{
                aspectRatio: '3/4',
                borderRadius: 16,
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 24px 64px rgba(42,37,32,0.14)',
              }}
            >
              <NextImage
                src={image}
                alt={imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  filter: 'saturate(0.88) brightness(0.94)',
                }}
              />
              {/* Warm overlay — editorial treatment */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(181,114,74,0.04)',
                  mixBlendMode: 'multiply',
                  pointerEvents: 'none',
                }}
              />
              {/* Bottom label — pilar identifier */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 20,
                  left: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'var(--color-cream-88)',
                  backdropFilter: 'blur(12px)',
                  padding: '8px 14px',
                  borderRadius: 8,
                }}
              >
                <BrandStar size={12} color={accentStar} />
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 12.65,
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--color-green)',
                  }}
                >
                  {label}
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}

export function Pilares() {
  return (
    <div id="metodo" style={{ scrollMarginTop: 72 }}>
      {pilaresData.map((p, i) => (
        <PilarSection key={i} index={i} {...p} />
      ))}
    </div>
  )
}
