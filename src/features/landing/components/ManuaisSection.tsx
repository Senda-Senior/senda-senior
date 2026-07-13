/**
 * ManuaisSection.tsx
 * Seção manuais com preview — tab buttons, imagem fundo + card flutuante com detalhes editável
 *
 * Conecta: MANUAIS de @/features/landing/data/fases-cuidado | listenMediaQuery de @/lib/utils/mediaQuery
 * Camada: browser
 */
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

import { MANUAIS, SELECT_MANUAL_EVENT } from '@/features/landing/data/fases-cuidado'
import { listenMediaQuery } from '@/lib/utils/mediaQuery'

export function ManuaisSection() {
  const [active, setActive] = useState(0)
  const [isCompact, setIsCompact] = useState(false)
  const [isNotebook, setIsNotebook] = useState(false)
  const manual = MANUAIS[active]

  useEffect(() => {
    const compact = window.matchMedia('(max-width: 980px)')
    // `isNotebook` agora só afina o espaçamento do layout EMPILHADO (compact) em telas
    // baixas e largas (tablets/celular landscape). O desktop deixou de depender de altura:
    // virou grid overlay com `min-height: 100svh` + `overflow: visible`, então cresce sozinho
    // quando o conteúdo não cabe — sem `100svh` rígido nem card absoluto que cortava.
    const notebook = window.matchMedia(
      '(min-width: 769px) and (max-height: 900px)',
    )
    const sync = () => {
      setIsCompact(compact.matches)
      setIsNotebook(notebook.matches)
    }

    sync()
    const cleanupCompact = listenMediaQuery(compact, sync)
    const cleanupNotebook = listenMediaQuery(notebook, sync)
    return () => {
      cleanupCompact()
      cleanupNotebook()
    }
  }, [])

  // Pré-seleção vinda do quiz da metodologia (resultado → "Ver o manual X").
  useEffect(() => {
    const handler = (e: Event) => {
      const idx = (e as CustomEvent<number>).detail
      if (typeof idx === 'number' && idx >= 0 && idx < MANUAIS.length) {
        setActive(idx)
      }
    }
    window.addEventListener(SELECT_MANUAL_EVENT, handler)
    return () => window.removeEventListener(SELECT_MANUAL_EVENT, handler)
  }, [])

  return (
    <section
      id="manuais"
      style={{
        background: 'var(--color-cream)',
        minHeight: isCompact ? undefined : '100svh',
        boxSizing: 'border-box' as const,
        display: 'flex',
        flexDirection: 'column',
        padding:
          isCompact && isNotebook
            ? 'clamp(44px, 6vw, 60px) clamp(18px, 5vw, 28px) clamp(44px, 6vw, 64px)'
            : isCompact
              ? 'clamp(56px, 9vw, 72px) clamp(18px, 5vw, 28px) clamp(64px, 10vw, 84px)'
              : 'clamp(16px, 3vw, 40px) clamp(20px, 5vw, 60px) clamp(28px, 3vw, 48px)',
        overflow: 'visible',
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
          justifyContent: 'center',
          alignItems: 'center',
          gap: isCompact ? 8 : 2,
          flexWrap: 'wrap',
          flexShrink: 0,
          marginBottom: 'clamp(12px, 2vw, 20px)',
          overflowX: 'visible',
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
          flex: isCompact ? 'unset' : '1 0 auto',
          minHeight: isCompact ? 'auto' : 'clamp(300px, 50vh, 560px)',
          background: isCompact ? 'transparent' : '#1a1a1a',
          display: isCompact ? 'block' : 'grid',
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
                    height: isNotebook ? 'clamp(180px, 34vh, 260px)' : 'clamp(220px, 48vw, 320px)',
                    borderRadius: 24,
                    overflow: 'hidden',
                  }
                : {
                    position: 'relative',
                    gridArea: '1 / 1',
                    minWidth: 0,
                    minHeight: 0,
                  }
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
              position: 'relative',
              gridArea: '1 / 1',
              zIndex: 1,
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
              position: 'relative',
              gridArea: isCompact ? undefined : '1 / 1',
              zIndex: isCompact ? undefined : 2,
              justifySelf: isCompact ? undefined : 'start',
              alignSelf: isCompact ? undefined : 'stretch',
              width: isCompact ? '100%' : 'clamp(240px, 34%, 360px)',
              maxWidth: isCompact ? '100%' : undefined,
              boxSizing: 'border-box',
              background: manual.cardBg,
              borderRadius: isCompact ? '0 0 24px 24px' : 24,
              padding: isCompact
                ? isNotebook
                  ? '22px 22px 22px'
                  : '28px 24px 24px'
                : 'clamp(24px, 2vw, 40px)',
              display: 'grid',
              gridTemplateRows: '1fr auto',
              rowGap: isCompact ? (isNotebook ? 16 : 20) : 'clamp(16px, 1.6vw, 24px)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              margin: isCompact ? (isNotebook ? '-28px 0 0' : '-36px 0 0') : '28px 0 28px 28px',
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
                  fontSize: isCompact
                    ? 'clamp(34px, 10vw, 44px)'
                    : 'clamp(30px, 2.6vw, 44px)',
                  fontWeight: 400,
                  lineHeight: 1.03,
                  color: manual.titleColor,
                  marginBottom: 'clamp(18px, 1.8vw, 26px)',
                  whiteSpace: 'pre-line',
                }}
              >
                {manual.title}
              </h3>

              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: isCompact
                    ? 'clamp(17px, 4.5vw, 19px)'
                    : 'clamp(15px, 1.3vw, 18px)',
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

            <Link
              href={`/manuais/${manual.slug}`}
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
              Conhecer o manual
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
