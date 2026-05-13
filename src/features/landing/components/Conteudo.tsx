'use client'

/* eslint-disable @next/next/no-img-element */

import Link from 'next/link'

import { ARTIGOS } from '@/features/landing/data/conteudo'

/* ─── Component ─────────────────────────────────────────────────────── */

export function Conteudo() {
  return (
    <section
      id="conteudo"
      className="flex flex-col items-center justify-center bg-[var(--color-sage-dark)] min-h-[100svh] px-[clamp(20px,5vw,64px)] py-16 md:py-0"
    >
      <div style={{ maxWidth: 1100, width: '100%', margin: '0 auto' }}>

        {/* ── Header ── */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 'clamp(24px, 4vw, 40px)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-cream-60)',
              marginBottom: 20,
            }}
          >
            Conteúdo
          </p>

          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(28px, 3.5vw, 44px)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: 'var(--color-cream)',
              letterSpacing: '-0.02em',
              maxWidth: 700,
              margin: '0 auto',
            }}
          >
            Orientações para conversas que<br />ninguém sabe como começar.
          </h2>
        </div>

        {/* ── 3-column grid ── */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-[clamp(16px,2vw,24px)]">
          {ARTIGOS.map((a, i) => (
            <div
              key={i}
              style={{
                background: a.bg,
                borderRadius: 12,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Image (Top Half) */}
              <div style={{ height: 220, width: '100%', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={a.photo}
                  alt={a.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                  }}
                />
              </div>

              {/* Content Area (Bottom Half) */}
              <div
                style={{
                  padding: '24px 24px 32px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                }}
              >
                {/* Tag */}
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 10,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: a.titleColor,
                    opacity: 0.7,
                    marginBottom: 10,
                  }}
                >
                  {a.tag}
                </span>

                {/* Title */}
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 17,
                    fontWeight: 700,
                    lineHeight: 1.35,
                    color: a.titleColor,
                    marginBottom: 'auto',
                  }}
                >
                  {a.title}
                </p>

                {/* Footer (Author & Date) */}
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 32, gap: 12 }}>
                  {/* Avatar Placeholder */}
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#aab6c9' }} />
                  
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700, color: a.titleColor }}>
                      {a.author}
                    </span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: a.tagColor, marginTop: 2 }}>
                      {a.date}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom Button ── */}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link
            href="/em-construcao"
            style={{
              background: 'var(--color-sage-muted)',
              color: 'var(--color-forest-dark)',
              fontFamily: 'var(--font-sans)',
              fontSize: 13,
              fontWeight: 700,
              padding: '10px 24px',
              borderRadius: 24,
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              textDecoration: 'none',
            }}
          >
            Ver mais &rarr;
          </Link>
        </div>

      </div>
    </section>
  )
}

