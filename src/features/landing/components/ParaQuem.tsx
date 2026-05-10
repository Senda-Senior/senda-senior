'use client'

import { Reveal } from '@/design'
import { BrandClusterImage, BrandStar, StarCluster } from '@/features/landing/shared/BrandStar'
import { QuoteMark, SectionDivider } from '@/features/landing/shared/BrandDecorative'
import { PROFILES } from '@/features/landing/data/para-quem'

export function ParaQuem() {
  return (
    <section style={{
      padding: 'clamp(100px, 12vw, 180px) clamp(20px, 4vw, 60px)',
      background: 'var(--color-cream)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Padrão visual sutil — estrela claro (design folder) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: "url('/brand/pattern-estrela-greenmono-claro.png')",
          backgroundSize: '900px auto',
          backgroundRepeat: 'repeat',
          pointerEvents: 'none',
        }}
      />

      {/* Estrela decorativa */}
      <div style={{ position: 'absolute', bottom: '5%', right: '-3%', opacity: 0.04, zIndex: 0 }}>
        <BrandStar size={350} color="var(--color-green)" />
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: 'clamp(60px, 8vw, 100px)' }}>
          <Reveal>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <StarCluster size={24} style={{ opacity: 0.5 }} />
              <p className="label-premium">Para quem é</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 style={{
              fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px, 4.5vw, 56px)',
              fontWeight: 500, lineHeight: 1.1, color: 'var(--color-ink)',
              letterSpacing: '-0.02em', maxWidth: 600, marginBottom: 32,
            }}>
              Reconheceu algum desses momentos?
            </h2>
            <SectionDivider color="var(--color-terracotta)" />
          </Reveal>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {PROFILES.map((p, i) => (
            <Reveal key={i} delay={0.1 + i * 0.1}>
              <div style={{
                padding: 'clamp(32px, 4vw, 48px) 0',
                borderBottom: i < PROFILES.length - 1 ? '1px solid rgba(42,37,32,0.08)' : 'none',
                display: 'flex', alignItems: 'baseline', gap: 'clamp(20px, 3vw, 40px)',
              }}>
                <span style={{
                  fontFamily: 'var(--font-serif)', fontSize: 'clamp(40px, 5vw, 64px)',
                  fontWeight: 500, color: 'var(--color-green)', opacity: 0.15, lineHeight: 1,
                  flexShrink: 0,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p style={{
                  fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                  fontSize: 'clamp(22px, 2.8vw, 32px)', lineHeight: 1.4,
                  color: 'var(--color-ink)', fontWeight: 400,
                }}>{p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Depoimento() {
  return (
    <div
      style={{
        padding: 'clamp(88px, 11vw, 136px) 0',
        background: 'var(--color-green-dark)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          background:
            'radial-gradient(ellipse 90% 65% at 50% 12%, rgba(255,255,255,0.07) 0%, transparent 52%), radial-gradient(ellipse 75% 50% at 50% 108%, rgba(0,0,0,0.2) 0%, transparent 48%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          opacity: 0.34,
          backgroundImage: "url('/brand/pattern-estrela-vt-escuro.png')",
          backgroundSize: '640px auto',
          backgroundRepeat: 'repeat',
          mixBlendMode: 'soft-light',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.08,
          pointerEvents: 'none',
          zIndex: 2,
        }}
        aria-hidden
      >
        <BrandClusterImage
          widthPx={800}
          style={{ width: 'min(140vw, 800px)', height: 'auto' }}
        />
      </div>

      <div className="landing-max" style={{ position: 'relative', zIndex: 3 }}>
        <Reveal>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 36,
            }}
          >
            <QuoteMark
              color="var(--color-cream)"
              style={{
                opacity: 0.8,
                width: 'clamp(50px, 8vw, 70px)',
              }}
            />
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <blockquote
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(30px, 4.2vw, 56px)',
              fontWeight: 400,
              fontStyle: 'italic',
              lineHeight: 1.32,
              color: 'white',
              maxWidth: 880,
              margin: '0 auto',
              letterSpacing: '-0.015em',
              textWrap: 'balance',
            }}
          >
            &ldquo;O manual me deu clareza e coragem para conversar com minha
            mãe sobre o futuro dela — com respeito, sem drama, no jeito
            certo.&rdquo;
          </blockquote>
        </Reveal>

        <Reveal delay={0.2}>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 14,
              fontWeight: 700,
              color: 'rgba(245,240,232,0.68)',
              marginTop: 36,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
            }}
          >
            Leitora · Filha de mãe com 74 anos · Brasília
          </p>
        </Reveal>
      </div>
    </div>
  )
}
