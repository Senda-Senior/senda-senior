'use client'

import { motion } from 'framer-motion'
import NextImage from 'next/image'

import { FOUNDERS, FOUNDER_PHOTOS, type Founder } from '@/features/landing/data/por-quem-viveu'

/* ─── Animation variants ────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const stagger = {
  show: { transition: { staggerChildren: 0.12 } },
}

/* ─── Founder card ──────────────────────────────────────────────────── */

function FounderCard({ name, role, bio, reverse }: Founder) {
  const photo = FOUNDER_PHOTOS[name]
  return (
    <motion.div
      variants={fadeUp}
      style={{
        display: 'grid',
        gridTemplateColumns: reverse ? '55fr 45fr' : '45fr 55fr',
        borderRadius: 20,
        overflow: 'hidden',
        background: 'var(--color-gold-beige)',
        minHeight: 'clamp(240px, 30vh, 320px)',
      }}
    >
      {!reverse && (
        <div style={{ position: 'relative', minHeight: 240 }}>
          <NextImage
            src={photo}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
          />
        </div>
      )}

      {/* Text */}
      <div
        style={{
          padding: 'clamp(28px, 4vw, 44px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            // Large bold bio text — matches reference
            fontSize: 'clamp(19.55px, 2.185vw, 25.3px)',
            fontWeight: 700,
            lineHeight: 1.45,
            color: 'var(--color-ink)',
            marginBottom: 20,
          }}
        >
          {bio}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 17.25,
            fontWeight: 600,
            color: 'var(--color-terracotta)',
            marginBottom: 3,
          }}
        >
          {name}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 14.95,
            color: 'rgba(40, 42, 40, 0.48)',
          }}
        >
          {role}
        </p>
      </div>

      {reverse && (
        <div style={{ position: 'relative', minHeight: 240 }}>
          <NextImage
            src={photo}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
          />
        </div>
      )}
    </motion.div>
  )
}

/* ─── Component ─────────────────────────────────────────────────────── */

export function PorQuemViveu() {
  return (
    <section
      id="por-quem-viveu"
      style={{
        background: 'var(--color-cream)',
        width: '100%',
        padding: 'clamp(60px, 8vw, 96px) clamp(24px, 6vw, 80px)',
      }}
    >
      {/* maxWidth: 860 — matches reference column width */}
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* ── Header — fade+rise stagger ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-8%' }}
          style={{
            marginBottom: 'clamp(32px, 4vw, 48px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 12.65,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--color-terracotta)',
            }}
          >
            Por quem viveu
          </motion.p>

          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(32px, 4.5vw, 52px)',
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: 'var(--color-ink)',
              textWrap: 'balance',
            }}
          >
            Aqui, ninguém fala de cuidado sem tê-lo vivido.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(16.1px, 1.3225vw, 18.4px)',
              lineHeight: 1.7,
              color: 'rgba(40, 42, 40, 0.58)',
              maxWidth: 480,
            }}
          >
            A Senda Sênior nasceu da vivência real de mulheres que acompanharam de
            perto o envelhecimento de suas mães. Essa experiência se
            transformou em método, manuais e consultoria para famílias que
            querem se preparar, não improvisar.
          </motion.p>
        </motion.div>

        {/* ── Founder cards ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-5%' }}
          style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          {FOUNDERS.map((f) => (
            <FounderCard key={f.name} {...f} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
