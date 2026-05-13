'use client'

/* eslint-disable @next/next/no-img-element */

import { Reveal } from '@/design'

import { CARDS } from '@/features/landing/data/fundadoras-strip'

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
        className="landing-max grid-pillar"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.02fr) minmax(0, 0.98fr)',
          gap: 'clamp(48px, 6vw, 80px)',
          alignItems: 'center',
        }}
      >
        {/* Lado Esquerdo: Texto */}
        <div style={{ maxWidth: 620 }}>
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
                marginBottom: 40,
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
              className="landing-copy-justify"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(17.25px, 1.495vw, 18.4px)',
                lineHeight: 1.7,
                color: 'var(--color-ink-sub)',
                marginBottom: 36,
                maxWidth: 600,
              }}
            >
              A Senda Sênior nasceu da vivência real de mulheres que acompanharam de perto o envelhecimento de suas mães. Essa experiência se transformou em método, manuais e consultoria para famílias que querem se preparar, não improvisar.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div>
              <div
                style={{
                  width: 36,
                  height: 2,
                  background: 'var(--color-terracotta)',
                  borderRadius: 1,
                  marginBottom: 14,
                }}
              />
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
            </div>
          </Reveal>
        </div>

        {/* Lado Direito: Grid de Cards 2x2 */}
        <div
          className="cards-grid"
          style={{ gap: 18 }}
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
          {CARDS.map((card, i) => {
            return (
              <Reveal key={i} delay={0.1 + i * 0.05}>
                <div
                  style={{
                    background: card.bg,
                    borderRadius: 18,
                    padding: '30px clamp(22px, 2vw, 28px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 18,
                    height: '100%',
                    minHeight: 214,
                    boxShadow: '0 18px 42px rgba(42, 37, 32, 0.08)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src={card.icon}
                      alt=""
                      aria-hidden
                      width={42}
                      height={42}
                      style={{
                        width: 42,
                        height: 42,
                        display: 'block',
                      }}
                    />
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
                        lineHeight: 1.5,
                        color: 'var(--color-ink-sub)',
                        opacity: 0.9,
                      }}
                    >
                      {card.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
