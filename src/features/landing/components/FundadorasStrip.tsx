'use client'

/* eslint-disable @next/next/no-img-element */

import { Reveal } from '@/design'

const CARDS = [
  {
    icon: '/icons/brand/book-open.svg',
    title: 'Os manuais',
    desc: 'Guias práticos para cada momento do cuidado.',
    bg: 'var(--color-terracotta-light)',
  },
  {
    icon: '/icons/brand/heart-hand.svg',
    title: 'A assessoria personalizada',
    desc: 'Orientação individual para prioridades reais da família.',
    bg: 'var(--color-gold-light)',
  },
  {
    icon: '/icons/brand/file-content.svg',
    title: 'O repositório',
    desc: 'Documentos, organização e histórico em um só lugar.',
    bg: 'var(--color-gold-light)',
  },
  {
    icon: '/icons/brand/users.svg',
    title: 'Os parceiros',
    desc: 'Rede de cuidadores, fisioterapeutas, clínicas e ILPIs.',
    bg: 'var(--color-terracotta-light)',
  },
]

export function FundadorasStrip() {
  return (
    <section
      id="sobre"
      style={{
        background: 'var(--color-cream)',
        position: 'relative',
        overflowX: 'hidden',  // only clip horizontal overflow — vertical must be free on mobile
        padding: 'clamp(80px, 10vw, 140px) clamp(20px, 4vw, 100px)',
      }}
    >
      <div
        className="grid-pillar"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(48px, 6vw, 80px)',
          alignItems: 'center',
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        {/* Lado Esquerdo: Texto */}
        <div style={{ maxWidth: 520 }}>
          <Reveal>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 13.8,
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-terracotta)',
                marginBottom: 24,
              }}
            >
              Sobre nós
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(42px, 5vw, 68px)',
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                color: 'var(--color-ink)',
                marginBottom: 32,
                textWrap: 'balance',
              }}
            >
              Nascemos<br />
              de quem<br />
              viveu na pele.
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(17.25px, 1.495vw, 18.4px)',
                lineHeight: 1.6,
                color: 'var(--color-ink-sub)',
                marginBottom: 24,
              }}
            >
              A Senda Sênior é uma empresa de planejamento e assessoria para o envelhecimento familiar. Fundada por Luciana e Julianne — duas mulheres que viveram pessoalmente os desafios de cuidar de mães idosas — oferecemos orientação estruturada para famílias em qualquer fase do cuidado.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(17.25px, 1.495vw, 18.4px)',
                fontWeight: 600,
                lineHeight: 1.5,
                color: 'var(--color-ink)',
              }}
            >
              Somos a bússola que orienta o caminho.
            </p>
          </Reveal>
        </div>

        {/* Lado Direito: Grid de Cards 2x2 */}
        <div
          className="cards-grid"
          style={{ gap: 16 }}
        >
          <p
            style={{
              gridColumn: '1 / -1',
              fontFamily: 'var(--font-sans)',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-sub)',
              marginBottom: 4,
            }}
          >
            Nossos produtos:
          </p>
          {CARDS.map((card, i) => (
              <Reveal key={i} delay={0.1 + i * 0.05}>
                <div
                  style={{
                    background: card.bg,
                    borderRadius: 16,
                    padding: '32px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                    height: '100%',
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 8,
                    }}
                  >
                    {/* Brand lineart SVG — 24px display, viewBox 18×18, stroke-width 1 */}
                    <img src={card.icon} width={24} height={24} alt="" aria-hidden />
                  </div>
                  
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 18,
                        fontWeight: 600,
                        color: 'var(--color-ink)',
                        lineHeight: 1.25,
                        letterSpacing: '-0.01em',
                        marginBottom: 10,
                      }}
                    >
                      {card.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 14.95,
                        lineHeight: 1.45,
                        color: 'var(--color-ink-sub)',
                        opacity: 0.9,
                      }}
                    >
                      {card.desc}
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
