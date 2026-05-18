'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

import { MANUAIS } from '@/features/landing/data/fases-cuidado'

export function ManuaisSection() {
  const [active, setActive] = useState(0)
  const [isCompact, setIsCompact] = useState(false)
  const manual = MANUAIS[active]

  useEffect(() => {
    const media = window.matchMedia('(max-width: 980px)')
    const sync = () => setIsCompact(media.matches)

    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  return (
    <section
      id="manuais"
      style={{
        background: 'var(--color-cream)',
        height: isCompact ? 'auto' : '100svh',
        boxSizing: 'border-box' as const,
        display: 'flex',
        flexDirection: 'column',
        padding: isCompact
          ? 'clamp(56px, 9vw, 72px) clamp(18px, 5vw, 28px) clamp(64px, 10vw, 84px)'
          : 'clamp(16px, 3vw, 40px) clamp(20px, 5vw, 60px) clamp(12px, 2vw, 28px)',
        overflow: isCompact ? 'visible' : 'hidden',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          maxWidth: 640,
          margin: '0 auto',
          flexShrink: 0,
          marginBottom: 'clamp(16px, 2vw, 24px)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 12.65,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--color-terracotta)',
            marginBottom: 12,
          }}
        >
          Manuais Práticos
        </p>

        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(28px, 4vw, 52px)',
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
            color: 'var(--color-ink)',
            marginBottom: 12,
          }}
        >
          Guias para cada
          <br />
          etapa do cuidado.
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(14.95px, 1.265vw, 17.25px)',
            lineHeight: 1.6,
            color: 'var(--color-ink-55)',
            maxWidth: 480,
            margin: '0 auto',
          }}
        >
          Materiais claros, organizados e humanos para famílias que precisam
          tomar decisões com mais preparo.
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: isCompact ? 'flex-start' : 'center',
          alignItems: 'center',
          gap: isCompact ? 8 : 2,
          flexWrap: isCompact ? 'wrap' : 'nowrap',
          flexShrink: 0,
          marginBottom: 'clamp(12px, 2vw, 20px)',
          overflowX: isCompact ? 'auto' : 'visible',
          paddingBottom: isCompact ? 4 : 0,
        }}
      >
        {MANUAIS.map((m, i) => (
          <motion.button
            key={i}
            id={`manual-tab-${i}`}
            onClick={() => setActive(i)}
            role="tab"
            aria-selected={active === i}
            aria-controls={`manual-panel-${i}`}
            whileHover={active !== i ? { backgroundColor: 'rgba(212, 170, 106, 0.14)' } : {}}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '9px 18px',
              borderRadius: 100,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize: 16.1,
              fontWeight: active === i ? 600 : 500,
              background: 'transparent',
              color: active === i ? 'var(--color-brown-deep)' : 'var(--color-ink-50)',
              letterSpacing: '-0.01em',
              transition: 'color 0.22s ease',
              flexShrink: 0,
            }}
          >
            {active === i && (
              <motion.div
                layoutId="tab-pill"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'var(--color-gold-warm)',
                  borderRadius: 100,
                  zIndex: 0,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 32,
                  mass: 0.9,
                }}
              />
            )}

            <span
              style={{
                position: 'relative',
                zIndex: 1,
                width: 17,
                height: 17,
                borderRadius: '50%',
                border: `1.5px solid ${active === i ? 'var(--color-brown-deep)' : 'var(--color-ink-30)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 8,
                fontWeight: 700,
                color: active === i ? 'var(--color-brown-deep)' : 'var(--color-ink-40)',
                flexShrink: 0,
                lineHeight: 1,
                transition: 'border-color 0.22s ease, color 0.22s ease',
              }}
            >
              {i + 1}
            </span>

            <span style={{ position: 'relative', zIndex: 1 }}>{m.tab}</span>
          </motion.button>
        ))}
      </div>

      <div
        style={{
          position: 'relative',
          borderRadius: isCompact ? 0 : 20,
          overflow: isCompact ? 'visible' : 'hidden',
          maxWidth: 1200,
          width: '100%',
          margin: '0 auto',
          flex: isCompact ? 'unset' : 1,
          minHeight: isCompact ? 'auto' : 'clamp(280px, 45vh, 420px)',
          background: isCompact ? 'transparent' : '#1a1a1a',
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`photo-${active}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            style={
              isCompact
                ? {
                    position: 'relative',
                    width: '100%',
                    minWidth: 0,
                    boxSizing: 'border-box',
                    height: 'clamp(220px, 48vw, 320px)',
                    borderRadius: 24,
                    overflow: 'hidden',
                  }
                : { position: 'absolute', inset: 0 }
            }
          >
            <Image
              src={manual.photo}
              alt={manual.title.replace('\n', ' ')}
              fill
              sizes="(max-width: 980px) 100vw, 1200px"
              style={{
                objectFit: 'cover',
                objectPosition: isCompact ? 'center center' : 'center right',
              }}
              priority
            />
          </motion.div>
        </AnimatePresence>

        {!isCompact ? (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(90deg, var(--color-black-18) 0%, transparent 55%)',
              pointerEvents: 'none',
            }}
          />
        ) : null}

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`card-${active}`}
            role="tabpanel"
            id={`manual-panel-${active}`}
            aria-labelledby={`manual-tab-${active}`}
            initial={{ x: -24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -16, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: isCompact ? 'relative' : 'absolute',
              top: isCompact ? 'auto' : 28,
              left: isCompact ? 'auto' : 28,
              bottom: isCompact ? 'auto' : 28,
              width: isCompact ? '100%' : 'clamp(240px, 34%, 360px)',
              maxWidth: isCompact ? '100%' : undefined,
              boxSizing: 'border-box',
              background: manual.cardBg,
              borderRadius: isCompact ? '0 0 24px 24px' : 24,
              padding: isCompact ? '28px 24px 24px' : 'clamp(24px, 4vh, 48px)',
              display: 'grid',
              gridTemplateRows: '1fr auto',
              rowGap: isCompact ? 20 : 'clamp(14px, 2.4vh, 24px)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              margin: isCompact ? '-36px 0 0' : 0,
              boxShadow: isCompact ? '0 22px 50px rgba(42, 37, 32, 0.14)' : 'none',
            }}
          >
            <div style={{ minHeight: 0 }}>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 11.5,
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: manual.labelColor,
                  marginBottom: 14,
                }}
              >
                Manual
              </p>

              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: isCompact ? 'clamp(34px, 10vw, 44px)' : 'clamp(30px, 4.4vh, 46px)',
                  fontWeight: 400,
                  lineHeight: 1.03,
                  color: manual.titleColor,
                  marginBottom: 'clamp(20px, 3vh, 28px)',
                  whiteSpace: 'pre-line',
                }}
              >
                {manual.title}
              </h3>

              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: isCompact ? 'clamp(17px, 4.5vw, 19px)' : 'clamp(14.95px, 1.8vh, 18.4px)',
                  fontWeight: 700,
                  lineHeight: 1.35,
                  color: manual.taglineColor,
                  marginBottom: 12,
                }}
              >
                {manual.tagline}
              </p>

              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: isCompact ? 15.25 : 'clamp(12.65px, 1.035vw, 14.95px)',
                  lineHeight: 1.6,
                  color: manual.descColor,
                }}
              >
                {manual.desc}
              </p>
            </div>

            <a
              href={manual.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: manual.btnBg,
                color: manual.btnColor,
                padding: isCompact ? '14px 22px' : '11px 22px',
                borderRadius: 100,
                fontSize: isCompact ? 15.5 : 14.95,
                fontWeight: 600,
                fontFamily: 'var(--font-sans)',
                textDecoration: 'none',
                transition: 'opacity 0.2s, transform 0.2s',
                alignSelf: isCompact ? 'stretch' : 'flex-start',
                letterSpacing: '0.01em',
              }}
            >
              Comprar manual
            </a>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
