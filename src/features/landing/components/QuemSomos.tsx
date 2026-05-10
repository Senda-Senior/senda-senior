'use client'

import NextImage from 'next/image'
import { Reveal } from '@/design'
import { BrandStar } from '@/features/landing/shared/BrandStar'
import { FUNDADORAS } from '@/features/landing/data/quem-somos'

export function QuemSomos() {
  return (
    <section
      id="sobre"
      style={{
        padding: 'clamp(100px, 12vw, 180px) clamp(20px, 4vw, 60px)',
        background: 'var(--color-cream)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.025,
          backgroundImage: "url('/brand/pattern-abstrato-greenmono-claro.png')",
          backgroundSize: '900px auto',
          backgroundRepeat: 'repeat',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}
      >
        {/* Section header */}
        <div style={{ marginBottom: 'clamp(60px, 8vw, 100px)' }}>
          <Reveal>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <BrandStar size={18} color="var(--color-terracotta)" />
              <BrandStar size={14} color="var(--color-gold)" />
              <p className="label-premium" style={{ marginLeft: 4 }}>Quem somos</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(34px, 4.2vw, 52px)',
                fontWeight: 500,
                lineHeight: 1.12,
                color: 'var(--color-ink)',
                marginBottom: 20,
                letterSpacing: '-0.02em',
                maxWidth: 680,
              }}
            >
              Nascemos da convicção de que o cuidado merece preparo, não improviso.
            </h2>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="line-terracota" />
          </Reveal>
          <Reveal delay={0.22}>
            <p
              style={{
                fontSize: 'clamp(19.55px, 2.07vw, 23px)',
                lineHeight: 1.75,
                color: 'var(--color-ink-sub)',
                maxWidth: 600,
                fontWeight: 400,
              }}
            >
              Não tratamos o envelhecimento como problema. Tratamos como uma fase
              da vida que, com organização e respeito, pode ser vivida com
              dignidade — por todos da família.
            </p>
          </Reveal>
        </div>

        {/* Founder cards — Prancheta 10 split format */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'clamp(24px, 4vw, 48px)',
          }}
          className="grid-pillar"
        >
          {FUNDADORAS.map((f, i) => (
            <Reveal key={i} delay={0.1 + i * 0.15}>
              <div
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  border: '1px solid var(--color-ink-07)',
                  boxShadow: '0 8px 32px var(--color-ink-07)',
                }}
              >
                {/* Photo — top half (Prancheta 10 style) */}
                <div
                  className="split-card-photo"
                  style={{ height: 'clamp(200px, 24vw, 320px)' }}
                >
                  <NextImage
                    src={f.photo}
                    alt={`${f.nome} — fundadora da Senda Sênior`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center top',
                      filter: 'saturate(0.85) brightness(0.9)',
                    }}
                  />
                  {/* Warm editorial overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, var(--color-ink-45) 0%, transparent 55%)',
                      pointerEvents: 'none',
                    }}
                  />
                </div>

                {/* Body — bottom half (cream + stars + text) */}
                <div className="split-card-body">
                  {/* 3-star cluster — Prancheta 10 left-side stars */}
                  <div
                    style={{
                      display: 'flex',
                      gap: 6,
                      alignItems: 'center',
                      marginBottom: 16,
                    }}
                  >
                    <BrandStar size={22} color={f.stars[0]} />
                    <BrandStar size={30} color={f.stars[1]} />
                    <BrandStar size={18} color={f.stars[2]} />
                  </div>

                  {/* Tagline — "Um guia moderno sobre afeto." energy */}
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      fontSize: 'clamp(18.4px, 1.84vw, 23px)',
                      color: 'var(--color-ink)',
                      marginBottom: 20,
                      lineHeight: 1.4,
                    }}
                  >
                    {f.tagline}
                  </p>

                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(22px, 2.4vw, 28px)',
                      fontWeight: 500,
                      color: 'var(--color-ink)',
                      marginBottom: 8,
                      lineHeight: 1.2,
                    }}
                  >
                    {f.nome}
                  </h3>

                  <p
                    style={{
                      fontSize: 13.8,
                      lineHeight: 1.65,
                      color: 'var(--color-ink-muted)',
                      marginBottom: 16,
                      fontWeight: 500,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {f.formacao}
                  </p>

                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      fontSize: 'clamp(17.25px, 1.61vw, 19.55px)',
                      lineHeight: 1.65,
                      color: 'var(--color-ink-sub)',
                      borderLeft: '2px solid var(--color-terracotta)',
                      paddingLeft: 14,
                    }}
                  >
                    {f.frase}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
