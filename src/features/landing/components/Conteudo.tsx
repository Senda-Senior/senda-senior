'use client'

/* eslint-disable @next/next/no-img-element */


/* ─── Article card data ─────────────────────────────────────────────── */

const ARTIGOS = [
  {
    tag: 'FAMÍLIA',
    title: 'Como conversar com seus pais sobre o futuro sem que ninguém fuja da mesa',
    author: 'Julianne Pimentel',
    date: 'Mar 12, 2026 - 5 mins de leitura',
    bg: '#B8C9AE',
    titleColor: '#1e2e1e',
    tagColor: 'rgba(30, 46, 30, 0.6)',
    photo: '/conversa-pais.png',
  },
  {
    tag: 'ORGANIZAÇÃO',
    title: '5 documentos que toda família deveria ter prontos antes dos 70 anos dos pais',
    author: 'Luciana Moura',
    date: 'Mar 03, 2026 - 6 mins de leitura',
    bg: '#EBD197',
    titleColor: '#6B3A18',
    tagColor: 'rgba(107, 58, 24, 0.65)',
    photo: '/5-documentos.png',
  },
  {
    tag: 'MÉTODO',
    title: 'Em qual fase de cuidado sua família está?',
    author: 'Julianne Pimentel',
    date: 'Mar 19, 2026 - 4 mins de leitura',
    bg: '#EAE5D9',
    titleColor: '#2a2520',
    tagColor: 'rgba(42, 37, 32, 0.55)',
    photo: '/qual-momento.png',
  },
]

/* ─── Component ─────────────────────────────────────────────────────── */

export function Conteudo() {
  return (
    <section
      id="conteudo"
      style={{
        background: '#626853', // Match the olive green background
        height: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 clamp(20px, 5vw, 64px)',
      }}
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
              color: 'rgba(245, 240, 232, 0.6)',
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
              color: '#f6f2ea',
              letterSpacing: '-0.02em',
              maxWidth: 700,
              margin: '0 auto',
            }}
          >
            Orientações para conversas que<br />ninguém sabe como começar.
          </h2>
        </div>

        {/* ── 3-column grid ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'clamp(16px, 2vw, 24px)',
          }}
        >
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
          <button
            style={{
              background: '#C2D1B2',
              color: '#1e2e1e',
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
            }}
          >
            Ver mais &rarr;
          </button>
        </div>

      </div>
    </section>
  )
}

