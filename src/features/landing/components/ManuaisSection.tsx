'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

import { MANUAIS } from '@/features/landing/data/fases-cuidado'

/* ─── Component ─────────────────────────────────────────────────────── */

export function ManuaisSection() {
  const [active, setActive] = useState(0)
  const manual = MANUAIS[active]

  return (
    <section
      id="manuais"
      style={{
        background: 'var(--color-cream)',
        height: '100svh',
        boxSizing: 'border-box' as const,
        display: 'flex',
        flexDirection: 'column',
        padding: 'clamp(16px, 3vw, 40px) clamp(20px, 5vw, 60px) clamp(12px, 2vw, 28px)',
        overflow: 'hidden',
      }}
    >
      {/* ── Header ── */}
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
          Guias para cada<br />
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

      {/* ── Tab Selector ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          flexShrink: 0,
          marginBottom: 'clamp(12px, 2vw, 20px)',
        }}
      >
        {MANUAIS.map((m, i) => (
          <motion.button
            key={i}
            onClick={() => setActive(i)}
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

            <span style={{ position: 'relative', zIndex: 1 }}>
              {m.tab}
            </span>
          </motion.button>
        ))}
      </div>


      {/* ── Banner — fills remaining vertical space ── */}
      <div
        style={{
          position: 'relative',
          borderRadius: 20,
          overflow: 'hidden',
          maxWidth: 1200,
          width: '100%',
          margin: '0 auto',
          flex: 1,
          minHeight: 'clamp(280px, 45vh, 420px)',
          background: '#1a1a1a',
        }}
      >
        {/* Photo layer — crossfade on tab change */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`photo-${active}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <Image
              src={manual.photo}
              alt={manual.title.replace('\n', ' ')}
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              style={{ objectFit: 'cover', objectPosition: 'center right' }}
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Subtle left gradient so card reads cleanly over photo */}
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

        {/* Left overlay card — slides on tab change */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`card-${active}`}
            initial={{ x: -24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -16, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: 'absolute',
              top: 28,
              left: 28,
              bottom: 28,
              width: 'clamp(240px, 34%, 360px)',
              background: manual.cardBg,
              borderRadius: 20,
              padding: 'clamp(24px, 4vh, 48px)',
              display: 'grid',
              gridTemplateRows: '1fr auto',
              rowGap: 'clamp(14px, 2.4vh, 24px)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            <div
              style={{
                minHeight: 0,
              }}
            >
              {/* MANUAL label */}
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 11.5,
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: manual.labelColor,
                  marginBottom: 14,
                  alignSelf: 'start',
                }}
              >
                Manual
              </p>

              {/* Title */}
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(30px, 4.4vh, 46px)',
                  fontWeight: 400,
                  lineHeight: 1.03,
                  color: manual.titleColor,
                  marginBottom: 'clamp(20px, 3vh, 28px)',
                  whiteSpace: 'pre-line',
                  alignSelf: 'start',
                }}
              >
                {manual.title}
              </h3>

              {/* Tagline */}
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(14.95px, 1.8vh, 18.4px)',
                  fontWeight: 700,
                  lineHeight: 1.35,
                  color: manual.taglineColor,
                  marginBottom: 12,
                  alignSelf: 'start',
                }}
              >
                {manual.tagline}
              </p>

              {/* Description */}
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(12.65px, 1.035vw, 14.95px)',
                  lineHeight: 1.6,
                  color: manual.descColor,
                  alignSelf: 'start',
                }}
              >
                {manual.desc}
              </p>
            </div>

            {/* CTA */}
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
                padding: '11px 22px',
                borderRadius: 100,
                fontSize: 14.95,
                fontWeight: 600,
                fontFamily: 'var(--font-sans)',
                textDecoration: 'none',
                transition: 'opacity 0.2s, transform 0.2s',
                alignSelf: 'flex-start',
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
