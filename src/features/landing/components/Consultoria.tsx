'use client'

/* eslint-disable @next/next/no-img-element */

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

/* ─── Feature list data ─────────────────────────────────────────────── */

const SERVICOS = [
  {
    icon: '/icons/brand/target.svg',
    title: 'Diagnóstico da fase atual',
    desc: 'Entendemos onde sua família está hoje.',
  },
  {
    icon: '/icons/brand/tasks.svg',
    title: 'Organização das necessidades',
    desc: 'Mapeamos prioridades e recursos disponíveis.',
  },
  {
    icon: '/icons/brand/roadmap.svg',
    title: 'Plano de ação familiar',
    desc: 'Construímos um roteiro possível e realista.',
  },
  {
    icon: '/icons/brand/calendar-days.svg',
    title: 'Acompanhamento e próximos passos',
    desc: 'Suporte contínuo conforme a jornada evolui.',
  },
]

/* ─── Brand lineart icon — dark ink SVG inverted to white on terracotta bg ── */

function ServiceIcon({ src }: { src: string }) {
  return (
    <div
      style={{
        width: 42,
        height: 42,
        borderRadius: 8,
        background: 'var(--color-terracotta)',
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
  return (
    <section
      id="consultoria"
      style={{
        background: 'var(--color-cream)',
        height: '100svh',
        display: 'flex',
        alignItems: 'center',
        // only horizontal padding — no vertical so align-items:center has full 100svh
        padding: '0 clamp(24px, 5vw, 80px)',
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
              color: 'var(--color-terracotta)',
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
              fontStyle: 'italic',
              lineHeight: 1.08,
              letterSpacing: '-0.025em',
              color: 'var(--color-ink)',
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
              color: 'rgba(40, 42, 40, 0.58)',
              marginBottom: 44,
              maxWidth: 380,
            }}
          >
            Cada família vive o envelhecimento de um jeito. A consultoria da
            Senda Sênior ajuda a entender a fase atual, organizar prioridades e
            construir um plano possível.
          </p>

          {/* Button: terracotta, as in reference */}
          <Link
            href="#contato"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: 'var(--color-terracotta)',
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
            Agendar uma conversa <ArrowRight size={15} strokeWidth={2} />
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
              background: 'rgba(180, 120, 90, 0.3)',
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
                      color: 'var(--color-ink)',
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
                      color: 'rgba(40, 42, 40, 0.5)',
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
